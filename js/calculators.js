// Ensure DOM is loaded before initializing
document.addEventListener("DOMContentLoaded", function() {
    initCalculators();
});

// formatNumber function is defined in utils.js

function initCalculators() {
    if (document.getElementById("loan-form")) {
        initLoanCalculator();
    }
    // Add calls for other calculators if needed
}

// Function to calculate monthly loan payment
function calculateLoanPayment(principal, annualRate, years) {
    console.log(`[calculateLoanPayment] Received: P=${principal} (type: ${typeof principal}), R=${annualRate} (type: ${typeof annualRate}), Y=${years} (type: ${typeof years})`);
    if (principal <= 0 || years <= 0 || annualRate < 0 || isNaN(principal) || isNaN(annualRate) || isNaN(years)) {
        console.error("[calculateLoanPayment] Invalid input detected:", { principal, annualRate, years });
        return NaN;
    }

    const monthlyRate = annualRate / 100 / 12;
    const numberOfPayments = years * 12;
    console.log(`[calculateLoanPayment] Monthly Rate: ${monthlyRate}, Number of Payments: ${numberOfPayments}`);

    if (monthlyRate === 0) {
        const payment = principal / numberOfPayments;
        console.log(`[calculateLoanPayment] Zero interest rate. Monthly Payment: ${payment}`);
        return payment;
    }

    const factor = Math.pow(1 + monthlyRate, numberOfPayments);
    console.log(`[calculateLoanPayment] Factor (1 + monthlyRate)^numberOfPayments: ${factor}`);
    if (!isFinite(factor)) {
        console.error("[calculateLoanPayment] Calculation resulted in non-finite factor.");
        return NaN;
    }
    const monthlyPayment = principal * (monthlyRate * factor) / (factor - 1);

    if (isNaN(monthlyPayment) || !isFinite(monthlyPayment)) {
        console.error("[calculateLoanPayment] Error calculating monthly payment. Result is NaN or Infinite.");
        return NaN;
    }
    console.log(`[calculateLoanPayment] Calculated Monthly Payment: ${monthlyPayment}`);
    return monthlyPayment;
}

