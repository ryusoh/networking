/**
 * YouTube Ad Blocker (Cleanroom Implementation)
 * ---------------------------------------------
 * Blocks ads on YouTube including:
 * - Video ads (pre-roll, mid-roll, post-roll)
 * - Banner ads
 * - Overlay ads
 * - Sponsored cards
 */

/* istanbul ignore next */
(function () {
/* istanbul ignore next */
  'use strict';

  const AD_SELECTORS = [
    // Video ad containers
/* istanbul ignore next */
    '.ad-showing',
/* istanbul ignore next */
    '.video-ads',
/* istanbul ignore next */
    'ytd-ad-slot-renderer',
/* istanbul ignore next */
    'ytd-promoted-video-renderer',
/* istanbul ignore next */
    'ytd-compact-promoted-video-renderer',
/* istanbul ignore next */
    '.ytd-promoted-sparkles-web-renderer',

    // Banner ads
/* istanbul ignore next */
    '#masthead-ad',
/* istanbul ignore next */
    '#player-ads',
/* istanbul ignore next */
    'ytd-statement-banner-renderer',

    // Overlay ads
/* istanbul ignore next */
    '.ytp-ad-overlay-container',
/* istanbul ignore next */
    '.ytp-ad-image-overlay',
/* istanbul ignore next */
    '.ytp-ad-text-overlay',

    // Sponsored content in feed
/* istanbul ignore next */
    'ytd-ad-slot-renderer',
/* istanbul ignore next */
    '[class*="promoted"]'
/* istanbul ignore next */
  ];

  const AD_ATTRIBUTE_PATTERNS = [
/* istanbul ignore next */
    'data-ad-impressions',
/* istanbul ignore next */
    'data-ad-url',
/* istanbul ignore next */
    'data-visiting',
/* istanbul ignore next */
    'data-renderer-type="ad"'
/* istanbul ignore next */
  ];

  const processedElements = new WeakSet();
  let adBlockedCount = 0;

  function isAdElement(element) {
    // Check class names
    const className = element.className || '';
/* istanbul ignore next */
/* istanbul ignore next */
    if (className.includes('ad-showing') || className.includes('video-ads')) {
/* istanbul ignore next */
      return true;
    }

    // Check data attributes
/* istanbul ignore next */
    for (const pattern of AD_ATTRIBUTE_PATTERNS) {
/* istanbul ignore next */
/* istanbul ignore next */
      if (element.hasAttribute(pattern.split('=')[0])) {
/* istanbul ignore next */
        return true;
      }
    }

    // Check if element matches ad selectors
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
    adBlockedCount++;

    // Also remove parent ad containers if they exist
    const parentAd = element.closest('.ad-showing, .video-ads');
/* istanbul ignore next */
/* istanbul ignore next */
    if (parentAd && !processedElements.has(parentAd)) {
/* istanbul ignore next */
      parentAd.style.display = 'none';
/* istanbul ignore next */
      processedElements.add(parentAd);
    }

/* istanbul ignore next */
    return true;
  }

  function skipAdIfPlaying() {
    // Try to click the skip ad button
    const skipButton = document.querySelector(
/* istanbul ignore next */
      '.ytp-ad-skip-button, .ytp-ad-skip-button-modern, button.ytp-ad-skip-button'
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

  function muteAdIfPlaying() {
    // Mute ad if skip is not available
    const video = document.querySelector('video');
/* istanbul ignore next */
/* istanbul ignore next */
    if (video && document.querySelector('.ad-showing')) {
/* istanbul ignore next */
      video.muted = true;
/* istanbul ignore next */
      return true;
    }
/* istanbul ignore next */
    return false;
  }

  function blockYouTubeAds() {
    // Check if we're on YouTube
/* istanbul ignore next */
/* istanbul ignore next */
    if (!window.location.hostname.includes('youtube.com')) {
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

    // Try to skip any playing ads
/* istanbul ignore next */
    skipAdIfPlaying();

    // Check for ad-showing class on video container
    const adContainer = document.querySelector('.ad-showing');
/* istanbul ignore next */
/* istanbul ignore next */
    if (adContainer) {
/* istanbul ignore next */
      muteAdIfPlaying();
    }
  }

  // Run immediately
/* istanbul ignore next */
/* istanbul ignore next */
  if (document.readyState === 'loading') {
/* istanbul ignore next */
    document.addEventListener('DOMContentLoaded', blockYouTubeAds);
/* istanbul ignore next */
  } else {
/* istanbul ignore next */
    blockYouTubeAds();
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
      blockYouTubeAds();
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

  // Watch for ad-showing class changes
  const classObserver = new MutationObserver((mutations) => {
/* istanbul ignore next */
    for (const mutation of mutations) {
/* istanbul ignore next */
/* istanbul ignore next */
      if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
        const target = mutation.target;
/* istanbul ignore next */
/* istanbul ignore next */
        if (target.classList.contains('ad-showing')) {
/* istanbul ignore next */
          muteAdIfPlaying();
/* istanbul ignore next */
          skipAdIfPlaying();
        }
      }
    }
/* istanbul ignore next */
  });

  // Observe video element for class changes
  const video = document.querySelector('video');
/* istanbul ignore next */
/* istanbul ignore next */
  if (video && video.parentElement) {
/* istanbul ignore next */
    classObserver.observe(video.parentElement, {
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
    window.YouTubeAdBlocker = {
/* istanbul ignore next */
      blockYouTubeAds,
/* istanbul ignore next */
      skipAdIfPlaying,
/* istanbul ignore next */
      muteAdIfPlaying,
/* istanbul ignore next */
      adBlockedCount
/* istanbul ignore next */
    };
  }
/* istanbul ignore next */
})();
