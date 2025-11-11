import type { Tweened } from 'svelte/motion';

export const mainName = 'Jengal';
export const typingTexts = ['Backend developer', 'I am 17 years old', 'I really love Tokyo <3'];
export const links = [
  { label: 'Telegram', url: 'https://t.me/jenga1' },
  { label: 'GitHub', url: 'https://github.com/jenga1l' }
];

export const backgroundConfig = {
  useVideo: true, // true - видео, false - только фото
  videoSrc: '/background-video.mp4',
  imageSrc: '/background-image.jpg'
};

export interface Medal {
  id: string;
  name: string;
  color: string;
  src: string;
}

export const medals: Medal[] = [
  { id: 'admin', name: 'Admin', color: '#ffd902ff', src: '/svg/admin.svg' },
  { id: 'diamond', name: 'Premium', color: '#b32be9', src: '/svg/diamond.svg' },
  { id: 'code', name: 'Developer', color: '#49e880', src: '/svg/code.svg' }
];

export interface TooltipState {
  hoveredElement: string | null;
  tooltipText: string;
  tooltipPosition: { x: number; y: number };
  staticTooltipPosition: { x: number; y: number };
  lastTooltipUpdate: number;
}

export interface Snowflake {
  element: HTMLDivElement;
  x: number;
  y: number;
  speed: number;
  drift: number;
  swayAmount: number;
  swaySpeed: number;
  rotation: number;
  rotationSpeed: number;
}

export interface Tweens {
  volumeWidth: Tweened<number>;
  volumeOpacity: Tweened<number>;
  iconScale: Tweened<number>;
  scaleTelegram: Tweened<number>;
  scaleGitHub: Tweened<number>;
  tiltX: Tweened<number>;
  tiltY: Tweened<number>;
}

