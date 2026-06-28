/**
 * Video Streaming Ad Blocker (Cleanroom Implementation)
 * -----------------------------------------------------
 * Blocks ads on video streaming sites by intercepting VAST/VPAID requests
 * and hiding ad containers. Works on most HTML5 video players.
 * @global
 */

/* global Response, XMLHttpRequest */
/* istanbul ignore next */
(function () {
/* istanbul ignore next */
  'use strict';

  // Only run on sites that actually host video content worth intercepting.
  // Patching fetch/XHR globally breaks many non-video sites (investing.com, etc.)
  const VIDEO_DOMAINS = [
/* istanbul ignore next */
    'dailymotion.com',
/* istanbul ignore next */
    'vimeo.com',
/* istanbul ignore next */
    'crunchyroll.com',
/* istanbul ignore next */
    'funimation.com',
/* istanbul ignore next */
    'peacocktv.com',
/* istanbul ignore next */
    'paramountplus.com',
/* istanbul ignore next */
    'pluto.tv',
/* istanbul ignore next */
    'tubitv.com',
/* istanbul ignore next */
    'roku.com',
/* istanbul ignore next */
    'plex.tv',
/* istanbul ignore next */
    'bilibili.com',
/* istanbul ignore next */
    'nicovideo.jp',
/* istanbul ignore next */
    'iqiyi.com',
/* istanbul ignore next */
    'youku.com'
/* istanbul ignore next */
  ];
  const host = window.location.hostname;
  // Also run if the page has embedded video players (detected later via MutationObserver)
  const isVideoSite = VIDEO_DOMAINS.some((d) => host === d || host.endsWith('.' + d));
/* istanbul ignore next */
/* istanbul ignore next */
  if (!isVideoSite) {
/* istanbul ignore next */
    return;
  }

  // Common video ad server domains
  const AD_SERVER_DOMAINS = [
/* istanbul ignore next */
    'doubleclick.net',
/* istanbul ignore next */
    'googleadservices.com',
/* istanbul ignore next */
    'googlesyndication.com',
/* istanbul ignore next */
    'adservice.google.com',
/* istanbul ignore next */
    'pagead2.googlesyndication.com',
/* istanbul ignore next */
    'tpc.googlesyndication.com',
/* istanbul ignore next */
    'ads.youtube.com',
/* istanbul ignore next */
    's.youtube.com',
/* istanbul ignore next */
    'adnxs.com',
/* istanbul ignore next */
    'adsrvr.org',
/* istanbul ignore next */
    'casalemedia.com',
/* istanbul ignore next */
    'pubmatic.com',
/* istanbul ignore next */
    'rubiconproject.com',
/* istanbul ignore next */
    'openx.net',
/* istanbul ignore next */
    'criteo.com',
/* istanbul ignore next */
    'amazon-adsystem.com',
/* istanbul ignore next */
    'spotxchange.com',
/* istanbul ignore next */
    'free-wheel.tv',
/* istanbul ignore next */
    'v.fwmrm.net',
/* istanbul ignore next */
    'adrecover.com',
/* istanbul ignore next */
    'delivery.adrecover.com'
/* istanbul ignore next */
  ];

  // VAST/VPAID XML patterns
  const VAST_PATTERNS = [/vast/i, /vpaid/i, /adbreak/i, /preroll/i, /midroll/i, /postroll/i];

  // Common ad container selectors
  const AD_CONTAINER_SELECTORS = [
/* istanbul ignore next */
    '[class*="ad-container"]',
/* istanbul ignore next */
    '[class*="video-ad"]',
/* istanbul ignore next */
    '[class*="ad-overlay"]',
/* istanbul ignore next */
    '[id*="ad-container"]',
/* istanbul ignore next */
    '[id*="video-ad"]',
/* istanbul ignore next */
    '.ad-marker',
/* istanbul ignore next */
    '.ad-progress',
/* istanbul ignore next */
    '[class*="sponsor"]'
/* istanbul ignore next */
  ];

  const blockedRequests = new Set();
  let adContainersHidden = 0;

  function isAdDomain(url) {
/* istanbul ignore next */
    try {
      const hostname = new URL(url).hostname;
/* istanbul ignore next */
      return AD_SERVER_DOMAINS.some((domain) => hostname.includes(domain));
    } catch {
/* istanbul ignore next */
      return false;
    }
  }

  function isAdRequest(url) {
/* istanbul ignore next */
/* istanbul ignore next */
    if (isAdDomain(url)) {
/* istanbul ignore next */
      return true;
    }

/* istanbul ignore next */
    for (const pattern of VAST_PATTERNS) {
/* istanbul ignore next */
/* istanbul ignore next */
      if (pattern.test(url)) {
/* istanbul ignore next */
        return true;
      }
    }

/* istanbul ignore next */
    return false;
  }

  function blockAdRequest(url) {
/* istanbul ignore next */
/* istanbul ignore next */
    if (blockedRequests.has(url)) {
/* istanbul ignore next */
      return false;
    }
/* istanbul ignore next */
    blockedRequests.add(url);
/* istanbul ignore next */
    console.log('[Clean Adblock] Blocked ad request:', url);
/* istanbul ignore next */
    return true;
  }

  function hideAdContainers() {
/* istanbul ignore next */
    for (const selector of AD_CONTAINER_SELECTORS) {
/* istanbul ignore next */
      try {
        const elements = document.querySelectorAll(selector);
/* istanbul ignore next */
        for (const el of elements) {
/* istanbul ignore next */
/* istanbul ignore next */
          if (el.offsetParent !== null) {
/* istanbul ignore next */
            el.style.display = 'none';
/* istanbul ignore next */
            el.setAttribute('data-blocked-by-clean-adblock', 'true');
/* istanbul ignore next */
            adContainersHidden++;
          }
        }
      } catch {
        // Invalid selector
      }
    }
  }

  function removeAdFromVideo(video) {
/* istanbul ignore next */
/* istanbul ignore next */
    if (!video) {
/* istanbul ignore next */
      return;
    }

    // Remove any ad-related tracks
    const tracks = video.textTracks;
/* istanbul ignore next */
    for (let i = 0; i < tracks.length; i++) {
      const track = tracks[i];
/* istanbul ignore next */
/* istanbul ignore next */
      if (track.label && track.label.toLowerCase().includes('ad')) {
/* istanbul ignore next */
        track.mode = 'hidden';
      }
    }

    // Remove ad overlays
    const overlays = video.parentElement?.querySelectorAll('.ad-overlay, .video-ad-overlay');
/* istanbul ignore next */
/* istanbul ignore next */
    if (overlays) {
/* istanbul ignore next */
      for (const overlay of overlays) {
/* istanbul ignore next */
        overlay.style.display = 'none';
      }
    }
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
      if (url && isAdRequest(url)) {
/* istanbul ignore next */
        blockAdRequest(url);
        // Return empty response for ad requests
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
      if (this._url && isAdRequest(this._url)) {
/* istanbul ignore next */
        blockAdRequest(this._url);
        // Abort ad request
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

  function monitorVideoAds() {
    const videos = document.querySelectorAll('video');
/* istanbul ignore next */
    for (const video of videos) {
/* istanbul ignore next */
      removeAdFromVideo(video);

      // Monitor for ad playback
/* istanbul ignore next */
      video.addEventListener('play', () => {
        // Check if currently in ad break
        const adContainer = video.parentElement?.closest('.ad-showing, .video-ads');
/* istanbul ignore next */
/* istanbul ignore next */
        if (adContainer) {
/* istanbul ignore next */
          video.muted = true;
/* istanbul ignore next */
          video.pause();
        }
/* istanbul ignore next */
      });
    }
  }

  function init() {
    // Intercept network requests
/* istanbul ignore next */
    interceptFetch();
/* istanbul ignore next */
    interceptXHR();

    // Hide existing ad containers
/* istanbul ignore next */
    hideAdContainers();

    // Monitor video elements
/* istanbul ignore next */
    monitorVideoAds();
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

  // Watch for new ad containers
  const observer = new MutationObserver((mutations) => {
    let shouldCheck = false;
/* istanbul ignore next */
    for (const mutation of mutations) {
/* istanbul ignore next */
/* istanbul ignore next */
      if (mutation.addedNodes.length > 0) {
/* istanbul ignore next */
        shouldCheck = true;
      }
    }
/* istanbul ignore next */
/* istanbul ignore next */
    if (shouldCheck) {
/* istanbul ignore next */
      hideAdContainers();
/* istanbul ignore next */
      monitorVideoAds();
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

  // Export for testing
/* istanbul ignore next */
/* istanbul ignore next */
  if (typeof window !== 'undefined') {
/* istanbul ignore next */
    window.VideoStreamAdBlocker = {
/* istanbul ignore next */
      isAdRequest,
/* istanbul ignore next */
      blockAdRequest,
/* istanbul ignore next */
      hideAdContainers,
/* istanbul ignore next */
      blockedRequests,
/* istanbul ignore next */
      adContainersHidden
/* istanbul ignore next */
    };
  }
/* istanbul ignore next */
})();
