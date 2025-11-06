// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, observerOptions);

// Observe all feature cards and sections
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.feature-card, .about-content, .contact-form');
    animateElements.forEach(el => {
        el.classList.add('scroll-animate');
        observer.observe(el);
    });
});

// CTA Button interaction
const ctaButton = document.querySelector('.cta-button');
if (ctaButton) {
    ctaButton.addEventListener('click', () => {
        const featuresSection = document.querySelector('#features');
        if (featuresSection) {
            featuresSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
}

// Form submission handler
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form values
        const formData = new FormData(contactForm);
        const name = contactForm.querySelector('input[type="text"]').value;
        const email = contactForm.querySelector('input[type="email"]').value;
        const message = contactForm.querySelector('textarea').value;

        // Simple validation
        if (name && email && message) {
            // Create success message
            const successMsg = document.createElement('div');
            successMsg.textContent = 'Message sent successfully! We\'ll get back to you soon.';
            successMsg.style.cssText = `
                background: linear-gradient(135deg, #10b981, #059669);
                color: white;
                padding: 1rem;
                border-radius: 10px;
                margin-top: 1rem;
                text-align: center;
                animation: fadeInUp 0.5s ease-out;
            `;

            // Remove existing success messages
            const existingMsg = contactForm.querySelector('.success-message');
            if (existingMsg) existingMsg.remove();

            successMsg.classList.add('success-message');
            contactForm.appendChild(successMsg);

            // Reset form
            contactForm.reset();

            // Remove success message after 5 seconds
            setTimeout(() => {
                successMsg.style.animation = 'fadeOut 0.5s ease-out';
                setTimeout(() => successMsg.remove(), 500);
            }, 5000);
        }
    });
}

// Navbar background on scroll
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        navbar.style.background = 'rgba(15, 23, 42, 0.95)';
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
    } else {
        navbar.style.background = 'rgba(15, 23, 42, 0.8)';
        navbar.style.boxShadow = 'none';
    }

    lastScroll = currentScroll;
});

// Parallax effect for hero shapes
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const shapes = document.querySelectorAll('.shape');

    shapes.forEach((shape, index) => {
        const speed = (index + 1) * 0.2;
        shape.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// Add hover effect to feature cards
document.querySelectorAll('.feature-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.borderColor = 'rgba(99, 102, 241, 0.5)';
    });

    card.addEventListener('mouseleave', function() {
        this.style.borderColor = 'rgba(255, 255, 255, 0.1)';
    });
});

// Add ripple effect to buttons
function createRipple(event) {
    const button = event.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple 0.6s ease-out;
        left: ${x}px;
        top: ${y}px;
        pointer-events: none;
    `;

    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
}

// Add ripple animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }

    @keyframes fadeOut {
        from {
            opacity: 1;
            transform: translateY(0);
        }
        to {
            opacity: 0;
            transform: translateY(-10px);
        }
    }
`;
document.head.appendChild(style);

// Add ripple to all buttons
document.querySelectorAll('.cta-button, .submit-button').forEach(button => {
    button.addEventListener('click', createRipple);
});

console.log('🚀 Cool Website Loaded Successfully!');
