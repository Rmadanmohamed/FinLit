/**
 * Digital Financial Literacy & Inclusion Platform
 * Bank Account Opening Module and User Account Management
 */

// Initialize auth and database managers
const authManager = new AuthManager();
const dbManager = new DatabaseManager(authManager);

document.addEventListener('DOMContentLoaded', function() {
    // Initialize bank account opening functionality
    initBankAccountOpening();
    
    // Initialize user account management if on account page
    if (document.querySelector('.account-section')) {
        initUserAccountManagement();
    }
});

/**
 * Initialize bank account opening functionality
 */
function initBankAccountOpening() {
    const accountSteps = document.querySelectorAll('.account-step');
    const progressBar = document.querySelector('.account-container .progress-bar');
    const nextButtons = document.querySelectorAll('.account-container .next-step');
    const prevButtons = document.querySelectorAll('.account-container .prev-step');
    const submitButton = document.getElementById('submit-application');
    const termsCheckbox = document.getElementById('terms-checkbox');
    
    if (!accountSteps.length) return;
    
    // Check if a bank was pre-selected
    const selectedBank = localStorage.getItem('selectedBank');
    if (selectedBank) {
        document.querySelectorAll('.bank-option').forEach(option => {
            if (option.querySelector('h4').textContent === selectedBank) {
                option.classList.add('selected');
            }
        });
        localStorage.removeItem('selectedBank');
    }
    
    // Handle bank selection
    document.querySelectorAll('.bank-option').forEach(option => {
        option.addEventListener('click', function() {
            document.querySelectorAll('.bank-option').forEach(opt => {
                opt.classList.remove('selected');
            });
            this.classList.add('selected');
        });
    });
    
    // Handle next button clicks
    nextButtons.forEach(button => {
        button.addEventListener('click', function() {
            const currentStep = document.querySelector('.account-step.active');
            const currentStepNum = parseInt(currentStep.getAttribute('data-step'));
            const nextStepNum = currentStepNum + 1;
            
            // Validate current step
            if (!validateAccountStep(currentStepNum)) {
                return;
            }
            
            // Update progress bar
            const progress = (nextStepNum - 1) / (accountSteps.length - 2) * 100; // -2 because the last step is confirmation
            progressBar.style.width = `${progress}%`;
            
            // Show next step
            currentStep.classList.remove('active');
            document.querySelector(`.account-step[data-step="${nextStepNum}"]`).classList.add('active');
            
            // Scroll to top of container
            document.querySelector('.account-container').scrollIntoView({ behavior: 'smooth' });
        });
    });
    
    // Handle previous button clicks
    prevButtons.forEach(button => {
        button.addEventListener('click', function() {
            const currentStep = document.querySelector('.account-step.active');
            const currentStepNum = parseInt(currentStep.getAttribute('data-step'));
            const prevStepNum = currentStepNum - 1;
            
            // Update progress bar
            const progress = (prevStepNum - 1) / (accountSteps.length - 2) * 100;
            progressBar.style.width = `${progress}%`;
            
            // Show previous step
            currentStep.classList.remove('active');
            document.querySelector(`.account-step[data-step="${prevStepNum}"]`).classList.add('active');
            
            // Scroll to top of container
            document.querySelector('.account-container').scrollIntoView({ behavior: 'smooth' });
        });
    });
    
    // Handle terms checkbox
    if (termsCheckbox && submitButton) {
        termsCheckbox.addEventListener('change', function() {
            submitButton.disabled = !this.checked;
        });
    }
    
    // Handle submit button click
    if (submitButton) {
        submitButton.addEventListener('click', function() {
            // Get selected bank
            let bankName = 'National Bank of Egypt';
            const selectedBankOption = document.querySelector('.bank-option.selected');
            if (selectedBankOption) {
                bankName = selectedBankOption.querySelector('h4').textContent;
            }
            
            // Generate reference number
            const referenceNumber = Math.floor(100000 + Math.random() * 900000);
            
            // Update confirmation page
            document.getElementById('selected-bank').textContent = bankName;
            document.getElementById('reference-number').textContent = referenceNumber;
            
            // Set bank hotline
            let hotline = '19XXX';
            switch (bankName) {
                case 'National Bank of Egypt':
                    hotline = '19623';
                    break;
                case 'Banque Misr':
                    hotline = '19888';
                    break;
                case 'Commercial International Bank (CIB)':
                    hotline = '19666';
                    break;
                case 'QNB Alahli':
                    hotline = '19700';
                    break;
                case 'HSBC Egypt':
                    hotline = '19007';
                    break;
                case 'Arab African International Bank':
                    hotline = '19555';
                    break;
            }
            document.getElementById('bank-hotline').textContent = hotline;
            
            // Update progress bar
            progressBar.style.width = '100%';
            
            // Show confirmation step
            const currentStep = document.querySelector('.account-step.active');
            currentStep.classList.remove('active');
            document.querySelector('.account-step[data-step="6"]').classList.add('active');
            
            // Scroll to top of container
            document.querySelector('.account-container').scrollIntoView({ behavior: 'smooth' });
            
            // Animate confirmation icon
            const confirmationIcon = document.querySelector('.confirmation-icon');
            if (confirmationIcon) {
                confirmationIcon.classList.add('animate-success');
            }
        });
    }
    
    // Initialize range input displays
    document.getElementById('monthly-income')?.addEventListener('input', function() {
        document.getElementById('monthly-income-value').textContent = formatNumber(this.value);
    });
    
    // Handle document upload buttons
    document.querySelectorAll('.upload-btn').forEach(button => {
        button.addEventListener('click', function() {
            // Simulate file upload
            const documentItem = this.closest('.document-item');
            
            // Show loading state
            this.textContent = 'Uploading...';
            this.disabled = true;
            
            // Simulate upload delay
            setTimeout(() => {
                this.textContent = 'Uploaded';
                this.classList.remove('btn-outline');
                this.classList.add('btn-success');
                
                // Show success icon
                documentItem.querySelector('.document-status .status-icon').style.opacity = '1';
            }, 1500);
        });
    });
}
/**
 * Validate account opening step
 */
