// function addEvent() {
//     let title = document.getElementById("title").value;
//     let date = document.getElementById("date").value;
//     let time = document.getElementById("time").value;

//     if (!title || !date || !time) {
//         alert("Please fill all fields");
//         return;
//     }

//     let li = document.createElement("li");
//     li.innerText = `${title} - ${date} ${time}`;

//     document.getElementById("eventList").appendChild(li);
// }
console.log("CLICK WORKING");
function addEvent() {
    console.log("CLICK WORKING");

    try {
        let title = document.getElementById("title").value;
        let date = document.getElementById("date").value;
        let time = document.getElementById("time").value;

        console.log("VALUES:", title, date, time);

        // if (!title || !date || !time) {
        //     alert("Fill all fields");
        //     return;
        // }

        fetch("http://127.0.0.1:5000/add-event", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ title, date, time })
        })
        .then(res => res.json())
        .then(data => {
            console.log("SUCCESS:", data);
            alert(data.message);
            loadEvents();
        })
        .catch(err => console.log("FETCH ERROR:", err));

    } catch (error) {
        console.log("JS ERROR:", error);
    }
}

function loadEvents() {
    let list = document.getElementById("eventList");

    if (list === null) {
        console.log("eventList not found");
        return;
    }

    fetch("http://127.0.0.1:5000/get-events")
    .then(res => res.json())
    .then(data => {
        list.innerHTML = "";

        data.forEach(event => {
            let li = document.createElement("li");
            li.innerText = `${event.title} - ${event.date} ${event.time}`;
            list.appendChild(li);
        });
    })
    .catch(err => console.log("Fetch error:", err));
}