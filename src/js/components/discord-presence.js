(function () {
  'use strict';

  const CONFIG = {
    FETCH_INTERVAL_MS: 30000,
    FETCH_TIMEOUT_MS: 7000,
    LANYARD_API: (id) => `https://api.lanyard.rest/v1/users/${id}`,
    DEFAULT_USER_ID_PLACEHOLDER: 'YOUR_DISCORD_USER_ID',
    DEFAULT_AVATAR_SIZE: 128,
    
    TEXT: {
      NO_USER_ID_SET: 'No user ID set',
      ADD_DISCORD_ID: 'Add a Discord ID to enable presence',
      OFFLINE: 'Offline',
      NO_ACTIVE_ACTIVITY: 'currently doing nothing',
      DATA_ERROR_TITLE: 'Data error',
      DATA_ERROR_ACTIVITY: 'Unexpected payload',
      USER_NOT_FOUND: 'User not found',
      CHECK_USER_ID: 'Check Discord user ID',
      API_ERROR_TITLE: 'API error',
      CONNECTION_ERROR_TITLE: 'Connection error',
      CONNECTION_ERROR_ACTIVITY: 'See console for details',
      COPY_FAILED_LOG: 'Copy failed'
    },
    
    SELECTORS: {
      META_USER_ID: 'meta[name="discord-user-id"]',
      BADGE: '.discord-presence-badge',
      CARD: '.discord-presence-card',
      AVATAR: '.discord-avatar',
      USERNAME: '.discord-username',
      ACTIVITY: '.discord-activity',
      STATUS_ICON: '.discord-status-icon'
    },
    HIDE_DELAY_MS: 100
  };

  let updateInterval = null;

  const $ = (s) => document.querySelector(s);
  const setText = (el, t) => { if (el && el.textContent !== t) el.textContent = t; };
  const setAttr = (el, k, v) => { if (el && el.getAttribute(k) !== v) el.setAttribute(k, v); };
  const setSrc = (img, src) => { if (img && img.src !== src) img.src = src; };

  async function copyToClipboard(text) {
    if (!text) return false;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch (e) {}
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      return true;
    } catch (err) {
      console.error(CONFIG.TEXT.COPY_FAILED_LOG, err);
      return false;
    }
  }

  async function fetchWithTimeout(url, timeout = CONFIG.FETCH_TIMEOUT_MS) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    try {
      return await fetch(url, { signal: controller.signal, cache: 'no-store' });
    } finally {
      clearTimeout(id);
    }
  }

  function activityText(data = {}) {
    const status = data.discord_status || 'offline';
    if (status === 'offline') return CONFIG.TEXT.OFFLINE;
    if (data.listening_to_spotify && data.spotify) {
      const s = data.spotify;
      return `Listening to ${s.song} by ${s.artist}`;
    }
    const activities = Array.isArray(data.activities) ? data.activities : [];
    if (!activities.length) return CONFIG.TEXT.NO_ACTIVE_ACTIVITY;
    const nonCustom = activities.find(a => a.type !== 4);
    const custom = activities.find(a => a.type === 4);
    if (nonCustom) {
      switch (nonCustom.type) {
        case 0: return `Playing ${nonCustom.name}`;
        case 1: return `Streaming ${nonCustom.name}`;
        case 2: return `Listening to ${nonCustom.name}`;
        case 3: return `Watching ${nonCustom.name}`;
        case 5: return `Competing in ${nonCustom.name}`;
        default: return nonCustom.name || 'Active';
      }
    }
    return (custom && (custom.state || custom.name)) || CONFIG.TEXT.NO_ACTIVE_ACTIVITY;
  }

  function updateUI(elements, data) {
    if (!data) return;
    const user = data.discord_user || {};
    if (elements.avatar) {
      const isAnimated = typeof user.avatar === 'string' && user.avatar.startsWith('a_');
      const ext = isAnimated ? 'gif' : 'png';
      const avatarUrl = user.avatar
        ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${ext}?size=${CONFIG.DEFAULT_AVATAR_SIZE}`
        : `https://cdn.discordapp.com/embed/avatars/${Number(user.discriminator || 0) % 5}.png`;
      setSrc(elements.avatar, avatarUrl);
      setAttr(elements.avatar, 'alt', `${user.username || 'User'} avatar`);
    }
    if (elements.username) {
      const display = user.display_name || user.global_name || (user.username ? `${user.username}#${user.discriminator}` : 'Unknown user');
      setText(elements.username, display);
    }
    if (elements.statusIcon) {
      const apiStatus = data.discord_status || 'offline';
      elements.statusIcon.className = `discord-status-icon ${apiStatus === 'offline' ? 'invisible' : apiStatus}`;
    }
    if (elements.activity) setText(elements.activity, activityText(data));
  }

  function getUserIdFromDom() {
    return $(CONFIG.SELECTORS.META_USER_ID)?.content
      || $(CONFIG.SELECTORS.BADGE)?.dataset.userId
      || null;
  }

  function initDiscordPresence() {
    const badge = $(CONFIG.SELECTORS.BADGE);
    const card = $(CONFIG.SELECTORS.CARD);
    if (!badge || !card) return;

    if (!badge.hasAttribute('tabindex')) badge.setAttribute('tabindex', '0');

    const elements = {
      avatar: $(CONFIG.SELECTORS.AVATAR),
      username: $(CONFIG.SELECTORS.USERNAME),
      activity: $(CONFIG.SELECTORS.ACTIVITY),
      statusIcon: $(CONFIG.SELECTORS.STATUS_ICON)
    };

    let lastPayloadJson = null;
    let hideTimer = null;

    const showCard = () => { clearTimeout(hideTimer); card.classList.add('visible'); };
    const hideCard = () => { hideTimer = setTimeout(() => card.classList.remove('visible'), CONFIG.HIDE_DELAY_MS); };

    async function fetchDiscordData() {
      const userId = getUserIdFromDom();
      if (!userId || userId === CONFIG.DEFAULT_USER_ID_PLACEHOLDER) {
        setText(elements.username, CONFIG.TEXT.NO_USER_ID_SET);
        setText(elements.activity, CONFIG.TEXT.ADD_DISCORD_ID);
        return;
      }
      try {
        const res = await fetchWithTimeout(CONFIG.LANYARD_API(userId));
        if (!res) throw new Error('No response');
        if (res.ok) {
          const json = await res.json();
          if (json?.success && json?.data) {
            const j = JSON.stringify(json.data);
            if (j !== lastPayloadJson) {
              lastPayloadJson = j;
              updateUI(elements, json.data);
            }
            return;
          }
          setText(elements.username, CONFIG.TEXT.DATA_ERROR_TITLE);
          setText(elements.activity, CONFIG.TEXT.DATA_ERROR_ACTIVITY);
          return;
        }
        if (res.status === 404) {
          setText(elements.username, CONFIG.TEXT.USER_NOT_FOUND);
          setText(elements.activity, CONFIG.TEXT.CHECK_USER_ID);
        } else {
          setText(elements.username, CONFIG.TEXT.API_ERROR_TITLE);
          setText(elements.activity, `Status: ${res.status}`);
        }
      } catch (err) {
        setText(elements.username, CONFIG.TEXT.CONNECTION_ERROR_TITLE);
        setText(elements.activity, CONFIG.TEXT.CONNECTION_ERROR_ACTIVITY);
        console.error('Lanyard fetch error', err);
      }
    }

    badge.addEventListener('dblclick', async (e) => {
      e.preventDefault();
      try {
        const data = lastPayloadJson ? JSON.parse(lastPayloadJson) : null;
        const userId = data?.discord_user?.id;
        if (!userId) return;
        const url = `https://discord.com/users/${userId}`;
        await copyToClipboard(url);
      } catch (err) {
        console.error(CONFIG.TEXT.COPY_FAILED_LOG, err);
      }
    });

    ['mouseenter', 'focus'].forEach(ev => badge.addEventListener(ev, showCard));
    ['mouseleave'].forEach(ev => badge.addEventListener(ev, hideCard));
    card.addEventListener('mouseenter', () => clearTimeout(hideTimer));
    card.addEventListener('mouseleave', hideCard);
    badge.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') { card.classList.remove('visible'); badge.blur(); }
    });
    
    fetchDiscordData();
    if (updateInterval) clearInterval(updateInterval);
    updateInterval = setInterval(fetchDiscordData, CONFIG.FETCH_INTERVAL_MS);

    window.addEventListener('beforeunload', () => {
      if (updateInterval) { clearInterval(updateInterval); updateInterval = null; }
    });
  }

  if (typeof module !== 'undefined' && module.exports) module.exports = { initDiscordPresence };
  else window.initDiscordPresence = initDiscordPresence;
})();
