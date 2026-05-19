/**
 * Digital Financial Literacy & Inclusion Platform
 * Enhanced Navigation and Button Functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize smooth scrolling for all navigation links
    initSmoothScrolling();
    
    // Fix specific button navigation
    fixOpenBankAccountButton();
    fixAccountButton();
    
    // Add accessibility enhancements for navigation
    enhanceNavigationAccessibility();
    
    // Add mobile navigation improvements
    enhanceMobileNavigation();
});

/**
 * Initialize smooth scrolling for all navigation links
 */
function initSmoothScrolling() {
    // Get all links that have hash references
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            // Only prevent default for non-empty hash links
            if (this.getAttribute('href') !== '#') {
                e.preventDefault();
                
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    // Add focus outline to target section for accessibility
                    targetElement.setAttribute('tabindex', '-1');
                    
                    // Scroll to the target element with smooth behavior
                    window.scrollTo({
                        top: targetElement.offsetTop - 80, // Offset for fixed header
                        behavior: 'smooth'
                    });
                    
                    // Set focus to the target element after scrolling
                    setTimeout(() => {
                        targetElement.focus();
                        
                        // Update URL hash without scrolling
                        history.pushState(null, null, `#${targetId}`);
                        
                        // Announce to screen readers
                        announceToScreenReader(`Navigated to ${targetId} section`);
                    }, 1000);
                }
            }
        });
    });
}

/**
 * Fix the Open Bank Account button to navigate to the correct section
 */
function fixOpenBankAccountButton() {
    // Find all Open Bank Account buttons
    const openBankButtons = document.querySelectorAll('a.btn-outline:contains("Open Bank Account"), a.btn:contains("Open Bank Account")');
    
    if (!openBankButtons.length) {
        // Use a more generic selector if the specific one doesn't work
        const allButtons = document.querySelectorAll('a.btn-outline, a.btn');
        allButtons.forEach(button => {
            if (button.textContent.includes('Open Bank Account')) {
                setupBankAccountButton(button);
            }
        });
    } else {
        openBankButtons.forEach(button => {
            setupBankAccountButton(button);
        });
    }
    
    // Also target the specific button in the hero section
    const heroOpenBankButton = document.querySelector('.hero-buttons a.btn-outline');
    if (heroOpenBankButton) {
        setupBankAccountButton(heroOpenBankButton);
    }
}

/**
 * Setup individual bank account button
 */
function setupBankAccountButton(button) {
    // Remove any existing event listeners
    const newButton = button.cloneNode(true);
    button.parentNode.replaceChild(newButton, button);
    
    // Set the correct href
    newButton.setAttribute('href', '#account');
    
    // Add click event listener
    newButton.addEventListener('click', function(e) {
        e.preventDefault();
        
        const accountSection = document.getElementById('account');
        if (accountSection) {
            // Scroll to the account section
            window.scrollTo({
                top: accountSection.offsetTop - 80,
                behavior: 'smooth'
            });
            
            // Focus on the account section
            setTimeout(() => {
                accountSection.setAttribute('tabindex', '-1');
                accountSection.focus();
                
                // Update URL hash
                history.pushState(null, null, '#account');
                
                // Announce to screen readers
                announceToScreenReader('Navigated to account section');
            }, 1000);
        }
    });
    
    // Add ARIA attributes for accessibility
    newButton.setAttribute('role', 'button');
    newButton.setAttribute('aria-label', 'Navigate to open bank account section');
}

/**
 * Fix the Account button in the top navigation to jump to the LOGIN/REGISTER part
 */
