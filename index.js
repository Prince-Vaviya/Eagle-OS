const terminal = document.getElementById("terminal");

// Desktop elements
const desktop = document.getElementById("desktop");
const terminalWindow = document.getElementById("terminal-window");
const dockTerminal = document.getElementById("dock-terminal");
const closeTerminal = document.getElementById("close-terminal");
const clock = document.getElementById("clock");
const terminalInput = document.getElementById("terminal-input");

const finderWindow = document.getElementById("finder-window");
const dockFinder = document.getElementById("dock-finder");
const closeFinder = document.getElementById("close-finder");

const calculatorWindow = document.getElementById("calculator-window");
const dockCalculator = document.getElementById("calculator");
const closeCalculator = document.getElementById("close-calculator");
const calcDisplay = document.getElementById("calc-display");
const calcButtons = document.querySelectorAll(".calc-btn");

const calendarWindow = document.getElementById("calendar-window");
const dockCalendar = document.getElementById("calendar");
const closeCalendar = document.getElementById("close-calendar");
const calDay = document.getElementById("cal-day");
const calDate = document.getElementById("cal-date");
const calWish = document.getElementById("cal-wish");

const notesWindow = document.getElementById("notes-window");
const dockNotes = document.getElementById("notes");
const closeNotes = document.getElementById("close-notes");
const notesTextarea = document.getElementById("notes-textarea");

const playerWindow = document.getElementById("player-window");
const dockPlayer = document.getElementById("player");
const closePlayer = document.getElementById("close-player");
const playBtn = document.getElementById("play-btn");
const bgAudio = document.getElementById("bg-audio");

const dailyWishes = [
    "Rest and recharge. Wishing you a beautifully peaceful Sunday!",
    "Embrace the fresh start of a new week. You've got this!",
    "Keep up the momentum! May your Tuesday be highly productive.",
    "Happy Hump Day! You're halfway through, keep shining.",
    "Almost there! May your Thursday bring you inspiration and joy.",
    "Happy Friday! Finish strong and get ready for a wonderful weekend.",
    "It's Saturday! Take time to do what makes your soul happy."
];

let currentPrompt = "";
let topZIndex = 10;

function bringToFront(windowElement) {
    topZIndex++;
    windowElement.style.zIndex = topZIndex;
}

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

let currentUsername = "guest";
let paddedUsername = "guest".padEnd(65, " ");

