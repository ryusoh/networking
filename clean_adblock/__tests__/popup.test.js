describe('popup.js button setup', () => {
  it('sets button states', () => {
    document.body.innerHTML = `
          <input type="checkbox" id="enabled" />
          <select id="mode">
            <option value="selective">Selective</option>
            <option value="all">All</option>
          </select>
          <input type="checkbox" id="feature-cookieBanner" />
          <input type="checkbox" id="feature-socialMedia" />
          <input type="checkbox" id="feature-youtube" />
          <input type="checkbox" id="feature-videoStream" />
          <input type="checkbox" id="feature-twitch" />
          <input type="checkbox" id="feature-forum" />
          <button id="addWhitelist"></button>
          <button id="addBlacklist"></button>
          <button id="addJsBlock"></button>
          <button id="scan"></button>
          <button id="picker"></button>
        `;

    global.chrome = {
      storage: {
        sync: {
          get: jest.fn((keys, cb) => {
            cb({ blacklist: ['example.com'], jsBlocked: ['example.com'] });
          }),
          set: jest.fn()
        }
      },
      tabs: { query: jest.fn((q, cb) => cb([{ id: 1, url: 'http://example.com' }])) },
      runtime: { lastError: null }
    };
    require('../popup.js');
    document.dispatchEvent(new Event('DOMContentLoaded'));
  });
});

describe('popup.js button setup more', () => {
  it('sets button states without features object in storage get', () => {
    document.body.innerHTML = `
          <input type="checkbox" id="enabled" />
          <select id="mode">
            <option value="selective">Selective</option>
            <option value="all">All</option>
          </select>
          <input type="checkbox" id="feature-cookieBanner" />
          <input type="checkbox" id="feature-socialMedia" />
          <input type="checkbox" id="feature-youtube" />
          <input type="checkbox" id="feature-videoStream" />
          <input type="checkbox" id="feature-twitch" />
          <input type="checkbox" id="feature-forum" />
          <button id="addWhitelist"></button>
          <button id="addBlacklist"></button>
          <button id="addJsBlock"></button>
          <button id="scan"></button>
          <button id="picker"></button>
        `;

    global.chrome = {
      storage: {
        sync: {
          get: jest.fn((keys, cb) => {
            cb({}); // Empty so missing features object triggers line 89 logic inside toggle
          }),
          set: jest.fn()
        }
      },
      tabs: { query: jest.fn((q, cb) => cb([{ id: 1, url: 'http://example.com' }])) },
      runtime: { lastError: null }
    };
    require('../popup.js');
    document.dispatchEvent(new Event('DOMContentLoaded'));
    const toggle = document.getElementById('feature-cookieBanner');
    toggle.dispatchEvent(new Event('change'));
  });
});

