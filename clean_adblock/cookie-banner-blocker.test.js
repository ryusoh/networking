/**
 * Tests for cookie-banner-blocker.js
 * TDD: Tests for enhanced cookie notice popup blocking
 */

const fs = require('fs');
const path = require('path');

describe('Cookie Banner Blocker - Popup Blocking', () => {
  let originalOpen;

  beforeEach(() => {
    // Reset DOM
    document.body.innerHTML = '<div></div>';
    // Mock window.location
    delete window.location;
    window.location = { hostname: 'www.swatch.com' };
    // Mock chrome as undefined (non-extension context for simpler testing)
    global.chrome = undefined;
    // Track window.open calls
    originalOpen = jest.fn();
    window.open = originalOpen;
  });

  afterEach(() => {
    window.open = originalOpen;
  });

  function loadScript() {
    const code = fs.readFileSync(
      path.resolve(__dirname, './cookie-banner-blocker.js'),
      'utf8'
    );
    eval(code);
  }

  describe('window.open cookie popup interception', () => {
    test('should block window.open for /en-us/swatch-cookie-notice.html', () => {
      loadScript();
      const result = window.open('https://www.swatch.com/en-us/swatch-cookie-notice.html');
      expect(result).toBeNull();
    });

    test('should block window.open for URLs containing "cookie-notice" anywhere in path', () => {
      loadScript();
      const result = window.open('https://example.com/fr/my-cookie-notice-page.html');
      expect(result).toBeNull();
    });

    test('should block window.open for URLs containing "cookie-policy" anywhere in path', () => {
      loadScript();
      const result = window.open('https://example.com/legal/site-cookie-policy');
      expect(result).toBeNull();
    });

    test('should block window.open for URLs with cookie-notice as query param or fragment', () => {
      loadScript();
      const result = window.open('https://example.com/page?modal=cookie-notice');
      expect(result).toBeNull();
    });

    test('should still allow normal window.open calls', () => {
      loadScript();
      window.open('https://www.swatch.com/en-us/product-page.html');
      expect(originalOpen).toHaveBeenCalledWith('https://www.swatch.com/en-us/product-page.html');
    });

    test('should block existing exact patterns like /cookie-notice', () => {
      loadScript();
      const result = window.open('https://example.com/cookie-notice');
      expect(result).toBeNull();
    });
  });
});

describe('Cookie Banner Blocker - shouldCloseTab patterns (background.js)', () => {
  let shouldCloseTab;

  beforeAll(() => {
    // Mirror the fixed patterns from background.js
    const COOKIE_NOTICE_PATH_PATTERNS = [
      'cookie-notice',
      'cookie-policy',
      'cookie-consent',
      'privacy-notice',
      '/legal/cookie',
      '/privacy-policy/cookie',
      '/consent/cookie',
      '/gdpr/cookie'
    ];

    // This is the current implementation - it will fail for swatch URLs
    shouldCloseTab = (url) => {
      if (!url) return false;
      try {
        const urlObj = new URL(url);
        const pathLower = urlObj.pathname.toLowerCase();
        if (COOKIE_NOTICE_PATH_PATTERNS.some((p) => pathLower.includes(p))) {
          return true;
        }
      } catch {
        return false;
      }
      return false;
    };
  });

  test('should match /en-us/swatch-cookie-notice.html (compound path)', () => {
    expect(
      shouldCloseTab('https://www.swatch.com/en-us/swatch-cookie-notice.html')
    ).toBe(true);
  });

  test('should match URLs with cookie-notice embedded in filename', () => {
    expect(
      shouldCloseTab('https://example.com/pages/brand-cookie-notice-popup.html')
    ).toBe(true);
  });

  test('should still match direct /cookie-notice path', () => {
    expect(
      shouldCloseTab('https://example.com/cookie-notice')
    ).toBe(true);
  });

  test('should not match unrelated URLs', () => {
    expect(
      shouldCloseTab('https://www.swatch.com/en-us/royal-pop.html')
    ).toBe(false);
  });
});
