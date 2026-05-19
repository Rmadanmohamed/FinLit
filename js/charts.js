/**
 * Digital Financial Literacy & Inclusion Platform
 * Dynamic Charts Implementation
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all charts
    initDigitalBankingAdoptionChart();
    initFinancialLiteracyScoresChart();
    initMobilePaymentUsageChart();
    initFinancialInclusionIndexChart();
});

/**
 * Initialize Digital Banking Adoption Chart
 */
function initDigitalBankingAdoptionChart() {
    const ctx = document.getElementById('digital-banking-adoption-chart');
    if (!ctx) return;
    
    // Data for digital banking adoption over years
    const data = {
        labels: ['2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025'],
        datasets: [
            {
                label: 'Urban Areas',
                data: [32, 38, 45, 53, 62, 68, 75, 82],
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
                data: [15, 19, 24, 30, 38, 45, 52, 60],
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
    
    // Chart configuration
    const config = {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        font: {
                            family: "'Poppins', sans-serif",
                            size: 12
                        },
                        padding: 20,
                        usePointStyle: true,
                        pointStyle: 'circle'
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    titleFont: {
                        family: "'Poppins', sans-serif",
                        size: 14,
                        weight: 'bold'
                    },
                    bodyFont: {
                        family: "'Roboto', sans-serif",
                        size: 13
                    },
                    padding: 12,
                    cornerRadius: 8,
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.parsed.y + '%';
                        }
                    }
                },
                title: {
                    display: true,
                    text: 'Digital Banking Adoption Trends',
                    font: {
                        family: "'Poppins', sans-serif",
                        size: 16,
                        weight: 'bold'
                    },
                    padding: {
                        top: 10,
                        bottom: 20
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
                            family: "'Roboto', sans-serif",
                            size: 12
                        }
                    }
                },
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        },
                        font: {
                            family: "'Roboto', sans-serif",
                            size: 12
                        }
                    },
                    grid: {
                        borderDash: [2, 4]
                    }
                }
            },
            animation: {
                duration: 2000,
                easing: 'easeOutQuart'
            },
            interaction: {
                mode: 'index',
                intersect: false
            },
            elements: {
                line: {
                    tension: 0.4
                }
            }
        }
    };
    
    // Create the chart
    const chart = new Chart(ctx, config);
    
    // Add accessibility features
    addChartAccessibility(ctx, 'Digital Banking Adoption Trends', 'Line chart showing the percentage of digital banking adoption in urban and rural areas from 2018 to 2025. Urban areas show higher adoption rates, increasing from 32% in 2018 to 82% in 2025, while rural areas show growth from 15% to 60% in the same period.');
}

/**
 * Initialize Financial Literacy Scores Chart
 */
function initFinancialLiteracyScoresChart() {
    const ctx = document.getElementById('financial-literacy-scores-chart');
    if (!ctx) return;
    
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
    
    // Chart configuration
    const config = {
        type: 'bar',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        font: {
                            family: "'Poppins', sans-serif",
                            size: 12
                        },
                        padding: 20,
                        usePointStyle: true,
                        pointStyle: 'rect'
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    titleFont: {
                        family: "'Poppins', sans-serif",
                        size: 14,
                        weight: 'bold'
                    },
                    bodyFont: {
                        family: "'Roboto', sans-serif",
                        size: 13
                    },
                    padding: 12,
                    cornerRadius: 8,
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.parsed.y + '/100';
                        }
                    }
                },
                title: {
                    display: true,
                    text: 'Financial Literacy Scores by Education Level',
                    font: {
                        family: "'Poppins', sans-serif",
                        size: 16,
                        weight: 'bold'
                    },
                    padding: {
                        top: 10,
                        bottom: 20
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
                            family: "'Roboto', sans-serif",
                            size: 12
                        }
                    }
                },
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        font: {
                            family: "'Roboto', sans-serif",
                            size: 12
                        }
                    },
                    grid: {
                        borderDash: [2, 4]
                    }
                }
            },
            animation: {
                delay: function(context) {
                    return context.dataIndex * 100 + context.datasetIndex * 300;
                },
                duration: 1000,
                easing: 'easeOutQuart'
            },
            interaction: {
                mode: 'index',
                intersect: false
            }
        }
    };
    
    // Create the chart
    const chart = new Chart(ctx, config);
    
    // Add accessibility features
    addChartAccessibility(ctx, 'Financial Literacy Scores by Education Level', 'Bar chart showing financial literacy scores across three categories (Knowledge, Behavior, and Attitude) for different education levels. Scores increase with education level, with postgraduate education showing the highest scores across all categories.');
}

/**
 * Initialize Mobile Payment Usage Chart
 */
