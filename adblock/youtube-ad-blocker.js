/**
 * YouTube Ad Blocker (Cleanroom Implementation)
 * ---------------------------------------------
 * Blocks ads on YouTube including:
 * - Video ads (pre-roll, mid-roll, post-roll)
 * - Banner ads
 * - Overlay ads
 * - Sponsored cards
 */

(function () {
  'use strict';

  const AD_SELECTORS_JOINED = [
    '.ad-showing',
    '.video-ads',
    'ytd-ad-slot-renderer',
    'ytd-promoted-video-renderer',
    'ytd-compact-promoted-video-renderer',
    '.ytd-promoted-sparkles-web-renderer',
    '#masthead-ad',
    '#player-ads',
    'ytd-statement-banner-renderer',
    '.ytp-ad-overlay-container',
    '.ytp-ad-image-overlay',
    '.ytp-ad-text-overlay',
    '[class*="promoted"]'
  ].join(',');

  const AD_ATTRIBUTE_KEYS = [
    'data-ad-impressions',
    'data-ad-url',
    'data-visiting',
    'data-renderer-type'
  ];

  const processedElements = new WeakSet();
  let adBlockedCount = 0;

  /**
   * @param {HTMLElement} element
   * @returns {boolean}
   */
  function hasAdClass(element) {
    const className = element.className || '';
    return className.includes('ad-showing') || className.includes('video-ads');
  }

  /**
   * @param {HTMLElement} element
   * @returns {boolean}
   */
  function hasAdAttribute(element) {
    for (let i = 0; i < AD_ATTRIBUTE_KEYS.length; i++) {
      if (element.hasAttribute(AD_ATTRIBUTE_KEYS[i])) {
        if (
          AD_ATTRIBUTE_KEYS[i] === 'data-renderer-type' &&
          element.getAttribute('data-renderer-type') !== 'ad'
        ) {
          continue;
        }
        return true;
      }
    }
    return false;
  }

  /**
   * @param {HTMLElement} element
   * @returns {boolean}
   */
  function matchesAdSelector(element) {
    try {
      if (element.matches(AD_SELECTORS_JOINED) || element.closest(AD_SELECTORS_JOINED)) {
        return true;
      }
    } catch {
      // Invalid selector
    }
    return false;
  }

  /**
   * @param {HTMLElement} element
   * @returns {boolean}
   */
  function isAdElement(element) {
    return hasAdClass(element) || hasAdAttribute(element) || matchesAdSelector(element);
  }

  /**
   * @param {HTMLElement} element
   * @returns {boolean}
   */
  function hideAd(element) {
    if (processedElements.has(element)) {
      return false;
    }

    element.style.display = 'none';
    element.setAttribute('data-blocked-by-clean-adblock', 'true');
    processedElements.add(element);
    adBlockedCount++;

    // Also remove parent ad containers if they exist
    const parentAd = element.closest('.ad-showing, .video-ads');
    if (parentAd instanceof HTMLElement && !processedElements.has(parentAd)) {
      parentAd.style.display = 'none';
      processedElements.add(parentAd);
    }

    return true;
  }

  function skipAdIfPlaying() {
    // Try to click the skip ad button
    const skipButton = document.querySelector(
      '.ytp-ad-skip-button, .ytp-ad-skip-button-modern, button.ytp-ad-skip-button'
    );
    if (skipButton instanceof HTMLElement && skipButton.offsetParent !== null) {
      skipButton.click();
      return true;
    }
    return false;
  }

  function muteAdIfPlaying() {
    // Mute ad if skip is not available
    const video = document.querySelector('video');
    if (video && document.querySelector('.ad-showing')) {
      video.muted = true;
      return true;
    }
    return false;
  }

  function blockYouTubeAds() {
    // Check if we're on YouTube
    if (!window.location.hostname.includes('youtube.com')) {
      return;
    }

    // Find and hide ad elements
    try {
      const elements = document.querySelectorAll(AD_SELECTORS_JOINED);
      for (let i = 0; i < elements.length; i++) {
        const el = elements[i];
        if (el instanceof HTMLElement) {
          hideAd(el);
        }
      }
    } catch {
      // Invalid selector
    }

    // Try to skip any playing ads
    skipAdIfPlaying();

    // Check for ad-showing class on video container
    const adContainer = document.querySelector('.ad-showing');
    if (adContainer) {
      muteAdIfPlaying();
    }
  }

  // Run immediately
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', blockYouTubeAds);
  } else {
    blockYouTubeAds();
  }

  // Watch for dynamically loaded ads
  let observerThrottled = false;
  const observer = new MutationObserver((mutations) => {
    if (typeof document === 'undefined' || !document) {
      return;
    }
    let shouldCheck = false;
    for (let i = 0; i < mutations.length; i++) {
      const mutation = mutations[i];
      const addedNodes = mutation.addedNodes;
      if (addedNodes.length > 0) {
        for (let j = 0; j < addedNodes.length; j++) {
          const node = addedNodes[j];
          if (node.nodeType === 1 && isAdElement(/** @type {HTMLElement} */ (node))) {
            hideAd(/** @type {HTMLElement} */ (node));
          }
        }
        shouldCheck = true;
      }
    }
    if (shouldCheck && !observerThrottled) {
      observerThrottled = true;
      setTimeout(() => {
        observerThrottled = false;
        blockYouTubeAds();
      }, 50);
    }
  });

  if (document.body) {
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  // Watch for ad-showing class changes
  const classObserver = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
        const target = mutation.target;
        if (target instanceof HTMLElement && target.classList.contains('ad-showing')) {
          muteAdIfPlaying();
          skipAdIfPlaying();
        }
      }
    }
  });

  // Observe video element for class changes
  const video = document.querySelector('video');
  if (video && video.parentElement) {
    classObserver.observe(video.parentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
  }

  // Export for testing
  if (typeof window !== 'undefined') {
    /** @type {Record<string, unknown>} */ (/** @type {unknown} */ (window))['YouTubeAdBlocker'] = {
      blockYouTubeAds,
      skipAdIfPlaying,
      muteAdIfPlaying,
      adBlockedCount
    };
  }
})();
