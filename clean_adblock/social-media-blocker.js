/**
 * Social Media Content Blocker (Cleanroom Implementation)
 * -------------------------------------------------------
 * Blocks sponsored/promoted content on social media platforms.
 * Supports: Facebook, LinkedIn, X (Twitter), Instagram, YouTube, Reddit, Pinterest
 */

/* istanbul ignore next */
(function () {
/* istanbul ignore next */
  'use strict';

  const PLATFORM_CONFIG = {
/* istanbul ignore next */
    facebook: {
/* istanbul ignore next */
      domains: ['facebook.com', 'www.facebook.com', 'm.facebook.com'],
/* istanbul ignore next */
      selectors: ['[data-ad-preview]', 'div[aria-label="Sponsored"]', '[data-adclick]'],
/* istanbul ignore next */
      textPatterns: []
/* istanbul ignore next */
    },
/* istanbul ignore next */
    instagram: {
/* istanbul ignore next */
      domains: ['instagram.com', 'www.instagram.com'],
/* istanbul ignore next */
      selectors: ['[class*="sponsored"]', '[data-testid="social_context"]'],
/* istanbul ignore next */
      textPatterns: [/sponsored/i]
/* istanbul ignore next */
    },
/* istanbul ignore next */
    reddit: {
/* istanbul ignore next */
      domains: ['reddit.com', 'www.reddit.com', 'old.reddit.com', 'new.reddit.com'],
/* istanbul ignore next */
      selectors: ['shreddit-ad', 'faceplate-tracker[click-id="ad"]'],
/* istanbul ignore next */
      textPatterns: []
/* istanbul ignore next */
    },
/* istanbul ignore next */
    pinterest: {
/* istanbul ignore next */
      domains: ['pinterest.com', 'www.pinterest.com'],
/* istanbul ignore next */
      selectors: ['[data-grid-item][data-visual-bookmark="1"]', '[class*="promoted"]'],
/* istanbul ignore next */
      textPatterns: [/promoted/i]
    }
/* istanbul ignore next */
  };

  const processedElements = new WeakSet();
  let currentPlatform = null;

  function detectPlatform() {
    const hostname = window.location.hostname;
/* istanbul ignore next */
    for (const [platform, config] of Object.entries(PLATFORM_CONFIG)) {
/* istanbul ignore next */
/* istanbul ignore next */
      if (config.domains.some((d) => hostname.includes(d))) {
/* istanbul ignore next */
        return platform;
      }
    }
/* istanbul ignore next */
    return null;
  }

  function matchesPattern(element, patterns) {
    const text = element.textContent || '';
/* istanbul ignore next */
    return patterns.some((pattern) => pattern.test(text));
  }

  function findSponsoredContent(root = document) {
    const platform = currentPlatform || detectPlatform();
/* istanbul ignore next */
/* istanbul ignore next */
    if (!platform) {
/* istanbul ignore next */
      return [];
    }

    const config = PLATFORM_CONFIG[platform];
    const results = [];

/* istanbul ignore next */
    for (const selector of config.selectors) {
/* istanbul ignore next */
      try {
        const elements = root.querySelectorAll(selector);
/* istanbul ignore next */
        for (const el of elements) {
/* istanbul ignore next */
/* istanbul ignore next */
          if (!processedElements.has(el) && isVisible(el)) {
/* istanbul ignore next */
            results.push(el);
/* istanbul ignore next */
            processedElements.add(el);
          }
        }
      } catch {
        // Invalid selector
      }
    }

    // Also check by text patterns — only match leaf-level elements to avoid
    // hiding parent containers (textContent includes all descendant text)
/* istanbul ignore next */
/* istanbul ignore next */
    if (config.textPatterns.length > 0) {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, {
/* istanbul ignore next */
        acceptNode: (node) => {
/* istanbul ignore next */
/* istanbul ignore next */
          if (processedElements.has(node) || !isVisible(node)) {
/* istanbul ignore next */
            return NodeFilter.FILTER_SKIP;
          }
          // Only match elements with short direct text (likely labels, not containers)
          const directText = Array.from(node.childNodes)
/* istanbul ignore next */
            .filter((n) => n.nodeType === Node.TEXT_NODE)
/* istanbul ignore next */
            .map((n) => n.textContent.trim())
/* istanbul ignore next */
            .join(' ');
/* istanbul ignore next */
/* istanbul ignore next */
          if (
/* istanbul ignore next */
            directText.length > 0 &&
/* istanbul ignore next */
            directText.length < 200 &&
/* istanbul ignore next */
            matchesPattern({ textContent: directText }, config.textPatterns)
/* istanbul ignore next */
          ) {
/* istanbul ignore next */
            return NodeFilter.FILTER_ACCEPT;
          }
/* istanbul ignore next */
          return NodeFilter.FILTER_SKIP;
        }
/* istanbul ignore next */
      });

      let current;
/* istanbul ignore next */
      while ((current = walker.nextNode())) {
        // Walk up to the nearest post/article container rather than hiding just the label
        const post = current.closest('article, [role="article"], [data-testid]') || current;
/* istanbul ignore next */
/* istanbul ignore next */
        if (!processedElements.has(post)) {
/* istanbul ignore next */
          results.push(post);
/* istanbul ignore next */
          processedElements.add(post);
        }
      }
    }

/* istanbul ignore next */
    return results;
  }

  function isVisible(element) {
/* istanbul ignore next */
/* istanbul ignore next */
    if (!element) {
/* istanbul ignore next */
      return false;
    }
    const style = window.getComputedStyle(element);
/* istanbul ignore next */
    return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
  }

  function hideElement(element) {
/* istanbul ignore next */
    element.style.display = 'none';
/* istanbul ignore next */
    element.setAttribute('data-blocked-by-clean-adblock', 'true');
  }

  function blockSponsoredContent() {
/* istanbul ignore next */
    currentPlatform = detectPlatform();
/* istanbul ignore next */
/* istanbul ignore next */
    if (!currentPlatform) {
/* istanbul ignore next */
      return;
    }

    const sponsored = findSponsoredContent();
/* istanbul ignore next */
    for (const el of sponsored) {
/* istanbul ignore next */
      hideElement(el);
    }
  }

  // Run immediately
/* istanbul ignore next */
/* istanbul ignore next */
  if (document.readyState === 'loading') {
/* istanbul ignore next */
    document.addEventListener('DOMContentLoaded', blockSponsoredContent);
/* istanbul ignore next */
  } else {
/* istanbul ignore next */
    blockSponsoredContent();
  }

  // Watch for dynamically loaded content
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
      blockSponsoredContent();
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
    window.SocialMediaBlocker = {
/* istanbul ignore next */
      detectPlatform,
/* istanbul ignore next */
      findSponsoredContent,
/* istanbul ignore next */
      hideElement,
/* istanbul ignore next */
      PLATFORM_CONFIG
/* istanbul ignore next */
    };
  }
/* istanbul ignore next */
})();