// Initialize Loan Calculator functionality
function initLoanCalculator() {
    const loanForm = document.getElementById("loan-form");
    const resultsDiv = document.getElementById("loan-results");
    const monthlyPaymentEl = document.getElementById("monthly-payment");
    const totalPaymentEl = document.getElementById("total-payment");
    const totalInterestEl = document.getElementById("loan-total-interest"); // Using unique ID
    const resetButton = document.getElementById("loan-reset");
    const loanChartCanvas = document.getElementById("loan-chart");
    const amortizationTableBody = document.querySelector("#amortization-table tbody");

    // Get input elements once
    const loanAmountInput = document.getElementById("loan-amount");
    const interestRateInput = document.getElementById("loan-interest-rate");
    const loanTermInput = document.getElementById("loan-term");

    if (!loanForm || !resultsDiv || !monthlyPaymentEl || !totalPaymentEl || !totalInterestEl || !loanAmountInput || !interestRateInput || !loanTermInput) {
        console.error("Loan calculator elements missing from the DOM. Check IDs: loan-form, loan-results, monthly-payment, total-payment, loan-total-interest, loan-amount, loan-interest-rate, loan-term");
        return;
    }

    loanForm.addEventListener("submit", function (e) {
        e.preventDefault();
        console.log("--- Loan Calculate Button Clicked ---");

        // --- Input Reading & Logging ---
        const rawAmount = loanAmountInput.value;
        const rawRate = interestRateInput.value;
        const rawTerm = loanTermInput.value;
        console.log(`Raw Input Values: Amount='${rawAmount}', Rate='${rawRate}', Term='${rawTerm}'`);

        // --- Input Parsing & Logging ---
        let loanAmount = 0;
        let interestRate = 0;
        let loanTermYears = 0;
        try {
            loanAmount = parseFloat(rawAmount.replace(/,/g, ""));
            interestRate = parseFloat(rawRate);
            loanTermYears = parseInt(rawTerm, 10); // Explicitly use base 10 for parseInt
            console.log(`Parsed Input Values: Amount=${loanAmount} (type: ${typeof loanAmount}), Rate=${interestRate} (type: ${typeof interestRate}), Term=${loanTermYears} (type: ${typeof loanTermYears})`);
        } catch (error) {
            console.error("Error parsing input values:", error);
            alert("Please enter valid numbers for loan details.");
            return;
        }

        // --- Input Validation (including NaN checks) ---
        if (isNaN(loanAmount) || isNaN(interestRate) || isNaN(loanTermYears) || loanAmount <= 0 || interestRate < 0 || loanTermYears <= 0) {
             alert("Please enter valid loan details (Amount > 0, Rate >= 0, Term > 0).");
             console.warn(`Validation Failed: Amount=${loanAmount}, Rate=${interestRate}, Term=${loanTermYears}`);
             // Clear previous results if validation fails
             resultsDiv.style.display = "none";
             if (amortizationTableBody) amortizationTableBody.innerHTML = "";
             if (loanChartCanvas && loanChartCanvas.chart) {
                 loanChartCanvas.chart.destroy();
                 loanChartCanvas.chart = null;
             }
             return;
        }
        console.log("Input Validation Passed.");

        // --- Calculation ---
        console.log("Starting calculations...");
        const numberOfPayments = loanTermYears * 12;
        const monthlyPayment = calculateLoanPayment(loanAmount, interestRate, loanTermYears);

        if (isNaN(monthlyPayment)) {
             alert("Could not calculate payment. Please check inputs and console logs.");
             console.error("Monthly payment calculation returned NaN.");
             return;
        }

        const totalPayment = monthlyPayment * numberOfPayments;
        const totalInterest = totalPayment - loanAmount;
        console.log(`Calculated Results: Monthly=${monthlyPayment}, Total Payments=${numberOfPayments}, Total Payment=${totalPayment}, Total Interest=${totalInterest}`);

        // --- Clear Previous Results Before Update ---
        // Destroy existing chart instance if it exists
        if (loanChartCanvas && loanChartCanvas.chart) {
            console.log("Destroying previous loan chart.");
            loanChartCanvas.chart.destroy();
            loanChartCanvas.chart = null; // Remove reference
        }
        // Clear amortization table
        if (amortizationTableBody) {
            console.log("Clearing previous amortization table.");
            amortizationTableBody.innerHTML = "";
        }

        // --- Display Results ---
        console.log("Updating display elements...");
        monthlyPaymentEl.textContent = `EGP ${formatNumber(monthlyPayment)}`;
        totalPaymentEl.textContent = `EGP ${formatNumber(totalPayment)}`;
        // Use Math.max to prevent negative interest due to floating point issues
        const displayInterest = Math.max(0, totalInterest);
        totalInterestEl.textContent = `EGP ${formatNumber(displayInterest)}`;
        console.log(`Displayed Results: Monthly=${monthlyPaymentEl.textContent}, Total=${totalPaymentEl.textContent}, Interest=${totalInterestEl.textContent}`);

        resultsDiv.style.display = "block";
        // resultsDiv.scrollIntoView({ behavior: "smooth" }); // Optional: scroll to results

        // --- Update Chart & Table ---
        if (typeof updateLoanChart === "function" && loanChartCanvas) {
             console.log("Attempting to update loan chart...");
             updateLoanChart(loanAmount, displayInterest);
        } else {
             console.warn("updateLoanChart function not found or canvas missing.");
        }

        if (typeof createAmortizationTable === "function" && amortizationTableBody) {
             console.log("Attempting to create amortization table...");
             createAmortizationTable(loanAmount, interestRate, loanTermYears);
        } else {
             console.warn("createAmortizationTable function not found or table body missing.");
        }
        console.log("--- Loan Calculation Complete ---");
    });

    // --- Reset Button Logic ---
    if (resetButton) {
        resetButton.addEventListener("click", function () {
            console.log("--- Loan Reset Button Clicked ---");
            loanForm.reset();
            resultsDiv.style.display = "none";
            if (amortizationTableBody) {
                amortizationTableBody.innerHTML = "";
            }
            if (loanChartCanvas && loanChartCanvas.chart) {
                loanChartCanvas.chart.destroy();
                loanChartCanvas.chart = null;
            }
            console.log("Loan form and results reset.");
        });
    } else {
        console.warn("Reset button with ID 'loan-reset' not found.");
    }
}

