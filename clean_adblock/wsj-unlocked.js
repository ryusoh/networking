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
    /* Paywall overlay / modal / curtain */
    .wsj-snippet-login,
    .snippet--login-overlay,
    [class*="paywall"],
    [id*="paywall"],
    [class*="snippet-promotion"],
    .cx-snippet,
    [class*="regiwall"],
    [id*="cx-scrim"],
    .scrim,
    div[class*="PianoOverlay"],
    div[id*="piano"],
    [class*="regwall"],
    [data-module="snippet.login"],
    [data-module-name="snippet.login"] {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
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
    // Remove scrim / overlay divs
    document
      .querySelectorAll(
        '.wsj-snippet-login, [id*="cx-scrim"], .scrim, [class*="PianoOverlay"], [id*="piano"]'
      )
      .forEach((el) => {
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
