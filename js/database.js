// Database Management for FinLit2025
/**
 * DatabaseManager handles all data storage operations for the application
 * It supports both server-side storage (for logged-in users) and local storage (for non-logged in users)
 * It also provides fallback to local storage when server operations fail
 */
class DatabaseManager {
    constructor(authManager) {
        this.apiBaseUrl = window.location.hostname === 'localhost' ? 'http://localhost:3000/api' : '/api';
        this.authManager = authManager;
    }

    // Save calculation data to the server
    async saveCalculation(calculationType, calculationData) {
        if (!this.authManager || !this.authManager.isLoggedIn()) {
            // If not logged in, save to local storage instead
            return this.saveCalculationLocally(calculationType, calculationData);
        }

        try {
            return await this.authManager.saveCalculation(calculationType, calculationData);
        } catch (error) {
            console.error('Error saving calculation to server:', error);
            // Fallback to local storage if server save fails
            return this.saveCalculationLocally(calculationType, calculationData);
        }
    }

    // Save calculation to local storage (for non-logged in users or as fallback)
    saveCalculationLocally(calculationType, calculationData) {
        try {
            const storageKey = `finlit_${calculationType}_calculations`;
            let savedCalculations = JSON.parse(localStorage.getItem(storageKey) || '[]');
            
            const newCalculation = {
                id: Date.now().toString(),
                calculationType,
                calculationData,
                createdAt: new Date().toISOString()
            };
            
            savedCalculations.push(newCalculation);
            
            // Limit to last 20 calculations to prevent localStorage from getting too full
            if (savedCalculations.length > 20) {
                savedCalculations = savedCalculations.slice(-20);
            }
            
            localStorage.setItem(storageKey, JSON.stringify(savedCalculations));
            return newCalculation;
        } catch (error) {
            console.error('Error saving calculation locally:', error);
            throw error;
        }
    }

    // Get all calculations of a specific type
    async getCalculations(calculationType) {
        if (!this.authManager || !this.authManager.isLoggedIn()) {
            // If not logged in, get from local storage
            return this.getLocalCalculations(calculationType);
        }

        try {
            const allCalculations = await this.authManager.getUserCalculations();
            // Filter by calculation type
            return allCalculations.filter(calc => calc.calculationType === calculationType);
        } catch (error) {
            console.error('Error getting calculations from server:', error);
            // Fallback to local storage
            return this.getLocalCalculations(calculationType);
        }
    }

    // Get calculations from local storage
    getLocalCalculations(calculationType) {
        try {
            const storageKey = `finlit_${calculationType}_calculations`;
            return JSON.parse(localStorage.getItem(storageKey) || '[]');
        } catch (error) {
            console.error('Error getting local calculations:', error);
            return [];
        }
    }

    // Delete a calculation
    async deleteCalculation(calculationId, calculationType) {
        if (!this.authManager || !this.authManager.isLoggedIn()) {
            // If not logged in, delete from local storage
            return this.deleteLocalCalculation(calculationId, calculationType);
        }

        try {
            return await this.authManager.deleteCalculation(calculationId);
        } catch (error) {
            console.error('Error deleting calculation from server:', error);
            throw error;
        }
    }

    // Delete a calculation from local storage
    deleteLocalCalculation(calculationId, calculationType) {
        try {
            const storageKey = `finlit_${calculationType}_calculations`;
            let savedCalculations = JSON.parse(localStorage.getItem(storageKey) || '[]');
            
            savedCalculations = savedCalculations.filter(calc => calc.id !== calculationId);
            
            localStorage.setItem(storageKey, JSON.stringify(savedCalculations));
            return true;
        } catch (error) {
            console.error('Error deleting local calculation:', error);
            throw error;
        }
    }

    // Clear all local data (used during logout)
    clearLocalData() {
        const calculationTypes = ['savings', 'loan', 'budget', 'goal', 'comparison'];
        calculationTypes.forEach(type => {
            localStorage.removeItem(`finlit_${type}_calculations`);
        });
    }
}

// DatabaseManager will be instantiated in account.js with the authManager instance