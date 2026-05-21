/**
 * Cookie Popup Blocker (MAIN world)
 * Runs in the page's JS context via world: "MAIN" to bypass CSP restrictions.
 * Intercepts window.open() calls that open cookie/privacy notice popups.
 */
(function () {
  'use strict';

  const COOKIE_POPUP_PATTERNS = [
    'cookie-notice',
    'cookie-policy',
    'cookie-consent',
    'privacy-notice',
    '/legal/cookie',
    '/privacy-policy/cookie',
    '/consent/cookie',
    '/gdpr/cookie'
  ];

  const _open = window.open;
  window.open = function (url) {
    if (url && typeof url === 'string') {
      const lower = url.toLowerCase();
      if (COOKIE_POPUP_PATTERNS.some(function (p) { return lower.includes(p); })) {
        return null;
      }
    }
    return _open.apply(this, arguments);
  };
})();
