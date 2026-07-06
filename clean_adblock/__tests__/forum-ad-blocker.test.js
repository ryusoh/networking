describe('forum-ad-blocker.js', () => {
  let originalWindowLocation;

  beforeEach(() => {
    document.documentElement.innerHTML = '<html><head></head><body></body></html>';

    originalWindowLocation = window.location;
    delete window.location;
    window.location = {
      hostname: 'example.com',
      pathname: '/test',
      href: 'https://example.com/test',
      search: '',
      protocol: 'https:',
      assign: jest.fn(),
      replace: jest.fn(),
      reload: jest.fn()
    };
    jest.resetModules();
    jest.clearAllMocks();
  });

  afterEach(() => {
    window.location = originalWindowLocation;
  });

  it('loads without crashing', () => {
    const { instrumentFile } = require('./helpers/instrument');
    const code = instrumentFile(require('path').join(__dirname, '..', 'forum-ad-blocker.js'));
    eval(code);
  });

  it('excludes specific domains', () => {
    window.location.hostname = 'reddit.com';
    const { instrumentFile } = require('./helpers/instrument');
    const code = instrumentFile(require('path').join(__dirname, '..', 'forum-ad-blocker.js'));
    eval(code);
    expect(document.getElementById('clean-adblock-forum')).toBeNull(); // CSS not injected if excluded
  });

  it('injects CSS', () => {
    const { instrumentFile } = require('./helpers/instrument');
    const code = instrumentFile(require('path').join(__dirname, '..', 'forum-ad-blocker.js'));
    eval(code);
    expect(document.getElementById('clean-adblock-forum')).not.toBeNull();
  });

  it('removes target elements', () => {
    document.body.innerHTML = `
      <div id="1p3a-ad-123">Ad</div>
      <div class="fc-consent-root">Consent</div>
      <iframe src="https://adrecover.com/test"></iframe>
      <div id="adpushup-123">Pushup</div>
    `;

    const { instrumentFile } = require('./helpers/instrument');
    const code = instrumentFile(require('path').join(__dirname, '..', 'forum-ad-blocker.js'));
    eval(code);

    const event = document.createEvent('Event');
    event.initEvent('DOMContentLoaded', true, true);
    document.dispatchEvent(event);

    expect(document.getElementById('1p3a-ad-123').style.display).toBe('none');
    expect(document.querySelector('.fc-consent-root').style.display).toBe('none');
    expect(document.querySelector('iframe').style.display).toBe('none');
    expect(document.getElementById('adpushup-123').style.display).toBe('none');
  });

  it('removes script tags', () => {
    const script = document.createElement('script');
    script.src = 'https://adrecover.com/script.js';
    document.body.appendChild(script);

    const { instrumentFile } = require('./helpers/instrument');
    const code = instrumentFile(require('path').join(__dirname, '..', 'forum-ad-blocker.js'));
    eval(code);

    const event = document.createEvent('Event');
    event.initEvent('DOMContentLoaded', true, true);
    document.dispatchEvent(event);

    expect(document.querySelector('script[src*="adrecover.com"]')).toBeNull();
  });

  it('neutralizes ad config and removes Taboola and DoubleClick elements', () => {
    // Add admaru, taboola, doubleclick
    document.body.innerHTML = `
       <a href="https://taboola.com/ad">Taboola Ad</a>
       <div>Admaru Text</div>
       <div class="bsa-zone">
         <a href="https://adclick.g.doubleclick.net/test">DoubleClick Ad</a>
       </div>
       <div id="bsa-zone-123">
         <img src="https://2mdn.net/test.jpg" />
       </div>
    `;

    const { instrumentFile } = require('./helpers/instrument');
    const code = instrumentFile(require('path').join(__dirname, '..', 'forum-ad-blocker.js'));
    eval(code);

    const event = document.createEvent('Event');
    event.initEvent('DOMContentLoaded', true, true);
    document.dispatchEvent(event);

    // Assert neutralizeAdConfig modified window variables
    expect(window.adTagConfig.enabled).toBe(false);
    expect(window.adpushup.que).toEqual([]);
    expect(window.googlefc.getConsentStatus()).toBe(1);

    // Taboola container hidden
    const taboolaLink = document.querySelector('a[href*="taboola"]');
    expect(taboolaLink.parentElement.style.display).toBe('none');

    // Admaru hidden
    const admaruDiv = Array.from(document.querySelectorAll('div')).find(
      (el) => el.textContent === 'Admaru Text'
    );
    expect(admaruDiv.style.display).toBe('none');

    // DoubleClick hidden

    const bsaZone1 = document.querySelector('.bsa-zone');
    expect(bsaZone1.style.display).toBe('none');

    const bsaZone2 = document.getElementById('bsa-zone-123');
    expect(bsaZone2.style.display).toBe('none');
  });
});

describe('Auto Generated Coverage', () => {
  const contentScriptPath = require('path').resolve(__dirname, '../forum-ad-blocker.js');
  const { instrumentFile } = require('./helpers/instrument');

  function loadContentScript() {
    const code = instrumentFile(contentScriptPath);
    eval(code);
  }

  let originalWindowLocation;

  beforeEach(() => {
    originalWindowLocation = window.location;
    delete window.location;
    window.location = new URL('https://example.com/test');
    document.documentElement.innerHTML = '<head></head><body></body>';
    jest.resetModules();
    jest.clearAllMocks();
  });

  afterEach(() => {
    window.location = originalWindowLocation;
  });

  test('mutation observer handles dynamically added elements', () => {
    jest.useFakeTimers();

    loadContentScript();

    const event = document.createEvent('Event');
    event.initEvent('DOMContentLoaded', true, true);
    document.dispatchEvent(event);

    const newAd = document.createElement('div');
    newAd.id = '1p3a-ad-dynamic';
    document.body.appendChild(newAd);

    jest.advanceTimersByTime(1000);

    expect(document.getElementById('1p3a-ad-dynamic').style.display).toBe('none');

    jest.useRealTimers();
  });

  test('proxies document.createElement for scripts and intercepts ad attributes', () => {
    loadContentScript();

    // Valid script
    const validScript = document.createElement('script');
    validScript.setAttribute('src', 'https://example.com/safe.js');
    expect(validScript.src).toBe('https://example.com/safe.js');

    // Invalid script via setAttribute
    const invalidScript = document.createElement('script');
    invalidScript.setAttribute('src', 'https://adrecover.com/bad.js');
    expect(invalidScript.getAttribute('src')).toBeNull();

    // Invalid script via src setter
    const invalidScript2 = document.createElement('script');
    invalidScript2.src = 'https://adrecover.com/bad2.js';
    expect(invalidScript2.src).toBe('');

    // other element
    const div = document.createElement('div');
    div.setAttribute('src', 'https://adrecover.com/bad.js');
    expect(div.getAttribute('src')).toBe('https://adrecover.com/bad.js');
  });

  test('handles script creation without src parameter gracefully', () => {
    loadContentScript();

    const script = document.createElement('script');
    script.setAttribute('src', '');
    expect(script.getAttribute('src')).toBe('');
  });
});
