// Date that's slightly wrong
function setDate() {
    const dateEl = document.getElementById('date');
    const now = new Date();

    // Show a date that's close but wrong
    const wrongDate = new Date(now.getTime() - (Math.random() * 86400000 * 3));
    const formatted = wrongDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    dateEl.textContent = formatted;
}

// Visitor count that changes inconsistently
function updateVisitorCount() {
    const countEl = document.getElementById('visitor-count');
    let count = Math.floor(Math.random() * 900) + 100;

    countEl.textContent = count;

    // Randomly update it
    setInterval(() => {
        const change = Math.random() < 0.5 ? -1 : 1;
        count += change * Math.floor(Math.random() * 3);
        if (count < 50) count = 50;
        countEl.textContent = count;
    }, 8000 + Math.random() * 12000);
}

// Time elapsed that doesn't match reality
function updateTimeElapsed() {
    const timeEl = document.getElementById('time-elapsed');
    let seconds = 0;
    let minutes = 0;

    setInterval(() => {
        // Sometimes time skips or goes backward
        const rand = Math.random();
        if (rand < 0.85) {
            seconds++;
        } else if (rand < 0.95) {
            seconds += 2; // Skip forward
        } else {
            seconds = Math.max(0, seconds - 1); // Go backward
        }

        if (seconds >= 60) {
            minutes++;
            seconds = 0;
        }

        const secStr = String(seconds).padStart(2, '0');
        const minStr = String(minutes).padStart(2, '0');
        timeEl.textContent = `${minStr}:${secStr}`;
    }, 1000);
}

// Form submission
const form = document.getElementById('feedbackForm');
const confirmation = document.getElementById('confirmation');

if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Show the contradictory confirmation
        confirmation.classList.remove('hidden');

        // Slowly fade out the form
        setTimeout(() => {
            form.style.transition = 'opacity 2s ease';
            form.style.opacity = '0.3';
        }, 1000);

        // Subtle text changes
        setTimeout(() => {
            const inputs = form.querySelectorAll('input, textarea');
            inputs.forEach(input => {
                input.disabled = true;
                input.style.borderColor = 'var(--wrong)';
            });
        }, 2000);
    });
}

// Subtle card position shifts on scroll
let lastScrollY = window.scrollY;
const cards = document.querySelectorAll('.card');

window.addEventListener('scroll', () => {
    const scrollDiff = window.scrollY - lastScrollY;

    cards.forEach((card, index) => {
        const shift = scrollDiff * 0.02 * (index % 2 === 0 ? 1 : -1);
        const currentTransform = card.style.transform || 'translateX(0px)';
        const currentX = parseFloat(currentTransform.match(/-?\d+\.?\d*/)?.[0] || 0);
        const newX = Math.max(-3, Math.min(3, currentX + shift * 0.1));

        card.style.transform = `translateX(${newX}px)`;
    });

    lastScrollY = window.scrollY;
});

// Occasionally swap two random words in FAQs
const faqAnswers = document.querySelectorAll('.answer');

function subtleTextCorruption() {
    if (Math.random() < 0.2) {
        const randomAnswer = faqAnswers[Math.floor(Math.random() * faqAnswers.length)];
        const text = randomAnswer.textContent;
        const words = text.split(' ');

        if (words.length > 5) {
            const i1 = Math.floor(Math.random() * words.length);
            let i2 = Math.floor(Math.random() * words.length);
            while (i2 === i1) {
                i2 = Math.floor(Math.random() * words.length);
            }

            [words[i1], words[i2]] = [words[i2], words[i1]];
            randomAnswer.textContent = words.join(' ');

            // Restore after a moment
            setTimeout(() => {
                randomAnswer.textContent = text;
            }, 3000);
        }
    }
}

setInterval(subtleTextCorruption, 15000);

// Very subtle breathing effect on notice
const notice = document.querySelector('.notice');
if (notice) {
    let scale = 1;
    let growing = true;

    setInterval(() => {
        if (growing) {
            scale += 0.0003;
            if (scale >= 1.006) growing = false;
        } else {
            scale -= 0.0003;
            if (scale <= 0.994) growing = true;
        }
        notice.style.transform = `scale(${scale})`;
    }, 50);
}

// Track how long user has been on certain elements
const trackElements = document.querySelectorAll('.card, .faq-item');
const viewTimes = new Map();

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            if (!viewTimes.has(entry.target)) {
                viewTimes.set(entry.target, Date.now());
            }

            // After viewing for too long, subtle change
            setTimeout(() => {
                if (document.body.contains(entry.target)) {
                    entry.target.style.filter = 'brightness(0.98)';
                }
            }, 8000);
        }
    });
}, { threshold: 0.5 });

trackElements.forEach(el => observer.observe(el));

// Mouse movement creates very subtle trails
let mouseTrailTimeout;
document.addEventListener('mousemove', (e) => {
    if (Math.random() < 0.05) {
        const trail = document.createElement('div');
        trail.style.cssText = `
            position: fixed;
            left: ${e.clientX}px;
            top: ${e.clientY}px;
            width: 2px;
            height: 2px;
            background: var(--wrong);
            pointer-events: none;
            border-radius: 50%;
            opacity: 0.15;
            transition: opacity 2s;
        `;

        document.body.appendChild(trail);

        setTimeout(() => {
            trail.style.opacity = '0';
            setTimeout(() => trail.remove(), 2000);
        }, 100);
    }
});

// Occasionally change a single letter in the heading
const heading = document.querySelector('h1');
if (heading) {
    const originalText = heading.textContent;

    setInterval(() => {
        if (Math.random() < 0.15) {
            const text = heading.textContent;
            const pos = Math.floor(Math.random() * text.length);
            const char = text[pos];

            if (char !== ' ') {
                const similar = {
                    'a': 'á', 'e': 'é', 'i': 'í', 'o': 'ó', 'u': 'ú',
                    'n': 'ñ', 'c': 'ç', 'y': 'ý', 's': 'š'
                };

                const newChar = similar[char.toLowerCase()] || char;
                const newText = text.substring(0, pos) + newChar + text.substring(pos + 1);
                heading.textContent = newText;

                setTimeout(() => {
                    heading.textContent = originalText;
                }, 2000);
            }
        }
    }, 10000);
}

// Page title changes subtly
const originalTitle = document.title;
setInterval(() => {
    if (Math.random() < 0.3) {
        const titles = [
            'Orientation Materials',
            'Orientation Material',
            'Orientation',
            'Please Wait',
            'Thank You',
            originalTitle
        ];
        document.title = titles[Math.floor(Math.random() * titles.length)];

        setTimeout(() => {
            document.title = originalTitle;
        }, 5000);
    }
}, 20000);

// Initialize everything
setDate();
updateVisitorCount();
updateTimeElapsed();

// Console message
console.log('Welcome.');
console.log('You have been here before.');

// After some time, add subtle message
setTimeout(() => {
    console.log('This is normal.');
}, 30000);
