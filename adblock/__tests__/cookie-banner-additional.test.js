describe('Cookie Banner Blocker - Additional Branch Coverage', () => {
  const path = require('path');
  const { instrumentFile } = require('./helpers/instrument');
  const contentScriptPath = path.resolve(__dirname, '../cookie-banner-blocker.js');

  function loadScript() {
    const code = instrumentFile(contentScriptPath);
    eval(code);
  }

  beforeEach(() => {
    document.body.innerHTML = '';
    delete window.location;
    window.location = { hostname: 'example.com' };
    jest.resetModules();
    jest.clearAllMocks();
    global.chrome = {
      storage: {
        sync: { get: jest.fn((keys, cb) => cb({ enabled: true })) }
      },
      runtime: { id: 'test', lastError: null }
    };
  });

  test('dismissConsentDialog accept button hit', () => {
    document.body.innerHTML = `
      <div role="dialog" aria-modal="true" class="privacy-popup">
        <p>cookie consent privacy policy</p>
        <button type="button">accept all</button>
      </div>
    `;

    const button = document.querySelector('button');
    const spy = jest.spyOn(button, 'click');
    Object.defineProperty(button, 'offsetHeight', { value: 15 });
    Object.defineProperty(button, 'offsetWidth', { value: 100 });

    // We need the dialog to be visible as well for isVisible check
    const dialog = document.querySelector('div');
    Object.defineProperty(dialog, 'offsetHeight', { value: 150 });
    Object.defineProperty(dialog, 'offsetWidth', { value: 1000 });

    loadScript();

    expect(spy).toHaveBeenCalled();
  });

  test('dismissBanner reject button hit', () => {
    document.body.innerHTML = `
      <div id="cookie-banner" class="cookie-notice" style="position: fixed; bottom: 0; width: 100%;">
        <p>cookie consent required for privacy tracking analytics</p>
        <button class="reject-btn">reject all</button>
      </div>
    `;

    const banner = document.getElementById('cookie-banner');
    Object.defineProperty(banner, 'offsetHeight', { value: 150 });
    Object.defineProperty(banner, 'offsetWidth', { value: 1000 });

    const button = document.querySelector('button');
    const spy = jest.spyOn(button, 'click');
    Object.defineProperty(button, 'offsetHeight', { value: 15 });
    Object.defineProperty(button, 'offsetWidth', { value: 100 });

    loadScript();

    expect(spy).toHaveBeenCalled();
  });

  test('dismissKnownCMP accept button hit', () => {
    document.body.innerHTML = `
      <div id="onetrust-banner-sdk" style="height: 100px; width: 100px; display: block; visibility: visible; opacity: 1;">
        <button id="onetrust-accept-btn-handler">accept</button>
      </div>
    `;
    const banner = document.getElementById('onetrust-banner-sdk');
    const button = document.getElementById('onetrust-accept-btn-handler');

    Object.defineProperty(banner, 'offsetHeight', { value: 150 });
    Object.defineProperty(banner, 'offsetWidth', { value: 1000 });
    Object.defineProperty(button, 'offsetHeight', { value: 15 });
    Object.defineProperty(button, 'offsetWidth', { value: 100 });

    // override getComputedStyle for jsdom
    const origGetComputedStyle = window.getComputedStyle;
    window.getComputedStyle = (elem) => {
      const style = origGetComputedStyle(elem);
      if (!style.display) {
        style.display = 'block';
      }
      if (!style.visibility) {
        style.visibility = 'visible';
      }
      if (!style.opacity) {
        style.opacity = '1';
      }
      return style;
    };

    const spy = jest.spyOn(button, 'click');

    loadScript();

    expect(spy).toHaveBeenCalled();
    window.getComputedStyle = origGetComputedStyle;
  });
});
