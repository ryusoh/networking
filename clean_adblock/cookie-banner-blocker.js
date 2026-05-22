/**
 * Cookie Banner Blocker (Cleanroom Implementation)
 * ------------------------------------------------
 * Automatically detects and handles cookie consent banners.
 * Features:
 * - Auto-dismiss cookie banners by clicking accept/reject buttons
 * - Hide common cookie banner elements
 * - Support for major CMP (Consent Management Platform) providers
 */

(function () {
  'use strict';

  // Sites with dedicated scripts or complex SPAs where broad selectors break layout
  const HARDCODED_SKIP = [
    'x.com',
    'twitter.com',
    'linkedin.com',
    'instagram.com',
    'facebook.com',
    'reddit.com',
    'pinterest.com',
    'youtube.com',
    'nasdaq.com',
    'fintel.io',
    'xueqiu.com',
    'google.com',
    'google.co.uk',
    'google.ca',
    'google.com.au',
    'google.de',
    'google.fr',
    'google.co.jp',
    'google.co.in'
  ];
  const host = window.location.hostname;
  if (HARDCODED_SKIP.some((d) => host === d || host.endsWith('.' + d))) {
    return;
  }

  // Common cookie banner selectors (cleanroom - based on common patterns)
  const COOKIE_BANNER_SELECTORS = [
    // Generic selectors
    '[class*="cookie"]',
    '[class*="consent"]',
    '[class*="gdpr"]',
    '[class*="banner"]',
    '[id*="cookie"]',
    '[id*="consent"]',
    '[id*="gdpr"]',

    // Common CMP providers
    '.onetrust-banner-container',
    '#onetrust-banner-sdk',
    '.cmp-app-banner',
    '#usercentrics-root',
    '.didomi-popup',
    '#didomi-popup',
    '.quantcast-choice',
    '#quantcast-choice',
    '.eu-cookie-compliance-banner',
    '.cookie-notice',
    '.cookie-notification',
    '.cookie-policy-banner',
    '[aria-label*="cookie"]',
    '[aria-label*="consent"]',

    // Push notification prompts (OneSignal)
    '#onesignal-slidedown-dialog',
    '.onesignal-slidedown-dialog',
    '#onesignal-popover-container',
    '.onesignal-customlink-container',
    '#onesignal-container',

    // 1point3acres.com specific elements
    '.deal-card',
    'iframe[src*="adrecover.com"]',
    '#iframe-ad-container'
  ];

  // Button selectors for auto-dismiss
  const ACCEPT_BUTTONS = [
    '[class*="accept"]',
    '[class*="agree"]',
    '[class*="allow"]',
    '[class*="ok"]',
    '[class*="confirm"]',
    '[id*="accept"]',
    '[id*="agree"]',
    '[id*="allow"]',
    'button[aria-label*="accept"]',
    'button[aria-label*="agree"]',
    '[data-action*="accept"]',
    '[data-action*="agree"]'
  ];

  const REJECT_BUTTONS = [
    '[class*="reject"]',
    '[class*="decline"]',
    '[class*="deny"]',
    '[id*="reject"]',
    '[id*="decline"]',
    '[id*="deny"]',
    'button[aria-label*="reject"]',
    'button[aria-label*="decline"]',
    '[data-action*="reject"]',
    '[data-action*="deny"]'
  ];

  // window.open() popup blocking for cookie/privacy popups is handled by
  // cookie-popup-blocker-main.js running in the MAIN world (bypasses CSP)

  // Known CMP configurations: selector -> button selectors to click (in priority order)
  const KNOWN_CMPS = [
    {
      banner: '#onetrust-banner-sdk',
      buttons: ['#onetrust-reject-all-handler', '#onetrust-accept-btn-handler']
    },
    {
      banner: '#didomi-popup, .didomi-popup',
      buttons: [
        '#didomi-notice-disagree-button',
        '#didomi-notice-agree-button',
        '[class*="didomi"] button:first-of-type'
      ]
    },
    {
      banner: '.quantcast-choice, #qc-cmp2-container',
      buttons: ['.qc-cmp2-summary-buttons[mode="secondary"]', '.qc-cmp2-summary-buttons']
    },
    {
      banner: '#CybotCookiebotDialog',
      buttons: [
        '#CybotCookiebotDialogBodyButtonDecline',
        '#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll',
        '#CybotCookiebotDialogBodyButtonAccept'
      ]
    },
    {
      banner: '#usercentrics-root',
      buttons: ['[data-testid="uc-deny-all-button"]', '[data-testid="uc-accept-all-button"]']
    },
    {
      banner: '.gc-consent-popup, .gc-consent-popup__modal-content',
      buttons: ['.gc-consent-popup__button', '.gc-consent-popup__button:last-child']
    }
  ];

  const processedBanners = new Set();

  function dismissKnownCMP() {
    for (const cmp of KNOWN_CMPS) {
      const banner = document.querySelector(cmp.banner);
      if (!banner) {continue;}
      const bannerId = cmp.banner;
      if (processedBanners.has(bannerId)) {continue;}

      for (const btnSelector of cmp.buttons) {
        const btn = banner.querySelector(btnSelector) || document.querySelector(btnSelector);
        if (btn) {
          btn.click();
          processedBanners.add(bannerId);
          return true;
        }
      }
      // No button found — hide the banner
      banner.style.display = 'none';
      processedBanners.add(bannerId);
      return true;
    }
    return false;
  }

  // Text patterns for button matching (privacy-first: reject patterns first)
  const REJECT_TEXT = [
    'reject all',
    'deny all',
    'decline all',
    'required only',
    'only necessary',
    'necessary only',
    'essential only',
    'only essential'
  ];
  const ACCEPT_TEXT = [
    'accept all',
    'allow all',
    'agree',
    'confirm my choices',
    'got it',
    'i understand'
  ];
  const CONSENT_KEYWORDS = ['cookie', 'consent', 'privacy', 'tracking', 'analytics', 'gdpr'];

  function isConsentDialog(el) {
    const text = el.textContent.toLowerCase();
    return CONSENT_KEYWORDS.filter((k) => text.includes(k)).length >= 2;
  }

  function findButtonByText(container, textPatterns) {
    const buttons = container.querySelectorAll('button, [role="button"], a.button, a.btn');
    for (const pattern of textPatterns) {
      for (const btn of buttons) {
        if (btn.textContent.toLowerCase().trim().includes(pattern)) {
          return btn;
        }
      }
    }
    return null;
  }

  function dismissConsentDialog() {
    const dialogs = document.querySelectorAll('[role="dialog"][aria-modal="true"]');
    for (const dialog of dialogs) {
      if (!isConsentDialog(dialog)) {continue;}
      const dialogId = 'dialog:' + (dialog.className || 'unknown');
      if (processedBanners.has(dialogId)) {continue;}

      const rejectBtn = findButtonByText(dialog, REJECT_TEXT);
      if (rejectBtn) {
        rejectBtn.click();
        processedBanners.add(dialogId);
        return true;
      }
      const acceptBtn = findButtonByText(dialog, ACCEPT_TEXT);
      if (acceptBtn) {
        acceptBtn.click();
        processedBanners.add(dialogId);
        return true;
      }
      // No recognized button — hide it
      dialog.style.display = 'none';
      processedBanners.add(dialogId);
      return true;
    }
    return false;
  }

  function findCookieBanner() {
    for (const selector of COOKIE_BANNER_SELECTORS) {
      try {
        const elements = document.querySelectorAll(selector);
        for (const el of elements) {
          if (isCookieBanner(el)) {
            return el;
          }
        }
      } catch {
        // Invalid selector, skip
      }
    }
    return null;
  }

  function isCookieBanner(element) {
    const text = element.textContent.toLowerCase();
    const keywords = [
      'cookie',
      'consent',
      'gdpr',
      'privacy',
      'tracking',
      'analytics',
      'personalize',
      'accept',
      'decline'
    ];

    const matchCount = keywords.filter((k) => text.includes(k)).length;
    return matchCount >= 2 && element.offsetHeight > 100;
  }

  function findButton(container, buttonSelectors) {
    for (const selector of buttonSelectors) {
      try {
        const buttons = container.querySelectorAll(selector);
        for (const btn of buttons) {
          if (isVisible(btn)) {
            return btn;
          }
        }
      } catch {
        // Invalid selector, skip
      }
    }
    return null;
  }

  function isVisible(element) {
    if (!element) {
      return false;
    }
    const style = window.getComputedStyle(element);
    return (
      style.display !== 'none' &&
      style.visibility !== 'hidden' &&
      style.opacity !== '0' &&
      element.offsetWidth > 0 &&
      element.offsetHeight > 0
    );
  }

  function dismissBanner(banner) {
    const bannerId = banner.id || banner.className || 'unknown';
    if (processedBanners.has(bannerId)) {
      return;
    }

    // Try to click accept button first, then reject, then just hide
    const acceptBtn = findButton(banner, ACCEPT_BUTTONS);
    const rejectBtn = findButton(banner, REJECT_BUTTONS);

    if (acceptBtn) {
      acceptBtn.click();
      processedBanners.add(bannerId);
      return true;
    }

    if (rejectBtn) {
      rejectBtn.click();
      processedBanners.add(bannerId);
      return true;
    }

    // If no button found, hide the banner
    banner.style.display = 'none';
    processedBanners.add(bannerId);
    return true;
  }

  function blockCookieBanner() {
    // Try known CMPs first (no heuristic needed)
    if (dismissKnownCMP()) {return;}

    // Try generic dialog-based consent detection (text matching)
    if (dismissConsentDialog()) {return;}

    // Fall back to heuristic detection
    const banner = findCookieBanner();
    if (banner) {
      dismissBanner(banner);
    }
  }

  function start() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', blockCookieBanner);
    } else {
      blockCookieBanner();
    }

    const target = document.body || document.documentElement;
    if (target) {
      const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          if (mutation.addedNodes.length > 0) {
            blockCookieBanner();
          }
        }
      });
      observer.observe(target, { childList: true, subtree: true });
    }
  }

  // Check whitelist before running
  const syncStorage = typeof chrome !== 'undefined' ? chrome?.storage?.sync : null;
  if (syncStorage) {
    syncStorage.get(['whitelist', 'features'], (prefs) => {
      if (chrome?.runtime?.lastError) {
        return;
      }
      if (prefs?.features?.cookieBannerBlocker === false) {
        return;
      }
      if (prefs?.whitelist && prefs.whitelist.some((s) => host.includes(s))) {
        return;
      }
      start();
    });
  } else {
    start();
  }

  // Export for testing
  if (typeof window !== 'undefined') {
    window.CookieBannerBlocker = {
      findCookieBanner,
      dismissBanner,
      dismissKnownCMP,
      processedBanners
    };
  }
})();
