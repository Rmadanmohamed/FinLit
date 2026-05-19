/**
 * Enhanced Animations for FinLit Website
 * Implements animated banking-themed background and advanced visual effects
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the animated background
    initAnimatedBackground();
    
    // Add floating financial icons
    addFloatingIcons();
    
    // Add section transition effects
    addSectionTransitions();
});

/**
 * Initialize the animated banking-themed background
 */
function initAnimatedBackground() {
    // Create canvas element for the background
    const canvas = document.createElement('canvas');
    canvas.id = 'animated-background';
    canvas.classList.add('animated-background');
    
    // Insert canvas as the first child of the body
    document.body.insertBefore(canvas, document.body.firstChild);
    
    // Add styles for the canvas
    const style = document.createElement('style');
    style.textContent = `
        .animated-background {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            opacity: 0.8;
        }
        
        @keyframes gradientFlow {
            0% {
                background-position: 0% 50%;
            }
            50% {
                background-position: 100% 50%;
            }
            100% {
                background-position: 0% 50%;
            }
        }
        
        body {
            background: linear-gradient(-45deg, #6a11cb, #2575fc, #4e54c8, #8f94fb, #4776E6, #8E54E9);
            background-size: 400% 400%;
            animation: gradientFlow 15s ease infinite;
            position: relative;
        }
        
        body::before {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect fill="none" width="100" height="100"/><path fill="rgba(255,255,255,0.05)" d="M30,20 L70,20 L70,80 L30,80 Z"/><path fill="rgba(255,255,255,0.05)" d="M40,30 L60,30 L60,70 L40,70 Z"/></svg>');
            opacity: 0.3;
            z-index: -1;
        }
        
        .section-divider {
            height: 150px;
            overflow: hidden;
            position: relative;
            margin-top: -75px;
            z-index: 1;
        }
        
        .section-divider svg {
            position: absolute;
            width: 100%;
            height: 150px;
        }
        
        .wave-animation {
            animation: wave 20s linear infinite;
        }
        
        @keyframes wave {
            0% {
                transform: translateX(0);
            }
            50% {
                transform: translateX(-50%);
            }
            100% {
                transform: translateX(0);
            }
        }
        
        .floating-icon {
            position: absolute;
            opacity: 0.15;
            z-index: -1;
            filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.5));
            pointer-events: none;
        }
        
        @keyframes float {
            0% {
                transform: translateY(0) rotate(0deg);
            }
            50% {
                transform: translateY(-20px) rotate(5deg);
            }
            100% {
                transform: translateY(0) rotate(0deg);
            }
        }
        
        @keyframes float-reverse {
            0% {
                transform: translateY(0) rotate(0deg);
            }
            50% {
                transform: translateY(20px) rotate(-5deg);
            }
            100% {
                transform: translateY(0) rotate(0deg);
            }
        }
        
        .section-transition {
            position: relative;
            overflow: hidden;
        }
        
        .section-transition::before {
            content: '';
            position: absolute;
            top: -50px;
            left: 0;
            width: 100%;
            height: 50px;
            background: linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.1));
            z-index: 1;
        }
        
        .hero {
            position: relative;
            overflow: hidden;
        }
        
        .hero::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 100px;
            background: linear-gradient(to top, rgba(0,0,0,0.2), transparent);
            z-index: 1;
        }
    `;
    document.head.appendChild(style);
    
    // Initialize canvas
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    // Call resize initially and on window resize
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Banking-themed particles
    const particles = [];
    const icons = ['$', '€', '£', '¥', '₹', '₽', '฿', '₺', '₴', '₦', '₩', '₫', '₭', '₮', '₱', '₲', '₳', '₴', '₵', '₸'];
    const shapes = ['circle', 'square', 'triangle', 'diamond', 'card'];
    
    // Create particles
    function createParticles() {
        const particleCount = Math.floor(window.innerWidth / 20); // Responsive particle count
        
        for (let i = 0; i < particleCount; i++) {
            const type = Math.random() > 0.7 ? 'icon' : 'shape';
            const size = Math.random() * 20 + 5;
            
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: size,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                opacity: Math.random() * 0.2 + 0.1,
                type: type,
                content: type === 'icon' ? icons[Math.floor(Math.random() * icons.length)] : shapes[Math.floor(Math.random() * shapes.length)],
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 0.5
            });
        }
    }
    
    // Draw particles
    function drawParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            ctx.save();
            ctx.globalAlpha = particle.opacity;
            ctx.translate(particle.x, particle.y);
            ctx.rotate(particle.rotation * Math.PI / 180);
            
            if (particle.type === 'icon') {
                ctx.font = `${particle.size}px Arial`;
                ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(particle.content, 0, 0);
            } else {
                ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
                
                switch (particle.content) {
                    case 'circle':
                        ctx.beginPath();
                        ctx.arc(0, 0, particle.size / 2, 0, Math.PI * 2);
                        ctx.fill();
                        break;
                    case 'square':
                        ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size);
                        break;
                    case 'triangle':
                        ctx.beginPath();
                        ctx.moveTo(0, -particle.size / 2);
                        ctx.lineTo(particle.size / 2, particle.size / 2);
                        ctx.lineTo(-particle.size / 2, particle.size / 2);
                        ctx.closePath();
                        ctx.fill();
                        break;
                    case 'diamond':
                        ctx.beginPath();
                        ctx.moveTo(0, -particle.size / 2);
                        ctx.lineTo(particle.size / 2, 0);
                        ctx.lineTo(0, particle.size / 2);
                        ctx.lineTo(-particle.size / 2, 0);
                        ctx.closePath();
                        ctx.fill();
                        break;
                    case 'card':
                        // Draw credit card shape
                        ctx.fillRect(-particle.size / 2, -particle.size / 3, particle.size, particle.size * 0.6);
                        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
                        ctx.fillRect(-particle.size / 2, -particle.size / 3 + particle.size * 0.15, particle.size, particle.size * 0.1);
                        break;
                }
            }
            
            ctx.restore();
        });
    }
    
    // Update particles
    function updateParticles() {
        particles.forEach(particle => {
            // Update position
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            // Update rotation
            particle.rotation += particle.rotationSpeed;
            
            // Wrap around edges
            if (particle.x < -particle.size) particle.x = canvas.width + particle.size;
            if (particle.x > canvas.width + particle.size) particle.x = -particle.size;
            if (particle.y < -particle.size) particle.y = canvas.height + particle.size;
            if (particle.y > canvas.height + particle.size) particle.y = -particle.size;
        });
    }
    
    // Animation loop
    function animate() {
        updateParticles();
        drawParticles();
        requestAnimationFrame(animate);
    }
    
    // Initialize particles and start animation
    createParticles();
    animate();
    
    // Add mouse interaction
    canvas.addEventListener('mousemove', function(e) {
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        
        particles.forEach(particle => {
            // Calculate distance from mouse
            const dx = mouseX - particle.x;
            const dy = mouseY - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Apply force if within range
            if (distance < 100) {
                const force = (100 - distance) / 500;
                particle.speedX -= dx * force;
                particle.speedY -= dy * force;
            }
        });
    });
}

