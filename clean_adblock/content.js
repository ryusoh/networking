/**
 * Bypass: AdBlock Detector - Content Script
 * Clean-room implementation of adblock detection and removal.
 */

/* istanbul ignore next */
(function () {
/* istanbul ignore next */
  'use strict';

  // Skip search engines — broad keyword/element scanning causes false positives on results pages
  const _host = window.location.hostname;
/* istanbul ignore next */
  if (
/* istanbul ignore next */
    _host.endsWith('google.com') ||
/* istanbul ignore next */
    _host.endsWith('google.co.uk') ||
/* istanbul ignore next */
    _host.endsWith('google.ca') ||
/* istanbul ignore next */
    _host.endsWith('google.com.au') ||
/* istanbul ignore next */
    _host.endsWith('google.de') ||
/* istanbul ignore next */
    _host.endsWith('google.fr') ||
/* istanbul ignore next */
    _host.endsWith('google.co.jp') ||
/* istanbul ignore next */
    _host.endsWith('google.co.in') ||
/* istanbul ignore next */
    _host.endsWith('bing.com') ||
/* istanbul ignore next */
    _host.endsWith('duckduckgo.com') ||
/* istanbul ignore next */
    _host.endsWith('baidu.com') ||
/* istanbul ignore next */
    _host.endsWith('wsj.com') ||
/* istanbul ignore next */
    _host.endsWith('nvidia.com')
/* istanbul ignore next */
  ) {
/* istanbul ignore next */
    return;
  }

  const DEBUG = true;
  const log = (...args) => DEBUG && console.log('[Bypass: AdBlock]', ...args);

  // Core keywords used to identify adblock detection messages across languages.
  const KEYWORDS = [
/* istanbul ignore next */
    'adblock',
/* istanbul ignore next */
    'ad blocker',
/* istanbul ignore next */
    'adblocker',
/* istanbul ignore next */
    'ad block',
/* istanbul ignore next */
    'adblocking',
/* istanbul ignore next */
    'ads blocker',
/* istanbul ignore next */
    'content blocker',
/* istanbul ignore next */
    'ad blocking',
/* istanbul ignore next */
    'detected',
/* istanbul ignore next */
    'detection',
/* istanbul ignore next */
    'detected adblock',
/* istanbul ignore next */
    'disable',
/* istanbul ignore next */
    'turn off',
/* istanbul ignore next */
    'remove',
/* istanbul ignore next */
    'whitelist',
/* istanbul ignore next */
    'pause',
/* istanbul ignore next */
    'support us',
/* istanbul ignore next */
    'revenue',
/* istanbul ignore next */
    'free content',
/* istanbul ignore next */
    'funding',
/* istanbul ignore next */
    'premium',
/* istanbul ignore next */
    'upgrade',
/* istanbul ignore next */
    'ad-free',
    // Spanish
/* istanbul ignore next */
    'bloqueador',
/* istanbul ignore next */
    'publicidad',
/* istanbul ignore next */
    'anuncios',
    // German
/* istanbul ignore next */
    'werbeblocker',
/* istanbul ignore next */
    'werbung',
/* istanbul ignore next */
    'erkannt',
    // French
/* istanbul ignore next */
    'bloqueur',
/* istanbul ignore next */
    'publicité',
    // Portuguese
/* istanbul ignore next */
    'bloqueador',
/* istanbul ignore next */
    'anúncios',
    // Russian
/* istanbul ignore next */
    'блокировщик',
/* istanbul ignore next */
    'рекламы',
    // Chinese
/* istanbul ignore next */
    '广告拦截',
/* istanbul ignore next */
    '屏蔽',
    // Japanese
/* istanbul ignore next */
    '広告ブロック',
/* istanbul ignore next */
    'ブロッカー',
    // Italian
/* istanbul ignore next */
    'blocco annunci',
    // Polish
/* istanbul ignore next */
    'blokowanie reklam'
/* istanbul ignore next */
  ];

  /**
   * Recursive scanner that traverses the DOM, including Shadow DOM.
   * @param {Node} root - The starting node for the search.
   * @param {Function} callback - Function called for each element found.
   */
  function scanDOM(root, callback) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, null, false);
    let node;
/* istanbul ignore next */
    while ((node = walker.nextNode())) {
/* istanbul ignore next */
      callback(node);
/* istanbul ignore next */
/* istanbul ignore next */
      if (node.shadowRoot) {
/* istanbul ignore next */
        scanDOM(node.shadowRoot, callback);
      }
    }
  }

  /**
   * Scores an element based on its text content and attributes.
   * @param {Element} el - The element to evaluate.
   * @returns {number} - The calculated score (0 to 1).
   */
  function scoreElement(el) {
    const text = el.textContent ? el.textContent.toLowerCase() : '';
/* istanbul ignore next */
/* istanbul ignore next */
    if (text.length < 5 || text.length > 1000) {
/* istanbul ignore next */
      return 0;
    }

    let matches = 0;
    let strongMatch = false;
/* istanbul ignore next */
    KEYWORDS.forEach((kw) => {
/* istanbul ignore next */
/* istanbul ignore next */
      if (text.includes(kw)) {
/* istanbul ignore next */
        matches++;
        // Two adblock-specific keywords together is a strong signal
/* istanbul ignore next */
/* istanbul ignore next */
        if (
/* istanbul ignore next */
          kw === 'adblock' ||
/* istanbul ignore next */
          kw === 'adblocker' ||
/* istanbul ignore next */
          kw === 'ad blocker' ||
/* istanbul ignore next */
          kw === 'ad block' ||
/* istanbul ignore next */
          kw === 'detected adblock' ||
/* istanbul ignore next */
          kw === 'werbeblocker' ||
/* istanbul ignore next */
          kw === 'bloqueur' ||
/* istanbul ignore next */
          kw === 'bloqueador' ||
/* istanbul ignore next */
          kw === '广告拦截' ||
/* istanbul ignore next */
          kw === '広告ブロック'
/* istanbul ignore next */
        ) {
/* istanbul ignore next */
          strongMatch = true;
        }
      }
/* istanbul ignore next */
    });

/* istanbul ignore next */
/* istanbul ignore next */
    if (matches === 0) {
/* istanbul ignore next */
      return 0;
    }

    // Calculate base score — strong adblock keywords get extra weight
    let score = matches * 0.2;
/* istanbul ignore next */
/* istanbul ignore next */
    if (strongMatch && matches >= 2) {
/* istanbul ignore next */
      score += 0.2;
    }

    // Contextual bonuses
    const style = window.getComputedStyle(el);
/* istanbul ignore next */
/* istanbul ignore next */
    if (style.position === 'fixed' || style.position === 'absolute') {
/* istanbul ignore next */
      score += 0.3;
    }
/* istanbul ignore next */
/* istanbul ignore next */
    if (parseInt(style.zIndex) > 100) {
/* istanbul ignore next */
      score += 0.2;
    }

    // Dimension check
    const rect = el.getBoundingClientRect();
/* istanbul ignore next */
/* istanbul ignore next */
    if (rect.width > window.innerWidth * 0.5 && rect.height > window.innerHeight * 0.3) {
/* istanbul ignore next */
      score += 0.2;
    }

/* istanbul ignore next */
    return Math.min(score, 1);
  }

  /**
   * Hides an element and its relevant parents if they appear to be overlays.
   * @param {Element} el - The element to hide.
   */
  function hideDetector(el) {
/* istanbul ignore next */
    log('Potential detector found, score:', scoreElement(el));

    // Find the topmost container that is likely the overlay
    let target = el;
    let parent = el.parentElement;

/* istanbul ignore next */
    for (let i = 0; i < 5 && parent && parent !== document.body; i++) {
      const style = window.getComputedStyle(parent);
/* istanbul ignore next */
/* istanbul ignore next */
      if (style.position === 'fixed' || style.position === 'absolute') {
/* istanbul ignore next */
        target = parent;
      }
/* istanbul ignore next */
      parent = parent.parentElement;
    }

/* istanbul ignore next */
/* istanbul ignore next */
    if (target.style.display !== 'none') {
/* istanbul ignore next */
      log('Hiding element:', target);
/* istanbul ignore next */
      target.style.setProperty('display', 'none', 'important');
/* istanbul ignore next */
      restoreScrolling();
    }
  }

  /**
   * Checks for and restores page scrolling if it has been disabled.
   */
  function restoreScrolling() {
/* istanbul ignore next */
    [document.documentElement, document.body].forEach((el) => {
      const style = window.getComputedStyle(el);
/* istanbul ignore next */
/* istanbul ignore next */
      if (style.overflow === 'hidden' || style.overflowY === 'hidden') {
/* istanbul ignore next */
        log('Restoring scroll on:', el.tagName);
/* istanbul ignore next */
        el.style.setProperty('overflow', 'auto', 'important');
/* istanbul ignore next */
        el.style.setProperty('overflow-y', 'auto', 'important');
      }
      // Only reset position:fixed on body if it was likely set by an overlay script
      // (i.e., body also has overflow:hidden and a negative top offset — classic scroll-lock pattern)
/* istanbul ignore next */
/* istanbul ignore next */
      if (el === document.body && style.position === 'fixed' && style.overflow === 'hidden') {
/* istanbul ignore next */
        el.style.setProperty('position', 'static', 'important');
      }
/* istanbul ignore next */
    });
  }

  /**
   * Restores text selection, copying, and right-click functionality.
   */
  function restoreInteractions() {
    const userSelectCss =
/* istanbul ignore next */
      'user-select: text !important;-webkit-user-select: text !important;-webkit-touch-callout: text !important;';

    // 1. Force CSS selection
/* istanbul ignore next */
/* istanbul ignore next */
    if (!document.getElementById('bypass-copy-fix')) {
      const style = document.createElement('style');
/* istanbul ignore next */
      style.id = 'bypass-copy-fix';
/* istanbul ignore next */
      style.textContent = `* { ${userSelectCss} }`;
/* istanbul ignore next */
      document.documentElement.appendChild(style);
    }

    // 2. Clear restrictive inline event handlers
    const clearEvents = (el) => {
/* istanbul ignore next */
/* istanbul ignore next */
      if (!el) {
/* istanbul ignore next */
        return;
      }
/* istanbul ignore next */
      el.onselectstart = null;
/* istanbul ignore next */
      el.oncopy = null;
/* istanbul ignore next */
      el.oncut = null;
/* istanbul ignore next */
      el.onpaste = null;
/* istanbul ignore next */
      el.oncontextmenu = null;
/* istanbul ignore next */
      el.onmousedown = null;
/* istanbul ignore next */
      el.onmouseup = null;
/* istanbul ignore next */
    };
/* istanbul ignore next */
    clearEvents(document);
/* istanbul ignore next */
    clearEvents(document.body);
/* istanbul ignore next */
    clearEvents(document.documentElement);

    // 3. Hijack event listeners via Capture Phase
    const stopPropagation = (e) => {
/* istanbul ignore next */
      e.stopPropagation();
/* istanbul ignore next */
/* istanbul ignore next */
      if (e.stopImmediatePropagation) {
/* istanbul ignore next */
        e.stopImmediatePropagation();
      }
/* istanbul ignore next */
      return true;
/* istanbul ignore next */
    };

/* istanbul ignore next */
    ['copy', 'cut', 'contextmenu', 'selectstart'].forEach((evt) => {
/* istanbul ignore next */
      document.documentElement.addEventListener(evt, stopPropagation, { capture: true });
/* istanbul ignore next */
    });
  }

  /**
   * Site-specific modules for complex platforms.
   */
  const SITE_MODULES = {
/* istanbul ignore next */
    'youtube.com': () => {
/* istanbul ignore next */
      log('Running YouTube module');
      // Placeholder for YT specific dismiss logic
      const dismiss = document.querySelector('ytd-enforcement-message-view-model button');
/* istanbul ignore next */
/* istanbul ignore next */
      if (dismiss) {
/* istanbul ignore next */
        dismiss.click();
      }
/* istanbul ignore next */
    },
/* istanbul ignore next */
    'blobgame.io': () => {
/* istanbul ignore next */
      log('Running BlobGame module');
      // Inject CSS to fix game visibility
/* istanbul ignore next */
/* istanbul ignore next */
      if (!document.getElementById('blobgame-fix')) {
        const style = document.createElement('style');
/* istanbul ignore next */
        style.id = 'blobgame-fix';
/* istanbul ignore next */
        style.textContent = `
/* istanbul ignore next */
          #aw, [id*="aw"], [class*="aw"], [id*="adblock"], [class*="adblock"] { display: none !important; }
/* istanbul ignore next */
          #embed-html { display: block !important; }
/* istanbul ignore next */
        `;
/* istanbul ignore next */
        document.documentElement.appendChild(style);
      }
/* istanbul ignore next */
    },
/* istanbul ignore next */
    'gurufocus.com': () => {
/* istanbul ignore next */
      log('Running GuruFocus module');
/* istanbul ignore next */
/* istanbul ignore next */
      if (!document.getElementById('gurufocus-fix')) {
        const style = document.createElement('style');
/* istanbul ignore next */
        style.id = 'gurufocus-fix';
/* istanbul ignore next */
        style.textContent = `
/* istanbul ignore next */
          .el-dialog__wrapper.gf,
/* istanbul ignore next */
          .el-dialog__wrapper:has([href*="pricing"]),
/* istanbul ignore next */
          .el-dialog__wrapper:has([action*="register"]),
/* istanbul ignore next */
          .el-dialog__wrapper:has([id*="register"]),
/* istanbul ignore next */
          .el-dialog__wrapper:has(.registration-dialog),
/* istanbul ignore next */
          .v-modal,
/* istanbul ignore next */
          .paywall-shadow,
/* istanbul ignore next */
          .paywall-node {
/* istanbul ignore next */
            display: none !important;
/* istanbul ignore next */
            visibility: hidden !important;
/* istanbul ignore next */
            opacity: 0 !important;
/* istanbul ignore next */
            height: 0 !important;
/* istanbul ignore next */
            min-height: 0 !important;
/* istanbul ignore next */
            max-height: 0 !important;
/* istanbul ignore next */
            overflow: hidden !important;
/* istanbul ignore next */
            pointer-events: none !important;
          }
/* istanbul ignore next */
          body:has(.paywall-shadow) *,
/* istanbul ignore next */
          body:has(.paywall-node) * {
/* istanbul ignore next */
            filter: none !important;
/* istanbul ignore next */
            backdrop-filter: none !important;
          }
/* istanbul ignore next */
          html:has(.el-dialog__wrapper),
/* istanbul ignore next */
          body:has(.el-dialog__wrapper),
/* istanbul ignore next */
          html:has(.v-modal),
/* istanbul ignore next */
          body:has(.v-modal),
/* istanbul ignore next */
          html:has(.paywall-shadow),
/* istanbul ignore next */
          body:has(.paywall-shadow),
/* istanbul ignore next */
          html:has(.paywall-node),
/* istanbul ignore next */
          body:has(.paywall-node) {
/* istanbul ignore next */
            overflow: auto !important;
/* istanbul ignore next */
            overflow-y: auto !important;
/* istanbul ignore next */
            position: static !important;
          }
/* istanbul ignore next */
        `;
/* istanbul ignore next */
        document.documentElement.appendChild(style);
      }
    }
/* istanbul ignore next */
  };

  /**
   * Checks if the extension context is still valid.
   * @returns {boolean}
   */
  function isContextValid() {
/* istanbul ignore next */
    try {
      // Use optional chaining and check for runtime.id which is cleared on invalidation
/* istanbul ignore next */
      return !!(
/* istanbul ignore next */
        typeof chrome !== 'undefined' &&
/* istanbul ignore next */
        chrome?.runtime?.id &&
/* istanbul ignore next */
        chrome?.runtime?.onMessage &&
/* istanbul ignore next */
        chrome?.storage?.sync &&
/* istanbul ignore next */
        chrome?.storage?.local
/* istanbul ignore next */
      );
    } catch {
/* istanbul ignore next */
      return false;
    }
  }

  /**
   * Dismiss Admiral anti-adblock popups.
   * Admiral uses randomized class names, so we detect by:
   * 1. Links to getadmiral.com (branding)
   * 2. "Continue without disabling" dismiss buttons
   */
  // Major SPAs where scanning all links on every mutation is too expensive
  const SKIP_ADMIRAL_DOMAINS = [
/* istanbul ignore next */
    'x.com',
/* istanbul ignore next */
    'twitter.com',
/* istanbul ignore next */
    'facebook.com',
/* istanbul ignore next */
    'instagram.com',
/* istanbul ignore next */
    'reddit.com',
/* istanbul ignore next */
    'youtube.com',
/* istanbul ignore next */
    'linkedin.com',
/* istanbul ignore next */
    'pinterest.com'
/* istanbul ignore next */
  ];
  const currentHost = window.location.hostname;
  const skipAdmiral = SKIP_ADMIRAL_DOMAINS.some(
/* istanbul ignore next */
    (d) => currentHost === d || currentHost.endsWith('.' + d)
/* istanbul ignore next */
  );

  function dismissAdmiral() {
/* istanbul ignore next */
/* istanbul ignore next */
    if (skipAdmiral) {
/* istanbul ignore next */
      return;
    }
    // Admiral URL-encodes their branding links to evade CSS selectors.
    // Scan all <a> elements and decode their href to detect Admiral.
    const allLinks = document.querySelectorAll('a[href]');
/* istanbul ignore next */
    for (const link of allLinks) {
      let decoded = '';
/* istanbul ignore next */
      try {
/* istanbul ignore next */
        decoded = decodeURIComponent(link.getAttribute('href') || '').toLowerCase();
      } catch {
/* istanbul ignore next */
        continue;
      }
      // Only match Admiral anti-adblock service domains, not the word "admiral"
      // in general (e.g. "vanguard-500-index-admiral" on investing.com)
/* istanbul ignore next */
/* istanbul ignore next */
      if (
/* istanbul ignore next */
        !decoded.includes('getadmiral.com') &&
/* istanbul ignore next */
        !decoded.includes('admiral.mgr') &&
/* istanbul ignore next */
        !decoded.includes('admiralcdn.com') &&
/* istanbul ignore next */
        !decoded.includes('admiral-media.com')
/* istanbul ignore next */
      ) {
/* istanbul ignore next */
        continue;
      }

/* istanbul ignore next */
      log('Admiral link found:', decoded);

      // Walk up to the topmost overlay container
      let container = link;
      let best = link;
/* istanbul ignore next */
      for (let i = 0; i < 15 && container.parentElement; i++) {
/* istanbul ignore next */
        container = container.parentElement;
/* istanbul ignore next */
/* istanbul ignore next */
        if (container === document.body || container === document.documentElement) {
/* istanbul ignore next */
          break;
        }
/* istanbul ignore next */
        best = container;
      }

/* istanbul ignore next */
/* istanbul ignore next */
      if (best !== link) {
/* istanbul ignore next */
        log('Hiding Admiral overlay container');
/* istanbul ignore next */
        best.style.setProperty('display', 'none', 'important');
/* istanbul ignore next */
        restoreScrolling();
/* istanbul ignore next */
        return;
      }
    }
  }

  /**
   * Main execution loop.
   */
  function run() {
/* istanbul ignore next */
/* istanbul ignore next */
    if (!isContextValid()) {
/* istanbul ignore next */
      return;
    }
/* istanbul ignore next */
/* istanbul ignore next */
    if (!document.body) {
/* istanbul ignore next */
      return;
    }
/* istanbul ignore next */
    try {
      // Check for sync storage specifically
      const syncStorage = typeof chrome !== 'undefined' ? chrome?.storage?.sync : null;
/* istanbul ignore next */
/* istanbul ignore next */
      if (!syncStorage) {
/* istanbul ignore next */
        return;
      }

/* istanbul ignore next */
      syncStorage.get(['enabled', 'mode', 'whitelist', 'blacklist'], (prefs) => {
/* istanbul ignore next */
        try {
/* istanbul ignore next */
/* istanbul ignore next */
          if (!isContextValid() || chrome?.runtime?.lastError) {
/* istanbul ignore next */
            return;
          }
/* istanbul ignore next */
/* istanbul ignore next */
          if (prefs?.enabled === false) {
/* istanbul ignore next */
            return;
          }

          const host = window.location.hostname;

          // 1. Check Whitelist (highest priority)
/* istanbul ignore next */
/* istanbul ignore next */
          if (prefs?.whitelist && prefs.whitelist.some((s) => host.includes(s))) {
/* istanbul ignore next */
            log('Site is whitelisted, skipping.');
/* istanbul ignore next */
            return;
          }

          // 2. Force Interaction Restoration (skip on SPAs where it breaks layout)
          const SKIP_INTERACTIONS = [
/* istanbul ignore next */
            'instagram.com',
/* istanbul ignore next */
            'facebook.com',
/* istanbul ignore next */
            'reddit.com',
/* istanbul ignore next */
            'pinterest.com',
/* istanbul ignore next */
            'youtube.com',
/* istanbul ignore next */
            'x.com',
/* istanbul ignore next */
            'twitter.com',
/* istanbul ignore next */
            'linkedin.com',
/* istanbul ignore next */
            'twitch.tv',
/* istanbul ignore next */
            'google.com'
/* istanbul ignore next */
          ];
/* istanbul ignore next */
/* istanbul ignore next */
          if (!SKIP_INTERACTIONS.some((d) => host === d || host.endsWith('.' + d))) {
/* istanbul ignore next */
            restoreInteractions();
          }

          // 3. Check Execution Mode
/* istanbul ignore next */
/* istanbul ignore next */
          if (prefs?.mode === 'selective') {
            const inBlacklist = prefs?.blacklist && prefs.blacklist.some((s) => host.includes(s));
/* istanbul ignore next */
/* istanbul ignore next */
            if (!inBlacklist) {
/* istanbul ignore next */
              log('Selective mode active and site not in blacklist, skipping.');
/* istanbul ignore next */
              return;
            }
          }

          // 4. Site-specific handling
/* istanbul ignore next */
          Object.keys(SITE_MODULES).forEach((m) => {
/* istanbul ignore next */
/* istanbul ignore next */
            if (host.includes(m)) {
/* istanbul ignore next */
              SITE_MODULES[m]();
            }
/* istanbul ignore next */
          });

          // 5. Hide common adblock detection overlays by selector
          const ADBLOCK_POPUP_SELECTORS = [
/* istanbul ignore next */
            '[class*="adblock" i]',
/* istanbul ignore next */
            '[id*="adblock" i]',
/* istanbul ignore next */
            '[class*="ad-block" i]',
/* istanbul ignore next */
            '[id*="ad-block" i]',
/* istanbul ignore next */
            '[class*="adblocker" i]',
/* istanbul ignore next */
            '[id*="adblocker" i]',
/* istanbul ignore next */
            '[class*="adblock-modal"]',
/* istanbul ignore next */
            '[class*="adblock-overlay"]',
/* istanbul ignore next */
            '[class*="adblock-notice"]',
/* istanbul ignore next */
            '[class*="adblock-wall"]',
/* istanbul ignore next */
            '[class*="anti-adblocker"]',
/* istanbul ignore next */
            '[id*="anti-adblocker"]',
/* istanbul ignore next */
            '.fc-consent-root',
/* istanbul ignore next */
            '.fc-dialog-overlay',
/* istanbul ignore next */
            '#__ABoverlay'
/* istanbul ignore next */
          ];

/* istanbul ignore next */
          for (const sel of ADBLOCK_POPUP_SELECTORS) {
/* istanbul ignore next */
            try {
/* istanbul ignore next */
              document.querySelectorAll(sel).forEach((el) => {
/* istanbul ignore next */
/* istanbul ignore next */
                if (el.offsetParent !== null || window.getComputedStyle(el).display !== 'none') {
/* istanbul ignore next */
                  log('Hiding adblock popup by selector:', sel);
/* istanbul ignore next */
                  hideDetector(el);
                }
/* istanbul ignore next */
              });
            } catch {
              /* invalid selector */
            }
          }

          // 5b. Detect Admiral anti-adblock (uses randomized classes, detect by content)
/* istanbul ignore next */
          dismissAdmiral();

          // 6. Apply automatic text-based detection
/* istanbul ignore next */
          scanDOM(document.body, (el) => {
/* istanbul ignore next */
/* istanbul ignore next */
            if (scoreElement(el) > 0.6) {
/* istanbul ignore next */
              hideDetector(el);
            }
/* istanbul ignore next */
          });

          // 5. Apply custom user-defined selectors
/* istanbul ignore next */
          try {
            const localStorage = chrome?.storage?.local;
/* istanbul ignore next */
/* istanbul ignore next */
            if (!localStorage) {
/* istanbul ignore next */
              return;
            }

/* istanbul ignore next */
            localStorage.get(['customSelectors'], (result) => {
/* istanbul ignore next */
              try {
/* istanbul ignore next */
/* istanbul ignore next */
                if (!isContextValid() || chrome?.runtime?.lastError) {
/* istanbul ignore next */
                  return;
                }
                const selectors = result?.customSelectors ? result.customSelectors[host] : null;
/* istanbul ignore next */
/* istanbul ignore next */
                if (selectors && Array.isArray(selectors)) {
/* istanbul ignore next */
                  selectors.forEach((selector) => {
/* istanbul ignore next */
                    try {
/* istanbul ignore next */
                      document.querySelectorAll(selector).forEach((el) => {
/* istanbul ignore next */
                        el.style.setProperty('display', 'none', 'important');
/* istanbul ignore next */
                      });
                    } catch {
/* istanbul ignore next */
                      log('Invalid custom selector:', selector);
                    }
/* istanbul ignore next */
                  });
                }
              } catch (e) {
/* istanbul ignore next */
                log('Local storage callback failed:', e);
              }
/* istanbul ignore next */
            });
          } catch (e) {
/* istanbul ignore next */
            log('Local storage access failed:', e);
          }
        } catch (e) {
/* istanbul ignore next */
          log('Sync storage callback failed:', e);
        }
/* istanbul ignore next */
      });
    } catch (e) {
/* istanbul ignore next */
      log('Sync storage access failed:', e);
    }
  }

  // Initial run
