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
});
