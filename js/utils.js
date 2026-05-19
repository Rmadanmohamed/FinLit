/**
 * Digital Financial Literacy & Inclusion Platform
 * Utilities and Helper Functions
 */

/**
 * Format number with commas
 */
function formatNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * Format currency with EGP symbol
 */
function formatCurrency(number) {
    return `EGP ${formatNumber(parseFloat(number).toFixed(2))}`;
}

/**
 * Format percentage
 */
function formatPercentage(number) {
    return `${parseFloat(number).toFixed(1)}%`;
}

/**
 * Get current date in DD/MM/YYYY format
 */
function getCurrentDate() {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    
    return `${day}/${month}/${year}`;
}

/**
 * Calculate future value with compound interest
 */
function calculateFutureValue(principal, rate, time, frequency = 12) {
    const r = rate / 100 / frequency;
    const n = time * frequency;
    return principal * Math.pow(1 + r, n);
}

/**
 * Calculate monthly payment for a loan
 */
function calculateLoanPayment(principal, rate, years, adminFee = 0) {
    const monthlyRate = rate / 100 / 12;
    const months = years * 12;
    const basePayment = principal * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
    return basePayment + adminFee; // إضافة الرسوم الإدارية للقسط الشهري
}

/**
 * Calculate time to reach savings goal
 */
function calculateTimeToGoal(goal, principal, monthlyContribution, rate) {
    const monthlyRate = rate / 100 / 12;
    let months = 0;
    let balance = principal;
    
    while (balance < goal && months < 600) { // Cap at 50 years
        balance = balance * (1 + monthlyRate) + monthlyContribution;
        months++;
    }
    
    return months;
}

/**
 * Format time in months to years and months
 */
function formatTimeInMonths(months) {
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    
    let result = '';
    
    if (years > 0) {
        result += `${years} year${years !== 1 ? 's' : ''}`;
    }
    
    if (remainingMonths > 0) {
        if (result.length > 0) {
            result += ' and ';
        }
        result += `${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
    }
    
    return result;
}

/**
 * Generate random ID
 */
function generateRandomId(length = 8) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    return result;
}

/**
 * Debounce function to limit how often a function can be called
 */
function debounce(func, wait) {
    let timeout;
    
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Validate Egyptian national ID
 */
function validateEgyptianNationalId(id) {
    // Basic validation - 14 digits
    if (!/^\d{14}$/.test(id)) {
        return false;
    }
    
    // Extract birth date
    const century = id.substring(0, 1) === '2' ? '19' : '20';
    const year = century + id.substring(1, 3);
    const month = id.substring(3, 5);
    const day = id.substring(5, 7);
    
    // Validate date
    const date = new Date(`${year}-${month}-${day}`);
    if (isNaN(date.getTime())) {
        return false;
    }
    
    // Validate month (1-12)
    if (parseInt(month) < 1 || parseInt(month) > 12) {
        return false;
    }
    
    // Validate day (1-31)
    if (parseInt(day) < 1 || parseInt(day) > 31) {
        return false;
    }
    
    return true;
}

/**
 * Validate Egyptian mobile number
 */
function validateEgyptianMobile(mobile) {
    // Must be 11 digits and start with 01
    return /^01[0-2,5]\d{8}$/.test(mobile);
}

/**
 * Validate email address
 */
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/**
 * Get browser language
 */
function getBrowserLanguage() {
    return navigator.language || navigator.userLanguage || 'en-US';
}

/**
 * Set theme preference
 */
function setThemePreference(theme) {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
}

/**
 * Get theme preference
 */
function getThemePreference() {
    return localStorage.getItem('theme') || 'light';
}

/**
 * Initialize theme
 */
function initTheme() {
    const savedTheme = getThemePreference();
    document.documentElement.setAttribute('data-theme', savedTheme);
}

// Initialize theme when script loads
initTheme();
function calculateLoanPayment(principal, rate, years, adminFee = 0) {
    const monthlyRate = rate / 100 / 12;
    const months = years * 12;
    const basePayment = principal * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
    return basePayment + adminFee; // إضافة الرسوم الإدارية للقسط الشهري
}

/**
 * Calculate time to reach savings goal
 */
function calculateTimeToGoal(goal, principal, monthlyContribution, rate) {
    const monthlyRate = rate / 100 / 12;
    let months = 0;
    let balance = principal;
    
    while (balance < goal && months < 600) { // Cap at 50 years
        balance = balance * (1 + monthlyRate) + monthlyContribution;
        months++;
    }
    
    return months;
}

/**
 * Format time in months to years and months
 */
function formatTimeInMonths(months) {
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    
    let result = '';
    
    if (years > 0) {
        result += `${years} year${years !== 1 ? 's' : ''}`;
    }
    
    if (remainingMonths > 0) {
        if (result.length > 0) {
            result += ' and ';
        }
        result += `${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
    }
    
    return result;
}

/**
 * Generate random ID
 */
function generateRandomId(length = 8) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    return result;
}

/**
 * Debounce function to limit how often a function can be called
 */
