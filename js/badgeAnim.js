document.addEventListener('DOMContentLoaded', function() {
    // Selecionamos todos os badges
    const badges = document.querySelectorAll('.profileBadge');
    
    // Para cada badge, adicionamos os eventos de mouse
    badges.forEach(badge => {
      // Criamos um elemento tooltip personalizado
      const tooltip = document.createElement('div');
      tooltip.className = 'badge-tooltip';
      
      // Determinamos o texto baseado na classe do badge
      let tooltipText = '';
      if (badge.classList.contains('dev')) tooltipText = 'Developer';
      else if (badge.classList.contains('staff')) tooltipText = 'Staff';
      else if (badge.classList.contains('certif')) tooltipText = 'Certified';
      else if (badge.classList.contains('premium')) tooltipText = 'Premium';
      else if (badge.classList.contains('bughunter')) tooltipText = 'Bug Hunter';
      else if (badge.classList.contains('earlysupporter')) tooltipText = 'Early Supporter';
      else if (badge.classList.contains('fire')) tooltipText = 'ζξζ ι ζξζ';
      else if (badge.classList.contains('graphic')) tooltipText = 'Graphic Designer';
      else if (badge.classList.contains('imagehost')) tooltipText = 'Image Host';
      else if (badge.classList.contains('og')) tooltipText = 'OG';
      else if (badge.classList.contains('sweet')) tooltipText = 'Candy';
      else if (badge.classList.contains('patrick')) tooltipText = 'St. Patrick';
      
      tooltip.textContent = tooltipText;
      document.body.appendChild(tooltip);
      
      // Posicionamento e animação do tooltip no mouseover
      badge.addEventListener('mouseenter', function(e) {
        const badgeRect = badge.getBoundingClientRect();
        tooltip.style.visibility = 'visible';
        tooltip.style.opacity = '0';
        tooltip.style.transform = 'translate(-50%, 10px) scale(0.8)';
        
        // Posicionamos o tooltip acima do badge
        tooltip.style.left = `${badgeRect.left + badgeRect.width/2}px`;
        tooltip.style.top = `${badgeRect.top - 10}px`;
        
        // Aplicamos a animação
        requestAnimationFrame(() => {
          tooltip.style.opacity = '0.9';
          tooltip.style.transform = 'translate(-50%, -30px) scale(1)';
        });
      });
      
      // Ocultar e animar a saída do tooltip
      badge.addEventListener('mouseleave', function() {
        tooltip.style.opacity = '0';
        tooltip.style.transform = 'translate(-50%, 10px) scale(0.8)';
        
        // Ocultamos completamente após a animação terminar
        setTimeout(() => {
          tooltip.style.visibility = 'hidden';
        }, 300);
      });
    });
    
    // Implementação para discordUserBadge com data-tooltip
    const discordBadges = document.querySelectorAll('.discordUserBadge[data-tooltip]');
    
    discordBadges.forEach(badge => {
      // Criamos um elemento tooltip personalizado
      const tooltip = document.createElement('div');
      tooltip.className = 'badge-tooltip discord-tooltip';
      tooltip.textContent = badge.getAttribute('data-tooltip');
      document.body.appendChild(tooltip);
      
      // Posicionamento e animação do tooltip no mouseover
      badge.addEventListener('mouseenter', function(e) {
        const badgeRect = badge.getBoundingClientRect();
        tooltip.style.visibility = 'visible';
        tooltip.style.opacity = '0';
        tooltip.style.transform = 'translate(-50%, 10px) scale(0.8)';
        
        // Posicionamos o tooltip acima do badge
        tooltip.style.left = `${badgeRect.left + badgeRect.width/2}px`;
        tooltip.style.top = `${badgeRect.top - 7}px`;
        
        // Aplicamos a animação
        requestAnimationFrame(() => {
          tooltip.style.opacity = '0.9';
          tooltip.style.transform = 'translate(-50%, -30px) scale(1)';
        });
      });
      
      // Ocultar e animar a saída do tooltip
      badge.addEventListener('mouseleave', function() {
        tooltip.style.opacity = '0';
        tooltip.style.transform = 'translate(-50%, 10px) scale(0.8)';
        
        // Ocultamos completamente após a animação terminar
        setTimeout(() => {
          tooltip.style.visibility = 'hidden';
        }, 300);
      });
    });
  });