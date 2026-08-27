'use strict';

const path = require('path');
const { instrumentFile } = require('./helpers/instrument');

describe('gov_bypass background.js', () => {
  let listeners = {};

  beforeEach(() => {
    jest.useFakeTimers();
    listeners = {};

    global.chrome = {
      proxy: {
        settings: {
          set: jest.fn((config, cb) => {
            if (cb) {
              cb();
            }
          })
        },
        onProxyError: {
          addListener: (fn) => {
            listeners.onProxyError = fn;
          }
        }
      },
      action: {
        setBadgeText: jest.fn(),
        setBadgeBackgroundColor: jest.fn()
      },
      offscreen: {
        hasDocument: jest.fn().mockResolvedValue(true),
        createDocument: jest.fn().mockResolvedValue()
      },
      runtime: {
        sendMessage: jest.fn(),
        onMessage: {
          addListener: (fn) => {
            listeners.onMessage = fn;
          }
        },
        onInstalled: {
          addListener: (fn) => {
            listeners.onInstalled = fn;
          }
        },
        onStartup: {
          addListener: (fn) => {
            listeners.onStartup = fn;
          }
        }
      },
      alarms: {
        create: jest.fn(),
        onAlarm: {
          addListener: (fn) => {
            listeners.onAlarm = fn;
          }
        }
      },
      cookies: {
        getAll: jest.fn((query, cb) => {
          cb([{ domain: 'tianditu.gov.cn', path: '/', name: 'testcookie', secure: true }]);
        }),
        remove: jest.fn()
      }
    };

    global.fetch = jest.fn();

    const srcPath = path.resolve(__dirname, '../background.js');
    const instrumented = instrumentFile(srcPath);
    eval(instrumented);
  });

  afterEach(() => {
    delete global.chrome;
    delete global.fetch;
    jest.useRealTimers();
  });

  test('onInstalled clears cookies and fetches proxy list', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      text: async () => '192.168.1.1:1080'
    });

    await listeners.onInstalled();

    // Process promises
    for (let i = 0; i < 10; i++) {
      await Promise.resolve();
    }

    expect(global.chrome.cookies.remove).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'testcookie' })
    );

    expect(global.chrome.proxy.settings.set).toHaveBeenCalled();
    expect(global.chrome.action.setBadgeText).toHaveBeenCalledWith({ text: 'ON' });
  });

  test('onProxyError rotates proxy when fatal', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      text: async () => '192.168.1.1:1080\n192.168.1.2:1080'
    });

    await listeners.onStartup();
    for (let i = 0; i < 10; i++) {
      await Promise.resolve();
    }

    global.chrome.proxy.settings.set.mockClear();

    listeners.onProxyError({ error: 'net::ERR_PROXY_CONNECTION_FAILED', fatal: true });

    expect(global.chrome.proxy.settings.set).toHaveBeenCalled();
    const config = global.chrome.proxy.settings.set.mock.calls[0][0];
    expect(config.value.pacScript.data).toContain('SOCKS5 192.168.1.2:1080');
  });

  test('TILE_CACHE_FETCH responds with data on cache hit', async () => {
    global.FileReader = class {
      readAsDataURL() {
        this.result = 'data:image/png;base64,xxx';
        this.onload();
      }
    };

    global.AbortController = class {
      abort() {}
      get signal() {
        return {};
      }
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      blob: async () => ({ type: 'image/png' })
    });

    const sendResponse = jest.fn();
    const isAsync = listeners.onMessage(
      { type: 'TILE_CACHE_FETCH', url: 'http://test.com/tile' },
      {},
      sendResponse
    );

    expect(isAsync).toBe(true);

    jest.runAllTimers();
    for (let i = 0; i < 10; i++) {
      await Promise.resolve();
    }

    expect(sendResponse).toHaveBeenCalledWith({
      hit: true,
      data: 'data:image/png;base64,xxx',
      contentType: 'image/png'
    });

    delete global.FileReader;
    delete global.AbortController;
  });

  test('onProxyError exhausted proxies triggers refresh', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      text: async () => '192.168.1.1:1080'
    });

    await listeners.onStartup();
    for (let i = 0; i < 10; i++) {
      await Promise.resolve();
    }

    global.chrome.proxy.settings.set.mockClear();
    global.fetch.mockClear();

    global.fetch.mockResolvedValueOnce({
      ok: true,
      text: async () => '192.168.1.1:1080'
    });

    listeners.onProxyError({ error: 'fatal', fatal: true });

    for (let i = 0; i < 10; i++) {
      await Promise.resolve();
    }
    expect(global.fetch).toHaveBeenCalled();
  });

  test('refreshProxy keeps previous list if no new proxies', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      text: async () => '192.168.1.1:1080'
    });

    await listeners.onStartup();
    for (let i = 0; i < 10; i++) {
      await Promise.resolve();
    }

    global.chrome.proxy.settings.set.mockClear();
    global.fetch.mockClear();

    global.fetch.mockResolvedValueOnce({
      ok: true,
      text: async () => ''
    });

    listeners.onAlarm({ name: 'refreshProxy' });

    for (let i = 0; i < 10; i++) {
      await Promise.resolve();
    }

    expect(global.chrome.proxy.settings.set).toHaveBeenCalled();
    const config = global.chrome.proxy.settings.set.mock.calls[0][0];
    expect(config.value.pacScript.data).toContain('SOCKS5 192.168.1.1:1080');
  });

  test('TILE_CACHE_FETCH responds with hit:false on fetch error', async () => {
    global.AbortController = class {
      abort() {}
      get signal() {
        return {};
      }
    };

    global.fetch.mockRejectedValueOnce(new Error('Network error'));

    const sendResponse = jest.fn();
    const isAsync = listeners.onMessage(
      { type: 'TILE_CACHE_FETCH', url: 'http://test.com/tile' },
      {},
      sendResponse
    );

    expect(isAsync).toBe(true);

    jest.runAllTimers();
    for (let i = 0; i < 10; i++) {
      await Promise.resolve();
    }

    expect(sendResponse).toHaveBeenCalledWith({ hit: false });
    delete global.AbortController;
  });

  test('TILE_CACHE_FETCH responds with hit:false on non-ok HTTP status', async () => {
    global.AbortController = class {
      abort() {}
      get signal() {
        return {};
      }
    };

    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 404
    });

    const sendResponse = jest.fn();
    const isAsync = listeners.onMessage(
      { type: 'TILE_CACHE_FETCH', url: 'http://test.com/tile' },
      {},
      sendResponse
    );

    expect(isAsync).toBe(true);

    jest.runAllTimers();
    for (let i = 0; i < 10; i++) {
      await Promise.resolve();
    }

    expect(sendResponse).toHaveBeenCalledWith({ hit: false });
    delete global.AbortController;
  });

  test('applyProxyList triggers OFF state when no proxies available', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      text: async () => ''
    });

    await listeners.onStartup();
    for (let i = 0; i < 10; i++) {
      await Promise.resolve();
    }

    expect(global.chrome.action.setBadgeText).toHaveBeenCalledWith({ text: 'OFF' });
    expect(global.chrome.action.setBadgeBackgroundColor).toHaveBeenCalledWith({ color: '#F44336' });
  });

  test('fetchFromSource handles fetch error gracefully', async () => {
    global.fetch.mockRejectedValueOnce(new Error('fail1'));

    listeners.onAlarm({ name: 'refreshProxy' });
    for (let i = 0; i < 10; i++) {
      jest.runAllTimers();
      await Promise.resolve();
    }
  });

  test('fetchFromSource handles non ok response gracefully', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: 'Not Found'
    });

    listeners.onAlarm({ name: 'refreshProxy' });
    for (let i = 0; i < 10; i++) {
      jest.runAllTimers();
      await Promise.resolve();
    }
  });

  test('onAlarm ignores unknown alarms', async () => {
    global.fetch.mockClear();
    listeners.onAlarm({ name: 'unknownAlarm' });
    for (let i = 0; i < 10; i++) {
      await Promise.resolve();
    }
    expect(global.fetch).not.toHaveBeenCalled();
  });

  test('onProxyError ignores non-fatal errors', async () => {
    global.chrome.proxy.settings.set.mockClear();
    listeners.onProxyError({ error: 'net::ERR_TIMED_OUT', fatal: false });
    expect(global.chrome.proxy.settings.set).not.toHaveBeenCalled();
  });

  test('TILE_CACHE_FETCH ignores other messages', async () => {
    const sendResponse = jest.fn();
    const res = listeners.onMessage({ type: 'OTHER_MSG' }, {}, sendResponse);
    expect(res).toBeUndefined();
  });
});
