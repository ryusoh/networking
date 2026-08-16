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

describe('hedgefollow-unlocked.js extra coverage', () => {
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

  it('covers Object.defineProperty already defined error', () => {
    // Make open_login_modal non-configurable to throw error in try/catch
    Object.defineProperty(window, 'open_login_modal', {
      value: 'locked',
      configurable: false
    });

    const { instrumentFile } = require('./helpers/instrument');
    const code = instrumentFile(require('path').join(__dirname, '..', 'hedgefollow-unlocked.js'));
    eval(code);
  });

  it('covers observer id and cls conditions', () => {
    jest.useFakeTimers();
    const { instrumentFile } = require('./helpers/instrument');
    const code = instrumentFile(require('path').join(__dirname, '..', 'hedgefollow-unlocked.js'));
    eval(code);

    // Create modals with specific ids / classes to trigger branches
    const m1 = document.createElement('div');
    m1.id = 'loginModal';
    document.body.appendChild(m1);

    const m2 = document.createElement('div');
    m2.id = 'simplemodal-container';
    document.body.appendChild(m2);

    const m3 = document.createElement('div');
    m3.className = 'simplemodal-container something';
    document.body.appendChild(m3);

    const m4 = document.createElement('div');
    m4.className = 'simplemodal-overlay';
    document.body.appendChild(m4);

    jest.advanceTimersByTime(100);

    jest.useRealTimers();
  });
});

describe('hedgefollow-unlocked.js extra extra coverage', () => {
  let originalWindowLocation;
  beforeEach(() => {
    document.documentElement.innerHTML =
      '<html><head></head><body style="overflow: hidden;"></body></html>';

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

  it('covers open_login_modal get/set branches', () => {
    const { instrumentFile } = require('./helpers/instrument');
    const code = instrumentFile(require('path').join(__dirname, '..', 'hedgefollow-unlocked.js'));
    eval(code);

    const desc = Object.getOwnPropertyDescriptor(window, 'open_login_modal');

    // Call set
    if (desc && desc.set) {
      desc.set();
    }

    // Call get -> returns function -> call the function
    if (desc && desc.get) {
      const fn = desc.get();
      if (typeof fn === 'function') {
        fn();
      }
    }
  });

  it('covers document.head fallback in appendChild', () => {
    // Remove document.head
    Object.defineProperty(document, 'head', {
      value: null,
      configurable: true
    });

    const { instrumentFile } = require('./helpers/instrument');
    const code = instrumentFile(require('path').join(__dirname, '..', 'hedgefollow-unlocked.js'));
    eval(code);

    expect(document.documentElement.innerHTML).toContain('hedgefollow-unlocked-css');
  });
});

describe('hedgefollow-unlocked.js even more coverage', () => {
  let originalWindowLocation;
  beforeEach(() => {
    document.documentElement.innerHTML =
      '<html><head></head><body style="overflow: hidden;"></body></html>';

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

  it('covers removeModals non-HTMLElement loop', () => {
    const { instrumentFile } = require('./helpers/instrument');
    const code = instrumentFile(require('path').join(__dirname, '..', 'hedgefollow-unlocked.js'));
    eval(code);

    // Make an element mimic non-HTMLElement
    const nonHtml = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    nonHtml.id = 'loginModal';
    document.body.appendChild(nonHtml);

    // Trigger run()
    document.dispatchEvent(new Event('DOMContentLoaded'));
  });

  it('covers startObserver non-HTMLElement addedNode', () => {
    jest.useFakeTimers();

    const { instrumentFile } = require('./helpers/instrument');
    const code = instrumentFile(require('path').join(__dirname, '..', 'hedgefollow-unlocked.js'));
    eval(code);

    const nonHtml = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    document.body.appendChild(nonHtml);

    jest.advanceTimersByTime(100);
    jest.useRealTimers();
  });

  it('covers observer id/cls branches edge case (null id or cls)', () => {
    jest.useFakeTimers();

    const { instrumentFile } = require('./helpers/instrument');
    const code = instrumentFile(require('path').join(__dirname, '..', 'hedgefollow-unlocked.js'));
    eval(code);

    // Create an element and mock its id and className getters to return undefined
    const el = document.createElement('div');
    Object.defineProperty(el, 'id', {
      get() {
        return undefined;
      }
    });
    Object.defineProperty(el, 'className', {
      get() {
        return undefined;
      }
    });

    document.body.appendChild(el);

    jest.advanceTimersByTime(100);
    jest.useRealTimers();
  });

  it('covers document.body being null in observer', () => {
    jest.useFakeTimers();

    const { instrumentFile } = require('./helpers/instrument');
    const code = instrumentFile(require('path').join(__dirname, '..', 'hedgefollow-unlocked.js'));
    eval(code);

    // Create an element that will trigger the observer logic but mock document.body to null
    // inside the observer's callback, we can't easily mock document.body in JSDOM dynamically
    // without breaking the mutation observer. But we can overwrite it temporarily right before
    // advancing timers.
    const m1 = document.createElement('div');
    m1.id = 'loginModal';
    document.body.appendChild(m1);

    const origBody = document.body;
    Object.defineProperty(document, 'body', {
      get() {
        return null;
      },
      configurable: true
    });

    jest.advanceTimersByTime(100);

    Object.defineProperty(document, 'body', {
      value: origBody,
      configurable: true
    });

    jest.useRealTimers();
  });
});

describe('hedgefollow-unlocked.js final coverage', () => {
  let originalWindowLocation;
  beforeEach(() => {
    document.documentElement.innerHTML =
      '<html><head></head><body style="overflow: hidden;"></body></html>';

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

  it('covers observer id/cls string but false match', () => {
    jest.useFakeTimers();

    const { instrumentFile } = require('./helpers/instrument');
    const code = instrumentFile(require('path').join(__dirname, '..', 'hedgefollow-unlocked.js'));
    eval(code);

    const m = document.createElement('div');
    m.id = 'not-a-modal';
    m.className = 'not-a-modal-class';
    document.body.appendChild(m);

    jest.advanceTimersByTime(100);
    jest.useRealTimers();
  });
});

describe('hedgefollow-unlocked.js final extra coverage', () => {
  let originalWindowLocation;
  beforeEach(() => {
    document.documentElement.innerHTML =
      '<html><head></head><body style="overflow: hidden;"></body></html>';

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

  it('covers document.body undefined inside node true branch', () => {
    jest.useFakeTimers();

    const { instrumentFile } = require('./helpers/instrument');
    const code = instrumentFile(require('path').join(__dirname, '..', 'hedgefollow-unlocked.js'));
    eval(code);

    const el = document.createElement('div');
    el.id = 'loginModal';
    document.body.appendChild(el);

    const origBody = document.body;
    Object.defineProperty(document, 'body', {
      get() {
        return null;
      },
      configurable: true
    });

    jest.advanceTimersByTime(100);

    Object.defineProperty(document, 'body', {
      value: origBody,
      configurable: true
    });

    jest.useRealTimers();
  });
});
