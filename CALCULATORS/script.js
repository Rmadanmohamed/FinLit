// Loan Calculator JavaScript - Professional Implementation

class LoanCalculator {
    constructor() {
        this.initializeEventListeners();
        this.charts = {};
    }

    initializeEventListeners() {
        // Navigation buttons
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchCalculator(e));
        });

        // Form submissions
        document.getElementById('amortized-form').addEventListener('submit', (e) => this.calculateAmortized(e));
        document.getElementById('deferred-form').addEventListener('submit', (e) => this.calculateDeferred(e));
        document.getElementById('bond-form').addEventListener('submit', (e) => this.calculateBond(e));

        // Modal controls
        document.getElementById('show-amortization-table').addEventListener('click', () => this.showAmortizationTable());
        document.getElementById('close-modal').addEventListener('click', () => this.closeModal());
        document.getElementById('amortization-modal').addEventListener('click', (e) => {
            if (e.target.id === 'amortization-modal') this.closeModal();
        });

        // Real-time input validation
        this.setupInputValidation();
    }

    setupInputValidation() {
        const inputs = document.querySelectorAll('input[type="number"]');
        inputs.forEach(input => {
            input.addEventListener('input', (e) => {
                this.validateInput(e.target);
            });
        });
    }

    validateInput(input) {
        const value = parseFloat(input.value);
        const min = parseFloat(input.min) || 0;
        const max = parseFloat(input.max) || Infinity;

        if (value < min) {
            input.style.borderColor = '#e74c3c';
            input.style.boxShadow = '0 0 0 3px rgba(231, 76, 60, 0.1)';
        } else if (value > max) {
            input.style.borderColor = '#e74c3c';
            input.style.boxShadow = '0 0 0 3px rgba(231, 76, 60, 0.1)';
        } else {
            input.style.borderColor = '#27ae60';
            input.style.boxShadow = '0 0 0 3px rgba(39, 174, 96, 0.1)';
        }
    }

    switchCalculator(e) {
        const targetCalculator = e.currentTarget.dataset.calculator;
        
        // Update navigation buttons
        document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
        e.currentTarget.classList.add('active');
        
        // Update calculator sections
        document.querySelectorAll('.calculator-section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(`${targetCalculator}-calculator`).classList.add('active');
        
        // Hide results
        document.querySelectorAll('.results-card').forEach(card => {
            card.style.display = 'none';
        });
    }

    // Amortized Loan Calculator
    calculateAmortized(e) {
        e.preventDefault();
        
        const loanAmount = parseFloat(document.getElementById('loan-amount').value);
        const years = parseInt(document.getElementById('loan-years').value) || 0;
        const months = parseInt(document.getElementById('loan-months').value) || 0;
        const annualRate = parseFloat(document.getElementById('interest-rate').value) / 100;
        const compoundFreq = parseInt(document.getElementById('compound-frequency').value);
        const paymentFreq = parseInt(document.getElementById('payment-frequency').value);
        
        if (!this.validateAmortizedInputs(loanAmount, years, months, annualRate)) {
            return;
        }
        
        const totalMonths = years * 12 + months;
        const totalPayments = Math.ceil((totalMonths / 12) * paymentFreq);
        
        // Calculate effective interest rate per payment period
        const effectiveRate = this.calculateEffectiveRate(annualRate, compoundFreq, paymentFreq);
        
        // Calculate payment amount using the standard amortization formula
        const paymentAmount = this.calculatePaymentAmount(loanAmount, effectiveRate, totalPayments);
        
        // Generate amortization schedule
        const schedule = this.generateAmortizationSchedule(loanAmount, paymentAmount, effectiveRate, totalPayments);
        
        const totalPaid = paymentAmount * totalPayments;
        const totalInterest = totalPaid - loanAmount;
        
        // Display results
        this.displayAmortizedResults(paymentAmount, totalPaid, totalInterest, schedule);
        
        // Create chart
        this.createAmortizedChart(loanAmount, totalInterest);
        
        // Store schedule for table display
        this.amortizationSchedule = schedule;
        this.paymentAmount = paymentAmount;
    }

    validateAmortizedInputs(amount, years, months, rate) {
        if (amount <= 0) {
            this.showError('Loan amount must be greater than 0');
            return false;
        }
        if (years === 0 && months === 0) {
            this.showError('Loan term must be greater than 0');
            return false;
        }
        if (rate < 0) {
            this.showError('Interest rate cannot be negative');
            return false;
        }
        return true;
    }

    calculateEffectiveRate(annualRate, compoundFreq, paymentFreq) {
        if (annualRate === 0) return 0;
        
        // Convert to effective rate per payment period
        const effectiveAnnualRate = Math.pow(1 + annualRate / compoundFreq, compoundFreq) - 1;
        return Math.pow(1 + effectiveAnnualRate, 1 / paymentFreq) - 1;
    }

    calculatePaymentAmount(principal, rate, numPayments) {
        if (rate === 0) {
            return principal / numPayments;
        }
        
        return principal * (rate * Math.pow(1 + rate, numPayments)) / (Math.pow(1 + rate, numPayments) - 1);
    }

    generateAmortizationSchedule(principal, payment, rate, numPayments) {
        const schedule = [];
        let balance = principal;
        
        for (let i = 1; i <= numPayments; i++) {
            const interestPayment = balance * rate;
            const principalPayment = payment - interestPayment;
            balance = Math.max(0, balance - principalPayment);
            
            schedule.push({
                payment: i,
                paymentAmount: payment,
                principal: principalPayment,
                interest: interestPayment,
                balance: balance
            });
            
            if (balance === 0) break;
        }
        
        return schedule;
    }

    displayAmortizedResults(payment, total, interest, schedule) {
        document.getElementById('payment-amount').textContent = this.formatCurrency(payment);
        document.getElementById('total-payments').textContent = this.formatCurrency(total);
        document.getElementById('total-interest').textContent = this.formatCurrency(interest);
        
        const resultsCard = document.getElementById('amortized-results');
        resultsCard.style.display = 'block';
        resultsCard.classList.add('success-flash');
        
        setTimeout(() => {
            resultsCard.classList.remove('success-flash');
        }, 600);
    }

    createAmortizedChart(principal, interest) {
        const ctx = document.getElementById('amortized-chart').getContext('2d');
        
        if (this.charts.amortized) {
            this.charts.amortized.destroy();
        }
        
        const total = principal + interest;
        const principalPercentage = ((principal / total) * 100).toFixed(1);
        const interestPercentage = ((interest / total) * 100).toFixed(1);
        
        this.charts.amortized = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: [
                    `Principal (${principalPercentage}%)`,
                    `Interest (${interestPercentage}%)`
                ],
                datasets: [{
                    data: [principal, interest],
                    backgroundColor: [
                        'rgba(52, 152, 219, 0.9)',
                        'rgba(255, 107, 107, 0.9)'
                    ],
                    borderColor: [
                        'rgba(52, 152, 219, 1)',
                        'rgba(255, 107, 107, 1)'
                    ],
                    borderWidth: 3,
                    hoverBackgroundColor: [
                        'rgba(52, 152, 219, 1)',
                        'rgba(255, 107, 107, 1)'
                    ],
                    hoverBorderWidth: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '60%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 25,
                            font: {
                                size: 15,
                                weight: '600',
                                family: 'Inter, sans-serif'
                            },
                            color: '#2c3e50',
                            usePointStyle: true,
                            pointStyle: 'circle'
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.9)',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                        borderWidth: 1,
                        cornerRadius: 8,
                        displayColors: true,
                        callbacks: {
                            title: (context) => {
                                return 'Loan Breakdown';
                            },
                            label: (context) => {
                                const label = context.label.split(' (')[0];
                                const value = this.formatCurrency(context.parsed);
                                const percentage = context.label.match(/\((.*?)%\)/)[1];
                                return [
                                    `${label}: ${value}`,
                                    `Percentage: ${percentage}%`
                                ];
                            },
                            footer: (context) => {
                                const total = context.reduce((sum, item) => sum + item.parsed, 0);
                                return `Total: ${this.formatCurrency(total)}`;
                            }
                        }
                    }
                },
                animation: {
                    animateRotate: true,
                    duration: 1500,
                    easing: 'easeInOutQuart'
                },
                interaction: {
                    intersect: false,
                    mode: 'nearest'
                }
            }
        });
    }

    // Deferred Payment Calculator
    calculateDeferred(e) {
        e.preventDefault();
        
        const principal = parseFloat(document.getElementById('deferred-amount').value);
        const years = parseInt(document.getElementById('deferred-years').value) || 0;
        const months = parseInt(document.getElementById('deferred-months').value) || 0;
        const annualRate = parseFloat(document.getElementById('deferred-rate').value) / 100;
        const compoundFreq = parseInt(document.getElementById('deferred-compound').value);
        
        if (!this.validateDeferredInputs(principal, years, months, annualRate)) {
            return;
        }
        
        const totalMonths = years * 12 + months;
        const totalYears = totalMonths / 12;
        
        // Calculate compound interest: A = P(1 + r/n)^(nt)
        const maturityAmount = principal * Math.pow(1 + annualRate / compoundFreq, compoundFreq * totalYears);
        const totalInterest = maturityAmount - principal;
        
        this.displayDeferredResults(maturityAmount, totalInterest, principal);
        this.createDeferredChart(principal, totalInterest);
    }

    validateDeferredInputs(amount, years, months, rate) {
        if (amount <= 0) {
            this.showError('Loan amount must be greater than 0');
            return false;
        }
        if (years === 0 && months === 0) {
            this.showError('Loan term must be greater than 0');
            return false;
        }
        if (rate < 0) {
            this.showError('Interest rate cannot be negative');
            return false;
        }
        return true;
    }

    displayDeferredResults(maturity, interest, principal) {
        document.getElementById('maturity-amount').textContent = this.formatCurrency(maturity);
        document.getElementById('deferred-interest').textContent = this.formatCurrency(interest);
        
        const resultsCard = document.getElementById('deferred-results');
        resultsCard.style.display = 'block';
        resultsCard.classList.add('success-flash');
        
        setTimeout(() => {
            resultsCard.classList.remove('success-flash');
        }, 600);
    }

    createDeferredChart(principal, interest) {
        const ctx = document.getElementById('deferred-chart').getContext('2d');
        
        if (this.charts.deferred) {
            this.charts.deferred.destroy();
        }
        
        const total = principal + interest;
        const principalPercentage = ((principal / total) * 100).toFixed(1);
        const interestPercentage = ((interest / total) * 100).toFixed(1);
        
        this.charts.deferred = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: [
                    `Principal (${principalPercentage}%)`,
                    `Interest (${interestPercentage}%)`
                ],
                datasets: [{
                    data: [principal, interest],
                    backgroundColor: [
                        'rgba(76, 175, 80, 0.9)',
                        'rgba(255, 193, 7, 0.9)'
                    ],
                    borderColor: [
                        'rgba(76, 175, 80, 1)',
                        'rgba(255, 193, 7, 1)'
                    ],
                    borderWidth: 3,
                    hoverBackgroundColor: [
                        'rgba(76, 175, 80, 1)',
                        'rgba(255, 193, 7, 1)'
                    ],
                    hoverBorderWidth: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '60%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 25,
                            font: {
                                size: 15,
                                weight: '600',
                                family: 'Inter, sans-serif'
                            },
                            color: '#2c3e50',
                            usePointStyle: true,
                            pointStyle: 'circle'
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.9)',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                        borderWidth: 1,
                        cornerRadius: 8,
                        displayColors: true,
                        callbacks: {
                            title: (context) => {
                                return 'Deferred Loan Breakdown';
                            },
                            label: (context) => {
                                const label = context.label.split(' (')[0];
                                const value = this.formatCurrency(context.parsed);
                                const percentage = context.label.match(/\((.*?)%\)/)[1];
                                return [
                                    `${label}: ${value}`,
                                    `Percentage: ${percentage}%`
                                ];
                            },
                            footer: (context) => {
                                const total = context.reduce((sum, item) => sum + item.parsed, 0);
                                return `Maturity Amount: ${this.formatCurrency(total)}`;
                            }
                        }
                    }
                },
                animation: {
                    animateRotate: true,
                    duration: 1500,
                    easing: 'easeInOutQuart'
                },
                interaction: {
                    intersect: false,
                    mode: 'nearest'
                }
            }
        });
    }

    // Bond Calculator
    calculateBond(e) {
        e.preventDefault();
        
        const faceValue = parseFloat(document.getElementById('face-value').value);
        const years = parseInt(document.getElementById('bond-years').value) || 0;
        const months = parseInt(document.getElementById('bond-months').value) || 0;
        const annualRate = parseFloat(document.getElementById('bond-rate').value) / 100;
        const compoundFreq = parseInt(document.getElementById('bond-compound').value);
        
        if (!this.validateBondInputs(faceValue, years, months, annualRate)) {
            return;
        }
        
        const totalMonths = years * 12 + months;
        const totalYears = totalMonths / 12;
        
        // Calculate present value: PV = FV / (1 + r/n)^(nt)
        const presentValue = faceValue / Math.pow(1 + annualRate / compoundFreq, compoundFreq * totalYears);
        const totalInterest = faceValue - presentValue;
        
        this.displayBondResults(presentValue, totalInterest, faceValue);
        this.createBondChart(presentValue, totalInterest);
    }

    validateBondInputs(faceValue, years, months, rate) {
        if (faceValue <= 0) {
            this.showError('Face value must be greater than 0');
            return false;
        }
        if (years === 0 && months === 0) {
            this.showError('Loan term must be greater than 0');
            return false;
        }
        if (rate < 0) {
            this.showError('Interest rate cannot be negative');
            return false;
        }
        return true;
    }

    displayBondResults(presentValue, interest, faceValue) {
        document.getElementById('present-value').textContent = this.formatCurrency(presentValue);
        document.getElementById('bond-interest').textContent = this.formatCurrency(interest);
        
        const resultsCard = document.getElementById('bond-results');
        resultsCard.style.display = 'block';
        resultsCard.classList.add('success-flash');
        
        setTimeout(() => {
            resultsCard.classList.remove('success-flash');
        }, 600);
    }

    createBondChart(presentValue, interest) {
        const ctx = document.getElementById('bond-chart').getContext('2d');
        
        if (this.charts.bond) {
            this.charts.bond.destroy();
        }
        
        const total = presentValue + interest;
        const presentValuePercentage = ((presentValue / total) * 100).toFixed(1);
        const interestPercentage = ((interest / total) * 100).toFixed(1);
        
        this.charts.bond = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: [
                    `Present Value (${presentValuePercentage}%)`,
                    `Interest (${interestPercentage}%)`
                ],
                datasets: [{
                    data: [presentValue, interest],
                    backgroundColor: [
                        'rgba(156, 39, 176, 0.9)',
                        'rgba(255, 152, 0, 0.9)'
                    ],
                    borderColor: [
                        'rgba(156, 39, 176, 1)',
                        'rgba(255, 152, 0, 1)'
                    ],
                    borderWidth: 3,
                    hoverBackgroundColor: [
                        'rgba(156, 39, 176, 1)',
                        'rgba(255, 152, 0, 1)'
                    ],
                    hoverBorderWidth: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '60%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 25,
                            font: {
                                size: 15,
                                weight: '600',
                                family: 'Inter, sans-serif'
                            },
                            color: '#2c3e50',
                            usePointStyle: true,
                            pointStyle: 'circle'
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.9)',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                        borderWidth: 1,
                        cornerRadius: 8,
                        displayColors: true,
                        callbacks: {
                            title: (context) => {
                                return 'Bond Investment Breakdown';
                            },
                            label: (context) => {
                                const label = context.label.split(' (')[0];
                                const value = this.formatCurrency(context.parsed);
                                const percentage = context.label.match(/\((.*?)%\)/)[1];
                                return [
                                    `${label}: ${value}`,
                                    `Percentage: ${percentage}%`
                                ];
                            },
                            footer: (context) => {
                                const total = context.reduce((sum, item) => sum + item.parsed, 0);
                                return `Face Value: ${this.formatCurrency(total)}`;
                            }
                        }
                    }
                },
                animation: {
                    animateRotate: true,
                    duration: 1500,
                    easing: 'easeInOutQuart'
                },
                interaction: {
                    intersect: false,
                    mode: 'nearest'
                }
            }
        });
    }

    // Amortization Table
    showAmortizationTable() {
        if (!this.amortizationSchedule) {
            this.showError('Please calculate the loan first');
            return;
        }
        
        const tableBody = document.querySelector('#amortization-table tbody');
        tableBody.innerHTML = '';
        
        this.amortizationSchedule.forEach(row => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${row.payment}</td>
                <td>${this.formatCurrency(row.paymentAmount)}</td>
                <td>${this.formatCurrency(row.principal)}</td>
                <td>${this.formatCurrency(row.interest)}</td>
                <td>${this.formatCurrency(row.balance)}</td>
            `;
            tableBody.appendChild(tr);
        });
        
        document.getElementById('amortization-modal').style.display = 'block';
    }

    closeModal() {
        document.getElementById('amortization-modal').style.display = 'none';
    }

    // Utility Functions
    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    }

    showError(message) {
        // Create error notification
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-notification';
        errorDiv.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i>
            <span>${message}</span>
        `;
        
        // Add error styles
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #e74c3c, #c0392b);
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 10px 25px rgba(231, 76, 60, 0.3);
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 10px;
            font-weight: 500;
            animation: slideInRight 0.3s ease;
        `;
        
        document.body.appendChild(errorDiv);
        
        // Remove after 3 seconds
        setTimeout(() => {
            errorDiv.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (errorDiv.parentNode) {
                    errorDiv.parentNode.removeChild(errorDiv);
                }
            }, 300);
        }, 3000);
    }
}

// Add error notification animations to CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize the calculator when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new LoanCalculator();
    
    // Add loading animation to buttons
    document.querySelectorAll('.calculate-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            this.classList.add('loading');
            setTimeout(() => {
                this.classList.remove('loading');
            }, 1000);
        });
    });
    
    // Add smooth scrolling to results
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                const target = mutation.target;
                if (target.classList.contains('results-card') && target.style.display === 'block') {
                    setTimeout(() => {
                        target.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    }, 100);
                }
            }
        });
    });
    
    document.querySelectorAll('.results-card').forEach(card => {
        observer.observe(card, { attributes: true });
    });
});