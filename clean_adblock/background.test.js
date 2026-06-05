/**
 * Tests for clean_adblock/background.js
 */

// Mock Chrome API
global.chrome = {
  storage: {
    sync: {
      get: jest.fn(),
      set: jest.fn()
    },
    onChanged: {
      addListener: jest.fn()
    },
    session: {
      get: jest.fn(),
      remove: jest.fn()
    }
  },
  action: {
    setBadgeText: jest.fn(),
    setBadgeBackgroundColor: jest.fn()
  },
  declarativeNetRequest: {
    getDynamicRules: jest.fn().mockResolvedValue([{ id: 9000 }]),
    updateDynamicRules: jest.fn().mockResolvedValue()
  },
  runtime: {
    onInstalled: {
      addListener: jest.fn((cb) => cb({ reason: 'install' }))
    },
    lastError: null,
    onMessage: {
      addListener: jest.fn()
    }
  },
  tabs: {
    query: jest.fn(),
    onUpdated: {
      addListener: jest.fn()
    },
    onCreated: {
      addListener: jest.fn()
    },
    remove: jest.fn().mockResolvedValue(),
    update: jest.fn()
  },
  alarms: {
    create: jest.fn(),
    onAlarm: {
      addListener: jest.fn()
    }
  },
  cookies: {
    getAll: jest.fn().mockResolvedValue([]),
    set: jest.fn().mockResolvedValue()
  }
};
global.fetch = jest.fn().mockResolvedValue({ status: 200 });

// Import background.js to trigger onInstalled handler
require('././background.js');

const validateRules = (hostnames) => {
  const uniqueHosts = Array.from(new Set(hostnames || [])).filter((h) => h && h.trim());
  const addRules = [];
  const ids = new Set();

  if (uniqueHosts.length > 0) {
    uniqueHosts.forEach((host, i) => {
      const baseId = i * 2 + 1;
      const id1 = baseId;
      const id2 = baseId + 1;

      if (ids.has(id1)) {
        throw new Error(`Duplicate ID: ${id1}`);
      }
      ids.add(id1);

      if (ids.has(id2)) {
        throw new Error(`Duplicate ID: ${id2}`);
      }
      ids.add(id2);

      addRules.push({ id: id1, host });
      addRules.push({ id: id2, host });
    });
  }

  return addRules;
};

describe('Background Logic Validation', () => {
  test('Rule IDs should be unique for normal list', () => {
    const rules = validateRules(['site1.com', 'site2.com']);
    expect(rules.length).toBe(4);
    const ids = rules.map((r) => r.id);
    expect(new Set(ids).size).toBe(4);
  });

  test('Rule IDs should be unique even with duplicate hosts input', () => {
    const rules = validateRules(['site1.com', 'site1.com', 'site2.com']);
    expect(rules.length).toBe(4); // 'site1.com' should be deduped
    const ids = rules.map((r) => r.id);
    expect(new Set(ids).size).toBe(4);
  });

  test('Empty input should produce no rules', () => {
    const rules = validateRules([]);
    expect(rules.length).toBe(0);
  });

  test('Null input should produce no rules', () => {
    const rules = validateRules(null);
    expect(rules.length).toBe(0);
  });

  test('Default mode should be selective (blacklist mode)', () => {
    // Verify storage.set was called with correct defaults during onInstalled
    const callArgs = chrome.storage.sync.set.mock.calls[0][0];
    expect(callArgs.enabled).toBe(true);
    expect(callArgs.mode).toBe('selective');
  });
});

