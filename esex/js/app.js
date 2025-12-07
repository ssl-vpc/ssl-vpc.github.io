const enterScreen = document.getElementById('enterScreen');
const mainContent = document.getElementById('mainContent');
const bgMusic = document.getElementById('bgMusic');
const volumeControl = document.getElementById('volumeControl');
const volumeSlider = document.getElementById('volumeSlider');

bgMusic.volume = 0.5;

volumeSlider.addEventListener('input', (e) => {
    bgMusic.volume = e.target.value / 100;
});

enterScreen.addEventListener('click', () => {
    enterScreen.classList.add('fade-out');
    mainContent.classList.remove('hidden');
    mainContent.classList.add('visible');
    volumeControl.classList.add('visible');
    
    bgMusic.play().catch(err => console.log('Audio play failed:', err));
    
    setTimeout(() => {
        enterScreen.style.display = 'none';
    }, 800);
});

document.addEventListener('mousemove', (e) => {
    if (mainContent.classList.contains('visible') && Math.random() < 0.3) {
        createSnowflake(e.clientX, e.clientY);
    }
});

function updateTimestamp() {
    const now = new Date();
    const date = now.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
    });
    const time = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit',
        hour12: false
    });
    document.getElementById('timestamp').textContent = `${date} ${time}`;
}

updateTimestamp();
setInterval(updateTimestamp, 1000);

const snowflakes = [];
const maxSnowflakes = 50;

function createSnowflake(x, y) {
    const snowflake = document.createElement('div');
    snowflake.className = 'snowflake';
    snowflake.textContent = '*';
    snowflake.style.left = x + 'px';
    snowflake.style.top = y + 'px';
    document.body.appendChild(snowflake);
    
    const speed = Math.random() * 2 + 1;
    const drift = (Math.random() - 0.5) * 2;
    
    snowflakes.push({
        element: snowflake,
        x: x,
        y: y,
        speed: speed,
        drift: drift
    });
    
    if (snowflakes.length > maxSnowflakes) {
        const old = snowflakes.shift();
        old.element.remove();
    }
}

function updateSnowflakes() {
    snowflakes.forEach((flake, index) => {
        flake.y += flake.speed;
        flake.x += flake.drift;
        
        flake.element.style.top = flake.y + 'px';
        flake.element.style.left = flake.x + 'px';
        
        if (flake.y > window.innerHeight) {
            flake.element.remove();
            snowflakes.splice(index, 1);
        }
    });
    
    requestAnimationFrame(updateSnowflakes);
}

updateSnowflakes();

const particles = [];
const maxParticles = 100;

function createParticle() {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * window.innerWidth + 'px';
    particle.style.top = Math.random() * window.innerHeight + 'px';
    document.body.appendChild(particle);
    
    const speedX = (Math.random() - 0.5) * 0.5;
    const speedY = (Math.random() - 0.5) * 0.5;
    
    particles.push({
        element: particle,
        x: parseFloat(particle.style.left),
        y: parseFloat(particle.style.top),
        speedX: speedX,
        speedY: speedY
    });
}

function updateParticles() {
    particles.forEach((particle) => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        if (particle.x < 0) particle.x = window.innerWidth;
        if (particle.x > window.innerWidth) particle.x = 0;
        if (particle.y < 0) particle.y = window.innerHeight;
        if (particle.y > window.innerHeight) particle.y = 0;
        
        particle.element.style.left = particle.x + 'px';
        particle.element.style.top = particle.y + 'px';
    });
    
    requestAnimationFrame(updateParticles);
}

for (let i = 0; i < maxParticles; i++) {
    createParticle();
}

updateParticles();
