from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import os
import requests
import random
from urllib.parse import quote
from dotenv import load_dotenv
from werkzeug.utils import secure_filename
import tempfile
import fitz  # PyMuPDF
from PIL import Image
import io
from textblob import TextBlob

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Configure Gemini
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
genai.configure(api_key=GOOGLE_API_KEY)
model = genai.GenerativeModel('models/gemini-1.5-pro-latest')

@app.route('/', methods=['GET'])
def home():
    return jsonify({'message': 'Welcome to KIRA API'})

@app.route('/get_text', methods=['POST'])
def process_text():
    data = request.get_json()
    text = data.get('text', '')
    try:
        response = model.generate_content(text)

        # Sentiment analysis for emoji
        blob = TextBlob(response.text)
        polarity = blob.sentiment.polarity
        if polarity > 0.2:
            emoji = "😊"
        elif polarity < -0.2:
            emoji = "😢"
        else:
            emoji = "🤔"

        return jsonify({'result': response.text, 'emoji': emoji})
    except Exception as e:
        print("Gemini error:", str(e))
        return jsonify({'result': 'Sorry, I had trouble thinking just now.', 'emoji': '🤖'})

@app.route('/generate_image', methods=['POST'])
def generate_image():
    data = request.get_json()
    prompt = data.get("text", "")
    query = quote(prompt)
    api_key = os.getenv("PIXABAY_API_KEY")
    url = f'https://pixabay.com/api/?key={api_key}&q={query}&image_type=photo&per_page=3&safesearch=true'

    try:
        response = requests.get(url)
        result = response.json()

        if "hits" in result and len(result["hits"]) > 0:
            selected = random.choice(result["hits"])
            image_url = selected["webformatURL"]
            return jsonify({'image_url': image_url})
        else:
            return jsonify({'error': 'No image found'}), 500
    except Exception as e:
        print("Pixabay error:", str(e))
        return jsonify({'error': 'Image generation failed'}), 500


@app.route('/analyze_file', methods=['POST'])
def analyze_file():
    file = request.files.get('file')
    if not file:
        return jsonify({'error': 'No file uploaded'}), 400

    filename = secure_filename(file.filename)
    file_ext = os.path.splitext(filename)[1].lower()

    with tempfile.NamedTemporaryFile(delete=False, suffix=file_ext) as tmp:
        file.save(tmp.name)
        content = ""

        try:
            if file_ext == '.pdf':
                doc = fitz.open(tmp.name)
                for page in doc:
                    content += page.get_text()

                # Send to Gemini for summarization
                summary_prompt = f"Summarize the following PDF content in a few concise paragraphs:\n\n{content}"
                response = model.generate_content(summary_prompt)
                return jsonify({'result': response.text})

            elif file_ext in ['.jpg', '.jpeg', '.png']:
                image = Image.open(tmp.name)
                img_bytes = io.BytesIO()
                image.save(img_bytes, format='PNG')
                img_bytes.seek(0)
                gemini_vision = genai.GenerativeModel('models/gemini-pro-vision')
                response = gemini_vision.generate_content(["Describe this image", img_bytes.read()])
                return jsonify({'result': response.text})

            else:
                return jsonify({'error': 'Unsupported file type'}), 400

        except Exception as e:
            print("File analysis error:", str(e))
            return jsonify({'error': 'File processing failed'})


if __name__ == "__main__":
    app.run(port=1000)
