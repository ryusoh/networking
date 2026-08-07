/**
 * LinkedIn: Hide Promoted Cards (Merged from linkedin_fix/hide_promoted.js)
 * -------------------------------------------
 * Identifies and removes "Promoted" advertisement cards.
 * Always enabled - no toggle required.
 */

(function () {
  'use strict';

  // 1. Target specific "Promoted" links and paragraphs
  const PROMOTED_SELECTORS = [
    'a[data-testid="header-url"][href*="/ads/start"]',
    'p.text-color-icon.text-xs.font-semibold',
    '.text-color-icon.font-semibold'
  ].join(', ');

  function hidePromotedCardsBySelector() {
    const els = document.querySelectorAll(PROMOTED_SELECTORS);
    for (let i = 0; i < els.length; i++) {
      const el = els[i];
      if (el.textContent && el.textContent.trim() === 'Promoted') {
        // Find the outer card container
        // LinkedIn sidebar ads are usually inside an 'aside' or a themed div
        const card =
          el.closest('aside') ||
          el.closest('.artdeco-card') ||
          el.closest('div[data-testid="cellInnerDiv"]') ||
          el.closest('.ad-banner-container');

        if (card instanceof HTMLElement && card.style.display !== 'none') {
          card.style.setProperty('display', 'none', 'important');
          console.log('[LinkedIn Fix] Hidden Promoted Card via specific selector');
        }
      }
    }
  }

  function hidePromotedCardsInSidebar() {
    // 2. Catch-all for any element containing ONLY the word "Promoted" inside the sidebar
    const sidebar = document.querySelector('.right-rail, [data-testid="sidebarColumn"], aside');
    if (!sidebar) {
      return;
    }
    const allElements = sidebar.querySelectorAll('span, p, a, div');
    for (let i = 0; i < allElements.length; i++) {
      const el = allElements[i];
      if (el.children.length === 0 && el.textContent && el.textContent.trim() === 'Promoted') {
        const card = el.closest('.artdeco-card') || el.closest('aside') || el.closest('div');
        if (card instanceof HTMLElement && card !== sidebar) {
          card.style.setProperty('display', 'none', 'important');
        }
      }
    }
  }

  function hidePromoted() {
    // The MutationObserver can fire asynchronously during page teardown/bfcache
    // (or test environment teardown), when `document` is no longer available.
    if (typeof document === 'undefined' || !document) {
      return;
    }

    hidePromotedCardsBySelector();
    hidePromotedCardsInSidebar();
  }

  // Use MutationObserver to catch dynamic loads (LinkedIn loads rail content late)
  const observer = new MutationObserver((mutations) => {
    let hasAdded = false;
    for (let i = 0; i < mutations.length; i++) {
      if (mutations[i].addedNodes.length > 0) {
        hasAdded = true;
        break;
      }
    }
    if (hasAdded) {
      hidePromoted();
    }
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });

  // Initial run
  hidePromoted();
})();
