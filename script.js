const apps = ["Terminal", "Browser", "File Manager", "Settings", "Text Editor", "System Monitor"];
const launcher = document.getElementById('launcher');
const launcherInput = document.getElementById('launcher-input');
const launcherResults = document.getElementById('launcher-results');
const wmContainer = document.getElementById('wm-container');

const wallpapers = [
    { name: "City", url: "https://w.wallhaven.cc/full/3q/wallhaven-3q3re9.png" },
    { name: "Pixel Art", url: "https://w.wallhaven.cc/full/k8/wallhaven-k8z72q.png" },
    { name: "School Uniform", url: "https://w.wallhaven.cc/full/zp/wallhaven-zp9odw.jpg" },
    { name: "Butterfly", url: "https://w.wallhaven.cc/full/gw/wallhaven-gwdlm7.jpg" }
];

const virtualFS = {
    "home": {
        "stardance": {
            "Documents": {
                "notes.txt": "Project Stardance objectives completed.",
                "todo.md": "- Implement File Manager\n- Check keyboard navigation\n- Sleep"
            },
            "Pictures": {
                "waifu.png": "[Image Data Encrypted]"
            },
            "Downloads": {},
            "readme.txt": "Welcome to the WebOS Virtual File System.\n\nEverything here runs in-memory."
        }
    }
};

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

function buildWelcomeContent() {
    const container = document.createElement('div');
    container.className = 'welcome-container';
    container.innerHTML = `
        <div class="welcome-title">Welcome to Tux WebOS</div>
        <div class="welcome-subtitle">A fully keyboard driven, in browser tiling window manager.</div>
        <div class="shortcut-list">
            <div class="shortcut-item"><span class="shortcut-key">Shift + Space</span><span class="shortcut-desc">Open App Launcher</span></div>
            <div class="shortcut-item"><span class="shortcut-key">Shift + C</span><span class="shortcut-desc">Close Active Window</span></div>
            <div class="shortcut-item"><span class="shortcut-key">Shift + I</span><span class="shortcut-desc">Toggle Fullscreen</span></div>
            <div class="shortcut-item"><span class="shortcut-key">Shift + H / L</span><span class="shortcut-desc">Cycle Active Window</span></div>
            <div class="shortcut-item"><span class="shortcut-key">Escape</span><span class="shortcut-desc">Unfocus Input / Close Launcher</span></div>
        </div>
    `;
    return container;
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

function buildTerminalContent(bodyElement, winElement) {
    const outputDiv = document.createElement('div');
    outputDiv.className = 'terminal-output';
    outputDiv.innerHTML = 'Welcome to WebOS. Type "help" for available commands.\n\n';

    const inputLine = document.createElement('div');
    inputLine.className = 'terminal-input-line';

    const prompt = document.createElement('span');
    prompt.className = 'terminal-prompt';
    prompt.textContent = 'stardance@webos:~$';

    const input = document.createElement('input');
    input.className = 'terminal-input';
    input.type = 'text';
    input.autocomplete = 'off';
    input.spellcheck = false;

    inputLine.appendChild(prompt);
    inputLine.appendChild(input);

    bodyElement.appendChild(outputDiv);
    bodyElement.appendChild(inputLine);

    winElement.addEventListener('click', () => {
        input.focus();
    });

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const cmd = input.value.trim();
            input.value = '';

            if (cmd.toLowerCase() === 'clear') {
                outputDiv.innerHTML = '';
                return;
            }

            const historyLog = document.createElement('div');
            historyLog.textContent = `stardance@webos:~$ ${cmd}`;
            outputDiv.appendChild(historyLog);

            if (cmd) {
                let response = '';
                const args = cmd.split(' ');
                const base = args[0].toLowerCase();

                if (base === 'help') {
                    response = 'Commands:\n  help     - Show this message\n  clear    - Clear terminal output\n  echo     - Print text to screen\n  date     - Show current date and time\n  whoami   - Print current user\n  neofetch - Show system information';
                } else if (base === 'echo') {
                    response = args.slice(1).join(' ');
                } else if (base === 'date') {
                    response = new Date().toString();
                } else if (base === 'whoami') {
                    response = 'stardance';
                } else if (base === 'neofetch') {
                    response = '       /\\        OS: WebOS\n      /  \\       Host: Stardance\n     /____\\      Kernel: 1.0.0-webos\n    /      \\     Uptime: Just booted\n   /        \\    Shell: js-sh\n  /__________\\   WM: flex-wm';
                } else {
                    response = `js-sh: command not found: ${base}`;
                }

                if (response) {
                    const responseLog = document.createElement('div');
                    responseLog.textContent = response;
                    outputDiv.appendChild(responseLog);
                }
            }
            
            bodyElement.scrollTop = bodyElement.scrollHeight;
        }
    });

    setTimeout(() => input.focus(), 50);
}

