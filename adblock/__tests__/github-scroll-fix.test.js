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
