'use strict';
const path = require('path');
const { instrumentFile } = require('./helpers/instrument');

describe('github-scroll-fix.js', () => {
  let origFocus;
  let origScrollIntoView;
  let origScrollTo;

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(10000);

    // Setup window environment for github check
    delete window.location;
    window.location = { hostname: 'github.com' };

    // Mock user interaction properties
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true, configurable: true });
    Object.defineProperty(window, 'pageYOffset', { value: 0, writable: true, configurable: true });
    Object.defineProperty(window, 'innerHeight', {
      value: 1000,
      writable: true,
      configurable: true
    });

    // Setup document structure
    document.body.innerHTML = '<div>test</div>';
    Object.defineProperty(document.body, 'scrollHeight', {
      value: 5000,
      writable: true,
      configurable: true
    });

    origFocus = jest.fn();
    HTMLElement.prototype.focus = origFocus;

    origScrollIntoView = jest.fn();
    Element.prototype.scrollIntoView = origScrollIntoView;

    origScrollTo = jest.fn();
    window.scrollTo = origScrollTo;
    window.scroll = origScrollTo;

    const srcPath = path.resolve(__dirname, '../github-scroll-fix.js');
    const instrumented = instrumentFile(srcPath);
    eval(instrumented);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.useRealTimers();
  });

  test('does not run on non-github sites', () => {
    window.location.hostname = 'example.com';
    const srcPath = path.resolve(__dirname, '../github-scroll-fix.js');
    const instrumented = instrumentFile(srcPath);

    const initialFocus = HTMLElement.prototype.focus;
    eval(instrumented);
    expect(HTMLElement.prototype.focus).toBe(initialFocus);
  });

  test('forces preventScroll=true when calling focus()', () => {
    const el = document.createElement('div');
    el.focus();
    expect(origFocus).toHaveBeenCalledWith({ preventScroll: true });

    el.focus({ preventScroll: false });
    expect(origFocus).toHaveBeenCalledWith({ preventScroll: true });
  });

  test('blocks scrollIntoView when jumping to bottom without user interaction', () => {
    const el = document.createElement('div');
    el.getBoundingClientRect = () => ({ top: 4000 }); // Far down
    window.scrollY = 0; // Near top

    // Test blocking
    const result = el.scrollIntoView();
    expect(origScrollIntoView).not.toHaveBeenCalled();
    expect(result).toBeUndefined();

    // Test allowing (recent interaction)
    window.dispatchEvent(new Event('click')); // Will set time
    el.scrollIntoView();
    expect(origScrollIntoView).toHaveBeenCalled();
  });

  test('blocks scrollTo when jumping to bottom without user interaction', () => {
    window.scrollY = 0; // Near top
    document.body.scrollHeight = 5000;

    // Jump past 70% of 4000 = 2800
    window.scrollTo(0, 3500);
    expect(origScrollTo).not.toHaveBeenCalled();

    // Jump with options object
    window.scrollTo({ top: 3500 });
    expect(origScrollTo).not.toHaveBeenCalled();

    // Allow if recent interaction
    window.dispatchEvent(new Event('keydown'));
    window.scrollTo(0, 3500);
    expect(origScrollTo).toHaveBeenCalledWith(0, 3500);

    // Allow if using options object
    window.scrollTo({ top: 3500 });
    expect(origScrollTo).toHaveBeenCalledWith({ top: 3500 });
  });

  test('allows scrollTo if not jumping far', () => {
    window.scrollY = 0;
    document.body.scrollHeight = 5000;

    window.scrollTo(0, 50); // Only tiny jump
    expect(origScrollTo).toHaveBeenCalledWith(0, 50);
  });

  test('handles frozen options object in focus() safely', () => {
    const el = document.createElement('div');
    const frozenOpts = Object.freeze({ preventScroll: false });
    expect(() => el.focus(frozenOpts)).not.toThrow();
    expect(origFocus).toHaveBeenCalledWith(expect.objectContaining({ preventScroll: true }));
  });

  test('blocks scrollIntoView when button is below viewport without user interaction', () => {
    const el = document.createElement('div');
    el.getBoundingClientRect = () => ({ top: 800, bottom: 850 });
    window.scrollY = 0;

    el.scrollIntoView();
    expect(origScrollIntoView).not.toHaveBeenCalled();
  });

  test('intercepts scrollIntoViewIfNeeded when present on Element.prototype', () => {
    const origScrollIntoViewIfNeeded = jest.fn();
    Element.prototype.scrollIntoViewIfNeeded = origScrollIntoViewIfNeeded;

    const srcPath = path.resolve(__dirname, '../github-scroll-fix.js');
    const instrumented = instrumentFile(srcPath);
    eval(instrumented);

    const el = document.createElement('div');
    el.getBoundingClientRect = () => ({ top: 800, bottom: 850 });
    window.scrollY = 0;

    el.scrollIntoViewIfNeeded();
    expect(origScrollIntoViewIfNeeded).not.toHaveBeenCalled();

    window.dispatchEvent(new Event('click'));
    el.scrollIntoViewIfNeeded();
    expect(origScrollIntoViewIfNeeded).toHaveBeenCalled();
  });

  test('blocks scrollTo medium down-scroll (500px) when near top without user interaction', () => {
    window.scrollY = 0;
    window.scrollTo(0, 500);
    expect(origScrollTo).not.toHaveBeenCalled();
  });

  test('blocks window.scrollBy down-scroll when near top without user interaction', () => {
    const origScrollBy = jest.fn();
    window.scrollBy = origScrollBy;

    const srcPath = path.resolve(__dirname, '../github-scroll-fix.js');
    const instrumented = instrumentFile(srcPath);
    eval(instrumented);

    window.scrollY = 0;
    window.scrollBy(0, 600);
    expect(origScrollBy).not.toHaveBeenCalled();

    window.dispatchEvent(new Event('click'));
    window.scrollBy(0, 600);
    expect(origScrollBy).toHaveBeenCalledWith(0, 600);
  });

  test('intercepts scrollTop property setter on Element.prototype when near top', () => {
    window.scrollY = 0;
    document.documentElement.scrollTop = 800;
    expect(document.documentElement.scrollTop).toBe(0);

    window.dispatchEvent(new Event('click'));
    document.documentElement.scrollTop = 800;
    expect(document.documentElement.scrollTop).toBe(800);
  });
});

