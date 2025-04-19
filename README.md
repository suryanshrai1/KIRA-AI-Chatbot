# 🤖 KIRA-AI Chatbot

KIRA is an AI-powered chatbot built using **Flask (Python)** for the backend and a responsive **HTML/CSS/JS** frontend. It integrates with **Google Gemini API** to generate intelligent responses and images, and includes features like voice input, theme toggle, memory panel, PDF/image analysis, and much more.

---

## 🚀 Features

- 🧠 Conversational AI using Google Gemini
- 🖼️ Image generation from text prompts
- 📄 PDF and image analysis
- 🎤 Voice input and output (with style selection)
- 🌗 Light/Dark mode with local preference memory
- 💾 Memory panel for context retention
- ⚙️ Fully responsive frontend with Tailwind CSS

---

## 📸 Screenshots

<table>
  <tr>
    <td><img src="![Screenshot 2025-04-20 043904](https://github.com/user-attachments/assets/1b7b466f-a415-4185-921f-b5e96c40aff4)
" alt="Dark Mode" width="100%"/></td>
    <td><img src="![Screenshot 2025-04-20 044057](https://github.com/user-attachments/assets/e7cc778f-4769-4dc2-9911-00cc1801f9d2)
" alt="Light Mode" width="100%"/></td>
  </tr>
  <tr>
    <td align="center"><strong>Light Mode</strong></td>
    <td align="center"><strong>Dark Mode</strong></td>
  </tr>
</table>



## 📦 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/suryanshrai1/kira-ai-chatbot.git
cd kira-ai-chatbot
```

---

### 2. Install Required Python Packages

Use `pip` to install all necessary dependencies:

```bash
pip install Flask flask-cors
pip install google-generativeai
pip install Pillow
pip install PyMuPDF
```

> 💡 These packages support the Flask server, CORS handling, Google Gemini API, image processing, and PDF reading.

---

### 3. Verify Installation

After installing the packages, you can verify by running:

```bash
pip list
```

You should see the following packages listed:

- `Flask`
- `flask-cors`
- `google-generativeai`
- `Pillow`
- `PyMuPDF`

---

### 4. Set Up Your Google Gemini API Key

In `ai.py` (line 8), replace the placeholder:

```python
API_KEY = "Your API KEY"
```

with your actual **Gemini API key**, which you can get from:

📎 [Google AI Studio](https://makersuite.google.com/app/apikey)

> 🔐 **Best Practice:** Store your API key in a `.env` file for security and use the `python-dotenv` package.

---

### 5. Run the Flask Server

```bash
python ai.py
```

By default, the server will run on:

```
http://127.0.0.1:5000
```

---

### 6. Open the Chatbot in Browser

Open `index.html` in your browser or run a local web server (e.g., Live Server in VS Code) to test the frontend.

---

## 🧪 File Structure

```bash
kira-ai-chatbot/
├── ai.py                    # Flask backend with Gemini integration
├── index.html               # Chatbot interface
├── style.css                # All styles including light/dark theme
├── script.js                # JavaScript for frontend interactions
├── /static/                 # Optional static assets (images, etc.)
├── /uploads/                # Temporary uploads (PDFs/images)
```

---

## 🛠️ Technologies Used

- **Frontend**: HTML, CSS, Tailwind CSS, JavaScript
- **Backend**: Python, Flask, Flask-CORS
- **AI/ML**: Google Gemini API (`google-generativeai`)
- **Media**: `Pillow`, `PyMuPDF` for image and PDF analysis

---

## 📚 Optional Enhancements

- Store user preferences in `localStorage` (already implemented)
- Add `.env` support via `python-dotenv`:
  
```bash
pip install python-dotenv
```

- Deploy to platforms like **Render**, **Replit**, or **Heroku** for public access

---

## 📄 License

MIT License © 2025 — Made with 💙 by Suryansh Rai

---

## 🙌 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you’d like to change.

---