let boot = `┌──────────────────────────────────────────────────────────────────────────────┐
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

let i = 0;
let terminalBooted = false;

function type() {
    if (i < boot.length) {
        terminal.innerHTML = boot.substring(0, i) + '<span class="cursor">█</span>';
        terminal.scrollTop = terminal.scrollHeight;
        i += 3; // Print characters fast
        setTimeout(type, 1);
    } else {
        currentPrompt = `eagle@guest:~$ `;
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
            boot += "guest\n";
            break;
        case "echo":
            boot += args.slice(1).join(" ") + "\n";
            break;
        default:
            boot += `Command not found: ${baseCmd}\n`;
            break;
    }
}

// Calculator Logic
let calcCurrentValue = "0";
let calcPreviousValue = null;
let calcOperator = null;
let calcWaitingForNewValue = false;

function updateCalcDisplay() {
    let displayVal = calcCurrentValue;
    if (displayVal.length > 9) {
        displayVal = parseFloat(calcCurrentValue).toPrecision(9).replace(/\.?0+$/, "");
    }
    calcDisplay.innerText = displayVal;
    
    const clearBtn = document.getElementById("calc-clear");
    if (calcCurrentValue !== "0" || calcPreviousValue !== null) {
        clearBtn.innerText = "C";
    } else {
        clearBtn.innerText = "AC";
    }
}

calcButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        const action = btn.dataset.action;
        const val = btn.dataset.val;

        if (action === "number") {
            if (calcWaitingForNewValue) {
                calcCurrentValue = val;
                calcWaitingForNewValue = false;
            } else {
                calcCurrentValue = calcCurrentValue === "0" ? val : calcCurrentValue + val;
            }
            updateCalcDisplay();
        } 
        else if (action === "decimal") {
            if (calcWaitingForNewValue) {
                calcCurrentValue = "0.";
                calcWaitingForNewValue = false;
            } else if (!calcCurrentValue.includes(".")) {
                calcCurrentValue += ".";
            }
            updateCalcDisplay();
        }
        else if (action === "clear") {
            if (calcCurrentValue !== "0") {
                calcCurrentValue = "0";
            } else {
                calcPreviousValue = null;
                calcOperator = null;
            }
            calcWaitingForNewValue = false;
            updateCalcDisplay();
        }
        else if (action === "toggle-sign") {
            calcCurrentValue = (parseFloat(calcCurrentValue) * -1).toString();
            updateCalcDisplay();
        }
        else if (action === "percent") {
            calcCurrentValue = (parseFloat(calcCurrentValue) / 100).toString();
            updateCalcDisplay();
        }
        else if (action === "operator") {
            handleOperator(val);
        }
        else if (action === "calculate") {
            handleOperator(null);
        }
    });
});

function handleOperator(nextOperator) {
    const inputValue = parseFloat(calcCurrentValue);

    if (calcOperator && calcWaitingForNewValue) {
        calcOperator = nextOperator;
        return;
    }

    if (calcPreviousValue == null) {
        calcPreviousValue = inputValue;
    } else if (calcOperator) {
        const result = calculate(calcPreviousValue, inputValue, calcOperator);
        calcCurrentValue = String(result);
        calcPreviousValue = result;
        updateCalcDisplay();
    }

    calcWaitingForNewValue = true;
    calcOperator = nextOperator;
}

function calculate(first, second, operator) {
    if (operator === "+") return first + second;
    if (operator === "-") return first - second;
    if (operator === "*") return first * second;
    if (operator === "/") return first / second;
    return second;
}

// Event Listeners
dockTerminal.addEventListener("click", () => {
    terminalWindow.style.display = "block";
    
    // Trigger pop-in animation
    terminalWindow.classList.remove("show-modal");
    void terminalWindow.offsetWidth; // force reflow
    terminalWindow.classList.add("show-modal");
    
    bringToFront(terminalWindow);

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

dockCalculator.addEventListener("click", () => {
    calculatorWindow.style.display = "block";
    calculatorWindow.classList.remove("show-modal");
    void calculatorWindow.offsetWidth; 
    calculatorWindow.classList.add("show-modal");
    
    bringToFront(calculatorWindow);
});

closeCalculator.addEventListener("click", () => {
    calculatorWindow.style.display = "none";
    calculatorWindow.classList.remove("show-modal");
});

// Calendar Logic
function updateCalendar() {
    const now = new Date();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    calDay.innerText = days[now.getDay()];
    calDate.innerText = `${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;
    calWish.innerText = dailyWishes[now.getDay()];
}

dockCalendar.addEventListener("click", () => {
    updateCalendar();
    calendarWindow.style.display = "block";
    calendarWindow.classList.remove("show-modal");
    void calendarWindow.offsetWidth; 
    calendarWindow.classList.add("show-modal");
    
    bringToFront(calendarWindow);
});

closeCalendar.addEventListener("click", () => {
    calendarWindow.style.display = "none";
    calendarWindow.classList.remove("show-modal");
});

// Notes Logic
const savedNotes = localStorage.getItem("eagle_os_notes");
if (savedNotes) {
    notesTextarea.value = savedNotes;
}
notesTextarea.addEventListener("input", () => {
    localStorage.setItem("eagle_os_notes", notesTextarea.value);
});

// Player Logic
let isPlaying = false;
playBtn.addEventListener("click", () => {
    isPlaying = !isPlaying;
    if (isPlaying) {
        playBtn.innerText = "⏸";
        playBtn.classList.add("playing");
        bgAudio.play();
    } else {
        playBtn.innerText = "▶";
        playBtn.classList.remove("playing");
        bgAudio.pause();
    }
});

// Finder App Toggles & Sidebar Tabs
dockFinder.addEventListener("click", () => {
    finderWindow.style.display = "block";
    finderWindow.classList.remove("show-modal");
    void finderWindow.offsetWidth; 
    finderWindow.classList.add("show-modal");
    bringToFront(finderWindow);
});
closeFinder.addEventListener("click", () => {
    finderWindow.style.display = "none";
});

const finderSidebarItems = document.querySelectorAll(".finder-sidebar .sidebar-item");
const finderTabPanes = document.querySelectorAll(".finder-tab-pane");

finderSidebarItems.forEach(item => {
    item.addEventListener("click", () => {
        const tab = item.dataset.tab;
        finderSidebarItems.forEach(i => i.classList.remove("active"));
        item.classList.add("active");

        finderTabPanes.forEach(pane => {
            pane.style.display = "none";
            pane.classList.remove("active");
        });

        const targetPane = document.getElementById(`finder-tab-${tab}`);
        if (targetPane) {
            targetPane.style.display = "flex";
            targetPane.classList.add("active");
        }
    });
});

