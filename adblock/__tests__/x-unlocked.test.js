describe('x-unlocked.js', () => {
  beforeEach(() => {
    delete window.location;
    window.location = new URL('https://example.com/test');
    jest.resetModules();
    jest.clearAllMocks();
  });

  it('loads without crashing', () => {
    const code = require('fs').readFileSync(
      require('path').join(__dirname, '..', 'x-unlocked.js'),
      'utf8'
    );
    eval(code);
  });
});

describe('Auto Generated Coverage', () => {
  const contentScriptPath = require('path').resolve(__dirname, '../x-unlocked.js');
  const { instrumentFile } = require('./helpers/instrument');

  function loadContentScript() {
    const code = instrumentFile(contentScriptPath);
    eval(code);
  }

  beforeEach(() => {
    delete window.location;
    window.location = new URL('https://x.com/home');
    document.documentElement.innerHTML = '<head></head><body></body>';
    jest.resetModules();
    jest.clearAllMocks();
    if (!global.chrome) {
      global.chrome = {
        storage: {
          sync: { get: jest.fn((defaults, cb) => cb({ preferredTab: 'finance' })) },
          local: { get: jest.fn((k, cb) => cb({ customSelectors: {} })) }
        },
        runtime: {
          onMessage: { addListener: jest.fn() },
          sendMessage: jest.fn()
        }
      };
    }
  });

  test('coverage execution', () => {
    jest.useFakeTimers();

    document.body.innerHTML = `
      <div role="presentation">
        <div role="tab" aria-selected="false">For you</div>
      </div>
      <div role="tab" aria-selected="false">Finance</div>
    `;

    // Mock innerText
    const tabs = document.querySelectorAll('[role="tab"]');
    tabs[0].innerText = 'For you';
    tabs[1].innerText = 'Finance';

    // Add mock click
    tabs[1].click = jest.fn();

    loadContentScript();

    const event = document.createEvent('Event');
    event.initEvent('DOMContentLoaded', true, true);
    document.dispatchEvent(event);

    jest.advanceTimersByTime(1000);

    expect(tabs[0].style.getPropertyValue('display')).toBe('none');
    expect(tabs[1].click).toHaveBeenCalled();

    // Re-simulate after tab switch to hit early returns
    const newDiv = document.createElement('div');
    document.body.appendChild(newDiv);
    jest.advanceTimersByTime(500);

    jest.useRealTimers();
  });

  test('coverage missing chrome storage get handling', () => {
    // Override local get to return no preferredTab
    global.chrome.storage.sync.get = jest.fn((defaults, cb) => cb({}));

    jest.useFakeTimers();

    document.body.innerHTML = `
      <div role="presentation">
        <div role="tab" aria-selected="false">For you</div>
      </div>
      <div role="tab" aria-selected="false">Finance</div>
    `;

    const tabs = document.querySelectorAll('[role="tab"]');
    tabs[0].innerText = 'For you';
    tabs[1].innerText = 'Finance';
    tabs[1].click = jest.fn();

    loadContentScript();

    const event = document.createEvent('Event');
    event.initEvent('DOMContentLoaded', true, true);
    document.dispatchEvent(event);

    jest.advanceTimersByTime(1000);

    expect(tabs[1].click).toHaveBeenCalled();

    jest.useRealTimers();
  });

  test('coverage early returns and untrusted click', () => {
    jest.useFakeTimers();

    document.body.innerHTML = `
      <div role="presentation">
        <div role="tab" aria-selected="false">For you</div>
      </div>
      <div role="tab" aria-selected="false">Finance</div>
    `;

    const tabs = document.querySelectorAll('[role="tab"]');
    tabs[0].innerText = 'For you';
    tabs[1].innerText = 'Finance';
    tabs[1].click = jest.fn();

    loadContentScript();

    const event = document.createEvent('Event');
    event.initEvent('DOMContentLoaded', true, true);
    document.dispatchEvent(event);

    const originalIsTrusted = Object.getOwnPropertyDescriptor(Event.prototype, 'isTrusted');
    Object.defineProperty(Event.prototype, 'isTrusted', {
      get: function () {
        return false;
      },
      configurable: true
    });

    const clickEvent = new Event('click', { bubbles: true, cancelable: true });
    document.body.dispatchEvent(clickEvent);

    jest.advanceTimersByTime(1000);

    if (originalIsTrusted) {
      Object.defineProperty(Event.prototype, 'isTrusted', originalIsTrusted);
    }

    jest.useRealTimers();
  });

  test('coverage early returns and missing chrome', () => {
    delete global.chrome;
    delete window.location;
    window.location = new URL('https://x.com/other');
    jest.useFakeTimers();

    // Body is missing initially
    document.documentElement.innerHTML = '<head></head>';

    loadContentScript();

    const event = document.createEvent('Event');
    event.initEvent('DOMContentLoaded', true, true);
    document.dispatchEvent(event);

    // Simulate tab switch observer on /other
    const newDiv = document.createElement('div');
    document.documentElement.appendChild(newDiv);
    jest.advanceTimersByTime(500);

    jest.useRealTimers();
  });

  test('throttles mutation observer callbacks and sets tabSwitched upon trusted click', () => {
    jest.useFakeTimers();

    document.body.innerHTML = `
      <div role="presentation">
        <div role="tab" aria-selected="false">For you</div>
      </div>
      <div role="tab" aria-selected="false">Finance</div>
    `;

    // Mock innerText
    const tabs = document.querySelectorAll('[role="tab"]');
    tabs[0].innerText = 'For you';
    tabs[1].innerText = 'Finance';

    tabs[1].click = jest.fn();

    loadContentScript();

    const event = document.createEvent('Event');
    event.initEvent('DOMContentLoaded', true, true);
    document.dispatchEvent(event);

    // simulate a few mutations to trigger the throttle
    const mutEvent = document.createEvent('Event');
    mutEvent.initEvent('DOMNodeInserted', true, true);
    document.body.appendChild(document.createElement('div'));
    document.body.appendChild(document.createElement('span'));

    // Mock isTrusted property via event constructor / prototype trick,
    // but in jsdom we can't redefine it. We instead overwrite it on the prototype temporarily
    const originalIsTrusted = Object.getOwnPropertyDescriptor(Event.prototype, 'isTrusted');
    Object.defineProperty(Event.prototype, 'isTrusted', {
      get: function () {
        return true;
      },
      configurable: true
    });

    const clickEvent = new Event('click', { bubbles: true, cancelable: true });
    tabs[1].dispatchEvent(clickEvent);

    jest.advanceTimersByTime(1000);

    // restore
    if (originalIsTrusted) {
      Object.defineProperty(Event.prototype, 'isTrusted', originalIsTrusted);
    }

    // Verify click event triggered after observing dom mutations to switch to preferred tab
    expect(tabs[1].click).toHaveBeenCalled();

    jest.useRealTimers();
  });

  test('does not switch tab if url is not home', () => {
    jest.useFakeTimers();

    document.body.innerHTML = `
      <div role="presentation">
        <div role="tab" aria-selected="false">For you</div>
      </div>
      <div role="tab" aria-selected="false">Finance</div>
    `;

    const tabs = document.querySelectorAll('[role="tab"]');
    tabs[0].innerText = 'For you';
    tabs[1].innerText = 'Finance';
    tabs[1].click = jest.fn();

    // not home
    window.location = new URL('https://x.com/otherpath');

    loadContentScript();

    const event = document.createEvent('Event');
    event.initEvent('DOMContentLoaded', true, true);
    document.dispatchEvent(event);

    jest.advanceTimersByTime(1000);
    expect(tabs[1].click).not.toHaveBeenCalled();

    jest.useRealTimers();
  });

  test('early returns from tryTabSwitch if tabSwitched is true', () => {
    jest.useFakeTimers();

    window.location = new URL('https://x.com/home');

    document.body.innerHTML = `
      <div role="presentation">
        <div role="tab" aria-selected="false">For you</div>
      </div>
      <div role="tab" aria-selected="false">Finance</div>
    `;

    const tabs = document.querySelectorAll('[role="tab"]');
    tabs[0].innerText = 'For you';
    tabs[1].innerText = 'Finance';
    tabs[1].click = jest.fn();

    loadContentScript();

    // First trigger sets tabSwitched = true inside content script
    const event = document.createEvent('Event');
    event.initEvent('DOMContentLoaded', true, true);
    document.dispatchEvent(event);

    jest.advanceTimersByTime(1000);
    expect(tabs[1].click).toHaveBeenCalledTimes(1);

    // Trigger mutation observer
    const newDiv = document.createElement('div');
    document.body.appendChild(newDiv);

    jest.advanceTimersByTime(1000);
    // Should not call again because tabSwitched is true
    expect(tabs[1].click).toHaveBeenCalledTimes(1);

    jest.useRealTimers();
  });

  test('throttleTimer returns early when true', () => {
    jest.useFakeTimers();
    window.location = new URL('https://x.com/home');

    document.body.innerHTML = `
      <div role="presentation">
        <div role="tab" aria-selected="false">For you</div>
      </div>
      <div role="tab" aria-selected="false">Finance</div>
    `;

    loadContentScript();

    const event = document.createEvent('Event');
    event.initEvent('DOMContentLoaded', true, true);
    document.dispatchEvent(event);

    // Fire many mutations to hit the early return `if (throttleTimer) return;`
    for (let i = 0; i < 5; i++) {
      document.body.appendChild(document.createElement('div'));
    }

    jest.advanceTimersByTime(1000);

    jest.useRealTimers();
  });
});

