const rotatingDiv = document.getElementById('main');
const container = document.querySelector('.container');
const playBtn = document.getElementById('playBtn');

fetch('https://ipwho.is/')
  .then(res => res.json())
  .then(data => {
    playBtn.textContent = `Welcome Back ${data.ip}\nNice to see someone from ${data.country}\n\nClick to reveal`;
  });

function updateRotation(e) {
    const rect = container.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    
    const maxRotation = 10  ; 
    const rotateX = (mouseY / (rect.height / 2)) * -maxRotation;
    const rotateY = (mouseX / (rect.width / 2)) * maxRotation;
    
    rotatingDiv.style.transform = `
        perspective(1000px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
        translateZ(20px)
    `;
}

function resetRotation() {
    rotatingDiv.style.transform = `
        rotateX(0deg)
        rotateY(0deg)
        translateZ(0px)
    `;
}

rotatingDiv.addEventListener('mouseenter', function() {
    rotatingDiv.style.transition = 'none'; 
    document.addEventListener('mousemove', updateRotation);
});

rotatingDiv.addEventListener('mouseleave', function() {
    rotatingDiv.style.transition = 'transform 0.6s ease'; 
    document.removeEventListener('mousemove', updateRotation);
    resetRotation();
});

const startScreen = document.getElementById('start-screen');

startScreen.addEventListener('click', () => {
    startScreen.classList.add('hidden');
    const audio = document.getElementById("audio");
    const currentTimeSpan = document.getElementById('currentTime');
    const totalTimeSpan = document.getElementById('totalTime');

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    }


    audio.play().catch((err) => {
        console.error("Ses oynatılamadı:", err);
        alert("Tarayıcı ses çalmaya izin vermedi.");
    });

    audio.addEventListener('error', function(e) {
        console.error("Müzik yüklenirken veya oynatılırken bir hata oluştu:", e);
    });
    audio.addEventListener('timeupdate', function() {
        const currentTime = audio.currentTime;
        currentTimeSpan.textContent = formatTime(currentTime);
    });

});

const discordBtn = document.getElementById('discord-btn');
const textToCopy = 'biliyor';

discordBtn.addEventListener('click', function(e) {
  e.preventDefault();

  navigator.clipboard.writeText(textToCopy)
    .then(() => {
      alert('Username copied to clipboard!');
    })
    .catch(() => {
      alert('Copy failed!\nUsername: biliyor');
    });
});

