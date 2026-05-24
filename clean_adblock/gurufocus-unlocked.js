/**
 * GuruFocus Unlocked (MAIN world)
 * Removes paywall overlay elements and renders financial data from __NUXT__ state.
 */
(function () {
  'use strict';

  if (!window.location.hostname.endsWith('gurufocus.com')) return;

  // --- Anti-blur CSS ---
  var antiBlurInjected = false;
  function injectAntiBlur() {
    if (antiBlurInjected) return;
    var style = document.createElement('style');
    style.textContent = '.blur { filter: none !important; pointer-events: auto !important; user-select: auto !important; } [style*="blur"] { filter: none !important; pointer-events: auto !important; } .subscribe-card, .subscribe-card-small { display: none !important; } img[src*="blur"] { display: none !important; }';
    (document.head || document.documentElement).appendChild(style);
    antiBlurInjected = true;
  }

  // --- Paywall removal ---
  function removePaywall() {
    injectAntiBlur();
    document.body.style.overflow = 'visible';
    var els = document.querySelectorAll('.paywall-shadow, .paywall-node, .el-dialog__wrapper.gf, .v-modal, .subscribe-card, .subscribe-card-small');
    for (var i = 0; i < els.length; i++) els[i].remove();
    // Remove blur overlay images
    document.querySelectorAll('img[src*="blur"]').forEach(function (img) { img.remove(); });
    // Remove .blur class and inline blur styles from elements
    document.querySelectorAll('.blur, [style*="blur"]').forEach(unblur);
  }

  function unblur(el) {
    if (el.classList.contains('blur')) el.classList.remove('blur');
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
  var observer = new MutationObserver(function (mutations) {
    for (var i = 0; i < mutations.length; i++) {
      var m = mutations[i];
      if (m.type === 'attributes') {
        var el = m.target;
        if (el.classList && el.classList.contains('blur')) unblur(el);
        if (el.style && el.style.filter && el.style.filter.indexOf('blur') !== -1) unblur(el);
      }
      if (m.type === 'childList') {
        for (var j = 0; j < m.addedNodes.length; j++) {
          var node = m.addedNodes[j];
          if (node.nodeType !== 1) continue;
          // Remove blur overlay images
          if (node.tagName === 'IMG' && node.src && node.src.indexOf('blur') !== -1) {
            node.remove(); continue;
          }
          if (node.classList.contains('blur') || (node.style && node.style.filter && node.style.filter.indexOf('blur') !== -1)) {
            unblur(node);
          }
          var blurred = node.querySelectorAll ? node.querySelectorAll('.blur, [style*="blur"]') : [];
          for (var k = 0; k < blurred.length; k++) unblur(blurred[k]);
          // Remove blur images inside added subtrees
          var blurImgs = node.querySelectorAll ? node.querySelectorAll('img[src*="blur"]') : [];
          for (var l = 0; l < blurImgs.length; l++) blurImgs[l].remove();
        }
      }
    }
  });
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'style'], childList: true, subtree: true });

  // --- Forecast data rendering from Vue components ---
  function injectForecast() {
    if (document.querySelector('.gf-u-forecast')) return true;
    if (!/\/forecast/.test(window.location.pathname)) return false;

    var vueEl = document.querySelector('[data-v-5ccaf75f]');
    if (!vueEl || !vueEl.__vue__) return false;
    var vm = vueEl.__vue__;
    if (vm.loading || vm.noData) return false;

    var est = vm.estimateData;
    var priceData = vm.priceData;
    if (!est) return false;

    var currentPrice = priceData && priceData.length ? parseFloat(priceData[priceData.length - 1][1]) : null;
    var upside = currentPrice ? (((est.mean - currentPrice) / currentPrice) * 100).toFixed(2) : null;
    var upsideColor = upside >= 0 ? '#67c23a' : '#f56c6c';

    var html = '<div class="gf-u-forecast" style="padding:16px;margin:12px 0;background:#fff;border:1px solid #eee;border-radius:8px;font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,sans-serif;">' +
      '<h3 style="margin:0 0 12px;font-size:16px;color:#333;">Analyst Price Target</h3>' +
      '<div style="display:flex;gap:24px;flex-wrap:wrap;align-items:center;">' +
        '<div style="text-align:center;padding-right:24px;border-right:1px solid #eee;">' +
          '<div style="font-size:13px;color:#666;">Average Target</div>' +
          '<div style="font-size:28px;font-weight:700;color:' + upsideColor + ';">$' + est.mean.toFixed(2) + '</div>' +
          (upside !== null ? '<div style="font-size:14px;color:' + upsideColor + ';">(' + (upside >= 0 ? '+' : '') + upside + '% Upside)</div>' : '') +
        '</div>' +
        '<div style="display:flex;gap:20px;">' +
          '<div style="text-align:center;"><div style="font-size:12px;color:#999;">High</div><div style="font-size:18px;font-weight:600;color:#67c23a;">$' + est.high.toFixed(2) + '</div></div>' +
          '<div style="text-align:center;"><div style="font-size:12px;color:#999;">Median</div><div style="font-size:18px;font-weight:600;color:#333;">$' + est.med.toFixed(2) + '</div></div>' +
          '<div style="text-align:center;"><div style="font-size:12px;color:#999;">Low</div><div style="font-size:18px;font-weight:600;color:#f56c6c;">$' + est.low.toFixed(2) + '</div></div>' +
          '<div style="text-align:center;"><div style="font-size:12px;color:#999;">Analysts</div><div style="font-size:18px;font-weight:600;color:#333;">' + est.num + '</div></div>' +
        '</div>' +
      '</div>' +
      (currentPrice !== null ? '<div style="margin-top:8px;font-size:13px;color:#666;">Current Price: <strong>$' + currentPrice.toFixed(2) + '</strong> | Updated: ' + (est.entry_date || '') + '</div>' : '') +
    '</div>';

    // Replace blur image containers or insert after subscribe card removal points
    var inserted = false;
    var blurImgParents = document.querySelectorAll('[data-v-5ccaf75f]');
    for (var i = 0; i < blurImgParents.length; i++) {
      var parent = blurImgParents[i];
      if (parent.__vue__ && parent.__vue__.estimateData && !inserted) {
        var wrap = document.createElement('div');
        wrap.innerHTML = html;
        parent.parentElement.insertBefore(wrap.firstChild, parent);
        inserted = true;
        break;
      }
    }
    if (!inserted) {
      var main = document.querySelector('.el-main');
      if (main) {
        var wrap = document.createElement('div');
        wrap.innerHTML = html;
        main.insertBefore(wrap.firstChild, main.firstChild);
        inserted = true;
      }
    }
    return inserted;
  }

  // --- Shared Utilities ---
  var CSS = '<style>' +
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

  var SKIP = {'':1,date:1,fiscal_year:1,year:1,id:1,stock_id:1,company_id:1,exchange_id:1,currency:1,currency_id:1,preliminary:1,restated_date:1};

  function fmt(v) {
    if (v === null || v === undefined || v === '') return '-';
    var n = parseFloat(v);
    if (isNaN(n)) return String(v);
    if (Math.abs(n) >= 1e9) return (n / 1e9).toFixed(2) + 'B';
    if (Math.abs(n) >= 1e6) return (n / 1e6).toFixed(2) + 'M';
    if (Math.abs(n) >= 1e3 && n % 1 === 0) return (n / 1e3).toFixed(1) + 'K';
    if (Math.abs(n) < 0.01 && n !== 0) return n.toFixed(4);
    return n.toFixed(2);
  }

  var LABEL_TO_METRIC = {
    'revenue': 'revenue_estimate',
    'eps without nri': 'eps_nri_estimate',
    'eps': 'per_share_eps_estimate',
    'dividends per share': 'dividend_estimate',
    'ebit': 'ebit_estimate',
    'ebitda': 'ebitda_estimate',
    'pretax income': 'pretax_income_estimate',
    'net income': 'net_income_estimate',
    'book value per share': 'book_value_per_share_estimate',
    'operating cash flow per share': 'operating_cash_flow_per_share_estimate',
    'gross margin': 'gross_margin_estimate',
    'roa': 'roa_estimate',
    'roe': 'roe_estimate'
  };

  function fillOriginalForecastTables() {
    // Find parent component with estimate.estimate_current
    var el = document.querySelector('.m-t-md.border.p-md');
    if (!el || !el.__vue__) return false;
    var vm = el.__vue__;
    while (vm && !(vm.estimate && vm.estimate.estimate_current)) vm = vm.$parent;
    if (!vm) return false;

    var est = vm.estimate.estimate_current;
    var sections = document.querySelectorAll('.m-t-md.border.p-md');
    var filledAny = false;
    var totalEmptyExpected = 0;

    for (var i = 0; i < sections.length; i++) {
      var table = sections[i].querySelector('table');
      if (!table) continue;

      var dateRow = null;
      var trs = table.querySelectorAll('tr');
      for (var j = 0; j < trs.length; j++) {
        if (trs[j].innerText.match(/\d{4}-\d{2}/)) {
          dateRow = trs[j]; // get the lowest row containing dates
        }
      }
      if (!dateRow) continue;

      var ths = dateRow.querySelectorAll('th, td');
      var colMap = {};
      for (var c = 0; c < ths.length; c++) {
        var match = ths[c].innerText.trim().match(/^(\d{4})-(\d{2})/);
        if (match) colMap[c] = match[1] + match[2];
      }

      var lastMKey = null;
      for (var r = 0; r < trs.length; r++) {
        var tds = trs[r].querySelectorAll('td');
        if (!tds.length) continue;
        
        var labelNode = tds[0].querySelector('.el-tooltip') || tds[0];
        var label = labelNode.innerText.trim().toLowerCase();
        
        var mKey = LABEL_TO_METRIC[label];
        var statKey = null;

        if (mKey) {
          lastMKey = mKey;
          statKey = 'mean';
        } else if (lastMKey) {
          if (label.indexOf('no. of analysts') !== -1) statKey = 'num';
          else if (label.indexOf('high estimate') !== -1) statKey = 'high';
          else if (label.indexOf('low estimate') !== -1) statKey = 'low';
          else if (label.indexOf('median estimate') !== -1) statKey = 'med';
          else if (label.indexOf('standard deviation') !== -1) statKey = 'std';
          else if (label.indexOf('smart estimate') !== -1) statKey = 'smart';
          else { lastMKey = null; continue; }
          mKey = lastMKey;
        } else {
          continue;
        }

        var offset = tds.length - ths.length;
        for (var colIdx in colMap) {
          var tdIndex = parseInt(colIdx) + offset;
          if (tdIndex > 0 && tdIndex < tds.length) {
            var cell = tds[tdIndex];
            var innerText = cell.innerText.trim();
            if (!innerText || innerText === '-') {
              totalEmptyExpected++;
              var ek = colMap[colIdx];
              var val = null;
              if (est.annual && est.annual[mKey] && est.annual[mKey][ek] && est.annual[mKey][ek][statKey] != null) {
                val = est.annual[mKey][ek][statKey];
              } else if (est.quarterly && est.quarterly[mKey] && est.quarterly[mKey][ek] && est.quarterly[mKey][ek][statKey] != null) {
                val = est.quarterly[mKey][ek][statKey];
              }
              
              if (val != null) {
                if (statKey === 'num') {
                  cell.innerText = val;
                } else {
                  cell.innerText = fmt(val);
                }
                cell.style.color = '#409eff';
                if (statKey === 'mean') cell.style.fontWeight = 'bold';
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

  function buildTable(entries) {
    if (!entries || !entries.length) return '';
    var best = entries[0];
    for (var i = 1; i < entries.length; i++) {
      if (Object.keys(entries[i]).length > Object.keys(best).length) best = entries[i];
    }
    var metrics = [];
    for (var k in best) {
      if (!SKIP[k] && best[k] !== null && best[k] !== undefined) metrics.push(k);
    }
    if (!metrics.length) return '';
    var sorted = entries.slice().sort(function (a, b) {
      return String(b.date || '').localeCompare(String(a.date || ''));
    }).slice(0, 10);

    var h = '<table class="gf-u-table"><tr><th>Metric</th>';
    for (var s = 0; s < sorted.length; s++) h += '<th>' + (sorted[s].date || '?') + '</th>';
    h += '</tr>';
    for (var m = 0; m < metrics.length; m++) {
      var label = metrics[m].replace(/_/g, ' ').replace(/\b[a-z]/g, function(c) { return c.toUpperCase(); });
      h += '<tr><td>' + label + '</td>';
      for (var c = 0; c < sorted.length; c++) h += '<td>' + fmt(sorted[c][metrics[m]]) + '</td>';
      h += '</tr>';
    }
    return h + '</table>';
  }

  function injectFinancials() {
    if (document.querySelector('.gf-u-wrap')) return true;

    var nuxt = window.__NUXT__;
    if (!nuxt || !nuxt.state || !nuxt.state.stock_summary_financial) return false;
    var fin = nuxt.state.stock_summary_financial.financials;
    if (!fin) return false;

    var annual = fin.annual || [];
    var quarter = fin.quarter || [];
    var ttm = fin.ttm || [];
    if (!annual.length && !quarter.length && !ttm.length) return false;

    var tabs = [], panels = [];
    if (annual.length) { tabs.push('Annual'); panels.push({id:'annual', html:buildTable(annual)}); }
    if (quarter.length) { tabs.push('Quarterly'); panels.push({id:'quarter', html:buildTable(quarter)}); }
    if (ttm.length) { tabs.push('TTM'); panels.push({id:'ttm', html:buildTable(ttm)}); }

    var tabHtml = '<div class="gf-u-tabs">';
    for (var t = 0; t < tabs.length; t++) {
      tabHtml += '<div class="gf-u-tab' + (t === 0 ? ' active' : '') + '" data-gfu="' + panels[t].id + '">' + tabs[t] + '</div>';
    }
    tabHtml += '</div>';

    var panelHtml = '';
    for (var p = 0; p < panels.length; p++) {
      panelHtml += '<div class="gf-u-panel" data-gfu="' + panels[p].id + '" style="display:' + (p === 0 ? 'block' : 'none') + ';">' + panels[p].html + '</div>';
    }

    var wrap = document.createElement('div');
    wrap.className = 'gf-u-wrap';
    wrap.innerHTML = CSS + '<h3 style="margin:0 0 10px;font-size:16px;color:#333;">Financial Summary</h3>' + tabHtml + panelHtml;

    wrap.addEventListener('click', function (e) {
      var tab = e.target;
      if (!tab.classList.contains('gf-u-tab')) return;
      var id = tab.getAttribute('data-gfu');
      var allTabs = wrap.querySelectorAll('.gf-u-tab');
      var allPanels = wrap.querySelectorAll('.gf-u-panel');
      for (var i = 0; i < allTabs.length; i++) allTabs[i].classList.remove('active');
      for (var j = 0; j < allPanels.length; j++) allPanels[j].style.display = 'none';
      tab.classList.add('active');
      var target = wrap.querySelector('.gf-u-panel[data-gfu="' + id + '"]');
      if (target) target.style.display = 'block';
    });

    // Insert into summary container or after stock header
    var container = document.querySelector('.built-in-stock-summary');
    if (container) { container.appendChild(wrap); return true; }

    var header = document.querySelector('.stock-header');
    if (header && header.parentElement) {
      header.parentElement.insertBefore(wrap, header.nextSibling);
      return true;
    }

    var main = document.querySelector('.el-main');
    if (main) { main.insertBefore(wrap, main.firstChild); return true; }

    return false;
  }

  // --- Run ---
  var attempts = 0;
  function run() {
    removePaywall();
    var forecastDone = injectForecast();
    var forecastTablesDone = fillOriginalForecastTables();
    var financialsDone = injectFinancials();
    if (forecastDone && forecastTablesDone && financialsDone) return;
    if (++attempts < 40) setTimeout(run, 500);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { setTimeout(run, 500); });
  } else {
    setTimeout(run, 500);
  }

  // Periodic paywall removal + SPA navigation
  var lastPath = window.location.pathname;
  setInterval(function () {
    removePaywall();
    if (window.location.pathname !== lastPath) {
      lastPath = window.location.pathname;
      var old = document.querySelector('.gf-u-wrap');
      if (old) old.remove();
      var oldForecast = document.querySelector('.gf-u-forecast');
      if (oldForecast) oldForecast.remove();
      attempts = 0;
      setTimeout(run, 1000);
    }
    // Also periodically re-fill tables just in case Vue re-rendered them
    fillOriginalForecastTables();
  }, 2000);
})();
