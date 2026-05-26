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
});
