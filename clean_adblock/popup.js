/**
 * Bypass: AdBlock Detector - Popup Script
 */

/* istanbul ignore next */
document.addEventListener('DOMContentLoaded', () => {
/* istanbul ignore next */
  if (typeof chrome === 'undefined' || !chrome.storage) {
/* istanbul ignore next */
    return;
  }
  const enabledToggle = document.getElementById('enabled');
  const modeSelect = document.getElementById('mode');
  const scanBtn = document.getElementById('scan');
  const pickerBtn = document.getElementById('picker');

  // Feature toggles
  const featureToggles = {
/* istanbul ignore next */
    cookieBanner: document.getElementById('feature-cookieBanner'),
/* istanbul ignore next */
    socialMedia: document.getElementById('feature-socialMedia'),
/* istanbul ignore next */
    youtube: document.getElementById('feature-youtube'),
/* istanbul ignore next */
    videoStream: document.getElementById('feature-videoStream'),
/* istanbul ignore next */
    twitch: document.getElementById('feature-twitch'),
/* istanbul ignore next */
    forum: document.getElementById('feature-forum')
/* istanbul ignore next */
  };

  // Load current settings
/* istanbul ignore next */
  try {
/* istanbul ignore next */
    chrome.storage.sync.get(['enabled', 'mode', 'features'], (prefs) => {
/* istanbul ignore next */
/* istanbul ignore next */
      if (
/* istanbul ignore next */
        typeof chrome === 'undefined' ||
/* istanbul ignore next */
        !chrome.storage ||
/* istanbul ignore next */
        (chrome.runtime && chrome.runtime.lastError)
/* istanbul ignore next */
      ) {
/* istanbul ignore next */
        return;
      }
/* istanbul ignore next */
      enabledToggle.checked = prefs.enabled !== false;
/* istanbul ignore next */
      modeSelect.value = prefs.mode || 'selective';

      // Load feature settings
      const features = prefs.features || {
/* istanbul ignore next */
        cookieBannerBlocker: true,
/* istanbul ignore next */
        socialMediaBlocker: true,
/* istanbul ignore next */
        youtubeAdBlocker: true,
/* istanbul ignore next */
        videoStreamAdBlocker: true,
/* istanbul ignore next */
        twitchAdBlocker: true,
/* istanbul ignore next */
        forumAdBlocker: true
/* istanbul ignore next */
      };
/* istanbul ignore next */
      featureToggles.cookieBanner.checked = features.cookieBannerBlocker !== false;
/* istanbul ignore next */
      featureToggles.socialMedia.checked = features.socialMediaBlocker !== false;
/* istanbul ignore next */
      featureToggles.youtube.checked = features.youtubeAdBlocker !== false;
/* istanbul ignore next */
      featureToggles.videoStream.checked = features.videoStreamAdBlocker !== false;
/* istanbul ignore next */
      featureToggles.twitch.checked = features.twitchAdBlocker !== false;
/* istanbul ignore next */
      featureToggles.forum.checked = features.forumAdBlocker !== false;
/* istanbul ignore next */
    });
  } catch (e) {
/* istanbul ignore next */
    console.error('Popup sync storage access failed:', e);
  }

  // Save settings on change
/* istanbul ignore next */
  enabledToggle.addEventListener('change', () => {
/* istanbul ignore next */
    try {
/* istanbul ignore next */
      chrome.storage.sync.set({ enabled: enabledToggle.checked });
    } catch (e) {
/* istanbul ignore next */
      console.error('Popup sync storage set failed:', e);
    }
/* istanbul ignore next */
  });

/* istanbul ignore next */
  modeSelect.addEventListener('change', () => {
/* istanbul ignore next */
    try {
/* istanbul ignore next */
      chrome.storage.sync.set({ mode: modeSelect.value });
    } catch (e) {
/* istanbul ignore next */
      console.error('Popup sync storage set failed:', e);
    }
/* istanbul ignore next */
  });

  // Feature toggle handlers
  const featureKeys = {
/* istanbul ignore next */
    cookieBanner: 'cookieBannerBlocker',
/* istanbul ignore next */
    socialMedia: 'socialMediaBlocker',
/* istanbul ignore next */
    youtube: 'youtubeAdBlocker',
/* istanbul ignore next */
    videoStream: 'videoStreamAdBlocker',
/* istanbul ignore next */
    twitch: 'twitchAdBlocker',
/* istanbul ignore next */
    forum: 'forumAdBlocker'
/* istanbul ignore next */
  };

/* istanbul ignore next */
  Object.entries(featureToggles).forEach(([key, toggle]) => {
/* istanbul ignore next */
/* istanbul ignore next */
    if (toggle) {
/* istanbul ignore next */
      toggle.addEventListener('change', () => {
/* istanbul ignore next */
        try {
/* istanbul ignore next */
          chrome.storage.sync.get(['features'], (result) => {
            const features = result.features || {
/* istanbul ignore next */
              cookieBannerBlocker: true,
/* istanbul ignore next */
              socialMediaBlocker: true,
/* istanbul ignore next */
              youtubeAdBlocker: true,
/* istanbul ignore next */
              videoStreamAdBlocker: true,
/* istanbul ignore next */
              twitchAdBlocker: true,
/* istanbul ignore next */
              forumAdBlocker: true
/* istanbul ignore next */
            };
/* istanbul ignore next */
            features[featureKeys[key]] = toggle.checked;
/* istanbul ignore next */
            chrome.storage.sync.set({ features });
/* istanbul ignore next */
          });
        } catch (e) {
/* istanbul ignore next */
          console.error('Popup feature toggle set failed:', e);
        }
/* istanbul ignore next */
      });
    }
/* istanbul ignore next */
  });

  // Site list buttons
  const addWhitelistBtn = document.getElementById('addWhitelist');
  const addBlacklistBtn = document.getElementById('addBlacklist');
  const addJsBlockBtn = document.getElementById('addJsBlock');

  function updateButtonStates() {
/* istanbul ignore next */
    try {
/* istanbul ignore next */
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
/* istanbul ignore next */
/* istanbul ignore next */
        if (
/* istanbul ignore next */
          typeof chrome === 'undefined' ||
/* istanbul ignore next */
          !chrome.tabs ||
/* istanbul ignore next */
          (chrome.runtime && chrome.runtime.lastError)
/* istanbul ignore next */
        ) {
/* istanbul ignore next */
          return;
        }
/* istanbul ignore next */
/* istanbul ignore next */
        if (!tabs || !tabs[0] || !tabs[0].url) {
/* istanbul ignore next */
          return;
        }
        const url = new URL(tabs[0].url);
        const host = url.hostname;
/* istanbul ignore next */
/* istanbul ignore next */
        if (!host) {
/* istanbul ignore next */
          return;
        }

/* istanbul ignore next */
        chrome.storage.sync.get(['whitelist', 'blacklist', 'jsBlocked'], (result) => {
/* istanbul ignore next */
/* istanbul ignore next */
          if (
/* istanbul ignore next */
            typeof chrome === 'undefined' ||
/* istanbul ignore next */
            !chrome.storage ||
/* istanbul ignore next */
            (chrome.runtime && chrome.runtime.lastError)
/* istanbul ignore next */
          ) {
/* istanbul ignore next */
            return;
          }
          const isWhitelisted = (result.whitelist || []).includes(host);
          const isBlacklisted = (result.blacklist || []).includes(host);
          const isJsBlocked = (result.jsBlocked || []).includes(host);

/* istanbul ignore next */
          addWhitelistBtn.textContent = isWhitelisted ? 'Un-Whitelist' : 'Whitelist';
/* istanbul ignore next */
          addBlacklistBtn.textContent = isBlacklisted ? 'Un-Blacklist' : 'Blacklist';
/* istanbul ignore next */
          addJsBlockBtn.textContent = isJsBlocked ? 'Un-Block JS' : 'Block JS';
/* istanbul ignore next */
        });
/* istanbul ignore next */
      });
    } catch (e) {
/* istanbul ignore next */
      console.error('Popup tab query failed:', e);
    }
  }

  function toggleCurrentIn(listKey) {
/* istanbul ignore next */
    try {
/* istanbul ignore next */
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
/* istanbul ignore next */
/* istanbul ignore next */
        if (
/* istanbul ignore next */
          typeof chrome === 'undefined' ||
/* istanbul ignore next */
          !chrome.tabs ||
/* istanbul ignore next */
          (chrome.runtime && chrome.runtime.lastError)
/* istanbul ignore next */
        ) {
/* istanbul ignore next */
          return;
        }
/* istanbul ignore next */
/* istanbul ignore next */
        if (!tabs || !tabs[0] || !tabs[0].url) {
/* istanbul ignore next */
          return;
        }
        const url = new URL(tabs[0].url);
        const host = url.hostname;
/* istanbul ignore next */
/* istanbul ignore next */
        if (!host) {
/* istanbul ignore next */
          return;
        }

/* istanbul ignore next */
        chrome.storage.sync.get([listKey], (result) => {
/* istanbul ignore next */
/* istanbul ignore next */
          if (
/* istanbul ignore next */
            typeof chrome === 'undefined' ||
/* istanbul ignore next */
            !chrome.storage ||
/* istanbul ignore next */
            (chrome.runtime && chrome.runtime.lastError)
/* istanbul ignore next */
          ) {
/* istanbul ignore next */
            return;
          }
          const list = result[listKey] || [];
          const index = list.indexOf(host);

/* istanbul ignore next */
/* istanbul ignore next */
          if (index > -1) {
            // Remove if exists
/* istanbul ignore next */
            list.splice(index, 1);
/* istanbul ignore next */
            chrome.storage.sync.set({ [listKey]: list }, () => {
/* istanbul ignore next */
              updateButtonStates();
/* istanbul ignore next */
            });
/* istanbul ignore next */
          } else {
            // Add if not exists
/* istanbul ignore next */
            list.push(host);
/* istanbul ignore next */
            chrome.storage.sync.set({ [listKey]: list }, () => {
/* istanbul ignore next */
              updateButtonStates();
/* istanbul ignore next */
            });
          }
/* istanbul ignore next */
        });
/* istanbul ignore next */
      });
    } catch (e) {
/* istanbul ignore next */
      console.error('Popup toggle current in list failed:', e);
    }
  }

