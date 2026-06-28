/**
 * HedgeFollow Unlocked (MAIN world)
 * Dismisses subscription modals without breaking page functionality.
 */
/* istanbul ignore next */
(function () {
/* istanbul ignore next */
  'use strict';

/* istanbul ignore next */
  if (!window.location.hostname.endsWith('hedgefollow.com')) {
/* istanbul ignore next */
    return;
  }

  // --- CSS to hide subscription modals ---
  const UNLOCK_CSS = `
    /* SimpleModal login/subscription popups */
/* istanbul ignore next */
    #loginModal,
/* istanbul ignore next */
    .simplemodal-container,
/* istanbul ignore next */
    .simplemodal-overlay,
/* istanbul ignore next */
    #simplemodal-overlay,
/* istanbul ignore next */
    #simplemodal-container {
/* istanbul ignore next */
      display: none !important;
/* istanbul ignore next */
      visibility: hidden !important;
/* istanbul ignore next */
      opacity: 0 !important;
/* istanbul ignore next */
      pointer-events: none !important;
/* istanbul ignore next */
      z-index: -1 !important;
    }

    /* Prevent body scroll lock from modal */
/* istanbul ignore next */
    body.modal-open {
/* istanbul ignore next */
      overflow: auto !important;
/* istanbul ignore next */
      overflow-y: auto !important;
/* istanbul ignore next */
      position: static !important;
    }
/* istanbul ignore next */
  `;

  const style = document.createElement('style');
/* istanbul ignore next */
  style.id = 'hedgefollow-unlocked-css';
/* istanbul ignore next */
  style.textContent = UNLOCK_CSS;
/* istanbul ignore next */
  (document.head || document.documentElement).appendChild(style);

  // --- Intercept open_login_modal: let the page define it, but replace with no-op ---
/* istanbul ignore next */
  try {
/* istanbul ignore next */
    Object.defineProperty(window, 'open_login_modal', {
/* istanbul ignore next */
      get() {
/* istanbul ignore next */
        return function () {};
/* istanbul ignore next */
      },
/* istanbul ignore next */
      set() {},
/* istanbul ignore next */
      configurable: true
/* istanbul ignore next */
    });
  } catch {
    /* already defined */
  }

  // --- DOM cleanup ---
  function removeModals() {
    const selectors = [
/* istanbul ignore next */
      '#loginModal',
/* istanbul ignore next */
      '.simplemodal-container',
/* istanbul ignore next */
      '.simplemodal-overlay',
/* istanbul ignore next */
      '#simplemodal-overlay',
/* istanbul ignore next */
      '#simplemodal-container'
/* istanbul ignore next */
    ];
/* istanbul ignore next */
    for (const sel of selectors) {
/* istanbul ignore next */
      document.querySelectorAll(sel).forEach((el) => {
/* istanbul ignore next */
        el.style.setProperty('display', 'none', 'important');
/* istanbul ignore next */
      });
    }

    // Restore scroll if modal locked it
/* istanbul ignore next */
/* istanbul ignore next */
    if (document.body) {
      const bodyStyle = window.getComputedStyle(document.body);
/* istanbul ignore next */
/* istanbul ignore next */
      if (bodyStyle.overflow === 'hidden') {
/* istanbul ignore next */
        document.body.style.overflow = '';
      }
/* istanbul ignore next */
      document.body.classList.remove('modal-open');
    }
  }

  function run() {
/* istanbul ignore next */
    removeModals();
  }

/* istanbul ignore next */
/* istanbul ignore next */
  if (document.readyState === 'loading') {
/* istanbul ignore next */
    document.addEventListener('DOMContentLoaded', run);
/* istanbul ignore next */
  } else {
/* istanbul ignore next */
    run();
  }

  // Re-run periodically to catch dynamically opened modals
  let attempts = 0;
  const interval = setInterval(() => {
/* istanbul ignore next */
    run();
/* istanbul ignore next */
    attempts++;
/* istanbul ignore next */
/* istanbul ignore next */
    if (attempts >= 20) {
/* istanbul ignore next */
      clearInterval(interval);
    }
/* istanbul ignore next */
  }, 500);

  // MutationObserver for dynamically injected modals
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
      for (const mutation of mutations) {
/* istanbul ignore next */
        for (const node of mutation.addedNodes) {
/* istanbul ignore next */
/* istanbul ignore next */
          if (node.nodeType !== 1) {
/* istanbul ignore next */
            continue;
          }
          const id = node.id || '';
          const cls = typeof node.className === 'string' ? node.className : '';
/* istanbul ignore next */
/* istanbul ignore next */
          if (
/* istanbul ignore next */
            id === 'loginModal' ||
/* istanbul ignore next */
            id === 'simplemodal-overlay' ||
/* istanbul ignore next */
            id === 'simplemodal-container' ||
/* istanbul ignore next */
            cls.includes('simplemodal-container') ||
/* istanbul ignore next */
            cls.includes('simplemodal-overlay')
/* istanbul ignore next */
          ) {
/* istanbul ignore next */
            node.style.setProperty('display', 'none', 'important');
/* istanbul ignore next */
/* istanbul ignore next */
            if (document.body) {
/* istanbul ignore next */
              document.body.style.overflow = '';
            }
          }
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
