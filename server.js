const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');


const crypto = require('node:crypto');
const sessions = new Map();
const attempts = new Map();
const TTL = 60 * 60 * 1000;
function hashPassword(password) {
    const salt = crypto.randomBytes(16).toString('hex');
    const digest = crypto.scryptSync(password, salt, 64, { N: 32768, r: 8, p: 3, maxmem: 64 * 1024 * 1024 }).toString('hex');
    return 'scrypt
const PORT = process.env.PORT || 3000;

// Middleware
app.disable('x-powered-by');
app.use(bodyParser.json({ limit: '100kb' }));
app.use('/api', (_req, res, next) => { res.set('Cache-Control', 'no-store'); next(); });
for (const dir of ['css', 'js', 'images', 'CALCULATORS']) {
    app.use('/' + dir, express.static(path.join(__dirname, dir), { dotfiles: 'deny' }));
}
for (const page of ['FINLIT.html', 'account.html', 'information.html', 'registered_users.html', 'FinLit2025_Diagrams.html']) {
    app.get('/' + page, (_req, res) => res.sendFile(path.join(__dirname, page)));
}

// Root Route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'FINLIT.html'));
});

// Data storage paths
// Vercel serverless functions have a read-only filesystem except for /tmp
const DATA_DIR = process.env.FINLIT_DATA_DIR ? path.resolve(process.env.FINLIT_DATA_DIR) : (process.env.VERCEL ? '/tmp/data' : path.join(__dirname, 'data'));
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
        if (!process.env.FINLIT_DATA_DIR && fs.existsSync(origFile)) {
            fs.copyFileSync(origFile, USERS_FILE);
        } else {
            fs.writeFileSync(USERS_FILE, JSON.stringify({ users: [] }, null, 2));
        }
    }

    if (!fs.existsSync(CALCULATIONS_FILE)) {
        const origFile = path.join(__dirname, 'data', 'calculations.json');
        if (!process.env.FINLIT_DATA_DIR && fs.existsSync(origFile)) {
            fs.copyFileSync(origFile, CALCULATIONS_FILE);
        } else {
            fs.writeFileSync(CALCULATIONS_FILE, JSON.stringify({ calculations: [] }, null, 2));
        }
    }
} catch (e) {
    console.error('Could not initialize data files:', e);
}

// API Routes

