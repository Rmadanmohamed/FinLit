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
const DATA_DIR = process.env.FINLIT_DATA_DIR || (process.env.VERCEL ? '/tmp/finlit-disabled' : path.join(__dirname, '.finlit-data'));
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const CALCULATIONS_FILE = path.join(DATA_DIR, 'calculations.json');
const SESSIONS_FILE = path.join(DATA_DIR, 'sessions.json');
const production = process.env.NODE_ENV === 'production' || Boolean(process.env.VERCEL);
const COOKIE = 'finlit_session';
const sessionTTL = 60 * 60 * 1000;
function atomicWrite(file, value) {
    const temp = file + '.' + crypto.randomUUID() + '.tmp';
    try {
        fs.writeFileSync(temp, JSON.stringify(value, null, 2), { mode: 0o600 });
        fs.renameSync(temp, file);
    } finally {
        if (fs.existsSync(temp)) fs.unlinkSync(temp);
    }
}

// Ensure data directory and files exist
if (!fs.existsSync(DATA_DIR)) {
    try {
        fs.mkdirSync(DATA_DIR, { recursive: true, mode: 0o700 });
    } catch (e) {
        console.error('Could not create data dir:', e);
    }
}

try {
    if (!fs.existsSync(USERS_FILE)) {
        fs.writeFileSync(USERS_FILE, JSON.stringify({ users: [] }, null, 2), { mode: 0o600 });
    }

    if (!fs.existsSync(SESSIONS_FILE)) {
        fs.writeFileSync(SESSIONS_FILE, JSON.stringify({ sessions: [] }), { mode: 0o600 });
    }
    if (!fs.existsSync(CALCULATIONS_FILE)) {
        fs.writeFileSync(CALCULATIONS_FILE, JSON.stringify({ calculations: [] }, null, 2), { mode: 0o600 });
    }
} catch (e) {
    console.error('Could not initialize data files:', e);
}

// Passwords use a per-user random salt and Node's memory-hard scrypt KDF.
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
// Opaque random sessions are stored as hashes, not reusable plaintext tokens.
function tokenHash(token) {
    return crypto.createHash('sha256').update(token).digest('hex');
}
function readSessions() {
    return JSON.parse(fs.readFileSync(SESSIONS_FILE, 'utf8'));
}
function issueSession(user) {
    const token = crypto.randomBytes(32).toString('hex');
    const sessions = readSessions();
    sessions.sessions = sessions.sessions.filter(item => item.expiresAt > Date.now());
    sessions.sessions.push({ hash: tokenHash(token), userId: user.id, expiresAt: Date.now() + sessionTTL });
    atomicWrite(SESSIONS_FILE, sessions);
    return token;
}
function cookieToken(req) {
    const match = /(?:^|;\s*)finlit_session=([a-f0-9]{64})(?:;|$)/.exec(req.get('Cookie') || '');
    return match ? match[1] : null;
}
function requireAuth(req, res, next) {
    try {
        const header = req.get('Authorization');
        const match = header && /^Bearer ([a-f0-9]{64})$/.exec(header);
        const token = header ? (match ? match[1] : null) : cookieToken(req);
        if (token) {
            // A non-simple header is required on cookie-authenticated writes.
            // No cross-origin CORS permission is granted.
            if (!header && !['GET', 'HEAD'].includes(req.method) && req.get('X-FinLit-Client') !== 'browser') {
                return res.status(403).json({ success: false, message: 'Invalid request origin' });
            }
            const hash = tokenHash(token);
            const session = readSessions().sessions.find(item => item.hash === hash && item.expiresAt > Date.now());
            const user = session && JSON.parse(fs.readFileSync(USERS_FILE)).users.find(item => item.id === session.userId);
            if (user) {
                req.userId = user.id;
                req.authUser = user;
                req.sessionHash = hash;
                return next();
            }
        }
    } catch (_) { /* fail closed */ }
    return res.status(401).json({ success: false, message: 'Authentication required' });
}
function authResponse(req, res, user, status) {
    const token = issueSession(user);
    if (req.get('X-FinLit-Client') === 'browser') {
        res.cookie(COOKIE, token, { httpOnly: true, sameSite: 'strict', secure: production, maxAge: sessionTTL, path: '/' });
        return res.status(status).json({ success: true, user: publicUser(user) });
    }
    return res.status(status).json({ success: true, user: publicUser(user), token });
}
// Bounded single-process rate limiter. Multi-instance deployment requires a shared limiter.
const attempts = new Map();
function limitAuth(req, res, next) {
    const now = Date.now();
    for (const [key, value] of attempts) if (value.until <= now) attempts.delete(key);
    const key = req.ip;
    const entry = attempts.get(key) || { count: 0, until: now + 60_000 };
    if (entry.count >= 10 || (!attempts.has(key) && attempts.size >= 10000)) {
        res.set('Retry-After', '60');
        return res.status(429).json({ success: false, message: 'Try again later' });
    }
    entry.count++;
    attempts.set(key, entry);
    next();
}
// File-backed authentication is deliberately unavailable in serverless environments.
// Local single-process storage is persistent; do not use it for multi-instance production.
app.use('/api', (req, res, next) => {
    if (process.env.VERCEL || (production && !process.env.FINLIT_DATA_DIR)) {
        return res.status(503).json({ success: false, message: 'Persistent single-instance storage is required' });
    }
    if (!['GET', 'HEAD', 'OPTIONS'].includes(req.method) && req.get('Sec-Fetch-Site') && !['same-origin', 'none'].includes(req.get('Sec-Fetch-Site'))) {
        return res.status(403).json({ success: false, message: 'Cross-origin request denied' });
    }
    next();
});
app.get('/api/users/me', requireAuth, (req, res) => res.json({ success: true, user: publicUser(req.authUser) }));
app.post('/api/users/logout', requireAuth, (req, res) => {
    const sessions = readSessions();
    sessions.sessions = sessions.sessions.filter(item => item.hash !== req.sessionHash);
    atomicWrite(SESSIONS_FILE, sessions);
    res.clearCookie(COOKIE, { httpOnly: true, sameSite: 'strict', secure: production, path: '/' });
    res.json({ success: true });
});

