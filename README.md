# 🤖 KIRA-AI Chatbot

KIRA is an AI-powered chatbot built using Flask (Python) and JavaScript, featuring voice input/output, image generation, PDF/image analysis, theme toggle, memory panel, and context awareness.

---

## 🚀 Getting Started

Follow these steps to set up and run the KIRA chatbot locally:

### 1. 📦 Install Required Packages

Use `pip` to install the backend dependencies:

```bash
pip install Flask flask-cors
```

### 2. ✅ Verify Installation

After installation, run the following to confirm everything is installed correctly:

```bash
pip list
```

You should see `Flask`, `Flask-CORS`, and any other required packages in the list.

### 3. 🔑 Set Up Your Gemini API Key

In the `ai.py` file (line 8), replace:

```python
API_KEY = "Your API KEY"
```

with your actual **Google Gemini API key**, which you can get from [Google AI Studio](https://makersuite.google.com/app/apikey).

---

## 🖥️ Project Structure

```
KIRA-AI-Chatbot/
├── static/
│   ├── styles.css      # CSS styles (Tailwind + custom)
│   └── script.js       # Main JavaScript logic
├── templates/
│   └── index.html      # Chatbot frontend
├── ai.py               # Flask backend with Gemini API integration
├── README.md           # You're here!
```

---

## 🧠 Features

- 💬 Text and voice-based interaction
- 🖼️ AI image generation
- 📄 PDF & image content analysis
- 🌗 Light/Dark theme toggle with memory
- 🎙️ Voice style selection (Calm, Robotic, etc.)
- 💾 Persistent conversation memory
- ⚡ Typing animation and loading indicators

---

## 📌 Notes

- Make sure to run the app using:

```bash
python ai.py
```

- Access the chatbot in your browser at `http://localhost:5000`

---

## 📃 License

This project is for educational purposes. Attribution is appreciated if used in other projects.

