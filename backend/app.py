from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app)

events = []
event_id_counter = 1

@app.route('/add-event', methods=['POST'])
def add_event():
    global event_id_counter
    data = request.json
    data['id'] = event_id_counter
    event_id_counter += 1
    events.append(data)
    return jsonify({"message": "Event added successfully", "event": data})

@app.route('/get-events', methods=['GET'])
def get_events():
    return jsonify(events)

@app.route('/delete-event/<event_id>', methods=['DELETE'])
def delete_event(event_id):
    global events
    # event_id from URL is a string, convert to int
    events = [e for e in events if e.get('id') != int(event_id)]
    return jsonify({"message": "Event deleted successfully"})

if __name__ == '__main__':
    # Get configuration from .env
    debug_mode = os.getenv('DEBUG', 'False').lower() == 'true'
    port = int(os.getenv('PORT', 5000))
    app.run(debug=debug_mode, port=port)