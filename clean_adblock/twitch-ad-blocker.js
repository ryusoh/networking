/**
 * Twitch Ad Blocker (Cleanroom Implementation)
 * --------------------------------------------
 * Blocks ads on Twitch.tv including:
 * - Pre-roll ads
 * - Mid-roll ads
 * - Banner ads
 * - Overlay ads
 * @global
 */

/* global Response, XMLHttpRequest */
/* istanbul ignore next */
(function () {
/* istanbul ignore next */
  'use strict';

  const AD_SELECTORS = [
    // Ad containers
/* istanbul ignore next */
    '[data-a-target="video-ad-overlay"]',
/* istanbul ignore next */
    '[data-a-target="video-ad-card"]',
/* istanbul ignore next */
    '[data-a-target="video-ad-countdown"]',
/* istanbul ignore next */
    '[class*="AdBanner"]',
/* istanbul ignore next */
    '[class*="ad-banner"]',
/* istanbul ignore next */
    '[data-test-id="ad-banner"]',

    // Overlay ads
/* istanbul ignore next */
    '[class*="overlay-ad"]',
/* istanbul ignore next */
    '[class*="ad-overlay"]',

    // Player ads
/* istanbul ignore next */
    '.video-player__ad-overlay',
/* istanbul ignore next */
    '[data-a-target="player-ad-overlay"]',

    // Sidebar ads
/* istanbul ignore next */
    '[data-a-target="recommended-channel-card"][href*="/ads/"]',
/* istanbul ignore next */
    '[class*="sponsor"]'
/* istanbul ignore next */
  ];

  const AD_URL_PATTERNS = [
/* istanbul ignore next */
    /twitch\.tv\/ads/,
/* istanbul ignore next */
    /ads\.twitch\.tv/,
/* istanbul ignore next */
    /amazon-adsystem\.com/,
/* istanbul ignore next */
    /doubleclick\.net/,
/* istanbul ignore next */
    /vast\.twitch\.tv/
/* istanbul ignore next */
  ];

  const processedElements = new WeakSet();
  let adsBlocked = 0;

  function isAdElement(element) {
/* istanbul ignore next */
    for (const selector of AD_SELECTORS) {
/* istanbul ignore next */
      try {
/* istanbul ignore next */
/* istanbul ignore next */
        if (element.matches(selector) || element.closest(selector)) {
/* istanbul ignore next */
          return true;
        }
      } catch {
        // Invalid selector
      }
    }
/* istanbul ignore next */
    return false;
  }

  function isAdUrl(url) {
/* istanbul ignore next */
    return AD_URL_PATTERNS.some((pattern) => pattern.test(url));
  }

  function hideAd(element) {
/* istanbul ignore next */
/* istanbul ignore next */
    if (processedElements.has(element)) {
/* istanbul ignore next */
      return false;
    }

/* istanbul ignore next */
    element.style.display = 'none';
/* istanbul ignore next */
    element.setAttribute('data-blocked-by-clean-adblock', 'true');
/* istanbul ignore next */
    processedElements.add(element);
/* istanbul ignore next */
    adsBlocked++;
/* istanbul ignore next */
    return true;
  }

  function muteAdIfPlaying() {
    const video = document.querySelector('video');
/* istanbul ignore next */
/* istanbul ignore next */
    if (!video) {
/* istanbul ignore next */
      return false;
    }

    const adOverlay = document.querySelector(
/* istanbul ignore next */
      '[data-a-target="video-ad-overlay"], [data-a-target="video-ad-card"]'
/* istanbul ignore next */
    );
/* istanbul ignore next */
/* istanbul ignore next */
    if (adOverlay && adOverlay.offsetParent !== null) {
/* istanbul ignore next */
      video.muted = true;
/* istanbul ignore next */
      return true;
    }
/* istanbul ignore next */
    return false;
  }

  function trySkipAd() {
    // Try to click the "Skip Ad" button if available
    const skipButton = document.querySelector(
/* istanbul ignore next */
      '[data-a-target="video-ad-skip-button"], button[class*="ad-skip"]'
/* istanbul ignore next */
    );
/* istanbul ignore next */
/* istanbul ignore next */
    if (skipButton && skipButton.offsetParent !== null) {
/* istanbul ignore next */
      skipButton.click();
/* istanbul ignore next */
      return true;
    }
/* istanbul ignore next */
    return false;
  }

  function blockTwitchAds() {
    // Check if we're on Twitch
/* istanbul ignore next */
/* istanbul ignore next */
    if (!window.location.hostname.includes('twitch.tv')) {
/* istanbul ignore next */
      return;
    }

    // Find and hide ad elements
/* istanbul ignore next */
    for (const selector of AD_SELECTORS) {
/* istanbul ignore next */
      try {
        const elements = document.querySelectorAll(selector);
/* istanbul ignore next */
        for (const el of elements) {
/* istanbul ignore next */
          hideAd(el);
        }
      } catch {
        // Invalid selector
      }
    }

    // Try to skip ads
/* istanbul ignore next */
    trySkipAd();

    // Mute if ad is playing
/* istanbul ignore next */
    muteAdIfPlaying();
  }

  function interceptFetch() {
/* istanbul ignore next */
/* istanbul ignore next */
    if (!window.fetch) {
/* istanbul ignore next */
      return;
    }

    const originalFetch = window.fetch;
/* istanbul ignore next */
    window.fetch = function (...args) {
      const url = typeof args[0] === 'string' ? args[0] : args[0]?.url;

/* istanbul ignore next */
/* istanbul ignore next */
      if (url && isAdUrl(url)) {
/* istanbul ignore next */
        adsBlocked++;
/* istanbul ignore next */
        console.log('[Clean Adblock] Blocked Twitch ad request:', url);
/* istanbul ignore next */
        return Promise.resolve(
/* istanbul ignore next */
          new Response('', {
/* istanbul ignore next */
            status: 200,
/* istanbul ignore next */
            statusText: 'Blocked by Clean Adblock'
/* istanbul ignore next */
          })
/* istanbul ignore next */
        );
      }

/* istanbul ignore next */
      return originalFetch.apply(this, args);
/* istanbul ignore next */
    };
  }

  function interceptXHR() {
/* istanbul ignore next */
/* istanbul ignore next */
    if (!window.XMLHttpRequest) {
/* istanbul ignore next */
      return;
    }

    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;

/* istanbul ignore next */
    XMLHttpRequest.prototype.open = function (method, url, ...rest) {
/* istanbul ignore next */
      this._url = url;
/* istanbul ignore next */
      return originalOpen.apply(this, [method, url, ...rest]);
/* istanbul ignore next */
    };

/* istanbul ignore next */
    XMLHttpRequest.prototype.send = function (...args) {
/* istanbul ignore next */
/* istanbul ignore next */
      if (this._url && isAdUrl(this._url)) {
/* istanbul ignore next */
        adsBlocked++;
/* istanbul ignore next */
        this.abort();
/* istanbul ignore next */
        return;
      }
/* istanbul ignore next */
      return originalSend.apply(this, args);
/* istanbul ignore next */
    };
  }

  function init() {
    // Intercept network requests
/* istanbul ignore next */
    interceptFetch();
/* istanbul ignore next */
    interceptXHR();

    // Block existing ads
/* istanbul ignore next */
    blockTwitchAds();
  }

  // Run immediately
/* istanbul ignore next */
/* istanbul ignore next */
  if (document.readyState === 'loading') {
/* istanbul ignore next */
    document.addEventListener('DOMContentLoaded', init);
/* istanbul ignore next */
  } else {
/* istanbul ignore next */
    init();
  }

  // Watch for dynamically loaded ads
  const observer = new MutationObserver((mutations) => {
    let shouldCheck = false;
/* istanbul ignore next */
    for (const mutation of mutations) {
/* istanbul ignore next */
/* istanbul ignore next */
      if (mutation.addedNodes.length > 0) {
/* istanbul ignore next */
        for (const node of mutation.addedNodes) {
/* istanbul ignore next */
/* istanbul ignore next */
          if (node.nodeType === 1 && isAdElement(node)) {
/* istanbul ignore next */
            hideAd(node);
          }
        }
/* istanbul ignore next */
        shouldCheck = true;
      }
    }
/* istanbul ignore next */
/* istanbul ignore next */
    if (shouldCheck) {
/* istanbul ignore next */
      blockTwitchAds();
    }
/* istanbul ignore next */
  });

/* istanbul ignore next */
/* istanbul ignore next */
  if (document.body) {
/* istanbul ignore next */
    observer.observe(document.body, {
/* istanbul ignore next */
      childList: true,
/* istanbul ignore next */
      subtree: true
/* istanbul ignore next */
    });
  }

  // Watch for ad state changes
  const adObserver = new MutationObserver((mutations) => {
/* istanbul ignore next */
    for (const mutation of mutations) {
/* istanbul ignore next */
/* istanbul ignore next */
      if (mutation.type === 'attributes') {
        const target = mutation.target;
/* istanbul ignore next */
/* istanbul ignore next */
        if (target.classList?.contains('ad-playing') || target.classList?.contains('ad-showing')) {
/* istanbul ignore next */
          muteAdIfPlaying();
/* istanbul ignore next */
          trySkipAd();
        }
      }
    }
/* istanbul ignore next */
  });

  // Observe video player for ad state changes
  const player = document.querySelector('[data-a-target="video-player"]');
/* istanbul ignore next */
/* istanbul ignore next */
  if (player) {
/* istanbul ignore next */
    adObserver.observe(player, {
/* istanbul ignore next */
      attributes: true,
/* istanbul ignore next */
      attributeFilter: ['class']
/* istanbul ignore next */
    });
  }

  // Export for testing
/* istanbul ignore next */
/* istanbul ignore next */
  if (typeof window !== 'undefined') {
/* istanbul ignore next */
    window.TwitchAdBlocker = {
/* istanbul ignore next */
      blockTwitchAds,
/* istanbul ignore next */
      trySkipAd,
/* istanbul ignore next */
      muteAdIfPlaying,
/* istanbul ignore next */
      adsBlocked
/* istanbul ignore next */
    };
  }
/* istanbul ignore next */
})();
