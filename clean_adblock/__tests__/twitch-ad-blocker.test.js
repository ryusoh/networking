describe('twitch-ad-blocker.js coverage', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    jest.resetModules();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('loads without crashing', () => {
    delete window.location;
    window.location = new URL('https://www.twitch.tv');
    require('../twitch-ad-blocker.js');
  });

  it('runs init using standard path', () => {
    delete window.location;
    window.location = new URL('https://www.twitch.tv');
    document.body.innerHTML = '<div class="ad-showing"></div>';
    require('../twitch-ad-blocker.js');
  });

  it('covers click tests', () => {
    delete window.location;
    window.location = new URL('https://www.twitch.tv');
    document.body.innerHTML = `
      <div class="video-ads">
          <button data-test-selector="ad-skip-button">Skip</button>
      </div>
      <video></video>
    `;
    const btn = document.querySelector('button');
    Object.defineProperty(btn, 'offsetParent', { value: document.body, configurable: true });
    btn.click = jest.fn();

    // override video behavior

    require('../twitch-ad-blocker.js');
  });

  it('covers isAdElement', () => {
    delete window.location;
    window.location = new URL('https://www.twitch.tv');

    document.body.innerHTML = `
      <div id="ad1" class="video-player__overlay" data-a-target="video-ad-overlay"></div>
      <div id="normal" class="not-ad"></div>
    `;

    let cb;
    const origMO = global.MutationObserver;
    global.MutationObserver = class {
      constructor(c) {
        cb = c;
      }
      observe() {}
      disconnect() {}
    };

    require('../twitch-ad-blocker.js');

    if (cb) {
      cb([
        {
          type: 'childList',
          addedNodes: Array.from(document.body.childNodes)
        }
      ]);
    }

    global.MutationObserver = origMO;
  });

  it('covers fetch interception', async () => {
    delete window.location;
    window.location = new URL('https://www.twitch.tv');
    const origFetch = global.fetch;
    global.fetch = jest.fn().mockResolvedValue('ok');

    // Create Response mock if it doesn't exist
    if (!global.Response) {
      global.Response = class {
        constructor(body, init) {
          this.body = body;
          this.status = init.status;
          this.statusText = init.statusText;
        }
      };
    }

    require('../twitch-ad-blocker.js');

    const res1 = await global.fetch('https://vast.twitch.tv/ad?something=1');
    expect(res1.status).toBe(200);

    const res2 = await global.fetch('https://google.com');
    expect(res2).toBe('ok');

    // URL via object
    const res3 = await global.fetch({ url: 'https://vast.twitch.tv/ad' });
    expect(res3.status).toBe(200);

    global.fetch = origFetch;
  });

  it('covers fetch interception missing window.fetch', async () => {
    delete window.location;
    window.location = new URL('https://www.twitch.tv');
    const origFetch = global.fetch;
    delete global.fetch;

    require('../twitch-ad-blocker.js');

    global.fetch = origFetch;
  });

  it('covers XHR interception', () => {
    delete window.location;
    window.location = new URL('https://www.twitch.tv');

    const origXHR = global.XMLHttpRequest;
    class MockXHR {
      open(method, url) {
        this.url = url;
      }
      send() {}
      abort() {
        this.aborted = true;
      }
    }

    MockXHR.prototype.open = function (method, url) {
      this.url = url;
    };
    MockXHR.prototype.send = function () {};
    global.XMLHttpRequest = MockXHR;

    require('../twitch-ad-blocker.js');

    const xhrAd = new global.XMLHttpRequest();
    xhrAd.open('GET', 'https://vast.twitch.tv/ad');
    xhrAd.send();
    expect(xhrAd.aborted).toBe(true);

    const xhrNormal = new global.XMLHttpRequest();
    xhrNormal.open('GET', 'https://google.com');
    xhrNormal.send();
    expect(xhrNormal.aborted).not.toBe(true);

    global.XMLHttpRequest = origXHR;
  });

  it('covers ad hiding and skip ad / mute ad', () => {
    delete window.location;
    window.location = new URL('https://www.twitch.tv');

    document.body.innerHTML = `
      <div data-a-target="video-ad-overlay" class="ad-playing"></div>
      <video></video>
      <button data-a-target="video-ad-skip-button"></button>
      <div data-a-target="video-player"></div>
    `;

    const adEl = document.querySelector('[data-a-target="video-ad-overlay"]');
    const skipBtn = document.querySelector('button');

    const player = document.querySelector('[data-a-target="video-player"]');

    Object.defineProperty(adEl, 'offsetParent', { value: document.body, configurable: true });
    Object.defineProperty(skipBtn, 'offsetParent', { value: document.body, configurable: true });

    skipBtn.click = jest.fn();

    let adObserverCb;
    const origMO = global.MutationObserver;
    global.MutationObserver = class {
      constructor(cb) {
        if (!adObserverCb) {
          // first one is the body observer, ignore or save
        } else {
          // second is ad observer
        }
        this.cb = cb;
      }
      observe(target) {
        if (target === player) {
          adObserverCb = this.cb;
        }
      }
      disconnect() {}
    };

    require('../twitch-ad-blocker.js');

    // trigger mutation
    if (adObserverCb) {
      adObserverCb([
        {
          type: 'attributes',
          target: adEl
        }
      ]);
    }

    expect(skipBtn.click).toHaveBeenCalled();

    // Call hideAd again with same element to cover processedElements.has
    if (window.TwitchAdBlocker) {
      window.TwitchAdBlocker.blockTwitchAds();
    }

    global.MutationObserver = origMO;
  });

  it('covers XHR interception missing XMLHttpRequest', () => {
    delete window.location;
    window.location = new URL('https://www.twitch.tv');

    const origXHR = global.XMLHttpRequest;
    delete global.XMLHttpRequest;

    require('../twitch-ad-blocker.js');

    global.XMLHttpRequest = origXHR;
  });

  it('covers readyState loading branch', () => {
    delete window.location;
    window.location = new URL('https://www.twitch.tv');
    Object.defineProperty(document, 'readyState', { value: 'loading', configurable: true });
    require('../twitch-ad-blocker.js');
    const event = document.createEvent('Event');
    event.initEvent('DOMContentLoaded', true, true);
    document.dispatchEvent(event);
  });
});
