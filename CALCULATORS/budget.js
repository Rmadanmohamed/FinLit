document.addEventListener('DOMContentLoaded', function() {
    const budgetForm = document.getElementById('budget-form');
    const budgetResults = document.getElementById('budget-results');
    let expensesChart = null;

    budgetForm.addEventListener('submit', function(e) {
        e.preventDefault();
        calculateBudget();
    });

    function calculateBudget() {
        // Get income and tax rate
        const salary = parseFloat(document.getElementById('salary').value) || 0;
        const taxRate = parseFloat(document.getElementById('tax-rate').value) || 0;

        // Calculate net income after tax
        const netIncome = salary * (1 - taxRate / 100);

        // Get all expenses
        const expenses = {
            housing: {
                mortgage: parseFloat(document.getElementById('mortgage').value) || 0,
                utilities: parseFloat(document.getElementById('utilities').value) || 0
            },
            transportation: {
                carPayment: parseFloat(document.getElementById('car-payment').value) || 0,
                fuel: parseFloat(document.getElementById('fuel').value) || 0
            },
            living: {
                groceries: parseFloat(document.getElementById('groceries').value) || 0,
                healthcare: parseFloat(document.getElementById('healthcare').value) || 0
            },
            education: {
                tuition: parseFloat(document.getElementById('education').value) || 0,
                materials: parseFloat(document.getElementById('personal-dev').value) || 0
            },
            savings: {
                emergency: parseFloat(document.getElementById('savings').value) || 0,
                investments: parseFloat(document.getElementById('investments').value) || 0
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
        const monthlySavings = netIncome - totalExpenses;
        const savingsRate = (monthlySavings / netIncome) * 100;

        // Update results
        document.getElementById('net-income').textContent = formatCurrency(netIncome);
        document.getElementById('total-expenses').textContent = formatCurrency(totalExpenses);
        document.getElementById('monthly-savings').textContent = formatCurrency(monthlySavings);
        document.getElementById('savings-rate').textContent = formatPercentage(savingsRate);

        // Generate recommendations
        generateRecommendations(netIncome, totalExpenses, totalsByCategory);

        // Update chart
        updateExpensesChart(totalsByCategory);

        // Show results
        budgetResults.style.display = 'block';
        budgetResults.scrollIntoView({ behavior: 'smooth' });
    }

    function updateExpensesChart(expenses) {
        const ctx = document.getElementById('expenses-chart').getContext('2d');

        // Destroy existing chart if it exists
        if (expensesChart) {
            expensesChart.destroy();
        }

        // Create new chart
        expensesChart = new Chart(ctx, {
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

    function generateRecommendations(income, expenses, categories) {
        const recommendations = [];
        const savingsRate = ((income - expenses) / income) * 100;

        // Check overall financial health
        if (expenses > income) {
            recommendations.push({
                type: 'warning',
                text: 'Your expenses exceed your income. Consider reducing non-essential expenses and creating an emergency fund.'
            });
        }

        // Check savings rate
        if (savingsRate < 20) {
            recommendations.push({
                type: 'info',
                text: 'Your savings rate is below the recommended 20%. Try to increase your savings by reducing discretionary spending.'
            });
        } else if (savingsRate >= 20) {
            recommendations.push({
                type: 'success',
                text: 'Great job! Your savings rate meets or exceeds the recommended 20%.'
            });
        }

        // Check housing costs
        const housingRatio = (categories['Housing & Utilities'] / income) * 100;
        if (housingRatio > 30) {
            recommendations.push({
                type: 'warning',
                text: 'Your housing costs exceed 30% of your income. Consider ways to reduce housing expenses.'
            });
        }

        // Display recommendations
        const recommendationsContainer = document.getElementById('recommendations-content');
        recommendationsContainer.innerHTML = recommendations.map(rec => `
            <div class="recommendation ${rec.type}">
                <i class="fas ${getRecommendationIcon(rec.type)}"></i>
                <p>${rec.text}</p>
            </div>
        `).join('');
    }

    function getRecommendationIcon(type) {
        switch (type) {
            case 'warning': return 'fa-exclamation-triangle';
            case 'success': return 'fa-check-circle';
            case 'info': return 'fa-info-circle';
            default: return 'fa-info-circle';
        }
    }

    function formatCurrency(amount) {
        return `EGP ${amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
    }

    function formatPercentage(value) {
        return `${value.toFixed(1)}%`;
    }
});