/**
 * Digital Financial Literacy & Inclusion Platform
 * Budget Calculator - Annual Budget and Savings Goals Implementation
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the budget calculator
    initBudgetCalculator();
});

/**
 * Initialize the budget calculator
 */
function initBudgetCalculator() {
    // Get all input elements
    const inputs = document.querySelectorAll('.calculator-form input[type="number"]');
    
    // Add event listeners to all inputs
    inputs.forEach(input => {
        input.addEventListener('input', updateCalculations);
    });
    
    // Add event listeners to buttons
    document.getElementById('calculate-btn').addEventListener('click', calculateBudget);
    document.getElementById('reset-btn').addEventListener('click', resetCalculator);
    document.getElementById('save-btn').addEventListener('click', saveBudget);
    
    // Add Annual Budget and Savings Goals sections
    addAnnualBudgetSection();
    addSavingsGoalsSection();
}

/**
 * Add Annual Budget section to the calculator
 */
function addAnnualBudgetSection() {
    // Create Annual Budget section
    const annualBudgetSection = document.createElement('div');
    annualBudgetSection.className = 'form-section annual-budget-section';
    annualBudgetSection.innerHTML = `
        <h3><i class="fas fa-calendar-alt"></i> Annual Budget</h3>
        <div class="annual-budget-container">
            <div class="annual-summary">
                <div class="annual-item">
                    <span>Annual Income:</span>
                    <span id="annual-income" class="annual-amount">$0.00</span>
                </div>
                <div class="annual-item">
                    <span>Annual Expenses:</span>
                    <span id="annual-expenses" class="annual-amount">$0.00</span>
                </div>
                <div class="annual-item balance">
                    <span>Annual Savings:</span>
                    <span id="annual-savings" class="annual-amount">$0.00</span>
                </div>
                <div class="annual-item">
                    <span>Savings Rate:</span>
                    <span id="savings-rate" class="annual-amount">0%</span>
                </div>
            </div>
            <div class="annual-chart-container">
                <canvas id="annual-budget-chart"></canvas>
            </div>
        </div>
    `;
    
    // Insert before the calculator actions
    const calculatorActions = document.querySelector('.calculator-actions');
    calculatorActions.parentNode.insertBefore(annualBudgetSection, calculatorActions);
    
    // Add styles for Annual Budget section
    const style = document.createElement('style');
    style.textContent = `
        .annual-budget-section {
            margin-top: 30px;
            border-top: 1px solid #e9ecef;
            padding-top: 20px;
        }
        
        .annual-budget-container {
            display: flex;
            flex-wrap: wrap;
            gap: 20px;
            margin-top: 15px;
        }
        
        .annual-summary {
            flex: 1;
            min-width: 250px;
            background-color: #f8f9fa;
            border-radius: 10px;
            padding: 15px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
        }
        
        .annual-item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            padding-bottom: 10px;
            border-bottom: 1px solid #e9ecef;
        }
        
        .annual-item:last-child {
            border-bottom: none;
            margin-bottom: 0;
            padding-bottom: 0;
        }
        
        .annual-item.balance {
            font-weight: bold;
            color: var(--primary-color);
        }
        
        .annual-amount {
            font-weight: 600;
        }
        
        .annual-chart-container {
            flex: 2;
            min-width: 300px;
            height: 200px;
            background-color: #fff;
            border-radius: 10px;
            padding: 15px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
        }
        
        @media (max-width: 768px) {
            .annual-budget-container {
                flex-direction: column;
            }
            
            .annual-chart-container {
                height: 250px;
            }
        }
    `;
    document.head.appendChild(style);
}

/**
 * Add Savings Goals section to the calculator
 */
