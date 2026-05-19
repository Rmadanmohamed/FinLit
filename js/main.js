/**
 * Digital Financial Literacy & Inclusion Platform
 * Main JavaScript File
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize navigation
    initNavigation();
    
    // Initialize assessment functionality
    initAssessment();
    
    // Initialize financial tools
    initFinancialTools();
    
    // Initialize bank account opening
    initBankAccount();
    
    // Initialize analytics charts
    initAnalyticsCharts();
    
    // Initialize mobile menu
    initMobileMenu();
});

/**
 * Initialize navigation functionality
 */
function initNavigation() {
    // Tab navigation
    const navLinks = document.querySelectorAll('.nav-links a, .cta-buttons .btn, .hero-buttons .btn, .footer-links a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetTab = this.getAttribute('data-tab');
            if (!targetTab) return;
            
            // Update active tab in navigation
            document.querySelectorAll('.nav-links a').forEach(navLink => {
                navLink.classList.remove('active');
                if (navLink.getAttribute('data-tab') === targetTab) {
                    navLink.classList.add('active');
                }
            });
            
            // Show the target tab content
            document.querySelectorAll('.tab-content').forEach(tab => {
                tab.classList.remove('active');
            });
            
            document.getElementById(targetTab).classList.add('active');
            
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
    
    // Special buttons
    document.getElementById('open-account-btn')?.addEventListener('click', function() {
        showTab('open-account');
    });
    
    document.getElementById('explore-tools-btn')?.addEventListener('click', function() {
        showTab('tools');
    });
    
    document.getElementById('return-home')?.addEventListener('click', function() {
        showTab('home');
    });
    
    // Open account buttons in resources
    document.querySelectorAll('.open-account-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const bankName = this.getAttribute('data-bank');
            localStorage.setItem('selectedBank', bankName);
            showTab('open-account');
        });
    });
}

/**
 * Show a specific tab
 */
function showTab(tabId) {
    // Update active tab in navigation
    document.querySelectorAll('.nav-links a').forEach(navLink => {
        navLink.classList.remove('active');
        if (navLink.getAttribute('data-tab') === tabId) {
            navLink.classList.add('active');
        }
    });
    
    // Show the target tab content
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    document.getElementById(tabId).classList.add('active');
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Initialize mobile menu
 */
function initMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            
            // Animate hamburger icon
            const spans = this.querySelectorAll('span');
            spans.forEach(span => span.classList.toggle('active'));
        });
    }
}

/**
 * Initialize assessment functionality
 */
function initAssessment() {
    const assessmentSteps = document.querySelectorAll('.assessment-step');
    const progressBar = document.querySelector('.assessment-container .progress-bar');
    const nextButtons = document.querySelectorAll('.assessment-container .next-step');
    const prevButtons = document.querySelectorAll('.assessment-container .prev-step');
    const submitButton = document.querySelector('.assessment-container .submit-assessment');
    
    if (!assessmentSteps.length) return;
    
    // Handle next button clicks
    nextButtons.forEach(button => {
        button.addEventListener('click', function() {
            const currentStep = document.querySelector('.assessment-step.active');
            const currentStepNum = parseInt(currentStep.getAttribute('data-step'));
            const nextStepNum = currentStepNum + 1;
            
            // Update progress bar
            const progress = (nextStepNum - 1) / (assessmentSteps.length - 1) * 100;
            progressBar.style.width = `${progress}%`;
            
            // Show next step
            currentStep.classList.remove('active');
            document.querySelector(`.assessment-step[data-step="${nextStepNum}"]`).classList.add('active');
        });
    });
    
    // Handle previous button clicks
    prevButtons.forEach(button => {
        button.addEventListener('click', function() {
            const currentStep = document.querySelector('.assessment-step.active');
            const currentStepNum = parseInt(currentStep.getAttribute('data-step'));
            const prevStepNum = currentStepNum - 1;
            
            // Update progress bar
            const progress = (prevStepNum - 1) / (assessmentSteps.length - 1) * 100;
            progressBar.style.width = `${progress}%`;
            
            // Show previous step
            currentStep.classList.remove('active');
            document.querySelector(`.assessment-step[data-step="${prevStepNum}"]`).classList.add('active');
        });
    });
    
    // Handle submit button click
    if (submitButton) {
        submitButton.addEventListener('click', function() {
            // Calculate scores
            const digitalScore = calculateDigitalScore();
            const financialScore = calculateFinancialScore();
            const inclusionScore = calculateInclusionScore();
            const totalScore = (digitalScore + financialScore + inclusionScore) / 3;
            
            // Update progress bar
            progressBar.style.width = '100%';
            
            // Show results step
            const currentStep = document.querySelector('.assessment-step.active');
            currentStep.classList.remove('active');
            document.querySelector('.assessment-step[data-step="5"]').classList.add('active');
            
            // Create gauge charts
            createGaugeChart('digital-gauge', digitalScore, 'Digital Literacy');
            createGaugeChart('financial-gauge', financialScore, 'Financial Literacy');
            createGaugeChart('inclusion-gauge', inclusionScore, 'Financial Inclusion');
            
            // Update overall score
            document.getElementById('overall-score').textContent = `${totalScore.toFixed(1)}%`;
            
            // Generate recommendations
            generateRecommendations(digitalScore, financialScore, inclusionScore);
        });
    }
    
    // Initialize range input displays
    document.getElementById('age')?.addEventListener('input', function() {
        document.getElementById('age-value').textContent = this.value;
    });
}