describe('popup.js', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <input type="checkbox" id="enabled" />
      <select id="mode">
        <option value="selective">Selective</option>
        <option value="all">All</option>
      </select>
      <input type="checkbox" id="feature-cookieBanner" />
      <input type="checkbox" id="feature-socialMedia" />
      <input type="checkbox" id="feature-youtube" />
      <input type="checkbox" id="feature-videoStream" />
      <input type="checkbox" id="feature-twitch" />
      <input type="checkbox" id="feature-forum" />
      <button id="addWhitelist"></button>
      <button id="addBlacklist"></button>
      <button id="addJsBlock"></button>
      <button id="scan"></button>
      <button id="picker"></button>
    `;
    global.chrome = {
      storage: {
        sync: {
          get: jest.fn((keys, cb) => {
            if (Array.isArray(keys) && keys[0] === 'features') {
              cb({ features: { cookieBannerBlocker: true } });
            } else if (Array.isArray(keys) && keys[0] === 'whitelist') {
              cb({ whitelist: ['example.com'] });
            } else {
              cb({ enabled: true, mode: 'selective', features: {} });
            }
          }),
          set: jest.fn((data, cb) => {
            if (cb) {
              cb();
            }
          })
        }
      },
      tabs: {
        query: jest.fn((query, cb) => cb([{ id: 1, url: 'https://example.com' }])),
        sendMessage: jest.fn((id, msg, cb) => cb())
      },
      scripting: {
        executeScript: jest.fn()
      },
      runtime: {
        lastError: null
      }
    };
    window.alert = jest.fn();
    window.close = jest.fn();
  });

  afterEach(() => {
    jest.resetModules();
  });

  it('handles empty query', () => {
    global.chrome.tabs.query = jest.fn((query, cb) => cb([]));
    require('../popup.js');
    document.dispatchEvent(new Event('DOMContentLoaded'));
  });

  it('handles empty query on click', () => {
    require('../popup.js');
    document.dispatchEvent(new Event('DOMContentLoaded'));
    global.chrome.tabs.query = jest.fn((query, cb) => cb([]));

    const addWhitelist = document.getElementById('addWhitelist');
    addWhitelist.dispatchEvent(new MouseEvent('click'));
  });

  it('handles invalid url query', () => {
    global.chrome.tabs.query = jest.fn((query, cb) => cb([{ url: 'invalid://url' }]));
    require('../popup.js');
    document.dispatchEvent(new Event('DOMContentLoaded'));
  });

  it('handles invalid url query on click', () => {
    require('../popup.js');
    document.dispatchEvent(new Event('DOMContentLoaded'));
    global.chrome.tabs.query = jest.fn((query, cb) => cb([{ url: 'invalid://url' }]));

    const addWhitelist = document.getElementById('addWhitelist');
    addWhitelist.dispatchEvent(new MouseEvent('click'));
  });

  it('handles exception in setup', () => {
    global.chrome.storage.sync.get = () => {
      throw new Error('Test');
    };
    require('../popup.js');
    document.dispatchEvent(new Event('DOMContentLoaded'));
  });

  it('handles no chrome object', () => {
    delete global.chrome;
    require('../popup.js');
    document.dispatchEvent(new Event('DOMContentLoaded'));
  });

  it('handles toggle changes with error', () => {
    global.chrome.storage.sync.set = () => {
      throw new Error('Test');
    };
    require('../popup.js');
    document.dispatchEvent(new Event('DOMContentLoaded'));

    const enabled = document.getElementById('enabled');
    enabled.checked = false;
    enabled.dispatchEvent(new Event('change'));

    const mode = document.getElementById('mode');
    mode.value = 'all';
    mode.dispatchEvent(new Event('change'));
  });

  it('handles toggle changes', () => {
    require('../popup.js');
    document.dispatchEvent(new Event('DOMContentLoaded'));

    const enabled = document.getElementById('enabled');
    enabled.checked = false;
    enabled.dispatchEvent(new Event('change'));
    expect(chrome.storage.sync.set).toHaveBeenCalledWith({ enabled: false });

    const mode = document.getElementById('mode');
    mode.value = 'all';
    mode.dispatchEvent(new Event('change'));
    expect(chrome.storage.sync.set).toHaveBeenCalledWith({ mode: 'all' });
  });

  it('handles feature changes', () => {
    require('../popup.js');
    document.dispatchEvent(new Event('DOMContentLoaded'));

    const cookieBanner = document.getElementById('feature-cookieBanner');
    cookieBanner.checked = false;
    cookieBanner.dispatchEvent(new Event('change'));

    expect(chrome.storage.sync.get).toHaveBeenCalledWith(['features'], expect.any(Function));
    expect(chrome.storage.sync.set).toHaveBeenCalled();
  });

  it('handles feature changes with error', () => {
    require('../popup.js');
    document.dispatchEvent(new Event('DOMContentLoaded'));

    global.chrome.storage.sync.get = () => {
      throw new Error('Test');
    };

    const cookieBanner = document.getElementById('feature-cookieBanner');
    cookieBanner.checked = false;
    cookieBanner.dispatchEvent(new Event('change'));
  });

  it('handles button clicks error in query', () => {
    global.chrome.tabs.query = () => {
      throw new Error('Test');
    };
    require('../popup.js');
    document.dispatchEvent(new Event('DOMContentLoaded'));
  });

  it('handles button clicks error in query add', () => {
    require('../popup.js');
    document.dispatchEvent(new Event('DOMContentLoaded'));

    global.chrome.tabs.query = () => {
      throw new Error('Test');
    };
    const addWhitelist = document.getElementById('addWhitelist');
    addWhitelist.dispatchEvent(new MouseEvent('click'));
  });

  it('handles button clicks remove', () => {
    require('../popup.js');
    document.dispatchEvent(new Event('DOMContentLoaded'));

    const addWhitelist = document.getElementById('addWhitelist');
    addWhitelist.dispatchEvent(new MouseEvent('click'));
    expect(chrome.tabs.query).toHaveBeenCalled();
    expect(chrome.storage.sync.set).toHaveBeenCalled();
  });

  it('handles button clicks add', () => {
    global.chrome.storage.sync.get = jest.fn((keys, cb) => {
      cb({ whitelist: [] });
    });
    require('../popup.js');
    document.dispatchEvent(new Event('DOMContentLoaded'));

    const addWhitelist = document.getElementById('addWhitelist');
    addWhitelist.dispatchEvent(new MouseEvent('click'));
    expect(chrome.tabs.query).toHaveBeenCalled();
    expect(chrome.storage.sync.set).toHaveBeenCalled();
  });

  it('handles get list error', () => {
    require('../popup.js');
    document.dispatchEvent(new Event('DOMContentLoaded'));

    global.chrome.storage.sync.get = () => {
      throw new Error('Test');
    };
    const addWhitelist = document.getElementById('addWhitelist');
    addWhitelist.dispatchEvent(new MouseEvent('click'));
  });

  it('handles get list setup error', () => {
    global.chrome.storage.sync.get = (keys, cb) => {
      if (Array.isArray(keys) && keys[0] === 'whitelist') {
        throw new Error('Test');
      } else {
        cb({ enabled: true, mode: 'selective', features: {} });
      }
    };
    require('../popup.js');
    document.dispatchEvent(new Event('DOMContentLoaded'));
  });

  it('handles runtime error during setup', () => {
    global.chrome.storage.sync.get = (keys, cb) => {
      global.chrome.runtime.lastError = new Error('Test');
      cb({});
    };
    require('../popup.js');
    document.dispatchEvent(new Event('DOMContentLoaded'));
  });

  it('handles scan click', () => {
    require('../popup.js');
    document.dispatchEvent(new Event('DOMContentLoaded'));

    const scanBtn = document.getElementById('scan');
    scanBtn.dispatchEvent(new MouseEvent('click'));
    expect(chrome.tabs.sendMessage).toHaveBeenCalledWith(
      1,
      { action: 'scan' },
      expect.any(Function)
    );
  });

  it('handles scan error', () => {
    global.chrome.runtime.lastError = new Error('Test');
    require('../popup.js');
    document.dispatchEvent(new Event('DOMContentLoaded'));

    const scanBtn = document.getElementById('scan');
    scanBtn.dispatchEvent(new MouseEvent('click'));
    expect(window.alert).toHaveBeenCalledWith(
      'Error: Could not communicate with page. Please refresh.'
    );
  });

  it('handles picker click', () => {
    require('../popup.js');
    document.dispatchEvent(new Event('DOMContentLoaded'));

    const pickerBtn = document.getElementById('picker');
    pickerBtn.dispatchEvent(new MouseEvent('click'));
    expect(chrome.scripting.executeScript).toHaveBeenCalledWith({
      target: { tabId: 1 },
      files: ['picker.js']
    });
    expect(window.close).toHaveBeenCalled();
  });
});

describe('popup.js specific lines', () => {
  beforeEach(() => {
    document.body.innerHTML = `
          <input type="checkbox" id="enabled" />
          <select id="mode">
            <option value="selective">Selective</option>
            <option value="all">All</option>
          </select>
          <input type="checkbox" id="feature-cookieBanner" />
          <input type="checkbox" id="feature-socialMedia" />
          <input type="checkbox" id="feature-youtube" />
          <input type="checkbox" id="feature-videoStream" />
          <input type="checkbox" id="feature-twitch" />
          <input type="checkbox" id="feature-forum" />
          <button id="addWhitelist"></button>
          <button id="addBlacklist"></button>
          <button id="addJsBlock"></button>
          <button id="scan"></button>
          <button id="picker"></button>
        `;
    global.chrome = {
      storage: {
        sync: {
          get: jest.fn((keys, cb) => {
            cb({ enabled: true, mode: 'selective' });
          }),
          set: jest.fn((data, cb) => {
            if (cb) {
              cb();
            }
          })
        }
      },
      tabs: {
        query: jest.fn((query, cb) => cb([{ id: 1, url: 'https://example.com' }])),
        sendMessage: jest.fn((id, msg, cb) => cb())
      },
      scripting: {
        executeScript: jest.fn()
      },
      runtime: {
        lastError: null
      }
    };
    window.alert = jest.fn();
    window.close = jest.fn();
  });

  afterEach(() => {
    jest.resetModules();
  });

  it('covers missing features object', () => {
    require('../popup.js');
    document.dispatchEvent(new Event('DOMContentLoaded'));
  });

  it('covers initial undefined lists on updateButtonStates', () => {
    require('../popup.js');
    document.dispatchEvent(new Event('DOMContentLoaded'));
  });

  it('covers missing list array on toggle', () => {
    global.chrome.storage.sync.get = jest.fn((keys, cb) => {
      if (Array.isArray(keys) && keys[0] === 'whitelist') {
        cb({}); // whitelist is missing
      } else {
        cb({});
      }
    });
    require('../popup.js');
    document.dispatchEvent(new Event('DOMContentLoaded'));
    const btn = document.getElementById('addWhitelist');
    btn.dispatchEvent(new MouseEvent('click'));
  });

  it('covers error on tab query in updateButtonStates', () => {
    global.chrome.runtime.lastError = new Error('Test');
    require('../popup.js');
    document.dispatchEvent(new Event('DOMContentLoaded'));
  });

  it('covers error on storage get in updateButtonStates', () => {
    global.chrome.storage.sync.get = jest.fn((keys, cb) => {
      if (Array.isArray(keys) && keys[0] === 'whitelist') {
        global.chrome.runtime.lastError = new Error('Test');
        cb({});
      } else {
        cb({});
      }
    });
    require('../popup.js');
    document.dispatchEvent(new Event('DOMContentLoaded'));
  });

  it('covers runtime error on tab query in toggleCurrentIn', () => {
    require('../popup.js');
    document.dispatchEvent(new Event('DOMContentLoaded'));

    global.chrome.runtime.lastError = new Error('Test');
    const btn = document.getElementById('addWhitelist');
    btn.dispatchEvent(new MouseEvent('click'));
  });

  it('covers runtime error on storage get in toggleCurrentIn', () => {
    require('../popup.js');
    document.dispatchEvent(new Event('DOMContentLoaded'));

    global.chrome.storage.sync.get = jest.fn((keys, cb) => {
      if (Array.isArray(keys) && keys[0] === 'whitelist') {
        global.chrome.runtime.lastError = new Error('Test');
        cb({});
      } else {
        cb({});
      }
    });

    const btn = document.getElementById('addWhitelist');
    btn.dispatchEvent(new MouseEvent('click'));
  });
});

describe('popup.js more lines', () => {
  beforeEach(() => {
    document.body.innerHTML = `
          <input type="checkbox" id="enabled" />
          <select id="mode">
            <option value="selective">Selective</option>
            <option value="all">All</option>
          </select>
          <input type="checkbox" id="feature-cookieBanner" />
          <input type="checkbox" id="feature-socialMedia" />
          <input type="checkbox" id="feature-youtube" />
          <input type="checkbox" id="feature-videoStream" />
          <input type="checkbox" id="feature-twitch" />
          <input type="checkbox" id="feature-forum" />
          <button id="addWhitelist"></button>
          <button id="addBlacklist"></button>
          <button id="addJsBlock"></button>
          <button id="scan"></button>
          <button id="picker"></button>
        `;
    global.chrome = {
      storage: {
        sync: {
          get: jest.fn((keys, cb) => {
            cb({ enabled: true, mode: 'selective' });
          }),
          set: jest.fn((data, cb) => {
            if (cb) {
              cb();
            }
          })
        }
      },
      tabs: {
        query: jest.fn((query, cb) => cb([{ id: 1, url: 'https://example.com' }])),
        sendMessage: jest.fn((id, msg, cb) => cb())
      },
      scripting: {
        executeScript: jest.fn()
      },
      runtime: {
        lastError: null
      }
    };
    window.alert = jest.fn();
    window.close = jest.fn();
  });

  afterEach(() => {
    jest.resetModules();
  });

  it('covers missing url in tab query in updateButtonStates', () => {
    global.chrome.tabs.query = jest.fn((query, cb) => cb([{ id: 1 }]));
    require('../popup.js');
    document.dispatchEvent(new Event('DOMContentLoaded'));
  });

  it('covers missing host in toggleCurrentIn', () => {
    require('../popup.js');
    document.dispatchEvent(new Event('DOMContentLoaded'));

    global.chrome.tabs.query = jest.fn((query, cb) => cb([{ id: 1, url: 'invalid:' }]));

    const btn = document.getElementById('addWhitelist');
    btn.dispatchEvent(new MouseEvent('click'));
  });

  it('covers missing host in updateButtonStates', () => {
    global.chrome.tabs.query = jest.fn((query, cb) => cb([{ id: 1, url: 'invalid:' }]));
    require('../popup.js');
    document.dispatchEvent(new Event('DOMContentLoaded'));
  });
});

describe('popup.js very specific line', () => {
  beforeEach(() => {
    document.body.innerHTML = `
          <input type="checkbox" id="enabled" />
          <select id="mode">
            <option value="selective">Selective</option>
            <option value="all">All</option>
          </select>
          <input type="checkbox" id="feature-cookieBanner" />
          <input type="checkbox" id="feature-socialMedia" />
          <input type="checkbox" id="feature-youtube" />
          <input type="checkbox" id="feature-videoStream" />
          <input type="checkbox" id="feature-twitch" />
          <input type="checkbox" id="feature-forum" />
          <button id="addWhitelist"></button>
          <button id="addBlacklist"></button>
          <button id="addJsBlock"></button>
          <button id="scan"></button>
          <button id="picker"></button>
        `;

    global.chrome = {
      storage: {
        sync: {
          get: jest.fn((keys, cb) => cb({})),
          set: jest.fn()
        }
      },
      tabs: { query: jest.fn((q, cb) => cb([{ id: 1, url: 'http://example.com' }])) },
      runtime: { lastError: null }
    };

    window.alert = jest.fn();
    window.close = jest.fn();
  });

  afterEach(() => {
    jest.resetModules();
  });

  it('tests click when button exists but feature array misses toggle', () => {
    // We will remove one toggle
    document.getElementById('feature-cookieBanner').remove();
    require('../popup.js');
    document.dispatchEvent(new Event('DOMContentLoaded'));
  });
});
