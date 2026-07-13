const terminal = document.getElementById("terminal");
const loginOverlay = document.getElementById("login-overlay");
const nameInput = document.getElementById("name-input");
const startBtn = document.getElementById("start-btn");
const logoContainer = document.getElementById("logo-container");
const loginBox = document.getElementById("login-box");

// Desktop elements
const desktop = document.getElementById("desktop");
const terminalWindow = document.getElementById("terminal-window");
const dockTerminal = document.getElementById("dock-terminal");
const closeTerminal = document.getElementById("close-terminal");
const clock = document.getElementById("clock");
const terminalInput = document.getElementById("terminal-input");

let currentPrompt = "";

// Real-time clock update
function updateClock() {
    const now = new Date();
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const day = days[now.getDay()];
    const month = months[now.getMonth()];
    const date = now.getDate();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    clock.innerText = `${day} ${date} ${month} ${hours}:${minutes} ${ampm}`;
}
setInterval(updateClock, 1000);
updateClock();

// Handle initial boot sequence
window.addEventListener("DOMContentLoaded", () => {
    const savedUsername = localStorage.getItem("eagle_os_username");

    if (savedUsername) {
        // Returning user: skip boot animation and login
        logoContainer.style.display = "none";
        nameInput.value = savedUsername;
        startOS();
    } else {
        // First time user: show boot animation
        const bootStatus = document.getElementById("boot-status");
        let dots = 0;
        const dotInterval = setInterval(() => {
            dots = (dots + 1) % 4;
            bootStatus.innerText = "Booting up" + ".".repeat(dots);
        }, 161);

        setTimeout(() => {
            clearInterval(dotInterval);
            logoContainer.style.display = "none";
            loginBox.style.display = "flex";
            nameInput.focus();
        }, 5100);
    }
});

let boot = "";
let i = 0;
let terminalBooted = false;

function type() {
    if (i < boot.length) {
        terminal.innerHTML = boot.substring(0, i) + '<span class="cursor">█</span>';
        terminal.scrollTop = terminal.scrollHeight;
        i += 3; // Print characters fast
        setTimeout(type, 1);
    } else {
        let username = localStorage.getItem("eagle_os_username") || "Guest";
        let lowercaseName = username.toLowerCase().replace(/\s+/g, '_');
        currentPrompt = `eagle@${lowercaseName}:~$ `;
        
        boot += currentPrompt;
        terminal.innerHTML = boot + '<span class="cursor">█</span>';
        initInteractiveTerminal();
    }
}

function initInteractiveTerminal() {
    terminalInput.focus();

    terminalWindow.addEventListener("click", () => {
        terminalInput.focus();
    });

    terminalInput.addEventListener("input", () => {
        terminal.innerHTML = boot + terminalInput.value + '<span class="cursor">█</span>';
        terminal.scrollTop = terminal.scrollHeight;
    });

    terminalInput.addEventListener("keydown", function(e) {
        if (e.key === "Enter") {
            const command = terminalInput.value.trim();
            
            boot += terminalInput.value + "\n";
            processCommand(command);
            
            boot += currentPrompt;
            terminal.innerHTML = boot + '<span class="cursor">█</span>';
            terminal.scrollTop = terminal.scrollHeight;
            
            terminalInput.value = "";
        }
    });
}

function processCommand(cmd) {
    if (!cmd) return;

    const args = cmd.split(" ");
    const baseCmd = args[0].toLowerCase();

    switch(baseCmd) {
        case "help":
            boot += "Available commands:\n";
            boot += "  help     - Show this help message\n";
            boot += "  clear    - Clear the terminal screen\n";
            boot += "  date     - Show current system date and time\n";
            boot += "  whoami   - Print current user\n";
            boot += "  echo     - Repeat text back to the terminal\n";
            break;
        case "clear":
            boot = ""; 
            break;
        case "date":
            boot += new Date().toString() + "\n";
            break;
        case "whoami":
            let username = localStorage.getItem("eagle_os_username") || "Guest";
            let lowercaseName = username.toLowerCase().replace(/\s+/g, '_');
            boot += lowercaseName + "\n";
            break;
        case "echo":
            boot += args.slice(1).join(" ") + "\n";
            break;
        default:
            boot += `Command not found: ${baseCmd}\n`;
            break;
    }
}

function startOS() {
    let rawName = nameInput.value.trim();
    if (!rawName) rawName = "Guest";

    // Save to local storage
    localStorage.setItem("eagle_os_username", rawName);

    let username = rawName.substring(0, 20);
    let paddedUsername = username.padEnd(65, " ");
    let lowercaseName = username.toLowerCase().replace(/\s+/g, '_');

    boot = `┌──────────────────────────────────────────────────────────────────────────────┐
│ Eagle OS v0.1-dev                                              arm64         │
├──────────────────────────────────────────────────────────────────────────────┤
│ User      : ${paddedUsername}│
│ Host      : eagle                                                            │
│ Kernel    : Eagle Kernel                                                     │
│ AI Engine : Eagle-X                                                          │
│ Security  : ● ACTIVE                                                         │
│ Firewall  : ● ENABLED                                                        │
│ Network   : ● CONNECTED                                                      │
│ Status    : READY                                                            │
└──────────────────────────────────────────────────────────────────────────────┘

███████╗ █████╗  ██████╗ ██╗     ███████╗
██╔════╝██╔══██╗██╔════╝ ██║     ██╔════╝
█████╗  ███████║██║  ███╗██║     █████╗
██╔══╝  ██╔══██║██║   ██║██║     ██╔══╝
███████╗██║  ██║╚██████╔╝███████╗███████╗
╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚══════╝

Booting Eagle Operating System...
Initializing AI Engine...
Loading Portfolio Modules...
Starting Services...
Authentication Successful.

`;

    loginOverlay.style.opacity = '0';
    setTimeout(() => {
        loginOverlay.style.display = 'none';
        desktop.style.display = 'block'; // Show desktop
    }, 100);
}

// Event Listeners
startBtn.addEventListener("click", startOS);
nameInput.addEventListener("keypress", function (e) {
    if (e.key === 'Enter') {
        startOS();
    }
});

dockTerminal.addEventListener("click", () => {
    terminalWindow.style.display = "block";

    // Trigger pop-in animation
    terminalWindow.classList.remove("show-modal");
    void terminalWindow.offsetWidth; // force reflow
    terminalWindow.classList.add("show-modal");

    if (!terminalBooted) {
        terminalBooted = true;
        // Wait 500ms for modal to appear before starting terminal animation
        setTimeout(() => {
            type();
        }, 600);
    }
});

closeTerminal.addEventListener("click", () => {
    terminalWindow.style.display = "none";
    terminalWindow.classList.remove("show-modal");
});

// Initialize Icons
lucide.createIcons();