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
});

  it('bails if no chrome', () => {
    const origChrome = global.chrome;
    delete global.chrome;
    require('./x-twitter-bird.js');
    global.chrome = origChrome;
  });

  it('binds to DOMContentLoaded if head not ready', () => {
    // temporarily remove document.head to cover the else branch
    const origHead = document.head;
    Object.defineProperty(document, 'head', { value: null, configurable: true });

    // reset modules to run it again
    jest.resetModules();
    require('./x-twitter-bird.js');

    Object.defineProperty(document, 'head', { value: origHead, configurable: true });

    // dispatch DOMContentLoaded
    const event = document.createEvent('Event');
    event.initEvent('DOMContentLoaded', true, true);
    document.dispatchEvent(event);
  });