function debounce(func, wait) {
    let timeout;
    
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Validate Egyptian national ID
 */
function validateEgyptianNationalId(id) {
    // Basic validation - 14 digits
    if (!/^\d{14}$/.test(id)) {
        return false;
    }
    
    // Extract birth date
    const century = id.substring(0, 1) === '2' ? '19' : '20';
    const year = century + id.substring(1, 3);
    const month = id.substring(3, 5);
    const day = id.substring(5, 7);
    
    // Validate date
    const date = new Date(`${year}-${month}-${day}`);
    if (isNaN(date.getTime())) {
        return false;
    }
    
    // Validate month (1-12)
    if (parseInt(month) < 1 || parseInt(month) > 12) {
        return false;
    }
    
    // Validate day (1-31)
    if (parseInt(day) < 1 || parseInt(day) > 31) {
        return false;
    }
    
    return true;
}

/**
 * Validate Egyptian mobile number
 */
function validateEgyptianMobile(mobile) {
    // Must be 11 digits and start with 01
    return /^01[0-2,5]\d{8}$/.test(mobile);
}

/**
 * Validate email address
 */
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/**
 * Get browser language
 */
function getBrowserLanguage() {
    return navigator.language || navigator.userLanguage || 'en-US';
}

/**
 * Set theme preference
 */
function setThemePreference(theme) {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
}

/**
 * Get theme preference
 */
function getThemePreference() {
    return localStorage.getItem('theme') || 'light';
}

/**
 * Initialize theme
 */
function initTheme() {
    const savedTheme = getThemePreference();
    document.documentElement.setAttribute('data-theme', savedTheme);
}

// Initialize theme when script loads
initTheme();
function calculateLoanPayment(principal, rate, years, adminFee = 0) {
    const monthlyRate = rate / 100 / 12;
    const months = years * 12;
    const basePayment = principal * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
    return basePayment + adminFee; // إضافة الرسوم الإدارية للقسط الشهري
}

/**
 * Calculate time to reach savings goal
 */
function calculateTimeToGoal(goal, principal, monthlyContribution, rate) {
    const monthlyRate = rate / 100 / 12;
    let months = 0;
    let balance = principal;
    
    while (balance < goal && months < 600) { // Cap at 50 years
        balance = balance * (1 + monthlyRate) + monthlyContribution;
        months++;
    }
    
    return months;
}

/**
 * Format time in months to years and months
 */
function formatTimeInMonths(months) {
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    
    let result = '';
    
    if (years > 0) {
        result += `${years} year${years !== 1 ? 's' : ''}`;
    }
    
    if (remainingMonths > 0) {
        if (result.length > 0) {
            result += ' and ';
        }
        result += `${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
    }
    
    return result;
}

/**
 * Generate random ID
 */
function generateRandomId(length = 8) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    return result;
}

/**
 * Debounce function to limit how often a function can be called
 */
function debounce(func, wait) {
    let timeout;
    
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Validate Egyptian national ID
 */
function validateEgyptianNationalId(id) {
    // Basic validation - 14 digits
    if (!/^\d{14}$/.test(id)) {
        return false;
    }
    
    // Extract birth date
    const century = id.substring(0, 1) === '2' ? '19' : '20';
    const year = century + id.substring(1, 3);
    const month = id.substring(3, 5);
    const day = id.substring(5, 7);
    
    // Validate date
    const date = new Date(`${year}-${month}-${day}`);
    if (isNaN(date.getTime())) {
        return false;
    }
    
    // Validate month (1-12)
    if (parseInt(month) < 1 || parseInt(month) > 12) {
        return false;
    }
    
    // Validate day (1-31)
    if (parseInt(day) < 1 || parseInt(day) > 31) {
        return false;
    }
    
    return true;
}

/**
 * Validate Egyptian mobile number
 */
function validateEgyptianMobile(mobile) {
    // Must be 11 digits and start with 01
    return /^01[0-2,5]\d{8}$/.test(mobile);
}

/**
 * Validate email address
 */
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/**
 * Get browser language
 */
function getBrowserLanguage() {
    return navigator.language || navigator.userLanguage || 'en-US';
}

/**
 * Set theme preference
 */
function setThemePreference(theme) {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
}

/**
 * Get theme preference
 */
function getThemePreference() {
    return localStorage.getItem('theme') || 'light';
}

/**
 * Initialize theme
 */
function initTheme() {
    const savedTheme = getThemePreference();
    document.documentElement.setAttribute('data-theme', savedTheme);
}

// Initialize theme when script loads
initTheme();
function calculateLoanPayment(principal, rate, years, adminFee = 0) {
    const monthlyRate = rate / 100 / 12;
    const months = years * 12;
    const basePayment = principal * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
    return basePayment + adminFee; // إضافة الرسوم الإدارية للقسط الشهري
}

/**
 * Calculate time to reach savings goal
 */
function calculateTimeToGoal(goal, principal, monthlyContribution, rate) {
    const monthlyRate = rate / 100 / 12;
    let months = 0;
    let balance = principal;
    
    while (balance < goal && months < 600) { // Cap at 50 years
        balance = balance * (1 + monthlyRate) + monthlyContribution;
        months++;
    }
    
    return months;
}

/**
 * Format time in months to years and months
 */
function formatTimeInMonths(months) {
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    
    let result = '';
    
    if (years > 0) {
        result += `${years} year${years !== 1 ? 's' : ''}`;
    }
    
    if (remainingMonths > 0) {
        if (result.length > 0) {
            result += ' and ';
        }
        result += `${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
    }
    
    return result;
}

/**
 * Generate random ID
 */
function generateRandomId(length = 8) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    return result;
}

/**
 * Debounce function to limit how often a function can be called
 */
function debounce(func, wait) {
    let timeout;
    
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Validate Egyptian national ID
 */
function validateEgyptianNationalId(id) {
    // Basic validation - 14 digits
    if (!/^\d{14}$/.test(id)) {
        return false;
    }
    
    // Extract birth date
    const century = id.substring(0, 1) === '2' ? '19' : '20';
    const year = century + id.substring(1, 3);
    const month = id.substring(3, 5);
    const day = id.substring(5, 7);
    
    // Validate date
    const date = new Date(`${year}-${month}-${day}`);
    if (isNaN(date.getTime())) {
        return false;
    }
    
    // Validate month (1-12)
    if (parseInt(month) < 1 || parseInt(month) > 12) {
        return false;
    }
    
    // Validate day (1-31)
    if (parseInt(day) < 1 || parseInt(day) > 31) {
        return false;
    }
    
    return true;
}

/**
 * Validate Egyptian mobile number
 */
function validateEgyptianMobile(mobile) {
    // Must be 11 digits and start with 01
    return /^01[0-2,5]\d{8}$/.test(mobile);
}

/**
 * Validate email address
 */
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/**
 * Get browser language
 */
function getBrowserLanguage() {
    return navigator.language || navigator.userLanguage || 'en-US';
}

/**
 * Set theme preference
 */
function setThemePreference(theme) {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
}

/**
 * Get theme preference
 */
function getThemePreference() {
    return localStorage.getItem('theme') || 'light';
}

/**
 * Initialize theme
 */
function initTheme() {
    const savedTheme = getThemePreference();
    document.documentElement.setAttribute('data-theme', savedTheme);
}

// Initialize theme when script loads
initTheme();
function calculateLoanPayment(principal, rate, years, adminFee = 0) {
    const monthlyRate = rate / 100 / 12;
    const months = years * 12;
    const basePayment = principal * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
    return basePayment + adminFee; // إضافة الرسوم الإدارية للقسط الشهري
}

/**
 * Calculate time to reach savings goal
 */
function calculateTimeToGoal(goal, principal, monthlyContribution, rate) {
    const monthlyRate = rate / 100 / 12;
    let months = 0;
    let balance = principal;
    
    while (balance < goal && months < 600) { // Cap at 50 years
        balance = balance * (1 + monthlyRate) + monthlyContribution;
        months++;
    }
    
    return months;
}

/**
 * Format time in months to years and months
 */
function formatTimeInMonths(months) {
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    
    let result = '';
    
    if (years > 0) {
        result += `${years} year${years !== 1 ? 's' : ''}`;
    }
    
    if (remainingMonths > 0) {
        if (result.length > 0) {
            result += ' and ';
        }
        result += `${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
    }
    
    return result;
}

/**
 * Generate random ID
 */
function generateRandomId(length = 8) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    return result;
}

/**
 * Debounce function to limit how often a function can be called
 */
function debounce(func, wait) {
    let timeout;
    
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Validate Egyptian national ID
 */
function validateEgyptianNationalId(id) {
    // Basic validation - 14 digits
    if (!/^\d{14}$/.test(id)) {
        return false;
    }
    
    // Extract birth date
    const century = id.substring(0, 1) === '2' ? '19' : '20';
    const year = century + id.substring(1, 3);
    const month = id.substring(3, 5);
    const day = id.substring(5, 7);
    
    // Validate date
    const date = new Date(`${year}-${month}-${day}`);
    if (isNaN(date.getTime())) {
        return false;
    }
    
    // Validate month (1-12)
    if (parseInt(month) < 1 || parseInt(month) > 12) {
        return false;
    }
    
    // Validate day (1-31)
    if (parseInt(day) < 1 || parseInt(day) > 31) {
        return false;
    }
    
    return true;
}

/**
 * Validate Egyptian mobile number
 */
function validateEgyptianMobile(mobile) {
    // Must be 11 digits and start with 01
    return /^01[0-2,5]\d{8}$/.test(mobile);
}

/**
 * Validate email address
 */
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/**
 * Get browser language
 */
function getBrowserLanguage() {
    return navigator.language || navigator.userLanguage || 'en-US';
}

/**
 * Set theme preference
 */
function setThemePreference(theme) {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
}

/**
 * Get theme preference
 */
function getThemePreference() {
    return localStorage.getItem('theme') || 'light';
}

/**
 * Initialize theme
 */
function initTheme() {
    const savedTheme = getThemePreference();
    document.documentElement.setAttribute('data-theme', savedTheme);
}

// Initialize theme when script loads
initTheme();
function calculateLoanPayment(principal, rate, years, adminFee = 0) {
    const monthlyRate = rate / 100 / 12;
    const months = years * 12;
    const basePayment = principal * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
    return basePayment + adminFee; // إضافة الرسوم الإدارية للقسط الشهري
}

/**
 * Calculate time to reach savings goal
 */
function calculateTimeToGoal(goal, principal, monthlyContribution, rate) {
    const monthlyRate = rate / 100 / 12;
    let months = 0;
    let balance = principal;
    
    while (balance < goal && months < 600) { // Cap at 50 years
        balance = balance * (1 + monthlyRate) + monthlyContribution;
        months++;
    }
    
    return months;
}

/**
 * Format time in months to years and months
 */
function formatTimeInMonths(months) {
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    
    let result = '';
    
    if (years > 0) {
        result += `${years} year${years !== 1 ? 's' : ''}`;
    }
    
    if (remainingMonths > 0) {
        if (result.length > 0) {
            result += ' and ';
        }
        result += `${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
    }
    
    return result;
}

/**
 * Generate random ID
 */
function generateRandomId(length = 8) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    return result;
}

/**
 * Debounce function to limit how often a function can be called
 */
function debounce(func, wait) {
    let timeout;
    
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Validate Egyptian national ID
 */
function validateEgyptianNationalId(id) {
    // Basic validation - 14 digits
    if (!/^\d{14}$/.test(id)) {
        return false;
    }
    
    // Extract birth date
    const century = id.substring(0, 1) === '2' ? '19' : '20';
    const year = century + id.substring(1, 3);
    const month = id.substring(3, 5);
    const day = id.substring(5, 7);
    
    // Validate date
    const date = new Date(`${year}-${month}-${day}`);
    if (isNaN(date.getTime())) {
        return false;
    }
    
    // Validate month (1-12)
    if (parseInt(month) < 1 || parseInt(month) > 12) {
        return false;
    }
    
    // Validate day (1-31)
    if (parseInt(day) < 1 || parseInt(day) > 31) {
        return false;
    }
    
    return true;
}

/**
 * Validate Egyptian mobile number
 */
function validateEgyptianMobile(mobile) {
    // Must be 11 digits and start with 01
    return /^01[0-2,5]\d{8}$/.test(mobile);
}

/**
 * Validate email address
 */
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/**
 * Get browser language
 */
function getBrowserLanguage() {
    return navigator.language || navigator.userLanguage || 'en-US';
}

/**
 * Set theme preference
 */
function setThemePreference(theme) {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
}

/**
 * Get theme preference
 */
function getThemePreference() {
    return localStorage.getItem('theme') || 'light';
}

/**
 * Initialize theme
 */
function initTheme() {
    const savedTheme = getThemePreference();
    document.documentElement.setAttribute('data-theme', savedTheme);
}

// Initialize theme when script loads
initTheme();
function calculateLoanPayment(principal, rate, years, adminFee = 0) {
    const monthlyRate = rate / 100 / 12;
    const months = years * 12;
    const basePayment = principal * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
    return basePayment + adminFee; // إضافة الرسوم الإدارية للقسط الشهري
}

/**
 * Calculate time to reach savings goal
 */
function calculateTimeToGoal(goal, principal, monthlyContribution, rate) {
    const monthlyRate = rate / 100 / 12;
    let months = 0;
    let balance = principal;
    
    while (balance < goal && months < 600) { // Cap at 50 years
        balance = balance * (1 + monthlyRate) + monthlyContribution;
        months++;
    }
    
    return months;
}

/**
 * Format time in months to years and months
 */
function formatTimeInMonths(months) {
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    
    let result = '';
    
    if (years > 0) {
        result += `${years} year${years !== 1 ? 's' : ''}`;
    }
    
    if (remainingMonths > 0) {
        if (result.length > 0) {
            result += ' and ';
        }
        result += `${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
    }
    
    return result;
}

/**
 * Generate random ID
 */
function generateRandomId(length = 8) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    return result;
}

/**
 * Debounce function to limit how often a function can be called
 */
function debounce(func, wait) {
    let timeout;
    
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Validate Egyptian national ID
 */
function validateEgyptianNationalId(id) {
    // Basic validation - 14 digits
    if (!/^\d{14}$/.test(id)) {
        return false;
    }
    
    // Extract birth date
    const century = id.substring(0, 1) === '2' ? '19' : '20';
    const year = century + id.substring(1, 3);
    const month = id.substring(3, 5);
    const day = id.substring(5, 7);
    
    // Validate date
    const date = new Date(`${year}-${month}-${day}`);
    if (isNaN(date.getTime())) {
        return false;
    }
    
    // Validate month (1-12)
    if (parseInt(month) < 1 || parseInt(month) > 12) {
        return false;
    }
    
    // Validate day (1-31)
    if (parseInt(day) < 1 || parseInt(day) > 31) {
        return false;
    }
    
    return true;
}

/**
 * Validate Egyptian mobile number
 */
function validateEgyptianMobile(mobile) {
    // Must be 11 digits and start with 01
    return /^01[0-2,5]\d{8}$/.test(mobile);
}

/**
 * Validate email address
 */
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/**
 * Get browser language
 */
function getBrowserLanguage() {
    return navigator.language || navigator.userLanguage || 'en-US';
}

/**
 * Set theme preference
 */
function setThemePreference(theme) {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
}

/**
 * Get theme preference
 */
function getThemePreference() {
    return localStorage.getItem('theme') || 'light';
}

/**
 * Initialize theme
 */
function initTheme() {
    const savedTheme = getThemePreference();
    document.documentElement.setAttribute('data-theme', savedTheme);
}

// Initialize theme when script loads
initTheme();
function calculateLoanPayment(principal, rate, years, adminFee = 0) {
    const monthlyRate = rate / 100 / 12;
    const months = years * 12;
    const basePayment = principal * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
    return basePayment + adminFee; // إضافة الرسوم الإدارية للقسط الشهري
}

/**
 * Calculate time to reach savings goal
 */
function calculateTimeToGoal(goal, principal, monthlyContribution, rate) {
    const monthlyRate = rate / 100 / 12;
    let months = 0;
    let balance = principal;
    
    while (balance < goal && months < 600) { // Cap at 50 years
        balance = balance * (1 + monthlyRate) + monthlyContribution;
        months++;
    }
    
    return months;
}

/**
 * Format time in months to years and months
 */
function formatTimeInMonths(months) {
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    
    let result = '';
    
    if (years > 0) {
        result += `${years} year${years !== 1 ? 's' : ''}`;
    }
    
    if (remainingMonths > 0) {
        if (result.length > 0) {
            result += ' and ';
        }
        result += `${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
    }
    
    return result;
}

/**
 * Generate random ID
 */
function generateRandomId(length = 8) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    return result;
}

/**
 * Debounce function to limit how often a function can be called
 */
function debounce(func, wait) {
    let timeout;
    
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Validate Egyptian national ID
 */
function validateEgyptianNationalId(id) {
    // Basic validation - 14 digits
    if (!/^\d{14}$/.test(id)) {
        return false;
    }
    
    // Extract birth date
    const century = id.substring(0, 1) === '2' ? '19' : '20';
    const year = century + id.substring(1, 3);
    const month = id.substring(3, 5);
    const day = id.substring(5, 7);
    
    // Validate date
    const date = new Date(`${year}-${month}-${day}`);
    if (isNaN(date.getTime())) {
        return false;
    }
    
    // Validate month (1-12)
    if (parseInt(month) < 1 || parseInt(month) > 12) {
        return false;
    }
    
    // Validate day (1-31)
    if (parseInt(day) < 1 || parseInt(day) > 31) {
        return false;
    }
    
    return true;
}

/**
 * Validate Egyptian mobile number
 */
function validateEgyptianMobile(mobile) {
    // Must be 11 digits and start with 01
    return /^01[0-2,5]\d{8}$/.test(mobile);
}

/**
 * Validate email address
 */
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/**
 * Get browser language
 */
function getBrowserLanguage() {
    return navigator.language || navigator.userLanguage || 'en-US';
}

/**
 * Set theme preference
 */
function setThemePreference(theme) {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
}

/**
 * Get theme preference
 */
function getThemePreference() {
    return localStorage.getItem('theme') || 'light';
}

/**
 * Initialize theme
 */
function initTheme() {
    const savedTheme = getThemePreference();
    document.documentElement.setAttribute('data-theme', savedTheme);
}

// Initialize theme when script loads
initTheme();
function calculateLoanPayment(principal, rate, years, adminFee = 0) {
    const monthlyRate = rate / 100 / 12;
    const months = years * 12;
    const basePayment = principal * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
    return basePayment + adminFee; // إضافة الرسوم الإدارية للقسط الشهري
}

/**
 * Calculate time to reach savings goal
 */
function calculateTimeToGoal(goal, principal, monthlyContribution, rate) {
    const monthlyRate = rate / 100 / 12;
    let months = 0;
    let balance = principal;
    
    while (balance < goal && months < 600) { // Cap at 50 years
        balance = balance * (1 + monthlyRate) + monthlyContribution;
        months++;
    }
    
    return months;
}

/**
 * Format time in months to years and months
 */
function formatTimeInMonths(months) {
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    
    let result = '';
    
    if (years > 0) {
        result += `${years} year${years !== 1 ? 's' : ''}`;
    }
    
    if (remainingMonths > 0) {
        if (result.length > 0) {
            result += ' and ';
        }
        result += `${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
    }
    
    return result;
}

/**
 * Generate random ID
 */
function generateRandomId(length = 8) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    return result;
}

/**
 * Debounce function to limit how often a function can be called
 */
function debounce(func, wait) {
    let timeout;
    
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Validate Egyptian national ID
 */
function validateEgyptianNationalId(id) {
    // Basic validation - 14 digits
    if (!/^\d{14}$/.test(id)) {
        return false;
    }
    
    // Extract birth date
    const century = id.substring(0, 1) === '2' ? '19' : '20';
    const year = century + id.substring(1, 3);
    const month = id.substring(3, 5);
    const day = id.substring(5, 7);
    
    // Validate date
    const date = new Date(`${year}-${month}-${day}`);
    if (isNaN(date.getTime())) {
        return false;
    }
    
    // Validate month (1-12)
    if (parseInt(month) < 1 || parseInt(month) > 12) {
        return false;
    }
    
    // Validate day (1-31)
    if (parseInt(day) < 1 || parseInt(day) > 31) {
        return false;
    }
    
    return true;
}

/**
 * Validate Egyptian mobile number
 */
function validateEgyptianMobile(mobile) {
    // Must be 11 digits and start with 01
    return /^01[0-2,5]\d{8}$/.test(mobile);
}

/**
 * Validate email address
 */
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/**
 * Get browser language
 */
function getBrowserLanguage() {
    return navigator.language || navigator.userLanguage || 'en-US';
}

/**
 * Set theme preference
 */
function setThemePreference(theme) {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
}

/**
 * Get theme preference
 */
function getThemePreference() {
    return localStorage.getItem('theme') || 'light';
}

/**
 * Initialize theme
 */
function initTheme() {
    const savedTheme = getThemePreference();
    document.documentElement.setAttribute('data-theme', savedTheme);
}

// Initialize theme when script loads
initTheme();
function calculateLoanPayment(principal, rate, years, adminFee = 0) {
    const monthlyRate = rate / 100 / 12;
    const months = years * 12;
    const basePayment = principal * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
    return basePayment + adminFee; // إضافة الرسوم الإدارية للقسط الشهري
}

/**
 * Calculate time to reach savings goal
 */
function calculateTimeToGoal(goal, principal, monthlyContribution, rate) {
    const monthlyRate = rate / 100 / 12;
    let months = 0;
    let balance = principal;
    
    while (balance < goal && months < 600) { // Cap at 50 years
        balance = balance * (1 + monthlyRate) + monthlyContribution;
        months++;
    }
    
    return months;
}

/**
 * Format time in months to years and months
 */
function formatTimeInMonths(months) {
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    
    let result = '';
    
    if (years > 0) {
        result += `${years} year${years !== 1 ? 's' : ''}`;
    }
    
    if (remainingMonths > 0) {
        if (result.length > 0) {
            result += ' and ';
        }
        result += `${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
    }
    
    return result;
}

/**
 * Generate random ID
 */
function generateRandomId(length = 8) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    return result;
}

/**
 * Debounce function to limit how often a function can be called
 */
function debounce(func, wait) {
    let timeout;
    
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Validate Egyptian national ID
 */
function validateEgyptianNationalId(id) {
    // Basic validation - 14 digits
    if (!/^\d{14}$/.test(id)) {
        return false;
    }
    
    // Extract birth date
    const century = id.substring(0, 1) === '2' ? '19' : '20';
    const year = century + id.substring(1, 3);
    const month = id.substring(3, 5);
    const day = id.substring(5, 7);
    
    // Validate date
    const date = new Date(`${year}-${month}-${day}`);
    if (isNaN(date.getTime())) {
        return false;
    }
    
    // Validate month (1-12)
    if (parseInt(month) < 1 || parseInt(month) > 12) {
        return false;
    }
    
    // Validate day (1-31)
    if (parseInt(day) < 1 || parseInt(day) > 31) {
        return false;
    }
    
    return true;
}

/**
 * Validate Egyptian mobile number
 */
function validateEgyptianMobile(mobile) {
    // Must be 11 digits and start with 01
    return /^01[0-2,5]\d{8}$/.test(mobile);
}

/**
 * Validate email address
 */
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/**
 * Get browser language
 */
function getBrowserLanguage() {
    return navigator.language || navigator.userLanguage || 'en-US';
}

/**
 * Set theme preference
 */
function setThemePreference(theme) {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
}

/**
 * Get theme preference
 */
function getThemePreference() {
    return localStorage.getItem('theme') || 'light';
}

/**
 * Initialize theme
 */
function initTheme() {
    const savedTheme = getThemePreference();
    document.documentElement.setAttribute('data-theme', savedTheme);
}

// Initialize theme when script loads
initTheme();
function calculateLoanPayment(principal, rate, years, adminFee = 0) {
    const monthlyRate = rate / 100 / 12;
    const months = years * 12;
    const basePayment = principal * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
    return basePayment + adminFee; // إضافة الرسوم الإدارية للقسط الشهري
}

/**
 * Calculate time to reach savings goal
 */
function calculateTimeToGoal(goal, principal, monthlyContribution, rate) {
    const monthlyRate = rate / 100 / 12;
    let months = 0;
    let balance = principal;
    
    while (balance < goal && months < 600) { // Cap at 50 years
        balance = balance * (1 + monthlyRate) + monthlyContribution;
        months++;
    }
    
    return months;
}

/**
 * Format time in months to years and months
 */
function formatTimeInMonths(months) {
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    
    let result = '';
    
    if (years > 0) {
        result += `${years} year${years !== 1 ? 's' : ''}`;
    }
    
    if (remainingMonths > 0) {
        if (result.length > 0) {
            result += ' and ';
        }
        result += `${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
    }
    
    return result;
}

/**
 * Generate random ID
 */
function generateRandomId(length = 8) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    return result;
}

/**
 * Debounce function to limit how often a function can be called
 */
function debounce(func, wait) {
    let timeout;
    
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Validate Egyptian national ID
 */
function validateEgyptianNationalId(id) {
    // Basic validation - 14 digits
    if (!/^\d{14}$/.test(id)) {
        return false;
    }
    
    // Extract birth date
    const century = id.substring(0, 1) === '2' ? '19' : '20';
    const year = century + id.substring(1, 3);
    const month = id.substring(3, 5);
    const day = id.substring(5, 7);
    
    // Validate date
    const date = new Date(`${year}-${month}-${day}`);
    if (isNaN(date.getTime())) {
        return false;
    }
    
    // Validate month (1-12)
    if (parseInt(month) < 1 || parseInt(month) > 12) {
        return false;
    }
    
    // Validate day (1-31)
    if (parseInt(day) < 1 || parseInt(day) > 31) {
        return false;
    }
    
    return true;
}

/**
 * Validate Egyptian mobile number
 */
function validateEgyptianMobile(mobile) {
    // Must be 11 digits and start with 01
    return /^01[0-2,5]\d{8}$/.test(mobile);
}

/**
 * Validate email address
 */
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/**
 * Get browser language
 */
function getBrowserLanguage() {
    return navigator.language || navigator.userLanguage || 'en-US';
}

/**
 * Set theme preference
 */
function setThemePreference(theme) {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
}

/**
 * Get theme preference
 */
function getThemePreference() {
    return localStorage.getItem('theme') || 'light';
}

/**
 * Initialize theme
 */
function initTheme() {
    const savedTheme = getThemePreference();
    document.documentElement.setAttribute('data-theme', savedTheme);
}

// Initialize theme when script loads
initTheme();
function calculateLoanPayment(principal, rate, years, adminFee = 0) {
    const monthlyRate = rate / 100 / 12;
    const months = years * 12;
    const basePayment = principal * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
    return basePayment + adminFee; // إضافة الرسوم الإدارية للقسط الشهري
}

/**
 * Calculate time to reach savings goal
 */
function calculateTimeToGoal(goal, principal, monthlyContribution, rate) {
    const monthlyRate = rate / 100 / 12;
    let months = 0;
    let balance = principal;
    
    while (balance < goal && months < 600) { // Cap at 50 years
        balance = balance * (1 + monthlyRate) + monthlyContribution;
        months++;
    }
    
    return months;
}

/**
 * Format time in months to years and months
 */
function formatTimeInMonths(months) {
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    
    let result = '';
    
    if (years > 0) {
        result += `${years} year${years !== 1 ? 's' : ''}`;
    }
    
    if (remainingMonths > 0) {
        if (result.length > 0) {
            result += ' and ';
        }
        result += `${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
    }
    
    return result;
}

/**
 * Generate random ID
 */
function generateRandomId(length = 8) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    return result;
}

/**
 * Debounce function to limit how often a function can be called
 */
function debounce(func, wait) {
    let timeout;
    
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Validate Egyptian national ID
 */
function validateEgyptianNationalId(id) {
    // Basic validation - 14 digits
    if (!/^\d{14}$/.test(id)) {
        return false;
    }
    
    // Extract birth date
    const century = id.substring(0, 1) === '2' ? '19' : '20';
    const year = century + id.substring(1, 3);
    const month = id.substring(3, 5);
    const day = id.substring(5, 7);
    
    // Validate date
    const date = new Date(`${year}-${month}-${day}`);
    if (isNaN(date.getTime())) {
        return false;
    }
    
    // Validate month (1-12)
    if (parseInt(month) < 1 || parseInt(month) > 12) {
        return false;
    }
    
    // Validate day (1-31)
    if (parseInt(day) < 1 || parseInt(day) > 31) {
        return false;
    }
    
    return true;
}

/**
 * Validate Egyptian mobile number
 */
function validateEgyptianMobile(mobile) {
    // Must be 11 digits and start with 01
    return /^01[0-2,5]\d{8}$/.test(mobile);
}

/**
 * Validate email address
 */
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/**
 * Get browser language
 */
function getBrowserLanguage() {
    return navigator.language || navigator.userLanguage || 'en-US';
}

/**
 * Set theme preference
 */
function setThemePreference(theme) {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
}

/**
 * Get theme preference
 */
function getThemePreference() {
    return localStorage.getItem('theme') || 'light';
}

/**
 * Initialize theme
 */
function initTheme() {
    const savedTheme = getThemePreference();
    document.documentElement.setAttribute('data-theme', savedTheme);
}

// Initialize theme when script loads
initTheme();
function calculateLoanPayment(principal, rate, years, adminFee = 0) {
    const monthlyRate = rate / 100 / 12;
    const months = years * 12;
    const basePayment = principal * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
    return basePayment + adminFee; // إضافة الرسوم الإدارية للقسط الشهري
}

/**
 * Calculate time to reach savings goal
 */
function calculateTimeToGoal(goal, principal, monthlyContribution, rate) {
    const monthlyRate = rate / 100 / 12;
    let months = 0;
    let balance = principal;
    
    while (balance < goal && months < 600) { // Cap at 50 years
        balance = balance * (1 + monthlyRate) + monthlyContribution;
        months++;
    }
    
    return months;
}

/**
 * Format time in months to years and months
 */
function formatTimeInMonths(months) {
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    
    let result = '';
    
    if (years > 0) {
        result += `${years} year${years !== 1 ? 's' : ''}`;
    }
    
    if (remainingMonths > 0) {
        if (result.length > 0) {
            result += ' and ';
        }
        result += `${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
    }
    
    return result;
}

/**
 * Generate random ID
 */
function generateRandomId(length = 8) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    return result;
}

/**
 * Debounce function to limit how often a function can be called
 */
function debounce(func, wait) {
    let timeout;
    
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Validate Egyptian national ID
 */
function validateEgyptianNationalId(id) {
    // Basic validation - 14 digits
    if (!/^\d{14}$/.test(id)) {
        return false;
    }
    
    // Extract birth date
    const century = id.substring(0, 1) === '2' ? '19' : '20';
    const year = century + id.substring(1, 3);
    const month = id.substring(3, 5);
    const day = id.substring(5, 7);
    
    // Validate date
    const date = new Date(`${year}-${month}-${day}`);
    if (isNaN(date.getTime())) {
        return false;
    }
    
    // Validate month (1-12)
    if (parseInt(month) < 1 || parseInt(month) > 12) {
        return false;
    }
    
    // Validate day (1-31)
    if (parseInt(day) < 1 || parseInt(day) > 31) {
        return false;
    }
    
    return true;
}

/**
 * Validate Egyptian mobile number
 */
function validateEgyptianMobile(mobile) {
    // Must be 11 digits and start with 01
    return /^01[0-2,5]\d{8}$/.test(mobile);
}

/**
 * Validate email address
 */
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/**
 * Get browser language
 */
function getBrowserLanguage() {
    return navigator.language || navigator.userLanguage || 'en-US';
}

/**
 * Set theme preference
 */
function setThemePreference(theme) {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
}

/**
 * Get theme preference
 */
function getThemePreference() {
    return localStorage.getItem('theme') || 'light';
}

/**
 * Initialize theme
 */
function initTheme() {
    const savedTheme = getThemePreference();
    document.documentElement.setAttribute('data-theme', savedTheme);
}

// Initialize theme when script loads
initTheme();
function calculateLoanPayment(principal, rate, years, adminFee = 0) {
    const monthlyRate = rate / 100 / 12;
    const months = years * 12;
    const basePayment = principal * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
    return basePayment + adminFee; // إضافة الرسوم الإدارية للقسط الشهري
}

/**
 * Calculate time to reach savings goal
 */
function calculateTimeToGoal(goal, principal, monthlyContribution, rate) {
    const monthlyRate = rate / 100 / 12;
    let months = 0;
    let balance = principal;
    
    while (balance < goal && months < 600) { // Cap at 50 years
        balance = balance * (1 + monthlyRate) + monthlyContribution;
        months++;
    }
    
    return months;
}

/**
 * Format time in months to years and months
 */
function formatTimeInMonths(months) {
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    
    let result = '';
    
    if (years > 0) {
        result += `${years} year${years !== 1 ? 's' : ''}`;
    }
    
    if (remainingMonths > 0) {
        if (result.length > 0) {
            result += ' and ';
        }
        result += `${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
    }
    
    return result;
}

/**
 * Generate random ID
 */
function generateRandomId(length = 8) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    return result;
}

/**
 * Debounce function to limit how often a function can be called
 */
function debounce(func, wait) {
    let timeout;
    
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Validate Egyptian national ID
 */
function validateEgyptianNationalId(id) {
    // Basic validation - 14 digits
    if (!/^\d{14}$/.test(id)) {
        return false;
    }
    
    // Extract birth date
    const century = id.substring(0, 1) === '2' ? '19' : '20';
    const year = century + id.substring(1, 3);
    const month = id.substring(3, 5);
    const day = id.substring(5, 7);
    
    // Validate date
    const date = new Date(`${year}-${month}-${day}`);
    if (isNaN(date.getTime())) {
        return false;
    }
    
    // Validate month (1-12)
    if (parseInt(month) < 1 || parseInt(month) > 12) {
        return false;
    }
    
    // Validate day (1-31)
    if (parseInt(day) < 1 || parseInt(day) > 31) {
        return false;
    }
    
    return true;
}

/**
 * Validate Egyptian mobile number
 */
function validateEgyptianMobile(mobile) {
    // Must be 11 digits and start with 01
    return /^01[0-2,5]\d{8}$/.test(mobile);
}

/**
 * Validate email address
 */
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/**
 * Get browser language
 */
function getBrowserLanguage() {
    return navigator.language || navigator.userLanguage || 'en-US';
}

/**
 * Set theme preference
 */
function setThemePreference(theme) {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
}

/**
 * Get theme preference
 */
function getThemePreference() {
    return localStorage.getItem('theme') || 'light';
}

/**
 * Initialize theme
 */
function initTheme() {
    const savedTheme = getThemePreference();
    document.documentElement.setAttribute('data-theme', savedTheme);
}

// Initialize theme when script loads
initTheme();
function calculateLoanPayment(principal, rate, years, adminFee = 0) {
    const monthlyRate = rate / 100 / 12;
    const months = years * 12;
    const basePayment = principal * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
    return basePayment + adminFee; // إضافة الرسوم الإدارية للقسط الشهري
}

/**
 * Calculate time to reach savings goal
 */
function calculateTimeToGoal(goal, principal, monthlyContribution, rate) {
    const monthlyRate = rate / 100 / 12;
    let months = 0;
    let balance = principal;
    
    while (balance < goal && months < 600) { // Cap at 50 years
        balance = balance * (1 + monthlyRate) + monthlyContribution;
        months++;
    }
    
    return months;
}

/**
 * Format time in months to years and months
 */
function formatTimeInMonths(months) {
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    
    let result = '';
    
    if (years > 0) {
        result += `${years} year${years !== 1 ? 's' : ''}`;
    }
    
    if (remainingMonths > 0) {
        if (result.length > 0) {
            result += ' and ';
        }
        result += `${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
    }
    
    return result;
}

/**
 * Generate random ID
 */
function generateRandomId(length = 8) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    return result;
}

/**
 * Debounce function to limit how often a function can be called
 */
function debounce(func, wait) {
    let timeout;
    
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Validate Egyptian national ID
 */
function validateEgyptianNationalId(id) {
    // Basic validation - 14 digits
    if (!/^\d{14}$/.test(id)) {
        return false;
    }
    
    // Extract birth date
    const century = id.substring(0, 1) === '2' ? '19' : '20';
    const year = century + id.substring(1, 3);
    const month = id.substring(3, 5);
    const day = id.substring(5, 7);
    
    // Validate date
    const date = new Date(`${year}-${month}-${day}`);
    if (isNaN(date.getTime())) {
        return false;
    }
    
    // Validate month (1-12)
    if (parseInt(month) < 1 || parseInt(month) > 12) {
        return false;
    }
    
    // Validate day (1-31)
    if (parseInt(day) < 1 || parseInt(day) > 31) {
        return false;
    }
    
    return true;
}

/**
 * Validate Egyptian mobile number
 */
function validateEgyptianMobile(mobile) {
    // Must be 11 digits and start with 01
    return /^01[0-2,5]\d{8}$/.test(mobile);
}

/**
 * Validate email address
 */
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/**
 * Get browser language
 */
function getBrowserLanguage() {
    return navigator.language || navigator.userLanguage || 'en-US';
}

/**
 * Set theme preference
 */
function setThemePreference(theme) {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
}

/**
 * Get theme preference
 */
function getThemePreference() {
    return localStorage.getItem('theme') || 'light';
}

/**
 * Initialize theme
 */
function initTheme() {
    const savedTheme = getThemePreference();
    document.documentElement.setAttribute('data-theme', savedTheme);
}

// Initialize theme when script loads
initTheme();
function calculateLoanPayment(principal, rate, years, adminFee = 0) {
    const monthlyRate = rate / 100 / 12;
    const months = years * 12;
    const basePayment = principal * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
    return basePayment + adminFee; // إضافة الرسوم الإدارية للقسط الشهري
}

/**
 * Calculate time to reach savings goal
 */
function calculateTimeToGoal(goal, principal, monthlyContribution, rate) {
    const monthlyRate = rate / 100 / 12;
    let months = 0;
    let balance = principal;
    
    while (balance < goal && months < 600) { // Cap at 50 years
        balance = balance * (1 + monthlyRate) + monthlyContribution;
        months++;
    }
    
    return months;
}

/**
 * Format time in months to years and months
 */
function formatTimeInMonths(months) {
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    
    let result = '';
    
    if (years > 0) {
        result += `${years} year${years !== 1 ? 's' : ''}`;
    }
    
    if (remainingMonths > 0) {
        if (result.length > 0) {
            result += ' and ';
        }
        result += `${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
    }
    
    return result;
}

/**
 * Generate random ID
 */
function generateRandomId(length = 8) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    return result;
}

/**
 * Debounce function to limit how often a function can be called
 */
function debounce(func, wait) {
    let timeout;
