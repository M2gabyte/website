// Random glitch text corruption
function corruptText(element, intensity = 0.3) {
    const originalText = element.textContent;
    const glitchChars = ['█', '▓', '▒', '░', '▀', '▄', '■', '□', '▪', '▫'];

    let corruptedText = '';
    for (let char of originalText) {
        if (Math.random() < intensity && char !== ' ') {
            corruptedText += glitchChars[Math.floor(Math.random() * glitchChars.length)];
        } else {
            corruptedText += char;
        }
    }

    element.textContent = corruptedText;

    // Restore original text after a moment
    setTimeout(() => {
        element.textContent = originalText;
    }, 100);
}

// Apply corruption to fragment cards based on their data attribute
function initFragmentCorruption() {
    const fragments = document.querySelectorAll('.fragment-card');

    fragments.forEach(fragment => {
        const corruption = parseFloat(fragment.getAttribute('data-corruption')) || 0.3;
        const content = fragment.querySelector('.fragment-desc');

        if (content) {
            setInterval(() => {
                if (Math.random() < corruption) {
                    corruptText(content, corruption);
                }
            }, 3000 + Math.random() * 2000);
        }
    });
}

// Access button reveal functionality
const accessBtn = document.getElementById('accessBtn');
const fragmentsSection = document.getElementById('fragments');
const archiveSection = document.getElementById('archive');
const inputSection = document.getElementById('input');

let currentSection = 0;
const sections = [fragmentsSection, archiveSection, inputSection];

if (accessBtn) {
    accessBtn.addEventListener('click', function() {
        if (currentSection < sections.length) {
            sections[currentSection].classList.remove('hidden');

            // Scroll to the newly revealed section
            setTimeout(() => {
                sections[currentSection].scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 100);

            currentSection++;

            // Change button text as we progress
            if (currentSection === 1) {
                this.querySelector('.btn-glitch').textContent = '[DECODE_LOGS]';
                this.querySelector('.btn-glitch').setAttribute('data-text', '[DECODE_LOGS]');
            } else if (currentSection === 2) {
                this.querySelector('.btn-glitch').textContent = '[ESTABLISH_LINK]';
                this.querySelector('.btn-glitch').setAttribute('data-text', '[ESTABLISH_LINK]');
            } else if (currentSection >= 3) {
                this.style.display = 'none';
            }
        }
    });
}

// Form submission with creepy response
const signalForm = document.getElementById('signalForm');
const transmissionStatus = document.getElementById('status');

if (signalForm) {
    signalForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Show the creepy status message
        transmissionStatus.classList.remove('hidden');

        // Glitch out the form
        const inputs = signalForm.querySelectorAll('.terminal-input');
        inputs.forEach(input => {
            input.disabled = true;
            input.style.opacity = '0.3';
        });

        // Hide submit button
        const submitBtn = signalForm.querySelector('.terminal-submit');
        if (submitBtn) {
            submitBtn.style.display = 'none';
        }

        // Start intense glitching
        startIntenseGlitch();
    });
}

// Random glitch effects on page elements
function randomGlitch() {
    const glitchElements = document.querySelectorAll('.glitch-text');

    glitchElements.forEach(el => {
        if (Math.random() < 0.1) {
            el.style.transform = `translate(${Math.random() * 4 - 2}px, ${Math.random() * 4 - 2}px)`;
            setTimeout(() => {
                el.style.transform = 'translate(0, 0)';
            }, 50);
        }
    });
}

setInterval(randomGlitch, 2000);

// Intense glitch effect after form submission
function startIntenseGlitch() {
    let glitchCount = 0;
    const maxGlitches = 20;

    const glitchInterval = setInterval(() => {
        document.body.style.transform = `translate(${Math.random() * 10 - 5}px, ${Math.random() * 10 - 5}px)`;

        // Random color inversion
        if (Math.random() < 0.3) {
            document.body.style.filter = 'invert(1)';
        } else {
            document.body.style.filter = 'invert(0)';
        }

        glitchCount++;

        if (glitchCount >= maxGlitches) {
            clearInterval(glitchInterval);
            document.body.style.transform = 'translate(0, 0)';
            document.body.style.filter = 'invert(0)';
        }
    }, 100);
}

// Countdown timer with random numbers
const countdownEl = document.getElementById('countdown');
if (countdownEl) {
    function updateCountdown() {
        const randomTime = Math.floor(Math.random() * 999);
        const randomUnit = ['SECONDS', 'CYCLES', 'MOMENTS', 'ERROR'][Math.floor(Math.random() * 4)];
        countdownEl.textContent = `${randomTime} ${randomUnit}`;
    }

    updateCountdown();
    setInterval(updateCountdown, 2000);
}

