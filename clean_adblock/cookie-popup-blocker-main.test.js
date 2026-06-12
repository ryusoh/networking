describe('cookie-popup-blocker-main.js', () => {
  let originalOpen;
  let mockOpen;
  beforeEach(() => {
    originalOpen = window.open;
    mockOpen = jest.fn();
    window.open = mockOpen;
    delete window.location;
    window.location = new URL('https://example.com');
  });

  afterEach(() => {
    window.open = originalOpen;
    jest.resetModules();
  });

  it('blocks cookie popup URLs', () => {
    const code = require('fs').readFileSync(require('path').join(__dirname, 'cookie-popup-blocker-main.js'), 'utf8'); eval(code);

    expect(window.open('https://example.com/cookie-notice')).toBeNull();
    expect(window.open('https://example.com/privacy-policy/cookie')).toBeNull();
    expect(mockOpen).not.toHaveBeenCalled();
  });

  it('allows non-cookie URLs', () => {
    const code = require('fs').readFileSync(require('path').join(__dirname, 'cookie-popup-blocker-main.js'), 'utf8'); eval(code);

    window.open('https://example.com/about');
    expect(mockOpen).toHaveBeenCalledWith('https://example.com/about');
  });

  it('skips skip hosts', () => {
    window.location = new URL('https://twitter.com');
    const code = require('fs').readFileSync(require('path').join(__dirname, 'cookie-popup-blocker-main.js'), 'utf8'); eval(code);

    window.open('https://example.com/cookie-notice');
    expect(mockOpen).toHaveBeenCalledWith('https://example.com/cookie-notice');
  });
});
