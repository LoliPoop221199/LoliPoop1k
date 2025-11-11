<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { Tween } from 'svelte/motion';
  import { cubicOut } from 'svelte/easing';
  import { browser } from '$app/environment';
  import { mainName, typingTexts, links, medals, backgroundConfig, type Medal } from '$lib/config';
  import * as L from '$lib/logic';
  import '$lib/styles.css';

  let displayedTyping = '';
  let typingIndex = 0;
  let isTyping = true;
  let showSplash = true;

  let backgroundVideo: HTMLVideoElement | null = null;
  let videoWorking = false;

  let backgroundAudio: HTMLAudioElement | null = null;
  let isMuted = false;
  let volume = 0.3;
  let savedVolume = 0.3;

  let volumeTimeout: number | null = null;
  const volumeWidth = new Tween(48, { duration: 200, easing: cubicOut });
  const volumeOpacity = new Tween(0, { duration: 150, easing: cubicOut });
  const iconScale = new Tween(1, { duration: 150, easing: cubicOut });

  let hoveredElement: string | null = null;
  let tooltipText = '';
  let tooltipPosition = { x: 0, y: 0 };
  let staticTooltipPosition = { x: 0, y: 0 };
  let lastTooltipUpdate = 0;

  const scaleTelegram = new Tween(1, { duration: 200, easing: cubicOut });
  const scaleGitHub = new Tween(1, { duration: 200, easing: cubicOut });

  const tiltX = new Tween(0, { duration: 400, easing: cubicOut });
  const tiltY = new Tween(0, { duration: 400, easing: cubicOut });

  let cardRef: HTMLDivElement | null = null;
  let cleanupSnow: (() => void) | null = null;

  function clearVolumeTimeout() { if (volumeTimeout) { clearTimeout(volumeTimeout); volumeTimeout = null; } }

  const tweens = { volumeWidth, volumeOpacity, iconScale, scaleTelegram, scaleGitHub, tiltX, tiltY };


  function setupBackground() {
    if (!browser) return;
    
    if (backgroundConfig.useVideo) {
      document.body.classList.remove('background-image');
    } else {
      document.body.classList.add('background-image');
    }
  }

  async function onSplashClick() {
    showSplash = false;
    if (backgroundConfig.useVideo && backgroundVideo) {
      await L.handleSplashClick(() => L.tryPlayVideo(backgroundVideo, (v) => (videoWorking = v)), backgroundAudio, isMuted);
    } else {
      await L.handleSplashClick(() => Promise.resolve(), backgroundAudio, isMuted);
    }
  }

  function onToggleMute() {
    L.toggleMute(
      isMuted, 
      (v) => (isMuted = v), 
      backgroundAudio, 
      tweens,
      savedVolume,
      (v) => (savedVolume = v),
      volume,
      (v) => (volume = v)
    );
  }

  function onVolumeInput(e: Event) {
    const target = e.currentTarget as HTMLInputElement;
    volume = parseFloat(target.value);
    if (!isMuted) {
      savedVolume = volume;
    }
    L.handleVolumeChange(volume, backgroundAudio, isMuted, tweens);
  }

  function onMedalEnter(m: Medal, e: MouseEvent) {
    hoveredElement = 'medal';
    tooltipText = m.name;
    tooltipPosition = L.updateTooltipPosition(e);
  }

  function onMedalLeave() {
    hoveredElement = null;
    tooltipText = '';
  }

  function onMedalMove(e: MouseEvent) {
    if (hoveredElement === 'medal') {
      const now = Date.now();
      if (now - lastTooltipUpdate > 16) {
        tooltipPosition = L.updateTooltipPosition(e);
        lastTooltipUpdate = now;
      }
    }
  }

  function onNameEnter(e: MouseEvent) {
    hoveredElement = 'name';
    tooltipText = 'UID 1';
    if (e.currentTarget instanceof HTMLElement) {
      const rect = e.currentTarget.getBoundingClientRect();
      staticTooltipPosition = {
        x: rect.left + rect.width / 2,
        y: rect.top - 15
      };
    }
  }

  function onNameLeave() {
    hoveredElement = null;
    tooltipText = '';
  }

  function onCardMouseMove(e: MouseEvent) { L.handleMouseMove(e, cardRef, tweens); }
  function onCardMouseLeave() { L.resetTilt(tweens); }

  function onTelegramEnter() { L.scaleUp(scaleTelegram); }
  function onTelegramLeave() { L.scaleDown(scaleTelegram); }
  function onGitHubEnter() { L.scaleUp(scaleGitHub); }
  function onGitHubLeave() { L.scaleDown(scaleGitHub); }

  function onVolumeEnter() { L.handleVolumeMouseEnter(tweens, clearVolumeTimeout); }
  function onVolumeLeave() { L.handleVolumeMouseLeave(tweens, (id) => (volumeTimeout = id)); }

  function openLink(url: string) { L.handleButtonClick(url); }

  onMount(() => {
    setupBackground();
    const { backgroundAudio: audio } = L.initBackgroundMusic(volume);
    backgroundAudio = audio;
    isTyping = true;
    L.startTypingCycle(
      () => isTyping,
      typingTexts,
      () => typingIndex,
      (n) => (typingIndex = n),
      (s) => (displayedTyping = s)
    );
    cleanupSnow = L.createSnowflakes();
  });

  onDestroy(() => {
    isTyping = false;
    if (volumeTimeout) clearTimeout(volumeTimeout);
    if (cleanupSnow) { cleanupSnow(); cleanupSnow = null; }
    if (backgroundAudio) { backgroundAudio.pause(); backgroundAudio.src = ''; backgroundAudio = null; }
    if (backgroundVideo) { backgroundVideo.pause(); backgroundVideo.src = ''; backgroundVideo = null; }
  });
