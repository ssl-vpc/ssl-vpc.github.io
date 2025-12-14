const neofetchText = `<span class="nf-ascii">        ,.=:!!t3Z3z.,</span>                  <span class="nf-title">snmse@PC-JJFU0MG</span>
<span class="nf-ascii">       :tt:::tt333EE3</span>                  <span class="nf-sep">----------------</span>
<span class="nf-ascii">       Et:::ztt33EEEL</span> <span class="nf-red">@Ee.,</span>      <span class="nf-red">..,</span>   <span class="nf-label">OS:</span> Windows (Unknown) x86_64
<span class="nf-ascii">      ;tt:::tt333EE7</span> <span class="nf-red">;EEEEEEttttt33#</span>   <span class="nf-label">Uptime:</span> 5 hours, 27 mins
<span class="nf-ascii">     :Et:::zt333EEQ.</span> <span class="nf-red">$EEEEEttttt33QL</span>   <span class="nf-label">Packages:</span> 135 (pacman)
<span class="nf-ascii">     it:::tt333EEF</span> <span class="nf-red">@EEEEEEttttt33F</span>    <span class="nf-label">Shell:</span> bash 5.2.37
<span class="nf-ascii">    ;3=*^\`\`\`"*4EEV</span> <span class="nf-red">:EEEEEEttttt33@.</span>   <span class="nf-label">DE:</span> Aero
<span class="nf-ascii">    ,.=::::!t=.,</span> <span class="nf-red">\`</span> <span class="nf-red">@EEEEEEtttz33QF</span>    <span class="nf-label">WM:</span> Explorer
<span class="nf-ascii">   ;::::::::zt33)</span>   <span class="nf-red">"4EEEtttji3P*</span>     <span class="nf-label">WM Theme:</span> Custom
<span class="nf-ascii">  :t::::::::tt33.</span><span class="nf-red">:Z3z..</span>  <span class="nf-red">\`\`</span> <span class="nf-red">,..g.</span>     <span class="nf-label">Terminal:</span> mintty
<span class="nf-ascii">  i::::::::zt33F</span> <span class="nf-red">AEEEtttt::::ztF</span>      <span class="nf-label">CPU:</span> AMD Ryzen 7 7700 (16) @ 3.800GHz
<span class="nf-ascii"> ;:::::::::t33V</span> <span class="nf-red">;EEEttttt::::t3</span>       <span class="nf-label">Memory:</span> 14466MiB / 64730MiB
<span class="nf-ascii"> E::::::::zt33L</span> <span class="nf-red">@EEEtttt::::z3F</span>
<span class="nf-ascii">{3=*^\`\`\`"*4E3)</span> <span class="nf-red">;EEEtttt:::::tZ\`</span>      <span class="nf-colors"><span class="c1">███</span><span class="c2">███</span><span class="c3">███</span><span class="c4">███</span><span class="c5">███</span><span class="c6">███</span><span class="c7">███</span><span class="c8">███</span></span>
<span class="nf-ascii">            \`</span> <span class="nf-red">:EEEEtttt::::z7</span>       <span class="nf-colors"><span class="c1b">███</span><span class="c2b">███</span><span class="c3b">███</span><span class="c4b">███</span><span class="c5b">███</span><span class="c6b">███</span><span class="c7b">███</span><span class="c8b">███</span></span>
<span class="nf-ascii">                </span><span class="nf-red">"VEzjt:;;z>*\`</span>`;

const bootScreen = document.getElementById('bootScreen');
const neofetchEl = document.getElementById('neofetch');
const commandEl = document.getElementById('command');
const cursorEl = document.querySelector('.cursor');
const desktop = document.getElementById('desktop');
const taskbar = document.getElementById('taskbar');
const taskbarItems = document.getElementById('taskbarItems');
const bgAudio = document.getElementById('bgAudio');
const audioPlayBtn = document.getElementById('audioPlayBtn');
const audioBarFill = document.getElementById('audioBarFill');
const audioTime = document.getElementById('audioTime');
const audioDuration = document.getElementById('audioDuration');

let openWindows = {};
let activeWindow = null;
let draggedWindow = null;
let dragOffset = { x: 0, y: 0 };
let zIndex = 100;
let isAudioPlaying = false;

bgAudio.volume = 0.1;

function login() {
    const loginScreen = document.getElementById('loginScreen');
    loginScreen.classList.add('hidden');
    bootScreen.classList.remove('hidden');
    
    bgAudio.volume = 0.1;
    bgAudio.play().then(() => {
        isAudioPlaying = true;
    }).catch(() => {});
    
    typeCommand();
}

