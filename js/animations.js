/**
 * Digital Financial Literacy & Inclusion Platform
 * Animations and UI Interactions
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
    // Animate hero section elements
    animateHeroElements();
    
    // Animate feature cards on scroll
    animateOnScroll('.feature-card', 'feature-card-visible');
    
    // Animate analytics charts on scroll
    animateOnScroll('.analytics-card', 'analytics-card-visible');
    
    // Animate resource cards on scroll
    animateOnScroll('.resource-card', 'resource-card-visible');
    
    // Animate account sections on scroll
    animateOnScroll('.account-section', 'account-section-visible');
    
    // Animate calculation cards on scroll
    animateOnScroll('.calculation-card', 'calculation-card-visible');
    
    // Animate form groups on scroll
    animateOnScroll('.form-group', 'form-group-visible');
}

/**
 * Animate hero section elements
 */
function animateHeroElements() {
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroButtons = document.querySelector('.hero-buttons');
    const heroImage = document.querySelector('.hero-image');
    
    if (heroTitle) {
        heroTitle.classList.add('animate-fade-in');
        heroTitle.style.animationDelay = '0.2s';
    }
    
    if (heroSubtitle) {
        heroSubtitle.classList.add('animate-fade-in');
        heroSubtitle.style.animationDelay = '0.4s';
    }
    
    if (heroButtons) {
        heroButtons.classList.add('animate-fade-in');
        heroButtons.style.animationDelay = '0.6s';
    }
    
    if (heroImage) {
        heroImage.classList.add('animate-fade-in');
        heroImage.style.animationDelay = '0.8s';
    }
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
    
    // Add hover effects to feature cards
    addFeatureCardHoverEffects();
    
    // Add hover effects to resource cards
    addResourceCardHoverEffects();
    
    // Add hover effects to calculation cards
    addCalculationCardHoverEffects();
    
    // Add parallax effect to hero section
    addHeroParallaxEffect();
    
    // Add focus effects to form fields
    addFormFieldFocusEffects();
    
    // Add active state to navigation buttons
    addActiveStateToNavButtons();
}

/**
 * Add hover effects to buttons
 */
function addButtonHoverEffects() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
            this.style.boxShadow = 'var(--shadow-lg)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
        });
    });
}

/**
 * Add hover effects to feature cards
 */
function addFeatureCardHoverEffects() {
    const cards = document.querySelectorAll('.feature-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
            this.style.boxShadow = 'var(--shadow-lg)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
        });
    });
}

/**
 * Add hover effects to resource cards
 */
function addResourceCardHoverEffects() {
    const cards = document.querySelectorAll('.resource-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = 'var(--shadow-lg)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
        });
    });
}

/**
 * Add parallax effect to hero section
 */
function addHeroParallaxEffect() {
    const hero = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');
    const heroImage = document.querySelector('.hero-image');
    
    if (!hero || !heroContent || !heroImage) return;
    
    window.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY;
        
        if (scrollPosition < hero.offsetHeight) {
            heroContent.style.transform = `translateY(${scrollPosition * 0.2}px)`;
            heroImage.style.transform = `translateY(${scrollPosition * 0.1}px)`;
        }
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
    
    @keyframes fadeInDown {
        from {
            opacity: 0;
            transform: translateY(-20px);
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
    
    .feature-card {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease, transform 0.6s ease, box-shadow 0.3s ease;
    }
    
    .feature-card-visible {
        opacity: 1;
        transform: translateY(0);
    }
    
    .analytics-card {
        opacity: 0;
        transform: scale(0.95);
        transition: opacity 0.8s ease, transform 0.8s ease;
    }
    
    .analytics-card-visible {
        opacity: 1;
        transform: scale(1);
    }
    
    .resource-card {
        opacity: 0;
        transform: translateY(15px);
        transition: opacity 0.6s ease, transform 0.6s ease, box-shadow 0.3s ease;
    }
    
    .resource-card-visible {
        opacity: 1;
        transform: translateY(0);
    }
    
    .account-section {
        opacity: 0;
        transform: translateY(15px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .account-section-visible {
        opacity: 1;
        transform: translateY(0);
    }
    
    .calculation-card {
        opacity: 0;
        transform: translateY(15px);
        transition: opacity 0.6s ease, transform 0.6s ease, box-shadow 0.3s ease;
    }
    
    .calculation-card-visible {
        opacity: 1;
        transform: translateY(0);
    }
    
    .form-group {
        opacity: 0;
        transform: translateY(10px);
        transition: opacity 0.5s ease, transform 0.5s ease;
    }
    
    .form-group-visible {
        opacity: 1;
        transform: translateY(0);
    }
    
    .form-group.focused label {
        color: var(--primary-color);
    }
    
    .form-group.focused input,
    .form-group.focused textarea,
    .form-group.focused select {
        border-color: var(--primary-color);
        box-shadow: 0 0 0 3px rgba(var(--primary-rgb), 0.1);
    }
`;

// Check if animation styles have already been added to avoid duplication
if (!document.querySelector('style[data-animation-styles="main"]')) {
    animationStyles.setAttribute('data-animation-styles', 'main');
    document.head.appendChild(animationStyles);
}

/**
 * Add hover effects to calculation cards
 */
function addCalculationCardHoverEffects() {
    const cards = document.querySelectorAll('.calculation-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = 'var(--shadow-lg)';
            this.style.borderColor = 'var(--primary-color)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
            this.style.borderColor = '';
        });
    });
}

/**
 * Add focus effects to form fields
 */
function addFormFieldFocusEffects() {
    const formFields = document.querySelectorAll('input, textarea, select');
    
    formFields.forEach(field => {
        field.addEventListener('focus', function() {
            const formGroup = this.closest('.form-group');
            if (formGroup) {
                formGroup.classList.add('focused');
            }
        });
        
        field.addEventListener('blur', function() {
            const formGroup = this.closest('.form-group');
            if (formGroup) {
                formGroup.classList.remove('focused');
            }
        });
    });
}

/**
 * Add active state to navigation buttons
 */
function addActiveStateToNavButtons() {
    const navButtons = document.querySelectorAll('.account-nav button, .calculator-nav button');
    
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons in the same navigation
            const navContainer = this.closest('.account-nav, .calculator-nav');
            if (navContainer) {
                navContainer.querySelectorAll('button').forEach(btn => {
                    btn.classList.remove('active');
                });
            }
            
            // Add active class to clicked button
            this.classList.add('active');
        });
    });
}