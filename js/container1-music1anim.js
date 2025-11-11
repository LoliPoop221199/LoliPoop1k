document.addEventListener('DOMContentLoaded', () => {
    // Elementos a serem animados
    const container = document.querySelector('.container');
    const musicContainer = document.querySelector('.music-container');

    // Array de elementos para animação 3D
    const animatedElements = [container, musicContainer];

    // Definir os keyframes no JavaScript
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @keyframes moveUp {
            from {
                transform: translateY(0);
            }
            to {
                transform: translateY(-60px);
            }
        }
    `;
    document.head.appendChild(styleSheet);

    // Configurações iniciais para cada elemento
    animatedElements.forEach(element => {
        if (element) {
            element.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
            element.style.zIndex = '1';
            element.style.position = 'relative';
            element.style.willChange = 'transform';
            element.style.backfaceVisibility = 'hidden';
            element.style.transformStyle = 'preserve-3d';
            element.style.opacity = '0'; // Inicialmente invisível
        }
    });

    // Variáveis para animação 3D
    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;
    let rafId = null;
    
    // Variáveis para controlar o estado da animação
    let containerYOffset = 0;
    let targetYOffset = 0;
    let currentYOffset = 0;

    function animateTransform() {
        // Interpolação suave entre posição atual e alvo
        currentX += (targetX - currentX) * 0.1;
        currentY += (targetY - currentY) * 0.1;
        currentYOffset += (targetYOffset - currentYOffset) * 0.05; // Suavizar movimento vertical
        
        // Aplicar transformação com base no estado atual
        if (container) {
            // Combinar a animação de deslocamento vertical com a de rotação 3D
            container.style.transform = `perspective(1000px) translateY(${currentYOffset}px) rotateX(${currentY}deg) rotateY(${currentX}deg)`;
        }
        
        // Para o music container, aplicar apenas a rotação 3D
        if (musicContainer && musicContainer.style.opacity === '1') {
            musicContainer.style.transform = `perspective(1000px) rotateX(${currentY}deg) rotateY(${currentX}deg)`;
        }
        
        // Continuar a animação sempre
        rafId = requestAnimationFrame(animateTransform);
    }

    // Iniciar a animação imediatamente
    rafId = requestAnimationFrame(animateTransform);

    // Função para adicionar evento de movimento em um elemento
    function addMouseMoveEvent(element) {
        if (element) {
            element.addEventListener('mousemove', (e) => {
                const rect = element.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const offsetX = (x - centerX) / centerX;
                const offsetY = (y - centerY) / centerY;
                const intensity = 9;
                
                // Atualizar os valores alvo
                targetX = offsetX * intensity;
                targetY = offsetY * intensity;
                
                // Prevenindo propagação do evento
                e.stopPropagation();
            });
        }
    }

    // Adicionar eventos de movimento para cada elemento
    animatedElements.forEach(addMouseMoveEvent);

    // Função para adicionar evento de saída do mouse
    function addMouseLeaveEvent(element) {
        if (element) {
            element.addEventListener('mouseleave', () => {
                // Retornar à rotação inicial
                targetX = 0;
                targetY = 0;
            });
        }
    }

    // Adicionar eventos de saída do mouse para cada elemento
    animatedElements.forEach(addMouseLeaveEvent);

    // Adicionar eventos de entrada do mouse para prevenir propagação
    animatedElements.forEach(element => {
        if (element) {
            element.addEventListener('mouseenter', (e) => {
                e.stopPropagation();
            });
        }
    });

    // Iniciar sequência de animações no clique
    document.body.addEventListener('click', () => {
        // Fade in do container principal
        if (container) {
            container.style.animation = 'fadeIn 0.8s forwards';
            
            // Quando a animação fadeIn terminar
            container.addEventListener('animationend', (e) => {
                if (e.animationName === 'fadeIn') {
                    // Remover a animação para não interferir com a transformação 3D
                    container.style.animation = '';
                    container.style.opacity = '1';
                }
            }, { once: true });
        }

        // Adicionar um atraso para o fadeIn do music player e moveUp do container
        setTimeout(() => {
            // Fade in do music container
            if (musicContainer) {
                musicContainer.style.animation = 'fadeIn 0.8s forwards';
                
                // Quando a animação fadeIn terminar
                musicContainer.addEventListener('animationend', (e) => {
                    if (e.animationName === 'fadeIn') {
                        // Remover a animação para não interferir com a transformação 3D
                        musicContainer.style.animation = '';
                        musicContainer.style.opacity = '1';
                    }
                }, { once: true });
            }
            
            // Move up do container principal - agora usando nossa variável targetYOffset
            if (container) {
                // Definir o deslocamento alvo para -60px
                targetYOffset = -60;
                
                // Não precisamos mais da animação CSS para moveUp,
                // pois agora controlamos o movimento através da animação JS
            }
        }, 2480);
    }, { once: true });
});