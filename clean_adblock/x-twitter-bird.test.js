describe('x-twitter-bird.js', () => {
  let headObserverSpy;

  beforeEach(() => {
    document.head.innerHTML = '';
    document.body.innerHTML = '';
    document.documentElement.innerHTML = '<head></head><body></body>';
    global.chrome = {
      runtime: {
        getURL: jest.fn((path) => `chrome-extension://123/${path}`)
      }
    };
    if (headObserverSpy) headObserverSpy.mockRestore();
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

  it('bails out of replaceFavicon if chrome is undefined', () => {
    delete global.chrome;
    document.head.innerHTML = '';
    require('./x-twitter-bird.js');
    expect(document.querySelector('link[rel="shortcut icon"]')).toBeNull();
  });

  it('bails out of replaceFavicon if chrome.runtime is undefined', () => {
    global.chrome = {};
    document.head.innerHTML = '';
    require('./x-twitter-bird.js');
    expect(document.querySelector('link[rel="shortcut icon"]')).toBeNull();
  });

  it('handles missing document.head initially by listening to DOMContentLoaded', () => {
    const originalHead = document.head;
    Object.defineProperty(document, 'head', { value: null, configurable: true });
    require('./x-twitter-bird.js');
    Object.defineProperty(document, 'head', { value: originalHead, configurable: true });

    const event = document.createEvent('Event');
    event.initEvent('DOMContentLoaded', true, true);
    document.dispatchEvent(event);

    const style = document.documentElement.querySelector('style#twitter-bird-style');
    expect(style).toBeTruthy();
  });

  it('adds favicon to documentElement if document.head is null and target falls back to documentElement', () => {
    const originalHead = document.head;
    Object.defineProperty(document, 'head', { value: null, configurable: true });

    require('./x-twitter-bird.js');

    const link = document.documentElement.querySelector('link[rel="shortcut icon"]');
    expect(link).toBeTruthy();

    Object.defineProperty(document, 'head', { value: originalHead, configurable: true });
  });

});
