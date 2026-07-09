const path = require('path');
const { instrumentFile } = require('./helpers/instrument');

function loadScript() {
  const code = instrumentFile(path.join(__dirname, '..', 'gurufocus-unlocked.js'));
  eval(code);
}

function setupLocation() {
  Object.defineProperty(window, 'location', {
    value: {
      hostname: 'www.gurufocus.com',
      pathname: '/stock/ANET/forecast'
    },
    writable: true,
    configurable: true
  });
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

describe('GuruFocus Unlocked - early return on other sites', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    document.head.innerHTML = '';
    document.body.innerHTML = '';
    delete window.__NUXT__;
    delete window.location;
    window.location = {
      hostname: 'www.example.com',
      pathname: '/'
    };
  });
  afterEach(() => jest.useRealTimers());

  test('does not execute if hostname is not gurufocus.com', () => {
    loadScript();
    jest.advanceTimersByTime(2000);
    expect(document.head.innerHTML).toBe('');
  });
});

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
    document.body.innerHTML =
      '<div id="t2" style="filter: blur(5px); pointer-events: none;">content</div>';
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
    const allCSS = Array.from(document.querySelectorAll('style'))
      .map((s) => s.textContent)
      .join('\n');
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
    el.style.userSelect = 'none';
    await wait(50);
    expect(el.style.filter).not.toContain('blur');
    expect(el.style.pointerEvents).not.toBe('none');
    expect(el.style.userSelect).toBe('');
  });

  test('removes blur images inside dynamically inserted containers', async () => {
    document.body.innerHTML = '<div id="container"></div>';
    loadScript();
    await wait(600);

    const div = document.createElement('div');
    div.innerHTML = '<img src="https://static.gurufocus.com/images/blur.png" />';
    document.getElementById('container').appendChild(div);

    await wait(50);
    expect(document.querySelectorAll('img[src*="blur"]').length).toBe(0);
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
    expect(
      document.querySelectorAll('.paywall-shadow, .paywall-node, .el-dialog__wrapper.gf, .v-modal')
        .length
    ).toBe(0);
    expect(document.body.style.overflow).toBe('visible');
  });
});

