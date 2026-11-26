const express = require('express');
const crypto = require('node:crypto');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json({ limit: '64kb' }));
// Serve only public application assets, never the repository or storage directory.
for (const dir of ['css', 'js', 'images', 'CALCULATORS']) {
    app.use('/' + dir, express.static(path.join(__dirname, dir), { dotfiles: 'deny' }));
}
for (const page of ['FINLIT.html', 'account.html', 'information.html', 'registered_users.html', 'FinLit2025_Diagrams.html']) {
    app.get('/' + page, (req, res) => res.sendFile(path.join(__dirname, page)));
}
app.use('/api', (req, res, next) => {
    res.set('Cache-Control', 'no-store');
    next();
});

// Root Route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'FINLIT.html'));
});

// Data storage paths
// Vercel serverless functions have a read-only filesystem except for /tmp
const DATA_DIR = process.env.FINLIT_DATA_DIR || (process.env.VERCEL ? '/tmp/data' : path.join(__dirname, 'data'));
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const CALCULATIONS_FILE = path.join(DATA_DIR, 'calculations.json');

// Ensure data directory and files exist
if (!fs.existsSync(DATA_DIR)) {
    try {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    } catch (e) {
        console.error('Could not create data dir:', e);
    }
}

try {
    if (!fs.existsSync(USERS_FILE)) {
        // Copy from original data dir if it exists, otherwise empty
        const origFile = path.join(__dirname, 'data', 'users.json');
        if (fs.existsSync(origFile)) {
            fs.copyFileSync(origFile, USERS_FILE);
        } else {
            fs.writeFileSync(USERS_FILE, JSON.stringify({ users: [] }, null, 2));
        }
    }

    if (!fs.existsSync(CALCULATIONS_FILE)) {
        const origFile = path.join(__dirname, 'data', 'calculations.json');
        if (fs.existsSync(origFile)) {
            fs.copyFileSync(origFile, CALCULATIONS_FILE);
        } else {
            fs.writeFileSync(CALCULATIONS_FILE, JSON.stringify({ calculations: [] }, null, 2));
        }
    }
} catch (e) {
    console.error('Could not initialize data files:', e);
}

// Passwords use a per-user random salt and Node's memory-hard scrypt KDF.
const secret = process.env.FINLIT_AUTH_SECRET;
if ((process.env.VERCEL || process.env.NODE_ENV === 'production') && (!secret || Buffer.byteLength(secret) < 32)) {
    throw new Error('FINLIT_AUTH_SECRET must contain at least 32 bytes in production');
}
const signingKey = secret || crypto.randomBytes(32);
function validPassword(password) {
    return typeof password === 'string' && password.length > 0 && Buffer.byteLength(password) <= 1024;
}
function hashPassword(password) {
    const salt = crypto.randomBytes(16);
    const hash = crypto.scryptSync(password, salt, 64, { N: 32768, r: 8, p: 3, maxmem: 64 * 1024 * 1024 });
    return salt.toString('hex') + ':' + hash.toString('hex');
}
function equalText(a, b) {
    if (typeof a !== 'string' || typeof b !== 'string') return false;
    const x = Buffer.from(a), y = Buffer.from(b);
    return x.length === y.length && crypto.timingSafeEqual(x, y);
}
function verifyPassword(user, password) {
    if (!validPassword(password)) return false;
    if (typeof user.passwordHash === 'string') {
        const parts = user.passwordHash.split(':');
        if (parts.length !== 2 || !/^[a-f0-9]{32}$/.test(parts[0]) || !/^[a-f0-9]{128}$/.test(parts[1])) return false;
        const hash = crypto.scryptSync(password, Buffer.from(parts[0], 'hex'), 64, { N: 32768, r: 8, p: 3, maxmem: 64 * 1024 * 1024 });
        return crypto.timingSafeEqual(hash, Buffer.from(parts[1], 'hex'));
    }
    // Legacy records are upgraded only after successful authentication.
    return equalText(user.password, password);
}
function publicUser(user) {
    return { id: user.id, username: user.username, email: user.email, createdAt: user.createdAt };
}
function sign(payload) {
    return crypto.createHmac('sha256', signingKey).update(payload).digest('base64url');
}
function issueToken(user) {
    const payload = Buffer.from(JSON.stringify({ sub: user.id, exp: Date.now() + 60 * 60 * 1000 })).toString('base64url');
    return payload + '.' + sign(payload);
}
function requireAuth(req, res, next) {
    try {
        const header = req.get('Authorization') || '';
        const match = /^Bearer ([A-Za-z0-9_-]+)\.([A-Za-z0-9_-]+)$/.exec(header);
        if (match && equalText(sign(match[1]), match[2])) {
            const claims = JSON.parse(Buffer.from(match[1], 'base64url').toString('utf8'));
            if (typeof claims.sub === 'string' && Number.isFinite(claims.exp) && claims.exp > Date.now()) {
                const users = JSON.parse(fs.readFileSync(USERS_FILE)).users;
                if (users.some(user => user.id === claims.sub)) {
                    req.userId = claims.sub;
                    return next();
                }
            }
        }
    } catch (_) { /* reject malformed or unverifiable credentials */ }
    return res.status(401).json({ success: false, message: 'Authentication required' });
}

