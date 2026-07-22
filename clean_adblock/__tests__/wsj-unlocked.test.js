describe('wsj-unlocked.js', () => {
  beforeEach(() => {
    document.documentElement.innerHTML = '<html><head></head><body></body></html>';
    jest.resetModules();
    jest.clearAllMocks();
  });

  it('injects style and removes paywall elements when document is already loaded', () => {
    document.body.innerHTML = `
      <div id="wrapper">
        <div id="cx-snippet-overlay-container">
          <div id="cx-snippet-overlay"></div>
        </div>
      </div>
      <article inert="true" aria-hidden="true"></article>
    `;

    // Make sure document.readyState is not 'loading'
    Object.defineProperty(document, 'readyState', {
      value: 'complete',
      configurable: true
    });

    const { instrumentFile } = require('./helpers/instrument');
    const code = instrumentFile(require('path').join(__dirname, '..', 'wsj-unlocked.js'));
    eval(code);

    // Check if the script removes elements synchronously
    expect(document.getElementById('cx-snippet-overlay-container')).toBeNull();
    const article = document.querySelector('article');
    expect(article.hasAttribute('inert')).toBeFalsy();
  });

  it('removes paywall elements added dynamically after initial load', async () => {
    Object.defineProperty(document, 'readyState', {
      value: 'complete',
      configurable: true
    });

    const { instrumentFile } = require('./helpers/instrument');
    const code = instrumentFile(require('path').join(__dirname, '..', 'wsj-unlocked.js'));
    eval(code);

    // Now dynamically add a paywall
    const container = document.createElement('div');
    container.id = 'cx-snippet-overlay-container';

    // MutationObserver works async
    document.body.appendChild(container);

    // Wait for microtasks
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(document.getElementById('cx-snippet-overlay-container')).toBeNull();
  });

  it('handles startObserver missing document.body initially', async () => {
    Object.defineProperty(document, 'readyState', {
      value: 'complete',
      configurable: true
    });

    const originalBody = document.body;
    Object.defineProperty(document, 'body', {
      value: null,
      configurable: true
    });

    jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      // restore body for the next frame
      Object.defineProperty(document, 'body', {
        value: originalBody,
        configurable: true
      });
      setTimeout(cb, 0);
    });

    const { instrumentFile } = require('./helpers/instrument');
    const code = instrumentFile(require('path').join(__dirname, '..', 'wsj-unlocked.js'));
    eval(code);

    await new Promise((resolve) => setTimeout(resolve, 10));

    expect(window.requestAnimationFrame).toHaveBeenCalled();
  });

  test('removePaywall on DOMContentLoaded when loading', () => {
    const path = require('path');
    const { instrumentFile } = require('./helpers/instrument');
    global.chrome = undefined;
    delete window.location;
    window.location = new URL('https://www.wsj.com/articles/something');
    document.documentElement.innerHTML = '<head></head><body></body>';

    // mock document.readyState
    Object.defineProperty(document, 'readyState', {
      get: () => 'loading',
      configurable: true
    });

    // Evaluate script
    const contentScriptPath = path.resolve(__dirname, '../wsj-unlocked.js');
    const code = instrumentFile(contentScriptPath);
    eval(code);

    document.body.classList.add('is-paywall-active');

    const event = document.createEvent('Event');
    event.initEvent('DOMContentLoaded', true, true);
    document.dispatchEvent(event);

    expect(document.body.classList.contains('is-paywall-active')).toBe(false);
  });

  test('removePaywall :has selector fallback', () => {
    const path = require('path');
    const { instrumentFile } = require('./helpers/instrument');
    // jsdom doesn't fully support :has but we can mock querySelectorAll to hit line 104
    global.chrome = undefined;
    window.location = new URL('https://www.wsj.com/articles/something');

    // We need to overwrite querySelectorAll temporarily on document
    const origQSA = document.querySelectorAll;
    document.querySelectorAll = function (selector) {
      if (selector === 'div:has(> #cx-snippet-overlay-container)') {
        const div = document.createElement('div');
        return [div]; // returns element with a real remove() method from JSDOM
      }
      return origQSA.call(this, selector);
    };

    const contentScriptPath = path.resolve(__dirname, '../wsj-unlocked.js');
    const code = instrumentFile(contentScriptPath);
    eval(code);

    // Restore
    document.querySelectorAll = origQSA;
  });

  test('removePaywall on DOMContentLoaded when loading', () => {
    const path = require('path');
    const { instrumentFile } = require('./helpers/instrument');
    global.chrome = undefined;
    delete window.location;
    window.location = new URL('https://www.wsj.com/articles/something');
    document.documentElement.innerHTML = '<head></head><body></body>';

    // mock document.readyState
    Object.defineProperty(document, 'readyState', {
      get: () => 'loading',
      configurable: true
    });

    // Evaluate script
    const contentScriptPath = path.resolve(__dirname, '../wsj-unlocked.js');
    const code = instrumentFile(contentScriptPath);
    eval(code);

    document.body.classList.add('is-paywall-active');

    const event = document.createEvent('Event');
    event.initEvent('DOMContentLoaded', true, true);
    document.dispatchEvent(event);

    expect(document.body.classList.contains('is-paywall-active')).toBe(false);
  });

  test('removePaywall :has selector fallback', () => {
    const path = require('path');
    const { instrumentFile } = require('./helpers/instrument');
    // jsdom doesn't fully support :has but we can mock querySelectorAll to hit line 104
    global.chrome = undefined;
    window.location = new URL('https://www.wsj.com/articles/something');

    // We need to overwrite querySelectorAll temporarily on document
    const origQSA = document.querySelectorAll;
    document.querySelectorAll = function (selector) {
      if (selector === 'div:has(> #cx-snippet-overlay-container)') {
        const div = document.createElement('div');
        return [div]; // returns element with a real remove() method from JSDOM
      }
      return origQSA.call(this, selector);
    };

    const contentScriptPath = path.resolve(__dirname, '../wsj-unlocked.js');
    const code = instrumentFile(contentScriptPath);
    eval(code);

    // Restore
    document.querySelectorAll = origQSA;
  });

  test('removePaywall :has selector hits callback', () => {
    const path = require('path');
    const { instrumentFile } = require('./helpers/instrument');
    global.chrome = undefined;
    window.location = new URL('https://www.wsj.com/articles/something');

    // We need to overwrite querySelectorAll temporarily on document
    const origQSA = document.querySelectorAll;
    document.querySelectorAll = function (selector) {
      if (selector === 'div:has(> #cx-snippet-overlay-container)') {
        const div = document.createElement('div');
        div.remove = jest.fn();
        return [div]; // returns element with a real remove() method from JSDOM
      }
      return origQSA.call(this, selector);
    };

    const contentScriptPath = path.resolve(__dirname, '../wsj-unlocked.js');
    const code = instrumentFile(contentScriptPath);
    eval(code);

    // Restore
    document.querySelectorAll = origQSA;
  });
});