function initMobilePaymentUsageChart() {
    const ctx = document.getElementById('mobile-payment-usage-chart');
    if (!ctx) return;
    
    // Data for mobile payment usage by age group
    const data = {
        labels: ['18-24', '25-34', '35-44', '45-54', '55-64', '65+'],
        datasets: [{
            data: [78, 85, 65, 45, 30, 15],
            backgroundColor: [
                'rgba(102, 126, 234, 0.8)',
                'rgba(118, 75, 162, 0.8)',
                'rgba(255, 107, 107, 0.8)',
                'rgba(78, 205, 196, 0.8)',
                'rgba(255, 206, 86, 0.8)',
                'rgba(153, 102, 255, 0.8)'
            ],
            borderColor: [
                'rgba(102, 126, 234, 1)',
                'rgba(118, 75, 162, 1)',
                'rgba(255, 107, 107, 1)',
                'rgba(78, 205, 196, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(153, 102, 255, 1)'
            ],
            borderWidth: 2,
            hoverOffset: 15
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
                        padding: 20,
                        generateLabels: function(chart) {
                            const data = chart.data;
                            if (data.labels.length && data.datasets.length) {
                                return data.labels.map(function(label, i) {
                                    const meta = chart.getDatasetMeta(0);
                                    const style = meta.controller.getStyle(i);
                                    
                                    return {
                                        text: label + ': ' + data.datasets[0].data[i] + '%',
                                        fillStyle: style.backgroundColor,
                                        strokeStyle: style.borderColor,
                                        lineWidth: style.borderWidth,
                                        hidden: isNaN(data.datasets[0].data[i]) || meta.data[i].hidden,
                                        index: i
                                    };
                                });
                            }
                            return [];
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    titleFont: {
                        family: "'Poppins', sans-serif",
                        size: 14,
                        weight: 'bold'
                    },
                    bodyFont: {
                        family: "'Roboto', sans-serif",
                        size: 13
                    },
                    padding: 12,
                    cornerRadius: 8,
                    callbacks: {
                        label: function(context) {
                            return context.label + ': ' + context.parsed + '%';
                        }
                    }
                },
                title: {
                    display: true,
                    text: 'Mobile Payment Usage by Age Group',
                    font: {
                        family: "'Poppins', sans-serif",
                        size: 16,
                        weight: 'bold'
                    },
                    padding: {
                        top: 10,
                        bottom: 20
                    }
                }
            },
            animation: {
                animateRotate: true,
                animateScale: true,
                duration: 2000,
                easing: 'easeOutCirc'
            },
            cutout: '60%',
            layout: {
                padding: 20
            }
        }
    };
    
    // Create the chart
    const chart = new Chart(ctx, config);
    
    // Add accessibility features
    addChartAccessibility(ctx, 'Mobile Payment Usage by Age Group', 'Doughnut chart showing mobile payment usage percentages by age group. Usage is highest among 25-34 year olds at 85%, followed by 18-24 year olds at 78%. Usage decreases with age, with only 15% of those 65+ using mobile payments.');
}

/**
 * Initialize Financial Inclusion Index Chart
 */
function initFinancialInclusionIndexChart() {
    const ctx = document.getElementById('financial-inclusion-index-chart');
    if (!ctx) return;
    
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
        }, {
            label: 'Credit Access',
            data: [80, 70, 45, 25],
            backgroundColor: 'rgba(255, 206, 86, 0.7)',
            borderColor: 'rgba(255, 206, 86, 1)',
            borderWidth: 1,
            pointBackgroundColor: 'rgba(255, 206, 86, 1)',
            pointRadius: 5,
            pointHoverRadius: 7
        }]
    };
    
    // Chart configuration
    const config = {
        type: 'radar',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        font: {
                            family: "'Poppins', sans-serif",
                            size: 12
                        },
                        padding: 20,
                        usePointStyle: true,
                        pointStyle: 'circle'
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    titleFont: {
                        family: "'Poppins', sans-serif",
                        size: 14,
                        weight: 'bold'
                    },
                    bodyFont: {
                        family: "'Roboto', sans-serif",
                        size: 13
                    },
                    padding: 12,
                    cornerRadius: 8,
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.parsed.r + '%';
                        }
                    }
                },
                title: {
                    display: true,
                    text: 'Financial Inclusion Index by Region',
                    font: {
                        family: "'Poppins', sans-serif",
                        size: 16,
                        weight: 'bold'
                    },
                    padding: {
                        top: 10,
                        bottom: 20
                    }
                }
            },
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        stepSize: 20,
                        callback: function(value) {
                            return value + '%';
                        },
                        backdropColor: 'rgba(255, 255, 255, 0.75)'
                    },
                    pointLabels: {
                        font: {
                            family: "'Poppins', sans-serif",
                            size: 14,
                            weight: 'bold'
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    },
                    angleLines: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                }
            },
            animation: {
                duration: 2000,
                easing: 'easeOutQuart'
            },
            elements: {
                line: {
                    tension: 0.1
                }
            }
        }
    };
    
    // Create the chart
    const chart = new Chart(ctx, config);
    
    // Add accessibility features
    addChartAccessibility(ctx, 'Financial Inclusion Index by Region', 'Radar chart showing financial inclusion metrics across different regions. Urban areas show the highest levels of inclusion across all metrics, while remote areas show the lowest. The metrics measured are Account Ownership, Digital Access, Financial Literacy, and Credit Access.');
}

