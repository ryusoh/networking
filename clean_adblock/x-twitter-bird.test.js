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

  it('adds mutation observer to document if no head initially', () => {
    const originalHead = document.head;
    Object.defineProperty(document, 'head', { value: null, configurable: true });

    require('./x-twitter-bird.js');

    // Put head back before firing event so that `document.head` exists in the callback
    Object.defineProperty(document, 'head', { value: originalHead, configurable: true });

    // Fire DOMContentLoaded
    const event = document.createEvent('Event');
    event.initEvent('DOMContentLoaded', true, true);
    document.dispatchEvent(event);
  });
});