</script>

<svelte:head>
  <title>Jengal</title>
  <meta name="description" content="Jengal - Backend developer" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</svelte:head>


{#if backgroundConfig.useVideo}
  <video bind:this={backgroundVideo} class="background-video" class:working={videoWorking} muted loop playsinline>
    <source src={backgroundConfig.videoSrc} type="video/mp4" />
  </video>
{/if}

<div class="overlay"></div>

<div
  class="volume-control"
  style="width: {volumeWidth.current}px; --volume: {volume}"
  on:mouseenter={onVolumeEnter}
  on:mouseleave={onVolumeLeave}
>
  <div class="volume-icon-container" on:click={onToggleMute}>
    <div class="volume-icon" style="transform: scale({iconScale.current})">
      {#if isMuted}
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <path d="M3.63 3.63a.996.996 0 0 0 0 1.41L7.29 8.7 7 9H4c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1h3l3.29 3.29c.63.63 1.71.18 1.71-.71v-4.17l4.18 4.18c-.49.37-1.02.68-1.6.91-.36.15-.58.53-.58.92 0 .72.73 1.18 1.39.91.8-.33 1.55-.77 2.22-1.31l4.18 4.18a.996.996 0 1 0 1.41-1.41L5.05 3.63c-.39-.39-1.02-.39-1.42 0zM19 12c0 .82-.15 1.61-.41 2.34l1.53 1.53c.56-1.17.88-2.48.88-3.87 0-3.83-2.4-7.11-5.78-8.4-.59-.23-1.22.23-1.22.86v.19c0 .38.25.71.61.85C17.18 6.54 19 9.06 19 12zm-8.71-6.29l-.17.17L12 7.76V6.41c0-.89-1.08-1.33-1.71-.7zM16.5 12c0-1.77-1.02-3.29-2.5-4.03v1.79l2.48 2.48c.01-.08.02-.16.02-.24z"/>
        </svg>
      {:else}
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
        </svg>
      {/if}
    </div>
  </div>
  <div class="volume-slider-wrapper" style="opacity: {volumeOpacity.current}">
    <input type="range" min="0" max="1" step="0.01" class="volume-slider" bind:value={volume} on:input={onVolumeInput} />
  </div>
</div>

{#if showSplash}
  <button class="splash-screen" on:click={onSplashClick} type="button">
    <div class="splash-text">click to enter...</div>
  </button>
{/if}

<main on:mousemove={onCardMouseMove} on:mouseleave={onCardMouseLeave}>
  <div class="card" bind:this={cardRef} style="transform: perspective(1000px) rotateX({tiltX.current}deg) rotateY({tiltY.current}deg);">
    <h1 on:mouseenter={onNameEnter} on:mouseleave={onNameLeave}>{mainName}</h1>

    <div class="medals-bar">
      {#each medals as medal}
        <span
          class="medal"
          data-medal={medal.id}
          on:mouseenter={(e) => onMedalEnter(medal, e)}
          on:mouseleave={onMedalLeave}
          on:mousemove={onMedalMove}>
          <img src={medal.src} alt={medal.id} />
        </span>
      {/each}
    </div>

    <h2>{displayedTyping}</h2>

    <div class="links">
      <button
        class="btn telegram-btn"
        on:mouseenter={onTelegramEnter}
        on:mouseleave={onTelegramLeave}
        on:click={() => openLink(links[0].url)}
        style="transform: scale({scaleTelegram.current})">
        <svg class="icon" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
        Telegram
      </button>

      <button
        class="btn github-btn"
        on:mouseenter={onGitHubEnter}
        on:mouseleave={onGitHubLeave}
        on:click={() => openLink(links[1].url)}
        style="transform: scale({scaleGitHub.current})">
        <svg class="icon" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
        GitHub
      </button>
    </div>
  </div>

  {#if hoveredElement && tooltipText}
    <div
      class="tooltip"
      style="left: {hoveredElement === 'name' ? staticTooltipPosition.x : tooltipPosition.x}px; top: {hoveredElement === 'name' ? staticTooltipPosition.y : tooltipPosition.y}px;">
      {tooltipText}
    </div>
  {/if}
</main>
