/**
 * GuruFocus Unlocked (MAIN world)
 * Renders summary financial data directly from __NUXT__ state,
 * bypassing Vue subscription checks.
 */
(function () {
  'use strict';

  if (!window.location.hostname.endsWith('gurufocus.com')) return;

  // Only run on stock summary pages
  var path = window.location.pathname;
  if (!/\/stock\/[^/]+\/summary/.test(path) && !/\/stock\/[^/]+\/?$/.test(path)) return;

  // Intercept __NUXT__ to modify subscription state before hydration
  var nuxtData = undefined;
  var originalNuxtSet = false;
  try {
    var desc = Object.getOwnPropertyDescriptor(window, '__NUXT__');
    if (!desc || desc.configurable) {
      Object.defineProperty(window, '__NUXT__', {
        get: function () { return nuxtData; },
        set: function (val) {
          if (val && val.state) {
            val.state.subscription = {
              recheck: false, isPremium: true, plan: 'premium',
              premium: true, type: 'premium', level: 'premium', status: 'active'
            };
            if (val.state.user) val.state.user.pid = 1;
          }
          nuxtData = val;
          originalNuxtSet = true;
        },
        configurable: true
      });
    }
  } catch (e) {}

  function getFinancialData() {
    var nuxt = window.__NUXT__;
    if (!nuxt || !nuxt.state) return null;
    var ssf = nuxt.state.stock_summary_financial;
    if (!ssf) return null;
    return ssf.financials || ssf;
  }

  function formatNumber(val) {
    if (val === null || val === undefined || val === '') return '-';
    var n = parseFloat(val);
    if (isNaN(n)) return String(val);
    if (Math.abs(n) >= 1e9) return (n / 1e9).toFixed(2) + 'B';
    if (Math.abs(n) >= 1e6) return (n / 1e6).toFixed(2) + 'M';
    if (Math.abs(n) >= 1e3) return (n / 1e3).toFixed(2) + 'K';
    return n.toFixed(2);
  }

  function buildTable(data) {
    if (!data) return null;

    // data can be: { annual: [...], quarterly: [...] } or an array directly
    var annual = Array.isArray(data) ? data : (data.annual || data.annuals || []);
    if (!annual || !annual.length) {
      // Try to find any array property
      for (var key in data) {
        if (Array.isArray(data[key]) && data[key].length > 0) {
          annual = data[key];
          break;
        }
      }
    }
    if (!annual || !annual.length) return null;

    // Find the richest entry to discover metric keys (some entries are sparse)
    var sample = annual[0];
    for (var si = 1; si < annual.length; si++) {
      if (Object.keys(annual[si]).length > Object.keys(sample).length) {
        sample = annual[si];
      }
    }
    var metricKeys = [];
    var skipKeys = new Set(['fiscal_year', 'year', 'date', 'Fiscal_Year', 'restated_date', 'preliminary', 'currency', 'currency_id', 'id', 'exchange_id', 'stock_id', 'company_id', '']);
    for (var k in sample) {
      if (!skipKeys.has(k) && sample[k] !== null && sample[k] !== undefined) {
        metricKeys.push(k);
      }
    }

    // Sort by date/year descending
    var sorted = annual.slice().sort(function (a, b) {
      var da = a.fiscal_year || a.year || a.date || a.Fiscal_Year || '';
      var db = b.fiscal_year || b.year || b.date || b.Fiscal_Year || '';
      return String(db).localeCompare(String(da));
    });

    // Limit to last 10 years
    sorted = sorted.slice(0, 10);

    var html = '<table style="width:100%;border-collapse:collapse;font-size:13px;margin:10px 0;">';
    // Header row
    html += '<tr style="background:#f5f7fa;"><th style="padding:6px 10px;text-align:left;border-bottom:2px solid #ddd;">Metric</th>';
    sorted.forEach(function (entry) {
      var label = entry.fiscal_year || entry.year || entry.date || entry.Fiscal_Year || '?';
      html += '<th style="padding:6px 10px;text-align:right;border-bottom:2px solid #ddd;">' + label + '</th>';
    });
    html += '</tr>';

    // Data rows
    metricKeys.forEach(function (key, idx) {
      var bg = idx % 2 === 0 ? '#fff' : '#f9f9f9';
      var label = key.replace(/_/g, ' ').replace(/\b\w/g, function (c) { return c.toUpperCase(); });
      html += '<tr style="background:' + bg + ';"><td style="padding:5px 10px;border-bottom:1px solid #eee;white-space:nowrap;">' + label + '</td>';
      sorted.forEach(function (entry) {
        html += '<td style="padding:5px 10px;text-align:right;border-bottom:1px solid #eee;">' + formatNumber(entry[key]) + '</td>';
      });
      html += '</tr>';
    });

    html += '</table>';
    return html;
  }

  function injectSummary() {
    var data = getFinancialData();
    if (!data) return false;

    var tableHtml = buildTable(data);
    if (!tableHtml) return false;

    // Find the summary container
    var container = document.querySelector('.built-in-stock-summary')
      || document.querySelector('.stock-summary-container')
      || document.querySelector('[class*="summary"]');

    if (!container) {
      // Try the main content area
      container = document.querySelector('.page-container .el-main')
        || document.querySelector('#stock .el-main')
        || document.querySelector('.stock-page');
    }

    if (!container) return false;

    // Check if we already injected
    if (container.querySelector('.gf-unlocked-summary')) return true;

    // Check if the container already has meaningful content (real data rendered)
    var text = container.textContent.trim();
    if (text.length > 500) return true; // Real content already showing

    var wrapper = document.createElement('div');
    wrapper.className = 'gf-unlocked-summary';
    wrapper.style.cssText = 'padding:15px;overflow-x:auto;';
    wrapper.innerHTML = '<h3 style="margin:0 0 10px;font-size:16px;color:#333;">Financial Summary</h3>' + tableHtml;

    // Insert at the beginning of the container or replace empty content
    if (container.children.length === 0 || container.offsetHeight < 50) {
      container.innerHTML = '';
      container.appendChild(wrapper);
    } else {
      container.insertBefore(wrapper, container.firstChild);
    }

    return true;
  }

  // Try injection at multiple points
  var attempts = 0;
  var maxAttempts = 30;

  function tryInject() {
    attempts++;
    if (injectSummary()) return;
    if (attempts < maxAttempts) {
      setTimeout(tryInject, 500);
    }
  }

  // Start trying after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      setTimeout(tryInject, 500);
    });
  } else {
    setTimeout(tryInject, 500);
  }

  // Also watch for SPA navigation (Nuxt route changes)
  var lastPath = window.location.pathname;
  setInterval(function () {
    if (window.location.pathname !== lastPath) {
      lastPath = window.location.pathname;
      if (/\/stock\/[^/]+\/summary/.test(lastPath) || /\/stock\/[^/]+\/?$/.test(lastPath)) {
        attempts = 0;
        setTimeout(tryInject, 1000);
      }
    }
  }, 1000);
})();
