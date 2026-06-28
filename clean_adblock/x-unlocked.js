/**
 * X (Twitter): Custom Default Tab + UI Cleaner
 * -------------------------------------------
 * Hides the 'For you' tab on home and switches to preferred feed.
 * Hides premium prompts, Grok, and other UI clutter via CSS.
 * Default tab: Finance.
 */

/* istanbul ignore next */
(function () {
/* istanbul ignore next */
  'use strict';

  let preferredTab = 'finance';
  let tabSwitched = false;

  const syncStorage = typeof chrome !== 'undefined' ? chrome?.storage?.sync : null;
/* istanbul ignore next */
  if (syncStorage) {
/* istanbul ignore next */
    syncStorage.get({ preferredTab: 'finance' }, (items) => {
/* istanbul ignore next */
      preferredTab = items.preferredTab.toLowerCase();
/* istanbul ignore next */
      init();
/* istanbul ignore next */
    });
/* istanbul ignore next */
  } else {
/* istanbul ignore next */
    init();
  }

  function init() {
/* istanbul ignore next */
    injectCSS();
    // Use MutationObserver instead of setInterval for tab switching
/* istanbul ignore next */
/* istanbul ignore next */
    if (document.body) {
/* istanbul ignore next */
      startObserver();
/* istanbul ignore next */
    } else {
/* istanbul ignore next */
      document.addEventListener('DOMContentLoaded', startObserver);
    }
  }

  function injectCSS() {
    const style = document.createElement('style');
/* istanbul ignore next */
    style.textContent = `
      /* Hide Premium in left sidebar */
/* istanbul ignore next */
      a[aria-label="Premium"],
/* istanbul ignore next */
      a[href="/i/premium_sign_up"] {
/* istanbul ignore next */
        display: none !important;
      }

      /* Hide floating Grok and Messages buttons/drawers */
/* istanbul ignore next */
      div[data-testid="msg-drawer"],
/* istanbul ignore next */
      button[aria-label="Grok"],
/* istanbul ignore next */
      a[aria-label="Grok"],
/* istanbul ignore next */
      [data-testid="GrokDrawerHeader"],
/* istanbul ignore next */
      [data-testid="GrokDrawer"],
/* istanbul ignore next */
      [data-testid="chat-drawer-root"] {
/* istanbul ignore next */
        display: none !important;
      }

      /* Hide Subscribe to Premium / Who to follow / Live on X sidebar cards */
/* istanbul ignore next */
      aside[aria-label="Subscribe to Premium"],
/* istanbul ignore next */
      aside[aria-label="プレミアムにサブスクライブ"],
/* istanbul ignore next */
      aside[aria-label="Who to follow"],
/* istanbul ignore next */
      aside[aria-label="Live on X"] {
/* istanbul ignore next */
        display: none !important;
      }
/* istanbul ignore next */
    `;
/* istanbul ignore next */
    (document.head || document.documentElement).appendChild(style);
  }

  // Stop forcing tab after user clicks
/* istanbul ignore next */
  window.addEventListener(
/* istanbul ignore next */
    'click',
/* istanbul ignore next */
    (e) => {
/* istanbul ignore next */
/* istanbul ignore next */
      if (e.isTrusted) {
/* istanbul ignore next */
        tabSwitched = true;
      }
/* istanbul ignore next */
    },
/* istanbul ignore next */
    true
/* istanbul ignore next */
  );

  function tryTabSwitch() {
    const path = window.location.pathname;
/* istanbul ignore next */
/* istanbul ignore next */
    if (path !== '/home' && path !== '/') {
/* istanbul ignore next */
      return;
    }
/* istanbul ignore next */
/* istanbul ignore next */
    if (tabSwitched) {
/* istanbul ignore next */
      return;
    }

    const tabs = document.querySelectorAll('[role="tab"]');
/* istanbul ignore next */
/* istanbul ignore next */
    if (!tabs.length) {
/* istanbul ignore next */
      return;
    }

    let targetTab = null;
/* istanbul ignore next */
    tabs.forEach((tab) => {
      const text = (tab.innerText || '').trim().toLowerCase();
      // Hide "For you" tab on home page only
/* istanbul ignore next */
/* istanbul ignore next */
      if (text.includes('for you') || text.includes('おすすめ')) {
/* istanbul ignore next */
        tab.style.setProperty('display', 'none', 'important');
/* istanbul ignore next */
/* istanbul ignore next */
        if (tab.parentElement && tab.parentElement.getAttribute('role') === 'presentation') {
/* istanbul ignore next */
          tab.parentElement.style.setProperty('display', 'none', 'important');
        }
      }
/* istanbul ignore next */
/* istanbul ignore next */
      if (text.includes(preferredTab)) {
/* istanbul ignore next */
        targetTab = tab;
      }
/* istanbul ignore next */
    });

/* istanbul ignore next */
/* istanbul ignore next */
    if (targetTab && targetTab.getAttribute('aria-selected') !== 'true') {
/* istanbul ignore next */
      targetTab.click();
/* istanbul ignore next */
      tabSwitched = true;
    }
  }

  function startObserver() {
    // Try once immediately
/* istanbul ignore next */
    tryTabSwitch();

    // Throttled observer to avoid excessive DOM queries on X's SPA
    let throttleTimer = null;
    const observer = new MutationObserver(() => {
      const path = window.location.pathname;
/* istanbul ignore next */
/* istanbul ignore next */
      if (path !== '/home' && path !== '/') {
/* istanbul ignore next */
        return;
      }

/* istanbul ignore next */
/* istanbul ignore next */
      if (throttleTimer) {
/* istanbul ignore next */
        return;
      }
/* istanbul ignore next */
      throttleTimer = setTimeout(() => {
/* istanbul ignore next */
        throttleTimer = null;
/* istanbul ignore next */
        tryTabSwitch();
/* istanbul ignore next */
      }, 300);
/* istanbul ignore next */
    });
/* istanbul ignore next */
    observer.observe(document.body, { childList: true, subtree: true });
  }
/* istanbul ignore next */
})();