function buildBrowserContent() {
    const container = document.createElement('div');
    container.className = 'browser-container';

    const nav = document.createElement('div');
    nav.className = 'browser-nav';

    const input = document.createElement('input');
    input.className = 'browser-url';
    input.type = 'text';
    input.value = 'https://wiki.archlinux.org/title/Main_page';

    const goBtn = document.createElement('button');
    goBtn.className = 'browser-btn';
    goBtn.textContent = 'Go';

    const frame = document.createElement('iframe');
    frame.className = 'browser-frame';
    frame.src = input.value;

    function navigate() {
        let url = input.value.trim();
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
            input.value = url;
        }
        frame.src = url;
    }

    goBtn.addEventListener('click', navigate);
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') navigate();
    });

    const warning = document.createElement('div');
    warning.className = 'browser-warning';
    warning.textContent = 'Note: Some sites block embedding. If it refuses to connect, try another URL.';

    nav.appendChild(input);
    nav.appendChild(goBtn);
    
    container.appendChild(nav);
    container.appendChild(warning);
    container.appendChild(frame);

    return container;
}

function buildFileManagerContent() {
    const container = document.createElement('div');
    container.className = 'fm-container';

    const nav = document.createElement('div');
    nav.className = 'fm-nav';

    const upBtn = document.createElement('button');
    upBtn.className = 'fm-up-btn';
    upBtn.textContent = '↑ Up';

    const pathDisplay = document.createElement('div');
    pathDisplay.className = 'fm-path';

    nav.appendChild(upBtn);
    nav.appendChild(pathDisplay);

    const grid = document.createElement('div');
    grid.className = 'fm-grid';

    container.appendChild(nav);
    container.appendChild(grid);

    let currentPath = ['home', 'stardance'];

    function getDir(pathArray) {
        let current = virtualFS;
        for (const segment of pathArray) {
            if (current[segment]) {
                current = current[segment];
            } else {
                return null;
            }
        }
        return current;
    }

    function renderGrid() {
        grid.innerHTML = '';
        pathDisplay.textContent = '/' + currentPath.join('/');
        
        const currentDir = getDir(currentPath);
        if (!currentDir) return;

        const entries = Object.entries(currentDir);
        
        entries.forEach(([name, content]) => {
            const isDir = typeof content === 'object';
            
            const item = document.createElement('div');
            item.className = 'fm-item';
            
            const icon = document.createElement('div');
            icon.className = 'fm-icon';
            icon.textContent = isDir ? '📁' : '📄';
            
            const label = document.createElement('div');
            label.className = 'fm-name';
            label.textContent = name;
            
            item.addEventListener('click', () => {
                if (isDir) {
                    currentPath.push(name);
                    renderGrid();
                } else {
                    spawnWindow('Text Editor', { path: [...currentPath], name: name, content: content });
                }
            });
            
            item.appendChild(icon);
            item.appendChild(label);
            grid.appendChild(item);
        });
    }

    upBtn.addEventListener('click', () => {
        if (currentPath.length > 1) {
            currentPath.pop();
            renderGrid();
        }
    });

    renderGrid();
    return container;
}

function buildTextEditorContent(fileData) {
    const container = document.createElement('div');
    container.className = 'editor-container';

    const toolbar = document.createElement('div');
    toolbar.className = 'editor-toolbar';

    const saveBtn = document.createElement('button');
    saveBtn.className = 'editor-btn';
    saveBtn.textContent = 'Save';

    const info = document.createElement('span');
    info.className = 'editor-info';

    const isFile = typeof fileData === 'object' && fileData !== null;
    let textContent = isFile ? fileData.content : (fileData || '');
    if (textContent.startsWith('Session loaded')) {
        textContent = '';
    }

    info.textContent = isFile ? fileData.name : 'scratchpad.txt';

    const textarea = document.createElement('textarea');
    textarea.className = 'editor-textarea';
    textarea.value = textContent;
    textarea.spellcheck = false;

    saveBtn.addEventListener('click', () => {
        if (isFile) {
            let current = virtualFS;
            for (const segment of fileData.path) {
                current = current[segment];
            }
            current[fileData.name] = textarea.value;
            saveBtn.textContent = 'Saved!';
            setTimeout(() => saveBtn.textContent = 'Save', 2000);
        } else {
            saveBtn.textContent = 'Scratchpad';
            setTimeout(() => saveBtn.textContent = 'Save', 2000);
        }
    });

    toolbar.appendChild(saveBtn);
    toolbar.appendChild(info);
    
    container.appendChild(toolbar);
    container.appendChild(textarea);

    setTimeout(() => textarea.focus(), 50);

    return container;
}

