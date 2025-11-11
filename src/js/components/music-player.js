let globalAudio;

function initMusicPlayer() {
  const player = document.querySelector('.music-player');
  if (!player) return;

  const audio = new Audio();
  globalAudio = audio;

  const playBtn = player.querySelector('.play-pause');
  const prevBtn = player.querySelector('.prev-track');
  const nextBtn = player.querySelector('.next-track');
  const trackName = player.querySelector('.music-track-name');
  const cover = player.querySelector('.music-cover');
  const currentTimeEl = player.querySelector('.current-time');
  const durationEl = player.querySelector('.duration-time');
  const seekbar = player.querySelector('.music-seekbar');
  const progress = player.querySelector('.music-seekbar-progress');

  const icons = {
    play: 'src/assets/icons/music/music-player/play.svg',
    pause: 'src/assets/icons/music/music-player/pause.svg',
    next: 'src/assets/icons/music/music-player/next.svg',
    prev: 'src/assets/icons/music/music-player/previous.svg'
  };

  const tracks = [
    { name: 'The World Looks White', file: 'src/assets/music/tracks/The_World_Looks_White.opus', cover: 'src/assets/music/covers/violence.png' },
    { name: 'The World Looks Red', file: 'src/assets/music/tracks/The_World_Looks_Red.opus', cover: 'src/assets/music/covers/violence.png' }
  ];

  let index = 0;
  let playing = false;
  let dragging = false;
  const autoPlay = true;

  const setIcon = (btn, src, alt='') => btn && (btn.innerHTML = `<img src="${src}" alt="${alt}">`);

  const loadTrack = i => {
    const t = tracks[i];
    audio.src = t.file;
    trackName.textContent = t.name;
    cover.src = t.cover;
    cover.alt = t.name;
  };

  const togglePlay = () => {
    if (audio.paused) {
      audio.play(); playing = true; setIcon(playBtn, icons.pause, 'Pause');
    } else {
      audio.pause(); playing = false; setIcon(playBtn, icons.play, 'Play');
    }
  };

  const nextTrack = () => {
    index = (index + 1) % tracks.length;
    loadTrack(index);
    if (playing) audio.play();
  };

  const prevTrack = () => {
    index = (index - 1 + tracks.length) % tracks.length;
    loadTrack(index);
    if (playing) audio.play();
  };

  const formatTime = s => {
    if (isNaN(s)) return '0:00';
    const m = Math.floor(s/60), sec = Math.floor(s%60);
    return `${m}:${sec.toString().padStart(2,'0')}`;
  };

  const updateProgress = () => {
    if (!dragging && audio.duration) {
      const pct = (audio.currentTime / audio.duration) * 100 || 0;
      progress.style.width = pct + '%';
      currentTimeEl.textContent = formatTime(audio.currentTime);
      durationEl.textContent = formatTime(audio.duration);
    }
  };

  const seek = e => {
    if (!audio.duration) return;
    const rect = seekbar.getBoundingClientRect();
    const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left;
    const pct = Math.max(0, Math.min(100, (x/rect.width)*100));
    audio.currentTime = (pct/100) * audio.duration;
    progress.style.width = pct + '%';
    currentTimeEl.textContent = formatTime(audio.currentTime);
  };

  seekbar.addEventListener('click', seek);
  seekbar.addEventListener('mousedown', e => { dragging = true; seek(e); });
  document.addEventListener('mousemove', e => dragging && seek(e));
  document.addEventListener('mouseup', () => dragging = false);
  seekbar.addEventListener('touchstart', e => { dragging = true; seek(e); e.preventDefault(); });
  document.addEventListener('touchmove', e => dragging && (seek(e), e.preventDefault()));
  document.addEventListener('touchend', () => dragging = false);

  setIcon(playBtn, icons.play, 'Play');
  setIcon(nextBtn, icons.next, 'Next');
  setIcon(prevBtn, icons.prev, 'Previous');

  playBtn.addEventListener('click', togglePlay);
  nextBtn.addEventListener('click', nextTrack);
  prevBtn.addEventListener('click', prevTrack);
  audio.addEventListener('timeupdate', updateProgress);
  audio.addEventListener('loadedmetadata', updateProgress);
  audio.addEventListener('ended', nextTrack);

  loadTrack(index);

  if (autoPlay) {
    let started = false;
    const tryPlay = () => {
      if (started) return;
      started = true;
      audio.play().then(() => { playing = true; setIcon(playBtn, icons.pause, 'Pause'); }).catch(() => {});
      document.removeEventListener('click', tryPlay);
      document.removeEventListener('keydown', tryPlay);
    };
    audio.play().catch(() => {
      document.addEventListener('click', tryPlay, { once: true });
      document.addEventListener('keydown', tryPlay, { once: true });
    });
  }
}

const getAudio = () => globalAudio;

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { initMusicPlayer, getAudio };
}