function typeCommand() {
    const cmd = 'neofetch';
    let i = 0;
    function type() {
        if (i < cmd.length) {
            commandEl.textContent += cmd.charAt(i);
            i++;
            setTimeout(type, 80);
        } else {
            setTimeout(() => {
                cursorEl.style.display = 'none';
                showNeofetch();
            }, 300);
        }
    }
    type();
}

function showNeofetch() {
    neofetchEl.innerHTML = neofetchText;
    neofetchEl.classList.add('visible');
    setTimeout(showDesktop, 2000);
}

function showDesktop() {
    bootScreen.classList.add('hidden');
    desktop.classList.add('visible');
    taskbar.classList.add('visible');
    updateClock();
    setInterval(updateClock, 1000);
    
    bgAudio.volume = 0.5;
    audioPlayBtn.innerHTML = '<i class="fas fa-pause"></i>';
    
    initPaint();
}

function updateClock() {
    const now = new Date();
    document.getElementById('clock').textContent = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

function openWindow(id) {
    const win = document.getElementById('window-' + id);
    if (!win) return;
    
    win.classList.add('open');
    win.style.zIndex = ++zIndex;
    
    if (!win.style.left) {
        win.style.left = (100 + Object.keys(openWindows).length * 30) + 'px';
        win.style.top = (80 + Object.keys(openWindows).length * 30) + 'px';
    }
    
    openWindows[id] = true;
    activeWindow = id;
    updateTaskbar();
}

function closeWindow(id) {
    const win = document.getElementById('window-' + id);
    if (win) {
        win.classList.remove('open');
        delete openWindows[id];
        updateTaskbar();
    }
}

function minimizeWindow(id) {
    const win = document.getElementById('window-' + id);
    if (win) {
        win.classList.remove('open');
        updateTaskbar();
    }
}

function updateTaskbar() {
    taskbarItems.innerHTML = '';
    for (let id in openWindows) {
        const item = document.createElement('div');
        item.className = 'taskbar-item' + (document.getElementById('window-' + id).classList.contains('open') ? ' active' : '');
        item.onclick = () => {
            const win = document.getElementById('window-' + id);
            if (win.classList.contains('open')) {
                minimizeWindow(id);
            } else {
                openWindow(id);
            }
        };
        
        let icon = '';
        if (id === 'vylenc') icon = '<img src="media/pfp.png">';
        else if (id === 'case') icon = '<img src="media/pfp2.jpeg">';
        else if (id === 'audio') icon = '<i class="fas fa-music"></i>';
        else if (id === 'notepad') icon = '<i class="fas fa-file-alt"></i>';
        else if (id === 'paint') icon = '<i class="fas fa-paint-brush"></i>';
        else if (id === 'explorer') icon = '<i class="fas fa-folder"></i>';
        else if (id === 'calc') icon = '<i class="fas fa-calculator"></i>';
        
        item.innerHTML = icon + ' ' + id;
        taskbarItems.appendChild(item);
    }
}


function startDrag(e, windowId) {
    const win = document.getElementById(windowId);
    draggedWindow = win;
    win.style.zIndex = ++zIndex;
    
    const rect = win.getBoundingClientRect();
    dragOffset.x = e.clientX - rect.left;
    dragOffset.y = e.clientY - rect.top;
    
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDrag);
}

function drag(e) {
    if (!draggedWindow) return;
    
    let x = e.clientX - dragOffset.x;
    let y = e.clientY - dragOffset.y;
    
    x = Math.max(0, Math.min(x, window.innerWidth - draggedWindow.offsetWidth));
    y = Math.max(0, Math.min(y, window.innerHeight - 40 - draggedWindow.offsetHeight));
    
    draggedWindow.style.left = x + 'px';
    draggedWindow.style.top = y + 'px';
}

function stopDrag() {
    draggedWindow = null;
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('mouseup', stopDrag);
}

function toggleAudio() {
    if (isAudioPlaying) {
        bgAudio.pause();
        audioPlayBtn.innerHTML = '<i class="fas fa-play"></i>';
    } else {
        bgAudio.play();
        audioPlayBtn.innerHTML = '<i class="fas fa-pause"></i>';
    }
    isAudioPlaying = !isAudioPlaying;
}

function setVolume(val) {
    bgAudio.volume = val / 100;
}

function seekAudio(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    bgAudio.currentTime = percent * bgAudio.duration;
}

function prevTrack() {
    bgAudio.currentTime = 0;
}

function nextTrack() {
    bgAudio.currentTime = 0;
}

function formatTime(sec) {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60).toString().padStart(2, '0');
    return m + ':' + s;
}

bgAudio.addEventListener('loadedmetadata', () => {
    audioDuration.textContent = formatTime(bgAudio.duration);
});

