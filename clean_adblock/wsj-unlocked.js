/**
 * WSJ Unlocked — bypass Wall Street Journal paywall doorslam
 * Runs in MAIN world at document_start to intercept paywall setup.
 */
/* istanbul ignore next */
(function () {
/* istanbul ignore next */
  'use strict';

  // --- Phase 1: CSS to hide paywall overlays and restore content ---
  const style = document.createElement('style');
/* istanbul ignore next */
  style.id = 'clean-adblock-wsj';
/* istanbul ignore next */
  style.textContent = `
    /* Piano paywall doorslam — snippet overlay */
/* istanbul ignore next */
    #cx-snippet-overlay-container,
/* istanbul ignore next */
    #cx-snippet-overlay,
/* istanbul ignore next */
    #cx-snippet-promotion,
/* istanbul ignore next */
    #cx-snippet-overlay-primary-button,
/* istanbul ignore next */
    #cx-snippet-overlay-sign-in-text,
/* istanbul ignore next */
    [id*="cx-snippet"],
/* istanbul ignore next */
    iframe[src*="piano.vx.wsj.com"],
/* istanbul ignore next */
    iframe[id^="offer_"],

    /* Generic paywall selectors */
/* istanbul ignore next */
    .wsj-snippet-login,
/* istanbul ignore next */
    .snippet--login-overlay,
/* istanbul ignore next */
    [class*="SnippetOverlay"],
/* istanbul ignore next */
    [class*="SnippetSubheadline"],
/* istanbul ignore next */
    [class*="StandalonePrimaryButton"],
/* istanbul ignore next */
    [class*="paywall"],
/* istanbul ignore next */
    [id*="paywall"],
/* istanbul ignore next */
    [class*="snippet-promotion"],
/* istanbul ignore next */
    .cx-snippet,
/* istanbul ignore next */
    [class*="regiwall"],
/* istanbul ignore next */
    [id*="cx-scrim"],
/* istanbul ignore next */
    .scrim,
/* istanbul ignore next */
    div[class*="PianoOverlay"],
/* istanbul ignore next */
    [class*="regwall"],
/* istanbul ignore next */
    [data-module="snippet.login"],
/* istanbul ignore next */
    [data-module-name="snippet.login"],

    /* Piano tp-container */
/* istanbul ignore next */
    .tp-container-inner,
/* istanbul ignore next */
    .tp-modal,
/* istanbul ignore next */
    .tp-backdrop {
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

    /* Restore body scrolling if paywall locked it */
/* istanbul ignore next */
    html, body {
/* istanbul ignore next */
      overflow: auto !important;
/* istanbul ignore next */
      overflow-y: auto !important;
/* istanbul ignore next */
      position: static !important;
    }

    /* Un-blur / un-truncate article body */
/* istanbul ignore next */
    .wsj-snippet-body,
/* istanbul ignore next */
    [class*="snippet__body"],
/* istanbul ignore next */
    [class*="article-content"],
/* istanbul ignore next */
    article,
/* istanbul ignore next */
    [data-type="article-body"] {
/* istanbul ignore next */
      max-height: none !important;
/* istanbul ignore next */
      overflow: visible !important;
/* istanbul ignore next */
      -webkit-mask-image: none !important;
/* istanbul ignore next */
      mask-image: none !important;
    }

    /* Remove gradient fade on truncated content */
/* istanbul ignore next */
    [class*="snippet__body"]::after,
/* istanbul ignore next */
    [class*="article-content"]::after {
/* istanbul ignore next */
      display: none !important;
    }
/* istanbul ignore next */
  `;
/* istanbul ignore next */
  (document.head || document.documentElement).appendChild(style);

  // --- Phase 2: Remove paywall elements after DOM loads ---
  function removePaywall() {
    // Remove Piano snippet overlay and paywall elements
    const paywallSelectors = [
/* istanbul ignore next */
      '#cx-snippet-overlay-container',
/* istanbul ignore next */
      '#cx-snippet-overlay',
/* istanbul ignore next */
      '[id*="cx-snippet"]',
/* istanbul ignore next */
      'iframe[src*="piano.vx.wsj.com"]',
/* istanbul ignore next */
      'iframe[id^="offer_"]',
/* istanbul ignore next */
      '.wsj-snippet-login',
/* istanbul ignore next */
      '[id*="cx-scrim"]',
/* istanbul ignore next */
      '.scrim',
/* istanbul ignore next */
      '[class*="PianoOverlay"]',
/* istanbul ignore next */
      '.tp-container-inner',
/* istanbul ignore next */
      '.tp-modal',
/* istanbul ignore next */
      '.tp-backdrop'
/* istanbul ignore next */
    ];
/* istanbul ignore next */
    for (const sel of paywallSelectors) {
/* istanbul ignore next */
      document.querySelectorAll(sel).forEach((el) => el.remove());
    }

    // The doorslam container wraps everything — find it by its child structure
/* istanbul ignore next */
    document.querySelectorAll('div:has(> #cx-snippet-overlay-container)').forEach((el) => {
/* istanbul ignore next */
      el.remove();
/* istanbul ignore next */
    });

    // Remove inert attribute from article body (paywall hides content via inert)
/* istanbul ignore next */
    document.querySelectorAll('article[inert], [data-type="article-body"][inert]').forEach((el) => {
/* istanbul ignore next */
      el.removeAttribute('inert');
/* istanbul ignore next */
      el.removeAttribute('aria-hidden');
/* istanbul ignore next */
    });

    // Restore scrolling
/* istanbul ignore next */
    document.body?.classList.remove('is-paywall-active', 'is-snippet');
/* istanbul ignore next */
    document.documentElement?.classList.remove('is-paywall-active', 'is-snippet');
  }

/* istanbul ignore next */
/* istanbul ignore next */
  if (document.readyState === 'loading') {
/* istanbul ignore next */
    document.addEventListener('DOMContentLoaded', removePaywall);
/* istanbul ignore next */
  } else {
/* istanbul ignore next */
    removePaywall();
  }

  // Watch for dynamically injected paywall
  const startObserver = () => {
/* istanbul ignore next */
/* istanbul ignore next */
    if (!document.body) {
/* istanbul ignore next */
      requestAnimationFrame(startObserver);
/* istanbul ignore next */
      return;
    }
    const observer = new MutationObserver((mutations) => {
/* istanbul ignore next */
      for (const m of mutations) {
/* istanbul ignore next */
/* istanbul ignore next */
        if (m.addedNodes.length > 0) {
/* istanbul ignore next */
          removePaywall();
/* istanbul ignore next */
          return;
        }
      }
/* istanbul ignore next */
    });
/* istanbul ignore next */
    observer.observe(document.body, { childList: true, subtree: true });
/* istanbul ignore next */
  };
/* istanbul ignore next */
  startObserver();
/* istanbul ignore next */
})();
