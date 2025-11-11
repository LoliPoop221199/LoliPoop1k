import { browser } from '$app/environment';
import { tick } from 'svelte';
import type { Medal, Snowflake } from '$lib/config';

export function initBackgroundMusic(volume: number) {
  if (!browser) return { backgroundAudio: null as HTMLAudioElement | null };
  let backgroundAudio: HTMLAudioElement | null = null;
  try {
    backgroundAudio = new Audio('/background-music.mp3');
    backgroundAudio.loop = true;
    backgroundAudio.volume = volume;
    backgroundAudio.preload = 'auto';
    backgroundAudio.addEventListener('error', (e) => {
      console.warn('Background music failed to load:', e);
    });
  } catch (error) {
    console.warn('Audio initialization failed:', error);
  }
  return { backgroundAudio };
}

export async function tryPlayVideo(backgroundVideo: HTMLVideoElement | null, setVideoWorking: (v: boolean) => void) {
  if (!backgroundVideo) return;
  try {
    backgroundVideo.muted = true;
    backgroundVideo.loop = true;
    await backgroundVideo.play();
    setVideoWorking(true);
  } catch (error) {
    console.error('Video failed:', error);
    setVideoWorking(false);
  }
}

export async function handleSplashClick(
  tryPlay: () => Promise<void>,
  backgroundAudio: HTMLAudioElement | null,
  isMuted: boolean
) {
  await tryPlay();
  if (backgroundAudio && !isMuted) {
    try {
      await backgroundAudio.play();
    } catch (error) {
      console.error('Audio failed:', error);
    }
  }
}

export function handleVolumeMouseEnter(t: any, clear: () => void) {
  clear();
  t.volumeWidth.target = 156;
  t.volumeOpacity.target = 1;
  t.iconScale.target = 1.05;
}

export function handleVolumeMouseLeave(t: any, setTimeoutRef: (id: number | null) => void) {
  const id = window.setTimeout(() => {
    t.volumeWidth.target = 48;
    t.volumeOpacity.target = 0;
    t.iconScale.target = 1;
    setTimeoutRef(null);
  }, 1500);
  setTimeoutRef(id);
}

export function toggleMute(
  isMuted: boolean,
  setMuted: (v: boolean) => void,
  backgroundAudio: HTMLAudioElement | null,
  t: any,
  savedVolume: number,
  setSavedVolume: (v: number) => void,
  currentVolume: number,
  setCurrentVolume: (v: number) => void
) {
  const next = !isMuted;
  setMuted(next);
  
  if (next) {
    setSavedVolume(currentVolume);
    setCurrentVolume(0);
    if (backgroundAudio) backgroundAudio.pause();
  } else {
    setCurrentVolume(savedVolume);
    if (backgroundAudio) {
      backgroundAudio.volume = savedVolume;
      backgroundAudio.play().catch((e) => console.error('Failed to play music:', e));
    }
  }
  
  t.iconScale.target = 1.15;
  setTimeout(() => (t.iconScale.target = 1), 150);
}

export function handleVolumeChange(
  val: number,
  backgroundAudio: HTMLAudioElement | null,
  isMuted: boolean,
  t: any
) {
  if (backgroundAudio && !isMuted) {
    backgroundAudio.volume = val;
  }
  t.iconScale.target = 1.15;
  setTimeout(() => (t.iconScale.target = 1), 150);
}

export function updateTooltipPosition(event: MouseEvent) {
  if (event.currentTarget instanceof HTMLElement) {
    const rect = event.currentTarget.getBoundingClientRect();
    const newX = rect.left + rect.width / 2;
    const newY = rect.top - 15;
    return { x: newX, y: newY };
  }
  return { x: 0, y: 0 };
}

