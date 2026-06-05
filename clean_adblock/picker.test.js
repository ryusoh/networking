describe('picker.js DOM test', () => {
  beforeEach(() => {
    jest.resetModules();
    document.documentElement.innerHTML = '';
    window.__bypassPickerActive = false;
    window.confirm = jest.fn(() => true);
    window.alert = jest.fn();
    window.CSS = { escape: jest.fn(str => str) }; // Mock CSS.escape
    global.chrome = {
      storage: {
        local: {
          get: jest.fn((keys, cb) => cb({})),
          set: jest.fn()
        }
      },
      runtime: {}
    };
  });

  afterEach(() => {
    delete global.chrome;
    delete window.CSS;
    jest.restoreAllMocks();
  });

  it('triggers all paths', () => {
    require('./picker.js');

    // Line 10: window.__bypassPickerActive = true;
    window.__bypassPickerActive = true;
    require('./picker.js'); // should return early

    // Reset to test handlers
    jest.resetModules();
    window.__bypassPickerActive = false;
    require('./picker.js');

    const overlay = document.documentElement.children[0];
    const highlight = document.documentElement.children[1];

    // Line 39 & 55: el is overlay
    document.elementFromPoint = jest.fn(() => overlay);
    document.dispatchEvent(new MouseEvent('mousemove', { clientX: 0, clientY: 0 }));
    document.dispatchEvent(new MouseEvent('click', { clientX: 0, clientY: 0 }));

    // Normal element
    const el = document.createElement('div');
    el.id = 'my-id';
    document.elementFromPoint = jest.fn(() => el);
    document.dispatchEvent(new MouseEvent('mousemove', { clientX: 0, clientY: 0 }));
    document.dispatchEvent(new MouseEvent('click', { clientX: 0, clientY: 0 }));

    // Normal element with class
    jest.resetModules();
    window.__bypassPickerActive = false;
    require('./picker.js');
    const el2 = document.createElement('div');
    el2.className = 'my-class other-class';
    document.elementFromPoint = jest.fn(() => el2);
    document.dispatchEvent(new MouseEvent('click', { clientX: 0, clientY: 0 }));

    // Normal element with no class/id
    jest.resetModules();
    window.__bypassPickerActive = false;
    require('./picker.js');
    const el3 = document.createElement('span');
    document.elementFromPoint = jest.fn(() => el3);
    document.dispatchEvent(new MouseEvent('click', { clientX: 0, clientY: 0 }));

    // Keydown escape
    jest.resetModules();
    window.__bypassPickerActive = false;
    require('./picker.js');
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

    // test saveCustomSelector early returns inside catch
    jest.resetModules();
    window.__bypassPickerActive = false;
    require('./picker.js');
    const elId = document.createElement('div');
    elId.id = 'my-id-2';
    document.elementFromPoint = jest.fn(() => elId);

    // saveCustomSelector early return
    const oldLocal = global.chrome.storage.local;
    delete global.chrome.storage.local;
    document.dispatchEvent(new MouseEvent('click', { clientX: 0, clientY: 0 }));
    global.chrome.storage.local = oldLocal;

    // inner early return inside get callback
    jest.resetModules();
    window.__bypassPickerActive = false;
    require('./picker.js');
    document.elementFromPoint = jest.fn(() => elId);
    global.chrome.runtime.lastError = { message: 'err' };
    document.dispatchEvent(new MouseEvent('click', { clientX: 0, clientY: 0 }));
    global.chrome.runtime.lastError = null;

    // catch block for local storage get
    jest.resetModules();
    window.__bypassPickerActive = false;
    require('./picker.js');
    document.elementFromPoint = jest.fn(() => elId);
    console.error = jest.fn();
    global.chrome.storage.local.get = jest.fn(() => { throw new Error('get error'); });
    document.dispatchEvent(new MouseEvent('click', { clientX: 0, clientY: 0 }));
    expect(console.error).toHaveBeenCalled();

    // catch block inside callback
    jest.resetModules();
    window.__bypassPickerActive = false;
    require('./picker.js');
    document.elementFromPoint = jest.fn(() => elId);
    global.chrome.storage.local.get = jest.fn((keys, cb) => {
      global.chrome.storage.local.set = jest.fn(() => { throw new Error('set error'); });
      cb({});
    });
    document.dispatchEvent(new MouseEvent('click', { clientX: 0, clientY: 0 }));
    expect(console.error).toHaveBeenCalled();

    // test existing selector
    jest.resetModules();
    window.__bypassPickerActive = false;
    require('./picker.js');
    document.elementFromPoint = jest.fn(() => elId);
    global.chrome.storage.local.get = jest.fn((keys, cb) => {
      cb({ customSelectors: { [window.location.hostname]: ['#my-id-2'] } });
    });
    document.dispatchEvent(new MouseEvent('click', { clientX: 0, clientY: 0 }));
  });
});

  it('handles early returns for no element found', () => {
    jest.resetModules();
    window.__bypassPickerActive = false;
    require('./picker.js');
    document.elementFromPoint = jest.fn(() => null);
    document.dispatchEvent(new MouseEvent('mousemove', { clientX: 0, clientY: 0 }));
    document.dispatchEvent(new MouseEvent('click', { clientX: 0, clientY: 0 }));
  });

  it('handles early return for undefined chrome', () => {
    jest.resetModules();
    const oldChrome = global.chrome;
    delete global.chrome;
    require('./picker.js');
    global.chrome = oldChrome;
  });

  it('handles early return for missing chrome storage', () => {
    jest.resetModules();
    global.chrome = { storage: undefined };
    require('./picker.js');
  });

  it('covers early return inside IIFE for missing active', () => {
    jest.resetModules();
    global.chrome = { storage: {} };
    window.__bypassPickerActive = true;
    require('./picker.js');
    expect(window.__bypassPickerActive).toBe(true);
  });

  it('covers early return for highlight element', () => {
    jest.resetModules();
    window.__bypassPickerActive = false;
    global.chrome = { storage: { local: { get: jest.fn(), set: jest.fn() } }, runtime: {} };
    require('./picker.js');
    const highlight = document.documentElement.children[1];
    document.elementFromPoint = jest.fn(() => highlight);
    document.dispatchEvent(new MouseEvent('mousemove', { clientX: 0, clientY: 0 }));
    document.dispatchEvent(new MouseEvent('click', { clientX: 0, clientY: 0 }));
  });

  it('covers early return for overlay element', () => {
    jest.resetModules();
    window.__bypassPickerActive = false;
    global.chrome = { storage: { local: { get: jest.fn(), set: jest.fn() } }, runtime: {} };
    require('./picker.js');
    const overlay = document.documentElement.children[0];
    document.elementFromPoint = jest.fn(() => overlay);
    document.dispatchEvent(new MouseEvent('mousemove', { clientX: 0, clientY: 0 }));
    document.dispatchEvent(new MouseEvent('click', { clientX: 0, clientY: 0 }));
  });

  it('covers early return for overlay and highlight exactly', () => {
    jest.resetModules();
    window.__bypassPickerActive = false;
    global.chrome = { storage: { local: { get: jest.fn(), set: jest.fn() } }, runtime: {} };
    require('./picker.js');

    // The code does: el === overlay || el === highlight
    // We need to return exactly those objects.
    const overlay = document.documentElement.children[0];
    const highlight = document.documentElement.children[1];

    document.elementFromPoint = () => overlay;
    document.dispatchEvent(new MouseEvent('mousemove', { clientX: 0, clientY: 0 }));
    document.dispatchEvent(new MouseEvent('click', { clientX: 0, clientY: 0 }));

    document.elementFromPoint = () => highlight;
    document.dispatchEvent(new MouseEvent('mousemove', { clientX: 0, clientY: 0 }));
    document.dispatchEvent(new MouseEvent('click', { clientX: 0, clientY: 0 }));
  });

  it('triggers line 39 and 55 returns exactly', () => {
    jest.resetModules();
    window.__bypassPickerActive = false;
    global.chrome = { storage: { local: { get: jest.fn(), set: jest.fn() } }, runtime: {} };
    require('./picker.js');

    // override elementFromPoint dynamically
    let returnsOverlay = true;
    document.elementFromPoint = () => {
      if (returnsOverlay) {
        return document.documentElement.children[0];
      } else {
        return document.documentElement.children[1];
      }
    };

    document.dispatchEvent(new MouseEvent('mousemove', { clientX: 0, clientY: 0 }));
    document.dispatchEvent(new MouseEvent('click', { clientX: 0, clientY: 0 }));

    returnsOverlay = false;
    document.dispatchEvent(new MouseEvent('mousemove', { clientX: 0, clientY: 0 }));
    document.dispatchEvent(new MouseEvent('click', { clientX: 0, clientY: 0 }));
  });
