const fs = require('fs');
const path = require('path');

function loadScript() {
  const code = fs.readFileSync(path.join(__dirname, 'gurufocus-unlocked.js'), 'utf8');
  eval(code);
}

function setupLocation() {
  Object.defineProperty(window, 'location', {
    value: {
      hostname: 'www.gurufocus.com',
      pathname: '/stock/ANET/forecast',
    },
    writable: true,
    configurable: true,
  });
}

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

describe('GuruFocus Unlocked - blur removal', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    document.head.innerHTML = '';
    document.body.innerHTML = '';
    delete window.__NUXT__;
    setupLocation();
  });
  afterEach(() => jest.useRealTimers());

  test('removes .blur class from elements', () => {
    document.body.innerHTML = '<div class="blur" id="t1">content</div>';
    loadScript();
    jest.advanceTimersByTime(1000);
    expect(document.getElementById('t1').classList.contains('blur')).toBe(false);
  });

  test('clears inline filter:blur style', () => {
    document.body.innerHTML = '<div id="t2" style="filter: blur(5px); pointer-events: none;">content</div>';
    loadScript();
    jest.advanceTimersByTime(1000);
    const el = document.getElementById('t2');
    expect(el.style.filter).not.toContain('blur');
    expect(el.style.pointerEvents).not.toBe('none');
  });

  test('handles element with BOTH .blur class AND inline blur style', () => {
    document.body.innerHTML = `
      <div data-v-5ccaf75f="" class="blur" id="t3" style="filter: blur(5px); pointer-events: none;">
        <div class="el-row"><div>Average Price Target $308.44</div></div>
      </div>
    `;
    loadScript();
    jest.advanceTimersByTime(1000);
    const el = document.getElementById('t3');
    expect(el.classList.contains('blur')).toBe(false);
    expect(el.style.filter).not.toContain('blur');
    expect(el.style.pointerEvents).not.toBe('none');
  });
});

describe('GuruFocus Unlocked - blur image removal', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    document.head.innerHTML = '';
    document.body.innerHTML = '';
    delete window.__NUXT__;
    setupLocation();
  });
  afterEach(() => jest.useRealTimers());

  test('removes img elements with blur.png src', () => {
    document.body.innerHTML = `
      <div id="parent">
        <img data-v-0461ef4d="" src="https://static.gurufocus.com/images/blur.png">
        <div>Real content</div>
      </div>
    `;
    loadScript();
    jest.advanceTimersByTime(1000);
    expect(document.querySelectorAll('img[src*="blur"]').length).toBe(0);
    expect(document.getElementById('parent').textContent).toContain('Real content');
  });

  test('removes multiple blur images', () => {
    document.body.innerHTML = `
      <div>
        <img src="https://static.gurufocus.com/images/blur.png">
        <img src="https://static.gurufocus.com/images/blur.png">
      </div>
    `;
    loadScript();
    jest.advanceTimersByTime(1000);
    expect(document.querySelectorAll('img[src*="blur"]').length).toBe(0);
  });

  test('injected CSS hides blur images', () => {
    document.body.innerHTML = '<div>content</div>';
    loadScript();
    jest.advanceTimersByTime(1000);
    const allCSS = Array.from(document.querySelectorAll('style')).map(s => s.textContent).join('\n');
    expect(allCSS).toContain('img[src*="blur"]');
    expect(allCSS).toContain('display: none !important');
  });

  test('does not remove non-blur images', () => {
    document.body.innerHTML = `
      <div>
        <img id="keep" src="https://static.gurufocus.com/images/logo.png">
        <img src="https://static.gurufocus.com/images/blur.png">
      </div>
    `;
    loadScript();
    jest.advanceTimersByTime(1000);
    expect(document.getElementById('keep')).not.toBeNull();
    expect(document.querySelectorAll('img[src*="blur"]').length).toBe(0);
  });
});

