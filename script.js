const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let width = window.innerWidth;
let height = window.innerHeight;
let particles = [];
let particleCount = 800;
let mouse = { x: null, y: null, radius: 150 };
let time = 0;

// Set canvas size
canvas.width = width;
canvas.height = height;

// Particle class
class Particle {
    constructor() {
        this.reset();
        this.y = Math.random() * height;
    }

    reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2 + 0.5;
        this.baseX = this.x;
        this.baseY = this.y;
        this.density = Math.random() * 40 + 5;
        this.distance = 0;

        // Flow properties
        this.angle = Math.random() * Math.PI * 2;
        this.speed = Math.random() * 0.5 + 0.1;
        this.velocityX = 0;
        this.velocityY = 0;

        // Color variation
        this.hue = Math.random() * 60 + 180; // Blue to cyan range
        this.alpha = Math.random() * 0.5 + 0.3;
    }

    update() {
        // Calculate flow field based on position and time
        const flowX = Math.sin(this.x * 0.005 + time * 0.5) * Math.cos(this.y * 0.005);
        const flowY = Math.cos(this.x * 0.005) * Math.sin(this.y * 0.005 + time * 0.5);

        // Apply flow field
        this.velocityX += flowX * 0.05;
        this.velocityY += flowY * 0.05;

        // Mouse interaction
        if (mouse.x !== null && mouse.y !== null) {
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            const maxDistance = mouse.radius;
            const force = (maxDistance - distance) / maxDistance;

            if (distance < mouse.radius) {
                this.velocityX -= forceDirectionX * force * 3;
                this.velocityY -= forceDirectionY * force * 3;
            }
        }

        // Apply velocity with damping
        this.velocityX *= 0.95;
        this.velocityY *= 0.95;

        this.x += this.velocityX;
        this.y += this.velocityY;

        // Wrap around edges
        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;
    }

    draw() {
        ctx.fillStyle = `hsla(${this.hue}, 70%, 60%, ${this.alpha})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Initialize particles
function init() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}

// Connect nearby particles
function connect() {
    for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
            const dx = particles[a].x - particles[b].x;
            const dy = particles[a].y - particles[b].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 120) {
                const opacity = (1 - distance / 120) * 0.3;
                ctx.strokeStyle = `hsla(${particles[a].hue}, 70%, 60%, ${opacity})`;
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(particles[a].x, particles[a].y);
                ctx.lineTo(particles[b].x, particles[b].y);
                ctx.stroke();
            }
        }
    }
}

// Draw wave patterns in background
function drawWaves() {
    ctx.strokeStyle = 'rgba(100, 150, 255, 0.05)';
    ctx.lineWidth = 1;

    for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        for (let x = 0; x < width; x += 5) {
            const y = height / 2 +
                     Math.sin(x * 0.01 + time + i * 0.5) * 50 * (i + 1) +
                     Math.cos(x * 0.005 + time * 0.5) * 30;

            if (x === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.stroke();
    }
}

// Animation loop
function animate() {
    // Fade effect instead of clear
    ctx.fillStyle = 'rgba(10, 10, 10, 0.1)';
    ctx.fillRect(0, 0, width, height);

    // Draw background waves
    drawWaves();

    // Update and draw particles
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });

    // Connect particles
    connect();

    // Update time
    time += 0.01;

    requestAnimationFrame(animate);
}

// Mouse move event
canvas.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
});

canvas.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
});

// Touch events for mobile
canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    mouse.x = e.touches[0].clientX;
    mouse.y = e.touches[0].clientY;
});

canvas.addEventListener('touchend', () => {
    mouse.x = null;
    mouse.y = null;
});

// Handle resize
window.addEventListener('resize', () => {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    init();
});

// Start
init();
animate();
