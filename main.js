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