function addSavingsGoalsSection() {
    // Create Savings Goals section
    const savingsGoalsSection = document.createElement('div');
    savingsGoalsSection.className = 'form-section savings-goals-section';
    savingsGoalsSection.innerHTML = `
        <h3><i class="fas fa-bullseye"></i> Savings Goals</h3>
        <div class="savings-goals-container">
            <div class="savings-goals-form">
                <div class="form-group">
                    <label for="savings-goal-amount">Goal Amount</label>
                    <div class="input-with-icon">
                        <i class="fas fa-dollar-sign"></i>
                        <input type="number" id="savings-goal-amount" placeholder="0.00" min="0" step="0.01">
                    </div>
                </div>
                <div class="form-group">
                    <label for="savings-goal-period">Time Period (months)</label>
                    <div class="input-with-icon">
                        <i class="fas fa-calendar"></i>
                        <input type="number" id="savings-goal-period" placeholder="12" min="1" step="1" value="12">
                    </div>
                </div>
                <div class="form-group">
                    <label for="savings-goal-interest">Annual Interest Rate (%)</label>
                    <div class="input-with-icon">
                        <i class="fas fa-percentage"></i>
                        <input type="number" id="savings-goal-interest" placeholder="0.00" min="0" step="0.01" value="0">
                    </div>
                </div>
                <button id="calculate-savings-btn" class="btn btn-secondary">
                    <i class="fas fa-calculator"></i> Calculate
                </button>
            </div>
            <div class="savings-goals-results">
                <div class="savings-result-item">
                    <span>Monthly Contribution:</span>
                    <span id="monthly-contribution" class="savings-result-value">$0.00</span>
                </div>
                <div class="savings-result-item">
                    <span>Total Contributions:</span>
                    <span id="total-contributions" class="savings-result-value">$0.00</span>
                </div>
                <div class="savings-result-item">
                    <span>Interest Earned:</span>
                    <span id="interest-earned" class="savings-result-value">$0.00</span>
                </div>
                <div class="savings-result-item">
                    <span>Final Balance:</span>
                    <span id="final-balance" class="savings-result-value">$0.00</span>
                </div>
                <div class="savings-schedule-link">
                    <a href="#" id="view-schedule-link">View Contribution Schedule</a>
                </div>
            </div>
        </div>
        <div class="savings-schedule" id="savings-schedule" style="display: none;">
            <h4>Contribution Schedule</h4>
            <div class="schedule-container">
                <table class="schedule-table">
                    <thead>
                        <tr>
                            <th>Month</th>
                            <th>Starting Balance</th>
                            <th>Contribution</th>
                            <th>Interest</th>
                            <th>Ending Balance</th>
                        </tr>
                    </thead>
                    <tbody id="schedule-body">
                        <!-- Schedule will be populated here -->
                    </tbody>
                </table>
            </div>
        </div>
    `;
    
    // Insert before the calculator actions
    const calculatorActions = document.querySelector('.calculator-actions');
    calculatorActions.parentNode.insertBefore(savingsGoalsSection, calculatorActions);
    
    // Add event listeners for Savings Goals
    setTimeout(() => {
        document.getElementById('calculate-savings-btn').addEventListener('click', calculateSavingsGoal);
        document.getElementById('view-schedule-link').addEventListener('click', function(e) {
            e.preventDefault();
            toggleSavingsSchedule();
        });
    }, 100);
    
    // Add styles for Savings Goals section
    const style = document.createElement('style');
    style.textContent = `
        .savings-goals-section {
            margin-top: 30px;
            border-top: 1px solid #e9ecef;
            padding-top: 20px;
        }
        
        .savings-goals-container {
            display: flex;
            flex-wrap: wrap;
            gap: 20px;
            margin-top: 15px;
        }
        
        .savings-goals-form {
            flex: 1;
            min-width: 250px;
            background-color: #f8f9fa;
            border-radius: 10px;
            padding: 15px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
        }
        
        .savings-goals-results {
            flex: 1;
            min-width: 250px;
            background-color: #f8f9fa;
            border-radius: 10px;
            padding: 15px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
        }
        
        .savings-result-item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            padding-bottom: 10px;
            border-bottom: 1px solid #e9ecef;
        }
        
        .savings-result-item:last-of-type {
            font-weight: bold;
            color: var(--primary-color);
        }
        
        .savings-result-value {
            font-weight: 600;
        }
        
        .savings-schedule-link {
            margin-top: 15px;
            text-align: center;
        }
        
        .savings-schedule-link a {
            color: var(--primary-color);
            text-decoration: none;
            font-weight: 500;
            display: inline-flex;
            align-items: center;
            gap: 5px;
        }
        
        .savings-schedule-link a:hover {
            text-decoration: underline;
        }
        
        .savings-schedule {
            margin-top: 20px;
            background-color: #fff;
            border-radius: 10px;
            padding: 15px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
        }
        
        .schedule-container {
            overflow-x: auto;
            margin-top: 15px;
        }
        
        .schedule-table {
            width: 100%;
            border-collapse: collapse;
        }
        
        .schedule-table th, .schedule-table td {
            padding: 10px;
            text-align: right;
            border-bottom: 1px solid #e9ecef;
        }
        
        .schedule-table th {
            background-color: #f8f9fa;
            font-weight: 600;
            text-align: center;
        }
        
        .schedule-table tr:last-child td {
            border-bottom: none;
            font-weight: bold;
        }
        
        @media (max-width: 768px) {
            .savings-goals-container {
                flex-direction: column;
            }
        }
    `;
    document.head.appendChild(style);
}

