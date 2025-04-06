var url = 'http://127.0.0.1:1000';
let isSpeaking = false;
let typingInterval = null;
let currentUtterance = null;
let currentMessageElem = null;

function sendText() {
    if (isSpeaking) {
        stopSpeakingAndTyping();
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

    fetch(url + '/get_text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ "text": text }),
    })
    .then(response => response.json())
    .then(data => {
        clearInterval(interval);
        const loadingElem = document.getElementById(loadingId);
        if (loadingElem) loadingElem.remove();
        showTypingEffect(data.result);
        speakText(data.result);
    })
    .catch(error => {
        clearInterval(interval);
        console.error('Error:', error);
    });
}

function showTypingEffect(text) {
    const responseArea = document.getElementById('response');
    currentMessageElem = document.createElement('p');
    currentMessageElem.innerHTML = "<strong>KIRA:</strong> ";
    responseArea.appendChild(currentMessageElem);

    let index = 0;
    isSpeaking = true;
    toggleSpeakButton(true);

    typingInterval = setInterval(() => {
        if (index < text.length) {
            currentMessageElem.innerHTML += text.charAt(index);
            scrollToBottom();
            index++;
        } else {
            clearInterval(typingInterval);
            typingInterval = null;
            currentMessageElem = null;
        }
    }, 25);
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
        body: JSON.stringify({ "text": text }),
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
                         style="width: 100%; max-width: 350px; border-radius: 10px; margin-top: 10px; opacity: 0; transition: opacity 2.5s ease;"
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
        currentUtterance = new SpeechSynthesisUtterance(text);
        currentUtterance.lang = 'en-US';
        currentUtterance.pitch = 1;
        currentUtterance.rate = 1;

        currentUtterance.onend = () => {
            isSpeaking = false;
            toggleSpeakButton(false);
        };

        speechSynthesis.speak(currentUtterance);
    }
}

function stopSpeakingAndTyping() {
    if ('speechSynthesis' in window && speechSynthesis.speaking) {
        speechSynthesis.cancel();
    }

    if (typingInterval) {
        clearInterval(typingInterval);
        typingInterval = null;
    }

    if (currentMessageElem) {
        currentMessageElem.innerHTML += '...'; // Optional: show partial message
        currentMessageElem = null;
    }

    isSpeaking = false;
    toggleSpeakButton(false);
}

function toggleSpeakButton(isTalking) {
    const askBtn = document.querySelector('.send_btn');
    askBtn.textContent = isTalking ? 'Stop' : 'Ask';
    askBtn.style.backgroundColor = isTalking ? '#ff4d4d' : '#00ffd5';
}

function checkEnter(event) {
    if (event.key === 'Enter') {
        sendText();
    }
}