function validateAccountStep(stepNumber) {
    switch (stepNumber) {
        case 1:
            // Bank selection step - Required
            const selectedBank = document.querySelector('.bank-option.selected');
            if (!selectedBank) {
                showValidationError('من فضلك اختر البنك للاستمرار');
                return false;
            }
            
            // Add blue border to selected bank
            selectedBank.style.border = '2px solid #2196F3';
            
            // Store selected bank name for confirmation page
            const bankName = selectedBank.querySelector('h4').textContent;
            localStorage.setItem('confirmedBank', bankName);
            
            return true;
            
        case 2:
            // Personal information step
            const fullName = document.getElementById('full-name').value;
            const nationalId = document.getElementById('national-id').value;
            const mobileNumber = document.getElementById('mobile-number').value;
            const email = document.getElementById('email').value;
            
            if (!fullName || !nationalId || !mobileNumber || !email) {
                showValidationError('من فضلك املأ جميع الحقول المطلوبة');
                return false;
            }
            
            if (nationalId.length !== 14) {
                showValidationError('رقم الهوية يجب أن يكون 14 رقم');
                return false;
            }
            
            if (mobileNumber.length !== 11 || !mobileNumber.startsWith('01')) {
                showValidationError('من فضلك ادخل رقم موبايل مصري صحيح');
                return false;
            }
            
            if (!validateEmail(email)) {
                showValidationError('من فضلك ادخل بريد إلكتروني صحيح');
                return false;
            }
            
            return true;
            
        case 3:
            // Financial information step
            const occupation = document.getElementById('occupation').value;
            const employer = document.getElementById('employer').value;
            const monthlyIncome = document.getElementById('monthly-income').value;
            
            if (!occupation || !employer || !monthlyIncome) {
                showValidationError('من فضلك املأ جميع الحقول المطلوبة');
                return false;
            }
            
            return true;
            
        case 4:
            // Document upload step
            const uploadButtons = document.querySelectorAll('.upload-btn');
            let allUploaded = true;
            
            uploadButtons.forEach(button => {
                if (button.textContent !== 'Uploaded') {
                    allUploaded = false;
                }
            });
            
            if (!allUploaded) {
                showValidationError('من فضلك قم برفع جميع المستندات المطلوبة');
                return false;
            }
            
            return true;
            
        case 5:
            // Terms and conditions step
            const termsCheckbox = document.getElementById('terms-checkbox');
            
            if (!termsCheckbox.checked) {
                showValidationError('من فضلك وافق على الشروط والأحكام للاستمرار');
                return false;
            }
            
            // Update confirmation page with stored bank name
            const confirmedBank = localStorage.getItem('confirmedBank');
            if (confirmedBank) {
                document.getElementById('selected-bank').textContent = confirmedBank;
                localStorage.removeItem('confirmedBank');
            }
            
            return true;
            
        default:
            return true;
    }
}

