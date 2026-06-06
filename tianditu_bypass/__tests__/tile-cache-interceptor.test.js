describe('tile-cache-interceptor', () => {
  beforeEach(() => {
    document.documentElement.innerHTML = '';

    global.chrome = {
      runtime: {
        getURL: jest.fn((path) => `chrome-extension://id/${path}`),
        sendMessage: jest.fn()
      }
    };

    jest.resetModules();
  });

  it('injects script and sets up listener', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    require('../tile-cache-interceptor.js');

    const script = document.querySelector('script');
    expect(script).toBeTruthy();
    expect(script.src).toBe('chrome-extension://id/tile-cache-page.js');

    // Simulate script onload
    script.onload();
    expect(document.querySelector('script')).toBeNull();

    expect(consoleSpy).toHaveBeenCalledWith('[TileCache] Content script ready');
    consoleSpy.mockRestore();
  });

  it('ignores invalid messages', () => {
    require('../tile-cache-interceptor.js');
    const postMessageSpy = jest.spyOn(window, 'postMessage').mockImplementation();

    // Wrong source
    window.dispatchEvent(
      new window.MessageEvent('message', {
        source: null,
        data: { type: '__tilecache_request' }
      })
    );
    expect(postMessageSpy).not.toHaveBeenCalled();

    // Null data
    window.dispatchEvent(
      new window.MessageEvent('message', {
        source: window,
        data: null
      })
    );
    expect(postMessageSpy).not.toHaveBeenCalled();

    // Wrong type
    window.dispatchEvent(
      new window.MessageEvent('message', {
        source: window,
        data: { type: 'wrong_type' }
      })
    );
    expect(postMessageSpy).not.toHaveBeenCalled();

    postMessageSpy.mockRestore();
  });

  it('processes valid request and handles cache hit', async () => {
    global.chrome.runtime.sendMessage.mockResolvedValueOnce({
      hit: true,
      data: 'base64data',
      contentType: 'image/png'
    });

    require('../tile-cache-interceptor.js');

    const postMessageSpy = jest.spyOn(window, 'postMessage').mockImplementation();

    window.dispatchEvent(
      new window.MessageEvent('message', {
        source: window,
        data: {
          type: '__tilecache_request',
          id: 1,
          url: 'http://example.com'
        }
      })
    );

    // Wait for async operations
    await new Promise(global.setTimeout);

    expect(global.chrome.runtime.sendMessage).toHaveBeenCalledWith({
      type: 'TILE_CACHE_FETCH',
      url: 'http://example.com'
    });

    expect(postMessageSpy).toHaveBeenCalledWith(
      {
        type: '__tilecache_response',
        id: 1,
        hit: true,
        data: 'base64data',
        contentType: 'image/png'
      },
      '*'
    );

    postMessageSpy.mockRestore();
  });

  it('processes valid request and handles cache miss', async () => {
    global.chrome.runtime.sendMessage.mockResolvedValueOnce({
      hit: false
    });

    require('../tile-cache-interceptor.js');

    const postMessageSpy = jest.spyOn(window, 'postMessage').mockImplementation();

    window.dispatchEvent(
      new window.MessageEvent('message', {
        source: window,
        data: {
          type: '__tilecache_request',
          id: 2,
          url: 'http://example.com'
        }
      })
    );

    // Wait for async operations
    await new Promise(global.setTimeout);

    expect(postMessageSpy).toHaveBeenCalledWith(
      {
        type: '__tilecache_response',
        id: 2,
        hit: false
      },
      '*'
    );

    postMessageSpy.mockRestore();
  });

  it('handles background script error/unavailability', async () => {
    global.chrome.runtime.sendMessage.mockRejectedValueOnce(
      new Error('Extension context invalidated')
    );

    require('../tile-cache-interceptor.js');

    const postMessageSpy = jest.spyOn(window, 'postMessage').mockImplementation();

    window.dispatchEvent(
      new window.MessageEvent('message', {
        source: window,
        data: {
          type: '__tilecache_request',
          id: 3,
          url: 'http://example.com'
        }
      })
    );

    // Wait for async operations
    await new Promise(global.setTimeout);

    expect(postMessageSpy).toHaveBeenCalledWith(
      {
        type: '__tilecache_response',
        id: 3,
        hit: false
      },
      '*'
    );

    postMessageSpy.mockRestore();
  });

  it('injects script when head does not exist', () => {
    // temporarily mock document.head to falsy to hit fallback
    Object.defineProperty(document, 'head', {
      value: null,
      configurable: true
    });

    require('../tile-cache-interceptor.js');

    const script = document.documentElement.querySelector('script');
    expect(script).toBeTruthy();

    // restore head for other tests if needed
    delete document.head;
  });
});
