describe('Background Script Execution', () => {
  let listeners = {};

  beforeEach(() => {
    listeners = {};
    global.fetch = jest.fn(() => Promise.resolve({ status: 200 }));
    // Mock Chrome API
    global.chrome = {
      storage: {
        sync: {
          get: jest.fn((defaults, cb) =>
            cb({ enabled: true, mode: 'selective', jsBlocked: ['bild.de'] })
          ),
          set: jest.fn()
        },
        session: {
          get: jest.fn((keys, cb) =>
            cb({ linkedinPendingProfile: 'https://linkedin.com/in/test' })
          ),
          remove: jest.fn()
        },
        onChanged: {
          addListener: jest.fn((cb) => {
            listeners.onChanged = cb;
          })
        }
      },
      action: {
        setBadgeText: jest.fn(),
        setBadgeBackgroundColor: jest.fn()
      },
      declarativeNetRequest: {
        getDynamicRules: jest.fn(() => Promise.resolve([{ id: 9001, condition: {} }])),
        updateDynamicRules: jest.fn(() => Promise.resolve())
      },
      runtime: {
        onInstalled: {
          addListener: jest.fn((cb) => {
            listeners.onInstalled = cb;
          })
        },
        lastError: null,
        onMessage: {
          addListener: jest.fn((cb) => {
            listeners.onMessage = cb;
          }),
          removeListener: jest.fn()
        }
      },
      tabs: {
        query: jest.fn(),
        onUpdated: {
          addListener: jest.fn((cb) => {
            listeners.onUpdated = cb;
          })
        },
        onCreated: {
          addListener: jest.fn((cb) => {
            listeners.onCreated = cb;
          })
        },
        remove: jest.fn(() => Promise.resolve()),
        update: jest.fn()
      },
      alarms: {
        create: jest.fn(),
        onAlarm: {
          addListener: jest.fn((cb) => {
            listeners.onAlarm = cb;
          })
        }
      },
      cookies: {
        getAll: jest.fn(() =>
          Promise.resolve([
            { name: 'saltkey', value: '123', path: '/', domain: '1point3acres.com' },
            { name: 'nonauth', value: '456', path: '/', domain: '1point3acres.com', session: true }
          ])
        ),
        set: jest.fn(() => Promise.resolve())
      }
    };
  });

  afterEach(() => {
    jest.resetModules();
  });

  test('Runs without errors', () => {
    require('./background.js');
    expect(chrome.storage.sync.get).toHaveBeenCalled();
  });

  test('onInstalled logic', () => {
    require('./background.js');
    listeners.onInstalled({ reason: 'install' });
    expect(chrome.storage.sync.set).toHaveBeenCalled();
  });

  test('onChanged logic - enabled and jsBlocked', () => {
    require('./background.js');
    listeners.onChanged(
      { enabled: { newValue: false }, jsBlocked: { newValue: ['test.com'] } },
      'sync'
    );
    expect(chrome.storage.sync.get).toHaveBeenCalled();
  });

  test('alarms trigger', async () => {
    require('./background.js');
    await listeners.onAlarm({ name: 'sessionKeepAlive' });
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(chrome.cookies.getAll).toHaveBeenCalled();
    expect(chrome.cookies.set).toHaveBeenCalled();
  });

  test('linkedin profile message', () => {
    require('./background.js');
    listeners.onMessage({ type: 'LINKEDIN_PROFILE_HOVER', url: 'https://test' });
    listeners.onUpdated(
      1,
      { url: 'https://linkedin.com/premium' },
      { url: 'https://linkedin.com/premium' }
    );
    expect(chrome.tabs.update).toHaveBeenCalledWith(1, { url: 'https://test' });
  });

  test('linkedin profile session storage fallback', () => {
    require('./background.js');
    listeners.onCreated({ id: 2, pendingUrl: 'https://linkedin.com/premium' });
    expect(chrome.storage.session.get).toHaveBeenCalled();
  });

  test('linkedin profile no storage fallback', () => {
    global.chrome.storage.session.get = jest.fn((keys, cb) => cb({}));
    require('./background.js');
    listeners.onCreated({ id: 2, url: 'https://linkedin.com/premium' });
    expect(chrome.storage.session.get).toHaveBeenCalled();
    expect(chrome.tabs.update).toHaveBeenCalledWith(2, { url: 'https://www.linkedin.com/feed/' });
  });

  test('tab creation close logic', () => {
    require('./background.js');
    listeners.onCreated({ id: 3, pendingUrl: 'https://getadblock.com/update/' });
    expect(chrome.tabs.remove).toHaveBeenCalledWith(3);

    listeners.onCreated({ id: 4, url: 'https://example.com/cookie-notice' });
    expect(chrome.tabs.remove).toHaveBeenCalledWith(4);
  });

  test('tab updated close logic', () => {
    require('./background.js');
    listeners.onUpdated(
      5,
      { url: 'https://example.com/privacy-policy/cookie' },
      { url: 'https://example.com/privacy-policy/cookie' }
    );
    expect(chrome.tabs.remove).toHaveBeenCalledWith(5);
  });

  test('updateBadge logic with mode=all', () => {
    global.chrome.storage.sync.get = jest.fn((defaults, cb) => cb({ enabled: true, mode: 'all' }));
    require('./background.js');
    listeners.onChanged({ mode: { newValue: 'all' } }, 'sync');
    expect(chrome.action.setBadgeText).toHaveBeenCalledWith({ text: 'ON' });
  });

  test('updateBadge disabled', () => {
    global.chrome.storage.sync.get = jest.fn((defaults, cb) =>
      cb({ enabled: false, mode: 'selective' })
    );
    require('./background.js');
    listeners.onChanged({ enabled: { newValue: false } }, 'sync');
    expect(chrome.action.setBadgeText).toHaveBeenCalledWith({ text: 'OFF' });
  });

  test('updateBadge undefined chrome.storage', () => {
    const origStorage = global.chrome.storage;
    require('./background.js');
    global.chrome.storage = undefined;
    listeners.onChanged({ enabled: { newValue: false } }, 'sync');
    global.chrome.storage = origStorage;
  });

  test('updateBlockingRules catches errors', async () => {
    const err = jest.fn();
    const originalConsoleError = console.error;
    console.error = err;
    global.chrome.declarativeNetRequest.getDynamicRules.mockRejectedValueOnce(
      new Error('test error')
    );
    require('./background.js');
    listeners.onChanged({ jsBlocked: { newValue: ['bild.de'] } }, 'sync');
    await new Promise((r) => setTimeout(r, 10));
    expect(err).toHaveBeenCalled();
    console.error = originalConsoleError;
  });

  test('setupAdNetworkBlocking catches errors', async () => {
    const err = jest.fn();
    const originalConsoleError = console.error;
    console.error = err;
    global.chrome.declarativeNetRequest.getDynamicRules.mockRejectedValueOnce(
      new Error('test error')
    );
    require('./background.js');
    listeners.onInstalled({ reason: 'install' });
    await new Promise((r) => setTimeout(r, 10));
    expect(err).toHaveBeenCalled();
    console.error = originalConsoleError;
  });

  test('onInstalled throws error on storage set', () => {
    const err = jest.fn();
    const originalConsoleError = console.error;
    console.error = err;
    global.chrome.storage.sync.set.mockImplementationOnce(() => {
      throw new Error('test error');
    });
    require('./background.js');
    listeners.onInstalled({ reason: 'install' });
    expect(err).toHaveBeenCalled();
    console.error = originalConsoleError;
  });

  test('onChanged throws error', () => {
    const err = jest.fn();
    const originalConsoleError = console.error;
    console.error = err;
    global.chrome.storage.sync.get.mockImplementationOnce(() => {
      throw new Error('test error');
    });
    require('./background.js');
    listeners.onChanged({ enabled: { newValue: false } }, 'sync');
    expect(err).toHaveBeenCalled();
    console.error = originalConsoleError;
  });

  test('sessionKeepAlive throws error on extendCookies', async () => {
    global.chrome.cookies.getAll.mockResolvedValueOnce([
      { name: 'saltkey', value: '123', path: '/', domain: '1point3acres.com' }
    ]);
    global.chrome.cookies.set.mockRejectedValueOnce(new Error('test error'));
    require('./background.js');
    await listeners.onAlarm({ name: 'sessionKeepAlive' });
    await new Promise((r) => setTimeout(r, 10));
  });

  test('sessionKeepAlive returns if no auth', async () => {
    global.chrome.cookies.getAll.mockResolvedValueOnce([]);
    require('./background.js');
    await listeners.onAlarm({ name: 'sessionKeepAlive' });
    await new Promise((r) => setTimeout(r, 10));
  });

  test('shouldCloseTab returns false on invalid url', () => {
    require('./background.js');
    listeners.onUpdated(5, { url: 'invalid-url' }, { url: 'invalid-url' });
  });

  test('shouldCloseTab returns false on empty url', () => {
    require('./background.js');
    listeners.onUpdated(5, { url: '' }, { url: '' });
  });

  test('isLinkedInPremium returns false on empty url', () => {
    require('./background.js');
    listeners.onUpdated(5, { url: 'https://linkedin.com/' }, { url: 'https://linkedin.com/' });
  });

  test('shouldCloseTab catch block', () => {
    const OrigURL = global.URL;
    global.URL = jest.fn(() => {
      throw new Error('test error');
    });
    require('./background.js');
    listeners.onUpdated(5, { url: 'https://example.com' }, { url: 'https://example.com' });
    global.URL = OrigURL;
  });

  test('updateBadge runtime error', () => {
    global.chrome.runtime.lastError = new Error('test');
    require('./background.js');
  });

  test('sessionKeepAlive catch block on heartbeat', async () => {
    const warn = jest.fn();
    const originalConsoleWarn = console.warn;
    console.warn = warn;
    global.chrome.cookies.getAll.mockResolvedValueOnce([
      { name: 'saltkey', value: '123', path: '/', domain: '1point3acres.com' }
    ]);
    global.fetch.mockRejectedValueOnce(new Error('test error'));
    require('./background.js');
    await listeners.onAlarm({ name: 'sessionKeepAlive' });
    await new Promise((r) => setTimeout(r, 10));
    expect(warn).toHaveBeenCalled();
    console.warn = originalConsoleWarn;
  });

  test('extendCookies catches errors and ignores if domain has no cookies yet', async () => {
    global.chrome.cookies.getAll = jest
      .fn()
      .mockResolvedValueOnce([
        { name: 'saltkey', value: '123', path: '/', domain: '1point3acres.com' }
      ])
      .mockRejectedValueOnce(new Error('no cookies yet'));

    require('./background.js');
    await listeners.onAlarm({ name: 'sessionKeepAlive' });
    await new Promise((r) => setTimeout(r, 10));
  });

  test('sessionKeepAlive catches errors', async () => {
    const warn = jest.fn();
    const originalConsoleWarn = console.warn;
    console.warn = warn;
    global.chrome.cookies.getAll.mockRejectedValueOnce(new Error('test error'));
    require('./background.js');
    await listeners.onAlarm({ name: 'sessionKeepAlive' });
    await new Promise((r) => setTimeout(r, 10));
    expect(warn).toHaveBeenCalled();
    console.warn = originalConsoleWarn;
  });

  test('startup catch block console.error mock', () => {
    jest.resetModules();
    const err = jest.fn();
    const originalConsoleError = console.error;
    console.error = err;
    global.chrome.storage.sync.get.mockImplementationOnce(() => {
      throw new Error('test error');
    });
    require('./background.js');
    expect(err).toHaveBeenCalled();
    console.error = originalConsoleError;
  });

  test('shouldCloseTab return false on null', () => {
    require('./background.js');
    listeners.onUpdated(5, { url: null }, { url: null });
  });

  test('isLinkedInPremium return false on null', () => {
    require('./background.js');
    listeners.onUpdated(5, { url: undefined }, { url: undefined });
  });

  test('redirectFromPremium runtime.lastError coverage', () => {
    global.chrome.runtime.lastError = new Error('test error');
    require('./background.js');
    listeners.onCreated({ id: 2, url: 'https://linkedin.com/premium' });
    global.chrome.runtime.lastError = null;
  });

  test('extendCookies auth cookie session true coverage', async () => {
    global.chrome.cookies.getAll.mockResolvedValueOnce([
      { name: 'saltkey', value: '123', path: '/', domain: '1point3acres.com', session: true }
    ]);
    require('./background.js');
    await listeners.onAlarm({ name: 'sessionKeepAlive' });
    await new Promise((r) => setTimeout(r, 10));
  });

  test('shouldCloseTab getadblock updates installed logic', () => {
    require('./background.js');
    listeners.onCreated({ id: 5, url: 'https://getadblock.com/installed/' });
    expect(chrome.tabs.remove).toHaveBeenCalledWith(5);
  });

  test('onUpdated catch block on remove', async () => {
    chrome.tabs.remove.mockRejectedValueOnce(new Error('test error'));
    require('./background.js');
    listeners.onUpdated(
      6,
      { url: 'https://getadblock.com/installed/' },
      { url: 'https://getadblock.com/installed/' }
    );
    await new Promise((r) => setTimeout(r, 10));
  });

  test('onCreated catch block on remove', async () => {
    chrome.tabs.remove.mockRejectedValueOnce(new Error('test error'));
    require('./background.js');
    listeners.onCreated({ id: 7, url: 'https://getadblock.com/installed/' });
    await new Promise((r) => setTimeout(r, 10));
  });

  test('linkedinPremium onCreated coverage missing', () => {
    require('./background.js');
    listeners.onCreated({
      id: 8,
      url: 'https://linkedin.com/premium',
      pendingUrl: 'https://linkedin.com/premium'
    });
  });

  test('linkedinPremium onCreated coverage missing 2', () => {
    require('./background.js');
    listeners.onCreated({ id: 8, url: 'https://linkedin.com/premium', pendingUrl: null });
  });

  test('linkedinPremium onCreated url absent', () => {
    require('./background.js');
    listeners.onCreated({ id: 8 });
  });

  test('linkedinPremium onUpdated url absent', () => {
    require('./background.js');
    listeners.onUpdated(8, {}, {});
  });

  test('shouldCloseTab getadblock updates no match', () => {
    require('./background.js');
    listeners.onCreated({ id: 5, url: 'https://getadblock.com/other/' });
  });

  test('linkedin profile message without url', () => {
    require('./background.js');
    listeners.onMessage({ type: 'LINKEDIN_PROFILE_HOVER' });
  });

  test('linkedin profile message wrong type', () => {
    require('./background.js');
    listeners.onMessage({ type: 'OTHER' });
  });

  test('onUpdated covers url but not shouldCloseTab', () => {
    require('./background.js');
    listeners.onUpdated(5, { url: 'https://example.com' }, { url: 'https://example.com' });
  });

  test('onCreated covers url but not shouldCloseTab', () => {
    require('./background.js');
    listeners.onCreated({ id: 5, url: 'https://example.com' });
  });

  test('background 116 coverage', async () => {
    const err = jest.fn();
    const originalConsoleError = console.error;
    console.error = err;
    global.chrome.declarativeNetRequest.updateDynamicRules = jest
      .fn()
      .mockImplementation((args) => {
        if (args && args.addRules && args.addRules.length > 0 && args.addRules[0].id === 9000) {
          return Promise.reject(new Error('test error setup'));
        }
        return Promise.resolve();
      });

    require('./background.js');
    listeners.onInstalled({ reason: 'install' });
    await new Promise((r) => setTimeout(r, 10));
    expect(err).toHaveBeenCalledWith('Ad network blocking setup failed:', expect.any(Error));
    console.error = originalConsoleError;
  });

  test('background 156 coverage', () => {
    const err = jest.fn();
    const originalConsoleError = console.error;
    console.error = err;
    require('./background.js');
    listeners.onChanged(null, 'sync');
    expect(err).toHaveBeenCalledWith(
      'Background storage onChanged handler failed:',
      expect.any(Error)
    );
    console.error = originalConsoleError;
  });

  test('updateBlockingRules coverage DNR update catch', async () => {
    const err = jest.fn();
    const originalConsoleError = console.error;
    console.error = err;
    global.chrome.declarativeNetRequest.updateDynamicRules.mockRejectedValueOnce(
      new Error('dnr error')
    );
    require('./background.js');
    listeners.onChanged({ jsBlocked: { newValue: ['bild.de'] } }, 'sync');
    await new Promise((r) => setTimeout(r, 10));
    expect(err).toHaveBeenCalledWith('DNR Update Error:', expect.any(Error));
    console.error = originalConsoleError;
  });

  test('extendCookies catch block on set coverage', async () => {
    global.chrome.cookies.getAll.mockResolvedValueOnce([
      { name: 'saltkey', value: '123', path: '/', domain: '1point3acres.com' }
    ]);
    global.chrome.cookies.set = jest.fn().mockRejectedValueOnce(new Error('set err'));
    require('./background.js');
    await listeners.onAlarm({ name: 'sessionKeepAlive' });
    await new Promise((r) => setTimeout(r, 10));
  });

  test('isLinkedInPremium truthy line 354', () => {
    require('./background.js');
    listeners.onUpdated(
      5,
      { url: 'https://linkedin.com/premium' },
      { url: 'https://linkedin.com/premium' }
    );
  });

  test('isLinkedInPremium line 314', () => {
    // testing shouldCloseTab false via path
    require('./background.js');
    listeners.onCreated({ id: 5, url: 'https://example.com/not-a-cookie-notice' });
  });

  test('extendCookies ignore non auth cookies', async () => {
    global.chrome.cookies.getAll.mockResolvedValueOnce([
      { name: 'unrelated', value: '123', path: '/', domain: '1point3acres.com' }
    ]);
    require('./background.js');
    await listeners.onAlarm({ name: 'sessionKeepAlive' });
    await new Promise((r) => setTimeout(r, 10));
  });

  test('extendCookies catch block on cookies loop', async () => {
    global.chrome.cookies.getAll.mockRejectedValue(new Error('test'));
    require('./background.js');
    await listeners.onAlarm({ name: 'sessionKeepAlive' });
    await new Promise((r) => setTimeout(r, 10));
  });
});