// --- Amortization Table Creation ---
function createAmortizationTable(loanAmount, interestRate, years) {
    const tableBody = document.querySelector("#amortization-table tbody");
    if (!tableBody) {
        console.warn("[createAmortizationTable] Table body not found.");
        return;
    }
    console.log(`[createAmortizationTable] Creating table for Amount=${loanAmount}, Rate=${interestRate}, Years=${years}`);

    // Ensure table is clear before adding rows
    tableBody.innerHTML = "";

    const monthlyRate = interestRate / 100 / 12;
    const totalMonths = years * 12;
    const monthlyPayment = calculateLoanPayment(loanAmount, interestRate, years);

    if (isNaN(monthlyPayment) || totalMonths <= 0) {
        console.error("[createAmortizationTable] Cannot create table due to invalid inputs or payment calculation.");
        return;
    }
    console.log(`[createAmortizationTable] Monthly Payment: ${monthlyPayment}, Total Months: ${totalMonths}`);

    let balance = loanAmount;
    let cumulativeInterest = 0;
    let cumulativePrincipal = 0;

    for (let year = 1; year <= years; year++) {
        let yearlyPrincipal = 0;
        let yearlyInterest = 0;
        console.log(`[createAmortizationTable] Processing Year ${year}`);

        for (let month = 1; month <= 12; month++) {
            const currentMonth = (year - 1) * 12 + month;
            if (currentMonth > totalMonths) break;

            const interestPayment = balance * monthlyRate;
            let principalPayment = monthlyPayment - interestPayment;

            // Adjust final payment precisely to avoid rounding errors leaving small balance
            if (currentMonth === totalMonths || balance < monthlyPayment) {
                 principalPayment = balance;
                 // Recalculate effective monthly payment for the last month if needed
                 // const lastPayment = balance + interestPayment;
            }

            // Ensure payments are not negative
            const effectiveInterestPayment = Math.max(0, interestPayment);
            const effectivePrincipalPayment = Math.max(0, principalPayment);

            yearlyInterest += effectiveInterestPayment;
            yearlyPrincipal += effectivePrincipalPayment;
            cumulativeInterest += effectiveInterestPayment;
            cumulativePrincipal += effectivePrincipalPayment;

            balance -= effectivePrincipalPayment;

            // Prevent tiny negative balances due to floating point math
            if (balance < 0.01) {
                balance = 0;
            }
        }

        console.log(`[createAmortizationTable] Year ${year} Summary: Principal=${yearlyPrincipal}, Interest=${yearlyInterest}, End Balance=${balance}`);
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${year}</td>
            <td>EGP ${formatNumber(yearlyPrincipal)}</td>
            <td>EGP ${formatNumber(yearlyInterest)}</td>
            <td>EGP ${formatNumber(balance)}</td>
        `;
        tableBody.appendChild(row);

        if (balance <= 0) {
            console.log(`[createAmortizationTable] Balance reached zero in year ${year}. Stopping table generation.`);
            break;
        }
    }

    console.log(`[createAmortizationTable] Table Created. Cumulative Interest: ${formatNumber(cumulativeInterest)}, Cumulative Principal: ${formatNumber(cumulativePrincipal)}`);
    const calculatedTotalInterest = (monthlyPayment * totalMonths) - loanAmount;
    console.log(`[createAmortizationTable] Directly Calculated Total Interest: ${formatNumber(Math.max(0, calculatedTotalInterest))}`);
}

// --- Loan Chart Update ---
// Assumes updateLoanChart is defined globally by charts.js or similar
function updateLoanChart(principal, interest) {
    const canvas = document.getElementById('loan-chart');
    if (!canvas) {
        console.warn("[updateLoanChart] Canvas element 'loan-chart' not found.");
        return;
    }

    // Destroy existing chart if it exists (handled in submit listener now, but safe check)
    if (canvas.chart) {
        console.warn("[updateLoanChart] Existing chart found on canvas. Destroying.");
        canvas.chart.destroy();
        canvas.chart = null;
    }

    console.log(`[updateLoanChart] Updating chart with Principal=${principal}, Interest=${interest}`);

    // Ensure Chart object is available
    if (typeof Chart === 'undefined') {
        console.error("[updateLoanChart] Chart.js library not loaded or available.");
        return;
    }

    try {
        canvas.chart = new Chart(canvas, {
            type: 'pie',
            data: {
                labels: ['Principal', 'Interest'],
                datasets: [{
                    data: [principal, Math.max(0, interest)], // Ensure interest isn't negative
                    backgroundColor: [
                        '#2196F3', // Blue for Principal
                        '#FF9800'  // Orange for Interest
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
                                const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                                const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
                                return `${label}: EGP ${formatNumber(value)} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
        console.log("[updateLoanChart] Chart updated successfully.");
    } catch (error) {
        console.error("[updateLoanChart] Error creating/updating loan chart:", error);
    }
}

