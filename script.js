const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let width = window.innerWidth;
let height = window.innerHeight;
let time = 0;

canvas.width = width * window.devicePixelRatio;
canvas.height = height * window.devicePixelRatio;
canvas.style.width = width + 'px';
canvas.style.height = height + 'px';
ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

// Large blob class
class Blob {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.baseX = x;
        this.baseY = y;
        this.radius = radius;
        this.baseRadius = radius;
        this.color = color;
        this.offsetX = Math.random() * Math.PI * 2;
        this.offsetY = Math.random() * Math.PI * 2;
        this.offsetRadius = Math.random() * Math.PI * 2;
    }

    update(time) {
        // Very slow, organic movement
        this.x = this.baseX + Math.sin(time * 0.0003 + this.offsetX) * 200;
        this.y = this.baseY + Math.cos(time * 0.0004 + this.offsetY) * 150;
        this.radius = this.baseRadius + Math.sin(time * 0.0002 + this.offsetRadius) * 50;
    }

    draw() {
        const gradient = ctx.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, this.radius
        );

        gradient.addColorStop(0, this.color.inner);
        gradient.addColorStop(0.5, this.color.mid);
        gradient.addColorStop(1, this.color.outer);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Create blobs with cinematic colors
const blobs = [
    new Blob(
        width * 0.3,
        height * 0.4,
        300,
        {
            inner: 'rgba(255, 120, 80, 0.6)',
            mid: 'rgba(255, 90, 120, 0.4)',
            outer: 'rgba(120, 60, 100, 0)'
        }
    ),
    new Blob(
        width * 0.7,
        height * 0.6,
        350,
        {
            inner: 'rgba(80, 160, 200, 0.5)',
            mid: 'rgba(100, 120, 180, 0.3)',
            outer: 'rgba(60, 80, 120, 0)'
        }
    ),
    new Blob(
        width * 0.5,
        height * 0.5,
        250,
        {
            inner: 'rgba(200, 140, 160, 0.4)',
            mid: 'rgba(160, 100, 140, 0.2)',
            outer: 'rgba(100, 60, 80, 0)'
        }
    )
];

function animate() {
    // Clear with slight fade for smooth blending
    ctx.fillStyle = 'rgba(13, 13, 13, 0.03)';
    ctx.fillRect(0, 0, width, height);

    // Enable compositing for smooth blending
    ctx.globalCompositeOperation = 'screen';

    blobs.forEach(blob => {
        blob.update(time);
        blob.draw();
    });

    ctx.globalCompositeOperation = 'source-over';

    time += 16; // Very slow time progression
    requestAnimationFrame(animate);
}

window.addEventListener('resize', () => {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // Reposition blobs
    blobs[0].baseX = width * 0.3;
    blobs[0].baseY = height * 0.4;
    blobs[1].baseX = width * 0.7;
    blobs[1].baseY = height * 0.6;
    blobs[2].baseX = width * 0.5;
    blobs[2].baseY = height * 0.5;
});

animate();
