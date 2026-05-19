/**
 * Digital Financial Literacy & Inclusion Platform
 * Animations and UI Interactions for Calculators
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize animations
    initAnimations();
    
    // Initialize UI interactions
    initUIInteractions();
});

/**
 * Initialize animations
 */
function initAnimations() {
    // Animate header elements
    animateHeaderElements();
    
    // Animate calculator cards on load
    animateCalculatorCards();
    
    // Animate elements when they come into view
    animateOnScroll('.calculator-card', 'card-visible');
    animateOnScroll('.results-card', 'card-visible');
}

/**
 * Animate header elements
 */
function animateHeaderElements() {
    const headerContent = document.querySelector('.header-content');
    const calculatorNav = document.querySelector('.calculator-nav');
    
    if (headerContent) {
        headerContent.classList.add('animate-fade-in');
        headerContent.style.animationDelay = '0.2s';
    }
    
    if (calculatorNav) {
        calculatorNav.classList.add('animate-fade-in');
        calculatorNav.style.animationDelay = '0.4s';
    }
}

/**
 * Animate calculator cards
 */
function animateCalculatorCards() {
    const calculatorCards = document.querySelectorAll('.calculator-card');
    const resultsCards = document.querySelectorAll('.results-card');
    
    calculatorCards.forEach((card, index) => {
        card.classList.add('animate-fade-in');
        card.style.animationDelay = `${0.2 + (index * 0.1)}s`;
    });
    
    resultsCards.forEach((card, index) => {
        card.classList.add('animate-fade-in');
        card.style.animationDelay = `${0.4 + (index * 0.1)}s`;
    });
}

/**
 * Animate elements when they come into view
 */
function animateOnScroll(selector, visibleClass) {
    const elements = document.querySelectorAll(selector);
    
    if (!elements.length) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add(visibleClass);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2
    });
    
    elements.forEach(element => {
        observer.observe(element);
    });
}

/**
 * Initialize UI interactions
 */
function initUIInteractions() {
    // Add hover effects to buttons
    addButtonHoverEffects();
    
    // Add hover effects to calculator cards
    addCardHoverEffects();
    
    // Add input field focus effects
    addInputFocusEffects();
}

/**
 * Add hover effects to buttons
 */
function addButtonHoverEffects() {
    const buttons = document.querySelectorAll('.calculate-btn, .reset-btn, .nav-btn');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
            this.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
        });
    });
}

/**
 * Add hover effects to calculator cards
 */
function addCardHoverEffects() {
    const cards = document.querySelectorAll('.calculator-card, .results-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 25px 50px rgba(0,0,0,0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
        });
    });
}

/**
 * Add focus effects to input fields
 */
function addInputFocusEffects() {
    const inputs = document.querySelectorAll('input, select');
    
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('input-focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('input-focused');
        });
    });
}

// Add CSS animations
const animationStyles = document.createElement('style');
animationStyles.textContent = `
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes scaleIn {
        from {
            opacity: 0;
            transform: scale(0.9);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }
    
    @keyframes slideInLeft {
        from {
            opacity: 0;
            transform: translateX(-30px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(30px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    .animate-fade-in {
        opacity: 0;
        animation: fadeIn 0.8s ease forwards;
    }
    
    .calculator-card, .results-card {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease, transform 0.6s ease, box-shadow 0.3s ease;
    }
    
    .card-visible {
        opacity: 1;
        transform: translateY(0);
    }
    
    .input-focused {
        transform: scale(1.02);
        transition: transform 0.3s ease;
    }
`;

// Check if animation styles have already been added to avoid duplication
if (!document.querySelector('style[data-animation-styles="calculator"]')) {
    animationStyles.setAttribute('data-animation-styles', 'calculator');
    document.head.appendChild(animationStyles);
}