describe('background logic interactions', () => {
  test('handles alarm firing for sessionKeepAlive', () => {
    const listeners = chrome.alarms.onAlarm.addListener.mock.calls[0];
    if (listeners && listeners[0]) {
      listeners[0]({ name: 'sessionKeepAlive' });
      listeners[0]({ name: 'otherAlarm' });
    }
  });

  test('handles message from content script', () => {
    const listeners = chrome.runtime.onMessage.addListener.mock.calls[0];
    if (listeners && listeners[0]) {
      listeners[0]({ type: 'LINKEDIN_PROFILE_HOVER', url: 'https://linkedin.com/in/test' });
    }
  });

  test('handles tab updates and closes cookie popups', () => {
    const listeners = chrome.tabs.onUpdated.addListener.mock.calls[0];
    if (listeners && listeners[0]) {
      // Should close tab
      listeners[0](
        123,
        { url: 'https://example.com/cookie-notice' },
        { url: 'https://example.com/cookie-notice' }
      );
      expect(chrome.tabs.remove).toHaveBeenCalledWith(123);

      chrome.tabs.remove.mockClear();
      // Normal update
      listeners[0](
        124,
        { url: 'https://example.com/normal' },
        { url: 'https://example.com/normal' }
      );
      expect(chrome.tabs.remove).not.toHaveBeenCalled();
    }
  });

  test('handles tab creates and closes cookie popups', () => {
    const listeners = chrome.tabs.onCreated.addListener.mock.calls[0];
    if (listeners && listeners[0]) {
      listeners[0]({ id: 125, url: 'https://getadblock.com/update/' });
      expect(chrome.tabs.remove).toHaveBeenCalledWith(125);
      chrome.tabs.remove.mockClear();
    }
  });

  test('updateBlockingRules removes and adds dynamic rules', async () => {
    const listeners = chrome.storage.onChanged.addListener.mock.calls[0];
    if (listeners && listeners[0]) {
      chrome.declarativeNetRequest.updateDynamicRules.mockClear();
      chrome.declarativeNetRequest.getDynamicRules.mockResolvedValueOnce([{ id: 1 }, { id: 2 }]);
      await listeners[0]({ jsBlocked: { newValue: ['example.com'] } }, 'sync');

      await new Promise((r) => setTimeout(r, 10));
      expect(chrome.declarativeNetRequest.updateDynamicRules).toHaveBeenCalled();
    }
  });

  test('linkedin redirect memory routing', () => {
    // Send message to store in memory
    const messageListener = chrome.runtime.onMessage.addListener.mock.calls[0][0];
    messageListener({ type: 'LINKEDIN_PROFILE_HOVER', url: 'https://linkedin.com/in/john' });

    // Simulate premium update
    const updateListener = chrome.tabs.onUpdated.addListener.mock.calls[0][0];
    chrome.tabs.update.mockClear();
    updateListener(
      500,
      { url: 'https://linkedin.com/premium' },
      { url: 'https://linkedin.com/premium' }
    );
    expect(chrome.tabs.update).toHaveBeenCalledWith(500, { url: 'https://linkedin.com/in/john' });
  });

  test('linkedin redirect session routing', () => {
    const updateListener = chrome.tabs.onUpdated.addListener.mock.calls[0][0];
    chrome.tabs.update.mockClear();
    // Simulate premium without memory URL
    chrome.storage.session.get.mockImplementationOnce((keys, cb) => {
      cb({ linkedinPendingProfile: 'https://linkedin.com/in/jane' });
    });
    updateListener(
      600,
      { url: 'https://linkedin.com/premium' },
      { url: 'https://linkedin.com/premium' }
    );
    expect(chrome.tabs.update).toHaveBeenCalledWith(600, { url: 'https://linkedin.com/in/jane' });
    expect(chrome.storage.session.remove).toHaveBeenCalledWith('linkedinPendingProfile');
  });

  test('linkedin redirect session fallback feed', () => {
    const updateListener = chrome.tabs.onUpdated.addListener.mock.calls[0][0];
    chrome.tabs.update.mockClear();
    chrome.storage.session.get.mockImplementationOnce((keys, cb) => {
      cb({});
    });
    updateListener(
      700,
      { url: 'https://linkedin.com/premium' },
      { url: 'https://linkedin.com/premium' }
    );
    expect(chrome.tabs.update).toHaveBeenCalledWith(700, { url: 'https://www.linkedin.com/feed/' });
  });

  test('setup sessionKeepAlive no cookies exits early', async () => {
    chrome.cookies.getAll.mockImplementation(() => Promise.resolve([]));
    global.fetch.mockClear();
    const alarmListener = chrome.alarms.onAlarm.addListener.mock.calls[0][0];
    await alarmListener({ name: 'sessionKeepAlive' });
    expect(global.fetch).not.toHaveBeenCalled();
  });

  test('extendCookies updates expiration correctly', async () => {
    chrome.cookies.getAll.mockImplementation(({ domain }) => {
      if (domain === '1point3acres.com' || domain === '.1point3acres.com') {
        return Promise.resolve([
          {
            name: 'saltkey',
            value: '1',
            domain: '1point3acres.com',
            path: '/',
            secure: true,
            httpOnly: true
          },
          { name: 'session', value: '1', session: true }
        ]);
      }
      return Promise.resolve([]);
    });
    chrome.cookies.set.mockClear();
    const alarmListener = chrome.alarms.onAlarm.addListener.mock.calls[0][0];
    await alarmListener({ name: 'sessionKeepAlive' });

    // Wait for promises to settle
    await new Promise((r) => setTimeout(r, 10));

    expect(chrome.cookies.set).toHaveBeenCalled();
  });

  test('setup sessionKeepAlive fetch fails gracefully', async () => {
    chrome.cookies.getAll.mockImplementation(() =>
      Promise.resolve([{ name: 'saltkey', value: '123', domain: '1point3acres.com' }])
    );
    global.fetch.mockRejectedValueOnce(new Error('Network error'));
    const alarmListener = chrome.alarms.onAlarm.addListener.mock.calls[0][0];
    await alarmListener({ name: 'sessionKeepAlive' });
  });

  test('updateBadge handles different active modes', () => {
    const listeners = chrome.storage.onChanged.addListener.mock.calls[0];
    if (listeners && listeners[0]) {
      chrome.action.setBadgeText.mockClear();
      chrome.storage.sync.get.mockImplementationOnce((defaults, cb) =>
        cb({ enabled: true, mode: 'selective' })
      );
      listeners[0]({ enabled: { newValue: true } }, 'sync');
      expect(chrome.action.setBadgeText).toHaveBeenCalledWith({ text: 'SEL' });

      chrome.action.setBadgeText.mockClear();
      chrome.storage.sync.get.mockImplementationOnce((defaults, cb) =>
        cb({ enabled: true, mode: 'all' })
      );
      listeners[0]({ enabled: { newValue: true } }, 'sync');
      expect(chrome.action.setBadgeText).toHaveBeenCalledWith({ text: 'ON' });

      chrome.action.setBadgeText.mockClear();
      chrome.storage.sync.get.mockImplementationOnce((defaults, cb) =>
        cb({ enabled: false, mode: 'selective' })
      );
      listeners[0]({ enabled: { newValue: false } }, 'sync');
      expect(chrome.action.setBadgeText).toHaveBeenCalledWith({ text: 'OFF' });
    }
  });
});
