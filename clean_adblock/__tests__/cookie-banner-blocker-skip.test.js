const path = require('path');
const { instrumentFile } = require('./helpers/instrument');

describe('Cookie Banner Blocker - Hardcoded Skips & Fallbacks', () => {
  beforeEach(() => {
    document.documentElement.innerHTML = '<html><head></head><body></body></html>';
    jest.resetModules();
    jest.clearAllMocks();
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  function loadScript() {
    const code = instrumentFile(path.resolve(__dirname, '../cookie-banner-blocker.js'));
    eval(code);
  }

  test('should return immediately for hardcoded skip domains', () => {
    delete window.location;
    window.location = { hostname: 'google.com' };

    const observeSpy = jest.spyOn(MutationObserver.prototype, 'observe');
    loadScript();
    expect(observeSpy).not.toHaveBeenCalled();
  });

  test('does not error on invalid selector in findButton', () => {
    delete window.location;
    window.location = { hostname: 'example.com' };

    loadScript();

    // Test the exported findButton indirectly by mocking findCookieBanner
    const blocker = window['CookieBannerBlocker'];

    // We can't access `findButton` directly since it's not exported.
    // Let's create a banner that triggers `dismissBanner`.
    const banner = document.createElement('div');
    banner.id = 'test-banner';
    // To reach catch block in findButton, querySelectorAll needs to throw
    jest.spyOn(banner, 'querySelectorAll').mockImplementation(() => {
      throw new Error('invalid selector');
    });

    // dismissBanner catches errors from findButton gracefully?
    // findButton catches the error itself and returns null.
    // If it returns null, dismissBanner sets display to none.
    blocker.dismissBanner(banner);

    expect(banner.style.display).toBe('none');
  });

  test('isVisible returns false for elements with 0 opacity or hidden visibility', () => {
    delete window.location;
    window.location = { hostname: 'example.com' };

    loadScript();
    const blocker = window['CookieBannerBlocker'];

    const banner = document.createElement('div');
    banner.id = 'test-banner-2';

    const acceptBtn = document.createElement('button');
    acceptBtn.className = 'accept-btn';
    acceptBtn.textContent = 'Accept All';
    banner.appendChild(acceptBtn);
    document.body.appendChild(banner);

    // We will test `isVisible` which is called inside `findButton` (which is called by `dismissBanner`).
    // If a button is not visible, it should not click it.

    // Make button not visible via opacity
    const style = document.createElement('style');
    style.textContent = '.accept-btn { opacity: 0; }';
    document.head.appendChild(style);

    // We need to provide a selector that `findButton` uses.
    // The `ACCEPT_BUTTONS` list probably includes something matching text or classes.
    // Let's rely on the text matching heuristic in `dismissConsentDialog` or `dismissBanner`...
    // Actually, dismissBanner searches for ACCEPT_BUTTONS on the banner element.
    // Let's mock querySelectorAll to return our button for a known selector.
    jest.spyOn(banner, 'querySelectorAll').mockImplementation(() => {
      return [acceptBtn]; // return our button for ANY selector, so findButton finds it
    });

    // Need to set offsetWidth/offsetHeight > 0 for isVisible to potentially be true
    Object.defineProperty(acceptBtn, 'offsetWidth', { value: 100, configurable: true });
    Object.defineProperty(acceptBtn, 'offsetHeight', { value: 30, configurable: true });

    const clickSpy = jest.spyOn(acceptBtn, 'click');

    blocker.dismissBanner(banner);

    // isVisible should return false because opacity is 0, so it shouldn't click
    expect(clickSpy).not.toHaveBeenCalled();
    // And it hides the banner instead
    expect(banner.style.display).toBe('none');

    blocker.processedBanners.clear();

    // Now make it visible
    style.textContent = '.accept-btn { opacity: 1; display: block; visibility: visible; }';
    banner.style.display = 'block';

    blocker.dismissBanner(banner);

    // Now it should be clicked
    expect(clickSpy).toHaveBeenCalled();
  });
});
