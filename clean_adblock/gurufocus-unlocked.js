/**
 * GuruFocus Unlocked (MAIN world)
 * Removes paywall overlay elements and renders financial data from __NUXT__ state.
 */
(function () {
  'use strict';

  if (!window.location.hostname.endsWith('gurufocus.com')) {
    return;
  }

  // --- Anti-blur CSS ---
  let antiBlurInjected = false;
  function injectAntiBlur() {
    if (antiBlurInjected) {
      return;
    }
    const style = document.createElement('style');
    style.textContent =
      '.blur { filter: none !important; pointer-events: auto !important; user-select: auto !important; } [style*="blur"] { filter: none !important; pointer-events: auto !important; } .subscribe-card, .subscribe-card-small { display: none !important; } img[src*="blur"] { display: none !important; }';
    (document.head || document.documentElement).appendChild(style);
    antiBlurInjected = true;
  }

  // --- Paywall removal ---
  function removePaywall() {
    injectAntiBlur();
    document.body.style.overflow = 'visible';
    const els = document.querySelectorAll(
      '.paywall-shadow, .paywall-node, .el-dialog__wrapper.gf, .v-modal, .subscribe-card, .subscribe-card-small'
    );
    for (let i = 0; i < els.length; i++) {
      els[i].remove();
    }
    // Remove blur overlay images
    document.querySelectorAll('img[src*="blur"]').forEach(function (img) {
      img.remove();
    });
    // Remove .blur class and inline blur styles from elements
    document.querySelectorAll('.blur, [style*="blur"]').forEach(unblur);
  }

  /** @param {Element} el */
  function unblur(el) {
    if (!(el instanceof HTMLElement)) {
      return;
    }
    if (el.classList.contains('blur')) {
      el.classList.remove('blur');
    }
    if (el.style.filter && el.style.filter.indexOf('blur') !== -1) {
      el.style.filter = 'none';
    }
    if (el.style.pointerEvents === 'none') {
      el.style.pointerEvents = '';
    }
    if (el.style.userSelect === 'none') {
      el.style.userSelect = '';
    }
  }

  // --- MutationObserver: catch Vue reactivity re-applying blur ---
  const observer = new MutationObserver(function (mutations) {
    for (let i = 0; i < mutations.length; i++) {
      const m = mutations[i];
      if (m.type === 'attributes') {
        const el = m.target;
        if (el instanceof HTMLElement) {
          if (el.classList && el.classList.contains('blur')) {
            unblur(el);
          }
          if (el.style && el.style.filter && el.style.filter.indexOf('blur') !== -1) {
            unblur(el);
          }
        }
      }
      if (m.type === 'childList') {
        for (let j = 0; j < m.addedNodes.length; j++) {
          const node = m.addedNodes[j];
          if (!(node instanceof HTMLElement)) {
            continue;
          }
          // Remove blur overlay images
          if (node instanceof HTMLImageElement && node.src && node.src.indexOf('blur') !== -1) {
            node.remove();
            continue;
          }
          if (
            node.classList.contains('blur') ||
            (node.style && node.style.filter && node.style.filter.indexOf('blur') !== -1)
          ) {
            unblur(node);
          }
          /** @type {NodeListOf<HTMLElement>} */
          const blurred = node.querySelectorAll('.blur, [style*="blur"]');
          for (let k = 0; k < blurred.length; k++) {
            unblur(blurred[k]);
          }
          // Remove blur images inside added subtrees
          /** @type {NodeListOf<HTMLImageElement>} */
          const blurImgs = node.querySelectorAll('img[src*="blur"]');
          for (let l = 0; l < blurImgs.length; l++) {
            blurImgs[l].remove();
          }
        }
      }
    }
  });
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class', 'style'],
    childList: true,
    subtree: true
  });

  /**
   * @typedef {object} EstimateData
   * @property {number} mean
   * @property {number} high
   * @property {number} med
   * @property {number} low
   * @property {number} num
   * @property {string} [entry_date]
   */

  /**
   * @returns {{ estimateData: EstimateData, priceData: Array<Array<string>> | undefined } | null}
   */
  function getForecastVueContext() {
    const vueEl = document.querySelector('[data-v-5ccaf75f]');
    const vueObj = vueEl
      ? /** @type {Record<string, unknown>} */ (/** @type {unknown} */ (vueEl))['__vue__']
      : null;
    if (!vueEl || !vueObj) {
      return null;
    }
    const vm =
      /** @type {{ loading?: boolean, noData?: boolean, estimateData?: EstimateData, priceData?: Array<Array<string>> }} */ (
        vueObj
      );
    if (vm.loading || vm.noData || !vm.estimateData) {
      return null;
    }
    return { estimateData: vm.estimateData, priceData: vm.priceData };
  }

  /**
   * @param {EstimateData} est
   * @param {Array<Array<string>> | undefined} priceData
   * @returns {string}
   */
  function buildForecastHtml(est, priceData) {
    const currentPrice =
      priceData && priceData.length ? parseFloat(priceData[priceData.length - 1][1]) : null;
    const isPositive = currentPrice ? est.mean >= currentPrice : false;
    const upside = currentPrice
      ? (((est.mean - currentPrice) / currentPrice) * 100).toFixed(2)
      : null;
    const upsideColor = isPositive ? '#67c23a' : '#f56c6c';

    return (
      '<div class="gf-u-forecast" style="padding:16px;margin:12px 0;background:#fff;border:1px solid #eee;border-radius:8px;font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,sans-serif;">' +
      '<h3 style="margin:0 0 12px;font-size:16px;color:#333;">Analyst Price Target</h3>' +
      '<div style="display:flex;gap:24px;flex-wrap:wrap;align-items:center;">' +
      '<div style="text-align:center;padding-right:24px;border-right:1px solid #eee;">' +
      '<div style="font-size:13px;color:#666;">Average Target</div>' +
      '<div style="font-size:28px;font-weight:700;color:' +
      upsideColor +
      ';">$' +
      est.mean.toFixed(2) +
      '</div>' +
      (upside !== null
        ? '<div style="font-size:14px;color:' +
          upsideColor +
          ';">(' +
          (isPositive ? '+' : '') +
          upside +
          '% Upside)</div>'
        : '') +
      '</div>' +
      '<div style="display:flex;gap:20px;">' +
      '<div style="text-align:center;"><div style="font-size:12px;color:#999;">High</div><div style="font-size:18px;font-weight:600;color:#67c23a;">$' +
      est.high.toFixed(2) +
      '</div></div>' +
      '<div style="text-align:center;"><div style="font-size:12px;color:#999;">Median</div><div style="font-size:18px;font-weight:600;color:#333;">$' +
      est.med.toFixed(2) +
      '</div></div>' +
      '<div style="text-align:center;"><div style="font-size:12px;color:#999;">Low</div><div style="font-size:18px;font-weight:600;color:#f56c6c;">$' +
      est.low.toFixed(2) +
      '</div></div>' +
      '<div style="text-align:center;"><div style="font-size:12px;color:#999;">Analysts</div><div style="font-size:18px;font-weight:600;color:#333;">' +
      est.num +
      '</div></div>' +
      '</div>' +
      '</div>' +
      (currentPrice !== null
        ? '<div style="margin-top:8px;font-size:13px;color:#666;">Current Price: <strong>$' +
          currentPrice.toFixed(2) +
          '</strong> | Updated: ' +
          (est.entry_date || '') +
          '</div>'
        : '') +
      '</div>'
    );
  }

  /**
   * @param {string} html
   * @returns {boolean}
   */
  function insertForecastHtml(html) {
    let inserted = false;
    const blurImgParents = document.querySelectorAll('[data-v-5ccaf75f]');
    for (let i = 0; i < blurImgParents.length; i++) {
      const parent = blurImgParents[i];
      const parentVueObj = /** @type {Record<string, unknown>} */ (/** @type {unknown} */ (parent))[
        '__vue__'
      ];
      const parentVm = /** @type {{ estimateData?: unknown } | undefined} */ (parentVueObj);
      if (parentVm && parentVm.estimateData && !inserted) {
        const wrap = document.createElement('div');
        wrap.innerHTML = html;
        if (parent.parentElement && wrap.firstChild) {
          parent.parentElement.insertBefore(wrap.firstChild, parent);
        }
        inserted = true;
        break;
      }
    }
    if (!inserted) {
      const main = document.querySelector('.el-main');
      if (main) {
        const wrap = document.createElement('div');
        wrap.innerHTML = html;
        if (wrap.firstChild) {
          main.insertBefore(wrap.firstChild, main.firstChild);
        }
        inserted = true;
      }
    }
    return inserted;
  }

  // --- Forecast data rendering from Vue components ---
  function injectForecast() {
    if (document.querySelector('.gf-u-forecast')) {
      return true;
    }
    if (!/\/forecast/.test(window.location.pathname)) {
      return false;
    }

    const ctx = getForecastVueContext();
    if (!ctx) {
      return false;
    }

    const html = buildForecastHtml(ctx.estimateData, ctx.priceData);
    return insertForecastHtml(html);
  }

  // --- Shared Utilities ---
  const CSS =
    '<style>' +
    '.gf-u-wrap{padding:15px;overflow-x:auto;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif}' +
    '.gf-u-tabs{display:flex;gap:4px;margin-bottom:12px}' +
    '.gf-u-tab{padding:6px 16px;border:1px solid #ddd;background:#f5f7fa;border-radius:4px 4px 0 0;cursor:pointer;font-size:13px}' +
    '.gf-u-tab.active{background:#fff;border-bottom-color:#fff;font-weight:600;color:#409eff}' +
    '.gf-u-table{border-collapse:collapse;width:100%;font-size:13px}' +
    '.gf-u-table th{padding:6px 10px;text-align:right;border-bottom:2px solid #ddd;background:#f5f7fa;white-space:nowrap}' +
    '.gf-u-table th:first-child{text-align:left}' +
    '.gf-u-table td{padding:5px 10px;text-align:right;border-bottom:1px solid #eee}' +
    '.gf-u-table td:first-child{text-align:left;white-space:nowrap}' +
    '.gf-u-table tr:nth-child(even){background:#f9f9f9}' +
    '.gf-u-table tr:hover{background:#eef5ff}' +
    '</style>';

  /** @type {Record<string, number>} */
  const SKIP = {
    '': 1,
    date: 1,
    fiscal_year: 1,
    year: 1,
    id: 1,
    stock_id: 1,
    company_id: 1,
    exchange_id: 1,
    currency: 1,
    currency_id: 1,
    preliminary: 1,
    restated_date: 1
  };

  /** @param {number|string|null|undefined} v */
  function fmt(v) {
    if (v === null || v === undefined || v === '') {
      return '-';
    }
    const n = typeof v === 'number' ? v : parseFloat(String(v));
    if (isNaN(n)) {
      return String(v);
    }
    if (Math.abs(n) >= 1e9) {
      return (n / 1e9).toFixed(2) + 'B';
    }
    if (Math.abs(n) >= 1e6) {
      return (n / 1e6).toFixed(2) + 'M';
    }
    if (Math.abs(n) >= 1e3 && n % 1 === 0) {
      return (n / 1e3).toFixed(1) + 'K';
    }
    if (Math.abs(n) < 0.01 && n !== 0) {
      return n.toFixed(4);
    }
    return n.toFixed(2);
  }

  /** @type {Record<string, string>} */
  const LABEL_TO_METRIC = {
    revenue: 'revenue_estimate',
    'eps without nri': 'eps_nri_estimate',
    eps: 'per_share_eps_estimate',
    'dividends per share': 'dividend_estimate',
    ebit: 'ebit_estimate',
    ebitda: 'ebitda_estimate',
    'pretax income': 'pretax_income_estimate',
    'net income': 'net_income_estimate',
    'book value per share': 'book_value_per_share_estimate',
    'operating cash flow per share': 'operating_cash_flow_per_share_estimate',
    'gross margin': 'gross_margin_estimate',
    roa: 'roa_estimate',
    roe: 'roe_estimate'
  };

  /**
   * @typedef {Object} VueComponent
   * @property {VueComponent} [$parent]
   * @property {{ estimate_current?: Record<string, unknown>, long_term_growth?: { future_revenue_estimate_growth?: number, future_eps_nri_estimate_growth?: number }, past_term_growth?: { revenue_estimate_growth?: number, eps_nri_estimate_growth?: number }, estimate_history?: Record<string, unknown>, estimate_trend?: Record<string, unknown>, estimate_revision?: Record<string, unknown> }} [estimate]
   */

  /**
   * @typedef {Record<string, Record<string, Record<string, number | null>>>} TableSubData
   */
  /**
   * @typedef {{ annual?: TableSubData, quarterly?: TableSubData }} TableDataStructure
   */

  /** @returns {VueComponent|null} */
  function findEstimateViewModel() {
    const el = document.querySelector('.m-t-md.border.p-md');
    const elVueObj = el
      ? /** @type {Record<string, unknown>} */ (/** @type {unknown} */ (el))['__vue__']
      : null;
    if (!el || !elVueObj) {
      return null;
    }
    let vm = /** @type {VueComponent | null} */ (elVueObj);
    while (vm && !(vm.estimate && vm.estimate.estimate_current)) {
      vm = vm.$parent || null;
    }
    return vm && vm.estimate ? vm : null;
  }

  /**
   * @param {VueComponent} vm
   * @param {string} hText
   * @returns {number|null|undefined}
   */
  function getGrowthForecastValue(vm, hText) {
    if (!vm.estimate) {
      return null;
    }

    if (hText.indexOf('future 3-5y total revenue') !== -1) {
      return vm.estimate.long_term_growth
        ? vm.estimate.long_term_growth.future_revenue_estimate_growth
        : null;
    }
    if (hText.indexOf('past 3-year total revenue') !== -1) {
      return vm.estimate.past_term_growth
        ? vm.estimate.past_term_growth.revenue_estimate_growth
        : null;
    }
    if (hText.indexOf('future 3-5y eps') !== -1) {
      return vm.estimate.long_term_growth
        ? vm.estimate.long_term_growth.future_eps_nri_estimate_growth
        : null;
    }
    if (hText.indexOf('past 3-year eps') !== -1) {
      return vm.estimate.past_term_growth
        ? vm.estimate.past_term_growth.eps_nri_estimate_growth
        : null;
    }
    return null;
  }

  /**
   * @param {HTMLElement} table
   * @param {VueComponent} vm
   * @returns {boolean}
   */
  function fillGrowthForecastTable(table, vm) {
    let filledAny = false;
    /** @type {NodeListOf<HTMLElement>} */
    const gTds = table.querySelectorAll('tbody td');
    /** @type {NodeListOf<HTMLElement>} */
    const gThs = table.querySelectorAll('thead th');
    for (let c = 0; c < gThs.length; c++) {
      const gVal = getGrowthForecastValue(vm, gThs[c].innerText.toLowerCase());
      if (
        gVal != null &&
        gTds[c] &&
        (!gTds[c].innerText.trim() || gTds[c].innerText.trim() === '-')
      ) {
        gTds[c].innerText = String(gVal) + '%';
        gTds[c].style.color = '#409eff';
        gTds[c].style.fontWeight = 'bold';
        filledAny = true;
      }
    }
    return filledAny;
  }

  /**
   * @param {string} tableTitle
   * @param {VueComponent} vm
   * @param {Record<string, unknown>} est
   * @returns {TableDataStructure}
   */
  function getTableDataStructure(tableTitle, vm, est) {
    if (tableTitle.indexOf('surprise') !== -1) {
      return /** @type {TableDataStructure} */ (
        /** @type {unknown} */ (vm.estimate?.estimate_history || {})
      );
    } else if (tableTitle.indexOf('trends') !== -1) {
      return /** @type {TableDataStructure} */ (
        /** @type {unknown} */ (vm.estimate?.estimate_trend || {})
      );
    } else if (tableTitle.indexOf('revisions') !== -1) {
      return /** @type {TableDataStructure} */ (
        /** @type {unknown} */ (vm.estimate?.estimate_revision || {})
      );
    }
    return /** @type {TableDataStructure} */ (/** @type {unknown} */ (est));
  }

  /**
   * @type {Record<string, string>}
   */
  const EXACT_STAT_LABELS = {
    estimate: 'surprisemean',
    actual: 'actual',
    difference: 'difference',
    'current estimate': '0',
    '7 days ago': '7',
    '30 days ago': '30',
    '60 days ago': '60',
    '90 days ago': '90',
    'up last 30 days': 'up_num',
    'down last 30 days': 'down_num'
  };

  /**
   * @param {string} label
   * @returns {string|null}
   */
  function getStatKeyFromLabel(label) {
    if (EXACT_STAT_LABELS[label]) {
      return EXACT_STAT_LABELS[label];
    }
    if (label.indexOf('no. of analysts') !== -1) {
      return 'num';
    }
    if (label.indexOf('high estimate') !== -1) {
      return 'high';
    }
    if (label.indexOf('low estimate') !== -1) {
      return 'low';
    }
    if (label.indexOf('median estimate') !== -1) {
      return 'med';
    }
    if (label.indexOf('standard deviation') !== -1) {
      return 'std';
    }
    if (label.indexOf('smart estimate') !== -1) {
      return 'smart';
    }
    if (label.indexOf('surprise %') !== -1) {
      return 'surprise_pct';
    }
    return null;
  }

  /**
   * @param {HTMLElement} dateRow
   * @returns {Record<number, string>}
   */
  function extractColumnMap(dateRow) {
    /** @type {Record<number, string>} */
    const colMap = {};
    /** @type {NodeListOf<HTMLElement>} */
    const ths = dateRow.querySelectorAll('th, td');
    for (let c = 0; c < ths.length; c++) {
      const match = ths[c].innerText.trim().match(/^(\d{4})-(\d{2})/);
      if (match) {
        colMap[c] = match[1] + match[2];
      }
    }
    return colMap;
  }

  /**
   * @param {TableDataStructure} tableData
   * @param {string} mKey
   * @param {string} ek
   * @param {string} statKey
   * @returns {number|null}
   */
  function getValFromTableData(tableData, mKey, ek, statKey) {
    if (
      tableData.annual &&
      tableData.annual[mKey] &&
      tableData.annual[mKey][ek] &&
      tableData.annual[mKey][ek][statKey] != null
    ) {
      return tableData.annual[mKey][ek][statKey];
    } else if (
      tableData.quarterly &&
      tableData.quarterly[mKey] &&
      tableData.quarterly[mKey][ek] &&
      tableData.quarterly[mKey][ek][statKey] != null
    ) {
      return tableData.quarterly[mKey][ek][statKey];
    }
    return null;
  }

  /**
   * @param {HTMLElement} cell
   * @param {number|null} val
   * @param {string} statKey
   */
  function applyCellValue(cell, val, statKey) {
    if (statKey === 'num' || statKey === 'up_num' || statKey === 'down_num') {
      cell.innerText = String(val);
    } else {
      cell.innerText = fmt(val) + (statKey === 'surprise_pct' ? '%' : '');
    }
    cell.style.color = '#409eff';
    if (statKey === 'mean') {
      cell.style.fontWeight = 'bold';
    }
  }

  /**
   * @param {NodeListOf<HTMLElement>} tds
   * @param {number} thsLength
   * @param {Record<number, string>} colMap
   * @param {TableDataStructure} tableData
   * @param {string} mKey
   * @param {string} statKey
   * @returns {{filledAny: boolean, totalEmptyExpected: number}}
   */
  function processForecastRowCells(tds, thsLength, colMap, tableData, mKey, statKey) {
    let filledAny = false;
    let totalEmptyExpected = 0;
    const offset = tds.length - thsLength;
    for (const colIdxStr in colMap) {
      const colIdx = parseInt(colIdxStr, 10);
      const tdIndex = colIdx + offset;
      if (tdIndex <= 0 || tdIndex >= tds.length) {
        continue;
      }
      const cell = tds[tdIndex];
      const innerText = cell.innerText.trim();
      if (!innerText || innerText === '-') {
        totalEmptyExpected++;
        const ek = colMap[colIdx];
        const val = getValFromTableData(tableData, mKey, ek, statKey);

        if (val != null) {
          applyCellValue(cell, val, statKey);
          filledAny = true;
        }
      }
    }
    return { filledAny, totalEmptyExpected };
  }

  /**
   * @param {NodeListOf<HTMLElement>} trs
   * @param {number} thsLength
   * @param {Record<number, string>} colMap
   * @param {TableDataStructure} tableData
   * @returns {{filledAny: boolean, totalEmptyExpected: number}}
   */
  function processForecastRows(trs, thsLength, colMap, tableData) {
    let filledAny = false;
    let totalEmptyExpected = 0;
    let lastMKey = null;

    for (let r = 0; r < trs.length; r++) {
      /** @type {NodeListOf<HTMLElement>} */
      const tds = trs[r].querySelectorAll('td');
      if (!tds.length) {
        continue;
      }

      /** @type {HTMLElement} */
      const labelNode = tds[0].querySelector('.el-tooltip') || tds[0];
      const label = labelNode.innerText.trim().toLowerCase();

      let mKey = LABEL_TO_METRIC[label];
      let statKey = null;

      if (mKey) {
        lastMKey = mKey;
        statKey = 'mean';
      } else if (lastMKey) {
        statKey = getStatKeyFromLabel(label);
        if (!statKey) {
          lastMKey = null;
          continue;
        }
        mKey = lastMKey;
      } else {
        continue;
      }

      const result = processForecastRowCells(tds, thsLength, colMap, tableData, mKey, statKey);
      if (result.filledAny) {
        filledAny = true;
      }
      totalEmptyExpected += result.totalEmptyExpected;
    }
    return { filledAny, totalEmptyExpected };
  }

  /**
   * @param {HTMLElement} table
   * @returns {HTMLElement | null}
   */
  function findDateRow(table) {
    /** @type {NodeListOf<HTMLElement>} */
    const trs = table.querySelectorAll('tr');
    let dateRow = null;
    for (let j = 0; j < trs.length; j++) {
      if (trs[j].innerText.match(/\d{4}-\d{2}/)) {
        dateRow = trs[j]; // get the lowest row containing dates
      }
    }
    return dateRow;
  }

  /**
   * @param {HTMLElement} table
   * @param {string} tableTitle
   * @param {VueComponent} vm
   * @param {Record<string, unknown>} est
   * @returns {{filledAny: boolean, totalEmptyExpected: number}}
   */
  function processForecastSection(table, tableTitle, vm, est) {
    const tableData = getTableDataStructure(tableTitle, vm, est);
    const dateRow = findDateRow(table);
    if (!dateRow) {
      return { filledAny: false, totalEmptyExpected: 0 };
    }
    const thsLength = dateRow.querySelectorAll('th, td').length;
    const colMap = extractColumnMap(dateRow);
    /** @type {NodeListOf<HTMLElement>} */
    const trs = table.querySelectorAll('tr');
    return processForecastRows(trs, thsLength, colMap, tableData);
  }

  /**
   * @param {HTMLElement} section
   * @param {VueComponent} vm
   * @param {Record<string, unknown>} est
   * @returns {{filledAny: boolean, totalEmptyExpected: number}}
   */
  function processForecastSectionWrapper(section, vm, est) {
    const table = section.querySelector('table');
    if (!table) {
      return { filledAny: false, totalEmptyExpected: 0 };
    }

    const tableTitle = section.innerText.split('\n')[0].toLowerCase();
    const hasGrowth = vm.estimate?.long_term_growth && vm.estimate?.past_term_growth;

    if (tableTitle.indexOf('growth forecast') !== -1 && hasGrowth) {
      const filled = fillGrowthForecastTable(table, vm);
      return { filledAny: filled, totalEmptyExpected: 0 };
    }
    return processForecastSection(table, tableTitle, vm, est);
  }

  function fillOriginalForecastTables() {
    const vm = findEstimateViewModel();
    if (!vm || !vm.estimate || !vm.estimate.estimate_current) {
      return false;
    }

    const est = vm.estimate.estimate_current;
    /** @type {NodeListOf<HTMLElement>} */
    const sections = document.querySelectorAll('.m-t-md.border.p-md');
    let filledAny = false;
    let totalEmptyExpected = 0;

    for (let i = 0; i < sections.length; i++) {
      const res = processForecastSectionWrapper(sections[i], vm, est);
      if (res.filledAny) {
        filledAny = true;
      }
      totalEmptyExpected += res.totalEmptyExpected;
    }

    return filledAny || totalEmptyExpected === 0;
  }

  /** @param {Array<Record<string, unknown>>} entries */
  function buildTable(entries) {
    if (!entries || !entries.length) {
      return '';
    }
    let best = entries[0];
    for (let i = 1; i < entries.length; i++) {
      if (Object.keys(entries[i]).length > Object.keys(best).length) {
        best = entries[i];
      }
    }
    const metrics = [];
    for (const k in best) {
      if (!SKIP[k] && best[k] !== null && best[k] !== undefined) {
        metrics.push(k);
      }
    }
    if (!metrics.length) {
      return '';
    }
    const sorted = entries
      .slice()
      .sort(
        /** @param {Record<string, unknown>} a */ /** @param {Record<string, unknown>} b */ function (
          a,
          b
        ) {
          return String(b.date || '').localeCompare(String(a.date || ''));
        }
      )
      .slice(0, 10);

    let h = '<table class="gf-u-table"><tr><th>Metric</th>';
    for (let s = 0; s < sorted.length; s++) {
      h += '<th>' + (sorted[s].date || '?') + '</th>';
    }
    h += '</tr>';
    for (let m = 0; m < metrics.length; m++) {
      const label = metrics[m].replace(/_/g, ' ').replace(/\b[a-z]/g, function (c) {
        return c.toUpperCase();
      });
      h += '<tr><td>' + label + '</td>';
      for (let c = 0; c < sorted.length; c++) {
        const cellValue = sorted[c][metrics[m]];
        h += '<td>' + fmt(/** @type {number|string|null|undefined} */ (cellValue)) + '</td>';
      }
      h += '</tr>';
    }
    return h + '</table>';
  }

  function injectFinancials() {
    if (document.querySelector('.gf-u-wrap')) {
      return true;
    }

    const nuxt =
      /** @type {{ state?: { stock_summary_financial?: { financials?: { annual?: Array<Record<string, unknown>>, quarter?: Array<Record<string, unknown>>, ttm?: Array<Record<string, unknown>> } } } }} */ (
        /** @type {Record<string, unknown>} */ (/** @type {unknown} */ (window))['__NUXT__']
      );
    if (!nuxt || !nuxt.state || !nuxt.state.stock_summary_financial) {
      return false;
    }
    const fin = nuxt.state.stock_summary_financial.financials;
    if (!fin) {
      return false;
    }

    const annual = fin.annual || [];
    const quarter = fin.quarter || [];
    const ttm = fin.ttm || [];
    if (!annual.length && !quarter.length && !ttm.length) {
      return false;
    }

    /** @type {string[]} */
    const tabs = [];
    /** @type {Array<{id: string, html: string}>} */
    const panels = [];
    if (annual.length) {
      tabs.push('Annual');
      panels.push({ id: 'annual', html: buildTable(annual) });
    }
    if (quarter.length) {
      tabs.push('Quarterly');
      panels.push({ id: 'quarter', html: buildTable(quarter) });
    }
    if (ttm.length) {
      tabs.push('TTM');
      panels.push({ id: 'ttm', html: buildTable(ttm) });
    }

    let tabHtml = '<div class="gf-u-tabs">';
    for (let t = 0; t < tabs.length; t++) {
      tabHtml +=
        '<div class="gf-u-tab' +
        (t === 0 ? ' active' : '') +
        '" data-gfu="' +
        panels[t].id +
        '">' +
        tabs[t] +
        '</div>';
    }
    tabHtml += '</div>';

    let panelHtml = '';
    for (let p = 0; p < panels.length; p++) {
      panelHtml +=
        '<div class="gf-u-panel" data-gfu="' +
        panels[p].id +
        '" style="display:' +
        (p === 0 ? 'block' : 'none') +
        ';">' +
        panels[p].html +
        '</div>';
    }

    const wrap = document.createElement('div');
    wrap.className = 'gf-u-wrap';
    wrap.innerHTML =
      CSS +
      '<h3 style="margin:0 0 10px;font-size:16px;color:#333;">Financial Summary</h3>' +
      tabHtml +
      panelHtml;

    wrap.addEventListener('click', function (e) {
      const tab = e.target;
      if (!(tab instanceof HTMLElement)) {
        return;
      }
      if (!tab.classList.contains('gf-u-tab')) {
        return;
      }
      const id = tab.getAttribute('data-gfu');
      const allTabs = wrap.querySelectorAll('.gf-u-tab');
      /** @type {NodeListOf<HTMLElement>} */
      const allPanels = wrap.querySelectorAll('.gf-u-panel');
      for (let i = 0; i < allTabs.length; i++) {
        allTabs[i].classList.remove('active');
      }
      for (let j = 0; j < allPanels.length; j++) {
        allPanels[j].style.display = 'none';
      }
      tab.classList.add('active');
      const target = wrap.querySelector('.gf-u-panel[data-gfu="' + id + '"]');
      if (target instanceof HTMLElement) {
        target.style.display = 'block';
      }
    });

    // Insert into summary container or after stock header
    const container = document.querySelector('.built-in-stock-summary');
    if (container) {
      container.appendChild(wrap);
      return true;
    }

    const header = document.querySelector('.stock-header');
    if (header && header.parentElement) {
      header.parentElement.insertBefore(wrap, header.nextSibling);
      return true;
    }

    const main = document.querySelector('.el-main');
    if (main) {
      main.insertBefore(wrap, main.firstChild);
      return true;
    }

    return false;
  }

  // --- Run ---
  let attempts = 0;
  function run() {
    removePaywall();
    const forecastDone = injectForecast();
    const forecastTablesDone = fillOriginalForecastTables();
    const financialsDone = injectFinancials();
    if (forecastDone && forecastTablesDone && financialsDone) {
      return;
    }
    if (++attempts < 40) {
      setTimeout(run, 500);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      setTimeout(run, 500);
    });
  } else {
    setTimeout(run, 500);
  }

  // Periodic paywall removal + SPA navigation
  let lastPath = window.location.pathname;
  setInterval(function () {
    removePaywall();
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
      attempts = 0;
      setTimeout(run, 1000);
    }
    // Also periodically re-fill tables just in case Vue re-rendered them
    fillOriginalForecastTables();
  }, 2000);
})();