/**
 * Calculate digital financial literacy score
 */
function calculateDigitalScore() {
    const q1Value = getSelectedRadioValue('q1');
    const q2Value = getSelectedRadioValue('q2');
    const q3Value = getSelectedRadioValue('q3');
    
    return ((parseInt(q1Value) + parseInt(q2Value) + parseInt(q3Value)) / 15) * 100;
}

/**
 * Calculate general financial literacy score
 */
function calculateFinancialScore() {
    const q4Value = getSelectedRadioValue('q4');
    const q5Value = getSelectedRadioValue('q5');
    const q6Value = getSelectedRadioValue('q6');
    
    return ((parseInt(q4Value) + parseInt(q5Value) + parseInt(q6Value)) / 15) * 100;
}

/**
 * Calculate financial inclusion score
 */
function calculateInclusionScore() {
    const q7Value = getSelectedRadioValue('q7');
    const q8Value = getSelectedRadioValue('q8');
    const q9Value = getSelectedRadioValue('q9');
    
    return ((parseInt(q7Value) + parseInt(q8Value) + parseInt(q9Value)) / 15) * 100;
}

/**
 * Get the value of the selected radio button in a group
 */
function getSelectedRadioValue(name) {
    const selectedRadio = document.querySelector(`input[name="${name}"]:checked`);
    return selectedRadio ? selectedRadio.value : '3'; // Default to middle value if none selected
}

/**
 * Create a gauge chart
 */
function createGaugeChart(canvasId, value, label) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    
    // Clear any existing chart
    if (canvas.chart) {
        canvas.chart.destroy();
    }
    
    // Determine color based on value
    let color;
    if (value < 40) {
        color = '#F44336'; // Red
    } else if (value < 70) {
        color = '#FFD600'; // Yellow
    } else {
        color = '#00C853'; // Green
    }
    
    // Create new chart
    canvas.chart = new Chart(canvas, {
        type: 'doughnut',
        data: {
            datasets: [{
                data: [value, 100 - value],
                backgroundColor: [color, '#E0E0E0'],
                borderWidth: 0
            }]
        },
        options: {
            circumference: 180,
            rotation: -90,
            cutout: '70%',
            plugins: {
                tooltip: {
                    enabled: false
                },
                legend: {
                    display: false
                },
                title: {
                    display: false
                }
            },
            maintainAspectRatio: true,
            responsive: true
        },
        plugins: [{
            id: 'gaugeText',
            afterDraw: (chart) => {
                const { ctx, chartArea: { top, bottom, left, right, width, height } } = chart;
                
                ctx.save();
                ctx.fillStyle = color;
                ctx.font = 'bold 16px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(`${value.toFixed(0)}%`, width / 2, top + height - 10);
                ctx.restore();
            }
        }]
    });
}

/**
 * Generate personalized recommendations
 */
