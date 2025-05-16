from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
import os
import glob
import re
from flask import Flask, request, jsonify
import google.generativeai as genai
from dotenv import load_dotenv

app = Flask(__name__)
CORS(app)

# Create a directory for static files if it doesn't exist
if not os.path.exists('static'):
    os.makedirs('static')
if not os.path.exists('static/images'):
    os.makedirs('static/images')

@app.route('/')
def landing_page():
    return jsonify({
        'message': 'Welcome to the Ink Over Matter API'
    })

@app.route('/view_full_gallery')
def view_full_gallery():
    # Get all tattoo images from frontend public directory
    frontend_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'frontend')
    public_images_dir = os.path.join(frontend_dir, 'public', 'images')
    
    # List all tattoo image files in the directory
    tattoo_files = []
    if os.path.exists(public_images_dir):
        # Find all tattoo image files
        pattern = re.compile(r'tattoo\d+\.jpg')
        for file in os.listdir(public_images_dir):
            if pattern.match(file):
                tattoo_files.append(file)
    
    # Sort tattoo files numerically by their number
    tattoo_files.sort(key=lambda x: int(re.search(r'tattoo(\d+)\.jpg', x).group(1)))
    
    # Create the image objects
    images = []
    for idx, file in enumerate(tattoo_files, 1):
        images.append({
            'id': idx,
            'title': f'Premium Tattoo Artwork {idx}',
            'url': f'/images/{file}'
        })
    
    return jsonify(images)

@app.route('/static/images/<path:filename>')
def serve_static(filename):
    """Serve static files (images)"""
    return send_from_directory('static/images', filename)

@app.route('/submit_booking', methods=['POST'])
def submit_booking():
    # This is a placeholder for future booking functionality
    return jsonify({
        'status': 'success',
        'message': 'Booking request received'
    })

# Get API key from environment variable or use a placeholder
load_dotenv()

# Get the API key from environment variable
api_key = os.getenv("GOOGLE_API_KEY")
if not api_key:
    raise ValueError("Missing GOOGLE_API_KEY in .env")

# Configure Gemini
genai.configure(api_key=api_key)
model = genai.GenerativeModel('gemini-2.0-flash')
with open("system_prompt.txt", "r") as file:
    system_prompt = file.read()

# Update your chat endpoint function:

@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    user_message = data.get("message", "")
    
    # Use the loaded system_prompt instead of hardcoded text
    response = model.generate_content([
        {
            "role": "user",
            "parts": [system_prompt]
        },
        {
            "role": "model",
            "parts": ["I'll help answer questions about Ink Over Matter tattoo studio!"]
        },
        {
            "role": "user", 
            "parts": [user_message]
        }
    ])
    
    return jsonify({"response": response.text})

if __name__ == '__main__':
    app.run(debug=True)