/**
 * Update calculations when inputs change
 */
function updateCalculations() {
    // Calculate total income
    const salary = parseFloat(document.getElementById('salary').value) || 0;
    const additionalIncome = parseFloat(document.getElementById('additional-income').value) || 0;
    const totalIncome = salary + additionalIncome;
    
    // Update total income display
    document.getElementById('total-income').textContent = formatCurrency(totalIncome);
    document.getElementById('summary-income').textContent = formatCurrency(totalIncome);
    
    // Calculate total expenses
    const rent = parseFloat(document.getElementById('rent').value) || 0;
    const utilities = parseFloat(document.getElementById('utilities').value) || 0;
    const internet = parseFloat(document.getElementById('internet').value) || 0;
    const groceries = parseFloat(document.getElementById('groceries').value) || 0;
    const transportation = parseFloat(document.getElementById('transportation').value) || 0;
    const entertainment = parseFloat(document.getElementById('entertainment').value) || 0;
    const healthInsurance = parseFloat(document.getElementById('health-insurance').value) || 0;
    const lifeInsurance = parseFloat(document.getElementById('life-insurance').value) || 0;
    const creditCard = parseFloat(document.getElementById('credit-card').value) || 0;
    const loans = parseFloat(document.getElementById('loans').value) || 0;
    const emergencyFund = parseFloat(document.getElementById('emergency-fund').value) || 0;
    const retirement = parseFloat(document.getElementById('retirement').value) || 0;
    const investments = parseFloat(document.getElementById('investments').value) || 0;
    const otherExpenses = parseFloat(document.getElementById('other-expenses').value) || 0;
    
    const totalExpenses = rent + utilities + internet + groceries + transportation + 
                          entertainment + healthInsurance + lifeInsurance + creditCard + 
                          loans + emergencyFund + retirement + investments + otherExpenses;
    
    // Update total expenses display
    document.getElementById('total-expenses').textContent = formatCurrency(totalExpenses);
    
    // Calculate monthly balance
    const monthlyBalance = totalIncome - totalExpenses;
    
    // Update monthly balance display
    document.getElementById('monthly-balance').textContent = formatCurrency(monthlyBalance);
    
    // Update Annual Budget section
    updateAnnualBudget(totalIncome, totalExpenses, monthlyBalance);
}

/**
 * Update Annual Budget section
 */
