document.addEventListener('DOMContentLoaded', () => {
    const audio = document.querySelector('.audioPlayer');
    const playIcon = document.querySelector('.play-pause');
    const pauseIcon = document.querySelector('.pause-icon');
    const prevButton = document.querySelector('.prev');
    const nextButton = document.querySelector('.next');
    const timeline = document.querySelector('.timeline');
    const timelineProgress = document.querySelector('.timeline-progress');
    const currentTime = document.querySelector('.current-time');
    const totalTime = document.querySelector('.total-time');

    // Função para formatar tempo
    function formatTime(time) {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }

    // Variável para controlar o primeiro clique
    let firstClickHappened = false;

    // Função para reprodução automática com delay
    function autoPlayWithDelay() {
        if (!firstClickHappened) return;
        
        // Delay de 2 segundos após o primeiro clique
        setTimeout(() => {
            audio.play();
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'block';
        }, 2000);
    }

    // Adiciona evento de clique no site para habilitar o autoplay
    document.addEventListener('click', () => {
        if (!firstClickHappened) {
            firstClickHappened = true;
            autoPlayWithDelay();
        }
    });

    // Função para pular para frente ou para trás
    function skipTime(direction) {
        const skipAmount = 5; // 5 segundos
        if (direction === 'forward') {
            // Pula para frente, mas não passa do final da música
            audio.currentTime = Math.min(audio.currentTime + skipAmount, audio.duration);
        } else {
            // Pula para trás, mas não vai antes do início da música
            audio.currentTime = Math.max(audio.currentTime - skipAmount, 0);
        }
    }

    // Adiciona eventos de pulo para prev e next
    prevButton.addEventListener('click', () => skipTime('backward'));
    nextButton.addEventListener('click', () => skipTime('forward'));

    // Carrega metadados
    audio.addEventListener('loadedmetadata', () => {
        totalTime.textContent = formatTime(audio.duration);
    });

    // Função de alternância entre play/pause
    function togglePlayPause() {
        if (audio.paused) {
            audio.play();
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'block';
        } else {
            audio.pause();
            playIcon.style.display = 'block';
            pauseIcon.style.display = 'none';
        }
    }

    // Eventos nos ícones
    playIcon.addEventListener('click', togglePlayPause);
    pauseIcon.addEventListener('click', togglePlayPause);

    // Atualiza progresso
    audio.addEventListener('timeupdate', () => {
        const progress = (audio.currentTime / audio.duration) * 100;
        timelineProgress.style.width = `${progress}%`;
        currentTime.textContent = formatTime(audio.currentTime);
    });

    // Aumentar área clicável sem modificar a aparência
    // Modifica a timeline existente para ter uma área clicável maior
    timeline.style.cursor = 'pointer';
    timeline.style.position = 'relative';
    
    // Cria um elemento invisível para expandir a área clicável
    const clickableArea = document.createElement('div');
    clickableArea.style.position = 'absolute';
    clickableArea.style.top = '-10px';  // Estende 10px para cima
    clickableArea.style.bottom = '-10px'; // Estende 10px para baixo
    clickableArea.style.left = '0';
    clickableArea.style.right = '0';
    clickableArea.style.cursor = 'pointer';
    
    // Adiciona o elemento invisível à timeline
    timeline.appendChild(clickableArea);

    // Função para processar o clique em qualquer parte da área clicável
    function handleTimelineClick(e) {
        const rect = timeline.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        audio.currentTime = pos * audio.duration;
    }

    // Adiciona evento de clique ao elemento invisível maior
    clickableArea.addEventListener('click', handleTimelineClick);
    
    // Mantém o evento de clique na timeline original para compatibilidade
    timeline.addEventListener('click', handleTimelineClick);

    // Resetar ao terminar
    audio.addEventListener('ended', () => {
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const audioPlayer = document.querySelector('.audioPlayer');
    const volumeSlider = document.querySelector('.volume-slider');
    const volumeIcon = document.querySelector('.volume-icon');
    let lastVolume = 0.04; // Volume inicial definido para 50%

    // Definir volume inicial
    audioPlayer.volume = lastVolume;
    volumeSlider.value = lastVolume;

    // Atualizar ícone de volume inicial
    volumeIcon.innerHTML = `<path fill="currentColor" d="M7 9v6h4l5 5V4l-5 5z"></path>`;

    volumeSlider.addEventListener('input', () => {
        const volume = volumeSlider.value;
        audioPlayer.volume = volume;
        lastVolume = volume;

        // Atualizar ícone de volume
        if (volume == 0) {
            volumeIcon.innerHTML = `<path fill="currentColor" d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63m2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71M4.27 3L3 4.27L7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21L21 19.73l-9-9zM12 4L9.91 6.09L12 8.18z"></path>`;
        } else if (volume < 0.1) {
            volumeIcon.innerHTML = `<path fill="currentColor" d="M7 9v6h4l5 5V4l-5 5z"></path>`;
        } else {
            volumeIcon.innerHTML = `<path fill="currentColor" d="M3 9v6h4l5 5V4L7 9zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02M14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77"></path>`;
        }
    });

    // Ícone de volume clicável para mute/unmute
    volumeIcon.addEventListener('click', () => {
        if (audioPlayer.volume > 0) {
            lastVolume = audioPlayer.volume;
            audioPlayer.volume = 0;
            volumeSlider.value = 0;
            volumeIcon.innerHTML = `<path fill="currentColor" d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63m2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71M4.27 3L3 4.27L7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21L21 19.73l-9-9zM12 4L9.91 6.09L12 8.18z"></path>`;
        } else {
            audioPlayer.volume = lastVolume || 0.2; // Voltar para o último volume ou 50%
            volumeSlider.value = lastVolume || 0.2;
            
            // Restaurar ícone baseado no volume
            if (lastVolume < 0.2) {
                volumeIcon.innerHTML = `<path fill="currentColor" d="M7 9v6h4l5 5V4l-5 5z"></path>`;
            } else {
                volumeIcon.innerHTML = `<path fill="currentColor" d="M3 9v6h4l5 5V4L7 9zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02M14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77"></path>`;
            }
        }
    });
});