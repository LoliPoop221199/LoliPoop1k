// Müzik açma/kapatma işlevi
const music = document.getElementById('background-music');
const musicToggle = document.getElementById('music-toggle');

// Sayfa yüklendiğinde müziği başlat
window.onload = function() {
    music.play();
};

// Butona tıklandığında müziği aç/kapat
musicToggle.onclick = function() {
    if (music.paused) {
        music.play();
        musicToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
    } else {
        music.pause();
        musicToggle.innerHTML = '<i class="fas fa-volume-off"></i>';
    }
};

// Code by Ardelys //
