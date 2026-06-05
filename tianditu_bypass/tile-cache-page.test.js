describe('tile-cache-page', () => {
  let mockFetch;

  beforeAll(() => {
    global.Response = class Response {
      constructor(body, init) {
        this.body = body;
        this.status = init.status;
        this.headers = new Map(Object.entries(init.headers || {}));
      }
      get(name) {
        return this.headers.get(name);
      }
    };
  });

  beforeEach(() => {
    // Reset fetch
    mockFetch = jest.fn();
    window.fetch = mockFetch;
    // Clear listeners
    jest.resetModules();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('initializes and logs', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    require('./tile-cache-page.js');
    expect(consoleSpy).toHaveBeenCalledWith('[TileCache] Fetch interceptor active');
    consoleSpy.mockRestore();
  });

  it('intercepts fetch for tile urls and checks cache', async () => {
    require('./tile-cache-page.js');

    // not a tile URL
    mockFetch.mockResolvedValueOnce('real-fetch');
    const res1 = await window.fetch('https://example.com');
    expect(res1).toBe('real-fetch');

    // tile URL, mock postMessage to resolve immediately with hit
    const postMessageSpy = jest.spyOn(window, 'postMessage').mockImplementation((data) => {
      if (data.type === '__tilecache_request') {
        window.dispatchEvent(
          new window.MessageEvent('message', {
            data: {
              type: '__tilecache_response',
              id: data.id,
              hit: true,
              data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
              contentType: 'image/png'
            },
            source: window
          })
        );
      }
    });

    const res2 = await window.fetch('https://t0.tianditu.gov.cn/img_w/wmts?');
    expect(res2.status).toBe(200);
    expect(res2.headers.get('Content-Type')).toBe('image/png');

    postMessageSpy.mockRestore();
  });

  it('intercepts fetch for tile urls with input object', async () => {
    require('./tile-cache-page.js');

    // tile URL, mock postMessage to resolve immediately with hit
    const postMessageSpy = jest.spyOn(window, 'postMessage').mockImplementation((data) => {
      if (data.type === '__tilecache_request') {
        window.dispatchEvent(
          new window.MessageEvent('message', {
            data: {
              type: '__tilecache_response',
              id: data.id,
              hit: true,
              data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
              contentType: 'image/png'
            },
            source: window
          })
        );
      }
    });

    const res2 = await window.fetch({ url: 'https://t0.tianditu.gov.cn/img_w/wmts?' });
    expect(res2.status).toBe(200);

    postMessageSpy.mockRestore();
  });

  it('falls back to real fetch on cache miss', async () => {
    require('./tile-cache-page.js');
    mockFetch.mockResolvedValueOnce('real-fetch-fallback');

    const postMessageSpy = jest.spyOn(window, 'postMessage').mockImplementation((data) => {
      if (data.type === '__tilecache_request') {
        window.dispatchEvent(
          new window.MessageEvent('message', {
            data: {
              type: '__tilecache_response',
              id: data.id,
              hit: false
            },
            source: window
          })
        );
      }
    });

    const res3 = await window.fetch('https://tile0.tianditu.gov.cn/data.pbf');
    expect(res3).toBe('real-fetch-fallback');
    postMessageSpy.mockRestore();
  });

  it('falls back to real fetch on timeout', async () => {
    require('./tile-cache-page.js');
    mockFetch.mockResolvedValueOnce('timeout-fetch');

    const postMessageSpy = jest.spyOn(window, 'postMessage').mockImplementation(() => {
      // do not respond
    });

    const fetchPromise = window.fetch('https://t1.tianditu.cn/vts?');
    jest.advanceTimersByTime(6001);

    const res = await fetchPromise;
    expect(res).toBe('timeout-fetch');
    postMessageSpy.mockRestore();
  });

  it('ignores other messages', () => {
    require('./tile-cache-page.js');

    // other source
    window.dispatchEvent(
      new window.MessageEvent('message', {
        data: { type: '__tilecache_response' },
        source: null
      })
    );

    // other type
    window.dispatchEvent(
      new window.MessageEvent('message', {
        data: { type: 'other' },
        source: window
      })
    );

    // no data
    window.dispatchEvent(
      new window.MessageEvent('message', {
        data: null,
        source: window
      })
    );
  });

  it('handles falsy input url', async () => {
    require('./tile-cache-page.js');
    mockFetch.mockResolvedValueOnce('falsy-input-fetch');

    // passing null or empty string
    const res = await window.fetch(null);
    expect(res).toBe('falsy-input-fetch');

    mockFetch.mockResolvedValueOnce('falsy-input-fetch-empty-obj');
    const res2 = await window.fetch({});
    expect(res2).toBe('falsy-input-fetch-empty-obj');
  });
});
