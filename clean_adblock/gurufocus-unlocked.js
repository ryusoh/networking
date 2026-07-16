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

  // --- Forecast data rendering from Vue components ---
  function injectForecast() {
    if (document.querySelector('.gf-u-forecast')) {
      return true;
    }
    if (!/\/forecast/.test(window.location.pathname)) {
      return false;
    }

    const vueEl = document.querySelector('[data-v-5ccaf75f]');
    const vueObj = vueEl
      ? /** @type {Record<string, unknown>} */ (/** @type {unknown} */ (vueEl))['__vue__']
      : null;
    if (!vueEl || !vueObj) {
      return false;
    }
    const vm =
      /** @type {{ loading?: boolean, noData?: boolean, estimateData?: { mean: number, high: number, med: number, low: number, num: number, entry_date?: string }, priceData?: Array<Array<string>> }} */ (
        vueObj
      );
    if (vm.loading || vm.noData) {
      return false;
    }

    const est = vm.estimateData;
    const priceData = vm.priceData;
    if (!est) {
      return false;
    }

    const currentPrice =
      priceData && priceData.length ? parseFloat(priceData[priceData.length - 1][1]) : null;
    const isPositive = currentPrice ? est.mean >= currentPrice : false;
    const upside = currentPrice
      ? (((est.mean - currentPrice) / currentPrice) * 100).toFixed(2)
      : null;
    const upsideColor = isPositive ? '#67c23a' : '#f56c6c';

    const html =
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
      '</div>';

    // Replace blur image containers or insert after subscribe card removal points
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

  function fillOriginalForecastTables() {
    // Find parent component with estimate.estimate_current
    const el = document.querySelector('.m-t-md.border.p-md');
    const elVueObj = el
      ? /** @type {Record<string, unknown>} */ (/** @type {unknown} */ (el))['__vue__']
      : null;
    if (!el || !elVueObj) {
      return false;
    }

    /**
     * @typedef {Object} VueComponent
     * @property {VueComponent} [$parent]
     * @property {{ estimate_current?: Record<string, unknown>, long_term_growth?: { future_revenue_estimate_growth?: number, future_eps_nri_estimate_growth?: number }, past_term_growth?: { revenue_estimate_growth?: number, eps_nri_estimate_growth?: number }, estimate_history?: Record<string, unknown>, estimate_trend?: Record<string, unknown>, estimate_revision?: Record<string, unknown> }} [estimate]
     */
    let vm = /** @type {VueComponent | null} */ (elVueObj);
    while (vm && !(vm.estimate && vm.estimate.estimate_current)) {
      vm = vm.$parent || null;
    }
    if (!vm || !vm.estimate) {
      return false;
    }

    const est = vm.estimate.estimate_current;
    /** @type {NodeListOf<HTMLElement>} */
    const sections = document.querySelectorAll('.m-t-md.border.p-md');
    let filledAny = false;
    let totalEmptyExpected = 0;

    for (let i = 0; i < sections.length; i++) {
      const table = sections[i].querySelector('table');
      if (!table) {
        continue;
      }

      const tableTitle = sections[i].innerText.split('\n')[0].toLowerCase();

      if (
        tableTitle.indexOf('growth forecast') !== -1 &&
        vm.estimate.long_term_growth &&
        vm.estimate.past_term_growth
      ) {
        /** @type {NodeListOf<HTMLElement>} */
        const gTds = table.querySelectorAll('tbody td');
        /** @type {NodeListOf<HTMLElement>} */
        const gThs = table.querySelectorAll('thead th');
        for (let c = 0; c < gThs.length; c++) {
          const hText = gThs[c].innerText.toLowerCase();
          let gVal = null;
          if (hText.indexOf('future 3-5y total revenue') !== -1) {
            gVal = vm.estimate.long_term_growth.future_revenue_estimate_growth;
          } else if (hText.indexOf('past 3-year total revenue') !== -1) {
            gVal = vm.estimate.past_term_growth.revenue_estimate_growth;
          } else if (hText.indexOf('future 3-5y eps') !== -1) {
            gVal = vm.estimate.long_term_growth.future_eps_nri_estimate_growth;
          } else if (hText.indexOf('past 3-year eps') !== -1) {
            gVal = vm.estimate.past_term_growth.eps_nri_estimate_growth;
          }

          if (
            gVal != null &&
            gTds[c] &&
            (!gTds[c].innerText.trim() || gTds[c].innerText.trim() === '-')
          ) {
            gTds[c].innerText = gVal + '%';
            gTds[c].style.color = '#409eff';
            gTds[c].style.fontWeight = 'bold';
            filledAny = true;
          }
        }
        continue;
      }

      /**
       * @typedef {Record<string, Record<string, Record<string, number | null>>>} TableSubData
       */
      /**
       * @typedef {{ annual?: TableSubData, quarterly?: TableSubData }} TableDataStructure
       */
      /** @type {TableDataStructure} */
      let tableData = /** @type {TableDataStructure} */ (/** @type {unknown} */ (est));
      if (tableTitle.indexOf('surprise') !== -1) {
        tableData = /** @type {TableDataStructure} */ (
          /** @type {unknown} */ (vm.estimate.estimate_history || {})
        );
      } else if (tableTitle.indexOf('trends') !== -1) {
        tableData = /** @type {TableDataStructure} */ (
          /** @type {unknown} */ (vm.estimate.estimate_trend || {})
        );
      } else if (tableTitle.indexOf('revisions') !== -1) {
        tableData = /** @type {TableDataStructure} */ (
          /** @type {unknown} */ (vm.estimate.estimate_revision || {})
        );
      }

      let dateRow = null;
      /** @type {NodeListOf<HTMLElement>} */
      const trs = table.querySelectorAll('tr');
      for (let j = 0; j < trs.length; j++) {
        if (trs[j].innerText.match(/\d{4}-\d{2}/)) {
          dateRow = trs[j]; // get the lowest row containing dates
        }
      }
      if (!dateRow) {
        continue;
      }

      /** @type {NodeListOf<HTMLElement>} */
      const ths = dateRow.querySelectorAll('th, td');
      /** @type {Record<number, string>} */
      const colMap = {};
      for (let c = 0; c < ths.length; c++) {
        const match = ths[c].innerText.trim().match(/^(\d{4})-(\d{2})/);
        if (match) {
          colMap[c] = match[1] + match[2];
        }
      }

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
          if (label.indexOf('no. of analysts') !== -1) {
            statKey = 'num';
          } else if (label.indexOf('high estimate') !== -1) {
            statKey = 'high';
          } else if (label.indexOf('low estimate') !== -1) {
            statKey = 'low';
          } else if (label.indexOf('median estimate') !== -1) {
            statKey = 'med';
          } else if (label.indexOf('standard deviation') !== -1) {
            statKey = 'std';
          } else if (label.indexOf('smart estimate') !== -1) {
            statKey = 'smart';
          } else if (label === 'estimate') {
            statKey = 'surprisemean';
          } else if (label === 'actual') {
            statKey = 'actual';
          } else if (label === 'difference') {
            statKey = 'difference';
          } else if (label.indexOf('surprise %') !== -1) {
            statKey = 'surprise_pct';
          } else if (label === 'current estimate') {
            statKey = '0';
          } else if (label === '7 days ago') {
            statKey = '7';
          } else if (label === '30 days ago') {
            statKey = '30';
          } else if (label === '60 days ago') {
            statKey = '60';
          } else if (label === '90 days ago') {
            statKey = '90';
          } else if (label === 'up last 30 days') {
            statKey = 'up_num';
          } else if (label === 'down last 30 days') {
            statKey = 'down_num';
          } else {
            lastMKey = null;
            continue;
          }
          mKey = lastMKey;
        } else {
          continue;
        }

        const offset = tds.length - ths.length;
        for (const colIdxStr in colMap) {
          const colIdx = parseInt(colIdxStr, 10);
          const tdIndex = colIdx + offset;
          if (tdIndex > 0 && tdIndex < tds.length) {
            const cell = tds[tdIndex];
            const innerText = cell.innerText.trim();
            if (!innerText || innerText === '-') {
              totalEmptyExpected++;
              const ek = colMap[colIdx];
              let val = null;
              if (
                tableData.annual &&
                tableData.annual[mKey] &&
                tableData.annual[mKey][ek] &&
                tableData.annual[mKey][ek][statKey] != null
              ) {
                val = tableData.annual[mKey][ek][statKey];
              } else if (
                tableData.quarterly &&
                tableData.quarterly[mKey] &&
                tableData.quarterly[mKey][ek] &&
                tableData.quarterly[mKey][ek][statKey] != null
              ) {
                val = tableData.quarterly[mKey][ek][statKey];
              }

              if (val != null) {
                if (statKey === 'num' || statKey === 'up_num' || statKey === 'down_num') {
                  cell.innerText = String(val);
                } else {
                  cell.innerText = fmt(val) + (statKey === 'surprise_pct' ? '%' : '');
                }
                cell.style.color = '#409eff';
                if (statKey === 'mean') {
                  cell.style.fontWeight = 'bold';
                }
                filledAny = true;
              }
            }
          }
        }
      }
    }

    // Return true if we found and filled at least one cell, OR if we didn't expect to fill any
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
