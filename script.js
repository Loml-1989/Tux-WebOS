const apps = ["Terminal", "Browser", "File Manager", "Settings", "Text Editor", "System Monitor"];
const launcher = document.getElementById('launcher');
const launcherInput = document.getElementById('launcher-input');
const launcherResults = document.getElementById('launcher-results');
const container = document.getElementById('wm-container');

let activeWindow = null;
let selectedLauncherIndex = 0;

function updateClock() {
    const now = new Date();
    document.getElementById('clock').textContent = now.toLocaleTimeString();
}
setInterval(updateClock, 1000);
updateClock();

function setActiveWindow(win) {
    if (activeWindow) {
        activeWindow.classList.remove('active');
    }
    activeWindow = win;
    if (activeWindow) {
        activeWindow.classList.add('active');
        activeWindow.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
}

function spawnWindow(title, content) {
    const win = document.createElement('div');
    win.className = 'window';
    
    const body = document.createElement('div');
    body.className = 'window-content';
    body.innerHTML = `<strong>[ ${title} ]</strong><br><br>${content}`;
    
    win.appendChild(body);
    win.addEventListener('mousedown', () => setActiveWindow(win));
    
    container.appendChild(win);
    setActiveWindow(win);
}

function renderLauncherResults(filterText = "") {
    launcherResults.innerHTML = "";
    const filteredApps = apps.filter(app => app.toLowerCase().includes(filterText.toLowerCase()));
    
    filteredApps.forEach((app, index) => {
        const div = document.createElement('div');
        div.className = 'launcher-item';
        if (index === selectedLauncherIndex) {
            div.classList.add('selected');
        }
        div.textContent = app;
        div.addEventListener('click', () => {
            spawnWindow(app, `Session loaded for ${app}.`);
            toggleLauncher(false);
        });
        launcherResults.appendChild(div);
    });
}

function toggleLauncher(forceShow) {
    const isHidden = launcher.classList.contains('hidden');
    const shouldShow = forceShow !== undefined ? forceShow : isHidden;
    
    if (shouldShow) {
        launcher.classList.remove('hidden');
        launcherInput.value = "";
        selectedLauncherIndex = 0;
        renderLauncherResults();
        setTimeout(() => launcherInput.focus(), 10);
    } else {
        launcher.classList.add('hidden');
    }
}

document.addEventListener('keydown', (e) => {
    const launcherActive = !launcher.classList.contains('hidden');

    if (e.shiftKey && (e.code === 'Space' || e.key === ' ')) {
        e.preventDefault();
        toggleLauncher();
        return;
    }

    if (launcherActive) {
        const items = launcherResults.querySelectorAll('.launcher-item');
        
        if (e.key === 'Escape') {
            e.preventDefault();
            toggleLauncher(false);
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (items.length > 0) {
                selectedLauncherIndex = (selectedLauncherIndex + 1) % items.length;
                renderLauncherResults(launcherInput.value);
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (items.length > 0) {
                selectedLauncherIndex = (selectedLauncherIndex - 1 + items.length) % items.length;
                renderLauncherResults(launcherInput.value);
            }
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (items[selectedLauncherIndex]) {
                items[selectedLauncherIndex].click();
            }
        }
        return;
    }

    const shiftHeld = e.shiftKey || e.getModifierState('CapsLock');

    if (shiftHeld && (e.code === 'KeyC' || e.key.toLowerCase() === 'c')) {
        e.preventDefault();
        if (activeWindow) {
            const nextWindow = activeWindow.nextElementSibling || activeWindow.previousElementSibling;
            container.removeChild(activeWindow);
            setActiveWindow(nextWindow);
        }
    }

    if (shiftHeld && (e.code === 'KeyI' || e.key.toLowerCase() === 'i')) {
        e.preventDefault();
        if (activeWindow) {
            activeWindow.classList.toggle('fullscreen');
            setTimeout(() => {
                activeWindow.scrollIntoView({ behavior: 'smooth', inline: 'center' });
            }, 50);
        }
    }

    if (shiftHeld && (e.code === 'KeyH' || e.key.toLowerCase() === 'h')) {
        e.preventDefault();
        if (activeWindow && activeWindow.previousElementSibling) {
            setActiveWindow(activeWindow.previousElementSibling);
        }
    }

    if (shiftHeld && (e.code === 'KeyL' || e.key.toLowerCase() === 'l')) {
        e.preventDefault();
        if (activeWindow && activeWindow.nextElementSibling) {
            setActiveWindow(activeWindow.nextElementSibling);
        }
    }

});

launcherInput.addEventListener('input', (e) => {
    selectedLauncherIndex = 0;
    renderLauncherResults(e.target.value);
});

spawnWindow("Terminal", "stardance@webos:~$ neofetch");
spawnWindow("Browser", "Browsing the cosmos...");