function fixAccountButton() {
    // Find the Account link in the main navigation
    const accountNavLink = document.querySelector('.main-nav a[href="#account"]');
    
    if (accountNavLink) {
        // Remove any existing event listeners
        const newAccountLink = accountNavLink.cloneNode(true);
        accountNavLink.parentNode.replaceChild(newAccountLink, accountNavLink);
        
        // Add click event listener
        newAccountLink.addEventListener('click', function(e) {
            e.preventDefault();
            
            const accountSection = document.getElementById('account');
            if (accountSection) {
                // Scroll to the account section
                window.scrollTo({
                    top: accountSection.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Focus on the login/register part
                setTimeout(() => {
                    // Try to find login/register elements
                    const loginSection = document.querySelector('#login-section, .login-section, .login-register-container');
                    
                    if (loginSection) {
                        loginSection.setAttribute('tabindex', '-1');
                        loginSection.focus();
                    } else {
                        accountSection.setAttribute('tabindex', '-1');
                        accountSection.focus();
                    }
                    
                    // Update URL hash
                    history.pushState(null, null, '#account');
                    
                    // Announce to screen readers
                    announceToScreenReader('Navigated to account login and registration section');
                }, 1000);
            }
        });
        
        // Add ARIA attributes for accessibility
        newAccountLink.setAttribute('aria-label', 'Navigate to account login and registration section');
    }
}

/**
 * Enhance navigation accessibility
 */
function enhanceNavigationAccessibility() {
    // Add skip to content link for keyboard users
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-to-content';
    skipLink.textContent = 'Skip to main content';
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add main content ID to the first section
    const firstSection = document.querySelector('section');
    if (firstSection && !document.getElementById('main-content')) {
        firstSection.id = 'main-content';
    }
    
    // Add ARIA roles to navigation elements
    const mainNav = document.querySelector('.main-nav');
    if (mainNav) {
        mainNav.setAttribute('role', 'navigation');
        mainNav.setAttribute('aria-label', 'Main navigation');
    }
    
    // Add keyboard navigation for tab items
    const tabItems = document.querySelectorAll('.tab-item');
    tabItems.forEach(tab => {
        tab.setAttribute('tabindex', '0');
        tab.setAttribute('role', 'tab');
        
        tab.addEventListener('keydown', function(e) {
            // Enter or Space key
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
}

/**
 * Enhance mobile navigation
 */
function enhanceMobileNavigation() {
    // Add mobile menu toggle functionality
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    
    if (mobileMenuToggle && mainNav) {
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        mobileMenuToggle.setAttribute('aria-controls', 'main-nav');
        
        mobileMenuToggle.addEventListener('click', function() {
            const expanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !expanded);
            
            if (expanded) {
                mainNav.classList.remove('mobile-active');
                document.body.classList.remove('menu-open');
            } else {
                mainNav.classList.add('mobile-active');
                document.body.classList.add('menu-open');
                
                // Focus on the first nav link
                setTimeout(() => {
                    const firstNavLink = mainNav.querySelector('a');
                    if (firstNavLink) {
                        firstNavLink.focus();
                    }
                }, 100);
            }
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (mainNav.classList.contains('mobile-active') && 
                !mainNav.contains(e.target) && 
                e.target !== mobileMenuToggle) {
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
                mainNav.classList.remove('mobile-active');
                document.body.classList.remove('menu-open');
            }
        });
        
        // Add swipe gestures for mobile
        let touchStartX = 0;
        let touchEndX = 0;
        
        document.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        }, false);
        
        document.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, false);
        
        function handleSwipe() {
            const swipeThreshold = 100;
            
            if (touchEndX - touchStartX > swipeThreshold && !mainNav.classList.contains('mobile-active')) {
                // Swipe right, open menu
                mobileMenuToggle.setAttribute('aria-expanded', 'true');
                mainNav.classList.add('mobile-active');
                document.body.classList.add('menu-open');
            } else if (touchStartX - touchEndX > swipeThreshold && mainNav.classList.contains('mobile-active')) {
                // Swipe left, close menu
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
                mainNav.classList.remove('mobile-active');
                document.body.classList.remove('menu-open');
            }
        }
    }
}

/**
 * Announce message to screen readers
 */
function announceToScreenReader(message) {
    // Create or get the live region
    let liveRegion = document.getElementById('sr-live-region');
    
    if (!liveRegion) {
        liveRegion = document.createElement('div');
        liveRegion.id = 'sr-live-region';
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
    }, 3000);
}

// Add CSS for mobile navigation
const mobileNavStyles = document.createElement('style');
mobileNavStyles.textContent = `
    @media (max-width: 768px) {
        .main-nav {
            position: fixed;
            top: 0;
            right: -280px;
            width: 280px;
            height: 100vh;
            background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
            z-index: 1000;
            transition: right 0.3s ease;
            padding: 80px 20px 20px;
            box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
            overflow-y: auto;
        }
        
        .main-nav.mobile-active {
            right: 0;
        }
        
        .main-nav ul {
            flex-direction: column;
            gap: 15px;
        }
        
        .main-nav a {
            color: white;
            display: block;
            padding: 10px 15px;
            border-radius: 8px;
        }
        
        .main-nav a:hover,
        .main-nav a:focus,
        .main-nav a.active {
            background: rgba(255, 255, 255, 0.2);
        }
        
        .mobile-menu-toggle {
            display: block;
            z-index: 1001;
            position: relative;
        }
        
        .menu-open {
            overflow: hidden;
        }
        
        .menu-open::before {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 999;
        }
        
        .indicator {
            display: none;
        }
    }
    
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
    
    .skip-to-content {
        position: absolute;
        top: -40px;
        left: 0;
        background: var(--primary-color);
        color: white;
        padding: 8px;
        z-index: 100;
        transition: top 0.3s;
    }
    
    .skip-to-content:focus {
        top: 0;
    }
`;

document.head.appendChild(mobileNavStyles);
