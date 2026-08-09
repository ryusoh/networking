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

  const isRecentUserClick = () => Date.now() - lastUserInteractionTime < 500;
  const isNearTop = () => (window.scrollY || window.pageYOffset || 0) < 400;

  function trackUserInteractions() {
    ['click', 'keydown', 'mousedown', 'touchstart', 'pointerdown'].forEach((evtType) => {
      window.addEventListener(
        evtType,
        () => {
          lastUserInteractionTime = Date.now();
        },
        { capture: true, passive: true }
      );
    });
  }

  function interceptFocus() {
    /** @param {any} proto */
    const wrapFocus = (proto) => {
      if (proto && proto.focus) {
        const origFocus = proto.focus;
        /** @param {any} [options] */
        proto.focus = function (options) {
          const safeOpts =
            options && typeof options === 'object'
              ? Object.assign({}, options, { preventScroll: true })
              : { preventScroll: true };
          return origFocus.call(this, safeOpts);
        };
      }
    };
    if (typeof Element !== 'undefined') {
      wrapFocus(Element.prototype);
    }
    if (typeof HTMLElement !== 'undefined' && HTMLElement.prototype !== Element.prototype) {
      wrapFocus(HTMLElement.prototype);
    }
  }

  function interceptScrollIntoView() {
    /** @param {string} methodName */
    const wrapScrollIntoView = (methodName) => {
      const proto = /** @type {any} */ (typeof Element !== 'undefined' ? Element.prototype : null);
      if (proto && proto[methodName]) {
        const origFn = proto[methodName];
        /** @param {any[]} args */
        proto[methodName] = function (...args) {
          if (isNearTop() && !isRecentUserClick()) {
            const rect =
              typeof this.getBoundingClientRect === 'function'
                ? this.getBoundingClientRect()
                : null;
            const winHeight = window.innerHeight || 800;
            if (!rect || rect.top > winHeight * 0.4 || rect.top > 200) {
              return;
            }
          }
          return origFn.apply(this, args);
        };
      }
    };
    wrapScrollIntoView('scrollIntoView');
    wrapScrollIntoView('scrollIntoViewIfNeeded');
  }

  /**
   * @param {any} x
   * @param {any} [y]
   * @returns {number}
   */
  function getScrollTargetY(x, y) {
    if (typeof x === 'object' && x !== null) {
      const optTop = /** @type {any} */ (x).top;
      return optTop !== undefined ? optTop : window.scrollY || window.pageYOffset || 0;
    }
    if (typeof y === 'number') {
      return y;
    }
    return 0;
  }

  /**
   * @param {any} x
   * @param {any} [y]
   * @returns {number}
   */
  function getScrollDeltaY(x, y) {
    if (typeof x === 'object' && x !== null) {
      return /** @type {any} */ (x).top || 0;
    }
    if (typeof y === 'number') {
      return y;
    }
    return 0;
  }

  function interceptWindowScroll() {
    if (typeof window === 'undefined') {
      return;
    }

    if (window.scrollTo) {
      const origScrollTo = window.scrollTo.bind(window);
      /**
       * @param {any} x
       * @param {any} [y]
       */
      const filterScroll = function (x, y) {
        const targetY = getScrollTargetY(x, y);
        const currentY = window.scrollY || window.pageYOffset || 0;

        if (isNearTop() && targetY > currentY + 150 && !isRecentUserClick()) {
          return;
        }

        if (typeof x === 'object') {
          return origScrollTo(x);
        }
        return origScrollTo(x, y);
      };

      /** @type {any} */ (window).scrollTo = filterScroll;
      /** @type {any} */ (window).scroll = filterScroll;
    }

    if (window.scrollBy) {
      const origScrollBy = window.scrollBy.bind(window);
      /**
       * @param {any} x
       * @param {any} [y]
       */
      const filterScrollBy = function (x, y) {
        const deltaY = getScrollDeltaY(x, y);

        if (isNearTop() && deltaY > 150 && !isRecentUserClick()) {
          return;
        }

        if (typeof x === 'object') {
          return origScrollBy(x);
        }
        return origScrollBy(x, y);
      };

      /** @type {any} */ (window).scrollBy = filterScrollBy;
    }
  }

  function interceptScrollTop() {
    const protoForScrollTop =
      typeof Element !== 'undefined'
        ? Element.prototype
        : typeof HTMLElement !== 'undefined'
          ? HTMLElement.prototype
          : null;

    if (!protoForScrollTop) {
      return;
    }

    const desc =
      Object.getOwnPropertyDescriptor(protoForScrollTop, 'scrollTop') ||
      (typeof HTMLElement !== 'undefined'
        ? Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'scrollTop')
        : null);

    if (desc && desc.set) {
      const origSet = desc.set;
      Object.defineProperty(protoForScrollTop, 'scrollTop', {
        get: desc.get,
        /** @param {number} val */
        set: function (val) {
          if (
            this === document.documentElement ||
            this === document.body ||
            (document.scrollingElement && this === document.scrollingElement)
          ) {
            const currentY = window.scrollY || window.pageYOffset || 0;
            if (isNearTop() && val > currentY + 150 && !isRecentUserClick()) {
              return;
            }
          }
          return origSet.call(this, val);
        },
        configurable: true,
        enumerable: desc.enumerable
      });
    }
  }

  trackUserInteractions();
  interceptFocus();
  interceptScrollIntoView();
  interceptWindowScroll();
  interceptScrollTop();
})();