// New App Toggles
dockNotes.addEventListener("click", () => {
    notesWindow.style.display = "block";
    notesWindow.classList.remove("show-modal");
    void notesWindow.offsetWidth; 
    notesWindow.classList.add("show-modal");
    bringToFront(notesWindow);
});
closeNotes.addEventListener("click", () => {
    notesWindow.style.display = "none";
});

dockPlayer.addEventListener("click", () => {
    playerWindow.style.display = "block";
    playerWindow.classList.remove("show-modal");
    void playerWindow.offsetWidth; 
    playerWindow.classList.add("show-modal");
    bringToFront(playerWindow);
});
closePlayer.addEventListener("click", () => {
    playerWindow.style.display = "none";
});

// Bring to front on click anywhere inside the window
finderWindow.addEventListener("mousedown", () => bringToFront(finderWindow));
terminalWindow.addEventListener("mousedown", () => bringToFront(terminalWindow));
calculatorWindow.addEventListener("mousedown", () => bringToFront(calculatorWindow));
calendarWindow.addEventListener("mousedown", () => bringToFront(calendarWindow));
notesWindow.addEventListener("mousedown", () => bringToFront(notesWindow));
playerWindow.addEventListener("mousedown", () => bringToFront(playerWindow));

// Draggable Windows Logic
function makeDraggable(element, handle) {
    let isDragging = false;
    let startX, startY;

    handle.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        document.body.style.userSelect = 'none'; 
        handle.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        const dx = e.clientX - startX;
        const dy = e.clientY - startY;

        startX = e.clientX;
        startY = e.clientY;

        const style = window.getComputedStyle(element);
        const top = parseFloat(style.top);
        const left = parseFloat(style.left);

        element.style.top = (top + dy) + 'px';
        element.style.left = (left + dx) + 'px';
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        document.body.style.userSelect = '';
        handle.style.cursor = 'grab';
    });
}

const finderTitlebar = finderWindow.querySelector('.titlebar');
makeDraggable(finderWindow, finderTitlebar);

const terminalTitlebar = terminalWindow.querySelector('.titlebar');
makeDraggable(terminalWindow, terminalTitlebar);

const calculatorTitlebar = calculatorWindow.querySelector('.titlebar');
makeDraggable(calculatorWindow, calculatorTitlebar);

const calendarTitlebar = calendarWindow.querySelector('.titlebar');
makeDraggable(calendarWindow, calendarTitlebar);

const notesTitlebar = notesWindow.querySelector('.titlebar');
makeDraggable(notesWindow, notesTitlebar);

const playerTitlebar = playerWindow.querySelector('.titlebar');
makeDraggable(playerWindow, playerTitlebar);

// Desktop Wallpaper Guide Interactions
const desktopGuide = document.getElementById("desktop-guide");
const closeGuideBtn = document.getElementById("close-guide-btn");
const guideToggleBtn = document.getElementById("guide-toggle-btn");

if (closeGuideBtn && desktopGuide && guideToggleBtn) {
    closeGuideBtn.addEventListener("click", () => {
        desktopGuide.style.display = "none";
        guideToggleBtn.style.display = "block";
    });

    guideToggleBtn.addEventListener("click", () => {
        desktopGuide.style.display = "block";
        guideToggleBtn.style.display = "none";
    });
}

// Click guide cards to launch respective apps
const guideCardTerminal = document.getElementById("guide-app-terminal");
if (guideCardTerminal) guideCardTerminal.addEventListener("click", () => dockTerminal && dockTerminal.click());

const guideCardPlayer = document.getElementById("guide-app-player");
if (guideCardPlayer) guideCardPlayer.addEventListener("click", () => dockPlayer && dockPlayer.click());

const guideCardNotes = document.getElementById("guide-app-notes");
if (guideCardNotes) guideCardNotes.addEventListener("click", () => dockNotes && dockNotes.click());

const guideCardCalendar = document.getElementById("guide-app-calendar");
if (guideCardCalendar) guideCardCalendar.addEventListener("click", () => dockCalendar && dockCalendar.click());

const guideCardCalculator = document.getElementById("guide-app-calculator");
if (guideCardCalculator) guideCardCalculator.addEventListener("click", () => dockCalculator && dockCalculator.click());

// Initialize Icons
lucide.createIcons();