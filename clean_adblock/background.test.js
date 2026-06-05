describe('background.js', () => {
  beforeEach(() => {
    jest.resetModules();
    global.chrome = {
      storage: {
        sync: {
          get: jest.fn(),
          set: jest.fn(),
        },
        local: {
          get: jest.fn(),
          set: jest.fn()
        },
        session: {
          get: jest.fn(),
          remove: jest.fn()
        },
        onChanged: {
          addListener: jest.fn()
        }
      },
      runtime: {
        onInstalled: {
          addListener: jest.fn()
        },
        onMessage: {
          addListener: jest.fn()
        }
      },
      declarativeNetRequest: {
        getDynamicRules: jest.fn().mockResolvedValue([]),
        updateDynamicRules: jest.fn().mockResolvedValue()
      },
      cookies: {
        getAll: jest.fn().mockResolvedValue([]),
        set: jest.fn().mockResolvedValue()
      },
      alarms: {
        create: jest.fn(),
        onAlarm: {
          addListener: jest.fn()
        }
      },
      tabs: {
        update: jest.fn(),
        remove: jest.fn().mockResolvedValue(),
        onUpdated: {
          addListener: jest.fn()
        },
        onCreated: {
          addListener: jest.fn()
        }
      },
      action: {
        setBadgeText: jest.fn(),
        setBadgeBackgroundColor: jest.fn()
      }
    };
    global.fetch = jest.fn().mockResolvedValue({ status: 200 });
  });

  afterEach(() => {
    delete global.chrome;
    delete global.fetch;
  });

  it('runs initialization without errors', () => {
    require('./background.js');
    expect(chrome.runtime.onInstalled.addListener).toHaveBeenCalled();
  });

  it('handles updateBlockingRules correctly', async () => {
    require('./background.js');
    // Need to trigger updateBlockingRules via storage sync callback
    const syncGetCallback = chrome.storage.sync.get.mock.calls[0][1];
    await syncGetCallback({ jsBlocked: ['example.com'], enabled: true, mode: 'selective' });
    expect(chrome.declarativeNetRequest.updateDynamicRules).toHaveBeenCalled();
  });

  it('handles setupAdNetworkBlocking correctly', async () => {
    require('./background.js');
    const onInstalledCallback = chrome.runtime.onInstalled.addListener.mock.calls[0][0];
    await onInstalledCallback({ reason: 'install' });
    expect(chrome.declarativeNetRequest.updateDynamicRules).toHaveBeenCalled();
    expect(chrome.storage.sync.set).toHaveBeenCalled();
  });

  it('handles storage onChanged', () => {
    require('./background.js');
    const onChangedCallback = chrome.storage.onChanged.addListener.mock.calls[0][0];
    onChangedCallback({ enabled: { newValue: true } }, 'sync');
    expect(chrome.storage.sync.get).toHaveBeenCalled(); // via updateBadge

    onChangedCallback({ jsBlocked: { newValue: ['test.com'] } }, 'sync');
    // We would need a more involved setup to see updateBlockingRules effect
  });

  it('handles sessionKeepAlive alarm', async () => {
    require('./background.js');
    const alarmCallback = chrome.alarms.onAlarm.addListener.mock.calls[0][0];

    // In background.js, the cookies need to match the domain exactly.
    // It queries `chrome.cookies.getAll({ domain: '1point3acres.com' })`
    // and then calls `extendCookies()` which loops `SESSION_KEEP_DOMAINS` ('1point3acres.com', '.1point3acres.com')
    // Wait, the promise might not resolve in time before assertions.
    chrome.cookies.getAll.mockResolvedValue([
      { name: 'saltkey', value: '123', path: '/', domain: '1point3acres.com', secure: true, httpOnly: true }
    ]);

    // Wait for the async callback
    await alarmCallback({ name: 'sessionKeepAlive' });
    // Need a small timeout to let the inner promises flush
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(chrome.cookies.set).toHaveBeenCalled();
    expect(global.fetch).toHaveBeenCalled();
  });

  it('handles sessionKeepAlive alarm (no auth cookies)', async () => {
    require('./background.js');
    const alarmCallback = chrome.alarms.onAlarm.addListener.mock.calls[0][0];

    // Mock no auth cookies
    chrome.cookies.getAll.mockResolvedValue([
      { name: 'other_cookie', value: '123', path: '/', domain: '1point3acres.com' }
    ]);

    await alarmCallback({ name: 'sessionKeepAlive' });
    await new Promise(resolve => setTimeout(resolve, 0));

    // fetch is not called if no auth cookie
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('updateBadge works with empty storage', async () => {
    require('./background.js');
    const syncGetCallback = chrome.storage.sync.get.mock.calls[0][1];

    // This calls updateBadge(), which then calls chrome.storage.sync.get again
    syncGetCallback({});

    // Get the callback for updateBadge
    const badgeGetCallback = chrome.storage.sync.get.mock.calls[1][1];
    badgeGetCallback({ enabled: false, mode: 'all' });
    expect(chrome.action.setBadgeText).toHaveBeenCalledWith({ text: 'OFF' });

    badgeGetCallback({ enabled: true, mode: 'all' });
    expect(chrome.action.setBadgeText).toHaveBeenCalledWith({ text: 'ON' });

    badgeGetCallback({ enabled: true, mode: 'selective' });
    expect(chrome.action.setBadgeText).toHaveBeenCalledWith({ text: 'SEL' });
  });

  it('handles tab events and linkedin redirect', () => {
    require('./background.js');

    // Simulate LinkedIn message
    const msgCallback = chrome.runtime.onMessage.addListener.mock.calls[0][0];
    msgCallback({ type: 'LINKEDIN_PROFILE_HOVER', url: 'https://linkedin.com/in/test' });

    // Simulate tab creation with premium URL
    const tabCreatedCallback = chrome.tabs.onCreated.addListener.mock.calls[0][0];
    tabCreatedCallback({ id: 1, url: 'https://linkedin.com/premium' });

    expect(chrome.tabs.update).toHaveBeenCalledWith(1, { url: 'https://linkedin.com/in/test' });

    // Simulate adblock update tab
    tabCreatedCallback({ id: 2, url: 'https://getadblock.com/update/' });
    expect(chrome.tabs.remove).toHaveBeenCalledWith(2);

    // Simulate tab updated
    const tabUpdatedCallback = chrome.tabs.onUpdated.addListener.mock.calls[0][0];
    tabUpdatedCallback(3, { url: 'https://getadblock.com/installed/' }, {});
    expect(chrome.tabs.remove).toHaveBeenCalledWith(3);
  });

  it('handles linkedin redirect from session fallback', () => {
    require('./background.js');

    chrome.storage.session.get = jest.fn((keys, cb) => cb({ linkedinPendingProfile: 'https://linkedin.com/in/fallback' }));

    const tabCreatedCallback = chrome.tabs.onCreated.addListener.mock.calls[0][0];
    tabCreatedCallback({ id: 4, url: 'https://linkedin.com/premium' });

    expect(chrome.tabs.update).toHaveBeenCalledWith(4, { url: 'https://linkedin.com/in/fallback' });
  });

  it('handles linkedin redirect fallback to feed', () => {
    require('./background.js');

    chrome.storage.session.get = jest.fn((keys, cb) => cb({}));

    const tabCreatedCallback = chrome.tabs.onCreated.addListener.mock.calls[0][0];
    tabCreatedCallback({ id: 5, url: 'https://linkedin.com/premium' });

    expect(chrome.tabs.update).toHaveBeenCalledWith(5, { url: 'https://www.linkedin.com/feed/' });
  });
  it('catches error in updateBlockingRules', async () => {
    require('./background.js');
    console.error = jest.fn();
    // In background.js initialization, setupAdNetworkBlocking is also called which might eat the first rejection.
    chrome.declarativeNetRequest.updateDynamicRules.mockImplementation(() => Promise.reject(new Error('Test Error')));

    // Trigger it
    const syncGetCallback = chrome.storage.sync.get.mock.calls[0][1];
    await syncGetCallback({ jsBlocked: ['example.com'] });

    // updateDynamicRules inside updateBlockingRules is async and its promise might not be awaited by the callback
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(console.error).toHaveBeenCalledWith('DNR Update Error:', expect.any(Error));
  });

  it('catches error in setupAdNetworkBlocking', async () => {
    require('./background.js');
    console.error = jest.fn();
    chrome.declarativeNetRequest.updateDynamicRules.mockImplementationOnce(() => Promise.reject(new Error('Test Error')));

    const onInstalledCallback = chrome.runtime.onInstalled.addListener.mock.calls[0][0];
    await onInstalledCallback({ reason: 'install' });

    await new Promise(resolve => setTimeout(resolve, 0));

    expect(console.error).toHaveBeenCalledWith('Ad network blocking setup failed:', expect.any(Error));
  });

  it('catches error in sessionKeepAlive heartbeat', async () => {
    require('./background.js');
    console.warn = jest.fn();
    global.fetch.mockRejectedValue(new Error('Network Error'));

    const alarmCallback = chrome.alarms.onAlarm.addListener.mock.calls[0][0];
    chrome.cookies.getAll.mockResolvedValue([
      { name: 'saltkey', value: '123', path: '/', domain: '1point3acres.com', secure: true, httpOnly: true }
    ]);

    await alarmCallback({ name: 'sessionKeepAlive' });
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(console.warn).toHaveBeenCalledWith('[SessionKeeper] 1p3a heartbeat failed:', 'Network Error');
  });

  it('handles shouldCloseTab with invalid URL', () => {
    require('./background.js');
    // Simulate tab updated with invalid URL
    const tabUpdatedCallback = chrome.tabs.onUpdated.addListener.mock.calls[0][0];
    // should not throw
    expect(() => {
        tabUpdatedCallback(3, { url: 'not-a-url' }, {});
    }).not.toThrow();
  });

  it('bails early in updateBlockingRules if already updating', async () => {
    // In order to properly test isUpdatingRules, we need to extract the function
    // or trigger it twice rapidly.
    require('./background.js');
    const syncGetCallback = chrome.storage.sync.get.mock.calls[0][1];
    const onChangedCallback = chrome.storage.onChanged.addListener.mock.calls[0][0];

    // Create a slow mock for getDynamicRules to hold the lock
    let resolveDnr;
    chrome.declarativeNetRequest.getDynamicRules.mockImplementation(() => new Promise(r => resolveDnr = r));

    // Start first update (gets lock)
    onChangedCallback({ jsBlocked: { newValue: ['example.com'] } }, 'sync');

    // Trigger second update before first completes
    onChangedCallback({ jsBlocked: { newValue: ['test.com'] } }, 'sync');

    // Second update should have bailed.
    // Let's resolve the first one
    resolveDnr([]);

    // Wait for the async callbacks to settle
    await new Promise(resolve => setTimeout(resolve, 10));

    // Since the second call bailed, it should not have queued another updateDynamicRules
    // Note that setupAdNetworkBlocking() also ran and could have queued an update. Let's just
    // check that updateDynamicRules is only called for the ones that didn't bail.
    // Given the initial setup, we should have 1 call from setupAdNetworkBlocking (if we didn't mock it to wait)
    // and 1 call from our first onChangedCallback. Total = 2.
    // Without the lock, it would be 3.
    expect(chrome.declarativeNetRequest.updateDynamicRules).toHaveBeenCalledTimes(2);
  });

  it('handles missing storage during onChanged', () => {
    require('./background.js');
    const onChangedCallback = chrome.storage.onChanged.addListener.mock.calls[0][0];
    console.error = jest.fn();

    // Remove the storage mock to simulate an error inside the event listener
    const syncMock = chrome.storage.sync;
    delete chrome.storage.sync;

    onChangedCallback({ enabled: { newValue: true } }, 'sync');
    expect(console.error).toHaveBeenCalledWith('Background storage onChanged handler failed:', expect.any(Error));

    // Restore
    chrome.storage.sync = syncMock;
  });

  it('handles missing storage during initialization', () => {
    console.error = jest.fn();
    // For initialization, background.js accesses chrome.storage.sync.get immediately.
    // We can simulate an error during initialization by making sync.get throw or not exist.
    const syncMock = chrome.storage.sync;
    delete chrome.storage.sync;
    require('./background.js');
    expect(console.error).toHaveBeenCalledWith('Background startup storage access failed:', expect.any(Error));
    // Restore
    chrome.storage.sync = syncMock;
  });

  it('handles errors during onInstalled', () => {
    require('./background.js');
    chrome.storage.sync.set.mockImplementation(() => { throw new Error('Sync Error') });
    console.error = jest.fn();

    const onInstalledCallback = chrome.runtime.onInstalled.addListener.mock.calls[0][0];
    onInstalledCallback({ reason: 'install' });

    expect(console.error).toHaveBeenCalledWith('Background onInstalled storage set failed:', expect.any(Error));
  });
});