function updateAnnualBudget(monthlyIncome, monthlyExpenses, monthlyBalance) {
    // Calculate annual values
    const annualIncome = monthlyIncome * 12;
    const annualExpenses = monthlyExpenses * 12;
    const annualSavings = monthlyBalance * 12;
    
    // Calculate savings rate
    const savingsRate = monthlyIncome > 0 ? (monthlyBalance / monthlyIncome) * 100 : 0;
    
    // Update annual budget display
    document.getElementById('annual-income').textContent = formatCurrency(annualIncome);
    document.getElementById('annual-expenses').textContent = formatCurrency(annualExpenses);
    document.getElementById('annual-savings').textContent = formatCurrency(annualSavings);
    document.getElementById('savings-rate').textContent = formatPercentage(savingsRate);
    
    // Update annual budget chart
    updateAnnualBudgetChart(annualIncome, annualExpenses, annualSavings);
}

/**
 * Update Annual Budget Chart
 */
function updateAnnualBudgetChart(annualIncome, annualExpenses, annualSavings) {
    const ctx = document.getElementById('annual-budget-chart');
    
    // Check if chart already exists
    if (window.annualBudgetChart) {
        window.annualBudgetChart.destroy();
    }
    
    // Create data for chart
    const data = {
        labels: ['Income', 'Expenses', 'Savings'],
        datasets: [{
            data: [annualIncome, annualExpenses, Math.max(0, annualSavings)],
            backgroundColor: [
                'rgba(102, 126, 234, 0.7)',
                'rgba(255, 107, 107, 0.7)',
                'rgba(78, 205, 196, 0.7)'
            ],
            borderColor: [
                'rgba(102, 126, 234, 1)',
                'rgba(255, 107, 107, 1)',
                'rgba(78, 205, 196, 1)'
            ],
            borderWidth: 1
        }]
    };
    
    // Chart configuration
    const config = {
        type: 'bar',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return formatCurrency(context.parsed.y);
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return formatCurrency(value, true);
                        }
                    }
                }
            }
        }
    };
    
    // Create chart
    window.annualBudgetChart = new Chart(ctx, config);
}

/**
 * Calculate Savings Goal
 */
function calculateSavingsGoal() {
    // Get input values
    const goalAmount = parseFloat(document.getElementById('savings-goal-amount').value) || 0;
    const months = parseInt(document.getElementById('savings-goal-period').value) || 12;
    const annualInterestRate = parseFloat(document.getElementById('savings-goal-interest').value) || 0;
    
    // Calculate monthly interest rate
    const monthlyInterestRate = annualInterestRate / 100 / 12;
    
    // Calculate monthly contribution (using formula from calculator.net)
    let monthlyContribution;
    if (monthlyInterestRate === 0) {
        // Simple division if no interest
        monthlyContribution = goalAmount / months;
    } else {
        // Formula for monthly payment with interest
        monthlyContribution = goalAmount * (monthlyInterestRate / (Math.pow(1 + monthlyInterestRate, months) - 1));
    }
    
    // Calculate total contributions
    const totalContributions = monthlyContribution * months;
    
    // Calculate interest earned
    const interestEarned = goalAmount - totalContributions;
    
    // Update results display
    document.getElementById('monthly-contribution').textContent = formatCurrency(monthlyContribution);
    document.getElementById('total-contributions').textContent = formatCurrency(totalContributions);
    document.getElementById('interest-earned').textContent = formatCurrency(interestEarned);
    document.getElementById('final-balance').textContent = formatCurrency(goalAmount);
    
    // Generate contribution schedule
    generateSavingsSchedule(monthlyContribution, months, monthlyInterestRate);
}

/**
 * Generate Savings Schedule
 */
