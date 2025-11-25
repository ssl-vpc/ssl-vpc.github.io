// Music Player Controller
document.addEventListener('DOMContentLoaded', function() {
  const audio = document.getElementById('audioPlayer');
  const player = document.getElementById('musicPlayer');
  const toggle = document.getElementById('playerToggle');
  const playBtn = document.getElementById('playBtn');
  const pauseBtn = document.getElementById('pauseBtn');
  const volumeSlider = document.getElementById('volumeSlider');
  const volumeValue = document.getElementById('volumeValue');
  const trackSelect = document.getElementById('trackSelect');
  const closeBtn = document.getElementById('closePlayer');
  const nowPlaying = document.getElementById('nowPlaying');

  // Check if all elements exist
  if (!audio || !player || !toggle || !playBtn || !pauseBtn || !volumeSlider || !volumeValue || !trackSelect || !closeBtn || !nowPlaying) {
    console.error('Music player elements not found');
    return;
  }

  // Make player draggable with smooth animation
  let isDragging = false;
  let currentX = 0;
  let currentY = 0;
  let initialX = 0;
  let initialY = 0;
  let xOffset = 0;
  let yOffset = 0;
  let animationFrame = null;

  const playerHeader = player.querySelector('.player-header');

  playerHeader.style.cursor = 'move';

  playerHeader.addEventListener('mousedown', dragStart, { passive: false });
  document.addEventListener('mousemove', drag, { passive: false });
  document.addEventListener('mouseup', dragEnd);

  // Touch events for mobile
  playerHeader.addEventListener('touchstart', dragStart, { passive: false });
  document.addEventListener('touchmove', drag, { passive: false });
  document.addEventListener('touchend', dragEnd);

  function dragStart(e) {
    if (e.type === 'touchstart') {
      initialX = e.touches[0].clientX - xOffset;
      initialY = e.touches[0].clientY - yOffset;
    } else {
      initialX = e.clientX - xOffset;
      initialY = e.clientY - yOffset;
    }

    if (e.target === playerHeader || playerHeader.contains(e.target)) {
      // Don't start drag if clicking close button
      if (e.target === closeBtn || closeBtn.contains(e.target)) {
        return;
      }
      isDragging = true;
      player.classList.add('dragging');
    }
  }

  function drag(e) {
    if (isDragging) {
      e.preventDefault();

      if (e.type === 'touchmove') {
        currentX = e.touches[0].clientX - initialX;
        currentY = e.touches[0].clientY - initialY;
      } else {
        currentX = e.clientX - initialX;
        currentY = e.clientY - initialY;
      }

      xOffset = currentX;
      yOffset = currentY;

      // Use requestAnimationFrame for smooth animation
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
      
      animationFrame = requestAnimationFrame(function() {
        setTranslate(currentX, currentY, player);
      });
    }
  }

  function dragEnd() {
    if (isDragging) {
      initialX = currentX;
      initialY = currentY;
      isDragging = false;
      player.classList.remove('dragging');

      // Save position
      try {
        sessionStorage.setItem('playerX', xOffset);
        sessionStorage.setItem('playerY', yOffset);
      } catch(e) {
        console.log('Could not save player position');
      }
    }
  }

  function setTranslate(xPos, yPos, el) {
    el.style.transform = 'translate3d(' + xPos + 'px, ' + yPos + 'px, 0)';
  }

  // Restore player position
  try {
    const savedX = sessionStorage.getItem('playerX');
    const savedY = sessionStorage.getItem('playerY');
    
    if (savedX && savedY) {
      xOffset = parseFloat(savedX);
      yOffset = parseFloat(savedY);
      currentX = xOffset;
      currentY = yOffset;
      setTranslate(xOffset, yOffset, player);
    }
  } catch(e) {
    console.log('Could not restore player position');
  }

  // Toggle player visibility
  toggle.addEventListener('click', function(e) {
    e.preventDefault();
    player.classList.toggle('hidden');
    if (player.classList.contains('hidden')) {
      toggle.textContent = '♫ SHOW PLAYER';
    } else {
      toggle.textContent = '♫ HIDE PLAYER';
    }
  });

  // Close button
  closeBtn.addEventListener('click', function(e) {
    e.preventDefault();
    player.classList.add('hidden');
    toggle.textContent = '♫ SHOW PLAYER';
  });

  // Play button
  playBtn.addEventListener('click', function(e) {
    e.preventDefault();
    audio.play().catch(function(error) {
      console.log('Play failed:', error);
    });
  });

  // Pause button
  pauseBtn.addEventListener('click', function(e) {
    e.preventDefault();
    audio.pause();
  });

  // Volume control
  volumeSlider.addEventListener('input', function() {
    const volume = parseFloat(this.value) / 100;
    audio.volume = Math.max(0, Math.min(1, volume));
    volumeValue.textContent = this.value + '%';
  });

  // Track selection
  trackSelect.addEventListener('change', function() {
    const selectedTrack = this.value;
    const wasPlaying = !audio.paused;
    
    audio.src = selectedTrack;
    audio.load();
    
    if (wasPlaying) {
      audio.play().catch(function(error) {
        console.log('Play failed:', error);
      });
    }
    
    updateNowPlaying();
  });

  // Update now playing text
  function updateNowPlaying() {
    const trackName = trackSelect.options[trackSelect.selectedIndex].text;
    nowPlaying.textContent = '♫ ' + trackName;
  }

  // Save state continuously
  function savePlayerState() {
    try {
      sessionStorage.setItem('audioTime', audio.currentTime);
      sessionStorage.setItem('audioSrc', audio.src);
      sessionStorage.setItem('audioVolume', audio.volume);
      sessionStorage.setItem('audioPlaying', !audio.paused);
      sessionStorage.setItem('playerVisible', !player.classList.contains('hidden'));
      sessionStorage.setItem('selectedTrack', trackSelect.value);
    } catch(e) {
      console.log('Could not save player state');
    }
  }

  // Save state every second and on important events
  setInterval(savePlayerState, 1000);
  
  audio.addEventListener('play', savePlayerState);
  audio.addEventListener('pause', savePlayerState);
  audio.addEventListener('volumechange', savePlayerState);
  
  // Save state before page unload
  window.addEventListener('beforeunload', savePlayerState);
  window.addEventListener('pagehide', savePlayerState);

  // Restore complete player state
  try {
    const savedTime = sessionStorage.getItem('audioTime');
    const savedSrc = sessionStorage.getItem('audioSrc');
    const savedVolume = sessionStorage.getItem('audioVolume');
    const wasPlaying = sessionStorage.getItem('audioPlaying') === 'true';
    const wasVisible = sessionStorage.getItem('playerVisible') === 'true';
    const savedTrack = sessionStorage.getItem('selectedTrack');
    
    // Restore volume
    if (savedVolume) {
      audio.volume = parseFloat(savedVolume);
      volumeSlider.value = Math.round(parseFloat(savedVolume) * 100);
      volumeValue.textContent = volumeSlider.value + '%';
    } else {
      audio.volume = 0.5;
      volumeSlider.value = 50;
      volumeValue.textContent = '50%';
    }
    
    // Restore track selection
    if (savedTrack) {
      trackSelect.value = savedTrack;
      audio.src = savedTrack;
    }
    
    // Restore playback position
    if (savedTime && parseFloat(savedTime) > 0) {
      audio.currentTime = parseFloat(savedTime);
    }
    
    // Restore player visibility
    if (wasVisible) {
      player.classList.remove('hidden');
      toggle.textContent = '♫ HIDE PLAYER';
    } else {
      player.classList.add('hidden');
      toggle.textContent = '♫ SHOW PLAYER';
    }
    
    // Update now playing
    updateNowPlaying();
    
    // Restore playing state
    if (wasPlaying) {
      setTimeout(function() {
        audio.play().catch(function() {
          console.log('Could not resume playback');
        });
      }, 100);
    }
    
  } catch(e) {
    console.log('Could not restore player state');
    // Initialize defaults
    audio.volume = 0.5;
    volumeSlider.value = 50;
    volumeValue.textContent = '50%';
    updateNowPlaying();
    
    // Try autoplay
    setTimeout(function() {
      audio.play().catch(function() {
        console.log('Autoplay prevented by browser');
      });
    }, 100);
  }
});