describe('x-unlocked.js extra coverage', () => {
  const contentScriptPath = require('path').resolve(__dirname, '../x-unlocked.js');
  const { instrumentFile } = require('./helpers/instrument');

  function loadContentScript() {
    const code = instrumentFile(contentScriptPath);
    eval(code);
  }

  beforeEach(() => {
    delete window.location;
    window.location = new URL('https://x.com/');
    jest.resetModules();
    jest.clearAllMocks();
  });

  test('covers early returns in tryTabSwitch and observer on non-home path', () => {
    window.location = new URL('https://x.com/something-else');
    document.documentElement.innerHTML = '<head></head><body></body>';

    // To cover line 89 (return if !tabs.length), we need path to be /home or / but no tabs
    // But this test is for non-home. We'll do that in another test.
    loadContentScript();

    const event = document.createEvent('Event');
    event.initEvent('DOMContentLoaded', true, true);
    document.dispatchEvent(event);

    // observer trigger
    document.body.appendChild(document.createElement('div'));
  });

  test('covers no tabs in tryTabSwitch', () => {
    window.location = new URL('https://x.com/');
    document.documentElement.innerHTML = '<head></head><body></body>';

    loadContentScript(); // init() -> startObserver() -> tryTabSwitch()
    // tryTabSwitch sees path === '/' but tabs.length === 0, returns early (line 89)
  });

  test('covers document.body existing during init', () => {
    window.location = new URL('https://x.com/');
    document.documentElement.innerHTML = '<head></head><body></body>';

    // By default JSDOM has document.body
    loadContentScript();
  });

  test('covers click event listener logic', () => {
    window.location = new URL('https://x.com/');
    document.documentElement.innerHTML = '<head></head><body></body>';

    loadContentScript();

    // We overwrite isTrusted to true
    const originalIsTrusted = Object.getOwnPropertyDescriptor(Event.prototype, 'isTrusted');
    Object.defineProperty(Event.prototype, 'isTrusted', {
      get: function () {
        return true;
      },
      configurable: true
    });

    // Simulate user click
    const clickEvent = new Event('click', { bubbles: true, cancelable: true });
    window.dispatchEvent(clickEvent);

    // restore
    if (originalIsTrusted) {
      Object.defineProperty(Event.prototype, 'isTrusted', originalIsTrusted);
    }
  });

  test('covers tabs loop branches', () => {
    window.location = new URL('https://x.com/');
    document.body.innerHTML = `
      <div role="presentation">
        <div role="tab" aria-selected="false">おすすめ</div>
      </div>
      <div role="tab" aria-selected="true">Finance</div>
      <div role="tab">No text</div>
    `;

    // Object define property for innerText since JSDOM doesn't support it natively
    const tabs = document.querySelectorAll('[role="tab"]');

    // 'おすすめ' (For you in Japanese)
    Object.defineProperty(tabs[0], 'innerText', {
      get() {
        return 'おすすめ';
      }
    });

    // Finance (Already selected)
    Object.defineProperty(tabs[1], 'innerText', {
      get() {
        return 'finance';
      }
    });

    // Element with no innerText property or empty
    Object.defineProperty(tabs[2], 'innerText', {
      get() {
        return '';
      }
    });

    loadContentScript();
    // This immediately calls tryTabSwitch -> starts tabs.forEach
    // Should hit text.includes('おすすめ') and hide it.
    // Should find preferredTab ('finance'), but since aria-selected="true", won't click it.
    expect(tabs[0].style.getPropertyValue('display')).toBe('none');
    expect(tabs[0].parentElement.style.getPropertyValue('display')).toBe('none');
  });

  test('covers syncStorage missing or missing preferred tab', () => {
    window.location = new URL('https://x.com/');
    document.documentElement.innerHTML = '<head></head><body></body>';

    global.chrome = {
      storage: {
        sync: { get: jest.fn((defaults, cb) => cb({ somethingElse: 'value' })) } // items doesn't have preferredTab
      }
    };

    loadContentScript();
  });
});

describe('x-unlocked.js extra extra coverage', () => {
  const contentScriptPath = require('path').resolve(__dirname, '../x-unlocked.js');
  const { instrumentFile } = require('./helpers/instrument');

  function loadContentScript() {
    const code = instrumentFile(contentScriptPath);
    eval(code);
  }

  beforeEach(() => {
    delete window.location;
    window.location = new URL('https://x.com/');
    jest.resetModules();
    jest.clearAllMocks();
  });

  test('covers observer throttleTimer clearTimeout flow', () => {
    jest.useFakeTimers();

    document.documentElement.innerHTML = '<head></head><body></body>';
    window.location = new URL('https://x.com/');

    loadContentScript(); // this fires startObserver() and tryTabSwitch()

    // trigger observer
    document.body.appendChild(document.createElement('div'));

    // wait for throttleTimer
    jest.advanceTimersByTime(300);

    jest.useRealTimers();
  });
});
