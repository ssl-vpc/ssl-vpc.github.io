const entryScreen = document.getElementById('entryScreen');
const audio = document.getElementById('bgAudio');
const mainContent = document.getElementById('mainContent');
const card = document.querySelector('.card');
const playPauseBtn = document.getElementById('playPauseBtn');
const playIcon = document.getElementById('playIcon');
const progressContainer = document.getElementById('progressContainer');
const progressBar = document.getElementById('progressBar');
const playerTime = document.getElementById('playerTime');
const volumeSlider = document.getElementById('volumeSlider');
const volumeIcon = document.getElementById('volumeIcon');

mainContent.style.opacity = '0';
audio.volume = 0.5;

entryScreen.addEventListener('click', function() {
    entryScreen.classList.add('fade-out');
    audio.play();
    playIcon.className = 'fas fa-pause';
    
    setTimeout(function() {
        mainContent.style.opacity = '1';
        entryScreen.style.display = 'none';
        type();
    }, 500);
});

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

var textToType = 'expansion';
var typewriterEl = document.getElementById('typewriter');
var idx = 0;
var isDeleting = false;

function type() {
    if (!isDeleting) {
        if (idx < textToType.length) {
            typewriterEl.innerHTML += textToType.charAt(idx);
            idx++;
            setTimeout(type, 150);
        } else {
            isDeleting = true;
            setTimeout(type, 1500);
        }
    } else {
        if (idx > 0) {
            typewriterEl.innerHTML = textToType.substring(0, idx - 1);
            idx--;
            setTimeout(type, 100);
        } else {
            isDeleting = false;
            setTimeout(type, 500);
        }
    }
}

const rain = document.getElementById('rain');
function createDrop() {
    const drop = document.createElement('div');
    drop.className = 'drop';
    drop.style.left = Math.random() * 100 + '%';
    drop.style.animationDuration = (Math.random() * 0.5 + 0.5) + 's';
    drop.style.opacity = Math.random() * 0.3 + 0.2;
    rain.appendChild(drop);
    setTimeout(() => drop.remove(), 1500);
}
setInterval(createDrop, 20);

playPauseBtn.addEventListener('click', () => {
    if (audio.paused) {
        audio.play();
        playIcon.className = 'fas fa-pause';
    } else {
        audio.pause();
        playIcon.className = 'fas fa-play';
    }
});

audio.addEventListener('timeupdate', () => {
    const progress = (audio.currentTime / audio.duration) * 100;
    progressBar.style.width = progress + '%';
    playerTime.textContent = formatTime(audio.currentTime) + ' / ' + formatTime(audio.duration);
});

progressContainer.addEventListener('click', (e) => {
    const rect = progressContainer.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    audio.currentTime = percent * audio.duration;
});

volumeSlider.addEventListener('input', (e) => {
    const volume = e.target.value / 100;
    audio.volume = volume;
    updateVolumeIcon(volume);
});

function updateVolumeIcon(volume) {
    if (volume === 0) {
        volumeIcon.className = 'fas fa-volume-mute';
    } else if (volume < 0.5) {
        volumeIcon.className = 'fas fa-volume-down';
    } else {
        volumeIcon.className = 'fas fa-volume-up';
    }
}

function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return mins + ':' + (secs < 10 ? '0' : '') + secs;
}