describe('GuruFocus Unlocked - MutationObserver blur image (real timers)', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
    document.body.innerHTML = '';
    delete window.__NUXT__;
    setupLocation();
  });

  test('catches dynamically inserted blur image', async () => {
    document.body.innerHTML = '<div id="container"></div>';
    loadScript();
    await wait(600);

    const img = document.createElement('img');
    img.src = 'https://static.gurufocus.com/images/blur.png';
    document.getElementById('container').appendChild(img);

    await wait(50);
    expect(document.querySelectorAll('img[src*="blur"]').length).toBe(0);
  });
});

describe('GuruFocus Unlocked - MutationObserver (real timers)', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
    document.body.innerHTML = '';
    delete window.__NUXT__;
    setupLocation();
  });

  test('catches Vue re-applying .blur class after removal', async () => {
    document.body.innerHTML = '<div id="t4">content</div>';
    loadScript();
    await wait(600);

    const el = document.getElementById('t4');
    el.classList.add('blur');
    await wait(50);
    expect(el.classList.contains('blur')).toBe(false);
  });

  test('catches Vue re-applying inline blur style after removal', async () => {
    document.body.innerHTML = '<div id="t5">content</div>';
    loadScript();
    await wait(600);

    const el = document.getElementById('t5');
    el.style.filter = 'blur(5px)';
    el.style.pointerEvents = 'none';
    await wait(50);
    expect(el.style.filter).not.toContain('blur');
    expect(el.style.pointerEvents).not.toBe('none');
  });

  test('catches dynamically inserted blurred element', async () => {
    document.body.innerHTML = '<div id="container"></div>';
    loadScript();
    await wait(600);

    const blurred = document.createElement('div');
    blurred.className = 'blur';
    blurred.id = 'dynamic';
    blurred.style.filter = 'blur(5px)';
    blurred.style.pointerEvents = 'none';
    document.getElementById('container').appendChild(blurred);

    await wait(50);
    const el = document.getElementById('dynamic');
    expect(el.classList.contains('blur')).toBe(false);
    expect(el.style.filter).not.toContain('blur');
  });

  test('Vue re-applying blur repeatedly is caught each time', async () => {
    document.body.innerHTML = '<div id="t6">content</div>';
    loadScript();
    await wait(600);

    const el = document.getElementById('t6');

    // Simulate Vue re-applying 3 times
    for (let i = 0; i < 3; i++) {
      el.classList.add('blur');
      el.style.filter = 'blur(5px)';
      el.style.pointerEvents = 'none';
      await wait(50);
      expect(el.classList.contains('blur')).toBe(false);
      expect(el.style.filter).not.toContain('blur');
    }
  });
});

describe('GuruFocus Unlocked - subscribe card removal', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    document.head.innerHTML = '';
    document.body.innerHTML = '';
    delete window.__NUXT__;
    setupLocation();
  });
  afterEach(() => jest.useRealTimers());

  test('removes subscribe-card elements', () => {
    document.body.innerHTML = `
      <div>
        <a class="subscribe-card-small block subscribe-card" href="/pricing">
          <div>Subscribe to unlock this section</div>
        </a>
      </div>
    `;
    loadScript();
    jest.advanceTimersByTime(1000);
    expect(document.querySelectorAll('.subscribe-card').length).toBe(0);
    expect(document.querySelectorAll('.subscribe-card-small').length).toBe(0);
  });

  test('removes both subscribe cards on forecast page', () => {
    document.body.innerHTML = `
      <div>
        <a data-v-51ed5f42="" data-v-5ccaf75f="" class="subscribe-card-small block subscribe-card">Card 1</a>
        <a data-v-51ed5f42="" data-v-1ad0a5d4="" class="subscribe-card-small block subscribe-card">Card 2</a>
      </div>
    `;
    loadScript();
    jest.advanceTimersByTime(1000);
    expect(document.querySelectorAll('.subscribe-card').length).toBe(0);
  });
});

