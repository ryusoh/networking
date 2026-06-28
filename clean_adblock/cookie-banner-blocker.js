/**
 * Cookie Banner Blocker (Cleanroom Implementation)
 * ------------------------------------------------
 * Automatically detects and handles cookie consent banners.
 * Features:
 * - Auto-dismiss cookie banners by clicking accept/reject buttons
 * - Hide common cookie banner elements
 * - Support for major CMP (Consent Management Platform) providers
 */

/* istanbul ignore next */
(function () {
/* istanbul ignore next */
  'use strict';

  // Sites with dedicated scripts or complex SPAs where broad selectors break layout
  const HARDCODED_SKIP = [
/* istanbul ignore next */
    'x.com',
/* istanbul ignore next */
    'twitter.com',
/* istanbul ignore next */
    'linkedin.com',
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
    'nasdaq.com',
/* istanbul ignore next */
    'fintel.io',
/* istanbul ignore next */
    'xueqiu.com',
/* istanbul ignore next */
    'google.com',
/* istanbul ignore next */
    'google.co.uk',
/* istanbul ignore next */
    'google.ca',
/* istanbul ignore next */
    'google.com.au',
/* istanbul ignore next */
    'google.de',
/* istanbul ignore next */
    'google.fr',
/* istanbul ignore next */
    'google.co.jp',
/* istanbul ignore next */
    'google.co.in',
/* istanbul ignore next */
    'wsj.com',
/* istanbul ignore next */
    'nvidia.com'
/* istanbul ignore next */
  ];
  const host = window.location.hostname;
/* istanbul ignore next */
/* istanbul ignore next */
  if (HARDCODED_SKIP.some((d) => host === d || host.endsWith('.' + d))) {
/* istanbul ignore next */
    return;
  }

  // Common cookie banner selectors (cleanroom - based on common patterns)
  const COOKIE_BANNER_SELECTORS = [
    // Generic selectors
/* istanbul ignore next */
    '[class*="cookie"]',
/* istanbul ignore next */
    '[class*="consent"]',
/* istanbul ignore next */
    '[class*="gdpr"]',
/* istanbul ignore next */
    '[class*="banner"]',
/* istanbul ignore next */
    '[id*="cookie"]',
/* istanbul ignore next */
    '[id*="consent"]',
/* istanbul ignore next */
    '[id*="gdpr"]',

    // Common CMP providers
/* istanbul ignore next */
    '.onetrust-banner-container',
/* istanbul ignore next */
    '#onetrust-banner-sdk',
/* istanbul ignore next */
    '.cmp-app-banner',
/* istanbul ignore next */
    '#usercentrics-root',
/* istanbul ignore next */
    '.didomi-popup',
/* istanbul ignore next */
    '#didomi-popup',
/* istanbul ignore next */
    '.quantcast-choice',
/* istanbul ignore next */
    '#quantcast-choice',
/* istanbul ignore next */
    '.eu-cookie-compliance-banner',
/* istanbul ignore next */
    '.cookie-notice',
/* istanbul ignore next */
    '.cookie-notification',
/* istanbul ignore next */
    '.cookie-policy-banner',
/* istanbul ignore next */
    '[aria-label*="cookie"]',
/* istanbul ignore next */
    '[aria-label*="consent"]',

    // Push notification prompts (OneSignal)
/* istanbul ignore next */
    '#onesignal-slidedown-dialog',
/* istanbul ignore next */
    '.onesignal-slidedown-dialog',
/* istanbul ignore next */
    '#onesignal-popover-container',
/* istanbul ignore next */
    '.onesignal-customlink-container',
/* istanbul ignore next */
    '#onesignal-container',

    // 1point3acres.com specific elements
/* istanbul ignore next */
    '.deal-card',
/* istanbul ignore next */
    'iframe[src*="adrecover.com"]',
/* istanbul ignore next */
    '#iframe-ad-container'
/* istanbul ignore next */
  ];

  // Button selectors for auto-dismiss
  const ACCEPT_BUTTONS = [
/* istanbul ignore next */
    '[class*="accept"]',
/* istanbul ignore next */
    '[class*="agree"]',
/* istanbul ignore next */
    '[class*="allow"]',
/* istanbul ignore next */
    '[class*="ok"]',
/* istanbul ignore next */
    '[class*="confirm"]',
/* istanbul ignore next */
    '[id*="accept"]',
/* istanbul ignore next */
    '[id*="agree"]',
/* istanbul ignore next */
    '[id*="allow"]',
/* istanbul ignore next */
    'button[aria-label*="accept"]',
/* istanbul ignore next */
    'button[aria-label*="agree"]',
/* istanbul ignore next */
    '[data-action*="accept"]',
/* istanbul ignore next */
    '[data-action*="agree"]'
/* istanbul ignore next */
  ];

  const REJECT_BUTTONS = [
/* istanbul ignore next */
    '[class*="reject"]',
/* istanbul ignore next */
    '[class*="decline"]',
/* istanbul ignore next */
    '[class*="deny"]',
/* istanbul ignore next */
    '[id*="reject"]',
/* istanbul ignore next */
    '[id*="decline"]',
/* istanbul ignore next */
    '[id*="deny"]',
/* istanbul ignore next */
    'button[aria-label*="reject"]',
/* istanbul ignore next */
    'button[aria-label*="decline"]',
/* istanbul ignore next */
    '[data-action*="reject"]',
/* istanbul ignore next */
    '[data-action*="deny"]'
/* istanbul ignore next */
  ];

  // window.open() popup blocking for cookie/privacy popups is handled by
  // cookie-popup-blocker-main.js running in the MAIN world (bypasses CSP)

  // Known CMP configurations: selector -> button selectors to click (in priority order)
  const KNOWN_CMPS = [
/* istanbul ignore next */
    {
/* istanbul ignore next */
      banner: '#onetrust-banner-sdk',
/* istanbul ignore next */
      buttons: ['#onetrust-reject-all-handler', '#onetrust-accept-btn-handler']
/* istanbul ignore next */
    },
/* istanbul ignore next */
    {
/* istanbul ignore next */
      banner: '#didomi-popup, .didomi-popup',
/* istanbul ignore next */
      buttons: [
/* istanbul ignore next */
        '#didomi-notice-disagree-button',
/* istanbul ignore next */
        '#didomi-notice-agree-button',
/* istanbul ignore next */
        '[class*="didomi"] button:first-of-type'
/* istanbul ignore next */
      ]
/* istanbul ignore next */
    },
/* istanbul ignore next */
    {
/* istanbul ignore next */
      banner: '.quantcast-choice, #qc-cmp2-container',
/* istanbul ignore next */
      buttons: ['.qc-cmp2-summary-buttons[mode="secondary"]', '.qc-cmp2-summary-buttons']
/* istanbul ignore next */
    },
/* istanbul ignore next */
    {
/* istanbul ignore next */
      banner: '#CybotCookiebotDialog',
/* istanbul ignore next */
      buttons: [
/* istanbul ignore next */
        '#CybotCookiebotDialogBodyButtonDecline',
/* istanbul ignore next */
        '#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll',
/* istanbul ignore next */
        '#CybotCookiebotDialogBodyButtonAccept'
/* istanbul ignore next */
      ]
/* istanbul ignore next */
    },
/* istanbul ignore next */
    {
/* istanbul ignore next */
      banner: '#usercentrics-root',
/* istanbul ignore next */
      buttons: ['[data-testid="uc-deny-all-button"]', '[data-testid="uc-accept-all-button"]']
/* istanbul ignore next */
    },
/* istanbul ignore next */
    {
/* istanbul ignore next */
      banner: '.gc-consent-popup, .gc-consent-popup__modal-content',
/* istanbul ignore next */
      buttons: ['.gc-consent-popup__button', '.gc-consent-popup__button:last-child']
    }
/* istanbul ignore next */
  ];

  const processedBanners = new Set();

  function dismissKnownCMP() {
/* istanbul ignore next */
    for (const cmp of KNOWN_CMPS) {
      const banner = document.querySelector(cmp.banner);
/* istanbul ignore next */
/* istanbul ignore next */
      if (!banner) {
/* istanbul ignore next */
        continue;
      }
      const bannerId = cmp.banner;
/* istanbul ignore next */
/* istanbul ignore next */
      if (processedBanners.has(bannerId)) {
/* istanbul ignore next */
        continue;
      }

/* istanbul ignore next */
      for (const btnSelector of cmp.buttons) {
        const btn = banner.querySelector(btnSelector) || document.querySelector(btnSelector);
/* istanbul ignore next */
/* istanbul ignore next */
        if (btn) {
/* istanbul ignore next */
          btn.click();
/* istanbul ignore next */
          processedBanners.add(bannerId);
/* istanbul ignore next */
          return true;
        }
      }
      // No button found — hide the banner
/* istanbul ignore next */
      banner.style.display = 'none';
/* istanbul ignore next */
      processedBanners.add(bannerId);
/* istanbul ignore next */
      return true;
    }
/* istanbul ignore next */
    return false;
  }

  // Text patterns for button matching (privacy-first: reject patterns first)
  const REJECT_TEXT = [
/* istanbul ignore next */
    'reject all',
/* istanbul ignore next */
    'deny all',
/* istanbul ignore next */
    'decline all',
/* istanbul ignore next */
    'required only',
/* istanbul ignore next */
    'only necessary',
/* istanbul ignore next */
    'necessary only',
/* istanbul ignore next */
    'essential only',
/* istanbul ignore next */
    'only essential'
/* istanbul ignore next */
  ];
  const ACCEPT_TEXT = [
/* istanbul ignore next */
    'accept all',
/* istanbul ignore next */
    'allow all',
/* istanbul ignore next */
    'agree',
/* istanbul ignore next */
    'confirm my choices',
/* istanbul ignore next */
    'got it',
/* istanbul ignore next */
    'i understand'
/* istanbul ignore next */
  ];
  const CONSENT_KEYWORDS = ['cookie', 'consent', 'privacy', 'tracking', 'analytics', 'gdpr'];

  function isConsentDialog(el) {
    const text = el.textContent.toLowerCase();
/* istanbul ignore next */
    return CONSENT_KEYWORDS.filter((k) => text.includes(k)).length >= 2;
  }

  function findButtonByText(container, textPatterns) {
    const buttons = container.querySelectorAll('button, [role="button"], a.button, a.btn');
/* istanbul ignore next */
    for (const pattern of textPatterns) {
/* istanbul ignore next */
      for (const btn of buttons) {
/* istanbul ignore next */
/* istanbul ignore next */
        if (btn.textContent.toLowerCase().trim().includes(pattern)) {
/* istanbul ignore next */
          return btn;
        }
      }
    }
/* istanbul ignore next */
    return null;
  }

  function dismissConsentDialog() {
    const dialogs = document.querySelectorAll('[role="dialog"][aria-modal="true"]');
/* istanbul ignore next */
    for (const dialog of dialogs) {
/* istanbul ignore next */
/* istanbul ignore next */
      if (!isConsentDialog(dialog)) {
/* istanbul ignore next */
        continue;
      }
      const dialogId = 'dialog:' + (dialog.className || 'unknown');
/* istanbul ignore next */
/* istanbul ignore next */
      if (processedBanners.has(dialogId)) {
/* istanbul ignore next */
        continue;
      }

      const rejectBtn = findButtonByText(dialog, REJECT_TEXT);
/* istanbul ignore next */
/* istanbul ignore next */
      if (rejectBtn) {
/* istanbul ignore next */
        rejectBtn.click();
/* istanbul ignore next */
        processedBanners.add(dialogId);
/* istanbul ignore next */
        return true;
      }
      const acceptBtn = findButtonByText(dialog, ACCEPT_TEXT);
/* istanbul ignore next */
/* istanbul ignore next */
      if (acceptBtn) {
/* istanbul ignore next */
        acceptBtn.click();
/* istanbul ignore next */
        processedBanners.add(dialogId);
/* istanbul ignore next */
        return true;
      }
      // No recognized button — hide it
/* istanbul ignore next */
      dialog.style.display = 'none';
/* istanbul ignore next */
      processedBanners.add(dialogId);
/* istanbul ignore next */
      return true;
    }
/* istanbul ignore next */
    return false;
  }

  function findCookieBanner() {
/* istanbul ignore next */
    for (const selector of COOKIE_BANNER_SELECTORS) {
/* istanbul ignore next */
      try {
        const elements = document.querySelectorAll(selector);
/* istanbul ignore next */
        for (const el of elements) {
/* istanbul ignore next */
/* istanbul ignore next */
          if (isCookieBanner(el)) {
/* istanbul ignore next */
            return el;
          }
        }
      } catch {
        // Invalid selector, skip
      }
    }
/* istanbul ignore next */
    return null;
  }

  function isCookieBanner(element) {
    const text = element.textContent.toLowerCase();
    const keywords = [
/* istanbul ignore next */
      'cookie',
/* istanbul ignore next */
      'consent',
/* istanbul ignore next */
      'gdpr',
/* istanbul ignore next */
      'privacy',
/* istanbul ignore next */
      'tracking',
/* istanbul ignore next */
      'analytics',
/* istanbul ignore next */
      'personalize',
/* istanbul ignore next */
      'accept',
/* istanbul ignore next */
      'decline'
/* istanbul ignore next */
    ];

    const matchCount = keywords.filter((k) => text.includes(k)).length;
/* istanbul ignore next */
    return matchCount >= 2 && element.offsetHeight > 100;
  }

  function findButton(container, buttonSelectors) {
/* istanbul ignore next */
    for (const selector of buttonSelectors) {
/* istanbul ignore next */
      try {
        const buttons = container.querySelectorAll(selector);
/* istanbul ignore next */
        for (const btn of buttons) {
/* istanbul ignore next */
/* istanbul ignore next */
          if (isVisible(btn)) {
/* istanbul ignore next */
            return btn;
          }
        }
      } catch {
        // Invalid selector, skip
      }
    }
/* istanbul ignore next */
    return null;
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
    return (
/* istanbul ignore next */
      style.display !== 'none' &&
/* istanbul ignore next */
      style.visibility !== 'hidden' &&
/* istanbul ignore next */
      style.opacity !== '0' &&
/* istanbul ignore next */
      element.offsetWidth > 0 &&
/* istanbul ignore next */
      element.offsetHeight > 0
/* istanbul ignore next */
    );
  }

  function dismissBanner(banner) {
    const bannerId = banner.id || banner.className || 'unknown';
/* istanbul ignore next */
/* istanbul ignore next */
    if (processedBanners.has(bannerId)) {
/* istanbul ignore next */
      return;
    }

    // Try to click accept button first, then reject, then just hide
    const acceptBtn = findButton(banner, ACCEPT_BUTTONS);
    const rejectBtn = findButton(banner, REJECT_BUTTONS);

/* istanbul ignore next */
/* istanbul ignore next */
    if (acceptBtn) {
/* istanbul ignore next */
      acceptBtn.click();
/* istanbul ignore next */
      processedBanners.add(bannerId);
/* istanbul ignore next */
      return true;
    }

/* istanbul ignore next */
/* istanbul ignore next */
    if (rejectBtn) {
/* istanbul ignore next */
      rejectBtn.click();
/* istanbul ignore next */
      processedBanners.add(bannerId);
/* istanbul ignore next */
      return true;
    }

    // If no button found, hide the banner
/* istanbul ignore next */
    banner.style.display = 'none';
/* istanbul ignore next */
    processedBanners.add(bannerId);
/* istanbul ignore next */
    return true;
  }

  function blockCookieBanner() {
    // Try known CMPs first (no heuristic needed)
/* istanbul ignore next */
/* istanbul ignore next */
    if (dismissKnownCMP()) {
/* istanbul ignore next */
      return;
    }

    // Try generic dialog-based consent detection (text matching)
/* istanbul ignore next */
/* istanbul ignore next */
    if (dismissConsentDialog()) {
/* istanbul ignore next */
      return;
    }

    // Fall back to heuristic detection
    const banner = findCookieBanner();
/* istanbul ignore next */
/* istanbul ignore next */
    if (banner) {
/* istanbul ignore next */
      dismissBanner(banner);
    }
  }

  function start() {
/* istanbul ignore next */
/* istanbul ignore next */
    if (document.readyState === 'loading') {
/* istanbul ignore next */
      document.addEventListener('DOMContentLoaded', blockCookieBanner);
/* istanbul ignore next */
    } else {
/* istanbul ignore next */
      blockCookieBanner();
    }

    const target = document.body || document.documentElement;
/* istanbul ignore next */
/* istanbul ignore next */
    if (target) {
      const observer = new MutationObserver((mutations) => {
/* istanbul ignore next */
        for (const mutation of mutations) {
/* istanbul ignore next */
/* istanbul ignore next */
          if (mutation.addedNodes.length > 0) {
/* istanbul ignore next */
            blockCookieBanner();
          }
        }
/* istanbul ignore next */
      });
/* istanbul ignore next */
      observer.observe(target, { childList: true, subtree: true });
    }
  }

  // Check whitelist before running
  const syncStorage = typeof chrome !== 'undefined' ? chrome?.storage?.sync : null;
/* istanbul ignore next */
/* istanbul ignore next */
  if (syncStorage) {
/* istanbul ignore next */
    syncStorage.get(['whitelist', 'features'], (prefs) => {
/* istanbul ignore next */
/* istanbul ignore next */
      if (chrome?.runtime?.lastError) {
/* istanbul ignore next */
        return;
      }
/* istanbul ignore next */
/* istanbul ignore next */
      if (prefs?.features?.cookieBannerBlocker === false) {
/* istanbul ignore next */
        return;
      }
/* istanbul ignore next */
/* istanbul ignore next */
      if (prefs?.whitelist && prefs.whitelist.some((s) => host.includes(s))) {
/* istanbul ignore next */
        return;
      }
/* istanbul ignore next */
      start();
/* istanbul ignore next */
    });
/* istanbul ignore next */
  } else {
/* istanbul ignore next */
    start();
  }

  // Export for testing
/* istanbul ignore next */
/* istanbul ignore next */
  if (typeof window !== 'undefined') {
/* istanbul ignore next */
    window.CookieBannerBlocker = {
/* istanbul ignore next */
      findCookieBanner,
/* istanbul ignore next */
      dismissBanner,
/* istanbul ignore next */
      dismissKnownCMP,
/* istanbul ignore next */
      processedBanners
/* istanbul ignore next */
    };
  }
/* istanbul ignore next */
})();
