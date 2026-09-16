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