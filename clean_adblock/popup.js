/**
 * Bypass: AdBlock Detector - Popup Script
 */

document.addEventListener('DOMContentLoaded', () => {
  if (typeof chrome === 'undefined' || !chrome.storage) {
    return;
  }
  const enabledToggle = document.getElementById('enabled');
  const modeSelect = document.getElementById('mode');
  const scanBtn = document.getElementById('scan');
  const pickerBtn = document.getElementById('picker');

  // Feature toggles
  const featureToggles = {
    cookieBanner: document.getElementById('feature-cookieBanner'),
    socialMedia: document.getElementById('feature-socialMedia'),
    youtube: document.getElementById('feature-youtube'),
    videoStream: document.getElementById('feature-videoStream'),
    twitch: document.getElementById('feature-twitch')
  };

  // Load current settings
  try {
    chrome.storage.sync.get(['enabled', 'mode', 'features'], (prefs) => {
      if (
        typeof chrome === 'undefined' ||
        !chrome.storage ||
        (chrome.runtime && chrome.runtime.lastError)
      ) {
        return;
      }
      enabledToggle.checked = prefs.enabled !== false;
      modeSelect.value = prefs.mode || 'selective';

      // Load feature settings
      const features = prefs.features || {
        cookieBannerBlocker: true,
        socialMediaBlocker: true,
        youtubeAdBlocker: true,
        videoStreamAdBlocker: true,
        twitchAdBlocker: true
      };
      featureToggles.cookieBanner.checked = features.cookieBannerBlocker !== false;
      featureToggles.socialMedia.checked = features.socialMediaBlocker !== false;
      featureToggles.youtube.checked = features.youtubeAdBlocker !== false;
      featureToggles.videoStream.checked = features.videoStreamAdBlocker !== false;
      featureToggles.twitch.checked = features.twitchAdBlocker !== false;
    });
  } catch (e) {
    console.error('Popup sync storage access failed:', e);
  }

  // Save settings on change
  enabledToggle.addEventListener('change', () => {
    try {
      chrome.storage.sync.set({ enabled: enabledToggle.checked });
    } catch (e) {
      console.error('Popup sync storage set failed:', e);
    }
  });

  modeSelect.addEventListener('change', () => {
    try {
      chrome.storage.sync.set({ mode: modeSelect.value });
    } catch (e) {
      console.error('Popup sync storage set failed:', e);
    }
  });

  // Feature toggle handlers
  const featureKeys = {
    cookieBanner: 'cookieBannerBlocker',
    socialMedia: 'socialMediaBlocker',
    youtube: 'youtubeAdBlocker',
    videoStream: 'videoStreamAdBlocker',
    twitch: 'twitchAdBlocker'
  };

  Object.entries(featureToggles).forEach(([key, toggle]) => {
    if (toggle) {
      toggle.addEventListener('change', () => {
        try {
          chrome.storage.sync.get(['features'], (result) => {
            const features = result.features || {
              cookieBannerBlocker: true,
              socialMediaBlocker: true,
              youtubeAdBlocker: true,
              videoStreamAdBlocker: true,
              twitchAdBlocker: true
            };
            features[featureKeys[key]] = toggle.checked;
            chrome.storage.sync.set({ features });
          });
        } catch (e) {
          console.error('Popup feature toggle set failed:', e);
        }
      });
    }
  });

  // Site list buttons
  const addWhitelistBtn = document.getElementById('addWhitelist');
  const addBlacklistBtn = document.getElementById('addBlacklist');
  const addJsBlockBtn = document.getElementById('addJsBlock');

  function updateButtonStates() {
    try {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (
          typeof chrome === 'undefined' ||
          !chrome.tabs ||
          (chrome.runtime && chrome.runtime.lastError)
        ) {
          return;
        }
        if (!tabs || !tabs[0] || !tabs[0].url) {
          return;
        }
        const url = new URL(tabs[0].url);
        const host = url.hostname;
        if (!host) {
          return;
        }

        chrome.storage.sync.get(['whitelist', 'blacklist', 'jsBlocked'], (result) => {
          if (
            typeof chrome === 'undefined' ||
            !chrome.storage ||
            (chrome.runtime && chrome.runtime.lastError)
          ) {
            return;
          }
          const isWhitelisted = (result.whitelist || []).includes(host);
          const isBlacklisted = (result.blacklist || []).includes(host);
          const isJsBlocked = (result.jsBlocked || []).includes(host);

          addWhitelistBtn.textContent = isWhitelisted ? 'Un-Whitelist' : 'Whitelist';
          addBlacklistBtn.textContent = isBlacklisted ? 'Un-Blacklist' : 'Blacklist';
          addJsBlockBtn.textContent = isJsBlocked ? 'Un-Block JS' : 'Block JS';
        });
      });
    } catch (e) {
      console.error('Popup tab query failed:', e);
    }
  }

  function toggleCurrentIn(listKey) {
    try {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (
          typeof chrome === 'undefined' ||
          !chrome.tabs ||
          (chrome.runtime && chrome.runtime.lastError)
        ) {
          return;
        }
        if (!tabs || !tabs[0] || !tabs[0].url) {
          return;
        }
        const url = new URL(tabs[0].url);
        const host = url.hostname;
        if (!host) {
          return;
        }

        chrome.storage.sync.get([listKey], (result) => {
          if (
            typeof chrome === 'undefined' ||
            !chrome.storage ||
            (chrome.runtime && chrome.runtime.lastError)
          ) {
            return;
          }
          const list = result[listKey] || [];
          const index = list.indexOf(host);

          if (index > -1) {
            // Remove if exists
            list.splice(index, 1);
            chrome.storage.sync.set({ [listKey]: list }, () => {
              updateButtonStates();
            });
          } else {
            // Add if not exists
            list.push(host);
            chrome.storage.sync.set({ [listKey]: list }, () => {
              updateButtonStates();
            });
          }
        });
      });
    } catch (e) {
      console.error('Popup toggle current in list failed:', e);
    }
  }

  addWhitelistBtn.addEventListener('click', () => toggleCurrentIn('whitelist'));
  addBlacklistBtn.addEventListener('click', () => toggleCurrentIn('blacklist'));
  addJsBlockBtn.addEventListener('click', () => toggleCurrentIn('jsBlocked'));

  // Initial update
  updateButtonStates();

  // Trigger manual scan
  scanBtn.addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'scan' }, () => {
        if (chrome.runtime.lastError) {
          alert('Error: Could not communicate with page. Please refresh.');
        } else {
          alert('Scan complete!');
        }
      });
    });
  });

  // Start element picker
  pickerBtn.addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        files: ['picker.js']
      });
      window.close();
    });
  });
});
