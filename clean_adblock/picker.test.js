describe('picker.js', () => {
  beforeEach(() => {
    document.documentElement.innerHTML = '';
    window.__bypassPickerActive = false;
    window.alert = jest.fn();
    window.confirm = jest.fn(() => true);

    global.CSS = {
      escape: jest.fn((str) => str)
    };

    global.chrome = {
      storage: {
        local: {
          get: jest.fn((keys, cb) => cb({ customSelectors: {} })),
          set: jest.fn()
        }
      },
      runtime: {}
    };

    delete window.location;
    window.location = new URL('https://example.com');
  });

  afterEach(() => {
    if (window.__bypassPickerActive) {
        document.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Escape' }));
    }
    document.documentElement.innerHTML = '';
    jest.resetModules();
    jest.clearAllMocks();
  });

  it('initializes and cleans up on Escape', () => {
    require('./picker.js');
    expect(window.__bypassPickerActive).toBe(true);
    document.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Escape' }));
    expect(window.__bypassPickerActive).toBe(false);
  });

  it('bails out early if already active', () => {
    window.__bypassPickerActive = true;
    require('./picker.js');
    expect(document.getElementById('adblock-picker-overlay')).toBeNull();
  });

  it('handles mouse move and highlights element', () => {
    require('./picker.js');

    const el = document.createElement('div');
    el.getBoundingClientRect = jest.fn(() => ({ top: 10, left: 20, width: 100, height: 50 }));
    document.documentElement.appendChild(el);

    document.elementFromPoint = jest.fn(() => el);
    document.dispatchEvent(new MouseEvent('mousemove', { clientX: 50, clientY: 50 }));

    const highlight = document.querySelector('div[style*="border: 2px solid red"]');
    expect(highlight).toBeTruthy();
    expect(highlight.style.top).toBe('10px');
    expect(highlight.style.left).toBe('20px');
  });

  it('handles click and saves selector by ID', () => {
    require('./picker.js');

    const el = document.createElement('div');
    el.id = 'test-id';
    document.documentElement.appendChild(el);

    document.elementFromPoint = jest.fn(() => el);
    document.dispatchEvent(new MouseEvent('click', { clientX: 50, clientY: 50 }));

    expect(window.confirm).toHaveBeenCalled();
    expect(global.chrome.storage.local.set).toHaveBeenCalledWith({
      customSelectors: { 'example.com': ['#test-id'] }
    });
    expect(el.style.display).toBe('none');
    expect(window.__bypassPickerActive).toBe(false);
  });

  it('handles click and saves selector by class', () => {
    require('./picker.js');

    const el = document.createElement('div');
    el.className = 'test-class other-class';
    document.documentElement.appendChild(el);

    document.elementFromPoint = jest.fn(() => el);
    document.dispatchEvent(new MouseEvent('click', { clientX: 50, clientY: 50 }));

    expect(window.confirm).toHaveBeenCalled();
    expect(global.chrome.storage.local.set).toHaveBeenCalledWith({
      customSelectors: { 'example.com': ['.test-class'] }
    });
    expect(el.style.display).toBe('none');
  });

  it('handles click and saves selector by tag', () => {
    require('./picker.js');

    const el = document.createElement('span');
    document.documentElement.appendChild(el);

    document.elementFromPoint = jest.fn(() => el);
    document.dispatchEvent(new MouseEvent('click', { clientX: 50, clientY: 50 }));

    expect(window.confirm).toHaveBeenCalled();
    expect(global.chrome.storage.local.set).toHaveBeenCalledWith({
      customSelectors: { 'example.com': ['span'] }
    });
    expect(el.style.display).toBe('none');
  });

  it('does nothing if no chrome.storage', () => {
    delete global.chrome;
    require('./picker.js');
    expect(window.__bypassPickerActive).toBe(false);
  });

  it('bails out for overlay element on mouseover', () => {
    require('./picker.js');

    const overlay = document.querySelector('div[style*="cursor: crosshair"]');
    const highlight = document.querySelector('div[style*="border: 2px solid red"]');
    const originalDisplay = highlight.style.display;

    document.elementFromPoint = jest.fn(() => overlay);
    document.dispatchEvent(new MouseEvent('mousemove', { clientX: 50, clientY: 50 }));
    expect(highlight.style.display).toBe(originalDisplay);
  });

  it('bails out for highlight element on mouseover', () => {
    require('./picker.js');

    const highlight = document.querySelector('div[style*="border: 2px solid red"]');
    const originalDisplay = highlight.style.display;

    document.elementFromPoint = jest.fn(() => highlight);
    document.dispatchEvent(new MouseEvent('mousemove', { clientX: 50, clientY: 50 }));
    expect(highlight.style.display).toBe(originalDisplay);
  });

  it('bails out for overlay element on click', () => {
    global.chrome.storage.local.get.mockClear();
    require('./picker.js');

    const overlay = document.querySelector('div[style*="cursor: crosshair"]');
    document.elementFromPoint = jest.fn(() => overlay);

    document.dispatchEvent(new MouseEvent('click', { clientX: 50, clientY: 50 }));

    expect(global.chrome.storage.local.get).not.toHaveBeenCalled();
  });

  it('bails out for highlight element on click', () => {
    global.chrome.storage.local.get.mockClear();
    require('./picker.js');

    const highlight = document.querySelector('div[style*="border: 2px solid red"]');
    document.elementFromPoint = jest.fn(() => highlight);

    document.dispatchEvent(new MouseEvent('click', { clientX: 50, clientY: 50 }));

    expect(global.chrome.storage.local.get).not.toHaveBeenCalled();
  });

  it('handles chrome.runtime.lastError', () => {
    global.chrome.storage.local.get.mockImplementation((keys, cb) => {
        global.chrome.runtime.lastError = new Error('Test Error');
        cb({ customSelectors: {} });
    });

    require('./picker.js');

    const el = document.createElement('article');
    document.documentElement.appendChild(el);
    document.elementFromPoint = jest.fn(() => el);

    document.dispatchEvent(new MouseEvent('click', { clientX: 50, clientY: 50 }));

    expect(global.chrome.storage.local.set).not.toHaveBeenCalled();
  });

  it('handles storage get returning null', () => {
    global.chrome.storage.local.get.mockImplementation((keys, cb) => cb(null));
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    require('./picker.js');

    const el = document.createElement('article');
    document.documentElement.appendChild(el);
    document.elementFromPoint = jest.fn(() => el);

    document.dispatchEvent(new MouseEvent('click', { clientX: 50, clientY: 50 }));

    expect(global.chrome.storage.local.set).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('handles exceptions in storage get', () => {
    global.chrome.storage.local.get.mockImplementation((keys, cb) => { throw new Error('Simulated exception'); });
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    require('./picker.js');

    const el = document.createElement('article');
    document.documentElement.appendChild(el);
    document.elementFromPoint = jest.fn(() => el);

    document.dispatchEvent(new MouseEvent('click', { clientX: 50, clientY: 50 }));

    expect(global.chrome.storage.local.set).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('returns early when calling saveCustomSelector if no chrome.storage.local', () => {
    global.chrome.storage.local.get.mockClear();
    require('./picker.js');

    const el = document.createElement('div');
    document.documentElement.appendChild(el);
    document.elementFromPoint = jest.fn(() => el);

    delete global.chrome.storage.local;
    document.dispatchEvent(new MouseEvent('click', { clientX: 50, clientY: 50 }));
    expect(global.chrome.storage.local).toBeUndefined();
  });

  it('does nothing if mousemove element is falsy', () => {
    require('./picker.js');

    const highlight = document.querySelector('div[style*="border: 2px solid red"]');
    const originalDisplay = highlight.style.display;
    document.elementFromPoint = jest.fn(() => null);

    document.dispatchEvent(new MouseEvent('mousemove', { clientX: 50, clientY: 50 }));

    expect(highlight.style.display).toBe(originalDisplay);
  });

  it('does nothing if click element is falsy', () => {
    global.chrome.storage.local.get.mockClear();
    require('./picker.js');

    document.elementFromPoint = jest.fn(() => null);
    document.dispatchEvent(new MouseEvent('click', { clientX: 50, clientY: 50 }));

    expect(global.chrome.storage.local.get).not.toHaveBeenCalled();
  });

  it('bails out of save if confirm is cancelled', () => {
    global.confirm = jest.fn(() => false);

    require('./picker.js');

    const el = document.createElement('article');
    document.documentElement.appendChild(el);
    document.elementFromPoint = jest.fn(() => el);

    document.dispatchEvent(new MouseEvent('click', { clientX: 50, clientY: 50 }));

    expect(global.chrome.storage.local.set).not.toHaveBeenCalled();
  });

  it('uses empty class string if only whitespace', () => {
    global.chrome.storage.local.get.mockClear();
    require('./picker.js');

    const el = document.createElement('div');
    el.className = '   ';
    document.documentElement.appendChild(el);
    document.elementFromPoint = jest.fn(() => el);

    document.dispatchEvent(new MouseEvent('click', { clientX: 50, clientY: 50 }));

    expect(global.chrome.storage.local.set).toHaveBeenCalledWith({
      customSelectors: { 'example.com': ['div'] }
    });
  });

  it('handles undefined customSelectors in result', () => {
    global.chrome.storage.local.get.mockImplementation((keys, cb) => cb({}));

    require('./picker.js');

    const el = document.createElement('article');
    document.documentElement.appendChild(el);
    document.elementFromPoint = jest.fn(() => el);

    document.dispatchEvent(new MouseEvent('click', { clientX: 50, clientY: 50 }));

    expect(global.chrome.storage.local.set).toHaveBeenCalledWith({
      customSelectors: { 'example.com': ['article'] }
    });
  });

  it('does not duplicate selectors', () => {
    global.chrome.storage.local.get.mockImplementation((keys, cb) => cb({
        customSelectors: { 'example.com': ['article'] }
    }));

    require('./picker.js');

    const el = document.createElement('article');
    document.documentElement.appendChild(el);
    document.elementFromPoint = jest.fn(() => el);

    document.dispatchEvent(new MouseEvent('click', { clientX: 50, clientY: 50 }));

    expect(global.chrome.storage.local.set).not.toHaveBeenCalled();
  });

  it('handles arbitrary keydown gracefully', () => {
    require('./picker.js');
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }));
    expect(document.querySelector('div[style*="cursor: crosshair"]')).not.toBeNull();
  });

  it('bails inside saveCustomSelector async callback if chrome goes away', () => {
    global.chrome.storage.local.get.mockImplementation((keys, cb) => {
        delete global.chrome;
        cb({ customSelectors: {} });
    });

    require('./picker.js');

    const el = document.createElement('div');
    el.id = 'target';
    document.documentElement.appendChild(el);
    document.elementFromPoint = jest.fn(() => el);

    document.dispatchEvent(new MouseEvent('click', { clientX: 50, clientY: 50 }));
  });

  it('handles empty host', () => {
    global.chrome.storage.local.get.mockClear();
    const originalLocation = window.location;
    delete window.location;
    window.location = { hostname: '' };

    require('./picker.js');

    const el = document.createElement('article');
    document.documentElement.appendChild(el);
    document.elementFromPoint = jest.fn(() => el);

    document.dispatchEvent(new MouseEvent('click', { clientX: 50, clientY: 50 }));

    expect(global.chrome.storage.local.set).toHaveBeenCalledWith({
        customSelectors: { '': ['article'] }
    });
    window.location = originalLocation;
  });
});
