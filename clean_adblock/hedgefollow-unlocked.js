/**
 * HedgeFollow Unlocked (MAIN world)
 * Dismisses subscription modals without breaking page functionality.
 */
(function () {
  'use strict';

  if (!window.location.hostname.endsWith('hedgefollow.com')) {
    return;
  }

  // --- CSS to hide subscription modals ---
  const UNLOCK_CSS = `
    /* SimpleModal login/subscription popups */
    #loginModal,
    .simplemodal-container,
    .simplemodal-overlay,
    #simplemodal-overlay,
    #simplemodal-container {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
      pointer-events: none !important;
      z-index: -1 !important;
    }

    /* Prevent body scroll lock from modal */
    body.modal-open {
      overflow: auto !important;
      overflow-y: auto !important;
      position: static !important;
    }
  `;

  const style = document.createElement('style');
  style.id = 'hedgefollow-unlocked-css';
  style.textContent = UNLOCK_CSS;
  (document.head || document.documentElement).appendChild(style);

  // --- Intercept open_login_modal: let the page define it, but replace with no-op ---
  try {
    Object.defineProperty(window, 'open_login_modal', {
      get() {
        return function () {};
      },
      set() {},
      configurable: true
    });
  } catch {
    /* already defined */
  }

  // --- DOM cleanup ---
  function removeModals() {
    const selectors = [
      '#loginModal',
      '.simplemodal-container',
      '.simplemodal-overlay',
      '#simplemodal-overlay',
      '#simplemodal-container'
    ];
    for (const sel of selectors) {
      document.querySelectorAll(sel).forEach((el) => {
        if (el instanceof HTMLElement) {
          el.style.setProperty('display', 'none', 'important');
        }
      });
    }

    // Restore scroll if modal locked it
    if (document.body) {
      const bodyStyle = window.getComputedStyle(document.body);
      if (bodyStyle.overflow === 'hidden') {
        document.body.style.overflow = '';
      }
      document.body.classList.remove('modal-open');
    }
  }

  function run() {
    removeModals();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }

  // Re-run periodically to catch dynamically opened modals
  let attempts = 0;
  const interval = setInterval(() => {
    run();
    attempts++;
    if (attempts >= 20) {
      clearInterval(interval);
    }
  }, 500);

  // MutationObserver for dynamically injected modals
  const startObserver = () => {
    if (!document.body) {
      requestAnimationFrame(startObserver);
      return;
    }
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (!(node instanceof HTMLElement)) {
            continue;
          }
          const id = node.id || '';
          const cls = node.className || '';
          if (
            id === 'loginModal' ||
            id === 'simplemodal-overlay' ||
            id === 'simplemodal-container' ||
            cls.includes('simplemodal-container') ||
            cls.includes('simplemodal-overlay')
          ) {
            node.style.setProperty('display', 'none', 'important');
            if (document.body) {
              document.body.style.overflow = '';
            }
          }
        }
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  };
  startObserver();
})();