function generateSavingsSchedule(monthlyContribution, months, monthlyInterestRate) {
    const scheduleBody = document.getElementById('schedule-body');
    scheduleBody.innerHTML = '';
    
    let balance = 0;
    
    for (let i = 1; i <= months; i++) {
        const startingBalance = balance;
        const interest = startingBalance * monthlyInterestRate;
        balance = startingBalance + monthlyContribution + interest;
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${i}</td>
            <td>${formatCurrency(startingBalance)}</td>
            <td>${formatCurrency(monthlyContribution)}</td>
            <td>${formatCurrency(interest)}</td>
            <td>${formatCurrency(balance)}</td>
        `;
        
        scheduleBody.appendChild(row);
    }
}

/**
 * Toggle Savings Schedule visibility
 */
function toggleSavingsSchedule() {
    const schedule = document.getElementById('savings-schedule');
    const link = document.getElementById('view-schedule-link');
    
    if (schedule.style.display === 'none') {
        schedule.style.display = 'block';
        link.textContent = 'Hide Contribution Schedule';
    } else {
        schedule.style.display = 'none';
        link.textContent = 'View Contribution Schedule';
    }
}

/**
 * Calculate Budget
 */
function calculateBudget() {
    updateCalculations();
    
    // Calculate category percentages
    const totalExpenses = parseFloat(document.getElementById('total-expenses').textContent.replace(/[^0-9.-]+/g, '')) || 0;
    
    if (totalExpenses > 0) {
        // Housing expenses
        const housingExpenses = (
            (parseFloat(document.getElementById('rent').value) || 0) +
            (parseFloat(document.getElementById('utilities').value) || 0) +
            (parseFloat(document.getElementById('internet').value) || 0)
        );
        const housingPercent = (housingExpenses / totalExpenses) * 100;
        
        // Living expenses
        const livingExpenses = (
            (parseFloat(document.getElementById('groceries').value) || 0) +
            (parseFloat(document.getElementById('transportation').value) || 0) +
            (parseFloat(document.getElementById('entertainment').value) || 0)
        );
        const livingPercent = (livingExpenses / totalExpenses) * 100;
        
        // Health expenses
        const healthExpenses = (
            (parseFloat(document.getElementById('health-insurance').value) || 0) +
            (parseFloat(document.getElementById('life-insurance').value) || 0)
        );
        const healthPercent = (healthExpenses / totalExpenses) * 100;
        
        // Debt expenses
        const debtExpenses = (
            (parseFloat(document.getElementById('credit-card').value) || 0) +
            (parseFloat(document.getElementById('loans').value) || 0)
        );
        const debtPercent = (debtExpenses / totalExpenses) * 100;
        
        // Savings expenses
        const savingsExpenses = (
            (parseFloat(document.getElementById('emergency-fund').value) || 0) +
            (parseFloat(document.getElementById('retirement').value) || 0) +
            (parseFloat(document.getElementById('investments').value) || 0)
        );
        const savingsPercent = (savingsExpenses / totalExpenses) * 100;
        
        // Other expenses
        const otherExpenses = parseFloat(document.getElementById('other-expenses').value) || 0;
        const otherPercent = (otherExpenses / totalExpenses) * 100;
        
        // Update percentage displays
        document.getElementById('housing-percent').textContent = formatPercentage(housingPercent);
        document.getElementById('living-percent').textContent = formatPercentage(livingPercent);
        document.getElementById('health-percent').textContent = formatPercentage(healthPercent);
        document.getElementById('debt-percent').textContent = formatPercentage(debtPercent);
        document.getElementById('savings-percent').textContent = formatPercentage(savingsPercent);
        document.getElementById('other-percent').textContent = formatPercentage(otherPercent);
        
        // Update progress bars
        document.querySelector('.bar-fill.housing').style.width = `${housingPercent}%`;
        document.querySelector('.bar-fill.living').style.width = `${livingPercent}%`;
        document.querySelector('.bar-fill.health').style.width = `${healthPercent}%`;
        document.querySelector('.bar-fill.debt').style.width = `${debtPercent}%`;
        document.querySelector('.bar-fill.savings').style.width = `${savingsPercent}%`;
        document.querySelector('.bar-fill.other').style.width = `${otherPercent}%`;
        
        // Update expense chart
        updateExpenseChart(housingExpenses, livingExpenses, healthExpenses, debtExpenses, savingsExpenses, otherExpenses);
        
        // Generate recommendations
        generateRecommendations(housingPercent, livingPercent, debtPercent, savingsPercent);
    }
}

/**
 * Update Expense Chart
 */
function updateExpenseChart(housing, living, health, debt, savings, other) {
    const ctx = document.getElementById('expense-chart');
    
    // Check if chart already exists
    if (window.expenseChart) {
        window.expenseChart.destroy();
    }
    
    // Create data for chart
    const data = {
        labels: ['Housing', 'Living', 'Health', 'Debt', 'Savings', 'Other'],
        datasets: [{
            data: [housing, living, health, debt, savings, other],
            backgroundColor: [
                'rgba(102, 126, 234, 0.7)',
                'rgba(255, 107, 107, 0.7)',
                'rgba(78, 205, 196, 0.7)',
                'rgba(255, 206, 86, 0.7)',
                'rgba(153, 102, 255, 0.7)',
                'rgba(255, 159, 64, 0.7)'
            ],
            borderColor: [
                'rgba(102, 126, 234, 1)',
                'rgba(255, 107, 107, 1)',
                'rgba(78, 205, 196, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    };
    
    // Chart configuration
    const config = {
        type: 'doughnut',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        font: {
                            family: "'Poppins', sans-serif",
                            size: 12
                        },
                        padding: 20
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
                            return `${label}: ${formatCurrency(value)} (${percentage}%)`;
                        }
                    }
                }
            },
            cutout: '60%',
            animation: {
                animateRotate: true,
                animateScale: true
            }
        }
    };
    
    // Create chart
    window.expenseChart = new Chart(ctx, config);
}

/**
 * Generate budget recommendations
 */
function generateRecommendations(housingPercent, livingPercent, debtPercent, savingsPercent) {
    const recommendationsList = document.getElementById('recommendations-list');
    const recommendations = [];
    
    // Housing recommendations (should be around 30%)
    if (housingPercent > 35) {
        recommendations.push(`<p><strong>Housing (${formatPercentage(housingPercent)}):</strong> Your housing expenses are above the recommended 30% of your budget. Consider ways to reduce housing costs or increase income.</p>`);
    }
    
    // Debt recommendations (should be below 20%)
    if (debtPercent > 20) {
        recommendations.push(`<p><strong>Debt (${formatPercentage(debtPercent)}):</strong> Your debt payments are high. Consider a debt reduction strategy to lower these payments over time.</p>`);
    }
    
    // Savings recommendations (should be at least 20%)
    if (savingsPercent < 20) {
        recommendations.push(`<p><strong>Savings (${formatPercentage(savingsPercent)}):</strong> Your savings rate is below the recommended 20%. Try to increase contributions to emergency fund, retirement, and investments.</p>`);
    }
    
    // Monthly balance recommendation
    const monthlyBalance = parseFloat(document.getElementById('monthly-balance').textContent.replace(/[^0-9.-]+/g, '')) || 0;
    if (monthlyBalance < 0) {
        recommendations.push(`<p><strong>Monthly Balance:</strong> You're spending more than you earn. Review your expenses to find areas to cut back.</p>`);
    } else if (monthlyBalance === 0) {
        recommendations.push(`<p><strong>Monthly Balance:</strong> You're breaking even. Look for ways to reduce expenses or increase income to build savings.</p>`);
    } else {
        recommendations.push(`<p><strong>Monthly Balance:</strong> You have a positive monthly balance. Consider allocating more to savings or investments.</p>`);
    }
    
    // General recommendation
    recommendations.push(`<p><strong>50/30/20 Rule:</strong> A common budgeting guideline suggests spending 50% on needs, 30% on wants, and 20% on savings and debt repayment.</p>`);
    
    // Update recommendations display
    if (recommendations.length > 0) {
        recommendationsList.innerHTML = recommendations.join('');
    } else {
        recommendationsList.innerHTML = '<p>Your budget looks balanced. Continue to monitor your spending and saving habits.</p>';
    }
}

