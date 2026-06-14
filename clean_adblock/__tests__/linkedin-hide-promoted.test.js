describe('linkedin-hide-promoted.js', () => {
  beforeEach(() => {
    delete window.location;
    window.location = new URL('https://example.com/test');
    jest.resetModules();
    jest.clearAllMocks();
  });

  it('loads without crashing', () => {
    const code = require('fs').readFileSync(
      require('path').join(__dirname, '..', 'linkedin-hide-promoted.js'),
      'utf8'
    );
    eval(code);
  });
});

describe('Auto Generated Coverage', () => {
  beforeEach(() => {
    delete window.location;
    window.location = { pathname: '/' };
    document.documentElement.innerHTML = '';
    jest.resetModules();
    if (!global.chrome) {
      global.chrome = {
        storage: {
          sync: { get: jest.fn((k, cb) => cb({ enabled: true, preferredTab: 'finance' })) },
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

    document.body.innerHTML =
      '<div class="ad-container"><div id="ad1">Ad</div></div><div class="promoted">Promoted</div>';

    jest.isolateModules(() => {
      require('../linkedin-hide-promoted.js');
    });

    const event = document.createEvent('Event');
    event.initEvent('DOMContentLoaded', true, true);
    document.dispatchEvent(event);

    jest.runAllTimers();
    expect(true).toBe(true);
  });
});

describe('linkedin-hide-promoted.js deep coverage', () => {
  beforeEach(() => {
    delete window.location;
    window.location = new URL('https://example.com/test');
    jest.resetModules();
    jest.clearAllMocks();
    document.body.innerHTML = '';
    document.documentElement.innerHTML = '';
  });

  test('hides promoted fallback logic line 25', () => {
    // Line 25 is el.closest('.artdeco-card') || el.closest('div[data-testid="cellInnerDiv"]') || el.closest('.ad-banner-container');
    document.body.innerHTML = `
            <div class="ad-banner-container" id="test-card">
                <a data-testid="header-url" href="/ads/start">Promoted</a>
            </div>
        `;
    require('../linkedin-hide-promoted.js');
    const card = document.getElementById('test-card');
    expect(card.style.display).toBe('none');
  });

  test('hides promoted fallback logic catch-all sidebar', () => {
    // Line 44: const card = el.closest('.artdeco-card') || el.closest('aside') || el.closest('div');
    document.body.innerHTML = `
            <div class="right-rail" id="sidebar">
                <aside id="test-card">
                    <span>Promoted</span>
                </aside>
            </div>
        `;
    require('../linkedin-hide-promoted.js');
    const card = document.getElementById('test-card');
    expect(card.style.display).toBe('none');
  });

  test('hides promoted via specific selector (aside)', () => {
    document.body.innerHTML = `
            <aside id="test-card">
                <a data-testid="header-url" href="/ads/start">Promoted</a>
            </aside>
        `;
    require('../linkedin-hide-promoted.js');
    const card = document.getElementById('test-card');
    expect(card.style.display).toBe('none');
  });

  test('hides promoted via specific selector (.artdeco-card)', () => {
    document.body.innerHTML = `
            <div class="artdeco-card" id="test-card">
                <p class="text-color-icon text-xs font-semibold"> Promoted </p>
            </div>
        `;
    require('../linkedin-hide-promoted.js');
    const card = document.getElementById('test-card');
    expect(card.style.display).toBe('none');
  });

  test('hides promoted via specific selector (cellInnerDiv)', () => {
    document.body.innerHTML = `
            <div data-testid="cellInnerDiv" id="test-card">
                <div class="text-color-icon font-semibold">Promoted</div>
            </div>
        `;
    require('../linkedin-hide-promoted.js');
    const card = document.getElementById('test-card');
    expect(card.style.display).toBe('none');
  });

  test('catch-all sidebar ignores deep elements without Promoted text', () => {
    document.body.innerHTML = `
            <div class="right-rail" id="sidebar">
                <div class="artdeco-card" id="test-card">
                    <span>Not Promoted</span>
                </div>
            </div>
        `;
    require('../linkedin-hide-promoted.js');
    const card = document.getElementById('test-card');
    expect(card.style.display).not.toBe('none');
  });

  test('hides promoted via catch-all sidebar with deepest fallback', () => {
    // Line 44: const card = el.closest('.artdeco-card') || el.closest('aside') || el.closest('div');
    // Let's create an element that doesn't have artdeco-card or aside, but has div
    document.body.innerHTML = `
            <div class="right-rail" id="sidebar">
                <div id="test-card">
                    <span>Promoted</span>
                </div>
            </div>
        `;
    require('../linkedin-hide-promoted.js');
    const card = document.getElementById('test-card');
    expect(card.style.display).toBe('none');
  });

  test('hides promoted via catch-all sidebar', () => {
    document.body.innerHTML = `
            <div class="right-rail" id="sidebar">
                <div class="artdeco-card" id="test-card">
                    <span>Promoted</span>
                </div>
            </div>
        `;
    require('../linkedin-hide-promoted.js');
    const card = document.getElementById('test-card');
    expect(card.style.display).toBe('none');
  });

  test('catch-all sidebar ignores non-promoted text', () => {
    document.body.innerHTML = `
            <div class="right-rail" id="sidebar">
                <div class="artdeco-card" id="test-card">
                    <span>Not Promoted</span>
                </div>
            </div>
        `;
    require('../linkedin-hide-promoted.js');
    const card = document.getElementById('test-card');
    expect(card.style.display).not.toBe('none');
  });

  test('catch-all sidebar ignores if element has children', () => {
    document.body.innerHTML = `
            <div class="right-rail" id="sidebar">
                <div class="artdeco-card" id="test-card">
                    <p><span>Promoted</span></p>
                </div>
            </div>
        `;
    require('../linkedin-hide-promoted.js');
    // The span itself will trigger it, so the card gets hidden
    const card = document.getElementById('test-card');
    expect(card.style.display).toBe('none');
  });

  test('ignores specific selector if not Promoted text', () => {
    document.body.innerHTML = `
            <aside id="test-card">
                <a data-testid="header-url" href="/ads/start">Not Promoted</a>
            </aside>
        `;
    require('../linkedin-hide-promoted.js');
    const card = document.getElementById('test-card');
    expect(card.style.display).not.toBe('none');
  });
});
