/**
 * Tests for background.js
 */
const fs = require('fs');
const path = require('path');

describe('Tianditu Background', () => {
  beforeEach(() => {
    global.chrome = {
      runtime: {
        onInstalled: { addListener: jest.fn() },
        onMessage: { addListener: jest.fn() },
        onMessageExternal: { addListener: jest.fn() },
        getURL: jest.fn((url) => 'chrome-extension://id/' + url),
        onStartup: { addListener: jest.fn() }
      },
      storage: {
        local: {
          get: jest.fn((keys, cb) => cb({ tdt_key_pool: [] })),
          set: jest.fn()
        }
      },
      declarativeNetRequest: {
        getDynamicRules: jest.fn(() => Promise.resolve([])),
        updateDynamicRules: jest.fn(() => Promise.resolve()),
        onRuleMatchedDebug: { addListener: jest.fn() }
      },
      alarms: {
        create: jest.fn(),
        onAlarm: { addListener: jest.fn() }
      },
      offscreen: {
        createDocument: jest.fn(() => Promise.resolve()),
        hasDocument: jest.fn(() => Promise.resolve(false)),
        closeDocument: jest.fn()
      },
      proxy: {
        onProxyError: { addListener: jest.fn() },
        settings: { set: jest.fn(), get: jest.fn() }
      },
      webRequest: {
        onBeforeRequest: { addListener: jest.fn() },
        onBeforeSendHeaders: { addListener: jest.fn() }
      },
      cookies: {
        getAll: jest.fn((opts, cb) => cb([])),
        remove: jest.fn()
      },
      action: {
        setBadgeText: jest.fn(),
        setBadgeBackgroundColor: jest.fn()
      }
    };

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        text: () => Promise.resolve('{"code":200}')
      })
    );
  });

  test('should initialize listeners', () => {
    const scriptContent = fs.readFileSync(path.join(__dirname, 'background.js'), 'utf8');
    eval(scriptContent);
    expect(chrome.runtime.onInstalled.addListener).toHaveBeenCalled();
  });
});
