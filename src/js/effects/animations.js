function initCardAnimation() {
  const card = document.querySelector('.card');
  const musicPlayer = document.querySelector('.music-player');
  const volumeButton = document.querySelector('.volume-control-wrapper');
  const discordBadge = document.querySelector('.discord-presence-badge');
  const easing = 'cubic-bezier(0.34,1.56,0.64,1)';
  const dur = '0.8s';
  const baseDelay = 5;

  const setInitial = (el, transform) => {
    if (!el) return;
    el.style.transition = 'none';
    el.style.transform = transform;
    el.style.opacity = '0';
  };

  const animate = (el, transform, delay = 0) => {
    if (!el) return;
    setTimeout(() => {
      el.style.transition = `transform ${dur} ${easing}, opacity ${dur} ${easing}`;
      el.style.transform = transform;
      el.style.opacity = '1';
    }, delay);
  };

  setInitial(card, 'translateY(-50px)');
  setInitial(musicPlayer, 'translateY(50px)');
  setInitial(volumeButton, 'translateX(-50px)');
  setInitial(discordBadge, 'translateX(50px)');

  animate(card, 'translateY(0)', baseDelay);
  animate(musicPlayer, 'translateY(0)', baseDelay + 75);
  animate(volumeButton, 'translateX(0)', baseDelay + 150);
  animate(discordBadge, 'translateX(0)', baseDelay + 150);
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { initCardAnimation };
}