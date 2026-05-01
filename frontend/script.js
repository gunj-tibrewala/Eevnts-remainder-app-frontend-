// Load events on initial page load
document.addEventListener('DOMContentLoaded', loadEvents);

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

        let data = await response.json();
        
        // Clear inputs
        titleInput.value = "";
        dateInput.value = "";
        timeInput.value = "";
        
        loadEvents();
    } catch (error) {
        console.log("Fetch error: ", error);
        alert("Failed to connect to server");
    }
}

async function loadEvents() {
    let list = document.getElementById("eventList");

    try {
        let response = await fetch("http://127.0.0.1:5000/get-events");
        let data = await response.json();
        
        list.innerHTML = "";

        if (data.length === 0) {
            list.innerHTML = "<p>No upcoming events.</p>";
            return;
        }

        for (let i = 0; i < data.length; i++) {
            let event = data[i];
            
            let li = document.createElement("li");
            
            let detailsDiv = document.createElement("div");
            
            let titleSpan = document.createElement("div");
            titleSpan.className = "event-title";
            titleSpan.innerText = event.title;
            
            let timeSpan = document.createElement("div");
            timeSpan.className = "event-time";
            timeSpan.innerText = event.date + " at " + event.time;

            let deleteBtn = document.createElement("button");
            deleteBtn.className = "btn-delete";
            deleteBtn.innerText = "Delete";
            // Create an arrow function for the click event
            deleteBtn.onclick = () => {
                deleteEvent(event.id);
            };

            detailsDiv.appendChild(titleSpan);
            detailsDiv.appendChild(timeSpan);
            
            li.appendChild(detailsDiv);
            li.appendChild(deleteBtn);
            
            list.appendChild(li);
        }
    } catch (error) {
        console.log("Fetch error: ", error);
    }
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