/**
 * Reset calculator
 */
function resetCalculator() {
    // Reset all input fields
    const inputs = document.querySelectorAll('.calculator-form input[type="number"]');
    inputs.forEach(input => {
        input.value = '';
    });
    
    // Reset displays
    document.getElementById('total-income').textContent = '$0.00';
    document.getElementById('summary-income').textContent = '$0.00';
    document.getElementById('total-expenses').textContent = '$0.00';
    document.getElementById('monthly-balance').textContent = '$0.00';
    
    // Reset Annual Budget section
    document.getElementById('annual-income').textContent = '$0.00';
    document.getElementById('annual-expenses').textContent = '$0.00';
    document.getElementById('annual-savings').textContent = '$0.00';
    document.getElementById('savings-rate').textContent = '0%';
    
    // Reset percentage displays
    document.getElementById('housing-percent').textContent = '0%';
    document.getElementById('living-percent').textContent = '0%';
    document.getElementById('health-percent').textContent = '0%';
    document.getElementById('debt-percent').textContent = '0%';
    document.getElementById('savings-percent').textContent = '0%';
    document.getElementById('other-percent').textContent = '0%';
    
    // Reset progress bars
    document.querySelector('.bar-fill.housing').style.width = '0%';
    document.querySelector('.bar-fill.living').style.width = '0%';
    document.querySelector('.bar-fill.health').style.width = '0%';
    document.querySelector('.bar-fill.debt').style.width = '0%';
    document.querySelector('.bar-fill.savings').style.width = '0%';
    document.querySelector('.bar-fill.other').style.width = '0%';
    
    // Reset recommendations
    document.getElementById('recommendations-list').innerHTML = '<p>Enter your income and expenses to receive personalized recommendations.</p>';
    
    // Reset charts
    if (window.expenseChart) {
        window.expenseChart.destroy();
        window.expenseChart = null;
    }
    
    if (window.annualBudgetChart) {
        window.annualBudgetChart.destroy();
        window.annualBudgetChart = null;
    }
    
    // Reset Savings Goals
    document.getElementById('savings-goal-amount').value = '';
    document.getElementById('savings-goal-period').value = '12';
    document.getElementById('savings-goal-interest').value = '0';
    document.getElementById('monthly-contribution').textContent = '$0.00';
    document.getElementById('total-contributions').textContent = '$0.00';
    document.getElementById('interest-earned').textContent = '$0.00';
    document.getElementById('final-balance').textContent = '$0.00';
    
    // Hide savings schedule
    document.getElementById('savings-schedule').style.display = 'none';
    document.getElementById('view-schedule-link').textContent = 'View Contribution Schedule';
}

