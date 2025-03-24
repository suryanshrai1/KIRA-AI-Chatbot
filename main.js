var url = 'http://127.0.0.1:1000';

function sendText() {
    var text = document.getElementById('user_text').value;
    if (text.trim() === "") return; // Prevent sending empty messages
    console.log(text);
    
    // Clear the input field
    document.getElementById('user_text').value = '';

    // Display the user's question in the response area
    var responseArea = document.getElementById('response');
    responseArea.innerHTML += `<p><strong>You:</strong> ${text}</p>`;

    fetch(url + '/get_text', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ "text": text }),
    })
    .then(response => response.json())
    .then(data => {
        console.log("Text sent to Python");
        console.log(data);
        var r = document.getElementById('response');
        r.innerHTML += `<p><strong>AI:</strong> ${data.result}</p>`;
        r.scrollTop = r.scrollHeight; // Scroll to the bottom

        // Speak the response
        speakText(data.result);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function checkEnter(event) {
    if (event.key === 'Enter') {
        sendText();
    }
}

// Voice Recognition
function startVoiceRecognition() {
    var recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US'; // Set the language
    recognition.interimResults = false;

    recognition.onresult = function(event) {
        var transcript = event.results[0][0].transcript;
        document.getElementById('user_text').value = transcript; // Set the input field to the recognized text
        sendText(); // Send the recognized text
    };

    recognition.onerror = function(event) {
        console.error('Speech recognition error:', event.error);
    };

    recognition.start();
}

// Text-to-Speech
function speakText(text) {
    var utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US'; // Set the language
    window.speechSynthesis.speak(utterance);
}

recognition.onerror = function(event) {
    console.error('Speech recognition error:', event.error);
    alert('Error occurred in recognition: ' + event.error);
};