function initVolumeControl() {
  const btn = document.querySelector('.volume-button');
  const slider = document.querySelector('.volume-slider');
  const wrapper = document.querySelector('.volume-slider-wrapper');
  if (!btn || !slider || !wrapper) return;

  let muted = false;
  let prevVol = 1;

  const getAudioEl = () => typeof getAudio !== 'undefined' ? getAudio() : null;

  const setIcon = () => {
    const src = muted ? 'src/assets/icons/music/volume-control/muted.svg' : 'src/assets/icons/music/volume-control/volume.svg';
    const alt = muted ? 'Muted' : 'Volume';
    btn.innerHTML = `<img src="${src}" alt="${alt}" style="width:100%;height:100%;object-fit:contain;">`;
  };

  const setVolume = v => {
    const audio = getAudioEl();
    if (!audio) return;
    audio.volume = v;
    slider.value = v * 100;
    wrapper.style.setProperty('--volume-percent', v * 100 + '%');
  };

  const toggleMute = () => {
    const audio = getAudioEl();
    if (!audio) return;
    muted ? setVolume(prevVol) : (prevVol = audio.volume, setVolume(0));
    muted = !muted;
    setIcon();
  };

  const updateVolume = e => {
    const v = e.target.value / 100;
    const audio = getAudioEl();
    if (!audio) return;
    audio.volume = v;
    wrapper.style.setProperty('--volume-percent', e.target.value + '%');
    if (v === 0) muted = true;
    else if (muted) { muted = false; prevVol = v; }
    setIcon();
  };

  const handleClick = e => {
    const rect = slider.getBoundingClientRect();
    const pct = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    slider.value = pct;
    updateVolume({ target: slider });
  };

  btn.addEventListener('dblclick', e => { e.preventDefault(); toggleMute(); });
  slider.addEventListener('input', updateVolume);
  slider.addEventListener('change', updateVolume);
  slider.addEventListener('click', handleClick);

  setTimeout(() => { setVolume(1); setIcon(); }, 100);
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { initVolumeControl };
}