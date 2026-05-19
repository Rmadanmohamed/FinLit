/**
 * Digital Financial Literacy & Inclusion Platform
 * User Registration and Management
 */

class AuthManager {
    constructor() {
        this.currentUser = null;
        this.authListeners = [];
        this.usersKey = 'finlit_users';
        this.currentUserKey = 'finlit_current_user';
        
        // Load current user from localStorage if available
        this.loadCurrentUser();
    }
    
    /**
     * Register a new user
     */
    register(username, email, password) {
        return new Promise((resolve, reject) => {
            // Check if email already exists
            const users = this.getAllUsers();
            const existingUser = users.find(user => user.email === email);
            
            if (existingUser) {
                reject(new Error('Email already registered'));
                return;
            }
            
            // Create new user
            const newUser = {
                id: this.generateUserId(),
                username,
                email,
                password: this.hashPassword(password), // In a real app, use proper hashing
                createdAt: new Date().toISOString(),
                savedCalculations: []
            };
            
            // Add to users array
            users.push(newUser);
            
            // Save to localStorage
            localStorage.setItem(this.usersKey, JSON.stringify(users));
            
            // Save to registered_users.html
            this.saveToRegisteredUsers(newUser);
            
            // Set as current user
            this.setCurrentUser(newUser);
            
            resolve(newUser);
        });
    }
    
    /**
     * Save user to registered_users.html
     */
    saveToRegisteredUsers(user) {
        // This would typically be a server-side operation
        // For this demo, we'll use localStorage to simulate
        const registeredUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
        
        // Add new user to the array
        registeredUsers.push({
            username: user.username,
            email: user.email,
            date: user.createdAt
        });
        
        // Save back to localStorage
        localStorage.setItem('registered_users', JSON.stringify(registeredUsers));
    }
    
    /**
     * Login a user
     */
    login(email, password) {
        return new Promise((resolve, reject) => {
            const users = this.getAllUsers();
            const user = users.find(user => user.email === email);
            
            if (!user) {
                reject(new Error('User not found'));
                return;
            }
            
            if (user.password !== this.hashPassword(password)) {
                reject(new Error('Incorrect password'));
                return;
            }
            
            this.setCurrentUser(user);
            resolve(user);
        });
    }
    
    /**
     * Logout the current user
     */
    logout() {
        localStorage.removeItem(this.currentUserKey);
        this.currentUser = null;
        this.notifyAuthListeners();
    }
    
    /**
     * Get all registered users
     */
    getAllUsers() {
        const usersJson = localStorage.getItem(this.usersKey);
        return usersJson ? JSON.parse(usersJson) : [];
    }
    
    /**
     * Get all registered users for display
     */
    getRegisteredUsers() {
        const registeredUsersJson = localStorage.getItem('registered_users');
        return registeredUsersJson ? JSON.parse(registeredUsersJson) : [];
    }
    
    /**
     * Set current user and notify listeners
     */
    setCurrentUser(user) {
        // Remove password before storing in localStorage
        const userToStore = { ...user };
        delete userToStore.password;
        
        localStorage.setItem(this.currentUserKey, JSON.stringify(userToStore));
        this.currentUser = userToStore;
        this.notifyAuthListeners();
    }
    
    /**
     * Load current user from localStorage
     */
    loadCurrentUser() {
        const userJson = localStorage.getItem(this.currentUserKey);
        if (userJson) {
            this.currentUser = JSON.parse(userJson);
            this.notifyAuthListeners();
        }
    }
    
    /**
     * Add auth state change listener
     */
    addAuthListener(listener) {
        this.authListeners.push(listener);
        // Notify immediately with current state
        listener(this.currentUser);
    }
    
    /**
     * Notify all auth listeners
     */
    notifyAuthListeners() {
        this.authListeners.forEach(listener => {
            listener(this.currentUser);
        });
    }
    
    /**
     * Generate a unique user ID
     */
    generateUserId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
    
    /**
     * Hash password (simplified for demo)
     * In a real app, use a proper hashing algorithm
     */
    hashPassword(password) {
        // This is NOT secure, just for demo purposes
        return btoa(password);
    }
}

/**
 * Database Manager for handling user data and calculations
 */
class DatabaseManager {
    constructor(authManager) {
        this.authManager = authManager;
        this.calculationsKey = 'finlit_calculations';
    }
    
    /**
     * Save a calculation for the current user
     */
    saveCalculation(calculationType, title, data) {
        return new Promise((resolve, reject) => {
            const currentUser = this.authManager.currentUser;
            
            if (!currentUser) {
                reject(new Error('User not logged in'));
                return;
            }
            
            // Get all users
            const users = this.authManager.getAllUsers();
            const userIndex = users.findIndex(user => user.id === currentUser.id);
            
            if (userIndex === -1) {
                reject(new Error('User not found'));
                return;
            }
            
            // Create calculation object
            const calculation = {
                id: this.generateCalculationId(),
                type: calculationType,
                title,
                data,
                createdAt: new Date().toISOString()
            };
            
            // Add to user's saved calculations
            if (!users[userIndex].savedCalculations) {
                users[userIndex].savedCalculations = [];
            }
            
            users[userIndex].savedCalculations.push(calculation);
            
            // Update localStorage
            localStorage.setItem(this.authManager.usersKey, JSON.stringify(users));
            
            // Update current user
            this.authManager.setCurrentUser(users[userIndex]);
            
            resolve(calculation);
        });
    }
    
