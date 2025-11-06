const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d', { willReadFrequently: true });

let width = window.innerWidth;
let height = window.innerHeight;
let time = 0;

// High DPI support
const dpr = Math.min(window.devicePixelRatio, 2); // Cap at 2 for performance
canvas.width = width * dpr;
canvas.height = height * dpr;
canvas.style.width = width + 'px';
canvas.style.height = height + 'px';
ctx.scale(dpr, dpr);

// Create off-screen canvas for effects
const offCanvas = document.createElement('canvas');
const offCtx = offCanvas.getContext('2d');
offCanvas.width = canvas.width;
offCanvas.height = canvas.height;
offCtx.scale(dpr, dpr);

// Metaball blob class
class Blob {
    constructor(x, y, radius, hue) {
        this.x = x;
        this.y = y;
        this.baseX = x;
        this.baseY = y;
        this.radius = radius;
        this.baseRadius = radius;
        this.hue = hue;
        this.offsetX = Math.random() * Math.PI * 2;
        this.offsetY = Math.random() * Math.PI * 2;
        this.offsetRadius = Math.random() * Math.PI * 2;
    }

    update(time) {
        // Very slow, organic movement
        this.x = this.baseX + Math.sin(time * 0.0002 + this.offsetX) * 180;
        this.y = this.baseY + Math.cos(time * 0.00025 + this.offsetY) * 140;
        this.radius = this.baseRadius + Math.sin(time * 0.00015 + this.offsetRadius) * 60;
    }

    draw(context) {
        const gradient = context.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, this.radius
        );

        gradient.addColorStop(0, `hsla(${this.hue}, 65%, 65%, 0.9)`);
        gradient.addColorStop(0.4, `hsla(${this.hue}, 60%, 55%, 0.6)`);
        gradient.addColorStop(0.7, `hsla(${this.hue + 10}, 50%, 45%, 0.3)`);
        gradient.addColorStop(1, `hsla(${this.hue + 20}, 40%, 35%, 0)`);

        context.fillStyle = gradient;
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.fill();
    }
}

// Create blobs with refined colors
const blobs = [
    new Blob(width * 0.25, height * 0.35, 320, 15),  // Warm orange
    new Blob(width * 0.75, height * 0.65, 380, 195), // Cool cyan/blue
    new Blob(width * 0.5, height * 0.5, 280, 320),   // Purple/magenta
    new Blob(width * 0.6, height * 0.3, 240, 45)     // Amber
];

// Film grain generator
function addFilmGrain(imageData) {
    const data = imageData.data;
    const grainStrength = 8;

    for (let i = 0; i < data.length; i += 4) {
        const grain = (Math.random() - 0.5) * grainStrength;
        data[i] += grain;     // R
        data[i + 1] += grain; // G
        data[i + 2] += grain; // B
    }
}

// Chromatic aberration effect
function chromaticAberration() {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const tempData = new Uint8ClampedArray(data);

    const offset = 3 * dpr; // Subtle separation

    for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
            const idx = (y * canvas.width + x) * 4;

            // Red channel - shift right
            const rIdx = (y * canvas.width + Math.min(x + offset, canvas.width - 1)) * 4;
            data[idx] = tempData[rIdx];

            // Green channel - no shift
            data[idx + 1] = tempData[idx + 1];

            // Blue channel - shift left
            const bIdx = (y * canvas.width + Math.max(x - offset, 0)) * 4;
            data[idx + 2] = tempData[bIdx + 2];
        }
    }

    ctx.putImageData(imageData, 0, 0);
}

// Bloom/glow effect
function applyBloom() {
    ctx.shadowBlur = 40 * dpr;
    ctx.shadowColor = 'rgba(255, 255, 255, 0.3)';
    ctx.globalCompositeOperation = 'lighter';
    ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
    ctx.shadowBlur = 0;
    ctx.globalCompositeOperation = 'source-over';
}

// Gentle ripple distortion
function applyRipple(time) {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const outputData = ctx.createImageData(canvas.width, canvas.height);

    const amplitude = 3 * dpr;
    const frequency = 0.002;
    const speed = time * 0.0001;

    for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
            const distortionX = Math.sin(y * frequency + speed) * amplitude;
            const distortionY = Math.cos(x * frequency + speed) * amplitude;

            const srcX = Math.floor(x + distortionX);
            const srcY = Math.floor(y + distortionY);

            if (srcX >= 0 && srcX < canvas.width && srcY >= 0 && srcY < canvas.height) {
                const srcIdx = (srcY * canvas.width + srcX) * 4;
                const destIdx = (y * canvas.width + x) * 4;

                outputData.data[destIdx] = imageData.data[srcIdx];
                outputData.data[destIdx + 1] = imageData.data[srcIdx + 1];
                outputData.data[destIdx + 2] = imageData.data[srcIdx + 2];
                outputData.data[destIdx + 3] = imageData.data[srcIdx + 3];
            }
        }
    }

    ctx.putImageData(outputData, 0, 0);
}

function animate() {
    // Clear with very slight fade
    ctx.fillStyle = 'rgba(13, 13, 13, 0.05)';
    ctx.fillRect(0, 0, width, height);

    // Draw blobs with additive blending
    ctx.globalCompositeOperation = 'screen';

    blobs.forEach(blob => {
        blob.update(time);
        blob.draw(ctx);
    });

    ctx.globalCompositeOperation = 'source-over';

    // Apply high-end effects (less frequently for performance)
    if (time % 2 === 0) {
        applyRipple(time);
        chromaticAberration();

        // Add subtle film grain
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        addFilmGrain(imageData);
        ctx.putImageData(imageData, 0, 0);
    }

    time += 1;
    requestAnimationFrame(animate);
}

window.addEventListener('resize', () => {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.scale(dpr, dpr);

    offCanvas.width = canvas.width;
    offCanvas.height = canvas.height;
    offCtx.scale(dpr, dpr);

    // Reposition blobs
    blobs[0].baseX = width * 0.25;
    blobs[0].baseY = height * 0.35;
    blobs[1].baseX = width * 0.75;
    blobs[1].baseY = height * 0.65;
    blobs[2].baseX = width * 0.5;
    blobs[2].baseY = height * 0.5;
    blobs[3].baseX = width * 0.6;
    blobs[3].baseY = height * 0.3;
});

animate();
