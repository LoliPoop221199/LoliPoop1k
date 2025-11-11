// Função para criar a lockscreen
function criarLockscreen() {
  // Criar elemento da lockscreen
  const lockscreen = document.createElement('div');
  lockscreen.id = 'lockscreen';
  lockscreen.classList.add('lockscreen');
  
  // Aplicar propriedades para otimização de performance
  lockscreen.style.willChange = 'opacity, transform';
  lockscreen.style.backfaceVisibility = 'hidden';
  lockscreen.style.transform = 'translateZ(0)'; // Força aceleração de hardware
  
  // Criar conteúdo interno da lockscreen
  const lockContent = document.createElement('div');
  lockContent.classList.add('lock-content');
  lockContent.style.willChange = 'transform, opacity';
  
  // Texto para clicar com transição suave
  const clickText = document.createElement('div');
  clickText.classList.add('click-text');
  clickText.innerHTML = '[ click to unlock ]';
  clickText.style.willChange = 'opacity, transform';
  
  // Adicionar animação de pulso suave ao texto usando CSS
  const pulseStyle = document.createElement('style');
  pulseStyle.textContent = `
      @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
      }
      .click-text {
          animation: pulse 1.5s infinite ease-in-out;
      }
  `;
  document.head.appendChild(pulseStyle);
  
  // Montar estrutura
  lockContent.appendChild(clickText);
  lockscreen.appendChild(lockContent);
  
  // Adicionar ao body antes de qualquer outro conteúdo
  document.body.insertBefore(lockscreen, document.body.firstChild);
  
  // Esconder o conteúdo principal
  const container = document.getElementById('container');
  if (container) {
      container.style.opacity = '0';
      container.style.visibility = 'hidden';
      container.style.transition = 'opacity 0.8s cubic-bezier(0.215, 0.610, 0.355, 1.000), visibility 0s linear 0.8s';
      container.style.willChange = 'opacity';
  }
  
  // Garantir que os elementos para animar estejam inicialmente ocultos
  const elementosParaAnimar = document.querySelectorAll('.elemento-para-animar');
  elementosParaAnimar.forEach(elemento => {
      elemento.style.opacity = '0';
      elemento.style.transform = 'translateY(20px)';
      elemento.style.willChange = 'opacity, transform';
      // Garantir que não haja animação automática
      elemento.classList.remove('animate-fade-in');
  });
  
  // Evento de clique para desbloquear
  let desbloqueado = false; // Flag para evitar múltiplas execuções
  let animacaoDesbloqueio = null;
  
  lockscreen.addEventListener('click', () => {
      if (desbloqueado) return; // Se já foi desbloqueado, não faz nada
      desbloqueado = true; // Marca como desbloqueado
      
      // Parar a animação de pulso removendo a classe
      clickText.style.animation = 'none';
      
      // Animar a saída da lockscreen com CSS Transitions para melhor performance
      lockscreen.style.transition = 'opacity 500ms cubic-bezier(0.165, 0.84, 0.44, 1), transform 500ms cubic-bezier(0.165, 0.84, 0.44, 1)';
      lockscreen.style.opacity = '0';
      lockscreen.style.transform = 'scale(1.1) translateZ(0)';
      
      // Mostrar o conteúdo principal com fade após a transição
      setTimeout(() => {
          if (container) {
              container.style.visibility = 'visible';
              container.style.opacity = '1';
              container.style.transition = 'opacity 1.2s cubic-bezier(0.4, 0, 0.2, 1)';
          }
          
          // Executar animação dos elementos após desbloqueio
          setTimeout(() => {
              animarElementosSequencialmente();
          }, 200);
          
          // Remover lockscreen após completar a animação
          setTimeout(() => {
              lockscreen.remove();
          }, 800);
      }, 500);
  });
}

// Animar elementos com classe "elemento-para-animar" usando CSS Transitions
function animarElementosSequencialmente() {
  const elementos = document.querySelectorAll('.elemento-para-animar');
  
  elementos.forEach((elemento) => {
      // Verifica se há uma classe de delay (ex: .delay-10, .delay-20)
      const delayClass = Array.from(elemento.classList).find(cls => cls.startsWith('delay-'));
      let delay = 0;
      
      if (delayClass) {
          // Extrai o número da classe (ex: "delay-20" → 20 → 2000ms)
          const delayValue = parseInt(delayClass.replace('delay-', ''), 10);
          delay = delayValue * 100; // Converte para ms (ex: 20 → 200ms)
      } else if (elemento.dataset.delay) {
          // Se não houver classe, verifica o atributo data-delay (ex: data-delay="300")
          delay = parseInt(elemento.dataset.delay, 10);
      }
      
      setTimeout(() => {
          // Aplicar transição CSS em vez de animação frame por frame
          elemento.style.transition = 'opacity 500ms cubic-bezier(0.4, 0, 0.2, 1), transform 500ms cubic-bezier(0.4, 0, 0.2, 1)';
          elemento.style.opacity = '1';
          elemento.style.transform = 'translateY(0)';
          
          // Remover willChange após a transição para liberar recursos
          setTimeout(() => {
              elemento.style.willChange = 'auto';
          }, 500);
      }, delay);
  });
}

// Executar quando o documento estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  criarLockscreen();
  
  // Pré-processamento para preparar animações futuras
  const elementosParaAnimar = document.querySelectorAll('.elemento-para-animar');
  if (elementosParaAnimar.length > 0) {
      // Informar ao navegador que esses elementos serão animados em breve
      elementosParaAnimar.forEach(elemento => {
          if ('IntersectionObserver' in window) {
              const observer = new IntersectionObserver((entries) => {
                  entries.forEach(entry => {
                      if (entry.isIntersecting) {
                          // Preparar elemento quando estiver próximo do viewport
                          entry.target.style.willChange = 'opacity, transform';
                          observer.unobserve(entry.target);
                      }
                  });
              });
              observer.observe(elemento);
          }
      });
  }
});
