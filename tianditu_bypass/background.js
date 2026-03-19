/**
 * Tianditu Hybrid Accelerator
 * Automatically switches between "Fast-Path" (Spoofing) and "Safe-Path" (Proxy).
 */

const PROXY_URL = 'https://www.freeproxy.world/?type=&anonymity=&country=CN&speed=1500';
const ROTATION_INTERVAL_MINS = 15;

let proxyList = [];
let currentProxyIndex = 0;
const failedHosts = new Set();

/**
 * Updates the PAC script.
 * If a host is in 'failedHosts', it uses the proxy. Otherwise, it goes DIRECT (Fast-Path).
 */
function updateProxySettings(server) {
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
            // Check if this specific host has failed Fast-Path before
            if (failedHosts.includes(host)) {
              return "${server}";
            }
            // First attempt: Try DIRECT (Fast-Path headers are injected by declarativeNetRequest)
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
        if (proxyList.length > 0) {
          const p = proxyList[currentProxyIndex];
          updateProxySettings(`${p.scheme} ${p.ip}:${p.port}`);
        }
      }
    }
  },
  { urls: ['*://*.tianditu.gov.cn/*', '*://*.tianditu.cn/*'] }
);

// Listen for TCP level failures (Connection Reset / Timeout)
chrome.webRequest.onErrorOccurred.addListener(
  (details) => {
    const host = new URL(details.url).hostname;
    if (!failedHosts.has(host)) {
      console.warn(
        `Connection failure (${details.error}) for ${host}. Switching to proxy fallback.`
      );
      failedHosts.add(host);
      if (proxyList.length > 0) {
        const p = proxyList[currentProxyIndex];
        updateProxySettings(`${p.scheme} ${p.ip}:${p.port}`);
      }
    }
  },
  { urls: ['*://*.tianditu.gov.cn/*', '*://*.tianditu.cn/*'] }
);

/**
 * Handle Proxy Rotation and List Management
 */
chrome.proxy.onProxyError.addListener((details) => {
  if (details.fatal) {
    currentProxyIndex++;
    if (currentProxyIndex < proxyList.length) {
      const p = proxyList[currentProxyIndex];
      updateProxySettings(`${p.scheme} ${p.ip}:${p.port}`);
    } else {
      refreshProxy();
    }
  }
});

async function refreshProxy() {
  try {
    const response = await fetch(PROXY_URL, { headers: { 'User-Agent': 'Mozilla/5.0...' } });
    const html = await response.text();
    if (!(await chrome.offscreen.hasDocument())) {
      await chrome.offscreen.createDocument({
        url: 'offscreen.html',
        reasons: ['DOM_PARSER'],
        justification: 'Parse proxies'
      });
    }
    const result = await chrome.runtime.sendMessage({ type: 'PARSE_PROXIES_LIST', html: html });
    if (result && result.proxies && result.proxies.length > 0) {
      proxyList = result.proxies;
      currentProxyIndex = 0;
      updateProxySettings(`${proxyList[0].scheme} ${proxyList[0].ip}:${proxyList[0].port}`);
    }
  } catch (e) {
    console.error(e);
  }
}

chrome.alarms.create('refreshProxy', { periodInMinutes: ROTATION_INTERVAL_MINS });
chrome.alarms.onAlarm.addListener((a) => {
  if (a.name === 'refreshProxy') {refreshProxy();}
});
chrome.runtime.onInstalled.addListener(refreshProxy);
chrome.runtime.onStartup.addListener(refreshProxy);
