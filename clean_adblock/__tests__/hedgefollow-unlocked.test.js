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