export async function startTypingCycle(
  isTypingRef: () => boolean,
  typingTexts: string[],
  getIndex: () => number,
  setIndex: (n: number) => void,
  setDisplayed: (s: string) => void
) {
  while (isTypingRef()) {
    const text = typingTexts[getIndex()];
    for (let i = 0; i <= text.length && isTypingRef(); i++) {
      setDisplayed(text.slice(0, i));
      await tick();
      await new Promise((r) => setTimeout(r, 80 + Math.random() * 40));
    }
    if (!isTypingRef()) break;
    await new Promise((r) => setTimeout(r, 2000));
    for (let i = text.length; i >= 0 && isTypingRef(); i--) {
      setDisplayed(text.slice(0, i));
      await tick();
      await new Promise((r) => setTimeout(r, 50));
    }
    if (!isTypingRef()) break;
    await new Promise((r) => setTimeout(r, 300));
    setIndex((getIndex() + 1) % typingTexts.length);
  }
}

export function handleMouseMove(e: MouseEvent, cardRef: HTMLDivElement | null, t: any) {
  if (!browser || !cardRef) return;
  const rect = cardRef.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const mouseX = e.clientX - centerX;
  const mouseY = e.clientY - centerY;
  const normalizedX = mouseX / (rect.width / 2);
  const normalizedY = mouseY / (rect.height / 2);
  const maxTilt = 12;
  const rotateX = Math.max(-maxTilt, Math.min(maxTilt, normalizedY * -maxTilt));
  const rotateY = Math.max(-maxTilt, Math.min(maxTilt, normalizedX * maxTilt));
  t.tiltX.target = rotateX;
  t.tiltY.target = rotateY;
}

export function resetTilt(t: any) {
  t.tiltX.target = 0;
  t.tiltY.target = 0;
}

export function scaleUp(tween: { target: number }) {
  tween.target = 1.05;
}

export function scaleDown(tween: { target: number }) {
  tween.target = 1;
}

export function createSnowflakes(): (() => void) | null {
  if (!browser) return null;
  const container = document.createElement('div');
  container.className = 'snow-container';
  document.body.appendChild(container);

  const snowflakes: Snowflake[] = [];
  const snowflakeCount = 80;

  for (let i = 0; i < snowflakeCount; i++) {
    const snowflake = document.createElement('div');
    snowflake.className = 'snowflake';
    const size = Math.random() * 4 + 1;
    const startX = Math.random() * (window.innerWidth + 200) - 100;
    const opacity = Math.random() * 0.8 + 0.2;
    snowflake.style.cssText = `width:${size}px;height:${size}px;opacity:${opacity};`;
    container.appendChild(snowflake);
    snowflakes.push({
      element: snowflake,
      x: startX,
      y: Math.random() * -100 - 10,
      speed: Math.random() * 1.5 + 0.5,
      drift: (Math.random() - 0.5) * 2,
      swayAmount: Math.random() * 2 + 1,
      swaySpeed: Math.random() * 0.02 + 0.01,
      rotation: 0,
      rotationSpeed: (Math.random() - 0.5) * 2
    });
  }

  let frame = 0;
  let animationId = 0;
  function animateSnow() {
    frame++;
    snowflakes.forEach((flake) => {
      flake.y += flake.speed;
      const sway = Math.sin(frame * flake.swaySpeed) * flake.swayAmount;
      flake.x += flake.drift * 0.2 + sway * 0.1;
      flake.rotation += flake.rotationSpeed;
      if (flake.y > window.innerHeight + 10) {
        flake.y = Math.random() * -100 - 10;
        flake.x = Math.random() * (window.innerWidth + 200) - 100;
      }
      if (flake.x > window.innerWidth + 100) flake.x = -100;
      else if (flake.x < -100) flake.x = window.innerWidth + 100;
      flake.element.style.transform = `translate3d(${flake.x}px, ${flake.y}px,0) rotate(${flake.rotation}deg)`;
    });
    if (container.parentNode) {
      animationId = requestAnimationFrame(animateSnow);
    }
  }
  animateSnow();

  return () => {
    if (animationId) cancelAnimationFrame(animationId);
    if (container.parentNode) container.remove();
  };
}

export function handleButtonClick(url: string) {
  try {
    window.open(url, '_blank', 'noopener,noreferrer');
  } catch (error) {
    console.error('Open link error:', error);
  }
}
