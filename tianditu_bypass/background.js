/**
 * Tianditu Proxy Accelerator - V3.0
 * Direct SOCKS5 proxy from NAS-verified Chinese exit nodes.
 * No V2Ray middleman - browser connects to SOCKS5 proxies directly.
 */

const NAS_IP = '10.0.0.169';

// proxies.html now contains ONLY verified Chinese-exit proxies (written by updater.py)
const SOURCES = [
  {
    name: 'NAS Verified Proxies',
    url: `http://${NAS_IP}:8000/proxies.html`,
    type: 'raw_text'
  }
];

const ROTATION_INTERVAL_MINS = 5;

let proxyList = [];
let currentProxyIndex = 0;

/**
 * Updates the PAC script with SOCKS5 proxies.
 * Uses SOCKS5 so Chrome resolves DNS through the proxy (Chinese DNS).
 */
function updateProxySettings(proxyChain) {
  const config = {
    mode: 'pac_script',
    pacScript: {
      data: `
        function FindProxyForURL(url, host) {
          if (shExpMatch(host, "*.tianditu.gov.cn") || shExpMatch(host, "*.tianditu.cn") || host === "tianditu.gov.cn" || host === "tianditu.cn") {
            return "${proxyChain}";
          }
          return "DIRECT";
        }
      `
    }
  };

  chrome.proxy.settings.set({ value: config, scope: 'regular' }, () => {
    console.log(`[Tianditu] PAC active: ${proxyChain}`);
    chrome.action.setBadgeText({ text: 'ON' });
    chrome.action.setBadgeBackgroundColor({ color: '#4CAF50' });
  });
}

chrome.proxy.onProxyError.addListener((details) => {
  console.warn('[Tianditu] Proxy error:', details.error);
  if (details.fatal) {
    tryNextProxy();
  }
});

function tryNextProxy() {
  currentProxyIndex++;
  if (currentProxyIndex < proxyList.length) {
    applyProxyList();
  } else {
    console.warn('[Tianditu] All proxies exhausted, refreshing...');
    refreshProxy();
  }
}

function applyProxyList() {
  if (proxyList.length === 0) {
    console.warn('[Tianditu] No proxies available');
    chrome.action.setBadgeText({ text: 'OFF' });
    chrome.action.setBadgeBackgroundColor({ color: '#F44336' });
    return;
  }

  // Build a chain of all verified SOCKS5 proxies as failover
  const chain = proxyList
    .slice(currentProxyIndex)
    .map((p) => `SOCKS5 ${p.ip}:${p.port}`)
    .join('; ');

  updateProxySettings(chain);
}

async function refreshProxy() {
  console.log('[Tianditu] Refreshing verified proxy list from NAS...');
  currentProxyIndex = 0;

  try {
    await ensureOffscreenDocument();
    const results = await Promise.all(SOURCES.map((s) => fetchFromSource(s)));
    const fetchedProxies = results.flat();

    if (fetchedProxies.length > 0) {
      proxyList = fetchedProxies;
      console.log(`[Tianditu] Loaded ${proxyList.length} verified SOCKS5 proxies`);
    } else {
      console.warn('[Tianditu] No proxies from NAS, keeping previous list');
    }

    applyProxyList();
  } catch (e) {
    console.error('[Tianditu] Failed to refresh proxies:', e);
  }
}

async function ensureOffscreenDocument() {
  if (await chrome.offscreen.hasDocument()) {
    return;
  }
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
}

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
      await new Promise((r) => setTimeout(r, 200));
    }
  }
}

async function fetchFromSource(source) {
  try {
    await ensureOffscreenDocument();
    const fetchResult = await sendMessageToOffscreen({ type: 'FETCH_HTML', url: source.url });
    if (!fetchResult || fetchResult.error) {
      return [];
    }

    const result = await sendMessageToOffscreen({
      type: 'PARSE_PROXIES_MULTI',
      html: fetchResult.html,
      sourceType: source.type
    });
    return result.proxies || [];
  } catch (e) {
    console.error(`[Tianditu] ${source.name} failed: ${e.message}`);
    return [];
  }
}

chrome.alarms.create('refreshProxy', { periodInMinutes: ROTATION_INTERVAL_MINS });
chrome.alarms.onAlarm.addListener((a) => {
  if (a.name === 'refreshProxy') {
    refreshProxy();
  }
});

function clearTiandituData() {
  chrome.cookies.getAll({ domain: 'tianditu.gov.cn' }, (cookies) => {
    for (const cookie of cookies) {
      const url = `http${cookie.secure ? 's' : ''}://${cookie.domain.replace(/^\./, '')}${cookie.path}`;
      chrome.cookies.remove({ url, name: cookie.name });
    }
  });
  chrome.cookies.getAll({ domain: 'tianditu.cn' }, (cookies) => {
    for (const cookie of cookies) {
      const url = `http${cookie.secure ? 's' : ''}://${cookie.domain.replace(/^\./, '')}${cookie.path}`;
      chrome.cookies.remove({ url, name: cookie.name });
    }
  });
  console.log('[Tianditu] Cleared tianditu cookies');
}

chrome.runtime.onInstalled.addListener(() => {
  clearTiandituData();
  refreshProxy();
});
chrome.runtime.onStartup.addListener(() => {
  clearTiandituData();
  refreshProxy();
});