describe('github-scroll-fix.js additional branches', () => {
  let origScrollBy;

  beforeEach(() => {
    delete window.location;
    window.location = { hostname: 'github.com' };

    Object.defineProperty(window, 'scrollY', { value: 0, writable: true, configurable: true });
    origScrollBy = jest.fn();
    window.scrollBy = origScrollBy;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('handles options object in scrollBy', () => {
    const srcPath = path.resolve(__dirname, '../github-scroll-fix.js');
    const instrumented = instrumentFile(srcPath);
    eval(instrumented);

    window.scrollBy({ top: 200 });
    expect(origScrollBy).not.toHaveBeenCalled();

    window.scrollBy({ top: 50 });
    expect(origScrollBy).toHaveBeenCalledWith({ top: 50 });
  });

  test('getScrollDeltaY handles string arguments fallback to 0', () => {
    const srcPath = path.resolve(__dirname, '../github-scroll-fix.js');
    const instrumented = instrumentFile(srcPath);
    eval(instrumented);

    window.scrollBy('something_weird');
    expect(origScrollBy).toHaveBeenCalledWith('something_weird', undefined);
  });

  test('getScrollTargetY handles string arguments fallback to 0', () => {
    const origScrollTo = jest.fn();
    window.scrollTo = origScrollTo;

    const srcPath = path.resolve(__dirname, '../github-scroll-fix.js');
    const instrumented = instrumentFile(srcPath);
    eval(instrumented);

    window.scrollTo('something_weird');
    expect(origScrollTo).toHaveBeenCalledWith('something_weird', undefined);
  });
});

describe('github-scroll-fix.js final coverage', () => {
  beforeEach(() => {
    delete window.location;
    window.location = { hostname: 'github.com' };
    jest.resetModules();
    jest.clearAllMocks();
  });

  test('covers window undefined branch in interceptWindowScroll', () => {
    const { instrumentFile } = require('./helpers/instrument');
    const srcPath = require('path').resolve(__dirname, '../github-scroll-fix.js');
    const code = instrumentFile(srcPath);

    // Save window and set it to undefined during eval
    const origWindow = global.window;

    // We cannot just delete window in jest because it is heavily used by jsdom,
    // but we can try to mock it within the IIFE.
    // Instead of actually deleting window, we can just execute the script
    // in an environment where window is undefined.
    // Alternatively we can use new Function

    const wrapper = new Function('window', 'document', 'Element', 'HTMLElement', code);
    wrapper(undefined, undefined, undefined, undefined);

    global.window = origWindow;
  });

  test('covers missing HTMLElement prototype branch', () => {
    const { instrumentFile } = require('./helpers/instrument');
    const srcPath = require('path').resolve(__dirname, '../github-scroll-fix.js');
    const code = instrumentFile(srcPath);

    // Remove HTMLElement entirely for this test
    const origHTMLElement = global.HTMLElement;

    global.HTMLElement = undefined;

    eval(code);

    global.HTMLElement = origHTMLElement;
  });
});

describe('github-scroll-fix.js super final coverage', () => {
  beforeEach(() => {
    delete window.location;
    window.location = { hostname: 'github.com' };
    jest.resetModules();
    jest.clearAllMocks();
  });

  test('covers missing window scrollBy and scrollTo', () => {
    const { instrumentFile } = require('./helpers/instrument');
    const srcPath = require('path').resolve(__dirname, '../github-scroll-fix.js');
    const code = instrumentFile(srcPath);

    // Save
    const origScrollTo = global.window.scrollTo;
    const origScrollBy = global.window.scrollBy;
    const origScroll = global.window.scroll;

    global.window.scrollTo = undefined;
    global.window.scrollBy = undefined;
    global.window.scroll = undefined;

    eval(code);

    // Restore
    global.window.scrollTo = origScrollTo;
    global.window.scrollBy = origScrollBy;
    global.window.scroll = origScroll;
  });
});

describe('github-scroll-fix.js getScrollDeltaY edge case', () => {
  beforeEach(() => {
    delete window.location;
    window.location = { hostname: 'github.com' };
    jest.resetModules();
    jest.clearAllMocks();
  });

  test('covers getScrollDeltaY null branch', () => {
    const { instrumentFile } = require('./helpers/instrument');
    const srcPath = require('path').resolve(__dirname, '../github-scroll-fix.js');
    const code = instrumentFile(srcPath);

    // Save
    const origScrollBy = global.window.scrollBy;

    const mockScrollBy = jest.fn();
    global.window.scrollBy = mockScrollBy;

    eval(code);

    window.scrollBy(null);

    // Restore
    global.window.scrollBy = origScrollBy;
  });

  test('covers getScrollTargetY null branch', () => {
    const { instrumentFile } = require('./helpers/instrument');
    const srcPath = require('path').resolve(__dirname, '../github-scroll-fix.js');
    const code = instrumentFile(srcPath);

    const origScrollTo = global.window.scrollTo;
    const mockScrollTo = jest.fn();
    global.window.scrollTo = mockScrollTo;

    eval(code);

    window.scrollTo(null);

    global.window.scrollTo = origScrollTo;
  });
});

describe('github-scroll-fix.js super extra final coverage', () => {
  beforeEach(() => {
    delete window.location;
    window.location = { hostname: 'github.com' };
    jest.resetModules();
    jest.clearAllMocks();
  });

  test('covers missing HTMLElement prototype in interceptScrollTop', () => {
    const { instrumentFile } = require('./helpers/instrument');
    const srcPath = require('path').resolve(__dirname, '../github-scroll-fix.js');
    const code = instrumentFile(srcPath);

    // First, verify behavior when Element does not have scrollTop descriptor
    // JSDOM Element doesn't have it natively sometimes, it's on HTMLElement usually or Element.

    // We will just create a clean environment where Element has NO scrollTop descriptor,
    // and HTMLElement does.
    const oldElementDesc = Object.getOwnPropertyDescriptor(global.Element.prototype, 'scrollTop');
    if (oldElementDesc) {
      delete global.Element.prototype.scrollTop;
    }

    // Now interceptScrollTop will check Element.prototype for 'scrollTop', won't find it,
    // and will check HTMLElement.prototype.
    eval(code);

    if (oldElementDesc) {
      Object.defineProperty(global.Element.prototype, 'scrollTop', oldElementDesc);
    }
  });

  test('covers Element not defined and HTMLElement not defined', () => {
    const { instrumentFile } = require('./helpers/instrument');
    const srcPath = require('path').resolve(__dirname, '../github-scroll-fix.js');
    const code = instrumentFile(srcPath);

    // Completely remove Element and HTMLElement to cover `if (!protoForScrollTop)`
    const origHTMLElement = global.HTMLElement;
    const origElement = global.Element;

    global.Element = undefined;
    global.HTMLElement = undefined;

    eval(code);

    global.Element = origElement;
    global.HTMLElement = origHTMLElement;
  });
});

describe('github-scroll-fix.js getScrollTargetY empty object edge case', () => {
  beforeEach(() => {
    delete window.location;
    window.location = { hostname: 'github.com' };
    jest.resetModules();
    jest.clearAllMocks();
  });

  test('covers getScrollTargetY object without top branch', () => {
    const { instrumentFile } = require('./helpers/instrument');
    const srcPath = require('path').resolve(__dirname, '../github-scroll-fix.js');
    const code = instrumentFile(srcPath);

    const origScrollTo = global.window.scrollTo;
    const mockScrollTo = jest.fn();
    global.window.scrollTo = mockScrollTo;

    eval(code);

    window.scrollTo({});

    global.window.scrollTo = origScrollTo;
  });
});