    /**
     * Get all saved calculations for the current user
     */
    getSavedCalculations() {
        return new Promise((resolve, reject) => {
            const currentUser = this.authManager.currentUser;
            
            if (!currentUser) {
                reject(new Error('User not logged in'));
                return;
            }
            
            // Get all users to ensure we have the latest data
            const users = this.authManager.getAllUsers();
            const user = users.find(user => user.id === currentUser.id);
            
            if (!user) {
                reject(new Error('User not found'));
                return;
            }
            
            resolve(user.savedCalculations || []);
        });
    }
    
    /**
     * Delete a saved calculation
     */
    deleteCalculation(calculationId) {
        return new Promise((resolve, reject) => {
            const currentUser = this.authManager.currentUser;
            
            if (!currentUser) {
                reject(new Error('User not logged in'));
                return;
            }
            
            // Get all users
            const users = this.authManager.getAllUsers();
            const userIndex = users.findIndex(user => user.id === currentUser.id);
            
            if (userIndex === -1) {
                reject(new Error('User not found'));
                return;
            }
            
            // Find and remove the calculation
            const calculationIndex = users[userIndex].savedCalculations.findIndex(
                calc => calc.id === calculationId
            );
            
            if (calculationIndex === -1) {
                reject(new Error('Calculation not found'));
                return;
            }
            
            users[userIndex].savedCalculations.splice(calculationIndex, 1);
            
            // Update localStorage
            localStorage.setItem(this.authManager.usersKey, JSON.stringify(users));
            
            // Update current user
            this.authManager.setCurrentUser(users[userIndex]);
            
            resolve();
        });
    }
    
    /**
     * Generate a unique calculation ID
     */
    generateCalculationId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
}

// Initialize auth and database managers
document.addEventListener('DOMContentLoaded', function() {
    // Initialize registration preview functionality
    initRegistrationPreview();
});

/**
 * Initialize registration preview functionality
 */
function initRegistrationPreview() {
    const registerForm = document.getElementById('register-form');
    const registerUsername = document.getElementById('register-username');
    const registerEmail = document.getElementById('register-email');
    const registerPassword = document.getElementById('register-password');
    const registerConfirmPassword = document.getElementById('register-confirm-password');
    const registerMessage = document.getElementById('register-message');
    
    if (!registerForm) return;
    
    // Create registration preview container if it doesn't exist
    let previewContainer = document.querySelector('.registration-preview');
    if (!previewContainer) {
        previewContainer = document.createElement('div');
        previewContainer.className = 'registration-preview';
        previewContainer.innerHTML = `
            <h3 class="preview-title"><i class="fas fa-user-check"></i> Registration Preview</h3>
            <div class="preview-data">
                <div class="preview-label">Username:</div>
                <div class="preview-value" id="preview-username"></div>
                
                <div class="preview-label">Email:</div>
                <div class="preview-value" id="preview-email"></div>
                
                <div class="preview-label">Registration Date:</div>
                <div class="preview-value" id="preview-date"></div>
            </div>
            <div class="preview-actions">
                <button class="preview-edit" id="preview-edit-btn">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="preview-confirm" id="preview-confirm-btn">
                    <i class="fas fa-check"></i> Confirm Registration
                </button>
            </div>
        `;
        registerForm.parentNode.appendChild(previewContainer);
    }
    
    // Handle form submission
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Clear previous messages
        registerMessage.textContent = '';
        registerMessage.className = 'form-message';
        
        // Validate form
        if (!registerUsername.value || !registerEmail.value || !registerPassword.value || !registerConfirmPassword.value) {
            registerMessage.textContent = 'Please fill in all fields';
            registerMessage.classList.add('error');
            return;
        }
        
        if (registerPassword.value !== registerConfirmPassword.value) {
            registerMessage.textContent = 'Passwords do not match';
            registerMessage.classList.add('error');
            return;
        }
        
        if (registerPassword.value.length < 6) {
            registerMessage.textContent = 'Password must be at least 6 characters';
            registerMessage.classList.add('error');
            return;
        }
        
        // Show preview
        document.getElementById('preview-username').textContent = registerUsername.value;
        document.getElementById('preview-email').textContent = registerEmail.value;
        document.getElementById('preview-date').textContent = new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        previewContainer.classList.add('active');
        registerForm.style.opacity = '0.5';
        registerForm.style.pointerEvents = 'none';
    });
    
    // Handle edit button click
    document.getElementById('preview-edit-btn').addEventListener('click', function() {
        previewContainer.classList.remove('active');
        registerForm.style.opacity = '1';
        registerForm.style.pointerEvents = 'auto';
    });
    
    // Handle confirm button click
    document.getElementById('preview-confirm-btn').addEventListener('click', function() {
        const authManager = new AuthManager();
        
        // Register the user
        authManager.register(
            registerUsername.value,
            registerEmail.value,
            registerPassword.value
        ).then(user => {
            // Show success message
            registerMessage.textContent = 'Registration successful! Redirecting to your profile...';
            registerMessage.classList.add('success');
            
            // Hide preview
            previewContainer.classList.remove('active');
            
            // Reset form
            registerForm.reset();
            registerForm.style.opacity = '1';
            registerForm.style.pointerEvents = 'auto';
            
            // Redirect to profile section after a delay
            setTimeout(() => {
                document.querySelector('[data-section="profile"]').click();
            }, 2000);
        }).catch(error => {
            // Show error message
            registerMessage.textContent = error.message;
            registerMessage.classList.add('error');
            
            // Hide preview
            previewContainer.classList.remove('active');
            registerForm.style.opacity = '1';
            registerForm.style.pointerEvents = 'auto';
        });
    });
}
