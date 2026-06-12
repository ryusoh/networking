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
    const code = require('fs').readFileSync(require('path').join(__dirname, 'x-twitter-bird.js'), 'utf8'); eval(code);
    const style = document.getElementById('twitter-bird-style');
    expect(style).toBeTruthy();
    expect(style.textContent).toContain('display: none !important');
  });

  it('updates favicon and title', () => {
    document.title = 'X';
    const code = require('fs').readFileSync(require('path').join(__dirname, 'x-twitter-bird.js'), 'utf8'); eval(code);

    expect(document.title).toBe('Twitter');
    const link = document.querySelector('link[rel="shortcut icon"]');
    expect(link).toBeTruthy();
    expect(link.href).toBe('chrome-extension://123/assets/twitter.png');
  });

  it('updates title with postfix', () => {
    document.title = 'Some page / X';
    const code = require('fs').readFileSync(require('path').join(__dirname, 'x-twitter-bird.js'), 'utf8'); eval(code);

    expect(document.title).toBe('Some page / Twitter');
  });

  it('replaces existing favicon', () => {
    const link = document.createElement('link');
    link.rel = 'icon';
    link.href = 'https://example.com/favicon.ico';
    document.head.appendChild(link);

    const code = require('fs').readFileSync(require('path').join(__dirname, 'x-twitter-bird.js'), 'utf8'); eval(code);

    expect(link.href).toBe('chrome-extension://123/assets/twitter.png');
  });
});
