class LoanCalculator {
    constructor() {
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        document.getElementById('calculate-btn')?.addEventListener('click', () => this.calculateLoan());
        document.getElementById('loan-type')?.addEventListener('change', () => this.toggleCalculatorType());
    }

    calculateLoan() {
        const loanAmount = parseFloat(document.getElementById('loan-amount').value);
        const interestRate = parseFloat(document.getElementById('interest-rate').value) / 100;
        const loanTerm = parseInt(document.getElementById('loan-term').value);
        const compoundingFrequency = document.getElementById('compounding-frequency').value;
        const paymentFrequency = document.getElementById('payment-frequency').value;

        const loanType = document.getElementById('loan-type').value;

        switch(loanType) {
            case 'amortized':
                this.calculateAmortizedLoan(loanAmount, interestRate, loanTerm, compoundingFrequency, paymentFrequency);
                break;
            case 'deferred':
                this.calculateDeferredLoan(loanAmount, interestRate, loanTerm, compoundingFrequency);
                break;
            case 'bond':
                this.calculateBondLoan(loanAmount, interestRate, loanTerm, compoundingFrequency);
                break;
        }
    }

    calculateAmortizedLoan(principal, annualRate, years, compoundingFrequency, paymentFrequency) {
        const numberOfPayments = years * this.getPaymentsPerYear(paymentFrequency);
        const ratePerPeriod = this.getEffectiveRate(annualRate, compoundingFrequency, paymentFrequency);
        
        const monthlyPayment = principal * 
            (ratePerPeriod * Math.pow(1 + ratePerPeriod, numberOfPayments)) / 
            (Math.pow(1 + ratePerPeriod, numberOfPayments) - 1);

        const totalPayment = monthlyPayment * numberOfPayments;
        const totalInterest = totalPayment - principal;

        this.updateResults({
            payment: monthlyPayment.toFixed(2),
            totalPayment: totalPayment.toFixed(2),
            totalInterest: totalInterest.toFixed(2),
            numberOfPayments
        });

        this.generateAmortizationSchedule(principal, monthlyPayment, ratePerPeriod, numberOfPayments);
    }

    calculateDeferredLoan(principal, annualRate, years, compoundingFrequency) {
        const periods = years * this.getCompoundingPeriodsPerYear(compoundingFrequency);
        const ratePerPeriod = annualRate / this.getCompoundingPeriodsPerYear(compoundingFrequency);
        
        const finalAmount = principal * Math.pow(1 + ratePerPeriod, periods);
        const totalInterest = finalAmount - principal;

        this.updateResults({
            finalAmount: finalAmount.toFixed(2),
            totalInterest: totalInterest.toFixed(2)
        });
    }

    calculateBondLoan(faceValue, annualRate, years, compoundingFrequency) {
        const periods = years * this.getCompoundingPeriodsPerYear(compoundingFrequency);
        const ratePerPeriod = annualRate / this.getCompoundingPeriodsPerYear(compoundingFrequency);
        
        const presentValue = faceValue / Math.pow(1 + ratePerPeriod, periods);
        const totalInterest = faceValue - presentValue;

        this.updateResults({
            presentValue: presentValue.toFixed(2),
            totalInterest: totalInterest.toFixed(2)
        });
    }

    getPaymentsPerYear(frequency) {
        const frequencies = {
            'monthly': 12,
            'bi-weekly': 26,
            'weekly': 52,
            'daily': 365
        };
        return frequencies[frequency] || 12;
    }

    getCompoundingPeriodsPerYear(frequency) {
        const frequencies = {
            'annually': 1,
            'semi-annually': 2,
            'quarterly': 4,
            'monthly': 12,
            'daily': 365,
            'continuously': Infinity
        };
        return frequencies[frequency] || 12;
    }

    getEffectiveRate(annualRate, compoundingFrequency, paymentFrequency) {
        const compoundingPeriods = this.getCompoundingPeriodsPerYear(compoundingFrequency);
        const paymentPeriods = this.getPaymentsPerYear(paymentFrequency);
        
        if (compoundingPeriods === Infinity) {
            // Continuous compounding
            const effectiveAnnualRate = Math.exp(annualRate) - 1;
            return Math.pow(1 + effectiveAnnualRate, 1/paymentPeriods) - 1;
        }
        
        const effectiveAnnualRate = Math.pow(1 + annualRate/compoundingPeriods, compoundingPeriods) - 1;
        return Math.pow(1 + effectiveAnnualRate, 1/paymentPeriods) - 1;
    }

    generateAmortizationSchedule(principal, payment, ratePerPeriod, numberOfPayments) {
        let schedule = [];
        let balance = principal;
        let totalInterest = 0;

        for (let i = 1; i <= numberOfPayments; i++) {
            const interestPayment = balance * ratePerPeriod;
            const principalPayment = payment - interestPayment;
            balance -= principalPayment;
            totalInterest += interestPayment;

            schedule.push({
                payment: i,
                principalPayment: principalPayment.toFixed(2),
                interestPayment: interestPayment.toFixed(2),
                totalInterest: totalInterest.toFixed(2),
                remainingBalance: Math.max(0, balance).toFixed(2)
            });
        }

        this.updateAmortizationTable(schedule);
    }

    updateResults(results) {
        Object.keys(results).forEach(key => {
            const element = document.getElementById(`result-${key}`);
            if (element) {
                element.textContent = results[key];
                this.animateValue(element);
            }
        });
        this.updateCharts(results);
    }

    updateAmortizationTable(schedule) {
        const tableBody = document.getElementById('amortization-table-body');
        if (!tableBody) return;

        tableBody.innerHTML = '';
        schedule.forEach(row => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${row.payment}</td>
                <td>$${row.principalPayment}</td>
                <td>$${row.interestPayment}</td>
                <td>$${row.totalInterest}</td>
                <td>$${row.remainingBalance}</td>
            `;
            tableBody.appendChild(tr);
        });
    }

    updateCharts(results) {
        // Update pie chart for Principal vs Interest
        if (results.totalPayment && results.totalInterest) {
            const principal = parseFloat(results.totalPayment) - parseFloat(results.totalInterest);
            this.createPieChart('payment-distribution-chart', [
                ['Principal', principal],
                ['Interest', parseFloat(results.totalInterest)]
            ]);
        }
    }

    createPieChart(elementId, data) {
        const ctx = document.getElementById(elementId)?.getContext('2d');
        if (!ctx) return;

        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: data.map(d => d[0]),
                datasets: [{
                    data: data.map(d => d[1]),
                    backgroundColor: ['#4CAF50', '#FF5722']
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    animateValue(element) {
        const start = parseFloat(element.dataset.lastValue || 0);
        const end = parseFloat(element.textContent);
        element.dataset.lastValue = end;
        
        const duration = 1000;
        const steps = 60;
        const step = (end - start) / steps;
        
        let current = start;
        const animate = () => {
            current += step;
            if ((step > 0 && current >= end) || (step < 0 && current <= end)) {
                element.textContent = end.toFixed(2);
                return;
            }
            element.textContent = current.toFixed(2);
            requestAnimationFrame(animate);
        };
        animate();
    }

    toggleCalculatorType() {
        const loanType = document.getElementById('loan-type').value;
        document.querySelectorAll('.calculator-section').forEach(section => {
            section.style.display = 'none';
        });
        document.getElementById(`${loanType}-calculator`).style.display = 'block';
    }
}

// Initialize the calculator
document.addEventListener('DOMContentLoaded', () => {
    new LoanCalculator();
}); 