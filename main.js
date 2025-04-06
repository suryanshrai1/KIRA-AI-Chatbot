var url = 'http://127.0.0.1:1000';

function sendText() {
    var text = document.getElementById('user_text').value;
    if (text.trim() === "") return;
    document.getElementById('user_text').value = '';

    var responseArea = document.getElementById('response');
    responseArea.innerHTML += `<p><strong>You:</strong> ${text}</p>`;

    fetch(url + '/get_text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ "text": text }),
    })
    .then(response => response.json())
    .then(data => {
        responseArea.innerHTML += `<p><strong>KIRA:</strong> ${data.result}</p>`;
        responseArea.scrollTop = responseArea.scrollHeight;
        speakText(data.result);
    })
    .catch(error => console.error('Error:', error));
}

function generateImage() {
    var text = document.getElementById('user_text').value;
    if (text.trim() === "") return;

    document.getElementById('user_text').value = '';

    var responseArea = document.getElementById('response');
    responseArea.innerHTML += `<p><strong>You:</strong> ${text}</p>`;

    // to see animation of wait
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
        responseArea.scrollTop = responseArea.scrollHeight;
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
        sendText(); // ✅ Auto-send after voice input
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
