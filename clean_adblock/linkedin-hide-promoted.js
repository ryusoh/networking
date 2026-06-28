/**
 * LinkedIn: Hide Promoted Cards (Merged from linkedin_fix/hide_promoted.js)
 * -------------------------------------------
 * Identifies and removes "Promoted" advertisement cards.
 * Always enabled - no toggle required.
 */

/* istanbul ignore next */
(function () {
/* istanbul ignore next */
  'use strict';

  function hidePromoted() {
    // The MutationObserver can fire asynchronously during page teardown/bfcache
    // (or test environment teardown), when `document` is no longer available.
/* istanbul ignore next */
    if (typeof document === 'undefined' || !document) {
/* istanbul ignore next */
      return;
    }
    // 1. Target specific "Promoted" links and paragraphs
    const adSelectors = [
/* istanbul ignore next */
      'a[data-testid="header-url"][href*="/ads/start"]',
/* istanbul ignore next */
      'p.text-color-icon.text-xs.font-semibold',
/* istanbul ignore next */
      '.text-color-icon.font-semibold'
/* istanbul ignore next */
    ];

/* istanbul ignore next */
    adSelectors.forEach((selector) => {
/* istanbul ignore next */
      document.querySelectorAll(selector).forEach((el) => {
/* istanbul ignore next */
/* istanbul ignore next */
        if (el.textContent.trim() === 'Promoted') {
          // Find the outer card container
          // LinkedIn sidebar ads are usually inside an 'aside' or a themed div
          const card =
/* istanbul ignore next */
            el.closest('aside') ||
/* istanbul ignore next */
            el.closest('.artdeco-card') ||
/* istanbul ignore next */
            el.closest('div[data-testid="cellInnerDiv"]') ||
/* istanbul ignore next */
            el.closest('.ad-banner-container');

/* istanbul ignore next */
/* istanbul ignore next */
          if (card && card.style.display !== 'none') {
/* istanbul ignore next */
            card.style.setProperty('display', 'none', 'important');
/* istanbul ignore next */
            console.log('[LinkedIn Fix] Hidden Promoted Card via specific selector');
          }
        }
/* istanbul ignore next */
      });
/* istanbul ignore next */
    });

    // 2. Catch-all for any element containing ONLY the word "Promoted" inside the sidebar
    const sidebar = document.querySelector('.right-rail, [data-testid="sidebarColumn"], aside');
/* istanbul ignore next */
/* istanbul ignore next */
    if (sidebar) {
      const allElements = sidebar.querySelectorAll('span, p, a, div');
/* istanbul ignore next */
      allElements.forEach((el) => {
/* istanbul ignore next */
/* istanbul ignore next */
        if (el.children.length === 0 && el.textContent.trim() === 'Promoted') {
          const card = el.closest('.artdeco-card') || el.closest('aside') || el.closest('div');
/* istanbul ignore next */
/* istanbul ignore next */
          if (card && card !== sidebar) {
/* istanbul ignore next */
            card.style.setProperty('display', 'none', 'important');
          }
        }
/* istanbul ignore next */
      });
    }
  }

  // Use MutationObserver to catch dynamic loads (LinkedIn loads rail content late)
  const observer = new MutationObserver(hidePromoted);
/* istanbul ignore next */
  observer.observe(document.documentElement, { childList: true, subtree: true });

  // Initial run
/* istanbul ignore next */
  hidePromoted();
/* istanbul ignore next */
})();
