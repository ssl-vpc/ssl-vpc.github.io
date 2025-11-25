document.write('<div id="loadingScreen"><div class="glitch-line"></div><div class="loading-text">LOADING<span class="loading-dots"></span></div></div>');

(function() {
  const loadingScreen = document.getElementById('loadingScreen');
  const loadingText = document.querySelector('.loading-text');
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
  const originalText = 'LOADING';
  let glitchInterval;

  function randomGlitch() {
    let glitched = '';
    for (let i = 0; i < originalText.length; i++) {
      if (Math.random() > 0.5) {
        glitched += chars[Math.floor(Math.random() * chars.length)];
      } else {
        glitched += originalText[i];
      }
    }
    const textNode = loadingText.childNodes[0];
    if (textNode) {
      textNode.textContent = glitched;
    }
  }

  glitchInterval = setInterval(randomGlitch, 100);

  window.addEventListener('load', function() {
    setTimeout(function() {
      clearInterval(glitchInterval);
      const textNode = loadingText.childNodes[0];
      if (textNode) {
        textNode.textContent = 'LOADING';
      }
      
      setTimeout(function() {
        loadingScreen.classList.add('hidden');
        setTimeout(function() {
          if (loadingScreen.parentNode) {
            loadingScreen.remove();
          }
        }, 500);
      }, 200);
    }, 1000);
  });
})();