describe('GuruFocus Unlocked - paywall overlay removal', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    document.head.innerHTML = '';
    document.body.innerHTML = '';
    delete window.__NUXT__;
    setupLocation();
  });
  afterEach(() => jest.useRealTimers());

  test('removes all paywall element types', () => {
    document.body.innerHTML = `
      <div class="paywall-shadow">1</div>
      <div class="paywall-node">2</div>
      <div class="el-dialog__wrapper gf">3</div>
      <div class="v-modal">4</div>
    `;
    document.body.style.overflow = 'hidden';
    loadScript();
    jest.advanceTimersByTime(1000);
    expect(document.querySelectorAll('.paywall-shadow, .paywall-node, .el-dialog__wrapper.gf, .v-modal').length).toBe(0);
    expect(document.body.style.overflow).toBe('visible');
  });
});

describe('GuruFocus Unlocked - forecast data from Vue components', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
    document.body.innerHTML = '';
    delete window.__NUXT__;
    setupLocation();
  });

  function createVueElement(estimateData, priceData, opts = {}) {
    const el = document.createElement('div');
    el.setAttribute('data-v-5ccaf75f', '');
    el.__vue__ = {
      loading: opts.loading || false,
      noData: opts.noData || false,
      estimateData: estimateData,
      priceData: priceData,
    };
    return el;
  }

  test('renders forecast card with estimateData and priceData', async () => {
    const estimateData = {
      stockid: 'US01WD',
      high: 400,
      low: 215,
      med: 310,
      mean: 308.44,
      num: 39,
      entry_date: '2026-05-22',
    };
    const priceData = [
      ['2026-05-20', 250],
      ['2026-05-21', 255.5],
    ];
    const container = document.createElement('div');
    container.className = 'el-main';
    const vueEl = createVueElement(estimateData, priceData);
    container.appendChild(vueEl);
    document.body.appendChild(container);

    loadScript();
    await wait(600);

    const card = document.querySelector('.gf-u-forecast');
    expect(card).not.toBeNull();
    expect(card.textContent).toContain('308.44');
    expect(card.textContent).toContain('400.00');
    expect(card.textContent).toContain('215.00');
    expect(card.textContent).toContain('310.00');
    expect(card.textContent).toContain('39');
    expect(card.textContent).toContain('255.50');
    expect(card.textContent).toContain('2026-05-22');
  });

  test('computes upside percentage correctly', async () => {
    const estimateData = { high: 300, low: 100, med: 200, mean: 200, num: 10, entry_date: '2026-01-01' };
    const priceData = [['2026-01-01', 100]]; // mean=200, price=100 → +100% upside
    const container = document.createElement('div');
    container.className = 'el-main';
    container.appendChild(createVueElement(estimateData, priceData));
    document.body.appendChild(container);

    loadScript();
    await wait(600);

    const card = document.querySelector('.gf-u-forecast');
    expect(card).not.toBeNull();
    expect(card.textContent).toContain('+100.00%');
  });

  test('shows negative upside for overvalued stock', async () => {
    const estimateData = { high: 150, low: 50, med: 100, mean: 100, num: 5, entry_date: '2026-01-01' };
    const priceData = [['2026-01-01', 200]]; // mean=100, price=200 → -50% upside
    const container = document.createElement('div');
    container.className = 'el-main';
    container.appendChild(createVueElement(estimateData, priceData));
    document.body.appendChild(container);

    loadScript();
    await wait(600);

    const card = document.querySelector('.gf-u-forecast');
    expect(card.textContent).toContain('-50.00%');
  });

  test('does not render forecast when loading is true', async () => {
    const estimateData = { high: 300, low: 100, med: 200, mean: 200, num: 10 };
    const container = document.createElement('div');
    container.className = 'el-main';
    container.appendChild(createVueElement(estimateData, [], { loading: true }));
    document.body.appendChild(container);

    loadScript();
    await wait(600);

    expect(document.querySelector('.gf-u-forecast')).toBeNull();
  });

  test('does not render forecast when noData is true', async () => {
    const estimateData = { high: 300, low: 100, med: 200, mean: 200, num: 10 };
    const container = document.createElement('div');
    container.className = 'el-main';
    container.appendChild(createVueElement(estimateData, [], { noData: true }));
    document.body.appendChild(container);

    loadScript();
    await wait(600);

    expect(document.querySelector('.gf-u-forecast')).toBeNull();
  });

  test('does not render forecast on non-forecast pages', async () => {
    window.location.pathname = '/stock/AAPL/summary';
    const estimateData = { high: 300, low: 100, med: 200, mean: 200, num: 10 };
    const container = document.createElement('div');
    container.className = 'el-main';
    container.appendChild(createVueElement(estimateData, [['2026-01-01', 100]]));
    document.body.appendChild(container);

    loadScript();
    await wait(600);

    expect(document.querySelector('.gf-u-forecast')).toBeNull();
  });

  test('does not duplicate forecast card on repeated calls', async () => {
    const estimateData = { high: 300, low: 100, med: 200, mean: 200, num: 10 };
    const container = document.createElement('div');
    container.className = 'el-main';
    container.appendChild(createVueElement(estimateData, [['2026-01-01', 100]]));
    document.body.appendChild(container);

    loadScript();
    await wait(600);

    // Wait more to ensure periodic re-runs don't duplicate
    await wait(3000);
    expect(document.querySelectorAll('.gf-u-forecast').length).toBe(1);
  });

  test('renders without priceData (no current price / upside)', async () => {
    const estimateData = { high: 300, low: 100, med: 200, mean: 200, num: 10 };
    const container = document.createElement('div');
    container.className = 'el-main';
    container.appendChild(createVueElement(estimateData, null));
    document.body.appendChild(container);

    loadScript();
    await wait(600);

    const card = document.querySelector('.gf-u-forecast');
    expect(card).not.toBeNull();
    expect(card.textContent).toContain('200.00');
    expect(card.textContent).not.toContain('Current Price');
    expect(card.textContent).not.toContain('Upside');
  });
});

