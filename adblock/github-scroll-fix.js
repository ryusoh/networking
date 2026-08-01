/**
 * github-scroll-fix.js - Prevents automated drop-to-bottom scroll behavior on github.com
 */
(function () {
  'use strict';

  if (
    typeof window === 'undefined' ||
    !window.location ||
    !window.location.hostname.includes('github.com')
  ) {
    return;
  }

  let lastUserInteractionTime = 0;

  // Track explicit user clicks/keys so user-initiated navigation is permitted
  ['click', 'keydown', 'mousedown'].forEach((evtType) => {
    window.addEventListener(
      evtType,
      () => {
        lastUserInteractionTime = Date.now();
      },
      { capture: true, passive: true }
    );
  });

  // 1. Intercept HTMLElement.prototype.focus to enforce { preventScroll: true }
  if (typeof HTMLElement !== 'undefined' && HTMLElement.prototype.focus) {
    const origFocus = HTMLElement.prototype.focus;
    HTMLElement.prototype.focus = function (options) {
      if (options && typeof options === 'object') {
        options.preventScroll = true;
        return origFocus.call(this, options);
      }
      return origFocus.call(this, { preventScroll: true });
    };
  }

  // 2. Intercept Element.prototype.scrollIntoView to block automated jumps to bottom when near top
  if (typeof Element !== 'undefined' && Element.prototype.scrollIntoView) {
    const origScrollIntoView = Element.prototype.scrollIntoView;
    Element.prototype.scrollIntoView = function (arg) {
      const isRecentUserClick = Date.now() - lastUserInteractionTime < 500;
      const isNearTop = (window.scrollY || window.pageYOffset || 0) < 400;
      const rect =
        typeof this.getBoundingClientRect === 'function' ? this.getBoundingClientRect() : null;
      const isNearBottom = rect && rect.top > (window.innerHeight || 800) * 1.5;

      if (isNearTop && isNearBottom && !isRecentUserClick) {
        return;
      }
      return origScrollIntoView.call(this, arg);
    };
  }

  // 3. Intercept window.scrollTo and window.scroll to block programmatic drop-to-bottom
  if (typeof window !== 'undefined' && window.scrollTo) {
    const origScrollTo = window.scrollTo.bind(window);
    /**
     * @param {any} x
     * @param {any} [y]
     */
    const filterScroll = function (x, y) {
      let targetY = 0;
      if (typeof x === 'object' && x !== null) {
        targetY = x.top || 0;
      } else if (typeof y === 'number') {
        targetY = y;
      }

      const isRecentUserClick = Date.now() - lastUserInteractionTime < 500;
      const currentY = window.scrollY || window.pageYOffset || 0;
      const isNearTop = currentY < 400;
      const docHeight = Math.max(
        document.body ? document.body.scrollHeight : 0,
        document.documentElement ? document.documentElement.scrollHeight : 0
      );
      const winHeight = window.innerHeight || 800;
      const maxScroll = docHeight - winHeight;

      if (isNearTop && targetY > maxScroll * 0.7 && maxScroll > 800 && !isRecentUserClick) {
        return;
      }

      if (typeof x === 'object') {
        return origScrollTo(x);
      }
      return origScrollTo(x, y);
    };

    window.scrollTo = filterScroll;
    window.scroll = filterScroll;
  }
})();
