# Event Hive - Frontend

This is the frontend repository for the Event Hive application, built for academic submission. Event Hive allows users to create and track upcoming and past events.

## Team Members
* Gunj Tibrewala
* Sumati Sen

## Features
* **Multi-Page Layout**: Includes `index.html` (Home), `add-event.html` (Add Event), and `past-events.html` (Past Events).
* **Premium UI**: Designed with a modern, dynamic, and responsive blue color theme.
* **API Integration**: Communicates with the Flask backend to fetch, create, and delete events.

## Tech Stack
* HTML5
* CSS3
* Vanilla JavaScript

## Setup Instructions
1. Clone this repository:
   ```bash
   git clone <repository-url>
   ```
2. No build steps or package installations are required.
3. To view the application, you can simply open the `index.html` file in your web browser. 
4. For the best experience (and to prevent CORS issues when communicating with the local backend), it is recommended to run it using an extension like **Live Server** in VS Code.

## Usage
* Make sure the backend Flask server is running locally on port `5000`.
* Navigate to the **Add Event** page to create an event.
* View your current and future events on the **Home** page.
* View completed events on the **Past Events** page.