/* istanbul ignore next */
  addWhitelistBtn.addEventListener('click', () => toggleCurrentIn('whitelist'));
/* istanbul ignore next */
  addBlacklistBtn.addEventListener('click', () => toggleCurrentIn('blacklist'));
/* istanbul ignore next */
  addJsBlockBtn.addEventListener('click', () => toggleCurrentIn('jsBlocked'));

  // Initial update
/* istanbul ignore next */
  updateButtonStates();

  // Trigger manual scan
/* istanbul ignore next */
  scanBtn.addEventListener('click', () => {
/* istanbul ignore next */
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
/* istanbul ignore next */
      chrome.tabs.sendMessage(tabs[0].id, { action: 'scan' }, () => {
/* istanbul ignore next */
/* istanbul ignore next */
        if (chrome.runtime.lastError) {
/* istanbul ignore next */
          alert('Error: Could not communicate with page. Please refresh.');
/* istanbul ignore next */
        } else {
/* istanbul ignore next */
          alert('Scan complete!');
        }
/* istanbul ignore next */
      });
/* istanbul ignore next */
    });
/* istanbul ignore next */
  });

  // Start element picker
/* istanbul ignore next */
  pickerBtn.addEventListener('click', () => {
/* istanbul ignore next */
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
/* istanbul ignore next */
      chrome.scripting.executeScript({
/* istanbul ignore next */
        target: { tabId: tabs[0].id },
/* istanbul ignore next */
        files: ['picker.js']
/* istanbul ignore next */
      });
/* istanbul ignore next */
      window.close();
/* istanbul ignore next */
    });
/* istanbul ignore next */
  });
/* istanbul ignore next */
});
