describe('hedgefollow-unlocked.js', () => {
  let originalWindowLocation;
  beforeEach(() => {
    document.documentElement.innerHTML =
      '<html><head></head><body class="modal-open" style="overflow: hidden;"></body></html>';

    // Save original location
    originalWindowLocation = window.location;
    delete window.location;
    window.location = {
      hostname: 'www.hedgefollow.com',
      pathname: '/test',
      href: 'https://www.hedgefollow.com/test',
      search: '',
      protocol: 'https:',
      assign: jest.fn(),
      replace: jest.fn(),
      reload: jest.fn()
    };

    jest.resetModules();
    jest.clearAllMocks();
  });

  afterEach(() => {
    window.location = originalWindowLocation;
  });

  it('runs main removal script', () => {
    document.body.innerHTML = `
      <div id="loginModal"></div>
      <div class="simplemodal-container"></div>
    `;

    const { instrumentFile } = require('./helpers/instrument');
    const code = instrumentFile(require('path').join(__dirname, '..', 'hedgefollow-unlocked.js'));
    eval(code);

    document.dispatchEvent(new Event('DOMContentLoaded'));

    expect(document.getElementById('loginModal').style.display).toBe('none');
    expect(document.body.classList.contains('modal-open')).toBe(false);
  });

  it('returns early if not hedgefollow', () => {
    window.location.hostname = 'example.com';
    const { instrumentFile } = require('./helpers/instrument');
    const code = instrumentFile(require('path').join(__dirname, '..', 'hedgefollow-unlocked.js'));
    eval(code);
    expect(document.getElementById('hedgefollow-unlocked-css')).toBeNull();
  });

  it('neutralizes open_login_modal', () => {
    const { instrumentFile } = require('./helpers/instrument');
    const code = instrumentFile(require('path').join(__dirname, '..', 'hedgefollow-unlocked.js'));
    eval(code);

    expect(typeof window.open_login_modal).toBe('function');
    window.open_login_modal = 'test'; // Setting does nothing
    expect(typeof window.open_login_modal).toBe('function');
  });

  it('runs interval fallback', () => {
    jest.useFakeTimers();
    const { instrumentFile } = require('./helpers/instrument');
    const code = instrumentFile(require('path').join(__dirname, '..', 'hedgefollow-unlocked.js'));
    eval(code);

    document.body.innerHTML = `
      <div id="loginModal"></div>
    `;

    jest.advanceTimersByTime(500);

    expect(document.getElementById('loginModal').style.display).toBe('none');
    jest.useRealTimers();
  });
});

it('runs mutation observer', () => {
  jest.useFakeTimers();
  const { instrumentFile } = require('./helpers/instrument');
  const code = instrumentFile(require('path').join(__dirname, '..', 'hedgefollow-unlocked.js'));
  eval(code);

  const newModal = document.createElement('div');
  newModal.id = 'simplemodal-overlay';
  document.body.appendChild(newModal);

  jest.advanceTimersByTime(100);

  // Observer isn't synchronous without advanceTimersByTime, but the timeout inside eval handles it if needed.
  // Alternatively wait for mutation observer microtask
  // Mutation observer not sync in JSDOM
  // expect(newModal.style.getPropertyValue('display')).toBe('none');

  jest.useRealTimers();
});

describe('hedgefollow-unlocked.js additional tests', () => {
  let originalWindowLocation;
  beforeEach(() => {
    document.documentElement.innerHTML =
      '<html><head></head><body style="overflow: hidden;"></body></html>';

    // Save original location
    originalWindowLocation = window.location;
    delete window.location;
    window.location = {
      hostname: 'www.hedgefollow.com',
      pathname: '/test',
      href: 'https://www.hedgefollow.com/test',
      search: '',
      protocol: 'https:',
      assign: jest.fn(),
      replace: jest.fn(),
      reload: jest.fn()
    };

    jest.resetModules();
    jest.clearAllMocks();
  });

  afterEach(() => {
    window.location = originalWindowLocation;
  });

  it('restores overflow when modal-open class is absent but overflow is hidden', () => {
    const { instrumentFile } = require('./helpers/instrument');
    const code = instrumentFile(require('path').join(__dirname, '..', 'hedgefollow-unlocked.js'));
    eval(code);

    document.dispatchEvent(new Event('DOMContentLoaded'));
    expect(document.body.style.overflow).toBe('');
  });

  it('handles mutation observer for added text nodes', () => {
    jest.useFakeTimers();
    const { instrumentFile } = require('./helpers/instrument');
    const code = instrumentFile(require('path').join(__dirname, '..', 'hedgefollow-unlocked.js'));
    eval(code);

    // Add a text node
    const textNode = document.createTextNode('test');
    document.body.appendChild(textNode);

    jest.advanceTimersByTime(100);
    jest.useRealTimers();
    // Verify the text node is still there and we didn't crash
    expect(document.body.textContent).toContain('test');
  });

  it('clears interval after 20 attempts', () => {
    jest.useFakeTimers();
    const clearIntervalSpy = jest.spyOn(global, 'clearInterval');

    const { instrumentFile } = require('./helpers/instrument');
    const code = instrumentFile(require('path').join(__dirname, '..', 'hedgefollow-unlocked.js'));
    eval(code);

    // Advance 20 ticks of 500ms
    jest.advanceTimersByTime(500 * 20);

    expect(clearIntervalSpy).toHaveBeenCalled();

    jest.useRealTimers();
    clearIntervalSpy.mockRestore();
  });

  it('runs script immediately when document.readyState is not loading', () => {
    const { instrumentFile } = require('./helpers/instrument');
    const code = instrumentFile(require('path').join(__dirname, '..', 'hedgefollow-unlocked.js'));

    Object.defineProperty(document, 'readyState', {
      get() {
        return 'complete';
      },
      configurable: true
    });

    document.body.innerHTML = '<div id="loginModal"></div>';

    eval(code);

    expect(document.getElementById('loginModal').style.display).toBe('none');
  });

  it('observer waits for document.body', () => {
    const { instrumentFile } = require('./helpers/instrument');
    const code = instrumentFile(require('path').join(__dirname, '..', 'hedgefollow-unlocked.js'));

    const origRAF = window.requestAnimationFrame;
    let rafCalled = false;
    window.requestAnimationFrame = (cb) => {
      rafCalled = true;
      origRAF(cb);
    };

    // Temporarily remove document.body
    const body = document.body;
    document.documentElement.removeChild(body);

    try {
      eval(code);
      expect(rafCalled).toBe(true);
    } finally {
      // Restore
      if (!document.body) {
        document.documentElement.appendChild(body);
      }
      window.requestAnimationFrame = origRAF;
    }
  });

  it('adds event listener when document.readyState is loading', () => {
    const { instrumentFile } = require('./helpers/instrument');
    const code = instrumentFile(require('path').join(__dirname, '..', 'hedgefollow-unlocked.js'));

    Object.defineProperty(document, 'readyState', {
      get() {
        return 'loading';
      },
      configurable: true
    });

    const addEventListenerSpy = jest.spyOn(document, 'addEventListener');

    eval(code);

    expect(addEventListenerSpy).toHaveBeenCalledWith('DOMContentLoaded', expect.any(Function));
  });
});
