(() => {
  if (document.querySelector('.custom-cursor')) return;

  const cursor = document.createElement('div');
  cursor.className = 'custom-cursor';
  Object.assign(cursor.style, {
    position: 'fixed',
    width: 'var(--cursor-size,24px)',
    height: 'var(--cursor-size,24px)',
    pointerEvents: 'none',
    zIndex: '2147483647',
    top: '0',
    left: '0',
    transform: 'translate(-50%,-50%)',
    willChange: 'transform,opacity',
    opacity: '0',
    display: 'block',
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center'
  });

  const updateCursorImage = url => {
    if (!url) return;
    document.documentElement.style.setProperty('--cursor-image', `url("${url}")`);
    cursor.style.backgroundImage = `url("${url}")`;
  };

  const loadCursorImage = () => {
    const meta = document.querySelector('meta[name="cursor-image"]')?.getAttribute('content');
    const bodyAttr = document.body.getAttribute('data-cursor-image');
    updateCursorImage(meta || bodyAttr || null);
  };

  const init = () => {
    document.body.appendChild(cursor);
    loadCursorImage();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }

  let tx = 0, ty = 0, raf = null;
  const render = () => {
    raf = null;
    cursor.style.transform = `translate(${tx}px,${ty}px) translate(-50%,-50%)`;
  };

  const onMove = e => {
    tx = e.clientX;
    ty = e.clientY;
    if (!raf) raf = requestAnimationFrame(render);
  };

  document.addEventListener('mousemove', onMove, { passive: true });
  document.addEventListener('touchmove', ev => {
    const t = ev.touches?.[0];
    if (t) onMove(t);
  }, { passive: true });

  const show = () => (cursor.style.opacity = '1');
  const hide = () => (cursor.style.opacity = '0');

  document.addEventListener('mouseenter', show, { passive: true });
  document.addEventListener('mouseleave', hide, { passive: true });
  window.addEventListener('focus', show);
  window.addEventListener('blur', hide);
})();