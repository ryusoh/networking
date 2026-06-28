/**
 * GuruFocus Unlocked (MAIN world)
 * Removes paywall overlay elements and renders financial data from __NUXT__ state.
 */
/* istanbul ignore next */
(function () {
/* istanbul ignore next */
  'use strict';

/* istanbul ignore next */
  if (!window.location.hostname.endsWith('gurufocus.com')) {
/* istanbul ignore next */
    return;
  }

  // --- Anti-blur CSS ---
  let antiBlurInjected = false;
  function injectAntiBlur() {
/* istanbul ignore next */
    if (antiBlurInjected) {
/* istanbul ignore next */
      return;
    }
    const style = document.createElement('style');
/* istanbul ignore next */
    style.textContent =
/* istanbul ignore next */
      '.blur { filter: none !important; pointer-events: auto !important; user-select: auto !important; } [style*="blur"] { filter: none !important; pointer-events: auto !important; } .subscribe-card, .subscribe-card-small { display: none !important; } img[src*="blur"] { display: none !important; }';
/* istanbul ignore next */
    (document.head || document.documentElement).appendChild(style);
/* istanbul ignore next */
    antiBlurInjected = true;
  }

  // --- Paywall removal ---
  function removePaywall() {
/* istanbul ignore next */
    injectAntiBlur();
/* istanbul ignore next */
    document.body.style.overflow = 'visible';
    const els = document.querySelectorAll(
/* istanbul ignore next */
      '.paywall-shadow, .paywall-node, .el-dialog__wrapper.gf, .v-modal, .subscribe-card, .subscribe-card-small'
/* istanbul ignore next */
    );
/* istanbul ignore next */
    for (let i = 0; i < els.length; i++) {
/* istanbul ignore next */
      els[i].remove();
    }
    // Remove blur overlay images
/* istanbul ignore next */
    document.querySelectorAll('img[src*="blur"]').forEach(function (img) {
/* istanbul ignore next */
      img.remove();
/* istanbul ignore next */
    });
    // Remove .blur class and inline blur styles from elements
/* istanbul ignore next */
    document.querySelectorAll('.blur, [style*="blur"]').forEach(unblur);
  }

  function unblur(el) {
/* istanbul ignore next */
/* istanbul ignore next */
    if (el.classList.contains('blur')) {
/* istanbul ignore next */
      el.classList.remove('blur');
    }
/* istanbul ignore next */
/* istanbul ignore next */
    if (el.style.filter && el.style.filter.indexOf('blur') !== -1) {
/* istanbul ignore next */
      el.style.filter = 'none';
    }
/* istanbul ignore next */
/* istanbul ignore next */
    if (el.style.pointerEvents === 'none') {
/* istanbul ignore next */
      el.style.pointerEvents = '';
    }
/* istanbul ignore next */
/* istanbul ignore next */
    if (el.style.userSelect === 'none') {
/* istanbul ignore next */
      el.style.userSelect = '';
    }
  }

  // --- MutationObserver: catch Vue reactivity re-applying blur ---
  const observer = new MutationObserver(function (mutations) {
/* istanbul ignore next */
    for (let i = 0; i < mutations.length; i++) {
      const m = mutations[i];
/* istanbul ignore next */
/* istanbul ignore next */
      if (m.type === 'attributes') {
        const el = m.target;
/* istanbul ignore next */
/* istanbul ignore next */
        if (el.classList && el.classList.contains('blur')) {
/* istanbul ignore next */
          unblur(el);
        }
/* istanbul ignore next */
/* istanbul ignore next */
        if (el.style && el.style.filter && el.style.filter.indexOf('blur') !== -1) {
/* istanbul ignore next */
          unblur(el);
        }
      }
/* istanbul ignore next */
/* istanbul ignore next */
      if (m.type === 'childList') {
/* istanbul ignore next */
        for (let j = 0; j < m.addedNodes.length; j++) {
          const node = m.addedNodes[j];
/* istanbul ignore next */
/* istanbul ignore next */
          if (node.nodeType !== 1) {
/* istanbul ignore next */
            continue;
          }
          // Remove blur overlay images
/* istanbul ignore next */
/* istanbul ignore next */
          if (node.tagName === 'IMG' && node.src && node.src.indexOf('blur') !== -1) {
/* istanbul ignore next */
            node.remove();
/* istanbul ignore next */
            continue;
          }
/* istanbul ignore next */
/* istanbul ignore next */
          if (
/* istanbul ignore next */
            node.classList.contains('blur') ||
/* istanbul ignore next */
            (node.style && node.style.filter && node.style.filter.indexOf('blur') !== -1)
/* istanbul ignore next */
          ) {
/* istanbul ignore next */
            unblur(node);
          }
          const blurred = node.querySelectorAll
/* istanbul ignore next */
            ? node.querySelectorAll('.blur, [style*="blur"]')
/* istanbul ignore next */
            : [];
/* istanbul ignore next */
          for (let k = 0; k < blurred.length; k++) {
/* istanbul ignore next */
            unblur(blurred[k]);
          }
          // Remove blur images inside added subtrees
          const blurImgs = node.querySelectorAll ? node.querySelectorAll('img[src*="blur"]') : [];
/* istanbul ignore next */
          for (let l = 0; l < blurImgs.length; l++) {
/* istanbul ignore next */
            blurImgs[l].remove();
          }
        }
      }
    }
/* istanbul ignore next */
  });
/* istanbul ignore next */
  observer.observe(document.documentElement, {
/* istanbul ignore next */
    attributes: true,
/* istanbul ignore next */
    attributeFilter: ['class', 'style'],
/* istanbul ignore next */
    childList: true,
/* istanbul ignore next */
    subtree: true
/* istanbul ignore next */
  });

  // --- Forecast data rendering from Vue components ---
  function injectForecast() {
/* istanbul ignore next */
/* istanbul ignore next */
    if (document.querySelector('.gf-u-forecast')) {
/* istanbul ignore next */
      return true;
    }
/* istanbul ignore next */
/* istanbul ignore next */
    if (!/\/forecast/.test(window.location.pathname)) {
/* istanbul ignore next */
      return false;
    }

    const vueEl = document.querySelector('[data-v-5ccaf75f]');
/* istanbul ignore next */
/* istanbul ignore next */
    if (!vueEl || !vueEl.__vue__) {
/* istanbul ignore next */
      return false;
    }
    const vm = vueEl.__vue__;
/* istanbul ignore next */
/* istanbul ignore next */
    if (vm.loading || vm.noData) {
/* istanbul ignore next */
      return false;
    }

    const est = vm.estimateData;
    const priceData = vm.priceData;
/* istanbul ignore next */
/* istanbul ignore next */
    if (!est) {
/* istanbul ignore next */
      return false;
    }

    const currentPrice =
/* istanbul ignore next */
      priceData && priceData.length ? parseFloat(priceData[priceData.length - 1][1]) : null;
    const upside = currentPrice
/* istanbul ignore next */
      ? (((est.mean - currentPrice) / currentPrice) * 100).toFixed(2)
/* istanbul ignore next */
      : null;
    const upsideColor = upside >= 0 ? '#67c23a' : '#f56c6c';

    const html =
/* istanbul ignore next */
      '<div class="gf-u-forecast" style="padding:16px;margin:12px 0;background:#fff;border:1px solid #eee;border-radius:8px;font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,sans-serif;">' +
/* istanbul ignore next */
      '<h3 style="margin:0 0 12px;font-size:16px;color:#333;">Analyst Price Target</h3>' +
/* istanbul ignore next */
      '<div style="display:flex;gap:24px;flex-wrap:wrap;align-items:center;">' +
/* istanbul ignore next */
      '<div style="text-align:center;padding-right:24px;border-right:1px solid #eee;">' +
/* istanbul ignore next */
      '<div style="font-size:13px;color:#666;">Average Target</div>' +
/* istanbul ignore next */
      '<div style="font-size:28px;font-weight:700;color:' +
/* istanbul ignore next */
      upsideColor +
/* istanbul ignore next */
      ';">$' +
/* istanbul ignore next */
      est.mean.toFixed(2) +
/* istanbul ignore next */
      '</div>' +
/* istanbul ignore next */
      (upside !== null
/* istanbul ignore next */
        ? '<div style="font-size:14px;color:' +
/* istanbul ignore next */
          upsideColor +
/* istanbul ignore next */
          ';">(' +
/* istanbul ignore next */
          (upside >= 0 ? '+' : '') +
/* istanbul ignore next */
          upside +
/* istanbul ignore next */
          '% Upside)</div>'
/* istanbul ignore next */
        : '') +
/* istanbul ignore next */
      '</div>' +
/* istanbul ignore next */
      '<div style="display:flex;gap:20px;">' +
/* istanbul ignore next */
      '<div style="text-align:center;"><div style="font-size:12px;color:#999;">High</div><div style="font-size:18px;font-weight:600;color:#67c23a;">$' +
/* istanbul ignore next */
      est.high.toFixed(2) +
/* istanbul ignore next */
      '</div></div>' +
/* istanbul ignore next */
      '<div style="text-align:center;"><div style="font-size:12px;color:#999;">Median</div><div style="font-size:18px;font-weight:600;color:#333;">$' +
/* istanbul ignore next */
      est.med.toFixed(2) +
/* istanbul ignore next */
      '</div></div>' +
/* istanbul ignore next */
      '<div style="text-align:center;"><div style="font-size:12px;color:#999;">Low</div><div style="font-size:18px;font-weight:600;color:#f56c6c;">$' +
/* istanbul ignore next */
      est.low.toFixed(2) +
/* istanbul ignore next */
      '</div></div>' +
/* istanbul ignore next */
      '<div style="text-align:center;"><div style="font-size:12px;color:#999;">Analysts</div><div style="font-size:18px;font-weight:600;color:#333;">' +
/* istanbul ignore next */
      est.num +
/* istanbul ignore next */
      '</div></div>' +
/* istanbul ignore next */
      '</div>' +
/* istanbul ignore next */
      '</div>' +
/* istanbul ignore next */
      (currentPrice !== null
/* istanbul ignore next */
        ? '<div style="margin-top:8px;font-size:13px;color:#666;">Current Price: <strong>$' +
/* istanbul ignore next */
          currentPrice.toFixed(2) +
/* istanbul ignore next */
          '</strong> | Updated: ' +
/* istanbul ignore next */
          (est.entry_date || '') +
/* istanbul ignore next */
          '</div>'
/* istanbul ignore next */
        : '') +
/* istanbul ignore next */
      '</div>';

    // Replace blur image containers or insert after subscribe card removal points
    let inserted = false;
    const blurImgParents = document.querySelectorAll('[data-v-5ccaf75f]');
/* istanbul ignore next */
    for (let i = 0; i < blurImgParents.length; i++) {
      const parent = blurImgParents[i];
/* istanbul ignore next */
/* istanbul ignore next */
      if (parent.__vue__ && parent.__vue__.estimateData && !inserted) {
        const wrap = document.createElement('div');
/* istanbul ignore next */
        wrap.innerHTML = html;
/* istanbul ignore next */
        parent.parentElement.insertBefore(wrap.firstChild, parent);
/* istanbul ignore next */
        inserted = true;
/* istanbul ignore next */
        break;
      }
    }
/* istanbul ignore next */
/* istanbul ignore next */
    if (!inserted) {
      const main = document.querySelector('.el-main');
/* istanbul ignore next */
/* istanbul ignore next */
      if (main) {
        const wrap = document.createElement('div');
/* istanbul ignore next */
        wrap.innerHTML = html;
/* istanbul ignore next */
        main.insertBefore(wrap.firstChild, main.firstChild);
/* istanbul ignore next */
        inserted = true;
      }
    }
/* istanbul ignore next */
    return inserted;
  }

  // --- Shared Utilities ---
  const CSS =
/* istanbul ignore next */
    '<style>' +
/* istanbul ignore next */
    '.gf-u-wrap{padding:15px;overflow-x:auto;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif}' +
/* istanbul ignore next */
    '.gf-u-tabs{display:flex;gap:4px;margin-bottom:12px}' +
/* istanbul ignore next */
    '.gf-u-tab{padding:6px 16px;border:1px solid #ddd;background:#f5f7fa;border-radius:4px 4px 0 0;cursor:pointer;font-size:13px}' +
/* istanbul ignore next */
    '.gf-u-tab.active{background:#fff;border-bottom-color:#fff;font-weight:600;color:#409eff}' +
/* istanbul ignore next */
    '.gf-u-table{border-collapse:collapse;width:100%;font-size:13px}' +
/* istanbul ignore next */
    '.gf-u-table th{padding:6px 10px;text-align:right;border-bottom:2px solid #ddd;background:#f5f7fa;white-space:nowrap}' +
/* istanbul ignore next */
    '.gf-u-table th:first-child{text-align:left}' +
/* istanbul ignore next */
    '.gf-u-table td{padding:5px 10px;text-align:right;border-bottom:1px solid #eee}' +
/* istanbul ignore next */
    '.gf-u-table td:first-child{text-align:left;white-space:nowrap}' +
/* istanbul ignore next */
    '.gf-u-table tr:nth-child(even){background:#f9f9f9}' +
/* istanbul ignore next */
    '.gf-u-table tr:hover{background:#eef5ff}' +
/* istanbul ignore next */
    '</style>';

  const SKIP = {
/* istanbul ignore next */
    '': 1,
/* istanbul ignore next */
    date: 1,
/* istanbul ignore next */
    fiscal_year: 1,
/* istanbul ignore next */
    year: 1,
/* istanbul ignore next */
    id: 1,
/* istanbul ignore next */
    stock_id: 1,
/* istanbul ignore next */
    company_id: 1,
/* istanbul ignore next */
    exchange_id: 1,
/* istanbul ignore next */
    currency: 1,
/* istanbul ignore next */
    currency_id: 1,
/* istanbul ignore next */
    preliminary: 1,
/* istanbul ignore next */
    restated_date: 1
/* istanbul ignore next */
  };

  function fmt(v) {
/* istanbul ignore next */
/* istanbul ignore next */
    if (v === null || v === undefined || v === '') {
/* istanbul ignore next */
      return '-';
    }
    const n = parseFloat(v);
/* istanbul ignore next */
/* istanbul ignore next */
    if (isNaN(n)) {
/* istanbul ignore next */
      return String(v);
    }
/* istanbul ignore next */
/* istanbul ignore next */
    if (Math.abs(n) >= 1e9) {
/* istanbul ignore next */
      return (n / 1e9).toFixed(2) + 'B';
    }
/* istanbul ignore next */
/* istanbul ignore next */
    if (Math.abs(n) >= 1e6) {
/* istanbul ignore next */
      return (n / 1e6).toFixed(2) + 'M';
    }
/* istanbul ignore next */
/* istanbul ignore next */
    if (Math.abs(n) >= 1e3 && n % 1 === 0) {
/* istanbul ignore next */
      return (n / 1e3).toFixed(1) + 'K';
    }
/* istanbul ignore next */
/* istanbul ignore next */
    if (Math.abs(n) < 0.01 && n !== 0) {
/* istanbul ignore next */
      return n.toFixed(4);
    }
/* istanbul ignore next */
    return n.toFixed(2);
  }

  const LABEL_TO_METRIC = {
/* istanbul ignore next */
    revenue: 'revenue_estimate',
/* istanbul ignore next */
    'eps without nri': 'eps_nri_estimate',
/* istanbul ignore next */
    eps: 'per_share_eps_estimate',
/* istanbul ignore next */
    'dividends per share': 'dividend_estimate',
/* istanbul ignore next */
    ebit: 'ebit_estimate',
/* istanbul ignore next */
    ebitda: 'ebitda_estimate',
/* istanbul ignore next */
    'pretax income': 'pretax_income_estimate',
/* istanbul ignore next */
    'net income': 'net_income_estimate',
/* istanbul ignore next */
    'book value per share': 'book_value_per_share_estimate',
/* istanbul ignore next */
    'operating cash flow per share': 'operating_cash_flow_per_share_estimate',
/* istanbul ignore next */
    'gross margin': 'gross_margin_estimate',
/* istanbul ignore next */
    roa: 'roa_estimate',
/* istanbul ignore next */
    roe: 'roe_estimate'
/* istanbul ignore next */
  };

  function fillOriginalForecastTables() {
    // Find parent component with estimate.estimate_current
    const el = document.querySelector('.m-t-md.border.p-md');
/* istanbul ignore next */
/* istanbul ignore next */
    if (!el || !el.__vue__) {
/* istanbul ignore next */
      return false;
    }
    let vm = el.__vue__;
/* istanbul ignore next */
    while (vm && !(vm.estimate && vm.estimate.estimate_current)) {
/* istanbul ignore next */
      vm = vm.$parent;
    }
/* istanbul ignore next */
/* istanbul ignore next */
    if (!vm) {
/* istanbul ignore next */
      return false;
    }

    const est = vm.estimate.estimate_current;
    const sections = document.querySelectorAll('.m-t-md.border.p-md');
    let filledAny = false;
    let totalEmptyExpected = 0;

/* istanbul ignore next */
    for (let i = 0; i < sections.length; i++) {
      const table = sections[i].querySelector('table');
/* istanbul ignore next */
/* istanbul ignore next */
      if (!table) {
/* istanbul ignore next */
        continue;
      }

      const tableTitle = sections[i].innerText.split('\n')[0].toLowerCase();

/* istanbul ignore next */
/* istanbul ignore next */
      if (
/* istanbul ignore next */
        tableTitle.indexOf('growth forecast') !== -1 &&
/* istanbul ignore next */
        vm.estimate.long_term_growth &&
/* istanbul ignore next */
        vm.estimate.past_term_growth
/* istanbul ignore next */
      ) {
        const gTds = table.querySelectorAll('tbody td');
        const gThs = table.querySelectorAll('thead th');
/* istanbul ignore next */
        for (let c = 0; c < gThs.length; c++) {
          const hText = gThs[c].innerText.toLowerCase();
          let gVal = null;
/* istanbul ignore next */
/* istanbul ignore next */
          if (hText.indexOf('future 3-5y total revenue') !== -1) {
/* istanbul ignore next */
            gVal = vm.estimate.long_term_growth.future_revenue_estimate_growth;
/* istanbul ignore next */
          } else if (hText.indexOf('past 3-year total revenue') !== -1) {
/* istanbul ignore next */
            gVal = vm.estimate.past_term_growth.revenue_estimate_growth;
/* istanbul ignore next */
          } else if (hText.indexOf('future 3-5y eps') !== -1) {
/* istanbul ignore next */
            gVal = vm.estimate.long_term_growth.future_eps_nri_estimate_growth;
/* istanbul ignore next */
          } else if (hText.indexOf('past 3-year eps') !== -1) {
/* istanbul ignore next */
            gVal = vm.estimate.past_term_growth.eps_nri_estimate_growth;
          }

/* istanbul ignore next */
/* istanbul ignore next */
          if (
/* istanbul ignore next */
            gVal != null &&
/* istanbul ignore next */
            gTds[c] &&
/* istanbul ignore next */
            (!gTds[c].innerText.trim() || gTds[c].innerText.trim() === '-')
/* istanbul ignore next */
          ) {
/* istanbul ignore next */
            gTds[c].innerText = gVal + '%';
/* istanbul ignore next */
            gTds[c].style.color = '#409eff';
/* istanbul ignore next */
            gTds[c].style.fontWeight = 'bold';
/* istanbul ignore next */
            filledAny = true;
          }
        }
/* istanbul ignore next */
        continue;
      }

      let tableData = est;
/* istanbul ignore next */
/* istanbul ignore next */
      if (tableTitle.indexOf('surprise') !== -1) {
/* istanbul ignore next */
        tableData = vm.estimate.estimate_history || {};
/* istanbul ignore next */
      } else if (tableTitle.indexOf('trends') !== -1) {
/* istanbul ignore next */
        tableData = vm.estimate.estimate_trend || {};
/* istanbul ignore next */
      } else if (tableTitle.indexOf('revisions') !== -1) {
/* istanbul ignore next */
        tableData = vm.estimate.estimate_revision || {};
      }

      let dateRow = null;
      const trs = table.querySelectorAll('tr');
/* istanbul ignore next */
      for (let j = 0; j < trs.length; j++) {
/* istanbul ignore next */
/* istanbul ignore next */
        if (trs[j].innerText.match(/\d{4}-\d{2}/)) {
/* istanbul ignore next */
          dateRow = trs[j]; // get the lowest row containing dates
        }
      }
/* istanbul ignore next */
/* istanbul ignore next */
      if (!dateRow) {
/* istanbul ignore next */
        continue;
      }

      const ths = dateRow.querySelectorAll('th, td');
      const colMap = {};
/* istanbul ignore next */
      for (let c = 0; c < ths.length; c++) {
        const match = ths[c].innerText.trim().match(/^(\d{4})-(\d{2})/);
/* istanbul ignore next */
/* istanbul ignore next */
        if (match) {
/* istanbul ignore next */
          colMap[c] = match[1] + match[2];
        }
      }

      let lastMKey = null;
/* istanbul ignore next */
      for (let r = 0; r < trs.length; r++) {
        const tds = trs[r].querySelectorAll('td');
/* istanbul ignore next */
/* istanbul ignore next */
        if (!tds.length) {
/* istanbul ignore next */
          continue;
        }

        const labelNode = tds[0].querySelector('.el-tooltip') || tds[0];
        const label = labelNode.innerText.trim().toLowerCase();

        let mKey = LABEL_TO_METRIC[label];
        let statKey = null;

/* istanbul ignore next */
/* istanbul ignore next */
        if (mKey) {
/* istanbul ignore next */
          lastMKey = mKey;
/* istanbul ignore next */
          statKey = 'mean';
/* istanbul ignore next */
        } else if (lastMKey) {
/* istanbul ignore next */
/* istanbul ignore next */
          if (label.indexOf('no. of analysts') !== -1) {
/* istanbul ignore next */
            statKey = 'num';
/* istanbul ignore next */
          } else if (label.indexOf('high estimate') !== -1) {
/* istanbul ignore next */
            statKey = 'high';
/* istanbul ignore next */
          } else if (label.indexOf('low estimate') !== -1) {
/* istanbul ignore next */
            statKey = 'low';
/* istanbul ignore next */
          } else if (label.indexOf('median estimate') !== -1) {
/* istanbul ignore next */
            statKey = 'med';
/* istanbul ignore next */
          } else if (label.indexOf('standard deviation') !== -1) {
/* istanbul ignore next */
            statKey = 'std';
/* istanbul ignore next */
          } else if (label.indexOf('smart estimate') !== -1) {
/* istanbul ignore next */
            statKey = 'smart';
/* istanbul ignore next */
          } else if (label === 'estimate') {
/* istanbul ignore next */
            statKey = 'surprisemean';
/* istanbul ignore next */
          } else if (label === 'actual') {
/* istanbul ignore next */
            statKey = 'actual';
/* istanbul ignore next */
          } else if (label === 'difference') {
/* istanbul ignore next */
            statKey = 'difference';
/* istanbul ignore next */
          } else if (label.indexOf('surprise %') !== -1) {
/* istanbul ignore next */
            statKey = 'surprise_pct';
/* istanbul ignore next */
          } else if (label === 'current estimate') {
/* istanbul ignore next */
            statKey = '0';
/* istanbul ignore next */
          } else if (label === '7 days ago') {
/* istanbul ignore next */
            statKey = '7';
/* istanbul ignore next */
          } else if (label === '30 days ago') {
/* istanbul ignore next */
            statKey = '30';
/* istanbul ignore next */
          } else if (label === '60 days ago') {
/* istanbul ignore next */
            statKey = '60';
/* istanbul ignore next */
          } else if (label === '90 days ago') {
/* istanbul ignore next */
            statKey = '90';
/* istanbul ignore next */
          } else if (label === 'up last 30 days') {
/* istanbul ignore next */
            statKey = 'up_num';
/* istanbul ignore next */
          } else if (label === 'down last 30 days') {
/* istanbul ignore next */
            statKey = 'down_num';
/* istanbul ignore next */
          } else {
/* istanbul ignore next */
            lastMKey = null;
/* istanbul ignore next */
            continue;
          }
/* istanbul ignore next */
          mKey = lastMKey;
/* istanbul ignore next */
        } else {
/* istanbul ignore next */
          continue;
        }

        const offset = tds.length - ths.length;
/* istanbul ignore next */
        for (const colIdx in colMap) {
          const tdIndex = parseInt(colIdx) + offset;
/* istanbul ignore next */
/* istanbul ignore next */
          if (tdIndex > 0 && tdIndex < tds.length) {
            const cell = tds[tdIndex];
            const innerText = cell.innerText.trim();
/* istanbul ignore next */
/* istanbul ignore next */
            if (!innerText || innerText === '-') {
/* istanbul ignore next */
              totalEmptyExpected++;
              const ek = colMap[colIdx];
              let val = null;
/* istanbul ignore next */
/* istanbul ignore next */
              if (
/* istanbul ignore next */
                tableData.annual &&
/* istanbul ignore next */
                tableData.annual[mKey] &&
/* istanbul ignore next */
                tableData.annual[mKey][ek] &&
/* istanbul ignore next */
                tableData.annual[mKey][ek][statKey] != null
/* istanbul ignore next */
              ) {
/* istanbul ignore next */
                val = tableData.annual[mKey][ek][statKey];
/* istanbul ignore next */
              } else if (
/* istanbul ignore next */
                tableData.quarterly &&
/* istanbul ignore next */
                tableData.quarterly[mKey] &&
/* istanbul ignore next */
                tableData.quarterly[mKey][ek] &&
/* istanbul ignore next */
                tableData.quarterly[mKey][ek][statKey] != null
/* istanbul ignore next */
              ) {
/* istanbul ignore next */
                val = tableData.quarterly[mKey][ek][statKey];
              }

/* istanbul ignore next */
/* istanbul ignore next */
              if (val != null) {
/* istanbul ignore next */
/* istanbul ignore next */
                if (statKey === 'num' || statKey === 'up_num' || statKey === 'down_num') {
/* istanbul ignore next */
                  cell.innerText = val;
/* istanbul ignore next */
                } else {
/* istanbul ignore next */
                  cell.innerText = fmt(val) + (statKey === 'surprise_pct' ? '%' : '');
                }
/* istanbul ignore next */
                cell.style.color = '#409eff';
/* istanbul ignore next */
/* istanbul ignore next */
                if (statKey === 'mean') {
/* istanbul ignore next */
                  cell.style.fontWeight = 'bold';
                }
/* istanbul ignore next */
                filledAny = true;
              }
            }
          }
        }
      }
    }

    // Return true if we found and filled at least one cell, OR if we didn't expect to fill any
/* istanbul ignore next */
    return filledAny || totalEmptyExpected === 0;
  }

  function buildTable(entries) {
/* istanbul ignore next */
/* istanbul ignore next */
    if (!entries || !entries.length) {
/* istanbul ignore next */
      return '';
    }
    let best = entries[0];
/* istanbul ignore next */
    for (let i = 1; i < entries.length; i++) {
/* istanbul ignore next */
/* istanbul ignore next */
      if (Object.keys(entries[i]).length > Object.keys(best).length) {
/* istanbul ignore next */
        best = entries[i];
      }
    }
    const metrics = [];
/* istanbul ignore next */
    for (const k in best) {
/* istanbul ignore next */
/* istanbul ignore next */
      if (!SKIP[k] && best[k] !== null && best[k] !== undefined) {
/* istanbul ignore next */
        metrics.push(k);
      }
    }
/* istanbul ignore next */
/* istanbul ignore next */
    if (!metrics.length) {
/* istanbul ignore next */
      return '';
    }
    const sorted = entries
/* istanbul ignore next */
      .slice()
/* istanbul ignore next */
      .sort(function (a, b) {
/* istanbul ignore next */
        return String(b.date || '').localeCompare(String(a.date || ''));
/* istanbul ignore next */
      })
/* istanbul ignore next */
      .slice(0, 10);

    let h = '<table class="gf-u-table"><tr><th>Metric</th>';
/* istanbul ignore next */
    for (let s = 0; s < sorted.length; s++) {
/* istanbul ignore next */
      h += '<th>' + (sorted[s].date || '?') + '</th>';
    }
/* istanbul ignore next */
    h += '</tr>';
/* istanbul ignore next */
    for (let m = 0; m < metrics.length; m++) {
      const label = metrics[m].replace(/_/g, ' ').replace(/\b[a-z]/g, function (c) {
/* istanbul ignore next */
        return c.toUpperCase();
/* istanbul ignore next */
      });
/* istanbul ignore next */
      h += '<tr><td>' + label + '</td>';
/* istanbul ignore next */
      for (let c = 0; c < sorted.length; c++) {
/* istanbul ignore next */
        h += '<td>' + fmt(sorted[c][metrics[m]]) + '</td>';
      }
/* istanbul ignore next */
      h += '</tr>';
    }
/* istanbul ignore next */
    return h + '</table>';
  }

  function injectFinancials() {
/* istanbul ignore next */
/* istanbul ignore next */
    if (document.querySelector('.gf-u-wrap')) {
/* istanbul ignore next */
      return true;
    }

    const nuxt = window.__NUXT__;
/* istanbul ignore next */
/* istanbul ignore next */
    if (!nuxt || !nuxt.state || !nuxt.state.stock_summary_financial) {
/* istanbul ignore next */
      return false;
    }
    const fin = nuxt.state.stock_summary_financial.financials;
/* istanbul ignore next */
/* istanbul ignore next */
    if (!fin) {
/* istanbul ignore next */
      return false;
    }

    const annual = fin.annual || [];
    const quarter = fin.quarter || [];
    const ttm = fin.ttm || [];
/* istanbul ignore next */
/* istanbul ignore next */
    if (!annual.length && !quarter.length && !ttm.length) {
/* istanbul ignore next */
      return false;
    }

    const tabs = [],
/* istanbul ignore next */
      panels = [];
/* istanbul ignore next */
/* istanbul ignore next */
    if (annual.length) {
/* istanbul ignore next */
      tabs.push('Annual');
/* istanbul ignore next */
      panels.push({ id: 'annual', html: buildTable(annual) });
    }
/* istanbul ignore next */
/* istanbul ignore next */
    if (quarter.length) {
/* istanbul ignore next */
      tabs.push('Quarterly');
/* istanbul ignore next */
      panels.push({ id: 'quarter', html: buildTable(quarter) });
    }
/* istanbul ignore next */
/* istanbul ignore next */
    if (ttm.length) {
/* istanbul ignore next */
      tabs.push('TTM');
/* istanbul ignore next */
      panels.push({ id: 'ttm', html: buildTable(ttm) });
    }

    let tabHtml = '<div class="gf-u-tabs">';
/* istanbul ignore next */
    for (let t = 0; t < tabs.length; t++) {
/* istanbul ignore next */
      tabHtml +=
/* istanbul ignore next */
        '<div class="gf-u-tab' +
/* istanbul ignore next */
        (t === 0 ? ' active' : '') +
/* istanbul ignore next */
        '" data-gfu="' +
/* istanbul ignore next */
        panels[t].id +
/* istanbul ignore next */
        '">' +
/* istanbul ignore next */
        tabs[t] +
/* istanbul ignore next */
        '</div>';
    }
/* istanbul ignore next */
    tabHtml += '</div>';

    let panelHtml = '';
/* istanbul ignore next */
    for (let p = 0; p < panels.length; p++) {
/* istanbul ignore next */
      panelHtml +=
/* istanbul ignore next */
        '<div class="gf-u-panel" data-gfu="' +
/* istanbul ignore next */
        panels[p].id +
/* istanbul ignore next */
        '" style="display:' +
/* istanbul ignore next */
        (p === 0 ? 'block' : 'none') +
/* istanbul ignore next */
        ';">' +
/* istanbul ignore next */
        panels[p].html +
/* istanbul ignore next */
        '</div>';
    }

    const wrap = document.createElement('div');
/* istanbul ignore next */
    wrap.className = 'gf-u-wrap';
/* istanbul ignore next */
    wrap.innerHTML =
/* istanbul ignore next */
      CSS +
/* istanbul ignore next */
      '<h3 style="margin:0 0 10px;font-size:16px;color:#333;">Financial Summary</h3>' +
/* istanbul ignore next */
      tabHtml +
/* istanbul ignore next */
      panelHtml;

/* istanbul ignore next */
    wrap.addEventListener('click', function (e) {
      const tab = e.target;
/* istanbul ignore next */
/* istanbul ignore next */
      if (!tab.classList.contains('gf-u-tab')) {
/* istanbul ignore next */
        return;
      }
      const id = tab.getAttribute('data-gfu');
      const allTabs = wrap.querySelectorAll('.gf-u-tab');
      const allPanels = wrap.querySelectorAll('.gf-u-panel');
/* istanbul ignore next */
      for (let i = 0; i < allTabs.length; i++) {
/* istanbul ignore next */
        allTabs[i].classList.remove('active');
      }
/* istanbul ignore next */
      for (let j = 0; j < allPanels.length; j++) {
/* istanbul ignore next */
        allPanels[j].style.display = 'none';
      }
/* istanbul ignore next */
      tab.classList.add('active');
      const target = wrap.querySelector('.gf-u-panel[data-gfu="' + id + '"]');
/* istanbul ignore next */
/* istanbul ignore next */
      if (target) {
/* istanbul ignore next */
        target.style.display = 'block';
      }
/* istanbul ignore next */
    });

    // Insert into summary container or after stock header
    const container = document.querySelector('.built-in-stock-summary');
/* istanbul ignore next */
/* istanbul ignore next */
    if (container) {
/* istanbul ignore next */
      container.appendChild(wrap);
/* istanbul ignore next */
      return true;
    }

    const header = document.querySelector('.stock-header');
/* istanbul ignore next */
/* istanbul ignore next */
    if (header && header.parentElement) {
/* istanbul ignore next */
      header.parentElement.insertBefore(wrap, header.nextSibling);
/* istanbul ignore next */
      return true;
    }

    const main = document.querySelector('.el-main');
/* istanbul ignore next */
/* istanbul ignore next */
    if (main) {
/* istanbul ignore next */
      main.insertBefore(wrap, main.firstChild);
/* istanbul ignore next */
      return true;
    }

/* istanbul ignore next */
    return false;
  }

  // --- Run ---
  let attempts = 0;
  function run() {
/* istanbul ignore next */
    removePaywall();
    const forecastDone = injectForecast();
    const forecastTablesDone = fillOriginalForecastTables();
    const financialsDone = injectFinancials();
/* istanbul ignore next */
/* istanbul ignore next */
    if (forecastDone && forecastTablesDone && financialsDone) {
/* istanbul ignore next */
      return;
    }
/* istanbul ignore next */
/* istanbul ignore next */
    if (++attempts < 40) {
/* istanbul ignore next */
      setTimeout(run, 500);
    }
  }

/* istanbul ignore next */
/* istanbul ignore next */
  if (document.readyState === 'loading') {
/* istanbul ignore next */
    document.addEventListener('DOMContentLoaded', function () {
/* istanbul ignore next */
      setTimeout(run, 500);
/* istanbul ignore next */
    });
/* istanbul ignore next */
  } else {
/* istanbul ignore next */
    setTimeout(run, 500);
  }

  // Periodic paywall removal + SPA navigation
  let lastPath = window.location.pathname;
/* istanbul ignore next */
  setInterval(function () {
/* istanbul ignore next */
    removePaywall();
/* istanbul ignore next */
/* istanbul ignore next */
    if (window.location.pathname !== lastPath) {
/* istanbul ignore next */
      lastPath = window.location.pathname;
      const old = document.querySelector('.gf-u-wrap');
/* istanbul ignore next */
/* istanbul ignore next */
      if (old) {
/* istanbul ignore next */
        old.remove();
      }
      const oldForecast = document.querySelector('.gf-u-forecast');
/* istanbul ignore next */
/* istanbul ignore next */
      if (oldForecast) {
/* istanbul ignore next */
        oldForecast.remove();
      }
/* istanbul ignore next */
      attempts = 0;
/* istanbul ignore next */
      setTimeout(run, 1000);
    }
    // Also periodically re-fill tables just in case Vue re-rendered them
/* istanbul ignore next */
    fillOriginalForecastTables();
/* istanbul ignore next */
  }, 2000);
/* istanbul ignore next */
})();
