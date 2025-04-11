
const music = document.getElementById('background-music');
const musicToggle = document.getElementById('music-toggle');

window.onload = function() {
    music.play();
};

musicToggle.onclick = function() {
    if (music.paused) {
        music.play();
        musicToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
    } else {
        music.pause();
        musicToggle.innerHTML = '<i class="fas fa-volume-off"></i>';
    }
};

