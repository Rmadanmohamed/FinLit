/**
 * Budget Extended Features
 * Implements Annual Budget and Savings Goals functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // Get navigation buttons
    const navButtons = document.querySelectorAll('.calculator-nav .nav-btn');
    
    // Add event listeners to navigation buttons
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            navButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get calculator type from data attribute
            const calculatorType = this.getAttribute('data-calculator');
            
            // Hide all calculator sections
            document.querySelectorAll('.calculator-section').forEach(section => {
                section.style.display = 'none';
            });
            
            // Show selected calculator section
            if (calculatorType === 'monthly') {
                document.getElementById('budget-calculator').style.display = 'block';
            } else if (calculatorType === 'annual') {
                // Create annual budget section if it doesn't exist
                if (!document.getElementById('annual-calculator')) {
                    createAnnualBudgetSection();
                }
                document.getElementById('annual-calculator').style.display = 'block';
            } else if (calculatorType === 'savings') {
                // Create savings goals section if it doesn't exist
                if (!document.getElementById('savings-calculator')) {
                    createSavingsGoalsSection();
                }
                document.getElementById('savings-calculator').style.display = 'block';
            }
        });
    });
    
    // Initialize the Annual Budget and Savings Goals sections
    if (!document.getElementById('annual-calculator')) {
        createAnnualBudgetSection();
    }
    if (!document.getElementById('savings-calculator')) {
        createSavingsGoalsSection();
    }
    
    // Hide the sections initially
    if (document.getElementById('annual-calculator')) {
        document.getElementById('annual-calculator').style.display = 'none';
    }
    if (document.getElementById('savings-calculator')) {
        document.getElementById('savings-calculator').style.display = 'none';
    }
    
    /**
     * Creates the Annual Budget calculator section
     */
    function createAnnualBudgetSection() {
        // Create section container
        const annualSection = document.createElement('div');
        annualSection.id = 'annual-calculator';
        annualSection.className = 'calculator-section';
        
        // Create HTML content
        annualSection.innerHTML = `
            <div class="calculator-layout">
                <div class="calculator-card">
                    <h2><i class="fas fa-calendar-check"></i> Annual Budget Calculator</h2>
                    <p class="description">Plan your yearly finances and track long-term goals</p>
                    
                    <form class="calculator-form" id="annual-form">
                        <div class="form-group">
                            <label><i class="fas fa-money-bill-wave"></i> Annual Income (Before Tax)</label>
                            <div class="input-group">
                                <input type="number" id="annual-salary" placeholder="Yearly Salary & Income" required>
                                <span class="input-suffix">EGP</span>
                            </div>
                        </div>

                        <div class="form-group">
                            <label><i class="fas fa-percentage"></i> Income Tax Rate</label>
                            <div class="input-group">
                                <input type="number" id="annual-tax-rate" value="20" min="0" max="100" step="0.1" required>
                                <span class="input-suffix">%</span>
                            </div>
                        </div>

                        <div class="expense-section">
                            <h3><i class="fas fa-home"></i> Housing & Utilities</h3>
                            <div class="form-group">
                                <input type="number" id="annual-mortgage" placeholder="Yearly Mortgage/Rent">
                                <span class="input-suffix">EGP</span>
                            </div>
                            <div class="form-group">
                                <input type="number" id="annual-utilities" placeholder="Yearly Utilities">
                                <span class="input-suffix">EGP</span>
                            </div>
                        </div>

                        <div class="expense-section">
                            <h3><i class="fas fa-car"></i> Transportation</h3>
                            <div class="form-group">
                                <input type="number" id="annual-car-payment" placeholder="Yearly Car Payment/Transport">
                                <span class="input-suffix">EGP</span>
                            </div>
                            <div class="form-group">
                                <input type="number" id="annual-fuel" placeholder="Yearly Fuel & Maintenance">
                                <span class="input-suffix">EGP</span>
                            </div>
                        </div>

                        <div class="expense-section">
                            <h3><i class="fas fa-utensils"></i> Living Expenses</h3>
                            <div class="form-group">
                                <input type="number" id="annual-groceries" placeholder="Yearly Groceries & Food">
                                <span class="input-suffix">EGP</span>
                            </div>
                            <div class="form-group">
                                <input type="number" id="annual-healthcare" placeholder="Yearly Healthcare & Insurance">
                                <span class="input-suffix">EGP</span>
                            </div>
                        </div>

                        <div class="expense-section">
                            <h3><i class="fas fa-graduation-cap"></i> Education & Development</h3>
                            <div class="form-group">
                                <input type="number" id="annual-education" placeholder="Yearly Tuition & Courses">
                                <span class="input-suffix">EGP</span>
                            </div>
                            <div class="form-group">
                                <input type="number" id="annual-personal-dev" placeholder="Yearly Books & Materials">
                                <span class="input-suffix">EGP</span>
                            </div>
                        </div>

                        <div class="expense-section">
                            <h3><i class="fas fa-piggy-bank"></i> Savings & Investments</h3>
                            <div class="form-group">
                                <input type="number" id="annual-savings" placeholder="Yearly Emergency Fund & Savings">
                                <span class="input-suffix">EGP</span>
                            </div>
                            <div class="form-group">
                                <input type="number" id="annual-investments" placeholder="Yearly Investments">
                                <span class="input-suffix">EGP</span>
                            </div>
                        </div>

                        <button type="submit" class="calculate-btn">
                            <i class="fas fa-calculator"></i> Calculate Annual Budget
                        </button>
                    </form>
                </div>
                
                <div class="results-card" id="annual-results" style="display: none;">
                    <h3><i class="fas fa-chart-bar"></i> Annual Budget Analysis</h3>
                    <div class="results-grid">
                        <div class="result-item">
                            <span class="result-label">Net Annual Income (After Tax)</span>
                            <span class="result-value" id="annual-net-income">EGP 0.00</span>
                        </div>
                        <div class="result-item">
                            <span class="result-label">Total Annual Expenses</span>
                            <span class="result-value" id="annual-total-expenses">EGP 0.00</span>
                        </div>
                        <div class="result-item">
                            <span class="result-label">Annual Savings</span>
                            <span class="result-value" id="annual-savings-amount">EGP 0.00</span>
                        </div>
                        <div class="result-item">
                            <span class="result-label">Monthly Average</span>
                            <span class="result-value" id="monthly-average">EGP 0.00</span>
                        </div>
                    </div>
                    
                    <div class="chart-container">
                        <canvas id="annual-expenses-chart"></canvas>
                    </div>
                    
                    <div class="recommendations" id="annual-recommendations">
                        <h4><i class="fas fa-lightbulb"></i> Annual Budget Recommendations</h4>
                        <div id="annual-recommendations-content"></div>
                    </div>
                </div>
            </div>
        `;
        
        // Add to main content
        document.querySelector('.main-content').appendChild(annualSection);
        
        // Add event listener for form submission
        document.getElementById('annual-form').addEventListener('submit', function(e) {
            e.preventDefault();
            calculateAnnualBudget();
        });
    }
    
    /**
     * Creates the Savings Goals calculator section
     */
    function createSavingsGoalsSection() {
        // Create section container
        const savingsSection = document.createElement('div');
        savingsSection.id = 'savings-calculator';
        savingsSection.className = 'calculator-section';
        
        // Create HTML content
        savingsSection.innerHTML = `
            <div class="calculator-layout">
                <div class="calculator-card">
                    <h2><i class="fas fa-piggy-bank"></i> Savings Goals Calculator</h2>
                    <p class="description">Plan and track your progress toward financial goals</p>
                    
                    <form class="calculator-form" id="savings-goals-form">
                        <div class="form-group">
                            <label><i class="fas fa-bullseye"></i> Goal Name</label>
                            <input type="text" id="goal-name" placeholder="e.g., Home Down Payment, Emergency Fund" required>
                        </div>
                        
                        <div class="form-group">
                            <label><i class="fas fa-money-bill-wave"></i> Target Amount</label>
                            <div class="input-group">
                                <input type="number" id="goal-amount" placeholder="Goal Amount" required>
                                <span class="input-suffix">EGP</span>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label><i class="fas fa-calendar-alt"></i> Time Frame</label>
                            <div class="input-group">
                                <input type="number" id="goal-months" placeholder="Number of Months" required>
                                <span class="input-suffix">months</span>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label><i class="fas fa-dollar-sign"></i> Current Savings</label>
                            <div class="input-group">
                                <input type="number" id="current-savings" placeholder="Current Amount Saved" value="0">
                                <span class="input-suffix">EGP</span>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label><i class="fas fa-percentage"></i> Expected Interest Rate</label>
                            <div class="input-group">
                                <input type="number" id="goal-interest" value="5" min="0" max="100" step="0.1">
                                <span class="input-suffix">%</span>
                            </div>
                        </div>
                        
                        <button type="submit" class="calculate-btn">
                            <i class="fas fa-calculator"></i> Calculate Savings Plan
                        </button>
                    </form>
                </div>
                
                <div class="results-card" id="savings-goals-results" style="display: none;">
                    <h3><i class="fas fa-bullseye"></i> <span id="goal-name-display">Savings</span> Plan</h3>
                    <div class="results-grid">
                        <div class="result-item">
                            <span class="result-label">Required Monthly Contribution</span>
                            <span class="result-value" id="required-monthly">EGP 0.00</span>
                        </div>
                        <div class="result-item">
                            <span class="result-label">Total Contributions</span>
                            <span class="result-value" id="goal-total-contributions">EGP 0.00</span>
                        </div>
                        <div class="result-item">
                            <span class="result-label">Interest Earned</span>
                            <span class="result-value" id="goal-interest-earned">EGP 0.00</span>
                        </div>
                        <div class="result-item">
                            <span class="result-label">Completion Date</span>
                            <span class="result-value" id="completion-date">-</span>
                        </div>
                    </div>
                    
                    <div class="chart-container">
                        <canvas id="savings-goal-chart"></canvas>
                    </div>
                    
                    <div class="goal-progress">
                        <h4><i class="fas fa-tasks"></i> Goal Progress</h4>
                        <div class="progress-bar-container">
                            <div class="progress-bar" id="goal-progress-bar"></div>
                        </div>
                        <div class="progress-text">
                            <span id="progress-percentage">0%</span> complete
                            (<span id="current-saved">EGP 0</span> of <span id="target-amount">EGP 0</span>)
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Add to main content
        document.querySelector('.main-content').appendChild(savingsSection);
        
        // Add event listener for form submission
        document.getElementById('savings-goals-form').addEventListener('submit', function(e) {
            e.preventDefault();
            calculateSavingsGoal();
        });
    }
    
    /**
     * Calculates annual budget based on form inputs
     */
    function calculateAnnualBudget() {
        // Get annual income and tax rate
        const annualSalary = parseFloat(document.getElementById('annual-salary').value) || 0;
        const taxRate = parseFloat(document.getElementById('annual-tax-rate').value) || 0;

        // Calculate net income after tax
        const netIncome = annualSalary * (1 - taxRate / 100);

        // Get all annual expenses
        const expenses = {
            housing: {
                mortgage: parseFloat(document.getElementById('annual-mortgage').value) || 0,
                utilities: parseFloat(document.getElementById('annual-utilities').value) || 0
            },
            transportation: {
                carPayment: parseFloat(document.getElementById('annual-car-payment').value) || 0,
                fuel: parseFloat(document.getElementById('annual-fuel').value) || 0
            },
            living: {
                groceries: parseFloat(document.getElementById('annual-groceries').value) || 0,
                healthcare: parseFloat(document.getElementById('annual-healthcare').value) || 0
            },
            education: {
                tuition: parseFloat(document.getElementById('annual-education').value) || 0,
                materials: parseFloat(document.getElementById('annual-personal-dev').value) || 0
            },
            savings: {
                emergency: parseFloat(document.getElementById('annual-savings').value) || 0,
                investments: parseFloat(document.getElementById('annual-investments').value) || 0
            }
        };

        // Calculate total expenses by category
        const totalsByCategory = {
            'Housing & Utilities': expenses.housing.mortgage + expenses.housing.utilities,
            'Transportation': expenses.transportation.carPayment + expenses.transportation.fuel,
            'Living Expenses': expenses.living.groceries + expenses.living.healthcare,
            'Education': expenses.education.tuition + expenses.education.materials,
            'Savings & Investments': expenses.savings.emergency + expenses.savings.investments
        };

        // Calculate totals
        const totalExpenses = Object.values(totalsByCategory).reduce((a, b) => a + b, 0);
        const annualSavings = netIncome - totalExpenses;
        const monthlyAverage = annualSavings / 12;

        // Update results
        document.getElementById('annual-net-income').textContent = formatCurrency(netIncome);
        document.getElementById('annual-total-expenses').textContent = formatCurrency(totalExpenses);
        document.getElementById('annual-savings-amount').textContent = formatCurrency(annualSavings);
        document.getElementById('monthly-average').textContent = formatCurrency(monthlyAverage);

        // Generate recommendations
        generateAnnualRecommendations(netIncome, totalExpenses, totalsByCategory);

        // Update chart
        updateAnnualExpensesChart(totalsByCategory);

        // Show results
        document.getElementById('annual-results').style.display = 'block';
        document.getElementById('annual-results').scrollIntoView({ behavior: 'smooth' });
    }
    
    /**
     * Updates the annual expenses chart
     */
    function updateAnnualExpensesChart(expenses) {
        const ctx = document.getElementById('annual-expenses-chart').getContext('2d');

        // Destroy existing chart if it exists
        if (window.annualExpensesChart) {
            window.annualExpensesChart.destroy();
        }

        // Create new chart
        window.annualExpensesChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(expenses),
                datasets: [{
                    data: Object.values(expenses),
                    backgroundColor: [
                        '#FF6B6B',
                        '#4ECDC4',
                        '#45B7D1',
                        '#96CEB4',
                        '#FECA57'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            font: {
                                family: 'Inter'
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const value = context.raw;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((value / total) * 100).toFixed(1);
                                return `${context.label}: ${formatCurrency(value)} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }
    
    /**
     * Generates recommendations based on annual budget
     */
    function generateAnnualRecommendations(income, expenses, categories) {
        const recommendations = [];
        const savingsRate = ((income - expenses) / income) * 100;

        // Check overall financial health
        if (expenses > income) {
            recommendations.push({
                type: 'warning',
                text: 'Your annual expenses exceed your income. Consider creating a more sustainable long-term budget.'
            });
        }

        // Check savings rate
        if (savingsRate < 15) {
            recommendations.push({
                type: 'info',
                text: 'Your annual savings rate is below 15%. Consider setting aside more for long-term financial goals.'
            });
        } else if (savingsRate >= 20) {
            recommendations.push({
                type: 'success',
                text: 'Excellent! Your annual savings rate exceeds 20%, which is great for long-term financial health.'
            });
        }

        // Check retirement savings
        if ((categories['Savings & Investments'] / income) * 100 < 10) {
            recommendations.push({
                type: 'info',
                text: 'Consider increasing your retirement contributions to at least 10-15% of your annual income.'
            });
        }

        // Display recommendations
        const recommendationsContainer = document.getElementById('annual-recommendations-content');
        recommendationsContainer.innerHTML = recommendations.map(rec => `
            <div class="recommendation ${rec.type}">
                <i class="fas ${getRecommendationIcon(rec.type)}"></i>
                <p>${rec.text}</p>
            </div>
        `).join('');
    }
    
    /**
     * Calculates savings goal plan
     */
    function calculateSavingsGoal() {
        // Get form values
        const goalName = document.getElementById('goal-name').value;
        const goalAmount = parseFloat(document.getElementById('goal-amount').value) || 0;
        const goalMonths = parseInt(document.getElementById('goal-months').value) || 0;
        const currentSavings = parseFloat(document.getElementById('current-savings').value) || 0;
        const interestRate = parseFloat(document.getElementById('goal-interest').value) || 0;
        
        // Calculate remaining amount needed
        const remainingAmount = goalAmount - currentSavings;
        
        // Calculate monthly interest rate
        const monthlyRate = interestRate / 100 / 12;
        
        // Calculate required monthly contribution
        let monthlyContribution = 0;
        if (monthlyRate === 0) {
            // Simple division if no interest
            monthlyContribution = remainingAmount / goalMonths;
        } else {
            // Formula for future value with regular contributions
            monthlyContribution = remainingAmount * (monthlyRate / ((Math.pow(1 + monthlyRate, goalMonths) - 1)));
        }
        
        // Calculate total contributions
        const totalContributions = monthlyContribution * goalMonths;
        
        // Calculate interest earned
        const futureValue = calculateFutureValue(currentSavings, monthlyContribution, monthlyRate, goalMonths);
        const interestEarned = futureValue - currentSavings - totalContributions;
        
        // Calculate completion date
        const today = new Date();
        const completionDate = new Date(today.setMonth(today.getMonth() + goalMonths));
        
        // Calculate progress percentage
        const progressPercentage = (currentSavings / goalAmount) * 100;
        
        // Update results
        document.getElementById('goal-name-display').textContent = goalName || 'Savings';
        document.getElementById('required-monthly').textContent = formatCurrency(monthlyContribution);
        document.getElementById('goal-total-contributions').textContent = formatCurrency(totalContributions);
        document.getElementById('goal-interest-earned').textContent = formatCurrency(interestEarned);
        document.getElementById('completion-date').textContent = formatDate(completionDate);
        
        // Update progress bar
        document.getElementById('progress-percentage').textContent = `${progressPercentage.toFixed(1)}%`;
        document.getElementById('goal-progress-bar').style.width = `${progressPercentage}%`;
        document.getElementById('current-saved').textContent = formatCurrency(currentSavings);
        document.getElementById('target-amount').textContent = formatCurrency(goalAmount);
        
        // Update chart
        updateSavingsGoalChart(currentSavings, monthlyContribution, monthlyRate, goalMonths, goalAmount);
        
        // Show results
        document.getElementById('savings-goals-results').style.display = 'block';
        document.getElementById('savings-goals-results').scrollIntoView({ behavior: 'smooth' });
    }
    
    /**
     * Updates the savings goal chart
     */
    function updateSavingsGoalChart(initialAmount, monthlyContribution, monthlyRate, months, targetAmount) {
        const ctx = document.getElementById('savings-goal-chart').getContext('2d');
        
        // Generate data for chart
        const labels = [];
        const balanceData = [];
        const contributionsData = [];
        const targetData = [];
        
        let runningBalance = initialAmount;
        let totalContributions = 0;
        
        // Generate data points for each month
        for (let i = 0; i <= months; i++) {
            // Add label for every 3 months or first/last month
            if (i % 3 === 0 || i === 0 || i === months) {
                labels.push(`Month ${i}`);
            } else {
                labels.push('');
            }
            
            // Add data points
            balanceData.push(runningBalance);
            contributionsData.push(initialAmount + totalContributions);
            targetData.push(targetAmount);
            
            // Update for next month
            if (i < months) {
                runningBalance = runningBalance * (1 + monthlyRate) + monthlyContribution;
                totalContributions += monthlyContribution;
            }
        }
        
        // Destroy existing chart if it exists
        if (window.savingsGoalChart) {
            window.savingsGoalChart.destroy();
        }
        
        // Create new chart
        window.savingsGoalChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Projected Balance',
                        data: balanceData,
                        borderColor: '#4ECDC4',
                        backgroundColor: 'rgba(78, 205, 196, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4
                    },
                    {
                        label: 'Contributions',
                        data: contributionsData,
                        borderColor: '#FF6B6B',
                        backgroundColor: 'rgba(255, 107, 107, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4
                    },
                    {
                        label: 'Target Amount',
                        data: targetData,
                        borderColor: '#FECA57',
                        borderWidth: 2,
                        borderDash: [5, 5],
                        fill: false,
                        pointRadius: 0
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            font: {
                                family: 'Inter'
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.dataset.label}: ${formatCurrency(context.raw)}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            font: {
                                family: 'Inter'
                            }
                        }
                    },
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return formatCurrency(value, true);
                            },
                            font: {
                                family: 'Inter'
                            }
                        }
                    }
                }
            }
        });
    }
    
    /**
     * Calculates future value with regular contributions
     */
    function calculateFutureValue(initialAmount, monthlyContribution, monthlyRate, months) {
        let futureValue = initialAmount;
        
        for (let i = 0; i < months; i++) {
            futureValue = futureValue * (1 + monthlyRate) + monthlyContribution;
        }
        
        return futureValue;
    }
    
    /**
     * Helper function to get recommendation icon
     */
    function getRecommendationIcon(type) {
        switch (type) {
            case 'warning': return 'fa-exclamation-triangle';
            case 'success': return 'fa-check-circle';
            case 'info': return 'fa-info-circle';
            default: return 'fa-info-circle';
        }
    }
    
    /**
     * Helper function to format currency
     */
    function formatCurrency(amount, abbreviated = false) {
        if (abbreviated && amount >= 1000000) {
            return `EGP ${(amount / 1000000).toFixed(1)}M`;
        } else if (abbreviated && amount >= 1000) {
            return `EGP ${(amount / 1000).toFixed(1)}K`;
        }
        return `EGP ${amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
    }
    
    /**
     * Helper function to format date
     */
    function formatDate(date) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString(undefined, options);
    }
});