/**
 * Show validation error message
 */
function showValidationError(message) {
    const errorElement = document.createElement('div');
    errorElement.className = 'validation-error';
    errorElement.textContent = message;
    errorElement.style.backgroundColor = '#FFEBEE';
    errorElement.style.color = '#F44336';
    errorElement.style.padding = 'var(--spacing-md)';
    errorElement.style.borderRadius = 'var(--radius-md)';
    errorElement.style.marginBottom = 'var(--spacing-md)';
    
    const container = document.querySelector('.account-step.active');
    container.insertBefore(errorElement, container.firstChild);
    
    setTimeout(() => {
        errorElement.style.opacity = '0';
        setTimeout(() => {
            errorElement.remove();
        }, 300);
    }, 3000);
}

/**
 * Validate email format
 */
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Add CSS animations for confirmation
const accountAnimationStyles = document.createElement('style');
accountAnimationStyles.textContent = `
    @keyframes checkmark {
        0% {
            transform: scale(0);
            opacity: 0;
        }
        50% {
            transform: scale(1.2);
            opacity: 1;
        }
        100% {
            transform: scale(1);
            opacity: 1;
        }
    }
    
    .animate-success {
        animation: checkmark 0.8s ease-in-out forwards;
    }
    
    .validation-error {
        transition: opacity 0.3s ease;
    }
    
    .bank-option.selected {
        border: 2px solid #2196F3 !important;
    }
`;

document.head.appendChild(accountAnimationStyles);

/**
 * Initialize user account management functionality
 */