function generateRecommendations(digitalScore, financialScore, inclusionScore) {
    const recommendationsContainer = document.getElementById('recommendations-container');
    if (!recommendationsContainer) return;
    
    recommendationsContainer.innerHTML = '';
    
    // Digital literacy recommendations
    let digitalRecommendation;
    if (digitalScore < 40) {
        digitalRecommendation = {
            title: 'Basic Digital Banking Skills',
            category: 'Digital Literacy',
            description: 'Start with learning the basics of mobile banking apps and digital payments.',
            resources: ['Introduction to Mobile Banking video', 'Digital Payment Basics guide']
        };
    } else if (digitalScore < 70) {
        digitalRecommendation = {
            title: 'Intermediate Digital Financial Skills',
            category: 'Digital Literacy',
            description: 'Enhance your knowledge of digital financial services and security practices.',
            resources: ['Digital Financial Security guide', 'Comparing Digital Payment Methods']
        };
    } else {
        digitalRecommendation = {
            title: 'Advanced Digital Financial Skills',
            category: 'Digital Literacy',
            description: 'Explore advanced digital financial services and fintech innovations.',
            resources: ['Fintech Innovations course', 'Digital Investment Platforms guide']
        };
    }
    
    // Financial literacy recommendations
    let financialRecommendation;
    if (financialScore < 40) {
        financialRecommendation = {
            title: 'Basic Financial Knowledge',
            category: 'Financial Literacy',
            description: 'Learn fundamental financial concepts like budgeting and saving.',
            resources: ['Personal Budgeting Basics', 'Introduction to Saving']
        };
    } else if (financialScore < 70) {
        financialRecommendation = {
            title: 'Intermediate Financial Knowledge',
            category: 'Financial Literacy',
            description: 'Develop your understanding of interest rates, loans, and basic investments.',
            resources: ['Understanding Interest Rates', 'Introduction to Investments']
        };
    } else {
        financialRecommendation = {
            title: 'Advanced Financial Knowledge',
            category: 'Financial Literacy',
            description: 'Explore complex financial concepts and investment strategies.',
            resources: ['Advanced Investment Strategies', 'Financial Planning for the Future']
        };
    }
    
    // Financial inclusion recommendations
    let inclusionRecommendation;
    if (inclusionScore < 40) {
        inclusionRecommendation = {
            title: 'Getting Started with Financial Services',
            category: 'Financial Inclusion',
            description: 'Learn about basic financial services available in Egypt and how to access them.',
            resources: ['Guide to Opening a Bank Account', 'Financial Services for Beginners']
        };
    } else if (inclusionScore < 70) {
        inclusionRecommendation = {
            title: 'Expanding Financial Access',
            category: 'Financial Inclusion',
            description: 'Discover more financial services and how to overcome common barriers.',
            resources: ['Overcoming Digital Financial Barriers', 'Expanding Your Financial Access']
        };
    } else {
        inclusionRecommendation = {
            title: 'Maximizing Financial Inclusion',
            category: 'Financial Inclusion',
            description: 'Learn how to fully utilize available financial services and help others gain access.',
            resources: ['Advanced Digital Financial Services', 'Promoting Financial Inclusion']
        };
    }
    
    // Add recommendations to container
    [digitalRecommendation, financialRecommendation, inclusionRecommendation].forEach(rec => {
        const card = document.createElement('div');
        card.className = 'recommendation-card';
        
        let resourcesList = '';
        rec.resources.forEach(resource => {
            resourcesList += `<li>${resource}</li>`;
        });
        
        card.innerHTML = `
            <h5>${rec.title}</h5>
            <p><strong>Category:</strong> ${rec.category}</p>
            <p>${rec.description}</p>
            <p><strong>Recommended Resources:</strong></p>
            <ul>${resourcesList}</ul>
        `;
        
        recommendationsContainer.appendChild(card);
    });
    
    // Show open account button if user doesn't have a bank account
    const q7Value = getSelectedRadioValue('q7');
    if (q7Value === '1') { // "No" to having a bank account
        document.getElementById('open-account-btn').style.display = 'block';
    } else {
        document.getElementById('open-account-btn').style.display = 'none';
    }
}

/**
 * Initialize financial tools functionality
 */
function initFinancialTools() {
    // Tool tabs
    const toolTabs = document.querySelectorAll('.tool-tab');
    
    toolTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Update active tab
            toolTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding content
            const toolId = this.getAttribute('data-tool');
            document.querySelectorAll('.tool-content').forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById(`${toolId}-calculator`).classList.add('active');
        });
    });
    
    // Budget Calculator
    initBudgetCalculator();
    
    // Savings Calculator
    initSavingsCalculator();
    
    // Loan Calculator
    initLoanCalculator();
}

/**
 * Initialize budget calculator
 */
function initBudgetCalculator() {
    // Initialize range input displays
    const rangeInputs = [
        'income', 'housing', 'food', 'transportation', 
        'utilities', 'entertainment', 'education', 
        'savings', 'other'
    ];
    
    rangeInputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', function() {
                document.getElementById(`${id}-value`).textContent = formatNumber(this.value);
            });
        }
    });
    
    // Calculate budget button
    document.getElementById('calculate-budget')?.addEventListener('click', function() {
        calculateBudget();
    });
}

/**
 * Calculate and display budget
 */
function calculateBudget() {
    // Get values
    const income = parseFloat(document.getElementById('income').value);
    
    const expenses = {
        housing: parseFloat(document.getElementById('housing').value),
        food: parseFloat(document.getElementById('food').value),
        transportation: parseFloat(document.getElementById('transportation').value),
        utilities: parseFloat(document.getElementById('utilities').value),
        entertainment: parseFloat(document.getElementById('entertainment').value),
        education: parseFloat(document.getElementById('education').value),
        savings: parseFloat(document.getElementById('savings').value),
        other: parseFloat(document.getElementById('other').value)
    };
    
    // Show results container
    document.getElementById('budget-results').style.display = 'block';
    
    // Calculate total expenses
    const totalExpenses = Object.values(expenses).reduce((sum, value) => sum + value, 0);
    
    // Calculate balance
    const balance = income - totalExpenses;
    
    // Update summary
    document.getElementById('total-income').textContent = `EGP ${formatNumber(income.toFixed(2))}`;
    document.getElementById('total-expenses').textContent = `EGP ${formatNumber(totalExpenses.toFixed(2))}`;
    
    const balanceElement = document.getElementById('monthly-balance');
    balanceElement.textContent = `EGP ${formatNumber(balance.toFixed(2))}`;
    balanceElement.style.color = balance >= 0 ? '#00C853' : '#F44336';
    
    // Create pie chart
    createBudgetChart(expenses);
    
    // Generate recommendations
    generateBudgetRecommendations(income, totalExpenses, balance);
}

/**
 * Create budget pie chart
 */
