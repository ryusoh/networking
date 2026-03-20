/**
 * Tianditu Proxy Accelerator
 * Optimized for use with a dedicated NAS or VPS proxy.
 * Routes all tianditu traffic through the designated proxy server.
 */

const NAS_IP = '10.0.0.169';
const NAS_TILE_CACHE_URL = `http://${NAS_IP}:8082`;

const SOURCES = [
  {
    name: 'Home NAS Proxy',
    url: 'http://10.0.0.169:8080',
    type: 'nas'
  },
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
let nasFailureCount = 0;
const MAX_NAS_FAILURES = 3;

/**
 * Updates the PAC script.
 * Optimization: Bypass NAS for JSON/Style files if they are failing.
 */
function updateProxySettings(server, fallbackServer = null) {
  const config = {
    mode: 'pac_script',
    pacScript: {
      data: `
        function FindProxyForURL(url, host) {
          if (shExpMatch(host, "*.tianditu.gov.cn") || shExpMatch(host, "*.tianditu.cn") || host === "tianditu.gov.cn" || host === "tianditu.cn") {
            // If it's a JSON/Style/Manifest, and we have a fallback, use the fallback to avoid connection resets
            if (url.indexOf(".json") !== -1 && "${fallbackServer}" !== "null") {
               return "${fallbackServer}";
            }
            return "${server}";
          }
          return "DIRECT";
        }
      `
    }
  };

  chrome.proxy.settings.set({ value: config, scope: 'regular' }, () => {
    console.log(`[Tianditu] Proxy active: ${server} (Fallback: ${fallbackServer})`);
    chrome.action.setBadgeText({ text: 'ON' });
    chrome.action.setBadgeBackgroundColor({ color: '#4CAF50' });
  });
}

/**
 * Notifies the Home NAS of the top discovered Chinese proxies.
 */
async function notifyNAS(proxies) {
  console.log(`[Tianditu] Notifying NAS of ${proxies.length} top exit nodes.`);
  try {
    await fetch(`http://${NAS_IP}:8081`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ proxies })
    });
  } catch (e) {
    console.warn('[Tianditu] Failed to notify NAS. Is updater.py running?', e.message);
  }
}

chrome.proxy.onProxyError.addListener((details) => {
  if (details.fatal) {
    console.warn('[Tianditu] Proxy error, rotating...');
    
    const currentProxy = proxyList[currentProxyIndex];
    if (currentProxy && (currentProxy.ip === NAS_IP || currentProxy.name === 'Home NAS')) {
      nasFailureCount++;
    }
    
    tryNextProxy();
  }
});

function tryNextProxy() {
  currentProxyIndex++;
  if (currentProxyIndex < proxyList.length) {
    const p = proxyList[currentProxyIndex];
    
    if ((p.ip === NAS_IP || p.name === 'Home NAS') && nasFailureCount >= MAX_NAS_FAILURES) {
      return tryNextProxy();
    }
    
    const serverString = `${p.scheme} ${p.ip}:${p.port}`;
    // Find a non-NAS Chinese proxy as a fallback for sensitive JSON requests
    const fallback = proxyList.find(item => item.type !== 'nas');
    const fallbackString = fallback ? `${fallback.scheme} ${fallback.ip}:${fallback.port}` : "null";
    
    updateProxySettings(serverString, fallbackString);
  } else {
    refreshProxy();
  }
}

let offscreenLock = null;

async function ensureOffscreenDocument() {
  if (await chrome.offscreen.hasDocument()) return;
  if (offscreenLock) return offscreenLock;

  offscreenLock = (async () => {
    try {
      await chrome.offscreen.createDocument({
        url: 'offscreen.html',
        reasons: ['DOM_PARSER'],
        justification: 'Fetch and parse proxies'
      });
    } catch (e) {
      if (!e.message.includes('Only a single offscreen document')) throw e;
    }
  })();

  try {
    await offscreenLock;
  } finally {
    offscreenLock = null;
  }
}

async function sendMessageToOffscreen(message, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await chrome.runtime.sendMessage(message);
      if (response) return response;
    } catch (e) {
      if (i === maxRetries - 1) throw e;
      await new Promise((r) => setTimeout(r, 200));
    }
  }
}

async function fetchFromSource(source) {
  try {
    const start = Date.now();
    await ensureOffscreenDocument();
    const fetchResult = await sendMessageToOffscreen({ type: 'FETCH_HTML', url: source.url });
    if (!fetchResult || fetchResult.error) return [];

    const html = fetchResult.html;
    const fetchTime = Date.now() - start;
    const result = await sendMessageToOffscreen({ type: 'PARSE_PROXIES_MULTI', html: html, sourceType: source.type });

    return result.proxies || [];
  } catch (e) {
    console.error(`[BENCHMARK] ${source.name} failed: ${e.message}`);
    return [];
  }
}

async function refreshProxy() {
  console.log('[Tianditu] Refreshing proxy list...');
  nasFailureCount = 0;
  try {
    await ensureOffscreenDocument();
    const results = await Promise.all(
      SOURCES.filter((s) => s.type !== 'nas').map((s) => fetchFromSource(s))
    );
    const fetchedProxies = results.flat();

    const nasProxy = {
      ip: NAS_IP,
      port: '8080',
      scheme: 'PROXY',
      speed: 10,
      name: 'Home NAS',
      type: 'nas'
    };

    if (fetchedProxies.length > 0) {
      const sorted = fetchedProxies.sort((a, b) => a.speed - b.speed);
      proxyList = [nasProxy, ...sorted];
      notifyNAS(sorted.slice(0, 3));
    } else {
      proxyList = [nasProxy];
    }

    currentProxyIndex = 0;
    const serverString = `${proxyList[0].scheme} ${proxyList[0].ip}:${proxyList[0].port}`;
    const fallback = proxyList.find(item => item.type !== 'nas');
    const fallbackString = fallback ? `${fallback.scheme} ${fallback.ip}:${fallback.port}` : "null";
    
    updateProxySettings(serverString, fallbackString);
  } catch (e) {
    console.error('[Tianditu] Failed to refresh proxies:', e);
  }
}

chrome.alarms.create('refreshProxy', { periodInMinutes: ROTATION_INTERVAL_MINS });
chrome.alarms.onAlarm.addListener((a) => { if (a.name === 'refreshProxy') refreshProxy(); });
chrome.runtime.onInstalled.addListener(refreshProxy);
chrome.runtime.onStartup.addListener(refreshProxy);
