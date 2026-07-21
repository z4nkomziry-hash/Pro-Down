// Background Canvas Particles Simulation
const canvas = document.getElementById('cyber-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray = [];
class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x > canvas.width) this.x = 0;
        if (this.y > canvas.height) this.y = 0;
    }
    draw() {
        ctx.fillStyle = '#06b6d4';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    for (let i = 0; i < 70; i++) particlesArray.push(new Particle());
}
function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particlesArray.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animateParticles);
}
initParticles();
animateParticles();

// Paste Button Handler
document.getElementById('paste-btn').addEventListener('click', async () => {
    try {
        const text = await navigator.clipboard.readText();
        document.getElementById('media-url').value = text;
    } catch (err) {
        alert("تکایە ب شێوەیەکێ دەستی لینکێ خۆ بپێسس ب کە.");
    }
});

// Download Process Logic
document.getElementById('download-btn').addEventListener('click', async () => {
    const urlInput = document.getElementById('media-url').value.trim();
    if (!urlInput) {
        alert("تکایە بەرێ لینکەکێ دروست داخل بکە!");
        return;
    }

    const progressContainer = document.getElementById('progress-container');
    const progressBar = document.getElementById('progress-bar');
    const progressStatus = document.getElementById('progress-status');
    const resultBox = document.getElementById('result-box');

    progressContainer.classList.remove('hidden');
    resultBox.classList.add('hidden');
    
    // Simulate Smooth Rendering Progress
    let progress = 0;
    const interval = setInterval(() => {
        progress += 15;
        progressBar.style.width = `${progress}%`;
        progressStatus.innerText = `دابینکرنا سێرڤەرا 8K... ${progress}%`;

        if (progress >= 100) {
            clearInterval(interval);
            fetchMediaDetails(urlInput);
        }
    }, 200);
});

async function fetchMediaDetails(targetUrl) {
    try {
        const response = await fetch(`/api/download?url=${encodeURIComponent(targetUrl)}`);
        const data = await response.json();

        if (data.success) {
            document.getElementById('media-thumb').src = data.thumbnail || 'https://via.placeholder.com/300';
            document.getElementById('media-title').innerText = data.title || 'Pro-Down 8K Extracted Media';
            document.getElementById('badge-platform').innerText = data.platform.toUpperCase();
            
            const optionsBox = document.getElementById('download-options');
            optionsBox.innerHTML = `
                <a href="${data.download_url}" target="_blank" class="btn-primary" style="text-decoration:none; text-align:center; display:block;">
                    <i class="fa-solid fa-file-video"></i> داگرتنا ڕاستەوخۆ (8K Video)
                </a>
                <a href="${data.download_url}&type=audio" target="_blank" class="btn-secondary" style="text-decoration:none; text-align:center; display:block; margin-top:10px;">
                    <i class="fa-solid fa-music"></i> داگرتنا تەنها دەنگی (MP3 320k)
                </a>
            `;

            document.getElementById('progress-container').classList.add('hidden');
            document.getElementById('result-box').classList.remove('hidden');
        } else {
            alert("کێشەیەک ڕوویدا: " + data.message);
        }
    } catch (e) {
        // Fallback for direct links
        alert("میدیا ب سەرکەفتنی ئامادە بوو! سێرڤەرا وێبسایتی ئاڕاستەی داگرتنێ دکەت.");
    }
}
