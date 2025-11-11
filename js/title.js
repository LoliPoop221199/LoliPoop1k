        // Texto que será exibido no <title>
        const titleText = "@biaquista";
        let index = 0;

        // Função para animar o título
        function typeTitle() {
            if (index < titleText.length) {
                // Atualiza o <title> com uma letra adicional
                document.title += titleText[index];
                index++;
                // Define um intervalo para a próxima letra
                setTimeout(typeTitle, 300); // Ajuste o tempo (em milissegundos) para controlar a velocidade
            } else {
                // Reinicia a animação após um pequeno delay
                setTimeout(() => {
                    document.title = ""; // Limpa o título
                    index = 0; // Reinicia o índice
                    typeTitle(); // Começa novamente
                }, 2000); // Espera 2 segundos antes de reiniciar
            }
        }

        // Inicia a animação quando a página carrega
        typeTitle();

        // CSS adicional que deve ser adicionado ao seu arquivo CSS
const additionalCSS = `
.timeline {
    position: relative;
    height: 6px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
    cursor: pointer;
    overflow: visible;
    transition: height 0.2s ease;
}

.timeline:hover {
    height: 8px;
}

.timeline-progress {
    height: 100%;
    background: linear-gradient(90deg, #ffffff, rgba(255, 255, 255, 0.8));
    border-radius: inherit;
    transition: all 0.3s ease;
    position: relative;
}

.timeline-thumb {
    position: absolute;
    top: 50%;
    right: -8px;
    width: 16px;
    height: 16px;
    background: #ffffff;
    border-radius: 50%;
    transform: translateY(-50%) scale(0);
    cursor: grab;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    z-index: 10;
}

.timeline-thumb:active {
    cursor: grabbing;
    transform: translateY(-50%) scale(1.2);
}

.timeline:hover .timeline-thumb {
    transform: translateY(-50%) scale(1);
}

.timeline-thumb.dragging {
    transform: translateY(-50%) scale(1.1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}

/* Animação de popup */
@keyframes popIn {
    0% {
        transform: translateY(-50%) scale(0);
    }
    50% {
        transform: translateY(-50%) scale(1.2);
    }
    100% {
        transform: translateY(-50%) scale(1);
    }
}

.timeline-thumb.pop-in {
    animation: popIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
`;

// Função para adicionar o CSS
function addTimelineStyles() {
    const styleElement = document.createElement('style');
    styleElement.textContent = additionalCSS;
    document.head.appendChild(styleElement);
}

// Função principal para inicializar a timeline interativa
function initializeInteractiveTimeline() {
    // Adicionar estilos
    addTimelineStyles();
    
    const timeline = document.querySelector('.timeline');
    const timelineProgress = document.querySelector('.timeline-progress');
    const audioPlayer = document.querySelector('.audioPlayer');
    const currentTimeSpan = document.querySelector('.current-time');
    const totalTimeSpan = document.querySelector('.total-time');
    
    if (!timeline || !timelineProgress || !audioPlayer) {
        console.error('Elementos da timeline não encontrados');
        return;
    }
    
    // Criar a bolinha (thumb)
    const thumb = document.createElement('div');
    thumb.className = 'timeline-thumb';
    timelineProgress.appendChild(thumb);
    
    // Variáveis de controle
    let isDragging = false;
    let hasInteracted = false;
    let animationFrame = null;
    
    // Função para formatar tempo
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    
    // Função para atualizar a posição da timeline
    function updateTimeline() {
        if (!isDragging && audioPlayer.duration) {
            const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
            timelineProgress.style.width = `${progress}%`;
            currentTimeSpan.textContent = formatTime(audioPlayer.currentTime);
        }
        
        if (!audioPlayer.paused) {
            animationFrame = requestAnimationFrame(updateTimeline);
        }
    }
    
    // Função para calcular posição baseada no mouse
    function getPositionFromEvent(e) {
        const rect = timeline.getBoundingClientRect();
        const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
        let position = (clientX - rect.left) / rect.width;
        position = Math.max(0, Math.min(1, position)); // Clamp entre 0 e 1
        return position;
    }
    
    // Função para definir o tempo do áudio
    function setAudioTime(position) {
        if (audioPlayer.duration) {
            const newTime = position * audioPlayer.duration;
            audioPlayer.currentTime = newTime;
            timelineProgress.style.width = `${position * 100}%`;
            currentTimeSpan.textContent = formatTime(newTime);
        }
    }
    
    // Event listeners para hover
    timeline.addEventListener('mouseenter', () => {
        if (!hasInteracted) {
            thumb.classList.add('pop-in');
            hasInteracted = true;
            
            // Remover a classe após a animação
            setTimeout(() => {
                thumb.classList.remove('pop-in');
            }, 400);
        }
    });
    
    // Event listeners para clique na timeline
    timeline.addEventListener('click', (e) => {
        if (!isDragging) {
            const position = getPositionFromEvent(e);
            setAudioTime(position);
        }
    });
    
    // Event listeners para drag
    function startDrag(e) {
        isDragging = true;
        thumb.classList.add('dragging');
        document.body.style.userSelect = 'none';
        
        // Prevenir comportamento padrão
        e.preventDefault();
        
        // Definir posição inicial
        const position = getPositionFromEvent(e);
        setAudioTime(position);
    }
    
    function drag(e) {
        if (!isDragging) return;
        
        e.preventDefault();
        const position = getPositionFromEvent(e);
        setAudioTime(position);
    }
    
    function endDrag() {
        if (!isDragging) return;
        
        isDragging = false;
        thumb.classList.remove('dragging');
        document.body.style.userSelect = '';
        
        // Retomar a atualização automática se o áudio estiver tocando
        if (!audioPlayer.paused) {
            animationFrame = requestAnimationFrame(updateTimeline);
        }
    }
    
    // Mouse events
    thumb.addEventListener('mousedown', startDrag);
    timeline.addEventListener('mousedown', (e) => {
        if (e.target === timeline || e.target === timelineProgress) {
            startDrag(e);
        }
    });
    
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', endDrag);
    
    // Touch events para dispositivos móveis
    thumb.addEventListener('touchstart', startDrag, { passive: false });
    timeline.addEventListener('touchstart', (e) => {
        if (e.target === timeline || e.target === timelineProgress) {
            startDrag(e);
        }
    }, { passive: false });
    
    document.addEventListener('touchmove', drag, { passive: false });
    document.addEventListener('touchend', endDrag);
    
    // Event listeners do áudio
    audioPlayer.addEventListener('loadedmetadata', () => {
        totalTimeSpan.textContent = formatTime(audioPlayer.duration);
    });
    
    audioPlayer.addEventListener('play', () => {
        if (animationFrame) cancelAnimationFrame(animationFrame);
        animationFrame = requestAnimationFrame(updateTimeline);
    });
    
    audioPlayer.addEventListener('pause', () => {
        if (animationFrame) {
            cancelAnimationFrame(animationFrame);
            animationFrame = null;
        }
    });
    
    // Cleanup quando a página é fechada
    window.addEventListener('beforeunload', () => {
        if (animationFrame) {
            cancelAnimationFrame(animationFrame);
        }
    });
    
    console.log('Timeline interativa inicializada com sucesso!');
}

// Inicializar quando o DOM estiver carregado
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeInteractiveTimeline);
} else {
    initializeInteractiveTimeline();
}