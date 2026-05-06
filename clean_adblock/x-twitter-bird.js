/**
 * X (Twitter): Classic Bird Logo Restorer (Merged from x/twitter_bird.js)
 * -------------------------------------------
 * Restores the classic Twitter bird logo and favicon.
 * Always enabled - no toggle required.
 */

(function () {
  'use strict';

  // Inline SVG data URI to avoid exposing chrome-extension:// URLs (detected by X's anti-bot)
  const BIRD_SVG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 248 204'%3E%3Cpath fill='%231d9bf0' d='M221.95 51.29c.15 2.17.15 4.34.15 6.53 0 66.73-50.8 143.69-143.69 143.69v-.04c-27.44.04-54.31-7.82-77.41-22.64 3.99.48 8 .72 12.02.73 22.74.02 44.83-7.61 62.72-21.66-21.61-.41-40.56-14.5-47.18-35.07 7.57 1.46 15.37 1.16 22.8-.87-23.56-4.76-40.51-25.46-40.51-49.5v-.64c7.02 3.91 14.88 6.08 22.92 6.32C11.58 63.31 4.74 33.79 18.14 10.71c25.64 31.55 63.47 50.73 104.08 52.76-4.07-17.54 2.49-35.92 16.42-46.03 21.22-15.39 50.87-10.72 66.26 10.43 10.52-2.07 20.57-5.93 29.85-11.42-3.5 10.82-10.84 20.01-20.55 25.72 9.31-1.11 18.4-3.58 26.89-7.37-6.36 9.48-14.33 17.79-23.57 24.54z'/%3E%3C/svg%3E";

  function replaceFavicon() {
    if (typeof chrome === 'undefined' || !chrome.runtime) {
      return;
    }

    // Replace all icon-related link tags
    const iconLinks = document.querySelectorAll(
      'link[rel="icon"], link[rel="shortcut icon"], link[rel="apple-touch-icon"]'
    );
    let replaced = false;

    iconLinks.forEach((link) => {
      if (!link.href.includes('twitter.png')) {
        link.href = chrome.runtime.getURL('assets/twitter.png');
        replaced = true;
      }
    });

    // If no existing icon links are found, create one
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

  function replaceLogos() {

    // Array of known X logo SVG paths
    const xPaths = [
      'M21.742 21.75l-7.563-11.179 7.056-8.321h-2.456l-5.691 6.714-4.54-6.714H2.359l7.29 10.776L2.25 21.75h2.456l6.035-7.118 4.818 7.118h6.191-.008zM7.739 3.818L18.81 20.182h-2.447L5.29 3.818h2.447z', // New default logo
      'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' // Old logo just in case
    ];

    xPaths.forEach((xPath) => {
      const paths = document.querySelectorAll(`path[d="${xPath}"]`);
      paths.forEach((p) => {
        const svg = p.closest('svg');
        if (svg) {
          // Always enforce hidden state on the SVG
          svg.style.setProperty('display', 'none', 'important');

          // Check if our replacement image is still right next to it
          const sibling = svg.nextElementSibling;
          if (!sibling || !sibling.classList.contains('twitter-bird-replacement')) {
            const img = document.createElement('img');
            img.src = BIRD_SVG;

            // Copy the SVG's classes so it inherits the exact layout/centering (crucial for the loading screen)
            const svgClasses = svg.getAttribute('class') || '';
            img.className = 'twitter-bird-replacement ' + svgClasses;

            // Base sizing fallback in case classes don't define it
            const rect = svg.getBoundingClientRect();
            if (rect.width > 0) {
              img.style.width = rect.width + 'px';
            }
            if (rect.height > 0) {
              img.style.height = rect.height + 'px';
            }
            if (rect.width === 0 && rect.height === 0 && !svgClasses.includes('r-')) {
              // Only hardcode 24px if it has no width and doesn't seem to have React Native Web classes
              img.style.width = '24px';
              img.style.height = '24px';
            }
            img.style.maxWidth = '100%';
            img.style.objectFit = 'contain';

            // Insert the bird right next to the hidden SVG
            svg.parentNode.insertBefore(img, svg.nextSibling);
          }
        }
      });
    });

    // Replace the title
    if (document.title === 'X') {
      document.title = 'Twitter';
    } else if (document.title.endsWith(' / X')) {
      document.title = document.title.replace(/ \/ X$/, ' / Twitter');
    }
  }

  function loop() {
    replaceFavicon();
    replaceLogos();
  }

  // Run on DOM changes with throttle to avoid triggering X's anti-bot detection
  let isModifying = false;
  let throttleTimer = null;

  function throttledLoop() {
    if (throttleTimer) return;
    throttleTimer = setTimeout(() => {
      throttleTimer = null;
      isModifying = true;
      loop();
      isModifying = false;
    }, 300);
  }

  loop();
  if (document.body) {
    const observer = new MutationObserver(() => {
      if (!isModifying) throttledLoop();
    });
    observer.observe(document.body, { childList: true, subtree: true });
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      loop();
      const observer = new MutationObserver(() => {
        if (!isModifying) throttledLoop();
      });
      observer.observe(document.body, { childList: true, subtree: true });
    });
  }
})();
