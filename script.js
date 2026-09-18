const apps = ["Terminal", "Browser", "File Manager", "Settings", "Text Editor", "System Monitor"];
const launcher = document.getElementById('launcher');
const launcherInput = document.getElementById('launcher-input');
const launcherResults = document.getElementById('launcher-results');

function updateClock() {
    const now = new Date();
    document.getElementById('clock').textContent = now.toLocaleTimeString();
}
setInterval(updateClock, 1000);
updateClock();

function spawnWindow(title, content) {
    const container = document.getElementById('wm-container');
    
    const win = document.createElement('div');
    win.className = 'window';
    
    const header = document.createElement('div');
    header.className = 'window-header';
    header.textContent = title;
    
    const body = document.createElement('div');
    body.className = 'window-content';
    body.textContent = content;
    
    win.appendChild(header);
    win.appendChild(body);
    container.appendChild(win);
}

spawnWindow("Terminal", "fastfetch");
spawnWindow("Browser", "4chan.org");
spawnWindow("OBS studio", "Record");

function renderLauncherResults(filterText = "") {
    launcherResults.innerHTML = "";
    const filteredApps = apps.filter(app => app.toLowerCase().includes(filterText.toLowerCase()));
    
    filteredApps.forEach(app => {
        const div = document.createElement('div');
        div.className = 'launcher-item';
        div.textContent = app;
        div.addEventListener('click', () => {
            spawnWindow(app, `Launching ${app}...`);
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
        renderLauncherResults();
        setTimeout(() => launcherInput.focus(), 10);
    } else {
        launcher.classList.add('hidden');
    }
}

document.addEventListener('keydown', (e) => {
    if (e.shiftKey && (e.code === 'Space' || e.key === ' ')) {
        e.preventDefault();
        toggleLauncher();
    }
    
    if (e.key === 'Escape' && !launcher.classList.contains('hidden')) {
        toggleLauncher(false);
    }
});

launcherInput.addEventListener('input', (e) => {
    renderLauncherResults(e.target.value);
});