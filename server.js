const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

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