// Register a new user
app.post('/api/users/register', limitAuth, (req, res) => {
    try {
        const { username, password } = req.body || {};
        const email = normalizeEmail(req.body?.email);
        
        if (typeof username !== 'string' || !username.trim() || username.length > 100 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 || !validPassword(password) || password.length < 12) {
            return res.status(400).json({ success: false, message: 'Valid username, email and password (minimum 12 characters) required' });
        }
        
        const usersData = JSON.parse(fs.readFileSync(USERS_FILE));
        
        // Check if email already exists
        const existingUser = usersData.users.find(user => normalizeEmail(user.email) === email);
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Email already in use' });
        }
        
        // Create new user
        const newUser = {
            id: crypto.randomUUID(),
            username,
            email,
            passwordHash: hashPassword(password),
            createdAt: new Date().toISOString()
        };
        
        usersData.users.push(newUser);
        fs.writeFileSync(USERS_FILE, JSON.stringify(usersData, null, 2));
        
        // Don't send password back to client
        res.status(201).json({ success: true, user: publicUser(newUser), token: issueSession(newUser.id) });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Login a user
app.post('/api/users/login', limitAuth, (req, res) => {
    try {
        const { password } = req.body || {};
        const email = normalizeEmail(req.body?.email);
        
        if (!email || !validPassword(password)) {
            return res.status(400).json({ success: false, message: 'Email and password are required' });
        }
        
        const usersData = JSON.parse(fs.readFileSync(USERS_FILE));
        
        // Find user by email
        const user = usersData.users.find(user => normalizeEmail(user.email) === email);
        
        if (!user || !verifyPassword(password, user)) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        
        // Don't send password back to client
        if (!user.passwordHash) {
            user.passwordHash = hashPassword(password);
            delete user.password;
            fs.writeFileSync(USERS_FILE, JSON.stringify(usersData, null, 2));
        }
        res.json({ success: true, user: publicUser(user), token: issueSession(user.id) });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// No administrator role exists; never expose other users.
app.get('/api/users', authenticate, (_req, res) => res.status(403).json({ success: false, message: 'User listing is disabled' }));
app.post('/api/users/logout', authenticate, (req, res) => {
    sessions.delete(req.sessionToken);
    res.json({ success: true });
});

// Save calculation
app.post('/api/calculations/save', authenticate, (req, res) => {
    try {
        const { userId, calculationType, calculationData } = req.body || {};
        if (userId && userId !== req.userId) return res.status(403).json({ success: false, message: 'Forbidden' });
        
        if (typeof calculationType !== 'string' || !calculationType.trim() || calculationType.length > 100 || !calculationData || typeof calculationData !== 'object') {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }
        
        const calculationsData = JSON.parse(fs.readFileSync(CALCULATIONS_FILE));
        
        const newCalculation = {
            id: crypto.randomUUID(),
            userId: req.userId,
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
app.get('/api/calculations/:userId', authenticate, (req, res) => {
    try {
        const { userId } = req.params;
        if (userId !== req.userId) return res.status(403).json({ success: false, message: 'Forbidden' });
        
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
app.delete('/api/calculations/:id', authenticate, (req, res) => {
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

module.exports = app; + salt + '
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

// Root Route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'FINLIT.html'));
});

// Data storage paths
// Vercel serverless functions have a read-only filesystem except for /tmp
const DATA_DIR = process.env.VERCEL ? '/tmp/data' : path.join(__dirname, 'data');
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

// API Routes

// Register a new user
app.post('/api/users/register', (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        if (!username || !email || !password) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }
        
        const usersData = JSON.parse(fs.readFileSync(USERS_FILE));
        
        // Check if email already exists
        const existingUser = usersData.users.find(user => user.email === email);
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Email already in use' });
        }
        
        // Create new user
        const newUser = {
            id: `user_${Date.now()}`,
            username,
            email,
            password, // In a real app, this would be hashed
            createdAt: new Date().toISOString()
        };
        
        usersData.users.push(newUser);
        fs.writeFileSync(USERS_FILE, JSON.stringify(usersData, null, 2));
        
        // Don't send password back to client
        const { password: _, ...userWithoutPassword } = newUser;
        
        res.status(201).json({ success: true, user: userWithoutPassword });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Login a user
app.post('/api/users/login', (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password are required' });
        }
        
        const usersData = JSON.parse(fs.readFileSync(USERS_FILE));
        
        // Find user by email
        const user = usersData.users.find(user => user.email === email);
        
        if (!user || user.password !== password) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        
        // Don't send password back to client
        const { password: _, ...userWithoutPassword } = user;
        
        res.json({ success: true, user: userWithoutPassword });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Get all users
app.get('/api/users', (req, res) => {
    try {
        const usersData = JSON.parse(fs.readFileSync(USERS_FILE));
        
        // Remove passwords from response
        const usersWithoutPasswords = usersData.users.map(user => {
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        });
        
        res.json({ success: true, users: usersWithoutPasswords });
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Save calculation
app.post('/api/calculations/save', (req, res) => {
    try {
        const { userId, calculationType, calculationData } = req.body;
        
        if (!userId || !calculationType || !calculationData) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }
        
        const calculationsData = JSON.parse(fs.readFileSync(CALCULATIONS_FILE));
        
        const newCalculation = {
            id: Date.now().toString(),
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
app.get('/api/calculations/:userId', (req, res) => {
    try {
        const { userId } = req.params;
        
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
app.delete('/api/calculations/:id', (req, res) => {
    try {
        const { id } = req.params;
        
        if (!id) {
            return res.status(400).json({ success: false, message: 'Calculation ID is required' });
        }
        
        const calculationsData = JSON.parse(fs.readFileSync(CALCULATIONS_FILE));
        
        const calculationIndex = calculationsData.calculations.findIndex(calc => calc.id === id);
        
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
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app; + digest;
}
function equal(a, b) {
    const x = Buffer.from(a), y = Buffer.from(b);
    return x.length === y.length && crypto.timingSafeEqual(x, y);
}
function verifyPassword(password, user) {
    if (typeof user.passwordHash === 'string') {
        const [scheme, salt, digest] = user.passwordHash.split('
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

// Root Route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'FINLIT.html'));
});

// Data storage paths
// Vercel serverless functions have a read-only filesystem except for /tmp
const DATA_DIR = process.env.VERCEL ? '/tmp/data' : path.join(__dirname, 'data');
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

// API Routes

// Register a new user
app.post('/api/users/register', (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        if (!username || !email || !password) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }
        
        const usersData = JSON.parse(fs.readFileSync(USERS_FILE));
        
        // Check if email already exists
        const existingUser = usersData.users.find(user => user.email === email);
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Email already in use' });
        }
        
        // Create new user
        const newUser = {
            id: `user_${Date.now()}`,
            username,
            email,
            password, // In a real app, this would be hashed
            createdAt: new Date().toISOString()
        };
        
        usersData.users.push(newUser);
        fs.writeFileSync(USERS_FILE, JSON.stringify(usersData, null, 2));
        
        // Don't send password back to client
        const { password: _, ...userWithoutPassword } = newUser;
        
        res.status(201).json({ success: true, user: userWithoutPassword });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Login a user
app.post('/api/users/login', (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password are required' });
        }
        
        const usersData = JSON.parse(fs.readFileSync(USERS_FILE));
        
        // Find user by email
        const user = usersData.users.find(user => user.email === email);
        
        if (!user || user.password !== password) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        
        // Don't send password back to client
        const { password: _, ...userWithoutPassword } = user;
        
        res.json({ success: true, user: userWithoutPassword });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Get all users
app.get('/api/users', (req, res) => {
    try {
        const usersData = JSON.parse(fs.readFileSync(USERS_FILE));
        
        // Remove passwords from response
        const usersWithoutPasswords = usersData.users.map(user => {
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        });
        
        res.json({ success: true, users: usersWithoutPasswords });
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Save calculation
app.post('/api/calculations/save', (req, res) => {
    try {
        const { userId, calculationType, calculationData } = req.body;
        
        if (!userId || !calculationType || !calculationData) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }
        
        const calculationsData = JSON.parse(fs.readFileSync(CALCULATIONS_FILE));
        
        const newCalculation = {
            id: Date.now().toString(),
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
app.get('/api/calculations/:userId', (req, res) => {
    try {
        const { userId } = req.params;
        
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
app.delete('/api/calculations/:id', (req, res) => {
    try {
        const { id } = req.params;
        
        if (!id) {
            return res.status(400).json({ success: false, message: 'Calculation ID is required' });
        }
        
        const calculationsData = JSON.parse(fs.readFileSync(CALCULATIONS_FILE));
        
        const calculationIndex = calculationsData.calculations.findIndex(calc => calc.id === id);
        
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
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;);
        if (scheme !== 'scrypt' || !/^[0-9a-f]{32}$/.test(salt || '') || !/^[0-9a-f]{128}$/.test(digest || '')) return false;
        const actual = crypto.scryptSync(password, salt, 64, { N: 32768, r: 8, p: 3, maxmem: 64 * 1024 * 1024 }).toString('hex');
        return equal(actual, digest);
    }
    return typeof user.password === 'string' && equal(password, user.password);
}
function publicUser(user) {
    return { id: user.id, username: user.username, email: user.email, createdAt: user.createdAt };
}
function issueSession(userId) {
    const now = Date.now();
    for (const [key, value] of sessions) if (value.expires <= now) sessions.delete(key);
    if (sessions.size >= 10000) sessions.delete(sessions.keys().next().value);
    const token = crypto.randomBytes(32).toString('hex');
    sessions.set(token, { userId, expires: now + TTL });
    return token;
}
function authenticate(req, res, next) {
    const token = /^Bearer ([0-9a-f]{64})$/.exec(req.get('Authorization') || '')?.[1];
    const session = sessions.get(token);
    if (!session || session.expires <= Date.now()) {
        if (token) sessions.delete(token);
        return res.status(401).json({ success: false, message: 'Authentication required' });
    }
    req.userId = session.userId;
    req.sessionToken = token;
    next();
}
function limitAuth(req, res, next) {
    const now = Date.now();
    for (const [key, value] of attempts) if (value.expires <= now) attempts.delete(key);
    const key = req.ip || 'unknown';
    const entry = attempts.get(key) || { count: 0, expires: now + 15 * 60 * 1000 };
    if (entry.count >= 10 || (!attempts.has(key) && attempts.size >= 10000))
        return res.status(429).json({ success: false, message: 'Try again later' });
    entry.count++;
    attempts.set(key, entry);
    next();
}
function validPassword(value) {
    return typeof value === 'string' && value.length > 0 && Buffer.byteLength(value) <= 1024;
}
function normalizeEmail(value) {
    return typeof value === 'string' ? value.trim().toLowerCase() : '';
}

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

// Root Route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'FINLIT.html'));
});

// Data storage paths
// Vercel serverless functions have a read-only filesystem except for /tmp
const DATA_DIR = process.env.VERCEL ? '/tmp/data' : path.join(__dirname, 'data');
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

// API Routes

// Register a new user
app.post('/api/users/register', (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        if (!username || !email || !password) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }
        
        const usersData = JSON.parse(fs.readFileSync(USERS_FILE));
        
        // Check if email already exists
        const existingUser = usersData.users.find(user => user.email === email);
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Email already in use' });
        }
        
        // Create new user
        const newUser = {
            id: `user_${Date.now()}`,
            username,
            email,
            password, // In a real app, this would be hashed
            createdAt: new Date().toISOString()
        };
        
        usersData.users.push(newUser);
        fs.writeFileSync(USERS_FILE, JSON.stringify(usersData, null, 2));
        
        // Don't send password back to client
        const { password: _, ...userWithoutPassword } = newUser;
        
        res.status(201).json({ success: true, user: userWithoutPassword });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Login a user
app.post('/api/users/login', (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password are required' });
        }
        
        const usersData = JSON.parse(fs.readFileSync(USERS_FILE));
        
        // Find user by email
        const user = usersData.users.find(user => user.email === email);
        
        if (!user || user.password !== password) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        
        // Don't send password back to client
        const { password: _, ...userWithoutPassword } = user;
        
        res.json({ success: true, user: userWithoutPassword });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Get all users
app.get('/api/users', (req, res) => {
    try {
        const usersData = JSON.parse(fs.readFileSync(USERS_FILE));
        
        // Remove passwords from response
        const usersWithoutPasswords = usersData.users.map(user => {
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        });
        
        res.json({ success: true, users: usersWithoutPasswords });
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Save calculation
app.post('/api/calculations/save', (req, res) => {
    try {
        const { userId, calculationType, calculationData } = req.body;
        
        if (!userId || !calculationType || !calculationData) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }
        
        const calculationsData = JSON.parse(fs.readFileSync(CALCULATIONS_FILE));
        
        const newCalculation = {
            id: Date.now().toString(),
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
app.get('/api/calculations/:userId', (req, res) => {
    try {
        const { userId } = req.params;
        
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
app.delete('/api/calculations/:id', (req, res) => {
    try {
        const { id } = req.params;
        
        if (!id) {
            return res.status(400).json({ success: false, message: 'Calculation ID is required' });
        }
        
        const calculationsData = JSON.parse(fs.readFileSync(CALCULATIONS_FILE));
        
        const calculationIndex = calculationsData.calculations.findIndex(calc => calc.id === id);
        
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
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;