function createBudgetChart(expenses) {
    const canvas = document.getElementById('budget-chart');
    if (!canvas) return;
    
    // Clear any existing chart
    if (canvas.chart) {
        canvas.chart.destroy();
    }
    
    // Prepare data
    const labels = Object.keys(expenses).map(key => {
        return key.charAt(0).toUpperCase() + key.slice(1);
    });
    
    const values = Object.values(expenses);
    
    // Create chart
    canvas.chart = new Chart(canvas, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: values,
                backgroundColor: [
                    '#2196F3', // Primary
                    '#FF9800', // Secondary
                    '#4CAF50', // Accent
                    '#E91E63', // Highlight
                    '#9C27B0', // Purple
                    '#00BCD4', // Cyan
                    '#FFEB3B', // Yellow
                    '#795548'  // Brown
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = Math.round((value / total) * 100);
                            return `${label}: EGP ${formatNumber(value)} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

/**
 * Generate budget recommendations
 */
function generateBudgetRecommendations(income, totalExpenses, balance) {
    const recommendationsContainer = document.getElementById('budget-recommendations');
    if (!recommendationsContainer) return;
    
    let recommendations;
    
    if (balance < 0) {
        recommendations = `
            <h4>Budget Recommendations</h4>
            <p>Your expenses exceed your income. Consider these steps to balance your budget:</p>
            <ul>
                <li>Reduce non-essential expenses like entertainment</li>
                <li>Look for ways to increase your income</li>
                <li>Prioritize essential expenses like housing and food</li>
                <li>Create a debt repayment plan if applicable</li>
            </ul>
        `;
        recommendationsContainer.style.backgroundColor = '#FFEBEE'; // Light red
    } else if (balance < (income * 0.1)) {
        recommendations = `
            <h4>Budget Recommendations</h4>
            <p>Your budget is balanced but with limited savings. Consider these steps to improve:</p>
            <ul>
                <li>Aim to save at least 10-20% of your income</li>
                <li>Look for areas to reduce expenses slightly</li>
                <li>Build an emergency fund of 3-6 months of expenses</li>
                <li>Consider additional income sources if possible</li>
            </ul>
        `;
        recommendationsContainer.style.backgroundColor = '#FFF8E1'; // Light yellow
    } else {
        recommendations = `
            <h4>Budget Recommendations</h4>
            <p>Your budget is well-balanced with good savings. Consider these steps to optimize:</p>
            <ul>
                <li>Maintain your current saving habits</li>
                <li>Consider investing some of your savings for long-term growth</li>
                <li>Ensure you have adequate insurance coverage</li>
                <li>Plan for future financial goals like education or retirement</li>
            </ul>
        `;
        recommendationsContainer.style.backgroundColor = '#E8F5E9'; // Light green
    }
    
    recommendationsContainer.innerHTML = recommendations;
}

/**
 * Initialize savings calculator
 */
function initSavingsCalculator() {
    // Initialize range input displays
    const rangeInputs = ['goal-amount', 'monthly-contribution', 'interest-rate'];
    
    rangeInputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', function() {
                if (id === 'interest-rate') {
                    document.getElementById(`${id}-value`).textContent = this.value;
                } else {
                    document.getElementById(`${id}-value`).textContent = formatNumber(this.value);
                }
            });
        }
    });
    
    // Calculate savings on form submit
    const savingsForm = document.getElementById('savings-form');
    if (savingsForm) {
        savingsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            calculateSavings();
        });
    }
    // Calculate savings button (if exists)
    document.getElementById('calculate-savings')?.addEventListener('click', function() {
        calculateSavings();
    });
}

/**
 * Calculate and display savings
 */
function calculateSavings() {
    // Get values
    const goalAmount = parseFloat(document.getElementById('goal-amount').value);
    const monthlyContribution = parseFloat(document.getElementById('monthly-contribution').value);
    const annualInterestRate = parseFloat(document.getElementById('interest-rate').value) / 100;
    
    // Show results container
    document.getElementById('savings-results').style.display = 'block';
    
    const monthlyInterestRate = annualInterestRate / 12;
    
    // Calculate months to reach goal
    let months = 0;
    let balance = 0;
    const balances = [];
    const years = [];
    
    while (balance < goalAmount && months < 600) { // Cap at 50 years
        balance = balance * (1 + monthlyInterestRate) + monthlyContribution;
        months++;
        
        if (months % 12 === 0 || months === 1) {
            balances.push(balance);
            years.push(months / 12);
        }
    }
    
    const totalYears = months / 12;
    
    // Update summary
    document.getElementById('goal-amount-result').textContent = `EGP ${formatNumber(goalAmount.toFixed(2))}`;
    document.getElementById('monthly-contribution-result').textContent = `EGP ${formatNumber(monthlyContribution.toFixed(2))}`;
    document.getElementById('interest-rate-result').textContent = `${annualInterestRate.toFixed(1)}%`;
    
    const yearsInt = Math.floor(totalYears);
    const monthsRemainder = Math.round((totalYears - yearsInt) * 12);
    
    let timeText = `${yearsInt} years`;
    if (monthsRemainder > 0) {
        timeText += ` and ${monthsRemainder} months`;
    }
    
    document.getElementById('time-to-goal').textContent = timeText;
    
    // Create chart
    createSavingsChart(years, balances, goalAmount);
    
    // Generate recommendations
    generateSavingsRecommendations(totalYears);
}

/**
 * Create savings growth chart
 */
function createSavingsChart(years, balances, goalAmount) {
    const canvas = document.getElementById('savings-chart');
    if (!canvas) return;
    
    // Clear any existing chart
    if (canvas.chart) {
        canvas.chart.destroy();
    }
    
    // Create chart
    canvas.chart = new Chart(canvas, {
        type: 'line',
        data: {
            labels: years.map(year => `Year ${year.toFixed(1)}`),
            datasets: [{
                label: 'Savings Balance',
                data: balances,
                borderColor: '#2196F3',
                backgroundColor: 'rgba(33, 150, 243, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return 'EGP ' + formatNumber(value.toFixed(0));
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return 'Balance: EGP ' + formatNumber(context.raw.toFixed(2));
                        }
                    }
                },
                annotation: {
                    annotations: {
                        line1: {
                            type: 'line',
                            yMin: goalAmount,
                            yMax: goalAmount,
                            borderColor: '#FF9800',
                            borderWidth: 2,
                            borderDash: [5, 5],
                            label: {
                                content: 'Goal: EGP ' + formatNumber(goalAmount),
                                enabled: true,
                                position: 'end'
                            }
                        }
                    }
                }
            }
        }
    });
}

/**
 * Generate savings recommendations
 */
function generateSavingsRecommendations(years) {
    const recommendationsContainer = document.getElementById('savings-recommendations');
    if (!recommendationsContainer) return;
    
    let recommendations;
    
    if (years > 10) {
        recommendations = `
            <h4>Savings Recommendations</h4>
            <p>It will take a long time to reach your goal. Consider these strategies to reach it faster:</p>
            <ul>
                <li>Increase your monthly contribution if possible</li>
                <li>Look for higher-yield investment options (with appropriate risk assessment)</li>
                <li>Consider adjusting your goal amount if it's not realistic</li>
                <li>Break your large goal into smaller milestone goals</li>
            </ul>
        `;
        recommendationsContainer.style.backgroundColor = '#FFF8E1'; // Light yellow
    } else {
        recommendations = `
            <h4>Savings Recommendations</h4>
            <p>You're on track to reach your goal in a reasonable timeframe. Consider these strategies:</p>
            <ul>
                <li>Set up automatic transfers to ensure consistent contributions</li>
                <li>Review your investment strategy periodically</li>
                <li>Consider increasing contributions when you receive raises or bonuses</li>
                <li>Start planning for your next financial goal</li>
            </ul>
        `;
        recommendationsContainer.style.backgroundColor = '#E8F5E9'; // Light green
    }
    
    recommendationsContainer.innerHTML = recommendations;
}

/**
 * Initialize loan calculator
 */
function initLoanCalculator() {
    // Initialize range input displays
    const rangeInputs = ['loan-amount', 'loan-term', 'loan-rate'];
    
    rangeInputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', function() {
                if (id === 'loan-rate') {
                    document.getElementById(`${id}-value`).textContent = this.value;
                } else if (id === 'loan-term') {
                    document.getElementById(`${id}-value`).textContent = this.value;
                } else {
                    document.getElementById(`${id}-value`).textContent = formatNumber(this.value);
                }
            });
        }
    });
    
    // Calculate loan button
    document.getElementById('calculate-loan')?.addEventListener('click', function() {
        calculateLoan();
    });
}

/**
 * Calculate and display loan
 */
function calculateLoan() {
    // Get values
    const loanAmount = parseFloat(document.getElementById('loan-amount').value);
    const loanTermYears = parseInt(document.getElementById('loan-term').value);
    const annualInterestRate = parseFloat(document.getElementById('loan-rate').value) / 100;
    
    // Calculate monthly payment
    const monthlyInterestRate = annualInterestRate / 12;
    const loanTermMonths = loanTermYears * 12;
    
    const monthlyPayment = loanAmount * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, loanTermMonths)) / (Math.pow(1 + monthlyInterestRate, loanTermMonths) - 1);
    
    // Calculate amortization schedule
    const yearlyData = [];
    let remainingBalance = loanAmount;
    let totalInterest = 0;
    
    for (let year = 1; year <= loanTermYears; year++) {
        let yearInterest = 0;
        let yearPrincipal = 0;
        
        for (let month = 1; month <= 12; month++) {
            if (remainingBalance <= 0) break;
            
            const monthInterest = remainingBalance * monthlyInterestRate;
            let monthPrincipal = monthlyPayment - monthInterest;
            
            if (monthPrincipal > remainingBalance) {
                monthPrincipal = remainingBalance;
            }
            
            remainingBalance -= monthPrincipal;
            
            yearInterest += monthInterest;
            yearPrincipal += monthPrincipal;
            totalInterest += monthInterest;
        }
        
        yearlyData.push({
            year: year,
            principal: yearPrincipal,
            interest: yearInterest,
            remaining: remainingBalance
        });
    }
    
    // Update summary
    document.getElementById('loan-amount-result').textContent = `EGP ${formatNumber(loanAmount.toFixed(2))}`;
    document.getElementById('loan-term-result').textContent = `${loanTermYears} years`;
    document.getElementById('loan-rate-result').textContent = `${annualInterestRate.toFixed(1)}%`;
    document.getElementById('monthly-payment').textContent = `EGP ${formatNumber(monthlyPayment.toFixed(2))}`;
    document.getElementById('total-interest').textContent = `EGP ${formatNumber(totalInterest.toFixed(2))}`;
    document.getElementById('total-payment').textContent = `EGP ${formatNumber((loanAmount + totalInterest).toFixed(2))}`;
    
    // Create chart
    createLoanChart(loanAmount, totalInterest);
    
    // Create amortization table
    createAmortizationTable(yearlyData);
    
    // Generate recommendations
    generateLoanRecommendations(annualInterestRate);
}

/**
 * Create loan payment breakdown chart
 */
function createLoanChart(principal, interest) {
    const canvas = document.getElementById('loan-chart');
    if (!canvas) return;
    
    // Clear any existing chart
    if (canvas.chart) {
        canvas.chart.destroy();
    }
    
    // Create chart
    canvas.chart = new Chart(canvas, {
        type: 'pie',
        data: {
            labels: ['Principal', 'Interest'],
            datasets: [{
                data: [principal, interest],
                backgroundColor: ['#2196F3', '#FF9800'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            const total = principal + interest;
                            const percentage = Math.round((value / total) * 100);
                            return `${label}: EGP ${formatNumber(value.toFixed(2))} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

/**
 * Create amortization table
 */
function createAmortizationTable(yearlyData) {
    const tableBody = document.querySelector('#amortization-table tbody');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    yearlyData.forEach(data => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${data.year}</td>
            <td>EGP ${formatNumber(data.principal.toFixed(2))}</td>
            <td>EGP ${formatNumber(data.interest.toFixed(2))}</td>
            <td>EGP ${formatNumber(data.remaining.toFixed(2))}</td>
        `;
        
        tableBody.appendChild(row);
    });
}

/**
 * Generate loan recommendations
 */
function generateLoanRecommendations(interestRate) {
    const recommendationsContainer = document.getElementById('loan-recommendations');
    if (!recommendationsContainer) return;
    
    let recommendations;
    
    if (interestRate > 0.15) {
        recommendations = `
            <h4>Loan Recommendations</h4>
            <p>Your interest rate is relatively high. Consider these strategies:</p>
            <ul>
                <li>Shop around for lower interest rates from different lenders</li>
                <li>Consider a shorter loan term to reduce total interest paid</li>
                <li>Make extra payments when possible to reduce the principal faster</li>
                <li>Refinance the loan if interest rates decrease in the future</li>
            </ul>
        `;
        recommendationsContainer.style.backgroundColor = '#FFF8E1'; // Light yellow
    } else {
        recommendations = `
            <h4>Loan Recommendations</h4>
            <p>Your loan terms appear reasonable. Consider these strategies:</p>
            <ul>
                <li>Set up automatic payments to avoid late fees</li>
                <li>Consider making extra payments when possible to pay off the loan faster</li>
                <li>Review your budget to ensure the monthly payment is affordable</li>
                <li>Monitor interest rates for potential refinancing opportunities</li>
            </ul>
        `;
        recommendationsContainer.style.backgroundColor = '#E8F5E9'; // Light green
    }
    
    recommendationsContainer.innerHTML = recommendations;
}

/**
 * Initialize bank account opening functionality
 */
function initBankAccount() {
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
            
            // Update progress bar
            const progress = (nextStepNum - 1) / (accountSteps.length - 2) * 100; // -2 because the last step is confirmation
            progressBar.style.width = `${progress}%`;
            
            // Show next step
            currentStep.classList.remove('active');
            document.querySelector(`.account-step[data-step="${nextStepNum}"]`).classList.add('active');
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
            
            // Update confirmation page
            document.getElementById('selected-bank').textContent = bankName;
            document.getElementById('reference-number').textContent = Math.floor(100000 + Math.random() * 900000);
            
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
 * Initialize analytics charts
 */
function initAnalyticsCharts() {
    // Financial inclusion trends
    createInclusionTrendsChart();
    
    // Financial literacy by education level
    createLiteracyEducationChart();
    
    // Financial inclusion barriers
    createBarriersChart();
    
    // Financial inclusion by age group
    createAgeGroupChart();
    
    // Add animation to analytics cards
    animateAnalyticsCards();
}

/**
 * Add animation to analytics cards
 */
function animateAnalyticsCards() {
    const cards = document.querySelectorAll('.analytics-card');
    
    if (!cards.length) return;
    
    cards.forEach((card, index) => {
        // Add animation delay based on index
        card.style.animation = `fadeInUp 0.8s ease-out ${index * 0.2}s both`;
        
        // Add hover effect for charts
        const chartContainer = card.querySelector('.chart-container');
        if (chartContainer) {
            chartContainer.addEventListener('mouseenter', () => {
                chartContainer.style.transform = 'scale(1.02)';
            });
            
            chartContainer.addEventListener('mouseleave', () => {
                chartContainer.style.transform = 'scale(1)';
            });
        }
    });
}

/**
 * Create financial inclusion trends chart
 */
function createInclusionTrendsChart() {
    const canvas = document.getElementById('inclusion-trends-chart');
    if (!canvas) return;
    
    // Sample data
    const years = [2018, 2019, 2020, 2021, 2022, 2023, 2024];
    const bankAccount = [32.8, 35.2, 38.7, 42.5, 47.8, 54.2, 58.6];
    const mobileMoney = [5.3, 8.7, 14.2, 22.8, 31.5, 42.3, 48.7];
    const digitalPayments = [18.5, 22.3, 28.7, 35.4, 43.2, 52.8, 59.4];
    
    // Create chart
    new Chart(canvas, {
        type: 'line',
        data: {
            labels: years,
            datasets: [
                {
                    label: 'Bank Account',
                    data: bankAccount,
                    borderColor: '#2196F3',
                    backgroundColor: 'rgba(33, 150, 243, 0.1)',
                    borderWidth: 3,
                    tension: 0.4,
                    fill: false
                },
                {
                    label: 'Mobile Money',
                    data: mobileMoney,
                    borderColor: '#FF9800',
                    backgroundColor: 'rgba(255, 152, 0, 0.1)',
                    borderWidth: 3,
                    tension: 0.4,
                    fill: false
                },
                {
                    label: 'Digital Payments',
                    data: digitalPayments,
                    borderColor: '#4CAF50',
                    backgroundColor: 'rgba(76, 175, 80, 0.1)',
                    borderWidth: 3,
                    tension: 0.4,
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Percentage of Adults (%)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Year'
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'top'
                }
            }
        }
    });
}

/**
 * Create financial literacy by education level chart
 */
function createLiteracyEducationChart() {
    const canvas = document.getElementById('literacy-education-chart');
    if (!canvas) return;
    
    // Sample data
    const educationLevels = ['Primary', 'Secondary', 'University', 'Postgraduate'];
    const financialLiteracy = [42, 58, 73, 82];
    const digitalFinancialLiteracy = [35, 62, 78, 85];
    
    // Create chart
    new Chart(canvas, {
        type: 'bar',
        data: {
            labels: educationLevels,
            datasets: [
                {
                    label: 'Financial Literacy',
                    data: financialLiteracy,
                    backgroundColor: '#2196F3',
                    borderWidth: 0
                },
                {
                    label: 'Digital Financial Literacy',
                    data: digitalFinancialLiteracy,
                    backgroundColor: '#FF9800',
                    borderWidth: 0
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Literacy Score (0-100)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Education Level'
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'top'
                }
            }
        }
    });
}

/**
 * Create financial inclusion barriers chart
 */
function createBarriersChart() {
    const canvas = document.getElementById('barriers-chart');
    if (!canvas) return;
    
    // Sample data
    const barriers = ['Lack of knowledge', 'Lack of trust', 'Limited access to technology', 'High costs', 'Complex procedures'];
    const percentages = [42, 38, 35, 28, 22];
    
    // Create chart
    new Chart(canvas, {
        type: 'bar',
        data: {
            labels: barriers,
            datasets: [
                {
                    label: 'Percentage of Respondents',
                    data: percentages,
                    backgroundColor: '#FFD600',
                    borderWidth: 0
                }
            ]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Percentage of Respondents (%)'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Barrier'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

/**
 * Create financial inclusion by age group chart
 */
function createAgeGroupChart() {
    const canvas = document.getElementById('age-group-chart');
    if (!canvas) return;
    
    // Sample data
    const ageGroups = ['18-24', '25-34', '35-44', '45-54', '55+'];
    const bankAccount = [45, 62, 58, 52, 38];
    const mobileMoney = [65, 58, 42, 28, 15];
    const digitalPayments = [72, 68, 55, 42, 25];
    
    // Create chart
    new Chart(canvas, {
        type: 'bar',
        data: {
            labels: ageGroups,
            datasets: [
                {
                    label: 'Bank Account',
                    data: bankAccount,
                    backgroundColor: '#2196F3',
                    borderWidth: 0
                },
                {
                    label: 'Mobile Money',
                    data: mobileMoney,
                    backgroundColor: '#FF9800',
                    borderWidth: 0
                },
                {
                    label: 'Digital Payments',
                    data: digitalPayments,
                    backgroundColor: '#4CAF50',
                    borderWidth: 0
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Percentage of Adults (%)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Age Group'
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'top'
                }
            }
        }
    });
}

/**
 * Create Digital Banking Adoption chart
 */
function createDigitalBankingChart() {
    const canvas = document.getElementById('banking-chart');
    if (!canvas) return;
    
    // Data for digital banking adoption over years
    const data = {
        labels: ['2018', '2019', '2020', '2021', '2022', '2023', '2024'],
        datasets: [
            {
                label: 'Urban Areas',
                data: [32, 38, 45, 53, 62, 68, 75],
                borderColor: 'rgba(102, 126, 234, 1)',
                backgroundColor: 'rgba(102, 126, 234, 0.2)',
                borderWidth: 2,
                pointBackgroundColor: 'rgba(102, 126, 234, 1)',
                pointRadius: 4,
                tension: 0.4,
                fill: true
            },
            {
                label: 'Rural Areas',
                data: [15, 19, 24, 30, 38, 45, 52],
                borderColor: 'rgba(255, 107, 107, 1)',
                backgroundColor: 'rgba(255, 107, 107, 0.2)',
                borderWidth: 2,
                pointBackgroundColor: 'rgba(255, 107, 107, 1)',
                pointRadius: 4,
                tension: 0.4,
                fill: true
            }
        ]
    };
    
    // Create chart
    new Chart(canvas, {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Percentage of Population (%)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Year'
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'top'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.parsed.y + '%';
                        }
                    }
                }
            }
        }
    });
}

/**
 * Create Financial Literacy Scores chart
 */
function createFinancialLiteracyChart() {
    const canvas = document.getElementById('literacy-chart');
    if (!canvas) return;
    
    // Data for financial literacy scores by education level
    const data = {
        labels: ['Primary', 'Secondary', 'University', 'Postgraduate'],
        datasets: [
            {
                label: 'Financial Knowledge',
                data: [45, 62, 78, 85],
                backgroundColor: 'rgba(102, 126, 234, 0.7)',
                borderWidth: 0,
                borderRadius: 4
            },
            {
                label: 'Financial Behavior',
                data: [40, 58, 72, 80],
                backgroundColor: 'rgba(255, 107, 107, 0.7)',
                borderWidth: 0,
                borderRadius: 4
            },
            {
                label: 'Financial Attitude',
                data: [50, 65, 75, 82],
                backgroundColor: 'rgba(78, 205, 196, 0.7)',
                borderWidth: 0,
                borderRadius: 4
            }
        ]
    };
    
    // Create chart
    new Chart(canvas, {
        type: 'bar',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: true,
                        text: 'Score (0-100)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Education Level'
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'top'
                }
            }
        }
    });
}

/**
 * Create Mobile Payment Usage chart
 */
function createMobilePaymentChart() {
    const canvas = document.getElementById('payment-chart');
    if (!canvas) return;
    
    // Data for mobile payment usage by age group
    const data = {
        labels: ['18-24', '25-34', '35-44', '45-54', '55-64', '65+'],
        datasets: [{
            data: [78, 85, 65, 42, 28, 15],
            backgroundColor: [
                'rgba(102, 126, 234, 0.7)',
                'rgba(54, 162, 235, 0.7)',
                'rgba(255, 206, 86, 0.7)',
                'rgba(75, 192, 192, 0.7)',
                'rgba(153, 102, 255, 0.7)',
                'rgba(255, 159, 64, 0.7)'
            ],
            borderColor: [
                'rgba(102, 126, 234, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    };
    
    // Create chart
    new Chart(canvas, {
        type: 'doughnut',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.label + ': ' + context.parsed + '%';
                        }
                    }
                }
            }
        }
    });
}

/**
 * Create Financial Inclusion Index chart
 */
function createFinancialInclusionChart() {
    const canvas = document.getElementById('inclusion-chart');
    if (!canvas) return;
    
    // Data for financial inclusion index by region
    const data = {
        labels: ['Urban', 'Suburban', 'Rural', 'Remote'],
        datasets: [{
            label: 'Account Ownership',
            data: [85, 75, 55, 35],
            backgroundColor: 'rgba(102, 126, 234, 0.7)',
            borderColor: 'rgba(102, 126, 234, 1)',
            borderWidth: 1,
            pointBackgroundColor: 'rgba(102, 126, 234, 1)',
            pointRadius: 5,
            pointHoverRadius: 7
        }, {
            label: 'Digital Access',
            data: [90, 80, 50, 30],
            backgroundColor: 'rgba(255, 107, 107, 0.7)',
            borderColor: 'rgba(255, 107, 107, 1)',
            borderWidth: 1,
            pointBackgroundColor: 'rgba(255, 107, 107, 1)',
            pointRadius: 5,
            pointHoverRadius: 7
        }, {
            label: 'Financial Literacy',
            data: [75, 70, 60, 45],
            backgroundColor: 'rgba(78, 205, 196, 0.7)',
            borderColor: 'rgba(78, 205, 196, 1)',
            borderWidth: 1,
            pointBackgroundColor: 'rgba(78, 205, 196, 1)',
            pointRadius: 5,
            pointHoverRadius: 7
        }]
    };
    
    // Create chart
    new Chart(canvas, {
        type: 'radar',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        stepSize: 20
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'top'
                }
            }
        }
    });
}

/**
 * Format number with commas
 */
function formatNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