// Random connection status updates
const connectionStatus = document.querySelector('.connection-status');
if (connectionStatus) {
    const statuses = [
        'DECRYPTING...',
        'SIGNAL UNSTABLE',
        'BREACH DETECTED',
        'TRACING SOURCE',
        'ERROR_0x4F3A',
        'THEY KNOW',
        'TEMPORAL ANOMALY'
    ];

    setInterval(() => {
        connectionStatus.textContent = statuses[Math.floor(Math.random() * statuses.length)];
    }, 4000);
}

// Randomly corrupt the static text
const staticText = document.querySelector('.static-text');
if (staticText) {
    setInterval(() => {
        let text = '';
        const length = 32;
        for (let i = 0; i < length; i++) {
            text += ['█', '▓', '▒', '░'][Math.floor(Math.random() * 4)];
        }
        staticText.textContent = text;
    }, 200);
}

// Binary data stream animation
const dataStreams = document.querySelectorAll('.data-stream');
dataStreams.forEach(stream => {
    const originalData = stream.textContent;

    setInterval(() => {
        if (Math.random() < 0.3) {
            // Randomly flip some bits
            let binary = stream.textContent.split('');
            const flipCount = Math.floor(Math.random() * 3) + 1;

            for (let i = 0; i < flipCount; i++) {
                const pos = Math.floor(Math.random() * binary.length);
                if (binary[pos] === '0') binary[pos] = '1';
                else if (binary[pos] === '1') binary[pos] = '0';
            }

            stream.textContent = binary.join('');

            setTimeout(() => {
                stream.textContent = originalData;
            }, 500);
        }
    }, 2000);
});

// Initialize corruption effects
setTimeout(() => {
    initFragmentCorruption();
}, 1000);

// Random screen shake
function screenShake() {
    if (Math.random() < 0.05) {
        document.body.style.animation = 'shake 0.5s';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 500);
    }
}

// Add shake animation
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translate(0, 0); }
        10% { transform: translate(-2px, -2px); }
        20% { transform: translate(2px, 2px); }
        30% { transform: translate(-2px, 2px); }
        40% { transform: translate(2px, -2px); }
        50% { transform: translate(-2px, -2px); }
        60% { transform: translate(2px, 2px); }
        70% { transform: translate(-2px, 2px); }
        80% { transform: translate(2px, -2px); }
        90% { transform: translate(-2px, -2px); }
    }
`;
document.head.appendChild(style);

setInterval(screenShake, 10000);

// Mouse trail effect
document.addEventListener('mousemove', (e) => {
    if (Math.random() < 0.1) {
        const trail = document.createElement('div');
        trail.style.cssText = `
            position: fixed;
            left: ${e.clientX}px;
            top: ${e.clientY}px;
            width: 4px;
            height: 4px;
            background: #00ff41;
            pointer-events: none;
            z-index: 9999;
            opacity: 0.6;
            box-shadow: 0 0 10px #00ff41;
        `;

        document.body.appendChild(trail);

        setTimeout(() => {
            trail.style.transition = 'opacity 0.5s';
            trail.style.opacity = '0';
            setTimeout(() => trail.remove(), 500);
        }, 100);
    }
});

// Log typing effect
const logWindow = document.querySelector('.log-window');
if (logWindow) {
    const lines = Array.from(logWindow.querySelectorAll('p'));
    lines.forEach((line, index) => {
        line.style.opacity = '0';
        setTimeout(() => {
            line.style.transition = 'opacity 0.5s';
            line.style.opacity = '1';
        }, index * 800);
    });
}

// Easter egg: Konami code
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);

    if (konamiCode.join(',') === konamiSequence.join(',')) {
        // Secret unlocked
        document.body.style.filter = 'hue-rotate(180deg) saturate(2)';
        alert('ADMIN ACCESS GRANTED\n\nJust kidding. But you found the secret :)');
        setTimeout(() => {
            document.body.style.filter = '';
        }, 5000);
    }
});

console.log('%c> SIGNAL ACQUIRED', 'color: #00ff41; font-size: 20px; font-family: monospace;');
console.log('%c> You shouldn\'t be reading this', 'color: #ff0040; font-size: 14px; font-family: monospace;');
console.log('%c> Or should you?', 'color: #008f11; font-size: 12px; font-family: monospace;');
