
const app = document.getElementById('typewriter');
const textArray = ["XADICA4E4A"];
let index = 0;

function type() {
  let i = 0;
  function typeLetter() {
    if (i < textArray[index].length) {
      app.innerHTML += `<strong>${textArray[index].charAt(i)}</strong>`;
      i++;
      setTimeout(typeLetter, 100);
    } else {
      setTimeout(() => {
        app.innerHTML = '';
        index = (index + 1) % textArray.length;
        type();
      }, 2000);
    }
  }
  typeLetter();
}
type();


const overlay = document.getElementById('overlay');
const audio = document.getElementById('background-audio');
const video = document.getElementById('background-video');
let audioStarted = false;

overlay.addEventListener('click', () => {
  overlay.style.opacity = '0';
  setTimeout(() => {
    overlay.style.display = 'none';
    audio.play();
    video.play();
    audioStarted = true;
  }, 500);
});


const muteButton = document.getElementById('muteButton');
const volumeSlider = document.getElementById('volumeSlider');

muteButton.addEventListener('click', () => {
  if (!audioStarted) {
    audio.play();
    audioStarted = true;
  }
  audio.muted = !audio.muted;
  muteButton.textContent = audio.muted ? '🔇' : '🔊';
});

volumeSlider.addEventListener('input', (event) => {
  audio.volume = event.target.value / 100;
});


const viewCountElement = document.getElementById('viewCount');


let viewCount = localStorage.getItem('viewCount') || 0;
viewCount++;
localStorage.setItem('viewCount', viewCount);
viewCountElement.textContent = viewCount;