bgAudio.addEventListener('timeupdate', () => {
    const percent = (bgAudio.currentTime / bgAudio.duration) * 100;
    audioBarFill.style.width = percent + '%';
    audioTime.textContent = formatTime(bgAudio.currentTime);
});

function toggleStartMenu() {
    const startMenu = document.getElementById('startMenu');
    startMenu.classList.toggle('open');
}

document.addEventListener('click', (e) => {
    const startMenu = document.getElementById('startMenu');
    const startBtn = document.querySelector('.start-btn');
    if (!startMenu.contains(e.target) && !startBtn.contains(e.target)) {
        startMenu.classList.remove('open');
    }
});

function saveNotepad() {
    const text = document.getElementById('notepadText').value;
    const blob = new Blob([text], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'note.txt';
    a.click();
}

let paintCanvas, paintCtx, isPainting = false;

function initPaint() {
    paintCanvas = document.getElementById('paintCanvas');
    paintCtx = paintCanvas.getContext('2d');
    paintCtx.fillStyle = '#fff';
    paintCtx.fillRect(0, 0, paintCanvas.width, paintCanvas.height);
    
    paintCanvas.addEventListener('mousedown', startPaint);
    paintCanvas.addEventListener('mousemove', paint);
    paintCanvas.addEventListener('mouseup', stopPaint);
    paintCanvas.addEventListener('mouseleave', stopPaint);
}

function startPaint(e) {
    isPainting = true;
    paint(e);
}

function paint(e) {
    if (!isPainting) return;
    
    const rect = paintCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    paintCtx.fillStyle = document.getElementById('paintColor').value;
    const size = document.getElementById('brushSize').value;
    
    paintCtx.beginPath();
    paintCtx.arc(x, y, size / 2, 0, Math.PI * 2);
    paintCtx.fill();
}

function stopPaint() {
    isPainting = false;
}

function clearCanvas() {
    paintCtx.fillStyle = '#fff';
    paintCtx.fillRect(0, 0, paintCanvas.width, paintCanvas.height);
}

function savePaint() {
    const a = document.createElement('a');
    a.href = paintCanvas.toDataURL('image/png');
    a.download = 'drawing.png';
    a.click();
}

function shutdown() {
    toggleStartMenu();
    const shutdownScreen = document.getElementById('shutdownScreen');
    shutdownScreen.classList.remove('hidden');
    bgAudio.pause();
    
    setTimeout(() => {
        document.body.innerHTML = '<div style="background:#000;width:100%;height:100vh;"></div>';
    }, 2000);
}

let calcValue = '0';

function calcInput(val) {
    if (calcValue === '0' && val !== '.') {
        calcValue = val;
    } else {
        calcValue += val;
    }
    document.getElementById('calcDisplay').value = calcValue;
}

function clearCalc() {
    calcValue = '0';
    document.getElementById('calcDisplay').value = '0';
}

function backspace() {
    if (calcValue.length > 1) {
        calcValue = calcValue.slice(0, -1);
    } else {
        calcValue = '0';
    }
    document.getElementById('calcDisplay').value = calcValue;
}

function calculate() {
    try {
        calcValue = eval(calcValue).toString();
        document.getElementById('calcDisplay').value = calcValue;
    } catch (e) {
        document.getElementById('calcDisplay').value = 'Error';
        calcValue = '0';
    }
}

function showFolder(folder) {
    const folders = document.querySelectorAll('.explorer-folder');
    folders.forEach(f => f.classList.remove('active'));
    event.target.closest('.explorer-folder').classList.add('active');
    
    const main = document.getElementById('explorerMain');
    
    if (folder === 'downloads') {
        main.innerHTML = `
            <div class="explorer-file" ondblclick="window.open('https://t.me/zeroanc', '_blank')">
                <i class="fab fa-telegram"></i>
                <span>Telegram.lnk</span>
            </div>
        `;
    } else if (folder === 'desktop') {
        main.innerHTML = `
            <div class="explorer-file">
                <i class="fas fa-user"></i>
                <span>vylenc.lnk</span>
            </div>
            <div class="explorer-file">
                <i class="fas fa-user"></i>
                <span>case.lnk</span>
            </div>
        `;
    } else if (folder === 'documents') {
        main.innerHTML = `
            <div class="explorer-file">
                <i class="fas fa-file-alt"></i>
                <span>readme.txt</span>
            </div>
        `;
    } else if (folder === 'pictures') {
        main.innerHTML = `
            <div class="explorer-file">
                <i class="fas fa-image"></i>
                <span>wallpaper.png</span>
            </div>
        `;
    }
}