function buildSystemMonitorContent() {
    const container = document.createElement('div');
    container.className = 'sysmon-container';

    const osCores = navigator.hardwareConcurrency || 4;
    const osMem = navigator.deviceMemory || 8;
    const userAgentStr = navigator.userAgent.split(' ')[0] || "WebOS_Kernel/1.0";

    container.innerHTML = `
        <div class="sysmon-header">System Information</div>
        <div class="sysmon-row"><span>OS Architecture</span><span>${userAgentStr}</span></div>
        <div class="sysmon-row"><span>Logical Cores</span><span>${osCores} Threads</span></div>
        <div class="sysmon-row"><span>Total Memory</span><span>~${osMem}.0 GB RAM</span></div>
        
        <div class="sysmon-header">Hardware Utilization</div>
        <div class="sysmon-row">
            <span>CPU Load</span>
            <span id="sm-cpu-text">0%</span>
        </div>
        <div class="sysmon-bar-bg"><div class="sysmon-bar-fill" id="sm-cpu-bar" style="width: 0%;"></div></div>
        
        <div class="sysmon-row" style="margin-top: 10px;">
            <span>Memory Allocation</span>
            <span id="sm-ram-text">0%</span>
        </div>
        <div class="sysmon-bar-bg"><div class="sysmon-bar-fill" id="sm-ram-bar" style="width: 0%;"></div></div>

        <div class="sysmon-header">Active Tasks</div>
        <div class="sysmon-process-list" id="sm-process-list"></div>
    `;

    const cpuText = container.querySelector('#sm-cpu-text');
    const cpuBar = container.querySelector('#sm-cpu-bar');
    const ramText = container.querySelector('#sm-ram-text');
    const ramBar = container.querySelector('#sm-ram-bar');
    const processList = container.querySelector('#sm-process-list');

    let baseRam = Math.floor(Math.random() * 20) + 30;

    const monitorInterval = setInterval(() => {
        if (!document.body.contains(container)) {
            clearInterval(monitorInterval);
            return;
        }

        const currentCpu = Math.floor(Math.random() * 35) + 5;
        cpuText.textContent = `${currentCpu}%`;
        cpuBar.style.width = `${currentCpu}%`;
        cpuBar.style.backgroundColor = currentCpu > 30 ? '#f38ba8' : '#a6e3a1';

        const ramFluctuation = Math.floor(Math.random() * 5) - 2;
        baseRam = Math.max(15, Math.min(85, baseRam + ramFluctuation));
        ramText.textContent = `${baseRam}%`;
        ramBar.style.width = `${baseRam}%`;
        ramBar.style.backgroundColor = baseRam > 70 ? '#f38ba8' : '#a6e3a1';

        processList.innerHTML = '';
        const activeWindows = wmContainer.querySelectorAll('.window');
        
        activeWindows.forEach((win, index) => {
            const titleElement = win.querySelector('strong');
            const titleStr = titleElement ? titleElement.textContent.replace(/\[\vert{}\]/g, '').trim() : 'Unknown Process';
            
            const pRow = document.createElement('div');
            pRow.className = 'sysmon-process';
            
            const pName = document.createElement('span');
            pName.textContent = titleStr;
            
            const pId = document.createElement('span');
            pId.textContent = `PID ${1042 + index}`;
            pId.style.color = '#a6adc8';
            
            pRow.appendChild(pName);
            pRow.appendChild(pId);
            processList.appendChild(pRow);
        });

    }, 1500);

    return container;
}

function spawnWindow(title, content) {
    const win = document.createElement('div');
    win.className = 'window';
    
    const body = document.createElement('div');
    body.className = 'window-content';

    const windowTitle = document.createElement('div');
    windowTitle.innerHTML = `<strong>[ ${title} ]</strong><br><br>`;
    body.appendChild(windowTitle);

    if (title === 'Welcome') {
        body.appendChild(buildWelcomeContent());
    } else if (title === 'Settings') {
        body.appendChild(buildSettingsContent());
    } else if (title === 'Terminal') {
        buildTerminalContent(body, win);
    } else if (title === 'Browser') {
        body.appendChild(buildBrowserContent());
    } else if (title === 'File Manager') {
        body.appendChild(buildFileManagerContent());
    } else if (title === 'Text Editor') {
        body.appendChild(buildTextEditorContent(content));
    } else if (title === 'System Monitor') {
        body.appendChild(buildSystemMonitorContent());
    } else {
        const textNode = document.createElement('div');
        textNode.innerHTML = content;
        body.appendChild(textNode);
    }
    
    win.appendChild(body);
    win.addEventListener('mousedown', () => setActiveWindow(win));
    
    wmContainer.appendChild(win);
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

    const activeTag = document.activeElement ? document.activeElement.tagName : '';
    const isTyping = activeTag === 'INPUT' || activeTag === 'TEXTAREA';

    if (e.key === 'Escape' && isTyping) {
        document.activeElement.blur();
        return;
    }

    if (isTyping) {
        return;
    }

    if (e.shiftKey && (e.code === 'Space' || e.key === ' ')) {
        e.preventDefault();
        toggleLauncher();
        return;
    }

    const shiftHeld = e.shiftKey || e.getModifierState('CapsLock');

    if (shiftHeld && (e.code === 'KeyC' || e.key.toLowerCase() === 'c')) {
        e.preventDefault();
        if (activeWindow) {
            const nextWindow = activeWindow.nextElementSibling || activeWindow.previousElementSibling;
            wmContainer.removeChild(activeWindow);
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

spawnWindow("Welcome", "");