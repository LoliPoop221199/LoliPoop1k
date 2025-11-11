/* optimized, cleaned background effects */
function initBackgroundEffects() {
  const sheets = Array.from(document.styleSheets);
  let effect = 'default';

  for (const sheet of sheets) {
    try {
      if (!sheet.href || !sheet.href.includes('effects/background/')) continue;
      const name = sheet.href.split('/').pop();
      if (name.includes('rain.css')) effect = 'rain';
      else if (name.includes('snow.css')) effect = 'snow';
      else if (name.includes('stars.css')) effect = 'stars';
      else if (name.includes('particles.css')) effect = 'particles';
      else if (name.includes('oldtv.css')) effect = 'oldtv';
      else if (name.includes('crt.css')) effect = 'crt';
      else if (name.includes('storm.css')) effect = 'storm';
      else if (name.includes('bloodrain.css')) effect = 'bloodrain';
      else if (name.includes('blur.css')) effect = 'blur';
    } catch {}
  }

  const containerFactory = (className, count = 0, inner = null) => {
    const container = document.createElement('div');
    container.className = className;
    for (let i = 0; i < count; i++) {
      const el = document.createElement('div');
      if (inner) el.innerHTML = inner;
      el.className = className.includes('rain') ? 'rain-drop' :
                     className.includes('snow') ? 'snowflake' :
                     className.includes('stars') ? 'star' :
                     className.includes('particles') ? 'particle' : '';
      container.appendChild(el);
    }
    return container;
  };

  const append = el => el && document.body.appendChild(el);

  switch (effect) {
    case 'rain':
    case 'bloodrain':
      append(containerFactory('rain-effect', 30));
      break;
    case 'snow':
      const snow = containerFactory('snow-effect', 20, '❄');
      append(snow);
      break;
    case 'stars':
      append(containerFactory('stars-effect', 30));
      break;
    case 'particles':
      append(containerFactory('particles-effect', 20));
      break;
    case 'oldtv':
      const oldtv = document.createElement('div');
      oldtv.className = 'oldtv-effect';
      oldtv.appendChild(document.createElement('div')).className = 'oldtv-flicker';
      oldtv.appendChild(document.createElement('div')).className = 'oldtv-static';
      append(oldtv);
      break;
    case 'crt':
      const crt = document.createElement('div');
      crt.className = 'crt-effect';
      ['crt-rgb','crt-glow','crt-flicker','crt-roll'].forEach(c => {
        const d = document.createElement('div');
        d.className = c;
        crt.appendChild(d);
      });
      append(crt);
      break;
    case 'storm':
      const storm = containerFactory('rain-effect', 30);
      const lightning = document.createElement('div');
      lightning.className = 'lightning-flash';
      storm.appendChild(lightning);
      for (let i=0;i<3;i++){
        const bolt = document.createElement('div');
        bolt.className='lightning-bolt';
        storm.appendChild(bolt);
      }
      append(storm);
      break;
    case 'blur':
    default: break;
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { initBackgroundEffects };
}