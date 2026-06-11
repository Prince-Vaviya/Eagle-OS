const continueButton = document.querySelector(".continue-button");
const systemClock = document.querySelector("#system-clock");
const widgetTime = document.querySelector("#widget-time");
const widgetDate = document.querySelector("#widget-date");

function updateClock() {
    const now = new Date();
    const time = now.toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit"
    });
    const day = now.toLocaleDateString([], {
        weekday: "long",
        month: "short",
        day: "numeric"
    });

    if (systemClock) {
        systemClock.textContent = time;
        systemClock.dateTime = now.toISOString();
    }

    if (widgetTime) {
        widgetTime.textContent = time;
    }

    if (widgetDate) {
        widgetDate.textContent = day;
    }
}

continueButton?.addEventListener("click", () => {
    document.body.classList.add("is-continuing");
    continueButton.setAttribute("aria-label", "Continuing to Eagle OS");
});

updateClock();
window.setInterval(updateClock, 30000);