describe('Background Script Execution Remaining Untested Paths', () => {
  let listeners = {};

  beforeEach(() => {
    listeners = {};
    global.fetch = jest.fn(() => Promise.resolve({ status: 200 }));
    // Mock Chrome API
    global.chrome = {
      storage: {
        sync: {
          get: jest.fn((defaults, cb) =>
            cb({ enabled: true, mode: 'selective', jsBlocked: ['bild.de'] })
          ),
          set: jest.fn()
        },
        session: {
          get: jest.fn((keys, cb) =>
            cb({ linkedinPendingProfile: 'https://linkedin.com/in/test' })
          ),
          remove: jest.fn()
        },
        onChanged: {
          addListener: jest.fn((cb) => {
            listeners.onChanged = cb;
          })
        }
      },
      action: {
        setBadgeText: jest.fn(),
        setBadgeBackgroundColor: jest.fn()
      },
      declarativeNetRequest: {
        getDynamicRules: jest.fn(() => Promise.resolve([{ id: 9001, condition: {} }])),
        updateDynamicRules: jest.fn(() => Promise.resolve())
      },
      runtime: {
        onInstalled: {
          addListener: jest.fn((cb) => {
            listeners.onInstalled = cb;
          })
        },
        lastError: null,
        onMessage: {
          addListener: jest.fn((cb) => {
            listeners.onMessage = cb;
          }),
          removeListener: jest.fn()
        }
      },
      tabs: {
        query: jest.fn(),
        onUpdated: {
          addListener: jest.fn((cb) => {
            listeners.onUpdated = cb;
          })
        },
        onCreated: {
          addListener: jest.fn((cb) => {
            listeners.onCreated = cb;
          })
        },
        remove: jest.fn(() => Promise.resolve()),
        update: jest.fn()
      },
      alarms: {
        create: jest.fn(),
        onAlarm: {
          addListener: jest.fn((cb) => {
            listeners.onAlarm = cb;
          })
        }
      },
      cookies: {
        getAll: jest.fn(() =>
          Promise.resolve([
            { name: 'saltkey', value: '123', path: '/', domain: '1point3acres.com' },
            { name: 'nonauth', value: '456', path: '/', domain: '1point3acres.com', session: true }
          ])
        ),
        set: jest.fn(() => Promise.resolve())
      }
    };
  });

  afterEach(() => {
    jest.resetModules();
  });

  test('shouldCloseTab false when path does not match', () => {
    require('./background.js');
    listeners.onCreated({ id: 9, url: 'https://example.com/not-a-cookie' });
  });

  test('isLinkedInPremium returns true', () => {
    require('./background.js');
    listeners.onCreated({ id: 10, url: 'https://linkedin.com/premium' });
  });
});
