// main.js
var url = 'http://127.0.0.1:1000';
let memory = [];
let currentUtterance = null;
let isResponding = false;
let typingInterval = null;

function sendText() {
    const askBtn = document.getElementById('askBtn');

    if (isResponding) {
        stopResponding();
        return;
    }

    var text = document.getElementById('user_text').value;
    if (text.trim() === "") return;
    document.getElementById('user_text').value = '';

    var responseArea = document.getElementById('response');
    responseArea.innerHTML += `<p><strong>You:</strong> ${text}</p>`;

    const loadingId = `loading-${Date.now()}`;
    responseArea.innerHTML += `<p id="${loadingId}"><strong>KIRA:</strong> <span class="typing">.</span></p>`;
    scrollToBottom();

    let dotCount = 0;
    const interval = setInterval(() => {
        const dots = ".".repeat(dotCount % 4);
        const typingSpan = document.querySelector(`#${loadingId} .typing`);
        if (typingSpan) typingSpan.textContent = dots;
        dotCount++;
    }, 500);

    isResponding = true;
    askBtn.innerText = 'Stop';

    fetch(url + '/get_text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ "text": text, "history": memory })
    })
    .then(response => response.json())
    .then(data => {
        clearInterval(interval);
        const loadingElem = document.getElementById(loadingId);
        if (loadingElem) loadingElem.remove();

        const mood = getEmojiFromSentiment(data.result);
        const fullText = data.result + ' ' + mood;
        showTypingEffect(fullText);
        speakText(fullText);
        updateMemory(text, data.result);
    })
    .catch(error => {
        clearInterval(interval);
        console.error('Error:', error);
        isResponding = false;
        askBtn.innerText = 'Ask';
    });
}

function showTypingEffect(text) {
    const responseArea = document.getElementById('response');
    const messageElem = document.createElement('p');
    messageElem.innerHTML = "<strong>KIRA:</strong> ";
    responseArea.appendChild(messageElem);

    let index = 0;
    typingInterval = setInterval(() => {
        if (index < text.length) {
            messageElem.innerHTML += text.charAt(index);
            scrollToBottom();
            index++;
        } else {
            clearInterval(typingInterval);
            typingInterval = null;
            isResponding = false;
            document.getElementById('askBtn').innerText = 'Ask';
        }
    }, 25);
}

function stopResponding() {
    if (speechSynthesis.speaking) speechSynthesis.cancel();
    if (typingInterval) clearInterval(typingInterval);

    isResponding = false;
    document.getElementById('askBtn').innerText = 'Ask';
}

function scrollToBottom() {
    const responseArea = document.getElementById('response');
    responseArea.scrollTop = responseArea.scrollHeight;
}

function generateImage() {
    var text = document.getElementById('user_text').value;
    if (text.trim() === "") return;
    document.getElementById('user_text').value = '';

    var responseArea = document.getElementById('response');
    responseArea.innerHTML += `<p><strong>You:</strong> ${text}</p>`;

    const loadingMsg = document.createElement('p');
    loadingMsg.innerHTML = `<em>Generating image...</em>`;
    responseArea.appendChild(loadingMsg);

    fetch(url + '/generate_image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ "text": text })
    })
    .then(response => response.json())
    .then(data => {
        loadingMsg.remove();

        if (data.image_url) {
            const imageHTML = `
                <p><strong>KIRA:</strong><br>
                    <img src="${data.image_url}" 
                         alt="Generated Image" 
                         class="fade-in-image"
                         style="width: 100%; max-width: 350px; border-radius: 10px; margin-top: 10px; opacity: 0;"
                         onload="this.style.opacity='1'">
                </p>`;
            responseArea.innerHTML += imageHTML;
        } else {
            responseArea.innerHTML += `<p><strong>KIRA:</strong> Sorry, image generation failed. Try again later.</p>`;
        }
        scrollToBottom();
    })
    .catch(error => {
        console.error('Error:', error);
        loadingMsg.remove();
    });
}

function startVoiceRecognition() {
    if (!('webkitSpeechRecognition' in window)) {
        alert('Your browser does not support Speech Recognition. Please use Chrome.');
        return;
    }

    const recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript;
        document.getElementById('user_text').value = transcript;
        sendText();
    };

    recognition.onerror = function(event) {
        console.error('Speech recognition error:', event.error);
    };

    recognition.start();
}

function speakText(text) {
    if ('speechSynthesis' in window) {
        if (speechSynthesis.speaking) {
            speechSynthesis.cancel();
        }

        currentUtterance = new SpeechSynthesisUtterance(text);
        currentUtterance.lang = 'en-US';
        currentUtterance.pitch = 1;
        currentUtterance.rate = 1;

        currentUtterance.onend = () => {
            isResponding = false;
            document.getElementById('askBtn').innerText = 'Ask';
        };

        speechSynthesis.speak(currentUtterance);
    }
}

function checkEnter(event) {
    if (event.key === 'Enter') {
        sendText();
    }
}

function getEmojiFromSentiment(text) {
    const positiveWords = ['great', 'awesome', 'happy', 'good', 'love'];
    const negativeWords = ['bad', 'sad', 'angry', 'terrible', 'hate'];

    const lowerText = text.toLowerCase();
    if (positiveWords.some(word => lowerText.includes(word))) return '😊';
    if (negativeWords.some(word => lowerText.includes(word))) return '😢';
    return '🤔';
}

function updateMemory(user, kira) {
    memory.push({ user, kira });
    if (memory.length > 3) memory.shift();
    localStorage.setItem('kiraMemory', JSON.stringify(memory));

    const memoryList = document.getElementById('memoryList');
    memoryList.innerHTML = '';
    memory.forEach(pair => {
        memoryList.innerHTML += `<li><strong>You:</strong> ${pair.user}<br><strong>KIRA:</strong> ${pair.kira}</li>`;
    });
}

function handleUpload() {
    const file = document.getElementById('fileInput').files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    fetch(url + '/analyze_file', {
        method: 'POST',
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        document.getElementById('response').innerHTML += `<p><strong>KIRA:</strong> ${data.result}</p>`;
        scrollToBottom();
    });
}

window.onload = () => {
    const savedMemory = localStorage.getItem('kiraMemory');
    if (savedMemory) {
        memory = JSON.parse(savedMemory);
        const memoryList = document.getElementById('memoryList');
        memoryList.innerHTML = '';
        memory.forEach(pair => {
            memoryList.innerHTML += `<li><strong>You:</strong> ${pair.user}<br><strong>KIRA:</strong> ${pair.kira}</li>`;
        });
    }
};
