const apps = ["Terminal", "Browser", "File Manager", "Settings", "Text Editor", "System Monitor"];
const launcher = document.getElementById('launcher');
const launcherInput = document.getElementById('launcher-input');
const launcherResults = document.getElementById('launcher-results');
const container = document.getElementById('wm-container');

const wallpapers = [
    { name: "City", url: "https://w.wallhaven.cc/full/3q/wallhaven-3q3re9.png" },
    { name: "Pixel Art", url: "https://w.wallhaven.cc/full/k8/wallhaven-k8z72q.png" },
    { name: "School Uniform", url: "https://w.wallhaven.cc/full/zp/wallhaven-zp9odw.jpg" },
    { name: "Butterfly", url: "https://w.wallhaven.cc/full/gw/wallhaven-gwdlm7.jpg" }
];

let activeWindow = null;
let selectedLauncherIndex = 0;

function setWallpaper(url) {
    document.body.style.backgroundImage = `radial-gradient(ellipse at center, rgba(30, 30, 46, 0.45) 0%, rgba(17, 17, 27, 0.85) 100%), url('${url}')`;
}

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

function buildSettingsContent() {
    const wrapper = document.createElement('div');
    wrapper.className = 'settings-container';

    const title = document.createElement('div');
    title.className = 'settings-section-title';
    title.textContent = 'Desktop Wallpapers';

    const grid = document.createElement('div');
    grid.className = 'wallpaper-grid';

    wallpapers.forEach(wp => {
        const card = document.createElement('div');
        card.className = 'wallpaper-card';
        card.style.backgroundImage = `url('${wp.url}')`;

        const label = document.createElement('span');
        label.textContent = wp.name;

        card.appendChild(label);
        card.addEventListener('click', () => setWallpaper(wp.url));
        grid.appendChild(card);
    });

    const customTitle = document.createElement('div');
    customTitle.className = 'settings-section-title';
    customTitle.textContent = 'Custom Wallpaper URL';

    const customBox = document.createElement('div');
    customBox.className = 'custom-url-box';

    const urlInput = document.createElement('input');
    urlInput.className = 'custom-url-input';
    urlInput.placeholder = 'Paste image link here...';

    const applyBtn = document.createElement('button');
    applyBtn.className = 'custom-url-btn';
    applyBtn.textContent = 'Apply';
    applyBtn.addEventListener('click', () => {
        if (urlInput.value.trim() !== '') {
            setWallpaper(urlInput.value.trim());
        }
    });

    customBox.appendChild(urlInput);
    customBox.appendChild(applyBtn);

    wrapper.appendChild(title);
    wrapper.appendChild(grid);
    wrapper.appendChild(customTitle);
    wrapper.appendChild(customBox);

    return wrapper;
}

function spawnWindow(title, content) {
    const win = document.createElement('div');
    win.className = 'window';
    
    const body = document.createElement('div');
    body.className = 'window-content';

    const windowTitle = document.createElement('div');
    windowTitle.innerHTML = `<strong>[ ${title} ]</strong><br><br>`;
    body.appendChild(windowTitle);

    if (title === 'Settings') {
        body.appendChild(buildSettingsContent());
    } else {
        const textNode = document.createElement('div');
        textNode.innerHTML = content;
        body.appendChild(textNode);
    }
    
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

    if (e.shiftKey && (e.code === 'KeyC' || e.key.toLowerCase() === 'c')) {
        e.preventDefault();
        if (activeWindow) {
            const nextWindow = activeWindow.nextElementSibling || activeWindow.previousElementSibling;
            container.removeChild(activeWindow);
            setActiveWindow(nextWindow);
        }
    }

    if (e.shiftKey && (e.code === 'KeyI' || e.key.toLowerCase() === 'i')) {
        e.preventDefault();
        if (activeWindow) {
            activeWindow.classList.toggle('fullscreen');
            setTimeout(() => {
                activeWindow.scrollIntoView({ behavior: 'smooth', inline: 'center' });
            }, 50);
        }
    }

    if (e.shiftKey && (e.code === 'KeyH' || e.key.toLowerCase() === 'h')) {
        e.preventDefault();
        if (activeWindow && activeWindow.previousElementSibling) {
            setActiveWindow(activeWindow.previousElementSibling);
        }
    }

    if (e.shiftKey && (e.code === 'KeyL' || e.key.toLowerCase() === 'l')) {
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
spawnWindow("Settings", "");