from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

events = []

@app.route('/add-event', methods=['POST'])
def add_event():
    data = request.json
    events.append(data)
    return jsonify({"message": "Event added successfully"})

@app.route('/get-events', methods=['GET'])
def get_events():
    return jsonify(events)

if __name__ == '__main__':
    app.run(debug=True)