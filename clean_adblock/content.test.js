const fs = require('fs');
const path = require('path');

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
      runtime: { id: 'test-id' }
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
});