/**
 * Add floating financial icons to the page
 */
function addFloatingIcons() {
    const iconSvgs = [
        '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>',
        '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>',
        '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"></polyline><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path></svg>',
        '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>',
        '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>'
    ];
    
    const container = document.querySelector('body');
    
    // Add 10 floating icons
    for (let i = 0; i < 10; i++) {
        const icon = document.createElement('div');
        icon.classList.add('floating-icon');
        icon.innerHTML = iconSvgs[Math.floor(Math.random() * iconSvgs.length)];
        
        // Random position
        icon.style.left = `${Math.random() * 100}vw`;
        icon.style.top = `${Math.random() * 100}vh`;
        
        // Random size
        const size = Math.random() * 30 + 20;
        icon.style.width = `${size}px`;
        icon.style.height = `${size}px`;
        
        // Random animation
        const animationName = Math.random() > 0.5 ? 'float' : 'float-reverse';
        const animationDuration = Math.random() * 10 + 10;
        const animationDelay = Math.random() * 5;
        
        icon.style.animation = `${animationName} ${animationDuration}s ease-in-out ${animationDelay}s infinite`;
        
        // Random color
        icon.style.color = `rgba(255, 255, 255, ${Math.random() * 0.2 + 0.1})`;
        
        container.appendChild(icon);
    }
}

/**
 * Add section transition effects
 */
function addSectionTransitions() {
    const sections = document.querySelectorAll('section');
    
    sections.forEach((section, index) => {
        if (index > 0) {
            section.classList.add('section-transition');
            
            // Add wave divider before each section except the first one
            const divider = document.createElement('div');
            divider.classList.add('section-divider');
            
            // Create SVG wave
            divider.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none" class="wave-animation">
                    <path fill="rgba(255, 255, 255, 0.1)" fill-opacity="1" d="M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,224C672,213,768,171,864,149.3C960,128,1056,128,1152,149.3C1248,171,1344,213,1392,234.7L1440,256L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none" style="animation: wave 15s linear reverse infinite;">
                    <path fill="rgba(255, 255, 255, 0.05)" fill-opacity="1" d="M0,64L48,80C96,96,192,128,288,128C384,128,480,96,576,90.7C672,85,768,107,864,144C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                </svg>
            `;
            
            // Insert divider before the section
            section.parentNode.insertBefore(divider, section);
        }
    });
}

/**
 * Add scroll-triggered animations
 */
function addScrollTriggeredAnimations() {
    const elements = document.querySelectorAll('.feature-card, .hero-content, .hero-image, .section-title, .assessment-container, .tools, .resources, .analytics');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    elements.forEach(element => {
        observer.observe(element);
    });
}

// Add additional animation styles
const enhancedAnimationStyles = document.createElement('style');
enhancedAnimationStyles.textContent = `
    @keyframes shimmer {
        0% {
            background-position: -100% 0;
        }
        100% {
            background-position: 200% 0;
        }
    }
    
    .btn {
        position: relative;
        overflow: hidden;
    }
    
    .btn::after {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
        transition: left 0.5s;
    }
    
    .btn:hover::after {
        left: 100%;
    }
    
    .hero-title, .section-title {
        background: linear-gradient(90deg, #ffffff, #f0f0f0, #ffffff);
        background-size: 200% auto;
        background-clip: text;
        -webkit-background-clip: text;
        color: transparent;
        animation: shimmer 3s linear infinite;
    }
    
    .animate-in {
        animation: fadeIn 0.8s ease forwards;
    }
    
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
    
    @keyframes glow {
        0% {
            text-shadow: 0 0 5px rgba(255,255,255,0.5);
        }
        50% {
            text-shadow: 0 0 20px rgba(255,255,255,0.8);
        }
        100% {
            text-shadow: 0 0 5px rgba(255,255,255,0.5);
        }
    }
`;

// Add enhanced animation styles to document
document.head.appendChild(enhancedAnimationStyles);

// Initialize scroll-triggered animations
document.addEventListener('DOMContentLoaded', function() {
    addScrollTriggeredAnimations();
});
