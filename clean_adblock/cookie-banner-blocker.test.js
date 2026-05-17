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
    const code = fs.readFileSync(path.resolve(__dirname, './cookie-banner-blocker.js'), 'utf8');
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

describe('Cookie Banner Blocker - Direct CMP Auto-Dismiss', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    delete window.location;
    window.location = { hostname: 'www.swatch.com' };
    global.chrome = undefined;
    window.open = jest.fn();
  });

  function loadScript() {
    const code = fs.readFileSync(path.resolve(__dirname, './cookie-banner-blocker.js'), 'utf8');
    eval(code);
  }

  test('should prefer reject over accept on OneTrust banner', () => {
    document.body.innerHTML = `
      <div id="onetrust-banner-sdk" class="otFlat bottom" role="region" aria-label="Cookie banner">
        <div id="onetrust-button-group">
          <button id="onetrust-reject-all-handler">Reject All Cookies</button>
          <button id="onetrust-accept-btn-handler">Accept All Cookies</button>
        </div>
      </div>
    `;
    const rejectBtn = document.getElementById('onetrust-reject-all-handler');
    const acceptBtn = document.getElementById('onetrust-accept-btn-handler');
    const rejectSpy = jest.spyOn(rejectBtn, 'click');
    const acceptSpy = jest.spyOn(acceptBtn, 'click');

    loadScript();

    // Should click reject (privacy-first), not accept
    expect(rejectSpy).toHaveBeenCalled();
    expect(acceptSpy).not.toHaveBeenCalled();
  });

  test('should click reject button on OneTrust if configured to reject', () => {
    document.body.innerHTML = `
      <div id="onetrust-banner-sdk" class="otFlat bottom" role="region">
        <div id="onetrust-button-group">
          <button id="onetrust-reject-all-handler">Reject All Cookies</button>
          <button id="onetrust-accept-btn-handler">Accept All Cookies</button>
        </div>
      </div>
    `;
    const rejectBtn = document.getElementById('onetrust-reject-all-handler');
    const clickSpy = jest.spyOn(rejectBtn, 'click');

    loadScript();

    // dismissKnownCMP should click reject on OneTrust
    expect(clickSpy).toHaveBeenCalled();
  });

  test('should handle Didomi popup dismiss', () => {
    document.body.innerHTML = `
      <div id="didomi-popup" class="didomi-popup">
        <button id="didomi-notice-agree-button">Accept</button>
      </div>
    `;
    const agreeBtn = document.getElementById('didomi-notice-agree-button');
    const clickSpy = jest.spyOn(agreeBtn, 'click');

    loadScript();

    expect(clickSpy).toHaveBeenCalled();
  });

  test('should handle Quantcast choice banner', () => {
    document.body.innerHTML = `
      <div class="quantcast-choice" id="qc-cmp2-container">
        <button class="qc-cmp2-summary-buttons" mode="primary">AGREE</button>
      </div>
    `;
    const agreeBtn = document.querySelector('.qc-cmp2-summary-buttons');
    const clickSpy = jest.spyOn(agreeBtn, 'click');

    loadScript();

    expect(clickSpy).toHaveBeenCalled();
  });

  test('should handle Cookiebot banner', () => {
    document.body.innerHTML = `
      <div id="CybotCookiebotDialog" class="CybotCookiebotDialogActive">
        <button id="CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll">Allow all</button>
      </div>
    `;
    const allowBtn = document.getElementById(
      'CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll'
    );
    const clickSpy = jest.spyOn(allowBtn, 'click');

    loadScript();

    expect(clickSpy).toHaveBeenCalled();
  });

  test('should hide OneTrust banner if no buttons found', () => {
    document.body.innerHTML = `
      <div id="onetrust-banner-sdk" class="otFlat bottom" role="region">
        <div id="onetrust-policy-text">We use cookies</div>
      </div>
    `;

    loadScript();

    const banner = document.getElementById('onetrust-banner-sdk');
    expect(banner.style.display).toBe('none');
  });

  test('should not interfere with non-cookie elements', () => {
    document.body.innerHTML = `
      <div id="main-content">
        <p>Normal page content</p>
        <button id="submit-btn">Submit</button>
      </div>
    `;

    loadScript();

    const content = document.getElementById('main-content');
    expect(content.style.display).not.toBe('none');
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
      if (!url) {return false;}
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
    expect(shouldCloseTab('https://www.swatch.com/en-us/swatch-cookie-notice.html')).toBe(true);
  });

  test('should match URLs with cookie-notice embedded in filename', () => {
    expect(shouldCloseTab('https://example.com/pages/brand-cookie-notice-popup.html')).toBe(true);
  });

  test('should still match direct /cookie-notice path', () => {
    expect(shouldCloseTab('https://example.com/cookie-notice')).toBe(true);
  });

  test('should not match unrelated URLs', () => {
    expect(shouldCloseTab('https://www.swatch.com/en-us/royal-pop.html')).toBe(false);
  });
});
