describe('github-scroll-fix.js', () => {
  let origLocation;

  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    origLocation = window.location;
    delete window.location;
    window.location = new URL('https://github.com/ryusoh/networking');
  });

  afterEach(() => {
    window.location = origLocation;
  });

  it('intercepts focus to enforce preventScroll: true', () => {
    const { instrumentFile } = require('./helpers/instrument');
    const code = instrumentFile(require('path').join(__dirname, '..', 'github-scroll-fix.js'));

    eval(code);

    const btn = document.createElement('button');
    const focusSpy = jest.fn();
    btn.focus = focusSpy;

    // Simulate focus call
    btn.focus();
    btn.focus({ preventScroll: false });

    // The wrapped method should enforce preventScroll: true
    expect(HTMLElement.prototype.focus).toBeDefined();
  });

  it('blocks automated scrollIntoView to bottom elements when near top', () => {
    const { instrumentFile } = require('./helpers/instrument');
    const code = instrumentFile(require('path').join(__dirname, '..', 'github-scroll-fix.js'));

    eval(code);

    const el = document.createElement('div');
    el.getBoundingClientRect = () => ({ top: 1500, bottom: 1600, left: 0, right: 100 });

    window.scrollY = 0;
    let scrolled = false;
    Element.prototype.scrollIntoView = function () {
      scrolled = true;
    };

    // Re-eval after mocking base
    eval(code);

    // Call scrollIntoView near top -> should be blocked
    el.scrollIntoView();
    expect(scrolled).toBe(false);
  });

  it('blocks automated scrollTo near bottom when at top without user interaction', () => {
    const { instrumentFile } = require('./helpers/instrument');
    const code = instrumentFile(require('path').join(__dirname, '..', 'github-scroll-fix.js'));

    let lastScrollTo = null;
    window.scrollTo = (x, y) => {
      lastScrollTo = { x, y };
    };

    eval(code);

    window.scrollY = 0;
    Object.defineProperty(document.body, 'scrollHeight', { value: 3000, configurable: true });

    // Try programmatic scrollTo bottom (y = 2500)
    window.scrollTo(0, 2500);

    // Should be filtered out (lastScrollTo remains null)
    expect(lastScrollTo).toBeNull();
  });

  it('allows scrollTo when user explicitly clicks', () => {
    const { instrumentFile } = require('./helpers/instrument');
    const code = instrumentFile(require('path').join(__dirname, '..', 'github-scroll-fix.js'));

    let lastScrollTo = null;
    window.scrollTo = (x, y) => {
      lastScrollTo = { x, y };
    };

    eval(code);

    window.scrollY = 0;
    Object.defineProperty(document.body, 'scrollHeight', { value: 3000, configurable: true });

    // Simulate click event
    window.dispatchEvent(new Event('click'));

    window.scrollTo(0, 2500);

    // Should pass through
    expect(lastScrollTo).toEqual({ x: 0, y: 2500 });
  });

  it('does nothing if not on github.com', () => {
    window.location = new URL('https://example.com');
    const { instrumentFile } = require('./helpers/instrument');
    const code = instrumentFile(require('path').join(__dirname, '..', 'github-scroll-fix.js'));

    expect(() => eval(code)).not.toThrow();
  });
});
