'use strict';

const path = require('path');
const { instrumentFile } = require('./helpers/instrument');

describe('forum-ad-blocker.js additional coverage', () => {
  beforeEach(() => {
    delete window.location;
    window.location = { hostname: '1point3acres.com' };
    jest.resetModules();
    jest.clearAllMocks();
  });

  test('mutation observer handles invalid selector fallback', () => {
    jest.useFakeTimers();
    const srcPath = path.resolve(__dirname, '../forum-ad-blocker.js');
    const instrumented = instrumentFile(srcPath);
    eval(instrumented);

    // Make matches throw to trigger catch block
    const div = document.createElement('div');
    div.matches = jest.fn().mockImplementation(() => {
      throw new Error('invalid selector');
    });

    document.body.appendChild(div);

    jest.advanceTimersByTime(100);
    jest.useRealTimers();
  });

  test('script setter handles script block', () => {
    const srcPath = path.resolve(__dirname, '../forum-ad-blocker.js');
    const instrumented = instrumentFile(srcPath);
    eval(instrumented);

    const script = document.createElement('script');
    document.body.appendChild(script);

    // This triggers set src
    script.src = 'https://adrecover.com/script.js';
    expect(script.src).not.toBe('https://adrecover.com/script.js'); // Should be blocked
  });

  test('script setter allows normal script', () => {
    const srcPath = path.resolve(__dirname, '../forum-ad-blocker.js');
    const instrumented = instrumentFile(srcPath);
    eval(instrumented);

    const script = document.createElement('script');
    document.body.appendChild(script);

    script.src = 'https://example.com/normal.js';
  });

  test('removeAdIframes hides ad iframe', () => {
    const srcPath = path.resolve(__dirname, '../forum-ad-blocker.js');
    const instrumented = instrumentFile(srcPath);

    const iframe = document.createElement('iframe');
    iframe.src =
      'https://googleads.g.doubleclick.net/pagead/html/r20240101/r20190131/zrt_lookup.html';
    document.body.appendChild(iframe);

    eval(instrumented);

    // Ineval, DOMContentLoaded runs which calls removeAdIframes
    document.dispatchEvent(new Event('DOMContentLoaded'));

    expect(iframe.style.display).toBe('none');
  });
});
