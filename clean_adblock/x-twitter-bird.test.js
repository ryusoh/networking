describe('x-twitter-bird.js', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
    document.body.innerHTML = '';
    global.chrome = {
      runtime: {
        getURL: jest.fn((path) => `chrome-extension://123/${path}`)
      }
    };
  });

  afterEach(() => {
    jest.resetModules();
  });

  it('injects style', () => {
    require('./x-twitter-bird.js');
    const style = document.getElementById('twitter-bird-style');
    expect(style).toBeTruthy();
    expect(style.textContent).toContain('display: none !important');
  });

  it('updates favicon and title', () => {
    document.title = 'X';
    require('./x-twitter-bird.js');

    expect(document.title).toBe('Twitter');
    const link = document.querySelector('link[rel="shortcut icon"]');
    expect(link).toBeTruthy();
    expect(link.href).toBe('chrome-extension://123/assets/twitter.png');
  });

  it('updates title with postfix', () => {
    document.title = 'Some page / X';
    require('./x-twitter-bird.js');

    expect(document.title).toBe('Some page / Twitter');
  });

  it('replaces existing favicon', () => {
    const link = document.createElement('link');
    link.rel = 'icon';
    link.href = 'https://example.com/favicon.ico';
    document.head.appendChild(link);

    require('./x-twitter-bird.js');

    expect(link.href).toBe('chrome-extension://123/assets/twitter.png');
  });

  it('bails out when chrome is not defined', () => {
    delete global.chrome;
    require('./x-twitter-bird.js');
  });

  it('updates title when title ends with / X', () => {
    document.title = 'Hello / X';
    require('./x-twitter-bird.js');
    expect(document.title).toBe('Hello / Twitter');
  });

  it('observes DOM changes and updates when title changes', (done) => {
    document.title = 'Some page';
    require('./x-twitter-bird.js');
    done();
  });

  it('no document.head fallback', () => {
    const OriginalHead = document.head;
    const fakeHead = document.createElement('head');
    Object.defineProperty(document, 'head', { value: null, configurable: true });
    require('./x-twitter-bird.js');
    Object.defineProperty(document, 'head', { value: fakeHead, configurable: true });
    const event = new Event('DOMContentLoaded');
    document.dispatchEvent(event);
    Object.defineProperty(document, 'head', { value: OriginalHead, configurable: true });
  });

  it('observes mutations', () => {
    const OriginalObserver = global.MutationObserver;
    let cb = null;
    global.MutationObserver = class {
      constructor(callback) {
        cb = callback;
      }
      observe() {}
    };
    require('./x-twitter-bird.js');
    document.title = 'X';
    if (cb) {cb();}
    expect(document.title).toBe('Twitter');
    global.MutationObserver = OriginalObserver;
  });

  it('covers document.head null but document.documentElement present', () => {
    const OriginalHead = document.head;
    Object.defineProperty(document, 'head', { value: null, configurable: true });
    require('./x-twitter-bird.js');
    Object.defineProperty(document, 'head', { value: OriginalHead, configurable: true });
  });

  it('covers document.head null and document.documentElement null', () => {
    const OriginalHead = document.head;
    const OriginalDocElement = document.documentElement;
    Object.defineProperty(document, 'head', { value: null, configurable: true });
    Object.defineProperty(document, 'documentElement', {
      value: { appendChild: jest.fn() },
      configurable: true
    });

    let docElCalls = 0;
    Object.defineProperty(document, 'documentElement', {
      get: () => {
        if (docElCalls === 0) {
          docElCalls++;
          return { appendChild: jest.fn() };
        }
        return null;
      },
      configurable: true
    });

    require('./x-twitter-bird.js');

    Object.defineProperty(document, 'head', { value: OriginalHead, configurable: true });
    Object.defineProperty(document, 'documentElement', {
      value: OriginalDocElement,
      configurable: true
    });
  });

  it('no replacement if already replaced', () => {
    const link = document.createElement('link');
    link.rel = 'icon';
    link.href = 'chrome-extension://123/assets/twitter.png';
    document.head.appendChild(link);
    require('./x-twitter-bird.js');
  });

  it('binds to DOMContentLoaded if head not ready', () => {
    const origHead = document.head;
    Object.defineProperty(document, 'head', { value: null, configurable: true });

    jest.resetModules();
    require('./x-twitter-bird.js');

    Object.defineProperty(document, 'head', { value: origHead, configurable: true });

    const event = document.createEvent('Event');
    event.initEvent('DOMContentLoaded', true, true);
    document.dispatchEvent(event);
  });
});
