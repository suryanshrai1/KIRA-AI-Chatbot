from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import os
import requests
import random
from urllib.parse import quote
from dotenv import load_dotenv

# Load .env variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Configure Google Gemini
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
genai.configure(api_key=GOOGLE_API_KEY)
model = genai.GenerativeModel('models/gemini-1.5-pro-latest')

# Home route
@app.route('/', methods=['GET'])
def home():
    return jsonify({'message': 'Welcome to KIRA API'})

# Text response route
@app.route('/get_text', methods=['POST'])
def process_text():
    data = request.get_json()
    text = data.get('text', '')
    try:
        response = model.generate_content(text)
        return jsonify({'result': response.text})
    except Exception as e:
        print("Gemini error:", str(e))
        return jsonify({'result': 'Sorry, I had trouble thinking just now.'})

# Image generation route
import random

@app.route('/generate_image', methods=['POST'])
def generate_image():
    data = request.get_json()
    prompt = data.get("text", "")
    query = quote(prompt)
    api_key = os.getenv("PIXABAY_API_KEY")

    url = f'https://pixabay.com/api/?key={api_key}&q={query}&image_type=photo&per_page=3&safesearch=true'

    try:
        response = requests.get(url)
        
        # Log rate limit info
        remaining = response.headers.get('X-RateLimit-Remaining')
        limit = response.headers.get('X-RateLimit-Limit')
        print(f"Pixabay quota remaining: {remaining}/{limit}")

        result = response.json()

        if "hits" in result and len(result["hits"]) > 0:
            selected = random.choice(result["hits"])  # Pick one randomly
            image_url = selected["webformatURL"]
            print("Found image:", image_url)
            return jsonify({'image_url': image_url})
        else:
            print("No image found for prompt:", prompt)
            return jsonify({'error': 'No image found'}), 500
    except Exception as e:
        print("Pixabay error:", str(e))
        return jsonify({'error': 'Image generation failed'}), 500



# Run the app
if __name__ == "__main__":
    app.run(port=1000)