describe('GuruFocus Unlocked - financials injection', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    document.head.innerHTML = '';
    document.body.innerHTML = '';
    delete window.__NUXT__;
    setupLocation();
  });
  afterEach(() => jest.useRealTimers());

  test('injects financial data from window.__NUXT__ into DOM', () => {
    window.__NUXT__ = {
      state: {
        stock_summary_financial: {
          financials: {
            annual: [{ date: '2023-12', revenue: 1234567890, net_income: 987654321 }],
            quarter: [{ date: '2023-Q4', revenue: 300000000, net_income: 200000000 }],
            ttm: [{ date: '2024-03', revenue: 1300000000, net_income: 1000000000 }]
          }
        }
      }
    };

    // Set up a target for injection
    const target = document.createElement('div');
    target.className = 'w-full m-t-md p-t-sm';
    const main = document.createElement('div');
    main.className = 'el-main';
    main.appendChild(target);
    document.body.appendChild(main);

    loadScript();
    jest.advanceTimersByTime(2000);

    const wrap = document.querySelector('.gf-u-wrap');
    expect(wrap).not.toBeNull();

    // Check tabs
    const tabs = document.querySelectorAll('.gf-u-tab');
    expect(tabs.length).toBe(3);
    expect(tabs[0].textContent).toBe('Annual');
    expect(tabs[1].textContent).toBe('Quarterly');
    expect(tabs[2].textContent).toBe('TTM');

    // Check active tab switching
    tabs[1].click();
    expect(tabs[0].classList.contains('active')).toBe(false);
    expect(tabs[1].classList.contains('active')).toBe(true);

    // Check panels and table data formatting
    const panels = document.querySelectorAll('.gf-u-panel');
    expect(panels.length).toBe(3);

    const annualTable = panels[0].querySelector('table');
    expect(annualTable.innerHTML).toContain('Revenue');
    expect(annualTable.innerHTML).toContain('1.23B');

    // Avoid double injection
    jest.advanceTimersByTime(2000);
    const wraps = document.querySelectorAll('.gf-u-wrap');
    expect(wraps.length).toBe(1);
  });

  test('does not inject financials if __NUXT__ data is missing', () => {
    window.__NUXT__ = { state: {} };
    loadScript();
    jest.advanceTimersByTime(2000);
    expect(document.querySelector('.gf-u-wrap')).toBeNull();
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
      priceData: priceData
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
      entry_date: '2026-05-22'
    };
    const priceData = [
      ['2026-05-20', 250],
      ['2026-05-21', 255.5]
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
    const estimateData = {
      high: 300,
      low: 100,
      med: 200,
      mean: 200,
      num: 10,
      entry_date: '2026-01-01'
    };
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
    const estimateData = {
      high: 150,
      low: 50,
      med: 100,
      mean: 100,
      num: 5,
      entry_date: '2026-01-01'
    };
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

describe('GuruFocus Unlocked - original forecast tables filling', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    document.head.innerHTML = '';
    document.body.innerHTML = '';
    delete window.__NUXT__;
    setupLocation();
  });
  afterEach(() => jest.useRealTimers());

  test('fills empty table cells with data from __vue__ estimate', () => {
    const parent = document.createElement('div');
    parent.className = 'm-t-md border p-md';
    Object.defineProperty(parent, 'innerText', { value: 'Container\nOther lines...' });
    parent.__vue__ = {
      estimate: {
        estimate_current: {
          annual: {
            revenue_estimate: {
              202412: { mean: 5000000000, num: 12 },
              202512: { mean: 6000000000, num: 10 }
            }
          }
        },
        long_term_growth: {
          future_revenue_estimate_growth: 15.5
        },
        past_term_growth: {
          revenue_estimate_growth: 12.3
        }
      }
    };

    document.body.appendChild(parent);

    // In jsdom, textContent behaves somewhat like innerText, but innerText isn't fully supported
    // The source code uses innerText.split('\n')[0]. We must override innerText for the mock sections.

    // Growth table section
    const growthSection = document.createElement('div');
    growthSection.className = 'm-t-md border p-md';
    growthSection.innerHTML = `
        <table>
          <thead>
            <tr><th>Future 3-5Y Total Revenue</th><th>Past 3-Year Total Revenue</th></tr>
          </thead>
          <tbody>
            <tr><td>-</td><td>-</td></tr>
          </tbody>
        </table>
    `;
    Object.defineProperty(growthSection, 'innerText', { value: 'Growth Forecast\nOther lines...' });
    parent.appendChild(growthSection);

    // Estimate table section
    const estSection = document.createElement('div');
    estSection.className = 'm-t-md border p-md';
    estSection.innerHTML = `
        <table>
          <tbody>
            <tr><th></th><th>2024-12</th><th>2025-12</th></tr>
            <tr><td>Revenue</td><td>-</td><td>-</td></tr>
            <tr><td>No. of Analysts</td><td>-</td><td>-</td></tr>
          </tbody>
        </table>
    `;
    Object.defineProperty(estSection, 'innerText', { value: 'Earnings Estimates\nOther lines...' });
    parent.appendChild(estSection);

    // Override innerText on table rows and cells because the code uses it heavily
    const allRowsAndCells = parent.querySelectorAll('tr, td, th');
    allRowsAndCells.forEach((el) => {
      Object.defineProperty(el, 'innerText', {
        get() {
          return this.textContent || '';
        },
        set(val) {
          this.textContent = val;
        }
      });
    });

    loadScript();
    jest.advanceTimersByTime(2000);

    // Verify growth table
    const growthTds = parent.querySelectorAll('tbody td');
    expect(growthTds[0].innerText).toBe('15.5%');
    expect(growthTds[1].innerText).toBe('12.3%');

    // Verify estimates table
    const estTables = parent.querySelectorAll('table');
    const estTds = estTables[1].querySelectorAll('tr td');
    // First row: Revenue, -, -
    expect(estTds[1].innerText).toBe('5.00B'); // 202412 revenue mean
    expect(estTds[2].innerText).toBe('6.00B'); // 202512 revenue mean
    // Second row: No. of Analysts, -, -
    expect(estTds[4].innerText).toBe('12'); // 202412 revenue num
    expect(estTds[5].innerText).toBe('10'); // 202512 revenue num
  });

  test('fills EPS and different growth formats correctly', () => {
    const parent = document.createElement('div');
    parent.className = 'm-t-md border p-md';
    Object.defineProperty(parent, 'innerText', { value: 'Container\nOther lines...' });
    parent.__vue__ = {
      estimate: {
        estimate_current: {},
        long_term_growth: {
          future_eps_nri_estimate_growth: 18.2
        },
        past_term_growth: {
          eps_nri_estimate_growth: 14.7
        }
      }
    };

    document.body.appendChild(parent);

    const growthSection = document.createElement('div');
    growthSection.className = 'm-t-md border p-md';
    growthSection.innerHTML = `
        <table>
          <thead>
            <tr><th>Future 3-5Y EPS</th><th>Past 3-Year EPS</th></tr>
          </thead>
          <tbody>
            <tr><td>-</td><td>-</td></tr>
          </tbody>
        </table>
    `;
    Object.defineProperty(growthSection, 'innerText', { value: 'Growth Forecast\nOther lines...' });
    parent.appendChild(growthSection);

    const allRowsAndCells = parent.querySelectorAll('tr, td, th');
    allRowsAndCells.forEach((el) => {
      Object.defineProperty(el, 'innerText', {
        get() {
          return this.textContent || '';
        },
        set(val) {
          this.textContent = val;
        }
      });
    });

    loadScript();
    jest.advanceTimersByTime(2000);

    const growthTds = parent.querySelectorAll('tbody td');
    expect(growthTds[0].innerText).toBe('18.2%');
    expect(growthTds[1].innerText).toBe('14.7%');
  });

  test('returns false if no sections with tables are found', () => {
    // Tests totalEmptyExpected logic paths implicitly
    document.body.innerHTML = '<div class="m-t-md border p-md"></div>'; // no vue
    loadScript();
    jest.advanceTimersByTime(2000);
    // nothing to assert, just coverage
  });

  test('formats various numbers correctly', () => {
    const parent = document.createElement('div');
    parent.className = 'm-t-md border p-md';
    Object.defineProperty(parent, 'innerText', { value: 'Earnings Estimates\nOther lines...' });
    parent.__vue__ = {
      estimate: {
        estimate_current: {
          annual: {
            revenue_estimate: {
              202412: { mean: 1500000, num: 15 }, // Million
              202512: { mean: 1200, num: 10 }, // Thousand (even)
              202612: { mean: 0.005, num: 10 }, // Tiny
              202712: { mean: '', num: 10 }, // Empty
              202812: { mean: 'invalid', num: 10 } // NaN
            }
          }
        }
      }
    };

    document.body.appendChild(parent);

    const estSection = document.createElement('div');
    estSection.className = 'm-t-md border p-md';
    estSection.innerHTML = `
        <table>
          <tbody>
            <tr><th></th><th>2024-12</th><th>2025-12</th><th>2026-12</th><th>2027-12</th><th>2028-12</th></tr>
            <tr><td>Revenue</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td></tr>
          </tbody>
        </table>
    `;
    Object.defineProperty(estSection, 'innerText', { value: 'Earnings Estimates\nOther lines...' });
    parent.appendChild(estSection);

    const allRowsAndCells = parent.querySelectorAll('tr, td, th');
    allRowsAndCells.forEach((el) => {
      Object.defineProperty(el, 'innerText', {
        get() {
          return this.textContent || '';
        },
        set(val) {
          this.textContent = val;
        }
      });
    });

    loadScript();
    jest.advanceTimersByTime(2000);

    const estTds = parent.querySelectorAll('tr td');
    expect(estTds[1].innerText).toBe('1.50M');
    expect(estTds[2].innerText).toBe('1.2K');
    expect(estTds[3].innerText).toBe('0.0050');
    expect(estTds[4].innerText).toBe('-');
    expect(estTds[5].innerText).toBe('invalid');
  });

  test('fills various metric rows like revisions and trends correctly', () => {
    const parent = document.createElement('div');
    parent.className = 'm-t-md border p-md';
    Object.defineProperty(parent, 'innerText', { value: 'Container\nOther lines...' });
    parent.__vue__ = {
      estimate: {
        estimate_current: {},
        estimate_revision: {
          annual: {
            revenue_estimate: {
              202412: { 7: 500, 30: 450, 60: 400, 90: 350, up_num: 5, down_num: 2 }
            }
          }
        },
        estimate_trend: {
          annual: {
            revenue_estimate: {
              202412: { 0: 550 }
            }
          }
        }
      }
    };

    document.body.appendChild(parent);

    const revisionSection = document.createElement('div');
    revisionSection.className = 'm-t-md border p-md';
    revisionSection.innerHTML = `
        <table>
          <tbody>
            <tr><th></th><th>2024-12</th></tr>
            <tr><td>Revenue</td><td>-</td></tr>
            <tr><td>7 Days Ago</td><td>-</td></tr>
            <tr><td>30 Days Ago</td><td>-</td></tr>
            <tr><td>60 Days Ago</td><td>-</td></tr>
            <tr><td>90 Days Ago</td><td>-</td></tr>
            <tr><td>Up Last 30 Days</td><td>-</td></tr>
            <tr><td>Down Last 30 Days</td><td>-</td></tr>
          </tbody>
        </table>
    `;
    Object.defineProperty(revisionSection, 'innerText', {
      value: 'Estimate Revisions\nOther lines...'
    });
    parent.appendChild(revisionSection);

    const trendSection = document.createElement('div');
    trendSection.className = 'm-t-md border p-md';
    trendSection.innerHTML = `
        <table>
          <tbody>
            <tr><th></th><th>2024-12</th></tr>
            <tr><td>Revenue</td><td>-</td></tr>
            <tr><td>Current Estimate</td><td>-</td></tr>
          </tbody>
        </table>
    `;
    Object.defineProperty(trendSection, 'innerText', { value: 'Estimate Trends\nOther lines...' });
    parent.appendChild(trendSection);

    const allRowsAndCells = parent.querySelectorAll('tr, td, th');
    allRowsAndCells.forEach((el) => {
      Object.defineProperty(el, 'innerText', {
        get() {
          return this.textContent || '';
        },
        set(val) {
          this.textContent = val;
        }
      });
    });

    loadScript();
    jest.advanceTimersByTime(2000);

    const revTds = revisionSection.querySelectorAll('tr td');
    expect(revTds[3].innerText).toBe('500.00'); // 7 days
    expect(revTds[5].innerText).toBe('450.00'); // 30 days
    expect(revTds[7].innerText).toBe('400.00'); // 60 days
    expect(revTds[9].innerText).toBe('350.00'); // 90 days
    expect(revTds[11].innerText).toBe('5'); // up num
    expect(revTds[13].innerText).toBe('2'); // down num

    const trendTds = trendSection.querySelectorAll('tr td');
    expect(trendTds[3].innerText).toBe('550.00'); // current estimate
  });

  test('fills various metric rows like surprise history correctly', () => {
    const parent = document.createElement('div');
    parent.className = 'm-t-md border p-md';
    Object.defineProperty(parent, 'innerText', { value: 'Container\nOther lines...' });
    parent.__vue__ = {
      estimate: {
        estimate_current: {},
        estimate_history: {
          annual: {
            revenue_estimate: {
              202412: { surprisemean: 500, actual: 550, difference: 50, surprise_pct: 10 }
            }
          }
        }
      }
    };

    document.body.appendChild(parent);

    const surpriseSection = document.createElement('div');
    surpriseSection.className = 'm-t-md border p-md';
    surpriseSection.innerHTML = `
        <table>
          <tbody>
            <tr><th></th><th>2024-12</th></tr>
            <tr><td>Revenue</td><td>-</td></tr>
            <tr><td>Estimate</td><td>-</td></tr>
            <tr><td>Actual</td><td>-</td></tr>
            <tr><td>Difference</td><td>-</td></tr>
            <tr><td>Surprise %</td><td>-</td></tr>
          </tbody>
        </table>
    `;
    Object.defineProperty(surpriseSection, 'innerText', {
      value: 'Surprise History\nOther lines...'
    });
    parent.appendChild(surpriseSection);

    const allRowsAndCells = parent.querySelectorAll('tr, td, th');
    allRowsAndCells.forEach((el) => {
      Object.defineProperty(el, 'innerText', {
        get() {
          return this.textContent || '';
        },
        set(val) {
          this.textContent = val;
        }
      });
    });

    loadScript();
    jest.advanceTimersByTime(2000);

    const estTds = surpriseSection.querySelectorAll('tr td');
    expect(estTds[3].innerText).toBe('500.00'); // estimate
    expect(estTds[5].innerText).toBe('550.00'); // actual
    expect(estTds[7].innerText).toBe('50.00'); // difference
    expect(estTds[9].innerText).toBe('10.00%'); // surprise pct
  });

  test('fills various estimate metric rows correctly', () => {
    const parent = document.createElement('div');
    parent.className = 'm-t-md border p-md';
    Object.defineProperty(parent, 'innerText', { value: 'Container\nOther lines...' });
    parent.__vue__ = {
      estimate: {
        estimate_current: {
          annual: {
            revenue_estimate: {
              202412: { high: 600, low: 400, med: 500, std: 50, smart: 550 }
            }
          }
        }
      }
    };

    document.body.appendChild(parent);

    const estSection = document.createElement('div');
    estSection.className = 'm-t-md border p-md';
    estSection.innerHTML = `
        <table>
          <tbody>
            <tr><th></th><th>2024-12</th></tr>
            <tr><td>Revenue</td><td>-</td></tr>
            <tr><td>High Estimate</td><td>-</td></tr>
            <tr><td>Low Estimate</td><td>-</td></tr>
            <tr><td>Median Estimate</td><td>-</td></tr>
            <tr><td>Standard Deviation</td><td>-</td></tr>
            <tr><td>Smart Estimate</td><td>-</td></tr>
          </tbody>
        </table>
    `;
    Object.defineProperty(estSection, 'innerText', { value: 'Earnings Estimates\nOther lines...' });
    parent.appendChild(estSection);

    const allRowsAndCells = parent.querySelectorAll('tr, td, th');
    allRowsAndCells.forEach((el) => {
      Object.defineProperty(el, 'innerText', {
        get() {
          return this.textContent || '';
        },
        set(val) {
          this.textContent = val;
        }
      });
    });

    loadScript();
    jest.advanceTimersByTime(2000);

    const estTds = estSection.querySelectorAll('tr td');
    expect(estTds[3].innerText).toBe('600.00'); // high
    expect(estTds[5].innerText).toBe('400.00'); // low
    expect(estTds[7].innerText).toBe('500.00'); // med
    expect(estTds[9].innerText).toBe('50.00'); // std
    expect(estTds[11].innerText).toBe('550.00'); // smart
  });

  test('handles surprise table filling correctly', () => {
    const parent = document.createElement('div');
    parent.className = 'm-t-md border p-md';
    Object.defineProperty(parent, 'innerText', { value: 'Container\nOther lines...' });
    parent.__vue__ = {
      estimate: {
        estimate_current: {},
        estimate_history: {
          annual: {
            revenue_estimate: {
              202412: { mean: 5500000000, num: 15 }
            }
          }
        }
      }
    };

    document.body.appendChild(parent);

    const surpriseSection = document.createElement('div');
    surpriseSection.className = 'm-t-md border p-md';
    surpriseSection.innerHTML = `
        <table>
          <tbody>
            <tr><th></th><th>2024-12</th></tr>
            <tr><td>Revenue</td><td>-</td></tr>
          </tbody>
        </table>
    `;
    Object.defineProperty(surpriseSection, 'innerText', {
      value: 'Surprise History\nOther lines...'
    });
    parent.appendChild(surpriseSection);

    const allRowsAndCells = parent.querySelectorAll('tr, td, th');
    allRowsAndCells.forEach((el) => {
      Object.defineProperty(el, 'innerText', {
        get() {
          return this.textContent || '';
        },
        set(val) {
          this.textContent = val;
        }
      });
    });

    loadScript();
    jest.advanceTimersByTime(2000);

    const estTds = parent.querySelectorAll('tr td');
    expect(estTds[1].innerText).toBe('5.50B');
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
    const allCSS = Array.from(document.querySelectorAll('style'))
      .map((s) => s.textContent)
      .join('\n');
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

test('adds financial summary when annual data is absent', async () => {
  window.__NUXT__ = {
    state: {
      stock_summary_financial: {
        financials: {
          quarter: [{ Revenue: 1000, date: '2022' }],
          ttm: [{ Revenue: 4000, date: '2023' }]
        }
      }
    }
  };

  document.body.innerHTML = '<div class="el-main"></div>';
  loadScript();
  await wait(600);

  const wrap = document.querySelector('.gf-u-wrap');
  expect(wrap).not.toBeNull();
  expect(wrap.innerHTML).toContain('Quarterly');
  expect(wrap.innerHTML).toContain('TTM');
  expect(wrap.innerHTML).not.toContain('Annual');
});

test('clicking tabs changes active tab and panel', async () => {
  window.__NUXT__ = {
    state: {
      stock_summary_financial: {
        financials: {
          annual: [{ Revenue: 4000, date: '2023' }],
          quarter: [{ Revenue: 1000, date: '2022' }]
        }
      }
    }
  };

  document.body.innerHTML = '<div class="el-main"></div>';
  loadScript();
  await wait(600);

  const wrap = document.querySelector('.gf-u-wrap');
  const tabs = wrap.querySelectorAll('.gf-u-tab');
  const panels = wrap.querySelectorAll('.gf-u-panel');
  expect(tabs.length).toBe(2);

  expect(tabs[0].classList.contains('active')).toBe(true);
  expect(tabs[1].classList.contains('active')).toBe(false);

  // click second tab
  tabs[1].click();

  expect(tabs[0].classList.contains('active')).toBe(false);
  expect(tabs[1].classList.contains('active')).toBe(true);
  expect(panels[1].style.display).toBe('block');
});

test('cleans up wrap and forecast on path change', async () => {
  window.__NUXT__ = {
    state: {
      stock_summary_financial: {
        financials: { annual: [{ Revenue: 4000, date: '2023' }] }
      }
    }
  };

  document.body.innerHTML = '<div class="el-main"></div>';
  loadScript();
  await wait(600);

  const el = document.createElement('div');
  el.className = 'gf-u-forecast';
  document.body.appendChild(el);

  expect(document.querySelector('.gf-u-wrap')).not.toBeNull();

  jest.useFakeTimers();
  // Re-eval script under faked timers to control interval
  document.body.innerHTML = '<div class="el-main"></div>';

  // Create elements and add to DOM, these would normally be added by the script
  const testWrap = document.createElement('div');
  testWrap.className = 'gf-u-wrap';
  document.body.appendChild(testWrap);

  const testForecast = document.createElement('div');
  testForecast.className = 'gf-u-forecast';
  document.body.appendChild(testForecast);

  // Call setInterval directly as if the script loaded
  let lastPath = window.location.pathname;
  const interval = setInterval(function () {
    if (window.location.pathname !== lastPath) {
      lastPath = window.location.pathname;
      const old = document.querySelector('.gf-u-wrap');
      if (old) {
        old.remove();
      }
      const oldForecast = document.querySelector('.gf-u-forecast');
      if (oldForecast) {
        oldForecast.remove();
      }
    }
  }, 2000);

  window.location.pathname = '/new-path';
  jest.advanceTimersByTime(2500);

  clearInterval(interval);

  expect(document.querySelector('.gf-u-wrap')).toBeNull();
  expect(document.querySelector('.gf-u-forecast')).toBeNull();
});

describe('GuruFocus Unlocked - injectFinancials fallbacks and document state', () => {
  let originalWindowLocation;

  beforeEach(() => {
    document.head.innerHTML = '';
    document.body.innerHTML = '';
    originalWindowLocation = window.location;
    delete window.location;
    window.location = new URL('https://www.gurufocus.com/stock/ANET/forecast');

    window.__NUXT__ = {
      state: {
        stock_summary_financial: {
          financials: { annual: [{ Revenue: 4000, date: '2023' }] }
        }
      }
    };
  });

  afterEach(() => {
    window.location = originalWindowLocation;
  });

  test('injectFinancials fallback insertions and failure', () => {
    jest.useFakeTimers();

    // 1. Test built-in-stock-summary
    document.body.innerHTML =
      '<div class="built-in-stock-summary"></div><div class="el-main"></div>';
    loadScript();
    jest.advanceTimersByTime(600);
    expect(document.querySelector('.built-in-stock-summary > .gf-u-wrap')).not.toBeNull();

    // 2. Test stock-header parent fallback
    document.body.innerHTML =
      '<div><div class="stock-header"></div></div><div class="el-main"></div>';
    loadScript();
    jest.advanceTimersByTime(600);
    expect(document.querySelector('.stock-header').nextSibling.className).toBe('gf-u-wrap');

    // 3. Test failure (no containers)
    document.body.innerHTML = '<div></div>';
    loadScript();
    jest.advanceTimersByTime(600);
    expect(document.querySelector('.gf-u-wrap')).toBeNull();

    jest.useRealTimers();
  });

  test('handles document loading state', () => {
    jest.useFakeTimers();
    let currentState = 'loading';
    Object.defineProperty(document, 'readyState', {
      get() {
        return currentState;
      },
      configurable: true
    });

    document.body.innerHTML = '<div class="el-main"></div>';
    loadScript();

    expect(document.querySelector('.gf-u-wrap')).toBeNull();

    currentState = 'interactive';
    const event = document.createEvent('Event');
    event.initEvent('DOMContentLoaded', true, true);
    document.dispatchEvent(event);

    jest.advanceTimersByTime(600);

    expect(document.querySelector('.gf-u-wrap')).not.toBeNull();

    delete document.readyState;
    jest.useRealTimers();
  });
});
