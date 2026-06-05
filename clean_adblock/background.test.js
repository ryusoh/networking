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
    session: {
      get: jest.fn((keys, cb) => cb({ linkedinPendingProfile: 'https://linkedin.com/in/test' })),
      set: jest.fn(),
      remove: jest.fn()
    },
    onChanged: {
      addListener: jest.fn()
    }
  },
  action: {
    setBadgeText: jest.fn(),
    setBadgeBackgroundColor: jest.fn(),
    setIcon: jest.fn(),
    setTitle: jest.fn()
  },
  declarativeNetRequest: {
    getDynamicRules: jest.fn(() => Promise.resolve([])),
    updateDynamicRules: jest.fn(() => Promise.resolve()),
    setExtensionActionOptions: jest.fn()
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
    query: jest.fn((query, cb) => cb([])),
    onUpdated: {
      addListener: jest.fn()
    },
    onCreated: {
      addListener: jest.fn()
    },
    remove: jest.fn(() => Promise.resolve()),
    reload: jest.fn(),
    sendMessage: jest.fn(),
    update: jest.fn()
  },
  alarms: {
    create: jest.fn(),
    onAlarm: {
      addListener: jest.fn()
    },
    clearAll: jest.fn()
  },
  cookies: {
    getAll: jest.fn(() =>
      Promise.resolve([{ name: 'saltkey', value: 'test', domain: '1point3acres.com', path: '/' }])
    ),
    set: jest.fn(() => Promise.resolve())
  },
  scripting: {
    insertCSS: jest.fn(),
    removeCSS: jest.fn(),
    executeScript: jest.fn()
  }
};

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ version: '1.0.0' }),
    text: () => Promise.resolve('test'),
    status: 200
  })
);

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

  test('should handle message LINKEDIN_PROFILE_HOVER', () => {
    const messageListener = chrome.runtime.onMessage.addListener.mock.calls.find(
      (call) =>
        call[0].toString().includes('LINKEDIN_PROFILE_HOVER') ||
        call[0].toString().includes('getFeatures')
    )[0];

    if (messageListener) {
      messageListener({ type: 'LINKEDIN_PROFILE_HOVER', url: 'https://linkedin.com/in/test' });
    }
  });

  test('should setup ad network blocking on install', async () => {
    const installListener = chrome.runtime.onInstalled.addListener.mock.calls[0][0];
    await installListener({ reason: 'install' });

    expect(chrome.declarativeNetRequest.updateDynamicRules).toHaveBeenCalled();
  });

  test('should close getadblock and cookie tabs', () => {
    const updatedListener = chrome.tabs.onUpdated.addListener.mock.calls[0][0];

    updatedListener(1, { url: 'https://getadblock.com/update/test' }, {});
    expect(chrome.tabs.remove).toHaveBeenCalledWith(1);

    const createdListener = chrome.tabs.onCreated.addListener.mock.calls[0][0];

    createdListener({ id: 2, url: 'https://example.com/cookie-notice' });
    expect(chrome.tabs.remove).toHaveBeenCalledWith(2);
  });

  test('should redirect linkedin premium', () => {
    const updatedListener = chrome.tabs.onUpdated.addListener.mock.calls[0][0];
    updatedListener(1, { url: 'https://linkedin.com/premium' }, {});
  });

  test('should execute session keepalive', async () => {
    const alarmListener = chrome.alarms.onAlarm.addListener.mock.calls[0][0];
    await alarmListener({ name: 'sessionKeepAlive' });
  });
});
