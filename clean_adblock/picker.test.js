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

    global.chromeLastError = null;
    global.chrome = {
      storage: {
        local: {
          get: jest.fn((keys, cb) => cb({ customSelectors: {} })),
          set: jest.fn()
        }
      }
    };
    Object.defineProperty(global.chrome, 'runtime', {
      get: () => ({
        get lastError() {
          return global.chromeLastError;
        }
      })
    });

    // Reset window.location
    delete window.location;
    window.location = new URL('https://example.com');
  });

  afterEach(() => {
    document.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Escape' }));
    jest.resetModules();
  });

  it('generateSelector handles empty class name', () => {
    require('./picker.js');
    const el = document.createElement('div');
    el.className = '  '; // whitespace
    document.documentElement.appendChild(el);
    document.elementFromPoint = jest.fn(() => el);
    document.dispatchEvent(new MouseEvent('click', { clientX: 50, clientY: 50 }));
    // will fall back to tag name 'div'
  });

  it('covers catch block in picker local storage callback', () => {
    jest.isolateModules(() => {
      document.documentElement.innerHTML = '';
      window.__bypassPickerActive = false;

      global.chromeLastError = null;
      global.chrome = {
        storage: {
          local: {
            get: jest.fn((keys, cb) => cb(null)),
            set: jest.fn()
          }
        }
      };
      Object.defineProperty(global.chrome, 'runtime', {
        get: () => ({
          get lastError() {
            return global.chromeLastError;
          }
        })
      });

      require('./picker.js');
      const el = document.createElement('div');
      document.documentElement.appendChild(el);
      document.elementFromPoint = jest.fn(() => el);

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      document.dispatchEvent(new MouseEvent('click', { clientX: 50, clientY: 50 }));
      expect(consoleSpy).toHaveBeenCalledWith(
        'Picker local storage callback failed:',
        expect.any(TypeError)
      );
      consoleSpy.mockRestore();
    });
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

  it('returns early if picker is already active', () => {
    window.__bypassPickerActive = true;
    require('./picker.js');
    // It should not attach another overlay, just return.
    // We check if overlay count is 0 (since it didn't run).
    const overlays = document.querySelectorAll('div[style*="cursor: crosshair"]');
    expect(overlays.length).toBe(0);
  });

  it('handleMouseMove returns early if no element or element is overlay/highlight', () => {
    jest.isolateModules(() => {
      // Reset any state that might be messing up
      document.documentElement.innerHTML = '';
      window.__bypassPickerActive = false;
      require('./picker.js');
      const overlays = document.querySelectorAll('div[style*="cursor: crosshair"]');
      const overlay = overlays[overlays.length - 1];
      const highlights = document.querySelectorAll('div[style*="border: 2px solid red"]');
      const highlight = highlights[highlights.length - 1];

      // no element
      document.elementFromPoint = jest.fn(() => null);
      document.dispatchEvent(new MouseEvent('mousemove', { clientX: 50, clientY: 50 }));

      // overlay
      document.elementFromPoint = jest.fn(() => overlay);
      document.dispatchEvent(new MouseEvent('mousemove', { clientX: 50, clientY: 50 }));

      // highlight
      document.elementFromPoint = jest.fn(() => highlight);
      document.dispatchEvent(new MouseEvent('mousemove', { clientX: 50, clientY: 50 }));
    });
  });

  it('handleClick returns early if no element or element is overlay', () => {
    document.documentElement.innerHTML = '';
    window.__bypassPickerActive = false;

    // We can simulate the click exactly on the overlay node by dispatching event ON the node itself
    // so the target is the overlay. And we mock elementFromPoint to return it.
    jest.isolateModules(() => {
      require('./picker.js');
      const children = document.documentElement.children;
      let myOverlay = null;
      let myHighlight = null;
      for (let i = 0; i < children.length; i++) {
        if (children[i].style.cursor === 'crosshair') {
          myOverlay = children[i];
        }
        if (children[i].style.border === '2px solid red') {
          myHighlight = children[i];
        }
      }

      window.confirm.mockClear();

      document.elementFromPoint = jest.fn((x, y) => {
        if (x === 1) {
          return null;
        }
        if (x === 2) {
          return myOverlay;
        }
        if (x === 3) {
          return myHighlight;
        }
      });

      // null
      document.dispatchEvent(new MouseEvent('click', { clientX: 1, clientY: 50 }));
      expect(window.confirm).not.toHaveBeenCalled();

      // overlay
      document.dispatchEvent(new MouseEvent('click', { clientX: 2, clientY: 50 }));
      expect(window.confirm).not.toHaveBeenCalled();

      // highlight
      document.dispatchEvent(new MouseEvent('click', { clientX: 3, clientY: 50 }));
      expect(window.confirm).not.toHaveBeenCalled();
    });
  });

  it('returns early in saveCustomSelector if chrome.storage.local is missing', () => {
    require('./picker.js');
    const el = document.createElement('div');
    document.documentElement.appendChild(el);
    document.elementFromPoint = jest.fn(() => el);

    delete global.chrome.storage.local;
    document.dispatchEvent(new MouseEvent('click', { clientX: 50, clientY: 50 }));
  });

  it('handles lastError in saveCustomSelector callback', () => {
    require('./picker.js');
    const el = document.createElement('div');
    document.documentElement.appendChild(el);
    document.elementFromPoint = jest.fn(() => el);

    global.chrome.storage.local.get = jest.fn((keys, cb) => {
      global.chromeLastError = new Error('Test error');
      cb({ customSelectors: {} });
    });

    document.dispatchEvent(new MouseEvent('click', { clientX: 50, clientY: 50 }));
    expect(global.chrome.storage.local.set).not.toHaveBeenCalled();
  });

  it('catches error in outer saveCustomSelector block', () => {
    require('./picker.js');
    const el = document.createElement('div');
    document.documentElement.appendChild(el);
    document.elementFromPoint = jest.fn(() => el);

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    global.chrome.storage.local.get = jest.fn(() => {
      throw new Error('Outer error');
    });

    document.dispatchEvent(new MouseEvent('click', { clientX: 50, clientY: 50 }));
    expect(consoleSpy).toHaveBeenCalledWith(
      'Picker local storage access failed:',
      expect.any(Error)
    );
    consoleSpy.mockRestore();
  });

  it('does nothing if no chrome.storage', () => {
    delete global.chrome;
    require('./picker.js');
    expect(window.__bypassPickerActive).toBe(false);
  });
});
