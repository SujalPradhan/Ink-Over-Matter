from flask import Flask, jsonify
from flask_cors import CORS


app = Flask(__name__)
CORS(app)

@app.route('/')
def hello_world():
    return 'Hello, World!'

@app.route('/api/data', methods=['GET'])
def get_data():
    return jsonify({
        "message": "Connection successful!",
        "data": ["item1", "item2", "item3"]
    })

if __name__ == '__main__':
    app.run(debug=True)