/**
 * Digital Financial Literacy & Inclusion Platform
 * Assessment Module
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize assessment functionality
    initAssessment();
});

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
            
            // Validate current step
            if (!validateAssessmentStep(currentStepNum)) {
                return;
            }
            
            // Update progress bar
            const progress = (nextStepNum - 1) / (assessmentSteps.length - 1) * 100;
            progressBar.style.width = `${progress}%`;
            
            // Show next step
            currentStep.classList.remove('active');
            document.querySelector(`.assessment-step[data-step="${nextStepNum}"]`).classList.add('active');
            
            // Scroll to top of container
            document.querySelector('.assessment-container').scrollIntoView({ behavior: 'smooth' });
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
            
            // Scroll to top of container
            document.querySelector('.assessment-container').scrollIntoView({ behavior: 'smooth' });
        });
    });
    
    // Handle submit button click
    if (submitButton) {
        submitButton.addEventListener('click', function() {
            // Validate final step
            if (!validateAssessmentStep(4)) {
                return;
            }
            
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
            
            // Scroll to top of container
            document.querySelector('.assessment-container').scrollIntoView({ behavior: 'smooth' });
        });
    }
    
    // Initialize range input displays
    document.getElementById('age')?.addEventListener('input', function() {
        document.getElementById('age-value').textContent = this.value;
    });
}

/**
 * Validate assessment step
 */
function validateAssessmentStep(stepNumber) {
    switch (stepNumber) {
        case 1:
            // Personal information step
            const name = document.getElementById('name').value;
            const age = document.getElementById('age').value;
            const gender = document.querySelector('input[name="gender"]:checked');
            const education = document.getElementById('education').value;
            
            if (!name || !age || !gender || !education) {
                showAssessmentError('Please fill in all required fields.');
                return false;
            }
            
            return true;
            
        case 2:
            // Digital literacy questions
            const q1 = document.querySelector('input[name="q1"]:checked');
            const q2 = document.querySelector('input[name="q2"]:checked');
            const q3 = document.querySelector('input[name="q3"]:checked');
            
            if (!q1 || !q2 || !q3) {
                showAssessmentError('Please answer all questions.');
                return false;
            }
            
            return true;
            
        case 3:
            // Financial literacy questions
            const q4 = document.querySelector('input[name="q4"]:checked');
            const q5 = document.querySelector('input[name="q5"]:checked');
            const q6 = document.querySelector('input[name="q6"]:checked');
            
            if (!q4 || !q5 || !q6) {
                showAssessmentError('Please answer all questions.');
                return false;
            }
            
            return true;
            
        case 4:
            // Financial inclusion questions
            const q7 = document.querySelector('input[name="q7"]:checked');
            const q8 = document.querySelector('input[name="q8"]:checked');
            const q9 = document.querySelector('input[name="q9"]:checked');
            
            if (!q7 || !q8 || !q9) {
                showAssessmentError('Please answer all questions.');
                return false;
            }
            
            return true;
            
        default:
            return true;
    }
}

/**
 * Show assessment error message
 */
function showAssessmentError(message) {
    // Create error message element
    const errorElement = document.createElement('div');
    errorElement.className = 'assessment-error';
    errorElement.textContent = message;
    errorElement.style.backgroundColor = '#FFEBEE';
    errorElement.style.color = '#F44336';
    errorElement.style.padding = 'var(--spacing-md)';
    errorElement.style.borderRadius = 'var(--radius-md)';
    errorElement.style.marginBottom = 'var(--spacing-md)';
    
    // Add to container
    const container = document.querySelector('.assessment-step.active');
    container.insertBefore(errorElement, container.firstChild);
    
    // Remove after 3 seconds
    setTimeout(() => {
        errorElement.style.opacity = '0';
        setTimeout(() => {
            errorElement.remove();
        }, 300);
    }, 3000);
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

// Add CSS animations for assessment
const assessmentAnimationStyles = document.createElement('style');
assessmentAnimationStyles.textContent = `
    .assessment-error {
        transition: opacity 0.3s ease;
    }
    
    .recommendation-card {
        opacity: 0;
        transform: translateY(20px);
        animation: fadeInUp 0.6s ease forwards;
    }
    
    .recommendation-card:nth-child(2) {
        animation-delay: 0.2s;
    }
    
    .recommendation-card:nth-child(3) {
        animation-delay: 0.4s;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;

document.head.appendChild(assessmentAnimationStyles);
