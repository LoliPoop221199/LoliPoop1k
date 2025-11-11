function createRipple(e) {
  const r = document.createElement('span');
  r.className = 'ripple-effect';
  r.style.left = e.clientX + 'px';
  r.style.top = e.clientY + 'px';
  document.body.appendChild(r);
  setTimeout(() => r.remove(), 600);
}

function initEntrySequence() {
  const overlay = document.querySelector('.entry-overlay');
  if (!overlay) return;

  document.body.classList.add('entry-active');
  let dismissed = false;

  const hide = () => {
    if (dismissed) return;
    dismissed = true;
    overlay.classList.add('hidden');
    document.body.classList.remove('entry-active');

    setTimeout(() => typeof initCardAnimation === 'function' && initCardAnimation(), 50);
    setTimeout(() => overlay.remove(), parseFloat(getComputedStyle(overlay).transitionDuration) * 1000);
  };

  overlay.addEventListener('click', e => {
    if (dismissed) return;
    createRipple(e);
    setTimeout(hide, 200);
  });

  const keyHandler = e => {
    if (!overlay.classList.contains('hidden')) hide();
    document.removeEventListener('keydown', keyHandler);
  };
  document.addEventListener('keydown', keyHandler);
}

function initGlobalRipple() {
  document.body.addEventListener('click', createRipple);
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { initEntrySequence, initGlobalRipple };
}