// API Routes

// Register a new user
app.post('/api/users/register', (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        if (typeof username !== 'string' || !username.trim() || username.length > 200 || typeof email !== 'string' || !email.trim() || email.length > 254 || !validPassword(password) || password.length < 8) {
            return res.status(400).json({ success: false, message: 'Valid username, email and password (at least 8 characters) are required' });
        }
        
        const usersData = JSON.parse(fs.readFileSync(USERS_FILE));
        
        // Check if email already exists
        const existingUser = usersData.users.find(user => user.email === email);
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Email already in use' });
        }
        
        // Create new user
        const newUser = {
            id: 'user_' + crypto.randomUUID(),
            username,
            email,
            passwordHash: hashPassword(password),
            createdAt: new Date().toISOString()
        };
        
        usersData.users.push(newUser);
        fs.writeFileSync(USERS_FILE, JSON.stringify(usersData, null, 2));
        
        // Don't send password back to client
        res.status(201).json({ success: true, user: publicUser(newUser), token: issueToken(newUser) });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Login a user
app.post('/api/users/login', (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (typeof email !== 'string' || !email || !validPassword(password)) {
            return res.status(400).json({ success: false, message: 'Email and password are required' });
        }
        
        const usersData = JSON.parse(fs.readFileSync(USERS_FILE));
        
        // Find user by email
        const user = usersData.users.find(user => user.email === email);
        
        if (!user || !verifyPassword(user, password)) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        
        // Don't send password back to client
        if (!user.passwordHash) {
            user.passwordHash = hashPassword(password);
            delete user.password;
            fs.writeFileSync(USERS_FILE, JSON.stringify(usersData, null, 2));
        }
        res.json({ success: true, user: publicUser(user), token: issueToken(user) });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// No administrative role is defined; do not expose other users' records.
app.get('/api/users', requireAuth, (req, res) => {
    res.status(403).json({ success: false, message: 'User directory is restricted' });
});

// Save calculation
app.post('/api/calculations/save', requireAuth, (req, res) => {
    try {
        const { userId, calculationType, calculationData } = req.body;
        if (userId !== req.userId) return res.status(403).json({ success: false, message: 'Access denied' });
        
        if (!userId || !calculationType || !calculationData) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }
        
        const calculationsData = JSON.parse(fs.readFileSync(CALCULATIONS_FILE));
        
        const newCalculation = {
            id: crypto.randomUUID(),
            userId,
            calculationType,
            calculationData,
            createdAt: new Date().toISOString()
        };
        
        calculationsData.calculations.push(newCalculation);
        fs.writeFileSync(CALCULATIONS_FILE, JSON.stringify(calculationsData, null, 2));
        
        res.status(201).json({ success: true, calculation: newCalculation });
    } catch (error) {
        console.error('Save calculation error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Get user's calculations
app.get('/api/calculations/:userId', requireAuth, (req, res) => {
    try {
        const { userId } = req.params;
        if (userId !== req.userId) return res.status(403).json({ success: false, message: 'Access denied' });
        
        if (!userId) {
            return res.status(400).json({ success: false, message: 'User ID is required' });
        }
        
        const calculationsData = JSON.parse(fs.readFileSync(CALCULATIONS_FILE));
        
        const userCalculations = calculationsData.calculations.filter(calc => calc.userId === userId);
        
        res.json({ success: true, calculations: userCalculations });
    } catch (error) {
        console.error('Get calculations error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Delete calculation
app.delete('/api/calculations/:id', requireAuth, (req, res) => {
    try {
        const { id } = req.params;
        
        if (!id) {
            return res.status(400).json({ success: false, message: 'Calculation ID is required' });
        }
        
        const calculationsData = JSON.parse(fs.readFileSync(CALCULATIONS_FILE));
        
        const calculationIndex = calculationsData.calculations.findIndex(calc => calc.id === id && calc.userId === req.userId);
        
        if (calculationIndex === -1) {
            return res.status(404).json({ success: false, message: 'Calculation not found' });
        }
        
        calculationsData.calculations.splice(calculationIndex, 1);
        fs.writeFileSync(CALCULATIONS_FILE, JSON.stringify(calculationsData, null, 2));
        
        res.json({ success: true, message: 'Calculation deleted successfully' });
    } catch (error) {
        console.error('Delete calculation error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Start server (only if not running on Vercel)
if (require.main === module && !process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;