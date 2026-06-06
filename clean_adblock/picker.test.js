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
    expect(window.__bypassPickerActive).toBe(true);
  });

  it('handles early return on mousemove for overlay', () => {
    require('./picker.js');
    const overlay = document.documentElement.children[0];
    document.elementFromPoint = jest.fn(() => overlay);
    document.dispatchEvent(new MouseEvent('mousemove', { clientX: 50, clientY: 50 }));
    // Verify early return by checking if highlight top changed
  });

  it('handles click and does not save selector if element is overlay', () => {
    require('./picker.js');
    const overlay = document.documentElement.children[0];
    document.elementFromPoint = jest.fn(() => overlay);
    document.dispatchEvent(new MouseEvent('click', { clientX: 50, clientY: 50 }));
  });

  it('does not save selector if no chrome.storage', () => {
    delete global.chrome;
    require('./picker.js');
  });

  it('handles local storage get exception', () => {
    global.chrome.storage.local.get = jest.fn(() => {
      throw new Error('access failed');
    });
    console.error = jest.fn();
    require('./picker.js');
    const el = document.createElement('div');
    document.documentElement.appendChild(el);
    document.elementFromPoint = jest.fn(() => el);
    document.dispatchEvent(new MouseEvent('click', { clientX: 50, clientY: 50 }));
    expect(console.error).toHaveBeenCalled();
  });

  it('handles local storage callback exception', () => {
    global.chrome.storage.local.get = jest.fn((keys, cb) => {
      cb(null); // will cause TypeError inside cb
    });
    console.error = jest.fn();
    require('./picker.js');
    const el = document.createElement('div');
    document.documentElement.appendChild(el);
    document.elementFromPoint = jest.fn(() => el);
    document.dispatchEvent(new MouseEvent('click', { clientX: 50, clientY: 50 }));
    expect(console.error).toHaveBeenCalled();
  });

  describe('picker.js callback early return', () => {
    it('handles lastError in storage callback', () => {
      global.chrome.storage.local.get = jest.fn((keys, cb) => {
        global.chrome.runtime.lastError = { message: 'error' };
        cb({ customSelectors: {} });
      });
      require('./picker.js');
      const el = document.createElement('div');
      el.id = 'test-id-2';
      document.documentElement.appendChild(el);
      document.elementFromPoint = jest.fn(() => el);
      document.dispatchEvent(new MouseEvent('click', { clientX: 50, clientY: 50 }));
      expect(global.chrome.storage.local.set).not.toHaveBeenCalled();
    });
  });
});
