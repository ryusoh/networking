/**
 * Tests for offscreen.js
 */
const fs = require('fs');
const path = require('path');

describe('Tianditu Offscreen', () => {
  beforeEach(() => {
    global.chrome = {
      runtime: {
        onMessage: { addListener: jest.fn() },
        sendMessage: jest.fn()
      }
    };

    // Mock navigator.userAgent
    Object.defineProperty(global.navigator, 'userAgent', {
      value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      configurable: true
    });
  });

  test('should initialize and register listeners', () => {
    const scriptContent = fs.readFileSync(path.join(__dirname, 'offscreen.js'), 'utf8');
    eval(scriptContent);
    expect(chrome.runtime.onMessage.addListener).toHaveBeenCalled();
  });
});
