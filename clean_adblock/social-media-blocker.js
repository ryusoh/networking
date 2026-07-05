/**
 * Social Media Content Blocker (Cleanroom Implementation)
 * -------------------------------------------------------
 * Blocks sponsored/promoted content on social media platforms.
 * Supports: Facebook, LinkedIn, X (Twitter), Instagram, YouTube, Reddit, Pinterest
 */

(function () {
  'use strict';

  /**
   * @typedef {Object} PlatformConfig
   * @property {string[]} domains
   * @property {string[]} selectors
   * @property {RegExp[]} textPatterns
   */

  /** @type {Object<string, PlatformConfig>} */
  const PLATFORM_CONFIG = {
    facebook: {
      domains: ['facebook.com', 'www.facebook.com', 'm.facebook.com'],
      selectors: ['[data-ad-preview]', 'div[aria-label="Sponsored"]', '[data-adclick]'],
      textPatterns: []
    },
    instagram: {
      domains: ['instagram.com', 'www.instagram.com'],
      selectors: ['[class*="sponsored"]', '[data-testid="social_context"]'],
      textPatterns: [/sponsored/i]
    },
    reddit: {
      domains: ['reddit.com', 'www.reddit.com', 'old.reddit.com', 'new.reddit.com'],
      selectors: ['shreddit-ad', 'faceplate-tracker[click-id="ad"]'],
      textPatterns: []
    },
    pinterest: {
      domains: ['pinterest.com', 'www.pinterest.com'],
      selectors: ['[data-grid-item][data-visual-bookmark="1"]', '[class*="promoted"]'],
      textPatterns: [/promoted/i]
    }
  };

  const processedElements = new WeakSet();
  /** @type {string | null} */
  let currentPlatform = null;

  function detectPlatform() {
    const hostname = window.location.hostname;
    for (const [platform, config] of Object.entries(PLATFORM_CONFIG)) {
      if (config.domains.some((d) => hostname.includes(d))) {
        return platform;
      }
    }
    return null;
  }

  /**
   * @param {{textContent: string | null} | Node} element
   * @param {RegExp[]} patterns
   * @returns {boolean}
   */
  function matchesPattern(element, patterns) {
    const text = element.textContent || '';
    return patterns.some((pattern) => pattern.test(text));
  }

  /**
   * @param {Document | Element} root
   * @returns {HTMLElement[]}
   */
  function findSponsoredContent(root = document) {
    const platform = currentPlatform || detectPlatform();
    if (!platform) {
      return [];
    }

    const config = PLATFORM_CONFIG[platform];
    const results = [];

    for (const selector of config.selectors) {
      try {
        const elements = root.querySelectorAll(selector);
        for (const el of elements) {
          if (!processedElements.has(el) && isVisible(el)) {
            results.push(/** @type {HTMLElement} */ (el));
            processedElements.add(el);
          }
        }
      } catch {
        // Invalid selector
      }
    }

    // Also check by text patterns — only match leaf-level elements to avoid
    // hiding parent containers (textContent includes all descendant text)
    if (config.textPatterns.length > 0) {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, {
        acceptNode: (node) => {
          if (processedElements.has(node) || !isVisible(/** @type {Element} */ (node))) {
            return NodeFilter.FILTER_SKIP;
          }
          // Only match elements with short direct text (likely labels, not containers)
          const directText = Array.from(node.childNodes)
            .filter((n) => n.nodeType === Node.TEXT_NODE)
            .map((n) => (n.textContent || '').trim())
            .join(' ');
          if (
            directText.length > 0 &&
            directText.length < 200 &&
            matchesPattern({ textContent: directText }, config.textPatterns)
          ) {
            return NodeFilter.FILTER_ACCEPT;
          }
          return NodeFilter.FILTER_SKIP;
        }
      });

      let current;
      while ((current = walker.nextNode())) {
        if (current instanceof Element) {
          // Walk up to the nearest post/article container rather than hiding just the label
          const post =
            /** @type {Element} */ (current).closest('article, [role="article"], [data-testid]') ||
            current;
          if (!processedElements.has(post)) {
            results.push(/** @type {HTMLElement} */ (post));
            processedElements.add(post);
          }
        }
      }
    }

    return results;
  }

  /**
   * @param {Element | null} element
   * @returns {boolean}
   */
  function isVisible(element) {
    if (!element) {
      return false;
    }
    const style = window.getComputedStyle(element);
    return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
  }

  /**
   * @param {HTMLElement | Element} element
   */
  function hideElement(element) {
    /** @type {HTMLElement} */ (element).style.display = 'none';
    element.setAttribute('data-blocked-by-clean-adblock', 'true');
  }

  function blockSponsoredContent() {
    currentPlatform = detectPlatform();
    if (!currentPlatform) {
      return;
    }

    const sponsored = findSponsoredContent();
    for (const el of sponsored) {
      hideElement(el);
    }
  }

  // Run immediately
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', blockSponsoredContent);
  } else {
    blockSponsoredContent();
  }

  // Watch for dynamically loaded content
  const observer = new MutationObserver((mutations) => {
    let shouldCheck = false;
    for (const mutation of mutations) {
      if (mutation.addedNodes.length > 0) {
        shouldCheck = true;
      }
    }
    if (shouldCheck) {
      blockSponsoredContent();
    }
  });

  if (document.body) {
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  // Export for testing
  if (typeof window !== 'undefined') {
    /** @type {Record<string, unknown>} */ (/** @type {unknown} */ (window))['SocialMediaBlocker'] =
      {
        detectPlatform,
        findSponsoredContent,
        hideElement,
        PLATFORM_CONFIG
      };
  }
})();