describe('GuruFocus Unlocked - full forecast page simulation', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
    document.body.innerHTML = '';
    delete window.__NUXT__;
    setupLocation();
  });

  test('cleans up realistic forecast DOM and handles Vue re-applying blur', async () => {
    document.body.innerHTML = `
      <div class="el-main">
        <div class="stock-header">ANET</div>
        <div>
          <div data-v-5ccaf75f="" class="blur" id="section-1" style="filter: blur(5px); pointer-events: none;">
            <div class="el-row">
              <div class="text-center">Average Price Target</div>
              <div class="average-price">$308.44</div>
            </div>
          </div>
          <a data-v-51ed5f42="" data-v-5ccaf75f="" href="/pricing" class="subscribe-card-small block subscribe-card">
            <div>Subscribe to unlock this section</div>
          </a>
          <div data-v-5ccaf75f="" class="blur" id="section-2" style="filter: blur(5px); pointer-events: none;">
            <div class="gf-chart">Chart</div>
          </div>
          <a data-v-51ed5f42="" data-v-1ad0a5d4="" href="/pricing" class="subscribe-card-small block subscribe-card">
            <div>Subscribe to unlock this section</div>
          </a>
        </div>
      </div>
    `;
    document.body.style.overflow = 'hidden';

    loadScript();
    await wait(600);

    // Both sections unblurred
    for (const id of ['section-1', 'section-2']) {
      const el = document.getElementById(id);
      expect(el.classList.contains('blur')).toBe(false);
      expect(el.style.filter).not.toContain('blur');
      expect(el.style.pointerEvents).not.toBe('none');
    }

    // Subscribe cards gone
    expect(document.querySelectorAll('.subscribe-card').length).toBe(0);
    expect(document.body.style.overflow).toBe('visible');

    // CSS injected with blur override
    const allCSS = Array.from(document.querySelectorAll('style')).map(s => s.textContent).join('\n');
    expect(allCSS).toContain('.blur');
    expect(allCSS).toContain('filter: none !important');

    // Now simulate Vue re-applying blur
    const el = document.getElementById('section-1');
    el.classList.add('blur');
    el.style.filter = 'blur(5px)';
    el.style.pointerEvents = 'none';

    await wait(50);
    expect(el.classList.contains('blur')).toBe(false);
    expect(el.style.filter).not.toContain('blur');
    expect(el.style.pointerEvents).not.toBe('none');
  });
});