/**
 * Save budget
 */
function saveBudget() {
    // This would typically save to a database or localStorage
    // For now, we'll just show an alert
    alert('Budget saved successfully!');
    
    // In a real implementation, you would save to localStorage or a database
    // const budgetData = {
    //     income: {
    //         salary: parseFloat(document.getElementById('salary').value) || 0,
    //         additionalIncome: parseFloat(document.getElementById('additional-income').value) || 0
    //     },
    //     expenses: {
    //         housing: {
    //             rent: parseFloat(document.getElementById('rent').value) || 0,
    //             utilities: parseFloat(document.getElementById('utilities').value) || 0,
    //             internet: parseFloat(document.getElementById('internet').value) || 0
    //         },
    //         // ... other expense categories
    //     },
    //     // ... other budget data
    // };
    // 
    // localStorage.setItem('savedBudget', JSON.stringify(budgetData));
}

/**
 * Format currency
 */
function formatCurrency(value, abbreviated = false) {
    if (abbreviated && Math.abs(value) >= 1000) {
        if (Math.abs(value) >= 1000000) {
            return '$' + (value / 1000000).toFixed(1) + 'M';
        } else {
            return '$' + (value / 1000).toFixed(1) + 'K';
        }
    }
    
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);
}

/**
 * Format percentage
 */
function formatPercentage(value) {
    return Math.round(value) + '%';
}