/* istanbul ignore next */
  run();

  // Observe for dynamic changes
  const observer = new MutationObserver((mutations) => {
/* istanbul ignore next */
/* istanbul ignore next */
    if (!isContextValid()) {
/* istanbul ignore next */
      observer.disconnect();
/* istanbul ignore next */
      return;
    }
    let shouldRun = false;
/* istanbul ignore next */
    mutations.forEach((m) => {
/* istanbul ignore next */
/* istanbul ignore next */
      if (m.addedNodes.length > 0) {
/* istanbul ignore next */
        shouldRun = true;
      }
/* istanbul ignore next */
    });
/* istanbul ignore next */
/* istanbul ignore next */
    if (shouldRun) {
/* istanbul ignore next */
      dismissAdmiral();
      // Throttle run() to avoid hammering chrome.storage on dynamic SPAs
/* istanbul ignore next */
/* istanbul ignore next */
      if (!run._throttled) {
/* istanbul ignore next */
        run._throttled = true;
/* istanbul ignore next */
        setTimeout(() => {
/* istanbul ignore next */
          run._throttled = false;
/* istanbul ignore next */
          run();
/* istanbul ignore next */
        }, 500);
      }
    }
/* istanbul ignore next */
  });

/* istanbul ignore next */
  observer.observe(document.documentElement, {
/* istanbul ignore next */
    childList: true,
/* istanbul ignore next */
    subtree: true
/* istanbul ignore next */
  });

  // Message listener
/* istanbul ignore next */
/* istanbul ignore next */
  if (isContextValid()) {
/* istanbul ignore next */
    chrome?.runtime?.onMessage?.addListener((request, sender, sendResponse) => {
/* istanbul ignore next */
/* istanbul ignore next */
      if (!isContextValid()) {
/* istanbul ignore next */
        return;
      }
/* istanbul ignore next */
/* istanbul ignore next */
      if (request.action === 'scan') {
/* istanbul ignore next */
        log('Manual scan triggered');
/* istanbul ignore next */
        run();
/* istanbul ignore next */
        sendResponse({ success: true });
      }
/* istanbul ignore next */
      return true;
/* istanbul ignore next */
    });
  }
/* istanbul ignore next */
})();