function initUserAccountManagement() {
    // DOM elements
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const loginMessage = document.getElementById('login-message');
    const registerMessage = document.getElementById('register-message');
    const logoutBtn = document.getElementById('logout-btn');
    const navButtons = document.querySelectorAll('.nav-btn');
    const viewUsersLink = document.getElementById('view-users-link');
    const accountSections = document.querySelectorAll('.account-section');
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    // Clear any existing form messages
    if (loginMessage) loginMessage.textContent = '';
    if (registerMessage) registerMessage.textContent = '';
    
    // Update UI based on auth state
    authManager.addAuthListener(user => {
        updateUIForAuthState(user);
    });
    
    // Show/hide sections based on auth state
    function updateUIForAuthState(user) {
        if (user) {
            // User is logged in
            document.querySelector('[data-section="login"]').style.display = 'none';
            document.querySelector('[data-section="register"]').style.display = 'none';
            document.querySelector('[data-section="profile"]').style.display = 'block';
            document.querySelector('[data-section="saved"]').style.display = 'block';
            
            // Show the View Registered Users link
            if (viewUsersLink) {
                viewUsersLink.style.display = 'inline-block';
            }
            
            // Update profile info
            document.getElementById('profile-username').textContent = user.username;
            document.getElementById('profile-email').textContent = user.email;
            
            // Format created date
            const createdDate = new Date(user.createdAt);
            document.getElementById('profile-created').textContent = createdDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            
            // Load saved calculations
            loadSavedCalculations();
            
            // Activate profile section
            activateSection('profile');
        } else {
            // User is logged out
            document.querySelector('[data-section="login"]').style.display = 'block';
            document.querySelector('[data-section="register"]').style.display = 'block';
            document.querySelector('[data-section="profile"]').style.display = 'none';
            document.querySelector('[data-section="saved"]').style.display = 'none';
            
            // Hide the View Registered Users link
            if (viewUsersLink) {
                viewUsersLink.style.display = 'none';
            }
            
            // Activate login section by default
            activateSection('login');
        }
    }
    
    // Navigation buttons - Fix for registration form display issue
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetSection = button.dataset.section;
            
            // Update active button
            navButtons.forEach(b => b.classList.remove('active'));
            button.classList.add('active');
            
            // Clear form messages when switching to login or register sections
            if (targetSection === 'login' && loginMessage) {
                loginMessage.textContent = '';
                loginMessage.className = 'form-message';
            } else if (targetSection === 'register' && registerMessage) {
                registerMessage.textContent = '';
                registerMessage.className = 'form-message';
            }
            
            // Show the selected section
            activateSection(targetSection);
        });
    });
    
    // Function to activate a section
    function activateSection(sectionId) {
        accountSections.forEach(section => {
            section.classList.remove('active');
        });
        
        const targetSection = document.getElementById(`${sectionId}-section`);
        if (targetSection) {
            targetSection.classList.add('active');
        }
        
        // Load saved calculations if that section is selected
        if (sectionId === 'saved') {
            loadSavedCalculations();
        }
    }
    
    // Login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            
            try {
                // Clear previous messages and show loading state
                loginMessage.textContent = 'Logging in...';
                loginMessage.className = 'form-message info';
                
                await authManager.login(email, password);
                
                // Show success message
                loginMessage.textContent = 'Login successful!';
                loginMessage.className = 'form-message success';
                
                // Reset form
                loginForm.reset();
                
                // Redirect to profile section
                setTimeout(() => {
                    document.querySelector('[data-section="profile"]').click();
                }, 1500);
            } catch (error) {
                // Show error message
                loginMessage.textContent = error.message || 'Login failed. Please try again.';
                loginMessage.className = 'form-message error';
            }
        });
    }
    
    // Register form submission
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const username = document.getElementById('register-username').value;
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;
            const confirmPassword = document.getElementById('register-confirm-password').value;
            
            // Validate form fields
            if (!username || !email || !password || !confirmPassword) {
                registerMessage.textContent = 'Please fill in all fields';
                registerMessage.className = 'form-message error';
                return;
            }
            
            // Validate email format
            if (!validateEmail(email)) {
                registerMessage.textContent = 'Please enter a valid email address';
                registerMessage.className = 'form-message error';
                return;
            }
            
            // Validate password length
            if (password.length < 6) {
                registerMessage.textContent = 'Password must be at least 6 characters long';
                registerMessage.className = 'form-message error';
                return;
            }
            
            // Validate passwords match
            if (password !== confirmPassword) {
                registerMessage.textContent = 'Passwords do not match';
                registerMessage.className = 'form-message error';
                return;
            }
            
            try {
                // Clear previous messages and show loading state
                registerMessage.textContent = 'Creating account...';
                registerMessage.className = 'form-message info';
                
                // Register the user
                const user = await authManager.register(username, email, password);
                
                // Save user data to localStorage and dataset
                saveUserToDataset(user);
                
                // Show success message
                registerMessage.textContent = 'Account created successfully!';
                registerMessage.className = 'form-message success';
                
                // Reset form
                registerForm.reset();
                
                // Redirect to profile section
                setTimeout(() => {
                    document.querySelector('[data-section="profile"]').click();
                }, 1500);
            } catch (error) {
                // Show error message
                registerMessage.textContent = error.message || 'Registration failed. Please try again.';
                registerMessage.className = 'form-message error';
            }
        });
    }
    
    /**
     * Save user data to dataset and backend
     */
    function saveUserToDataset(user) {
        try {
            // Get existing users from data/users.json or create empty array
            let users = [];
            try {
                const usersData = localStorage.getItem('finlit_users_data');
                if (usersData) {
                    users = JSON.parse(usersData);
                }
            } catch (e) {
                console.error('Error parsing users data:', e);
            }
            
            // Add new user to array (without password for security)
            const userData = {
                id: user.id,
                username: user.username,
                email: user.email,
                createdAt: user.createdAt
            };
            
            users.push(userData);
            
            // Save back to localStorage
            localStorage.setItem('finlit_users_data', JSON.stringify(users));
            
            // In a real application, this would be a server-side API call
            console.log('User saved to dataset:', userData);
            
            // Save to registered_users.html
            const registeredUser = {
                username: user.username,
                email: user.email,
                date: user.createdAt
            };
            
            // Get existing registered users
            let registeredUsers = [];
            try {
                const registeredUsersData = localStorage.getItem('registered_users');
                if (registeredUsersData) {
                    registeredUsers = JSON.parse(registeredUsersData);
                }
            } catch (e) {
                console.error('Error parsing registered users data:', e);
            }
            
            // Add new user
            registeredUsers.push(registeredUser);
            
            // Save back to localStorage
            localStorage.setItem('registered_users', JSON.stringify(registeredUsers));
            
            return true;
        } catch (error) {
            console.error('Error saving user to dataset:', error);
            return false;
        }
    }
    
    // Logout button
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            authManager.logout();
            
            // Activate login section
            document.querySelector('[data-section="login"]').click();
        });
    }
    
    // Filter buttons for saved calculations
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Filter calculations
            const filterType = btn.dataset.type;
            loadSavedCalculations(filterType);
        });
    });
    
    // Function to load saved calculations
    async function loadSavedCalculations(filterType = 'all') {
        const calculationsList = document.getElementById('saved-calculations-list');
        if (!calculationsList) return;
        
        try {
            // Get saved calculations from current user
            const currentUser = authManager.currentUser;
            if (!currentUser || !currentUser.savedCalculations) {
                calculationsList.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-calculator"></i>
                        <p>No saved calculations found</p>
                    </div>
                `;
                return;
            }
            
            // Filter calculations by type
            let filteredCalculations = currentUser.savedCalculations;
            if (filterType !== 'all') {
                filteredCalculations = filteredCalculations.filter(calc => calc.type === filterType);
            }
            
            // Sort by date (newest first)
            filteredCalculations.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            
            // Render calculations
            if (filteredCalculations.length === 0) {
                calculationsList.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-calculator"></i>
                        <p>No ${filterType !== 'all' ? filterType + ' ' : ''}calculations found</p>
                    </div>
                `;
                return;
            }
            
            let calculationsHTML = '';
            
            filteredCalculations.forEach(calc => {
                // Format date
                const createdDate = new Date(calc.createdAt);
                const formattedDate = createdDate.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                });
                
                // Create calculation card
                calculationsHTML += `
                    <div class="calculation-card" data-id="${calc.id}" data-type="${calc.type}">
                        <div class="calculation-header">
                            <h4>${calc.title}</h4>
                            <span class="calculation-type ${calc.type}">${calc.type}</span>
                        </div>
                        <div class="calculation-details">
                            <div class="calculation-data">
                                ${renderCalculationData(calc)}
                            </div>
                            <div class="calculation-meta">
                                <span class="calculation-date">
                                    <i class="fas fa-calendar-alt"></i>
                                    ${formattedDate}
                                </span>
                            </div>
                        </div>
                        <div class="calculation-actions">
                            <button class="btn-outline delete-calculation" data-id="${calc.id}">
                                <i class="fas fa-trash"></i>
                                Delete
                            </button>
                        </div>
                    </div>
                `;
            });
            
            calculationsList.innerHTML = calculationsHTML;
            
            // Add event listeners to delete buttons
            document.querySelectorAll('.delete-calculation').forEach(btn => {
                btn.addEventListener('click', async function() {
                    const calculationId = this.getAttribute('data-id');
                    
                    try {
                        await dbManager.deleteCalculation(calculationId);
                        
                        // Remove from UI
                        const calculationCard = document.querySelector(`.calculation-card[data-id="${calculationId}"]`);
                        if (calculationCard) {
                            calculationCard.style.opacity = '0';
                            setTimeout(() => {
                                calculationCard.remove();
                                
                                // Check if there are any calculations left
                                if (document.querySelectorAll('.calculation-card').length === 0) {
                                    calculationsList.innerHTML = `
                                        <div class="empty-state">
                                            <i class="fas fa-calculator"></i>
                                            <p>No ${filterType !== 'all' ? filterType + ' ' : ''}calculations found</p>
                                        </div>
                                    `;
                                }
                            }, 300);
                        }
                    } catch (error) {
                        console.error('Error deleting calculation:', error);
                    }
                });
            });
        } catch (error) {
            console.error('Error loading calculations:', error);
            calculationsList.innerHTML = `
                <div class="empty-state error">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Error loading calculations</p>
                </div>
            `;
        }
    }
    
    /**
     * Render calculation data based on type
     */
    function renderCalculationData(calculation) {
        switch (calculation.type) {
            case 'savings':
                return `
                    <div class="data-item">
                        <span class="data-label">Initial Amount:</span>
                        <span class="data-value">${formatCurrency(calculation.data.initialAmount)}</span>
                    </div>
                    <div class="data-item">
                        <span class="data-label">Monthly Deposit:</span>
                        <span class="data-value">${formatCurrency(calculation.data.monthlyDeposit)}</span>
                    </div>
                    <div class="data-item">
                        <span class="data-label">Interest Rate:</span>
                        <span class="data-value">${calculation.data.interestRate}%</span>
                    </div>
                    <div class="data-item">
                        <span class="data-label">Duration:</span>
                        <span class="data-value">${calculation.data.years} years</span>
                    </div>
                    <div class="data-item highlight">
                        <span class="data-label">Final Amount:</span>
                        <span class="data-value">${formatCurrency(calculation.data.finalAmount)}</span>
                    </div>
                `;
                
            case 'loan':
                return `
                    <div class="data-item">
                        <span class="data-label">Loan Amount:</span>
                        <span class="data-value">${formatCurrency(calculation.data.loanAmount)}</span>
                    </div>
                    <div class="data-item">
                        <span class="data-label">Interest Rate:</span>
                        <span class="data-value">${calculation.data.interestRate}%</span>
                    </div>
                    <div class="data-item">
                        <span class="data-label">Term:</span>
                        <span class="data-value">${calculation.data.term} ${calculation.data.termUnit}</span>
                    </div>
                    <div class="data-item highlight">
                        <span class="data-label">Monthly Payment:</span>
                        <span class="data-value">${formatCurrency(calculation.data.monthlyPayment)}</span>
                    </div>
                    <div class="data-item">
                        <span class="data-label">Total Interest:</span>
                        <span class="data-value">${formatCurrency(calculation.data.totalInterest)}</span>
                    </div>
                `;
                
            case 'budget':
                return `
                    <div class="data-item">
                        <span class="data-label">Income:</span>
                        <span class="data-value">${formatCurrency(calculation.data.income)}</span>
                    </div>
                    <div class="data-item">
                        <span class="data-label">Expenses:</span>
                        <span class="data-value">${formatCurrency(calculation.data.expenses)}</span>
                    </div>
                    <div class="data-item highlight">
                        <span class="data-label">Savings:</span>
                        <span class="data-value">${formatCurrency(calculation.data.savings)}</span>
                    </div>
                    <div class="data-item">
                        <span class="data-label">Savings Rate:</span>
                        <span class="data-value">${calculation.data.savingsRate}%</span>
                    </div>
                `;
                
            default:
                return `
                    <div class="data-item">
                        <span class="data-label">No details available</span>
                    </div>
                `;
        }
    }
    
    /**
     * Format currency
     */
    function formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'EGP',
            minimumFractionDigits: 2
        }).format(amount);
    }
    
    /**
     * Format number with commas
     */
    function formatNumber(number) {
        return new Intl.NumberFormat('en-US').format(number);
    }
}