/**
 * Add accessibility features to charts
 */
function addChartAccessibility(chartElement, title, description) {
    // Add ARIA attributes
    chartElement.setAttribute('role', 'img');
    chartElement.setAttribute('aria-label', title);
    
    // Create a visually hidden description for screen readers
    const descriptionElement = document.createElement('p');
    descriptionElement.className = 'sr-only';
    descriptionElement.textContent = description;
    
    // Insert after chart
    chartElement.parentNode.insertBefore(descriptionElement, chartElement.nextSibling);
    
    // Add tabindex to make the chart focusable
    chartElement.setAttribute('tabindex', '0');
    
    // Add keyboard event to announce description
    chartElement.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            announceToScreenReader(description);
        }
    });
}

/**
 * Announce message to screen readers
 */
function announceToScreenReader(message) {
    // Create or get the live region
    let liveRegion = document.getElementById('chart-sr-live-region');
    
    if (!liveRegion) {
        liveRegion = document.createElement('div');
        liveRegion.id = 'chart-sr-live-region';
        liveRegion.className = 'sr-only';
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        document.body.appendChild(liveRegion);
    }
    
    // Set the message
    liveRegion.textContent = message;
    
    // Clear after a delay
    setTimeout(() => {
        liveRegion.textContent = '';
    }, 5000);
}

// Add CSS for screen reader only elements if not already defined
if (!document.querySelector('style[data-id="chart-accessibility"]')) {
    const style = document.createElement('style');
    style.setAttribute('data-id', 'chart-accessibility');
    style.textContent = `
        .sr-only {
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border-width: 0;
        }
        
        canvas:focus {
            outline: 3px solid var(--primary-color);
            outline-offset: 2px;
        }
    `;
    document.head.appendChild(style);
}

// Create chart containers in the analytics section if they don't exist
document.addEventListener('DOMContentLoaded', function() {
    const analyticsSection = document.querySelector('#analytics .container');
    
    if (analyticsSection) {
        // Check if chart containers already exist
        if (!document.getElementById('digital-banking-adoption-chart')) {
            createChartContainers(analyticsSection);
        }
    }
});

/**
 * Create chart containers in the analytics section
 */
function createChartContainers(container) {
    // Create chart grid
    const chartGrid = document.createElement('div');
    chartGrid.className = 'analytics-grid';
    chartGrid.style.display = 'grid';
    chartGrid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(300px, 1fr))';
    chartGrid.style.gap = '30px';
    chartGrid.style.marginTop = '40px';
    
    // Digital Banking Adoption Chart
    const digitalBankingCard = createChartCard(
        'digital-banking-adoption-chart',
        'Digital Banking Adoption',
        'Percentage of population using digital banking services over time'
    );
    
    // Financial Literacy Scores Chart
    const financialLiteracyCard = createChartCard(
        'financial-literacy-scores-chart',
        'Financial Literacy Scores',
        'Financial literacy scores by education level'
    );
    
    // Mobile Payment Usage Chart
    const mobilePaymentCard = createChartCard(
        'mobile-payment-usage-chart',
        'Mobile Payment Usage',
        'Percentage of population using mobile payment services by age group'
    );
    
    // Financial Inclusion Index Chart
    const financialInclusionCard = createChartCard(
        'financial-inclusion-index-chart',
        'Financial Inclusion Index',
        'Financial inclusion metrics across different regions'
    );
    
    // Add cards to grid
    chartGrid.appendChild(digitalBankingCard);
    chartGrid.appendChild(financialLiteracyCard);
    chartGrid.appendChild(mobilePaymentCard);
    chartGrid.appendChild(financialInclusionCard);
    
    // Add grid to container
    container.appendChild(chartGrid);
}

/**
 * Create a chart card with canvas
 */
function createChartCard(chartId, title, description) {
    const card = document.createElement('div');
    card.className = 'analytics-card';
    card.style.backgroundColor = 'white';
    card.style.borderRadius = '15px';
    card.style.padding = '20px';
    card.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
    
    const cardTitle = document.createElement('h3');
    cardTitle.textContent = title;
    cardTitle.style.marginBottom = '10px';
    cardTitle.style.fontSize = '1.2rem';
    cardTitle.style.color = '#333';
    
    const cardDescription = document.createElement('p');
    cardDescription.textContent = description;
    cardDescription.style.marginBottom = '20px';
    cardDescription.style.color = '#666';
    cardDescription.style.fontSize = '0.9rem';
    
    const chartContainer = document.createElement('div');
    chartContainer.style.height = '300px';
    chartContainer.style.position = 'relative';
    
    const canvas = document.createElement('canvas');
    canvas.id = chartId;
    canvas.setAttribute('aria-label', title);
    canvas.setAttribute('role', 'img');
    
    chartContainer.appendChild(canvas);
    
    card.appendChild(cardTitle);
    card.appendChild(cardDescription);
    card.appendChild(chartContainer);
    
    return card;
}
