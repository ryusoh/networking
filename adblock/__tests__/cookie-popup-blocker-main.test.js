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
    require('../cookie-popup-blocker-main.js');

    expect(window.open('https://example.com/cookie-notice')).toBeNull();
    expect(window.open('https://example.com/privacy-policy/cookie')).toBeNull();
    expect(mockOpen).not.toHaveBeenCalled();
  });

  it('allows non-cookie URLs', () => {
    require('../cookie-popup-blocker-main.js');

    window.open('https://example.com/about');
    expect(mockOpen).toHaveBeenCalledWith('https://example.com/about');
  });

  it('skips skip hosts', () => {
    window.location = new URL('https://twitter.com');
    require('../cookie-popup-blocker-main.js');

    window.open('https://example.com/cookie-notice');
    expect(mockOpen).toHaveBeenCalledWith('https://example.com/cookie-notice');
  });

  it('window.open handles non string url', () => {
    const originalOpen = window.open;
    window.open = jest.fn().mockReturnValue('original');
    require('../cookie-popup-blocker-main.js');
    expect(window.open(null)).toBe('original');
    expect(window.open({})).toBe('original');
    window.open = originalOpen;
  });

  it('allows object urls without throwing', () => {
    require('../cookie-popup-blocker-main.js');
    window.open({ url: 'https://example.com/cookie-notice' });
    expect(mockOpen).toHaveBeenCalledWith({ url: 'https://example.com/cookie-notice' });
  });

  it('allows null urls', () => {
    require('../cookie-popup-blocker-main.js');
    window.open(null);
    expect(mockOpen).toHaveBeenCalledWith(null);
  });
});
