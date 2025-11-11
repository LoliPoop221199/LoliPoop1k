const texts = document.getElementById('typingTexts').innerHTML.split(' &lt;&gt; ');
const textElement = document.getElementById('typingText');
const cursorChar = "|"; // Cursor character added here
let currentTextIndex = 0;

function typeWriter(text, i) {
    if (i < text.length) {
        textElement.textContent = text.substring(0, i + 1) + cursorChar;
        i++;
        setTimeout(function() {
            typeWriter(text, i);
        }, 185);
    } else {
        setTimeout(function() {
            eraseText(text);
        }, 1000); // Added a 2-second delay before erasing
    }
}

function eraseText(text) {
    let length = text.length;
    if (length > 0) {
        textElement.textContent = text.substring(0, length - 1) + cursorChar;
        setTimeout(function() {
            eraseText(text.substring(0, length - 1));
        }, 40);
    } else {
        currentTextIndex = (currentTextIndex + 1) % texts.length;
        setTimeout(function() {
            typeWriter(texts[currentTextIndex], 0);
        }, 500);
    }
}

typeWriter(texts[currentTextIndex], 0);