let allEvents = [];
let notifiedEvents = []; // Using a basic array instead of Set

// Load events on initial page load if we are on the Home page or Past Events page
document.addEventListener('DOMContentLoaded', () => {
    // Run the intro wipe animation if the overlay exists
    if (document.getElementById("wipe-overlay")) {
        runPixelWipe();
    }

    let list = document.getElementById("eventList");
    let pastList = document.getElementById("pastEventList");
    if (list !== null || pastList !== null) {
        loadEvents();
        // Start checking for reminders every 10 seconds
        setInterval(checkReminders, 10000); 
    }
});

function checkReminders() {
    let now = new Date();
    allEvents.forEach(event => {
        let eventTime = new Date(`${event.date}T${event.time}`);
        
        // Check if event time has just passed and we haven't alerted yet
        if (eventTime <= now && !notifiedEvents.includes(event.id)) {
            let diffMs = now - eventTime;
            
            // Only alert if the event started within the last 2 minutes (120,000 ms)
            // This prevents alerting for events that happened days ago
            if (diffMs >= 0 && diffMs < 120000) { 
                alert(`⏰ REMINDER: "${event.title}" is happening right now!`);
            }
            
            // Mark as notified so we don't spam the user
            notifiedEvents.push(event.id);
        }
    });
}

async function addEvent(event) {
    let titleInput = document.getElementById("title");
    let dateInput = document.getElementById("date");
    let timeInput = document.getElementById("time");

    let title = titleInput.value;
    let date = dateInput.value;
    let time = timeInput.value;

    if (title === "" || date === "" || time === "") {
        alert("Please fill out all fields");
        return;
    }

    let eventData = {
        title: title,
        date: date,
        time: time
    };

    try {
        let response = await fetch(`${API_BASE_URL}/add-event`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(eventData)
        });

        if (response.status === 400) {
            let errorData = await response.json();
            alert(errorData.error);
            return;
        }

        let data = await response.json();

        // Clear inputs
        titleInput.value = "";
        dateInput.value = "";
        timeInput.value = "";

        alert("Event added successfully!");

        // Redirect to Home page
        window.location.href = "index.html";
    } catch (error) {
        console.log("Fetch error: ", error);
        alert("Failed to connect to server");
    }
}

async function loadEvents() {
    let list = document.getElementById("eventList");
    let pastList = document.getElementById("pastEventList");

    try {
        let response = await fetch(`${API_BASE_URL}/get-events`);
        let data = await response.json();

        if (list) list.innerHTML = "";
        if (pastList) pastList.innerHTML = "";

        let now = new Date();
        let upcoming = [];
        let past = [];
        
        // Store events globally for the reminder checker
        allEvents = data;

        let countEl = document.getElementById("eventCount");
        if (countEl) {
            countEl.innerText = "Total Events: " + data.length;
        }

        data.forEach(event => {
            let eventDateTime = new Date(`${event.date}T${event.time}`);
            if (eventDateTime >= now) {
                upcoming.push(event);
            } else {
                past.push(event);
            }
        });

        if (list) {
            if (upcoming.length === 0) {
                list.innerHTML = "<p style='color: var(--text-muted)'>No upcoming events.</p>";
            } else {
                upcoming.forEach(event => list.appendChild(createEventElement(event, false)));
            }
        }

        if (pastList) {
            if (past.length === 0) {
                pastList.innerHTML = "<p style='color: var(--text-muted)'>No past events.</p>";
            } else {
                past.forEach(event => pastList.appendChild(createEventElement(event, true)));
            }
        }
    } catch (error) {
        console.log("Fetch error: ", error);
    }
}

function createEventElement(event, isPast) {
    let li = document.createElement("li");
    if (isPast) li.className = "past-event";

    // Parse date for calendar badge
    let dateObj = new Date(event.date);
    let month = dateObj.toLocaleString('default', { month: 'short' });
    let day = dateObj.getDate();
    // Handle invalid dates gracefully
    if (isNaN(day)) {
        month = "TBD";
        day = "-";
    }

    let detailsDiv = document.createElement("div");
    detailsDiv.className = "event-details";

    let dateBadge = document.createElement("div");
    dateBadge.className = "event-date-badge";
    dateBadge.innerHTML = `<div class="event-date-month">${month}</div><div class="event-date-day">${day}</div>`;

    let infoDiv = document.createElement("div");
    infoDiv.className = "event-info";

    let titleSpan = document.createElement("div");
    titleSpan.className = "event-title";
    titleSpan.innerText = event.title;

    let timeSpan = document.createElement("div");
    timeSpan.className = "event-time";
    timeSpan.innerText = "🕒 " + event.time;

    infoDiv.appendChild(titleSpan);
    infoDiv.appendChild(timeSpan);

    detailsDiv.appendChild(dateBadge);
    detailsDiv.appendChild(infoDiv);

    let deleteBtn = document.createElement("button");
    deleteBtn.className = "btn-delete";
    deleteBtn.innerText = "❌";
    deleteBtn.onclick = () => {
        deleteEvent(event.id);
    };

    li.appendChild(detailsDiv);
    li.appendChild(deleteBtn);

    return li;
}

async function deleteEvent(eventId) {
    try {
        let response = await fetch(`${API_BASE_URL}/delete-event/${eventId}`, {
            method: "DELETE"
        });

        let data = await response.json();
        loadEvents();
    } catch (error) {
        console.log("Delete error: ", error);
        alert("Failed to delete event");
    }
}

// --- Pixelate Wipe Animation ---
function runPixelWipe() {
    const overlay = document.getElementById("wipe-overlay");
    const grid = document.getElementById("wipe-grid");
    const sceneA = document.getElementById("wipe-scene-a");
    if (!overlay || !grid || !sceneA) return;

    const cellSize = 60; // Approximate size of each pixel block
    const cols = Math.ceil(window.innerWidth / cellSize);
    const rows = Math.ceil(window.innerHeight / cellSize);

    grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    grid.style.gridTemplateRows = `repeat(${rows}, 1fr)`;

    const cells = [];
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            const cell = document.createElement("div");
            cell.className = "wipe-cell";
            grid.appendChild(cell);
            cells.push({ el: cell, x, y });
        }
    }

    // Maximum distance from the center for the wave calculation
    const maxDistance = Math.hypot(cols / 2, rows / 2);

    // Initial delay before hiding Scene A
    setTimeout(() => {
        sceneA.style.opacity = "0";

        // Trigger wave fade out
        cells.forEach(c => {
            const distance = Math.hypot(c.x - cols / 2, c.y - rows / 2);
            // Cells further from center fade later
            const delay = (distance / maxDistance) * 600; 
            setTimeout(() => {
                c.el.style.opacity = "0";
            }, delay);
        });

        // Remove the overlay from DOM entirely once animation is complete
        setTimeout(() => {
            overlay.remove();
        }, 1000); 

    }, 1200); // Wait 1.2s looking at Scene A before wiping
}