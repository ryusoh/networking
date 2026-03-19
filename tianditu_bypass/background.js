/**
 * Tianditu Hybrid Accelerator
 * Automatically switches between "Fast-Path" (Spoofing) and "Safe-Path" (Proxy).
 * Multi-source fetch for higher reliability.
 */

const SOURCES = [
  {
    name: 'freeproxy.world',
    url: 'https://www.freeproxy.world/?type=&anonymity=&country=CN&speed=1500',
    type: 'freeproxyworld'
  },
  {
    name: 'databay.com',
    url: 'https://databay.com/free-proxy-list/china',
    type: 'databay'
  }
];

const ROTATION_INTERVAL_MINS = 15;

let proxyList = [];
let currentProxyIndex = 0;
const failedHosts = new Set();
let currentProxyServer = '';

/**
 * Updates the PAC script.
 */
function updateProxySettings(server) {
  currentProxyServer = server;
  const failedHostsList = Array.from(failedHosts)
    .map((h) => `"${h}"`)
    .join(',');

  const config = {
    mode: 'pac_script',
    pacScript: {
      data: `
        const failedHosts = [${failedHostsList}];
        function FindProxyForURL(url, host) {
          if (shExpMatch(host, "*.tianditu.gov.cn") || shExpMatch(host, "*.tianditu.cn") || host === "tianditu.gov.cn" || host === "tianditu.cn") {
            if (failedHosts.includes(host)) {
              return "${server}";
            }
            return "DIRECT";
          }
          return "DIRECT";
        }
      `
    }
  };

  chrome.proxy.settings.set({ value: config, scope: 'regular' }, () => {
    console.log(
      `Tianditu Hybrid config updated. Current Proxy: ${server}. Blocked Hosts: ${failedHosts.size}`
    );
  });
}

// Listen for 418 (WAF Block) or Connection Reset to trigger failover
chrome.webRequest.onHeadersReceived.addListener(
  (details) => {
    if (details.statusCode === 418) {
      const host = new URL(details.url).hostname;
      if (!failedHosts.has(host)) {
        console.warn(`418 Block detected for ${host}. Switching to proxy fallback.`);
        failedHosts.add(host);
        updateProxySettings(currentProxyServer);
      }
    }
  },
  { urls: ['*://*.tianditu.gov.cn/*', '*://*.tianditu.cn/*'] }
);

chrome.webRequest.onErrorOccurred.addListener(
  (details) => {
    const host = new URL(details.url).hostname;
    if (!failedHosts.has(host)) {
      console.warn(
        `Connection failure (${details.error}) for ${host}. Switching to proxy fallback.`
      );
      failedHosts.add(host);
      updateProxySettings(currentProxyServer);
    }
  },
  { urls: ['*://*.tianditu.gov.cn/*', '*://*.tianditu.cn/*'] }
);

chrome.proxy.onProxyError.addListener((details) => {
  if (details.fatal) {
    console.warn('Fatal proxy error, rotating...');
    tryNextProxy();
  }
});

function tryNextProxy() {
  currentProxyIndex++;
  if (currentProxyIndex < proxyList.length) {
    const p = proxyList[currentProxyIndex];
    updateProxySettings(`${p.scheme} ${p.ip}:${p.port}`);
  } else {
    refreshProxy();
  }
}

let offscreenLock = null;

/**
 * Ensures that the offscreen document exists.
 */
async function ensureOffscreenDocument() {
  if (await chrome.offscreen.hasDocument()) {
    return;
  }

  if (offscreenLock) {
    return offscreenLock;
  }

  offscreenLock = (async () => {
    try {
      await chrome.offscreen.createDocument({
        url: 'offscreen.html',
        reasons: ['DOM_PARSER'],
        justification: 'Fetch and parse proxies'
      });
    } catch (e) {
      if (!e.message.includes('Only a single offscreen document')) {
        throw e;
      }
    }
  })();

  try {
    await offscreenLock;
  } finally {
    offscreenLock = null;
  }
}

/**
 * Sends a message to the offscreen document with retries.
 */
async function sendMessageToOffscreen(message, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await chrome.runtime.sendMessage(message);
      if (response) {
        return response;
      }
    } catch (e) {
      if (i === maxRetries - 1) {
        throw e;
      }
      // Small delay before retry to let offscreen document stabilize
      await new Promise((r) => setTimeout(r, 200));
    }
  }
}

async function fetchFromSource(source) {
  try {
    const start = Date.now();

    await ensureOffscreenDocument();

    // Perform fetch via offscreen document
    const fetchResult = await sendMessageToOffscreen({
      type: 'FETCH_HTML',
      url: source.url
    });

    if (!fetchResult) {
      console.error(
        `[BENCHMARK] ${source.name} fetch failed: No response from offscreen document.`
      );
      return [];
    }

    if (fetchResult.error) {
      console.error(`[BENCHMARK] ${source.name} fetch failed via offscreen: ${fetchResult.error}.`);
      return [];
    }

    const html = fetchResult.html;
    const fetchTime = Date.now() - start;

    const result = await sendMessageToOffscreen({
      type: 'PARSE_PROXIES_MULTI',
      html: html,
      sourceType: source.type
    });

    if (result && result.proxies && result.proxies.length > 0) {
      const avg = Math.round(
        result.proxies.reduce((a, b) => a + b.speed, 0) / result.proxies.length
      );
      const min = Math.min(...result.proxies.map((p) => p.speed));
      console.log(
        `[BENCHMARK] ${source.name}: Found ${result.proxies.length} proxies in ${fetchTime}ms. Avg Latency: ${avg}ms. Fastest: ${min}ms.`
      );
    } else {
      console.warn(`[BENCHMARK] ${source.name} returned zero valid proxies in ${fetchTime}ms.`);
    }

    return result.proxies || [];
  } catch (e) {
    console.error(`[BENCHMARK] ${source.name} failed: ${e.message}`);
    return [];
  }
}

async function refreshProxy() {
  console.log('Refreshing proxy list from multiple sources...');

  try {
    await ensureOffscreenDocument();
    const results = await Promise.all(SOURCES.map((s) => fetchFromSource(s)));
    const allProxies = results.flat();

    if (allProxies.length > 0) {
      proxyList = allProxies.sort((a, b) => a.speed - b.speed);
      currentProxyIndex = 0;
      const best = proxyList[0];
      updateProxySettings(`${best.scheme} ${best.ip}:${best.port}`);
    } else {
      console.error('No proxies found from any source.');
    }
  } catch (e) {
    console.error('Failed to refresh proxies:', e);
  }
}

chrome.alarms.create('refreshProxy', { periodInMinutes: ROTATION_INTERVAL_MINS });
chrome.alarms.onAlarm.addListener((a) => {
  if (a.name === 'refreshProxy') {
    refreshProxy();
  }
});
chrome.runtime.onInstalled.addListener(refreshProxy);
chrome.runtime.onStartup.addListener(refreshProxy);
