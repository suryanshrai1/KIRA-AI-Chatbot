var url = 'http://127.0.0.1:1000';

function sendText() {
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
    const messageElem = document.createElement('p');
    messageElem.innerHTML = "<strong>KIRA:</strong> ";
    responseArea.appendChild(messageElem);

    let index = 0;
    const typingInterval = setInterval(() => {
        if (index < text.length) {
            messageElem.innerHTML += text.charAt(index);
            scrollToBottom();
            index++;
        } else {
            clearInterval(typingInterval);
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
    responseArea.innerHTML += `<p><em>Generating image...</em></p>`;

    fetch(url + '/generate_image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ "text": text }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.image_url) {
            responseArea.innerHTML += `<p><strong>KIRA:</strong><br><img src="${data.image_url}" alt="Generated Image" style="width: 100%; max-width: 350px; border-radius: 10px; margin-top: 10px;"></p>`;
        } else {
            responseArea.innerHTML += `<p><strong>KIRA:</strong> Sorry, image generation failed. Try again later.</p>`;
        }
        scrollToBottom();
    })
    .catch(error => {
        console.error('Error:', error);
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
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.pitch = 1;
        utterance.rate = 1;
        speechSynthesis.speak(utterance);
    }
}

function checkEnter(event) {
    if (event.key === 'Enter') {
        sendText();
    }
}
