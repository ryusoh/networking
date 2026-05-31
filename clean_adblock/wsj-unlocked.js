/**
 * WSJ Unlocked — bypass Wall Street Journal paywall doorslam
 * Runs in MAIN world at document_start to intercept paywall setup.
 */
(function () {
  'use strict';

  // --- Phase 1: CSS to hide paywall overlays and restore content ---
  const style = document.createElement('style');
  style.id = 'clean-adblock-wsj';
  style.textContent = `
    /* Piano paywall doorslam — snippet overlay */
    #cx-snippet-overlay-container,
    #cx-snippet-overlay,
    #cx-snippet-promotion,
    #cx-snippet-overlay-primary-button,
    #cx-snippet-overlay-sign-in-text,
    [id*="cx-snippet"],
    iframe[src*="piano.vx.wsj.com"],
    iframe[id^="offer_"],

    /* Generic paywall selectors */
    .wsj-snippet-login,
    .snippet--login-overlay,
    [class*="SnippetOverlay"],
    [class*="SnippetSubheadline"],
    [class*="StandalonePrimaryButton"],
    [class*="paywall"],
    [id*="paywall"],
    [class*="snippet-promotion"],
    .cx-snippet,
    [class*="regiwall"],
    [id*="cx-scrim"],
    .scrim,
    div[class*="PianoOverlay"],
    [class*="regwall"],
    [data-module="snippet.login"],
    [data-module-name="snippet.login"],

    /* Piano tp-container */
    .tp-container-inner,
    .tp-modal,
    .tp-backdrop {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
      height: 0 !important;
      min-height: 0 !important;
      max-height: 0 !important;
      overflow: hidden !important;
      pointer-events: none !important;
    }

    /* Restore body scrolling if paywall locked it */
    html, body {
      overflow: auto !important;
      overflow-y: auto !important;
      position: static !important;
    }

    /* Un-blur / un-truncate article body */
    .wsj-snippet-body,
    [class*="snippet__body"],
    [class*="article-content"],
    article,
    [data-type="article-body"] {
      max-height: none !important;
      overflow: visible !important;
      -webkit-mask-image: none !important;
      mask-image: none !important;
    }

    /* Remove gradient fade on truncated content */
    [class*="snippet__body"]::after,
    [class*="article-content"]::after {
      display: none !important;
    }
  `;
  (document.head || document.documentElement).appendChild(style);

  // --- Phase 2: Remove paywall elements after DOM loads ---
  function removePaywall() {
    // Remove Piano snippet overlay and paywall elements
    const paywallSelectors = [
      '#cx-snippet-overlay-container',
      '#cx-snippet-overlay',
      '[id*="cx-snippet"]',
      'iframe[src*="piano.vx.wsj.com"]',
      'iframe[id^="offer_"]',
      '.wsj-snippet-login',
      '[id*="cx-scrim"]',
      '.scrim',
      '[class*="PianoOverlay"]',
      '.tp-container-inner',
      '.tp-modal',
      '.tp-backdrop'
    ];
    for (const sel of paywallSelectors) {
      document.querySelectorAll(sel).forEach((el) => el.remove());
    }

    // The doorslam container wraps everything — find it by its child structure
    document.querySelectorAll('div:has(> #cx-snippet-overlay-container)').forEach((el) => {
      el.remove();
    });

    // Remove inert attribute from article body (paywall hides content via inert)
    document.querySelectorAll('article[inert], [data-type="article-body"][inert]').forEach((el) => {
      el.removeAttribute('inert');
      el.removeAttribute('aria-hidden');
    });

    // Restore scrolling
    document.body?.classList.remove('is-paywall-active', 'is-snippet');
    document.documentElement?.classList.remove('is-paywall-active', 'is-snippet');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', removePaywall);
  } else {
    removePaywall();
  }

  // Watch for dynamically injected paywall
  const startObserver = () => {
    if (!document.body) {
      requestAnimationFrame(startObserver);
      return;
    }
    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.addedNodes.length > 0) {
          removePaywall();
          return;
        }
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  };
  startObserver();
})();
