const fs = require('./fs');
const path = require('./path');

describe('Clean AdBlock Content Script', () => {
  const contentScriptPath = path.resolve(__dirname, './content.js');

  beforeEach(() => {
    // Clear the chrome global and other state
    global.chrome = undefined;
    document.body.innerHTML = '<body><div id="ad-popup">Please disable adblock</div></body>';
    jest.clearAllMocks();
  });

  function loadContentScript() {
    const code = fs.readFileSync(contentScriptPath, 'utf8');
    eval(code);
  }

  test('should not crash when chrome is undefined', () => {
    global.chrome = undefined;
    expect(() => loadContentScript()).not.toThrow();
  });

  test('should not crash when chrome.storage is missing', () => {
    global.chrome = {
      runtime: {
        id: 'test-id',
        onMessage: { addListener: jest.fn() }
      }
    };
    expect(() => loadContentScript()).not.toThrow();
  });

  test('should not crash when chrome.runtime is missing', () => {
    global.chrome = {
      storage: { sync: {}, local: {} }
    };
    expect(() => loadContentScript()).not.toThrow();
  });

  test('should call storage.sync.get when context is valid', () => {
    const mockSyncGet = jest.fn();
    const mockLocalGet = jest.fn();
    global.chrome = {
      runtime: {
        id: 'test-id',
        onMessage: { addListener: jest.fn() }
      },
      storage: {
        sync: { get: mockSyncGet },
        local: { get: mockLocalGet }
      }
    };

    loadContentScript();

    expect(mockSyncGet).toHaveBeenCalled();
  });

  test('should inject CSS on gurufocus.com and restore scrolling if elements exist', () => {
    const originalLocation = window.location;
    delete window.location;
    window.location = new URL('https://www.gurufocus.com');

    document.body.innerHTML = `
      <div class="el-dialog__wrapper gf"></div>
      <div class="v-modal"></div>
    `;

    global.chrome = {
      runtime: {
        id: 'test-id',
        onMessage: { addListener: jest.fn() }
      },
      storage: {
        sync: {
          get: jest.fn((keys, cb) => cb({ enabled: true, mode: 'all' }))
        },
        local: {
          get: jest.fn((keys, cb) => cb({}))
        }
      }
    };

    loadContentScript();

    const styleEl = document.getElementById('gurufocus-fix');
    expect(styleEl).not.toBeNull();
    expect(styleEl.textContent).toContain('.el-dialog__wrapper.gf');
    expect(styleEl.textContent).toContain('.v-modal');
    expect(styleEl.textContent).toContain('.paywall-shadow');
    expect(styleEl.textContent).toContain('.paywall-node');
    expect(styleEl.textContent).toContain('html:has(.el-dialog__wrapper)');
    expect(styleEl.textContent).toContain('body:has(.v-modal)');
    expect(styleEl.textContent).toContain('html:has(.paywall-shadow)');
    expect(styleEl.textContent).toContain('overflow: auto !important');

    // Restore original location
    window.location = originalLocation;
  });
});
