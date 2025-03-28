from flask import Flask, request, jsonify
from flask_cors import CORS 
import google.generativeai as genai
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app)

# Get the Google API key from the environment variable
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

def chat(qst):
    genai.configure(api_key=GOOGLE_API_KEY)
    model = genai.GenerativeModel('models/gemini-1.5-pro-latest')
    chat_response = model.generate_content(qst)
    return chat_response

@app.route('/', methods=['GET'])
def home():
    response_data = {'message': 'Welcome to the API!'}
    return jsonify(response_data)

@app.route('/get_text', methods=['POST'])
def process_text():
    data = request.get_json()
    text = data.get('text', '')
    
    # Call the chat function
    processed_text = chat(text).text
    print(processed_text)
    response_data = {'result': processed_text}
    return jsonify(response_data)

if __name__ == "__main__":
    app.run(port=1000)