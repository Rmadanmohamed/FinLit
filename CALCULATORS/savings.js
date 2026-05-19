document.addEventListener('DOMContentLoaded', function() {
    const savingsForm = document.getElementById('savings-form');
    const savingsResults = document.getElementById('savings-results');
    let savingsChart = null;

    savingsForm.addEventListener('submit', function(e) {
        e.preventDefault();
        calculateSavings();
    });

    function calculateSavings() {
        // Get input values
        const initialDeposit = parseFloat(document.getElementById('initial-deposit').value) || 0;
        const monthlyContribution = parseFloat(document.getElementById('monthly-contribution').value) || 0;
        const contributionIncrease = parseFloat(document.getElementById('contribution-increase').value) || 0;
        const interestRate = parseFloat(document.getElementById('interest-rate').value) || 0;
        const compoundFrequency = parseInt(document.getElementById('compound-frequency').value) || 12;
        const years = parseInt(document.getElementById('years').value) || 0;
        const taxRate = parseFloat(document.getElementById('tax-rate').value) || 0;

        // Calculate savings
        const results = calculateSavingsGrowth(
            initialDeposit,
            monthlyContribution,
            contributionIncrease,
            interestRate,
            compoundFrequency,
            years,
            taxRate
        );

        // Update results display
        document.getElementById('end-balance').textContent = formatCurrency(results.endBalance);
        document.getElementById('total-contributions').textContent = formatCurrency(results.totalContributions);
        document.getElementById('total-interest').textContent = formatCurrency(results.totalInterest);
        document.getElementById('after-tax-balance').textContent = formatCurrency(results.afterTaxBalance);

        // Update chart
        updateSavingsChart(results.yearlyData);

        // Generate accumulation schedule
        generateScheduleTable(results.yearlyData);

        // Show results
        savingsResults.style.display = 'block';
        savingsResults.scrollIntoView({ behavior: 'smooth' });
    }

    function calculateSavingsGrowth(initial, monthlyContribution, contributionIncrease, interestRate, compoundFrequency, years, taxRate) {
        const periodicRate = (interestRate / 100) / compoundFrequency;
        const periodsPerYear = compoundFrequency;
        const totalPeriods = years * periodsPerYear;

        let balance = initial;
        let totalContributions = initial;
        let yearlyData = [];
        let currentContribution = monthlyContribution;

        for (let year = 1; year <= years; year++) {
            let yearlyInterest = 0;
            let yearlyContributions = 0;

            for (let period = 1; period <= periodsPerYear; period++) {
                // Add contribution
                balance += currentContribution;
                yearlyContributions += currentContribution;

                // Calculate interest
                const periodInterest = balance * periodicRate;
                balance += periodInterest;
                yearlyInterest += periodInterest;
            }

            // Increase contribution for next year
            currentContribution *= (1 + contributionIncrease / 100);
            totalContributions += yearlyContributions;

            yearlyData.push({
                year: year,
                balance: balance,
                contributions: yearlyContributions,
                interest: yearlyInterest
            });
        }

        const totalInterest = balance - totalContributions;
        const taxableAmount = totalInterest;
        const taxAmount = taxableAmount * (taxRate / 100);
        const afterTaxBalance = balance - taxAmount;

        return {
            endBalance: balance,
            totalContributions: totalContributions,
            totalInterest: totalInterest,
            afterTaxBalance: afterTaxBalance,
            yearlyData: yearlyData
        };
    }

    function updateSavingsChart(yearlyData) {
        const ctx = document.getElementById('savings-chart').getContext('2d');

        // Prepare data
        const labels = yearlyData.map(data => `Year ${data.year}`);
        const balanceData = yearlyData.map(data => data.balance);
        const contributionsData = yearlyData.map((data, index) => {
            return index === 0 ? 
                yearlyData[0].contributions : 
                yearlyData[index-1].contributions + yearlyData[index].contributions;
        });

        // Destroy existing chart if it exists
        if (savingsChart) {
            savingsChart.destroy();
        }

        // Create new chart
        savingsChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Balance',
                        data: balanceData,
                        borderColor: '#4ECDC4',
                        backgroundColor: 'rgba(78, 205, 196, 0.1)',
                        fill: true,
                        tension: 0.4
                    },
                    {
                        label: 'Contributions',
                        data: contributionsData,
                        borderColor: '#FF6B6B',
                        backgroundColor: 'rgba(255, 107, 107, 0.1)',
                        fill: true,
                        tension: 0.4
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
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return formatCurrency(value);
                            }
                        }
                    }
                }
            }
        });
    }

    function generateScheduleTable(yearlyData) {
        const scheduleContent = document.getElementById('schedule-content');
        let tableHTML = `
            <table class="schedule-table">
                <thead>
                    <tr>
                        <th>Year</th>
                        <th>Contributions</th>
                        <th>Interest</th>
                        <th>Balance</th>
                    </tr>
                </thead>
                <tbody>
        `;

        yearlyData.forEach(data => {
            tableHTML += `
                <tr>
                    <td>${data.year}</td>
                    <td>${formatCurrency(data.contributions)}</td>
                    <td>${formatCurrency(data.interest)}</td>
                    <td>${formatCurrency(data.balance)}</td>
                </tr>
            `;
        });

        tableHTML += '</tbody></table>';
        scheduleContent.innerHTML = tableHTML;
    }

    function formatCurrency(amount) {
        return `EGP ${amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
    }
    // --- Savings Goal Calculator ---
    const goalForm = document.getElementById('goal-form');
    const goalResults = document.getElementById('goal-results');
    let goalChart = null;
    if (goalForm) {
        goalForm.addEventListener('submit', function(e) {
            e.preventDefault();
            calculateGoal();
        });
    }
    function calculateGoal() {
        const FV = parseFloat(document.getElementById('goal-target').value) || 0;
        const PV = parseFloat(document.getElementById('goal-initial').value) || 0;
        const r = (parseFloat(document.getElementById('goal-rate').value) || 0) / 100;
        const n = parseInt(document.getElementById('goal-frequency').value) || 12;
        const t = parseInt(document.getElementById('goal-years').value) || 0;
        const periods = n * t;
        const i = r / n;
        let PMT = 0;
        if (i > 0) {
            PMT = (FV - PV * Math.pow(1 + i, periods)) * i / (Math.pow(1 + i, periods) - 1);
        } else {
            PMT = (FV - PV) / periods;
        }
        // Recalculate total contributions and interest for accuracy
        let totalContributions = PV;
        let balance = PV;
        let balances = [];
        for (let k = 1; k <= periods; k++) {
            balance = balance * (1 + i) + PMT;
            totalContributions += PMT;
            if (k % n === 0) balances.push(balance);
        }
        let totalInterest = balance - totalContributions;
        document.getElementById('goal-monthly').textContent = formatCurrency(PMT);
        document.getElementById('goal-total-contributions').textContent = formatCurrency(totalContributions);
        document.getElementById('goal-total-interest').textContent = formatCurrency(totalInterest);
        updateGoalChart(balances, t);
        goalResults.style.display = 'block';
        goalResults.scrollIntoView({ behavior: 'smooth' });
    }
    function updateGoalChart(balances, years) {
        const ctx = document.getElementById('goal-chart').getContext('2d');
        const labels = Array.from({length: years}, (_, i) => `Year ${i+1}`);
        if (goalChart) goalChart.destroy();
        goalChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Projected Balance',
                    data: balances,
                    borderColor: '#4ECDC4',
                    backgroundColor: 'rgba(78, 205, 196, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {legend: {position: 'top', labels: {font: {family: 'Inter'}}}, tooltip: {callbacks: {label: function(context) {return `${context.dataset.label}: ${formatCurrency(context.raw)}`;}}}},
                scales: {y: {beginAtZero: true, ticks: {callback: function(value) {return formatCurrency(value);}}}}
            }
        });
    }
    // --- Rate Comparison Calculator ---
    const compForm = document.getElementById('comparison-form');
    const compResults = document.getElementById('comparison-results');
    let compChart = null;
    if (compForm) {
        compForm.addEventListener('submit', function(e) {
            e.preventDefault();
            calculateComparison();
        });
    }
    function calculateComparison() {
        const PV = parseFloat(document.getElementById('comp-initial').value) || 0;
        const PMT = parseFloat(document.getElementById('comp-monthly').value) || 0;
        const r1 = (parseFloat(document.getElementById('comp-rate1').value) || 0) / 100;
        const r2 = (parseFloat(document.getElementById('comp-rate2').value) || 0) / 100;
        const n = parseInt(document.getElementById('comp-frequency').value) || 12;
        const t = parseInt(document.getElementById('comp-years').value) || 0;
        const periods = n * t;
        const i1 = r1 / n;
        const i2 = r2 / n;
        // FV formula as per calculator.net: FV = PV*(1+i)^N + PMT*(( (1+i)^N - 1 )/i )
        let FV1 = PV * Math.pow(1 + i1, periods) + PMT * ((Math.pow(1 + i1, periods) - 1) / i1);
        let FV2 = PV * Math.pow(1 + i2, periods) + PMT * ((Math.pow(1 + i2, periods) - 1) / i2);
        document.getElementById('comp-balance1').textContent = formatCurrency(FV1);
        document.getElementById('comp-balance2').textContent = formatCurrency(FV2);
        // Chart data for each year
        let balances1 = [], balances2 = [], b1 = PV, b2 = PV;
        for (let k = 1; k <= periods; k++) {
            b1 = b1 * (1 + i1) + PMT;
            b2 = b2 * (1 + i2) + PMT;
            if (k % n === 0) {
                balances1.push(b1);
                balances2.push(b2);
            }
        }
        updateComparisonChart(balances1, balances2, t);
        compResults.style.display = 'block';
        compResults.scrollIntoView({ behavior: 'smooth' });
    }
    function updateComparisonChart(balances1, balances2, years) {
        const ctx = document.getElementById('comparison-chart').getContext('2d');
        const labels = Array.from({length: years}, (_, i) => `Year ${i+1}`);
        if (compChart) compChart.destroy();
        compChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Rate 1',
                        data: balances1,
                        borderColor: '#4ECDC4',
                        backgroundColor: 'rgba(78, 205, 196, 0.1)',
                        fill: true,
                        tension: 0.4
                    },
                    {
                        label: 'Rate 2',
                        data: balances2,
                        borderColor: '#FF6B6B',
                        backgroundColor: 'rgba(255, 107, 107, 0.1)',
                        fill: true,
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {legend: {position: 'top', labels: {font: {family: 'Inter'}}}, tooltip: {callbacks: {label: function(context) {return `${context.dataset.label}: ${formatCurrency(context.raw)}`;}}}},
                scales: {y: {beginAtZero: true, ticks: {callback: function(value) {return formatCurrency(value);}}}}
            }
        });
    }
});