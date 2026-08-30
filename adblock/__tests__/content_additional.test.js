describe('Additional content.js coverage', () => {
  const contentScriptPath = require('path').resolve(__dirname, '../content.js');
  const { instrumentFile } = require('./helpers/instrument');

  function loadScript() {
    const code = instrumentFile(contentScriptPath);
    eval(code);
  }

  beforeEach(() => {
    document.body.innerHTML = '';
    delete window.location;
    window.location = new URL('https://example.com/');
    jest.resetModules();
    jest.clearAllMocks();
    global.chrome = {
      storage: {
        sync: { get: jest.fn((keys, cb) => cb({ enabled: true })) },
        local: { get: jest.fn((keys, cb) => cb({ customSelectors: {} })) }
      },
      runtime: { id: 'test', onMessage: { addListener: jest.fn() } }
    };
  });

  test('covers shadowRoot traversal', () => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    const shadow = host.attachShadow({ mode: 'open' });
    const shadowChild = document.createElement('div');
    shadowChild.textContent = 'detected adblock';
    shadow.appendChild(shadowChild);

    loadScript();

    const event = document.createEvent('Event');
    event.initEvent('DOMContentLoaded', true, true);
    document.dispatchEvent(event);
  });

  test('covers isAdmiralLink decodeURIComponent failure and invalid links', () => {
    const a = document.createElement('a');
    a.href = 'https://example.com/%FF';
    document.body.appendChild(a);

    const a2 = document.createElement('a');
    a2.href = 'https://example.com/admiral';
    document.body.appendChild(a2);

    loadScript();

    const event = document.createEvent('Event');
    event.initEvent('DOMContentLoaded', true, true);
    document.dispatchEvent(event);

    expect(a.style.display).not.toBe('none');
  });

  test('covers shouldSkipHost branches', () => {
    global.chrome.storage.sync.get.mockImplementationOnce((keys, cb) =>
      cb({ enabled: true, whitelist: ['example.com'] })
    );
    loadScript();

    jest.isolateModules(() => {
      document.body.innerHTML = '';
      global.chrome.storage.sync.get = jest.fn((keys, cb) =>
        cb({ enabled: true, mode: 'selective', blacklist: ['other.com'] })
      );
      const { instrumentFile } = require('./helpers/instrument');
      const code = instrumentFile(contentScriptPath);
      eval(code);
    });

    jest.isolateModules(() => {
      document.body.innerHTML = '';
      global.chrome.storage.sync.get = jest.fn((keys, cb) => cb({ enabled: false }));
      const { instrumentFile } = require('./helpers/instrument');
      const code = instrumentFile(contentScriptPath);
      eval(code);
    });
  });

  test('covers custom selector try/catch', () => {
    global.chrome.storage.local.get.mockImplementation((keys, cb) =>
      cb({
        customSelectors: {
          'example.com': [':invalid(']
        }
      })
    );

    loadScript();
    const event = document.createEvent('Event');
    event.initEvent('DOMContentLoaded', true, true);
    document.dispatchEvent(event);
  });

  test('covers syncStorage missing or missing document body', () => {
    document.documentElement.removeChild(document.body);
    loadScript();

    document.documentElement.appendChild(document.createElement('body'));
    global.chrome.storage.sync = null;
    loadScript();
  });

  test('covers local storage failure modes', () => {
    global.chrome.storage.local = null;
    loadScript();

    global.chrome.storage.local = { get: jest.fn((keys, cb) => cb({ customSelectors: {} })) };
    global.chrome.runtime.id = undefined;
    loadScript();

    global.chrome.runtime.id = 'test';
    global.chrome.runtime.lastError = { message: 'error' };
    loadScript();

    global.chrome.runtime.lastError = undefined;
    global.chrome.storage.local.get.mockImplementation((keys, cb) => {
      throw new Error('sync access failed');
    });
    loadScript();
  });
});

describe('Even more content.js coverage', () => {
  const contentScriptPath = require('path').resolve(__dirname, '../content.js');
  const { instrumentFile } = require('./helpers/instrument');

  function loadScript() {
    const code = instrumentFile(contentScriptPath);
    eval(code);
  }

  beforeEach(() => {
    document.body.innerHTML = '';
    delete window.location;
    window.location = new URL('https://example.com/');
    jest.resetModules();
    jest.clearAllMocks();
    global.chrome = {
      storage: {
        sync: { get: jest.fn((keys, cb) => cb({ enabled: true })) },
        local: { get: jest.fn((keys, cb) => cb({ customSelectors: {} })) }
      },
      runtime: { id: 'test', onMessage: { addListener: jest.fn() } }
    };
  });

  test('covers sync callback missing context and throwing', () => {
    // throw in callback
    global.chrome.storage.sync.get.mockImplementation((keys, cb) => {
      throw new Error('sync err');
    });
    loadScript();

    // Context invalid in callback
    global.chrome.storage.sync.get.mockImplementation((keys, cb) => {
      global.chrome.runtime.id = undefined;
      cb({ enabled: true });
    });
    loadScript();
  });

  test('covers throttle run timeout and message listener', () => {
    jest.useFakeTimers();

    loadScript();

    const event = document.createEvent('Event');
    event.initEvent('DOMContentLoaded', true, true);
    document.dispatchEvent(event);

    // Trigger mutation to hit runThrottled block
    document.body.appendChild(document.createElement('div'));
    document.body.appendChild(document.createElement('div'));

    jest.advanceTimersByTime(1000);

    // Mock chrome disabled for onMessage
    global.chrome.runtime.id = undefined;
    const listeners = global.chrome.runtime.onMessage.addListener.mock.calls;
    if (listeners.length > 0) {
      listeners[0][0]({ action: 'scan' }, {}, jest.fn());
    }

    jest.useRealTimers();
  });
});
