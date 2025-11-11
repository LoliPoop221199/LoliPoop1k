document.addEventListener('DOMContentLoaded', () => {
    // Initially hide elements that will be animated
    const card = document.querySelector('.card');
    const musicPlayer = document.querySelector('.music-player');
    const volumeButton = document.querySelector('.volume-control-wrapper');
    
    if (card) {
        card.style.opacity = '0';
        card.style.transform = 'translateY(-50px)';
        card.style.transition = 'none';
    }
    
    if (musicPlayer) {
        musicPlayer.style.opacity = '0';
        musicPlayer.style.transform = 'translateY(50px)';
        musicPlayer.style.transition = 'none';
    }
    
    if (volumeButton) {
        volumeButton.style.opacity = '0';
        volumeButton.style.transform = 'translateX(-50px)';
        volumeButton.style.transition = 'none';
    }
    
    initEntrySequence();
    initGlobalRipple();
    initBackgroundEffects();
    initMusicPlayer();
    initVolumeControl();
    initDiscordPresence();
});