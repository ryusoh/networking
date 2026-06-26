/**
 * X (Twitter): Classic Bird Logo Restorer (Merged from x/twitter_bird.js)
 * -------------------------------------------
 * Restores the classic Twitter bird logo and favicon.
 * Always enabled - no toggle required.
 */

(function () {
  'use strict';

  // Inline SVG data URI for the classic bird
  const BIRD_SVG =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 248 204'%3E%3Cpath fill='currentColor' d='M221.95 51.29c.15 2.17.15 4.34.15 6.53 0 66.73-50.8 143.69-143.69 143.69v-.04c-27.44.04-54.31-7.82-77.41-22.64 3.99.48 8 .72 12.02.73 22.74.02 44.83-7.61 62.72-21.66-21.61-.41-40.56-14.5-47.18-35.07 7.57 1.46 15.37 1.16 22.8-.87-23.56-4.76-40.51-25.46-40.51-49.5v-.64c7.02 3.91 14.88 6.08 22.92 6.32C11.58 63.31 4.74 33.79 18.14 10.71c25.64 31.55 63.47 50.73 104.08 52.76-4.07-17.54 2.49-35.92 16.42-46.03 21.22-15.39 50.87-10.72 66.26 10.43 10.52-2.07 20.57-5.93 29.85-11.42-3.5 10.82-10.84 20.01-20.55 25.72 9.31-1.11 18.4-3.58 26.89-7.37-6.36 9.48-14.33 17.79-23.57 24.54z'/%3E%3C/svg%3E";

  function injectCSS() {
    const style = document.createElement('style');
    style.id = 'twitter-bird-style';

    // Array of known X logo SVG paths
    const xPaths = [
      'M21.742 21.75l-7.563-11.179 7.056-8.321h-2.456l-5.691 6.714-4.54-6.714H2.359l7.29 10.776L2.25 21.75h2.456l6.035-7.118 4.818 7.118h6.191-.008zM7.739 3.818L18.81 20.182h-2.447L5.29 3.818h2.447z', // New default logo
      'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' // Old logo just in case
    ];

    let css = '';
    xPaths.forEach((xPath) => {
      // We use :has to target the SVG containing the X path.
      // We hide the inner path.
      css += `
        svg:has(path[d="${xPath}"]) path {
          display: none !important;
        }
        svg:has(path[d="${xPath}"]) {
          background-color: currentColor !important;
          mask-image: url("${BIRD_SVG}") !important;
          mask-size: contain !important;
          mask-repeat: no-repeat !important;
          mask-position: center !important;
          -webkit-mask-image: url("${BIRD_SVG}") !important;
          -webkit-mask-size: contain !important;
          -webkit-mask-repeat: no-repeat !important;
          -webkit-mask-position: center !important;
        }
      `;
    });

    style.textContent = css;
    (document.head || document.documentElement).appendChild(style);
  }

  function replaceFavicon() {
    if (typeof chrome === 'undefined' || !chrome.runtime) {
      return;
    }

    const iconLinks = document.querySelectorAll(
      'link[rel="icon"], link[rel="shortcut icon"], link[rel="apple-touch-icon"]'
    );
    let replaced = false;

    iconLinks.forEach((link) => {
      if (link instanceof window.HTMLLinkElement && !link.href.includes('twitter.png')) {
        link.href = chrome.runtime.getURL('assets/twitter.png');
        replaced = true;
      }
    });

    if (!replaced && iconLinks.length === 0) {
      const target = document.head || document.documentElement;
      if (target) {
        const link = document.createElement('link');
        link.rel = 'shortcut icon';
        link.href = chrome.runtime.getURL('assets/twitter.png');
        target.appendChild(link);
      }
    }
  }

  function updateTitle() {
    if (document.title === 'X') {
      document.title = 'Twitter';
    } else if (document.title.endsWith(' / X')) {
      document.title = document.title.replace(/ \/ X$/, ' / Twitter');
    }
  }

  // Inject CSS once
  injectCSS();

  // Initial title and favicon update
  replaceFavicon();
  updateTitle();

  // Observe head for title and favicon changes
  const headObserver = new MutationObserver(() => {
    updateTitle();
    replaceFavicon();
  });

  if (document.head) {
    headObserver.observe(document.head, { childList: true, subtree: true, characterData: true });
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      headObserver.observe(document.head, { childList: true, subtree: true, characterData: true });
    });
  }
})();
