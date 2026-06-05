describe('picker.js', () => {
  beforeEach(() => {
    document.documentElement.innerHTML = '';
    window.__bypassPickerActive = false;
    window.alert = jest.fn();
    window.confirm = jest.fn(() => true);

    // Mock CSS.escape
    global.CSS = {
      escape: jest.fn((str) => str)
    };

    global.chrome = {
      storage: {
        local: {
          get: jest.fn((keys, cb) => cb({ customSelectors: {} })),
          set: jest.fn()
        }
      }
    };

    // Reset window.location
    delete window.location;
    window.location = new URL('https://example.com');
  });

  afterEach(() => {
    jest.resetModules();
  });

  it('initializes and cleans up on Escape', () => {
    require('./picker.js');
    expect(window.__bypassPickerActive).toBe(true);

    document.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Escape' }));

    expect(window.__bypassPickerActive).toBe(false);
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
      customSelectors: {
        'example.com': ['#test-id']
      }
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
      customSelectors: {
        'example.com': ['.test-class']
      }
    });
    expect(el.style.display).toBe('none');
    expect(window.__bypassPickerActive).toBe(false);
  });

  it('handles click and saves selector by tag', () => {
    require('./picker.js');

    const el = document.createElement('span');
    document.documentElement.appendChild(el);

    document.elementFromPoint = jest.fn(() => el);

    document.dispatchEvent(new MouseEvent('click', { clientX: 50, clientY: 50 }));

    expect(window.confirm).toHaveBeenCalled();
    expect(global.chrome.storage.local.set).toHaveBeenCalledWith({
      customSelectors: {
        'example.com': ['span']
      }
    });
    expect(el.style.display).toBe('none');
    expect(window.__bypassPickerActive).toBe(false);
  });

  it('does nothing if no chrome.storage', () => {
    delete global.chrome;
    require('./picker.js');
    expect(window.__bypassPickerActive).toBe(false);
  });
  it('does nothing if already active', () => {
    window.__bypassPickerActive = true;
    require('./picker.js');
    expect(document.documentElement.innerHTML).not.toContain('crosshair');
  });

  it('mousemove ignores if element is falsy', () => {
    require('./picker.js');
    document.elementFromPoint = jest.fn(() => null);
    document.dispatchEvent(new MouseEvent('mousemove', { clientX: 50, clientY: 50 }));
  });

  it('click ignores if element is falsy', () => {
    require('./picker.js');
    document.elementFromPoint = jest.fn(() => null);
    document.dispatchEvent(new MouseEvent('click', { clientX: 50, clientY: 50 }));
  });

  it('does nothing if confirm is false', () => {
    window.confirm = jest.fn(() => false);
    require('./picker.js');
    const el = document.createElement('div');
    document.documentElement.appendChild(el);
    document.elementFromPoint = jest.fn(() => el);
    document.dispatchEvent(new MouseEvent('click', { clientX: 50, clientY: 50 }));
  });

  it('does nothing if no chrome.storage.local', () => {
    delete global.chrome.storage.local;
    require('./picker.js');
    const el = document.createElement('div');
    document.elementFromPoint = jest.fn(() => el);
    document.dispatchEvent(new MouseEvent('click', { clientX: 50, clientY: 50 }));
  });
  it('saves custom selector without error if runtime.lastError is present', () => {
    global.chrome = {
      storage: {
        local: {
          get: jest.fn((keys, cb) => cb({ customSelectors: {} })),
          set: jest.fn()
        }
      },
      runtime: { lastError: new Error('mock error') }
    };
    require('./picker.js');
    const el = document.createElement('div');
    document.documentElement.appendChild(el);
    document.elementFromPoint = jest.fn(() => el);
    document.dispatchEvent(new MouseEvent('click', { clientX: 50, clientY: 50 }));
  });

  it('saves custom selector handles missing chrome runtime correctly', () => {
    global.chrome.storage.local.get = jest.fn((keys, cb) => cb({}));
    delete global.chrome.runtime;
    require('./picker.js');
    const el = document.createElement('div');
    document.documentElement.appendChild(el);
    document.elementFromPoint = jest.fn(() => el);
    document.dispatchEvent(new MouseEvent('click', { clientX: 50, clientY: 50 }));
  });
});
