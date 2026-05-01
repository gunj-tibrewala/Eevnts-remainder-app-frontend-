// Load events on initial page load if we are on the Home page
document.addEventListener('DOMContentLoaded', () => {
    let list = document.getElementById("eventList");
    if (list !== null) {
        loadEvents();
    }
});

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
        let response = await fetch("http://127.0.0.1:5000/add-event", {
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
        let response = await fetch("http://127.0.0.1:5000/get-events");
        let data = await response.json();
        
        if(list) list.innerHTML = "";
        if(pastList) pastList.innerHTML = "";

        let now = new Date();
        let upcoming = [];
        let past = [];

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
    
    let detailsDiv = document.createElement("div");
    detailsDiv.className = "event-details";
    
    let titleSpan = document.createElement("div");
    titleSpan.className = "event-title";
    titleSpan.innerText = event.title;
    
    let timeSpan = document.createElement("div");
    timeSpan.className = "event-time";
    timeSpan.innerText = event.date + " at " + event.time;

    let deleteBtn = document.createElement("button");
    deleteBtn.className = "btn-delete";
    deleteBtn.innerText = "Delete";
    deleteBtn.onclick = () => {
        deleteEvent(event.id);
    };

    detailsDiv.appendChild(titleSpan);
    detailsDiv.appendChild(timeSpan);
    
    li.appendChild(detailsDiv);
    li.appendChild(deleteBtn);
    
    return li;
}

async function deleteEvent(eventId) {
    try {
        let response = await fetch("http://127.0.0.1:5000/delete-event/" + eventId, {
            method: "DELETE"
        });
        
        let data = await response.json();
        loadEvents();
    } catch (error) {
        console.log("Delete error: ", error);
        alert("Failed to delete event");
    }
}