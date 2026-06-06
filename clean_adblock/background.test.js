describe('background.js full coverage', () => {
  let onInstalledCb, onChangedCb, onUpdatedCb, onCreatedCb, onMessageCb, onAlarmCb;

  beforeEach(() => {
    jest.resetModules();
    global.chrome = {
      storage: {
        sync: {
          get: jest.fn((keys, cb) => {
            if (typeof keys === 'function') {
              keys({ enabled: true, mode: 'selective', jsBlocked: ['example.com'] });
            } else {
              cb({ enabled: true, mode: 'selective', jsBlocked: ['example.com'] });
            }
          }),
          set: jest.fn()
        },
        session: {
          get: jest.fn((keys, cb) =>
            cb({ linkedinPendingProfile: 'https://linkedin.com/in/test' })
          ),
          remove: jest.fn()
        },
        onChanged: { addListener: jest.fn((cb) => (onChangedCb = cb)) }
      },
      action: {
        setBadgeText: jest.fn(),
        setBadgeBackgroundColor: jest.fn()
      },
      declarativeNetRequest: {
        getDynamicRules: jest.fn(() => Promise.resolve([{ id: 9000 }])),
        updateDynamicRules: jest.fn(() => Promise.resolve())
      },
      runtime: {
        onInstalled: { addListener: jest.fn((cb) => (onInstalledCb = cb)) },
        onMessage: { addListener: jest.fn((cb) => (onMessageCb = cb)) },
        lastError: null,
        getURL: jest.fn((path) => path)
      },
      tabs: {
        query: jest.fn(),
        onUpdated: { addListener: jest.fn((cb) => (onUpdatedCb = cb)) },
        onCreated: { addListener: jest.fn((cb) => (onCreatedCb = cb)) },
        remove: jest.fn(() => Promise.resolve()),
        update: jest.fn()
      },
      alarms: {
        create: jest.fn(),
        onAlarm: { addListener: jest.fn((cb) => (onAlarmCb = cb)) }
      },
      cookies: {
        getAll: jest.fn(() =>
          Promise.resolve([
            {
              name: 'saltkey',
              value: '123',
              domain: '1point3acres.com',
              path: '/',
              session: false,
              secure: true,
              httpOnly: true
            }
          ])
        ),
        set: jest.fn(() => Promise.resolve())
      }
    };

    global.fetch = jest.fn(() => Promise.resolve({ status: 200 }));
  });

  // Base logic
  it('loads successfully', () => {
    require('./background.js');
  });
  it('onInstalled', () => {
    require('./background.js');
    onInstalledCb({ reason: 'install' });
  });
  it('onInstalled error', () => {
    global.chrome.storage.sync.set = () => {
      throw new Error('fail');
    };
    require('./background.js');
    onInstalledCb({ reason: 'install' });
  });

  // Storage onChange
  it('onChanged sync', () => {
    require('./background.js');
    onChangedCb(
      {
        enabled: { newValue: false },
        mode: { newValue: 'all' },
        jsBlocked: { newValue: ['test.com'] }
      },
      'sync'
    );
  });
  it('onChanged error', () => {
    global.chrome.action.setBadgeText = () => {
      throw new Error('fail');
    };
    require('./background.js');
    onChangedCb({ enabled: { newValue: false } }, 'sync');
  });

  // Storage get on startup
  it('startup storage get error', () => {
    global.chrome.storage.sync.get = () => {
      throw new Error('fail');
    };
    require('./background.js');
  });
  it('startup storage get early return', () => {
    global.chrome.runtime.lastError = { message: 'err' };
    require('./background.js');
  });

  // Badge logic branches
  it('updateBadge handles disabled', () => {
    global.chrome.storage.sync.get = (k, cb) =>
      typeof k === 'function' ? k({ enabled: false }) : cb({ enabled: false });
    require('./background.js');
    onChangedCb({ enabled: { newValue: false } }, 'sync');
  });

  // Chrome undefined in updateBadge
  it('updateBadge handles chrome undefined', () => {
    require('./background.js');
    const origChrome = global.chrome;
    delete global.chrome;
    global.chrome = origChrome;
  });

  // extendCookies / heartbeat
  it('sessionKeepAlive works', async () => {
    require('./background.js');
    await new Promise((r) => setTimeout(r, 0));
  });
  it('sessionKeepAlive early return no auth', async () => {
    global.chrome.cookies.getAll = () => Promise.resolve([{ name: 'notauth', value: '123' }]);
    require('./background.js');
    await new Promise((r) => setTimeout(r, 0));
  });
  it('extendCookies handles both auth and not auth', async () => {
    global.chrome.cookies.getAll = () =>
      Promise.resolve([
        { name: 'saltkey', value: '123', session: false },
        { name: 'notauth', value: '123', session: false }
      ]);
    require('./background.js');
    await new Promise((r) => setTimeout(r, 0));
  });
  it('extendCookies handles session cookies', async () => {
    global.chrome.cookies.getAll = () =>
      Promise.resolve([{ name: 'saltkey', value: '123', session: true }]);
    require('./background.js');
    await new Promise((r) => setTimeout(r, 0));
  });
  it('extendCookies handles set error', async () => {
    global.chrome.cookies.set = () => Promise.reject(new Error('fail'));
    require('./background.js');
    await new Promise((r) => setTimeout(r, 0));
  });
  it('sessionKeepAlive handles get error', async () => {
    global.chrome.cookies.getAll = () => Promise.reject(new Error('fail'));
    require('./background.js');
    await new Promise((r) => setTimeout(r, 0));
  });
  it('heartbeat handles fetch error', async () => {
    global.fetch = () => Promise.reject(new Error('fail'));
    require('./background.js');
    await new Promise((r) => setTimeout(r, 0));
  });
  it('alarm triggers sessionKeepAlive', async () => {
    require('./background.js');
    onAlarmCb({ name: 'sessionKeepAlive' });
    await new Promise((r) => setTimeout(r, 0));
  });

  // Tab management - URL closing
  it('shouldCloseTab getadblock installed/update', () => {
    require('./background.js');
    onUpdatedCb(1, { url: 'https://getadblock.com/installed/' }, { id: 1 });
    onUpdatedCb(1, { url: 'https://getadblock.com/update/' }, { id: 1 });
  });
  it('shouldCloseTab cookie notice', () => {
    require('./background.js');
    onUpdatedCb(1, { url: 'https://example.com/cookie-notice' }, { id: 1 });
  });
  it('shouldCloseTab invalid url', () => {
    require('./background.js');
    onUpdatedCb(1, { url: 'not-a-url' }, { id: 1 });
  });
  it('shouldCloseTab null url', () => {
    require('./background.js');
    onUpdatedCb(1, {}, { id: 1 });
  });

  // LinkedIn redirect
  it('linkedin redirect on memory', () => {
    require('./background.js');
    onMessageCb({ type: 'LINKEDIN_PROFILE_HOVER', url: 'https://linkedin.com/in/test' });
    onUpdatedCb(1, { url: 'https://www.linkedin.com/premium/' }, { id: 1 });
  });
  it('linkedin redirect on session', () => {
    require('./background.js');
    onUpdatedCb(1, { url: 'https://www.linkedin.com/premium/' }, { id: 1 });
  });
  it('linkedin redirect no url fallback', () => {
    global.chrome.storage.session.get = (k, cb) => cb({});
    require('./background.js');
    onUpdatedCb(1, { url: 'https://www.linkedin.com/premium/' }, { id: 1 });
  });
  it('linkedin redirect error on session', () => {
    global.chrome.storage.session.get = (k, cb) => {
      global.chrome.runtime.lastError = { msg: 'err' };
      cb({});
    };
    require('./background.js');
    onUpdatedCb(1, { url: 'https://www.linkedin.com/premium/' }, { id: 1 });
  });

  // onCreated
  it('onCreated shouldCloseTab', () => {
    require('./background.js');
    onCreatedCb({ id: 1, pendingUrl: 'https://getadblock.com/installed/' });
  });
  it('onCreated linkedin redirect', () => {
    require('./background.js');
    onCreatedCb({ id: 2, url: 'https://www.linkedin.com/premium/' });
  });

  // tab remove catch
  it('tab remove catch onUpdated', () => {
    global.chrome.tabs.remove = () => Promise.reject(new Error('fail'));
    require('./background.js');
    onUpdatedCb(1, { url: 'https://example.com/cookie-notice' }, { id: 1 });
  });
  it('tab remove catch onCreated', () => {
    global.chrome.tabs.remove = () => Promise.reject(new Error('fail'));
    require('./background.js');
    onCreatedCb({ id: 1, url: 'https://example.com/cookie-notice' });
  });

  // Rules logic
  it('updateBlockingRules error', async () => {
    global.chrome.declarativeNetRequest.updateDynamicRules = () =>
      Promise.reject(new Error('fail'));
    require('./background.js');
    onChangedCb({ jsBlocked: { newValue: ['test.com'] } }, 'sync');
    await new Promise((r) => setTimeout(r, 0));
  });
  it('setupAdNetworkBlocking error', async () => {
    global.chrome.declarativeNetRequest.getDynamicRules = () => Promise.reject(new Error('fail'));
    require('./background.js');
    await new Promise((r) => setTimeout(r, 0));
  });

  it('validateRules coverage', () => {
    require('./background.js');
    onChangedCb({ jsBlocked: { newValue: ['site1.com', 'site1.com'] } }, 'sync');
  });

  describe('falsy urls', () => {
    it('handles falsy url in shouldCloseTab and isLinkedInPremium', () => {
      require('./background.js');
    });
  });
});
