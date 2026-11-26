/** Server-backed account manager. Credentials and session tokens are never stored in browser storage. */
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.authListeners = [];
        this.ready = this.restoreSession();
    }

    async request(route, method = 'GET', data) {
        const res = await fetch('/api' + route, {
            method,
            credentials: 'same-origin',
            headers: { 'Content-Type': 'application/json', 'X-FinLit-Client': 'browser' },
            body: data === undefined ? undefined : JSON.stringify(data)
        });
        const payload = await res.json().catch(() => ({}));
        if (!res.ok || !payload.success) {
            if (res.status === 401) this.setCurrentUser(null);
            const error = new Error(payload.message || 'Account service is unavailable');
            error.status = res.status;
            throw error;
        }
        return payload;
    }
    async restoreSession() {
        try { this.setCurrentUser((await this.request('/users/me')).user); }
        catch (_) { this.setCurrentUser(null); }
    }
    async register(username, email, password) {
        await this.ready;
        const payload = await this.request('/users/register', 'POST', { username, email, password });
        this.setCurrentUser(payload.user);
        return payload.user;
    }
    async login(email, password) {
        await this.ready;
        const payload = await this.request('/users/login', 'POST', { email, password });
        this.setCurrentUser(payload.user);
        return payload.user;
    }
    async logout() {
        await this.ready;
        try { await this.request('/users/logout', 'POST'); }
        catch (error) { if (error.status !== 401) throw error; }
        this.setCurrentUser(null);
    }
    isLoggedIn() { return Boolean(this.currentUser); }
    getCurrentUser() { return this.currentUser; }
    setCurrentUser(user) {
        this.currentUser = user;
        for (const listener of this.authListeners) listener(user);
    }
    addAuthListener(listener) {
        this.authListeners.push(listener);
        listener(this.currentUser);
    }
    async getUserCalculations() {
        await this.ready;
        if (!this.currentUser) throw new Error('Login required');
        return (await this.request('/calculations/' + encodeURIComponent(this.currentUser.id))).calculations;
    }
    async saveCalculation(calculationType, calculationData, title) {
        await this.ready;
        if (!this.currentUser) throw new Error('Login required');
        return (await this.request('/calculations/save', 'POST', {
            userId: this.currentUser.id, calculationType, calculationData, title
        })).calculation;
    }
    async deleteCalculation(id) {
        await this.ready;
        if (!this.currentUser) throw new Error('Login required');
        await this.request('/calculations/' + encodeURIComponent(id), 'DELETE');
        return true;
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
        if (registerForm.dataset.confirmed === 'true') { delete registerForm.dataset.confirmed; return; }
        e.preventDefault();
        e.stopImmediatePropagation();
        
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
        
        if (registerPassword.value.length < 8) {
            registerMessage.textContent = 'Password must be at least 8 characters';
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
    }, true);
    
    // Handle edit button click
    document.getElementById('preview-edit-btn').addEventListener('click', function() {
        previewContainer.classList.remove('active');
        registerForm.style.opacity = '1';
        registerForm.style.pointerEvents = 'auto';
    });
    
    // Confirmation delegates to the account page's single registration handler.
    document.getElementById('preview-confirm-btn').addEventListener('click', function() {
        previewContainer.classList.remove('active');
        registerForm.style.opacity = '1';
        registerForm.style.pointerEvents = 'auto';
        registerForm.dataset.confirmed = 'true';
        registerForm.requestSubmit();
    });
}
