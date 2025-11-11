// // Função para aplicar animações com delay crescente
// function applySequentialAnimations() {
//     // Seleciona todos os elementos para animar
//     const elements = document.querySelectorAll('.elemento-para-animar');
    
//     // Define o intervalo de tempo entre cada elemento (em segundos)
//     const intervalBetweenElements = 0.15; // 150ms entre cada elemento
    
//     // Aplica a animação com o delay crescente para cada elemento
//     elements.forEach((element, index) => {
//       // Calcula o delay baseado no índice do elemento
//       const delay = index * intervalBetweenElements;
      
//       // Aplica a animação com o delay calculado
//       element.style.animationDelay = `${delay}s`;
//       element.classList.add('animate-fade-in');
//     });
//   }
  
//   // Executa quando o DOM estiver carregado
//   document.addEventListener('DOMContentLoaded', applySequentialAnimations);

//   // Configuração avançada com IntersectionObserver para animar elementos conforme aparecem
// function setupSequentialAnimations() {
//     // Configura as opções de animação
//     const options = {
//       baseDelay: 0.1, // Delay base em segundos
//       incrementDelay: 0.15, // Aumento de delay entre elementos na mesma seção
//       threshold: 0.1 // Quanto do elemento precisa estar visível para ativar
//     };
  
//     // Pegue todos os grupos de animação (podem ser seções diferentes)
//     const animationGroups = document.querySelectorAll('.animation-group');
    
//     animationGroups.forEach(group => {
//       // Elementos a serem animados dentro deste grupo
//       const elements = group.querySelectorAll('.elemento-para-animar');
      
//       // Cria um observer para este grupo
//       const observer = new IntersectionObserver((entries) => {
//         // Counter para elementos visíveis neste grupo
//         let visibleCount = 0;
        
//         entries.forEach(entry => {
//           if (entry.isIntersecting) {
//             // Calcula o delay baseado na ordem de aparecimento
//             const delay = options.baseDelay + (visibleCount * options.incrementDelay);
            
//             // Aplica a animação
//             entry.target.style.animationDelay = `${delay}s`;
//             entry.target.classList.add('animate-fade-in');
            
//             // Incrementa o contador de elementos visíveis
//             visibleCount++;
            
//             // Para de observar o elemento após animá-lo
//             observer.unobserve(entry.target);
//           }
//         });
//       }, {
//         threshold: options.threshold
//       });
      
//       // Observa cada elemento do grupo
//       elements.forEach(element => {
//         observer.observe(element);
//       });
//     });
//   }
  
//   document.addEventListener('DOMContentLoaded', setupSequentialAnimations);