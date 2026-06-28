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

    const blocker = window['CookieBannerBlocker'];

    const banner = document.createElement('div');
    banner.id = 'test-banner';
    jest.spyOn(banner, 'querySelectorAll').mockImplementation(() => {
      throw new Error('invalid selector');
    });

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

    const style = document.createElement('style');
    style.textContent = '.accept-btn { opacity: 0; }';
    document.head.appendChild(style);

    jest.spyOn(banner, 'querySelectorAll').mockImplementation(() => {
      return [acceptBtn];
    });

    Object.defineProperty(acceptBtn, 'offsetWidth', { value: 100, configurable: true });
    Object.defineProperty(acceptBtn, 'offsetHeight', { value: 30, configurable: true });

    const clickSpy = jest.spyOn(acceptBtn, 'click');

    blocker.dismissBanner(banner);

    expect(clickSpy).not.toHaveBeenCalled();
    expect(banner.style.display).toBe('none');

    blocker.processedBanners.clear();

    style.textContent = '.accept-btn { opacity: 1; display: block; visibility: visible; }';
    banner.style.display = 'block';

    blocker.dismissBanner(banner);

    expect(clickSpy).toHaveBeenCalled();
  });
});
