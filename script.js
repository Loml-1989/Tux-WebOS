function updateClock() {
    const now = new Date();
    document.getElementById('clock').textContent = now.toLocaleTimeString();
}
setInterval(updateClock, 1000);
updateClock();

function spawnWindow(title, content) {
    const container = document.getElementById('wm-container')
    const win = document.createElement('div');
    win.className = 'window';
    const header = document.createElement('div');
    header.className = 'window-header';
    header.textContent = title;
    const body = document.createElement('div');
    body.className = 'window-header';
    body.textContent = content;

    win.appendChild(header);
    win.appendChild(body);
    container.appendChild(win);
}

spawnWindow("Terminal", "fastfetch");
spawnWindow("Browser", "Welcome!");
spawnWindow("Obs Studio", "Record");

const apps = ["Terminal", "Browser", "File Manager", "Settings", "Text Editor", "System Monitor"];
const launcher = document.getElementById('launcher');
const launcherInput = document.getElementById('launcher-input');
const launcherResults = document.getElementById('launcher-results');

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

function toggleLauncher(forceState) {
    const isHidden = launcher.classList.contains('hidden');
    const newState = forceState !== undefined ? !forceState : !isHidden;
    
    if (newState) {
        launcher.classList.remove('hidden');
        launcherInput.value = "";
        renderLauncherResults();
        launcherInput.focus();
    } else {
        launcher.classList.add('hidden');
    }
}
document.addEventListener('keydown', (e) => {
    if (e.shiftKey && e.code === 'Space') {
        e.preventDefault();
        toggleLauncher();
    }
    
    if (e.code === 'Escape' && !launcher.classList.contains('hidden')) {
        toggleLauncher(false);
    }
});

launcherInput.addEventListener('input', (e) => {
    renderLauncherResults(e.target.value);
});