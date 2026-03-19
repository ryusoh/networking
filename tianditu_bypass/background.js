/**
 * Tianditu Auto-Proxy - Background Script
 * Automatically fetches and validates Chinese proxies.
 */

const PROXY_URL = 'https://www.freeproxy.world/?type=&anonymity=&country=CN&speed=1500';
const ROTATION_INTERVAL_MINS = 15;
let proxyList = [];
let currentProxyIndex = 0;

/**
 * Updates the Chrome proxy settings.
 */
function updateProxySettings(server) {
  const config = {
    mode: 'pac_script',
    pacScript: {
      data: `
        function FindProxyForURL(url, host) {
          if (shExpMatch(host, "*.tianditu.gov.cn") || shExpMatch(host, "*.tianditu.cn") || host === "tianditu.gov.cn" || host === "tianditu.cn") {
            return "${server}";
          }
          return "DIRECT";
        }
      `
    }
  };

  chrome.proxy.settings.set({ value: config, scope: 'regular' }, () => {
    console.log(`Tianditu proxy set to: ${server}`);
  });
}

/**
 * Validates a proxy by attempting a small fetch.
 * Note: Browser-level proxy validation is tricky in a service worker.
 * We'll implement a 'next on failure' logic via proxy error listener.
 */
chrome.proxy.onProxyError.addListener((details) => {
  console.warn('Proxy Error detected:', details.error);
  if (details.fatal) {
    console.log('Fatal proxy error, rotating to next available proxy...');
    tryNextProxy();
  }
});

function tryNextProxy() {
  currentProxyIndex++;
  if (currentProxyIndex < proxyList.length) {
    const next = proxyList[currentProxyIndex];
    updateProxySettings(`${next.scheme} ${next.ip}:${next.port}`);
  } else {
    console.warn('Exhausted proxy list, refreshing from source...');
    refreshProxy();
  }
}

/**
 * Fetches the proxy list.
 */
async function refreshProxy() {
  console.log('Refreshing proxy list from source...');
  try {
    const response = await fetch(PROXY_URL, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    const html = await response.text();

    if (!(await chrome.offscreen.hasDocument())) {
      await chrome.offscreen.createDocument({
        url: 'offscreen.html',
        reasons: ['DOM_PARSER'],
        justification: 'Parse proxy list'
      });
    }

    const result = await chrome.runtime.sendMessage({ type: 'PARSE_PROXIES_LIST', html: html });

    if (result && result.proxies && result.proxies.length > 0) {
      proxyList = result.proxies;
      currentProxyIndex = 0;
      const best = proxyList[0];
      updateProxySettings(`${best.scheme} ${best.ip}:${best.port}`);
    }
  } catch (error) {
    console.error('Failed to refresh proxy:', error);
  }
}

chrome.alarms.create('refreshProxy', { periodInMinutes: ROTATION_INTERVAL_MINS });
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'refreshProxy') {
    refreshProxy();
  }
});
chrome.runtime.onInstalled.addListener(refreshProxy);
chrome.runtime.onStartup.addListener(refreshProxy);
