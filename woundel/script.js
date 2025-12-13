const audio = document.getElementById('audio');
const playIcon = document.getElementById('playIcon');
const topPlayIcon = document.getElementById('topPlayIcon');
const progress = document.getElementById('progress');
const progressDot = document.getElementById('progressDot');
const timeCurrent = document.getElementById('timeCurrent');
const timeTotal = document.getElementById('timeTotal');
const mainCard = document.getElementById('mainCard');
const playerCard = document.getElementById('playerCard');
const enterScreen = document.getElementById('enterScreen');
const mainContainer = document.getElementById('mainContainer');
const topMusicCtrl = document.getElementById('topMusicCtrl');
const volumeSlider = document.getElementById('volumeSlider');
const volumeIcon = document.getElementById('volumeIcon');

let isPlaying = false;

audio.volume = 0.5;

enterScreen.addEventListener('click', () => {
    enterScreen.classList.add('hidden');
    mainContainer.classList.add('visible');
    topMusicCtrl.classList.add('visible');
    
    audio.play().then(() => {
        isPlaying = true;
        updatePlayIcons();
    }).catch(() => {
        isPlaying = false;
        updatePlayIcons();
    });
});

function updatePlayIcons() {
    if (isPlaying) {
        playIcon.classList.remove('fa-play');
        playIcon.classList.add('fa-pause');
        topPlayIcon.classList.remove('fa-play');
        topPlayIcon.classList.add('fa-pause');
    } else {
        playIcon.classList.remove('fa-pause');
        playIcon.classList.add('fa-play');
        topPlayIcon.classList.remove('fa-pause');
        topPlayIcon.classList.add('fa-play');
    }
}

function togglePlay() {
    if (isPlaying) {
        audio.pause();
    } else {
        audio.play();
    }
    isPlaying = !isPlaying;
    updatePlayIcons();
}

function setVolume(value) {
    audio.volume = value / 100;
    updateVolumeIcon(value);
}

function updateVolumeIcon(value) {
    if (value == 0) {
        volumeIcon.className = 'fas fa-volume-mute';
    } else if (value < 50) {
        volumeIcon.className = 'fas fa-volume-down';
    } else {
        volumeIcon.className = 'fas fa-volume-up';
    }
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
}

audio.addEventListener('loadedmetadata', () => {
    timeTotal.textContent = formatTime(audio.duration);
});

audio.addEventListener('timeupdate', () => {
    const percent = (audio.currentTime / audio.duration) * 100;
    progress.style.width = percent + '%';
    progressDot.style.left = percent + '%';
    timeCurrent.textContent = formatTime(audio.currentTime);
});

audio.addEventListener('ended', () => {
    audio.currentTime = 0;
    audio.play();
});

function setProgress(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    audio.currentTime = (clickX / width) * audio.duration;
}

function prevTrack() {
    audio.currentTime = 0;
}

function nextTrack() {
    audio.currentTime = 0;
}

function addTiltEffect(card) {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'rotateX(0) rotateY(0)';
    });
}

addTiltEffect(mainCard);
addTiltEffect(playerCard);

function createSnowflakes() {
    const container = document.getElementById('snowflakes');
    const flakeCount = 30;
    
    for (let i = 0; i < flakeCount; i++) {
        const flake = document.createElement('div');
        flake.className = 'snowflake';
        flake.innerHTML = '✦';
        flake.style.left = Math.random() * 100 + '%';
        flake.style.animationDuration = (Math.random() * 5 + 5) + 's';
        flake.style.animationDelay = Math.random() * 5 + 's';
        flake.style.fontSize = (Math.random() * 10 + 8) + 'px';
        flake.style.opacity = Math.random() * 0.5 + 0.3;
        container.appendChild(flake);
    }
}

createSnowflakes();