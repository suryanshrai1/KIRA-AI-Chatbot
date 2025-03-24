from flask import Flask, request, jsonify
from flask_cors import CORS 
import google.generativeai as genai

app=Flask(__name__)
CORS(app)

GOOGLE_API_KEY="AIzaSyBe-tkkEow5xf9HR2kqUsqsYjRE82bEhJ0"
def chat(qst):
    genai.configure(api_key=GOOGLE_API_KEY)
    model = genai.GenerativeModel('models/gemini-1.5-pro-latest')
    chat = model.generate_content(qst)
    return chat


@app.route('/', methods = ['GET'])
def home():
    response_data= {'message': 'Welcome to the API!'}
    return jsonify(response_data)

@app.route('/get_text', methods=['POST'])
def process_text():
    data = request.get_json()
    text = data.get('text', '')
    
    # Add your processing logic here
    processed_text = chat(text).text
    print(processed_text)
    response_data = {'result': processed_text}
    return jsonify(response_data)



if __name__=="__main__":
    app.run(port=1000)

# print(chat("Hello").text)