// API Routes

// Register a new user
app.post('/api/users/register', limitAuth, (req, res) => {
    try {
        const { username, email, password } = req.body || {};
        
        if (typeof username !== 'string' || !username.trim() || username.length > 200 || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) || email.length > 254 || !validPassword(password) || password.length < 8) {
            return res.status(400).json({ success: false, message: 'Valid username, email and password (at least 8 characters) are required' });
        }
        
        const usersData = JSON.parse(fs.readFileSync(USERS_FILE));
        
        // Check if email already exists
        const existingUser = usersData.users.find(user => String(user.email).toLowerCase() === email.trim().toLowerCase());
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Email already in use' });
        }
        
        // Create new user
        const newUser = {
            id: 'user_' + crypto.randomUUID(),
            username: username.trim(),
            email: email.trim().toLowerCase(),
            passwordHash: hashPassword(password),
            createdAt: new Date().toISOString()
        };
        
        usersData.users.push(newUser);
        atomicWrite(USERS_FILE, usersData);
        
        // Don't send password back to client
        return authResponse(req, res, newUser, 201);
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Login a user
app.post('/api/users/login', limitAuth, (req, res) => {
    try {
        const { email, password } = req.body || {};
        
        if (typeof email !== 'string' || !email || !validPassword(password)) {
            return res.status(400).json({ success: false, message: 'Email and password are required' });
        }
        
        const usersData = JSON.parse(fs.readFileSync(USERS_FILE));
        
        // Find user by email
        const user = usersData.users.find(user => String(user.email).toLowerCase() === email.trim().toLowerCase());
        
        if (!user || !verifyPassword(user, password)) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        
        // Don't send password back to client
        if (!user.passwordHash) {
            user.passwordHash = hashPassword(password);
            delete user.password;
            atomicWrite(USERS_FILE, usersData);
        }
        return authResponse(req, res, user, 200);
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
        const { userId, calculationType, calculationData, title } = req.body || {};
        if (userId !== req.userId) return res.status(403).json({ success: false, message: 'Access denied' });
        
        if (!['savings', 'loan', 'budget', 'goal', 'comparison'].includes(calculationType) || !calculationData || typeof calculationData !== 'object' || Array.isArray(calculationData) || (title !== undefined && (typeof title !== 'string' || title.length > 200))) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }
        
        const calculationsData = JSON.parse(fs.readFileSync(CALCULATIONS_FILE));
        
        const newCalculation = {
            id: crypto.randomUUID(),
            userId,
            calculationType,
            title: title || calculationType,
            calculationData,
            createdAt: new Date().toISOString()
        };
        
        calculationsData.calculations.push(newCalculation);
        atomicWrite(CALCULATIONS_FILE, calculationsData);
        
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
        atomicWrite(CALCULATIONS_FILE, calculationsData);
        
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