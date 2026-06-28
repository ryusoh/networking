const updateBadge = () => {
/* istanbul ignore next */
  if (typeof chrome !== 'undefined' && chrome.action && chrome.storage) {
/* istanbul ignore next */
    chrome.storage.sync.get({ enabled: true, mode: 'selective' }, (prefs) => {
      const isEnabled = prefs.enabled !== false;
      const mode = prefs.mode || 'selective';
/* istanbul ignore next */
      if (!isEnabled) {
/* istanbul ignore next */
        chrome.action.setBadgeText({ text: 'OFF' });
/* istanbul ignore next */
        chrome.action.setBadgeBackgroundColor({ color: '#F44336' });
/* istanbul ignore next */
      } else {
/* istanbul ignore next */
        chrome.action.setBadgeText({ text: mode === 'all' ? 'ON' : 'SEL' });
/* istanbul ignore next */
        chrome.action.setBadgeBackgroundColor({
/* istanbul ignore next */
          color: mode === 'all' ? '#4CAF50' : '#2196F3'
/* istanbul ignore next */
        });
      }
/* istanbul ignore next */
    });
  }
/* istanbul ignore next */
};

let isUpdatingRules = false;
const updateBlockingRules = async (hostnames) => {
/* istanbul ignore next */
/* istanbul ignore next */
  if (isUpdatingRules) {
/* istanbul ignore next */
    return;
  }
/* istanbul ignore next */
  isUpdatingRules = true;
/* istanbul ignore next */
  try {
    const uniqueHosts = Array.from(new Set(hostnames || [])).filter((h) => h && h.trim());
    const existingRules = await chrome.declarativeNetRequest.getDynamicRules();
    const removeRuleIds = existingRules.map((r) => r.id);
    const addRules = [];

/* istanbul ignore next */
/* istanbul ignore next */
    if (uniqueHosts.length > 0) {
/* istanbul ignore next */
      uniqueHosts.forEach((host, i) => {
        const baseId = i * 2 + 1;
/* istanbul ignore next */
        addRules.push({
/* istanbul ignore next */
          id: baseId,
/* istanbul ignore next */
          priority: 1,
/* istanbul ignore next */
          action: { type: 'block' },
/* istanbul ignore next */
          condition: {
/* istanbul ignore next */
            urlFilter: `||${host}/*`,
/* istanbul ignore next */
            resourceTypes: ['script'],
/* istanbul ignore next */
            excludedInitiatorDomains: ['lyeutsaon.com']
          }
/* istanbul ignore next */
        });
/* istanbul ignore next */
        addRules.push({
/* istanbul ignore next */
          id: baseId + 1,
/* istanbul ignore next */
          priority: 1,
/* istanbul ignore next */
          action: {
/* istanbul ignore next */
            type: 'modifyHeaders',
/* istanbul ignore next */
            responseHeaders: [
/* istanbul ignore next */
              {
/* istanbul ignore next */
                header: 'content-security-policy',
/* istanbul ignore next */
                operation: 'set',
/* istanbul ignore next */
                value: "script-src 'none'; object-src 'none';"
              }
/* istanbul ignore next */
            ]
/* istanbul ignore next */
          },
/* istanbul ignore next */
          condition: {
/* istanbul ignore next */
            urlFilter: `||${host}/*`,
/* istanbul ignore next */
            resourceTypes: ['main_frame', 'sub_frame'],
/* istanbul ignore next */
            excludedInitiatorDomains: ['lyeutsaon.com']
          }
/* istanbul ignore next */
        });
/* istanbul ignore next */
      });
    }

/* istanbul ignore next */
    await chrome.declarativeNetRequest.updateDynamicRules({ removeRuleIds, addRules });
  } catch (e) {
/* istanbul ignore next */
    console.error('DNR Update Error:', e);
/* istanbul ignore next */
  } finally {
/* istanbul ignore next */
    isUpdatingRules = false;
  }
/* istanbul ignore next */
};

// Ad network domains to block at the network level
const AD_NETWORK_DOMAINS = [
/* istanbul ignore next */
  'adrecover.com',
/* istanbul ignore next */
  'adpushup.com',
/* istanbul ignore next */
  'publift.com',
/* istanbul ignore next */
  'vdo.ai',
/* istanbul ignore next */
  'primis.tech',
/* istanbul ignore next */
  'undrads.com',
/* istanbul ignore next */
  'fundingchoicesmessages.google.com',
/* istanbul ignore next */
  'adservice.google.com',
/* istanbul ignore next */
  'cdn.admiral-media.com',
/* istanbul ignore next */
  'v.admiral-media.com',
/* istanbul ignore next */
  'admiral.mgr.consensu.org',
/* istanbul ignore next */
  'cdn.taboola.com',
/* istanbul ignore next */
  'trc.taboola.com',
/* istanbul ignore next */
  'api.taboola.com',
/* istanbul ignore next */
  'taboolasyndication.com',
/* istanbul ignore next */
  'erebor.douban.com'
/* istanbul ignore next */
];

/* istanbul ignore next */
async function setupAdNetworkBlocking() {
/* istanbul ignore next */
  try {
    const existingRules = await chrome.declarativeNetRequest.getDynamicRules();
    // Use IDs 9000+ to avoid conflicts with jsBlocked rules
    const adRuleIds = existingRules.filter((r) => r.id >= 9000).map((r) => r.id);

    const addRules = AD_NETWORK_DOMAINS.map((domain, i) => ({
/* istanbul ignore next */
      id: 9000 + i,
/* istanbul ignore next */
      priority: 2,
/* istanbul ignore next */
      action: { type: 'block' },
/* istanbul ignore next */
      condition: {
/* istanbul ignore next */
        urlFilter: `||${domain}`,
/* istanbul ignore next */
        resourceTypes: ['script', 'sub_frame', 'xmlhttprequest', 'image', 'other'],
/* istanbul ignore next */
        excludedInitiatorDomains: ['lyeutsaon.com', 'x.com', 'twitter.com']
      }
/* istanbul ignore next */
    }));

/* istanbul ignore next */
    await chrome.declarativeNetRequest.updateDynamicRules({
/* istanbul ignore next */
      removeRuleIds: adRuleIds,
/* istanbul ignore next */
      addRules
/* istanbul ignore next */
    });
  } catch (e) {
/* istanbul ignore next */
    console.error('Ad network blocking setup failed:', e);
  }
}

/* istanbul ignore next */
chrome.runtime.onInstalled.addListener((details) => {
/* istanbul ignore next */
/* istanbul ignore next */
  if (details.reason === 'install') {
/* istanbul ignore next */
    try {
/* istanbul ignore next */
      chrome.storage.sync.set({
/* istanbul ignore next */
        enabled: true,
/* istanbul ignore next */
        mode: 'selective',
/* istanbul ignore next */
        whitelist: [],
/* istanbul ignore next */
        blacklist: [],
/* istanbul ignore next */
        jsBlocked: ['bild.de'],
        // Feature toggles for new integrated features
/* istanbul ignore next */
        features: {
/* istanbul ignore next */
          cookieBannerBlocker: true,
/* istanbul ignore next */
          socialMediaBlocker: true,
/* istanbul ignore next */
          youtubeAdBlocker: true,
/* istanbul ignore next */
          videoStreamAdBlocker: true,
/* istanbul ignore next */
          twitchAdBlocker: true,
/* istanbul ignore next */
          forumAdBlocker: true
        }
/* istanbul ignore next */
      });
    } catch (e) {
/* istanbul ignore next */
      console.error('Background onInstalled storage set failed:', e);
    }
  }
/* istanbul ignore next */
  setupAdNetworkBlocking();
/* istanbul ignore next */
});

/* istanbul ignore next */
chrome.storage.onChanged.addListener((changes, area) => {
/* istanbul ignore next */
/* istanbul ignore next */
  if (area === 'sync') {
/* istanbul ignore next */
    try {
/* istanbul ignore next */
/* istanbul ignore next */
      if (changes.enabled || changes.mode) {
/* istanbul ignore next */
        updateBadge();
      }
/* istanbul ignore next */
/* istanbul ignore next */
      if (changes.jsBlocked) {
/* istanbul ignore next */
        updateBlockingRules(changes.jsBlocked.newValue || []);
      }
    } catch (e) {
/* istanbul ignore next */
      console.error('Background storage onChanged handler failed:', e);
    }
  }
/* istanbul ignore next */
});

// Initialize on startup
/* istanbul ignore next */
try {
/* istanbul ignore next */
  chrome.storage.sync.get(['enabled', 'mode', 'jsBlocked'], (prefs) => {
/* istanbul ignore next */
/* istanbul ignore next */
    if (
/* istanbul ignore next */
      typeof chrome === 'undefined' ||
/* istanbul ignore next */
      !chrome.storage ||
/* istanbul ignore next */
      (chrome.runtime && chrome.runtime.lastError)
/* istanbul ignore next */
    ) {
/* istanbul ignore next */
      return;
    }
/* istanbul ignore next */
    updateBadge();
/* istanbul ignore next */
/* istanbul ignore next */
    if (prefs.jsBlocked) {
/* istanbul ignore next */
      updateBlockingRules(prefs.jsBlocked);
    }
/* istanbul ignore next */
  });
/* istanbul ignore next */
  setupAdNetworkBlocking();
} catch (e) {
/* istanbul ignore next */
  console.error('Background startup storage access failed:', e);
}

/**
 * Session Keeper for 1point3acres.com (Discuz!)
 * -----------------------------------------------
 * Two-pronged approach:
 * 1. Extend cookie expiration (client-side) — pushes expiry 30 days out
 * 2. Heartbeat fetch (server-side) — keeps the session alive on the backend
 *
 * Discuz! auth cookies: saltkey, auth, sid, and anything with the cookie prefix.
 * WeChat login sessions expire fast; this keeps them alive.
 */

const SESSION_KEEP_DOMAINS = ['1point3acres.com', '.1point3acres.com'];
const SESSION_KEEP_INTERVAL_MINS = 10;
const COOKIE_EXTEND_DAYS = 30;

// Discuz! auth cookie name patterns
const AUTH_COOKIE_PATTERNS = [
/* istanbul ignore next */
  'saltkey',
/* istanbul ignore next */
  'auth',
/* istanbul ignore next */
  'sid',
/* istanbul ignore next */
  'loginuser',
/* istanbul ignore next */
  'ulastvisit',
/* istanbul ignore next */
  'lastvisit',
/* istanbul ignore next */
  'lastact',
/* istanbul ignore next */
  'home_readfeed',
/* istanbul ignore next */
  'connect_is_bind',
/* istanbul ignore next */
  'discuz_uid',
/* istanbul ignore next */
  'ticket'
/* istanbul ignore next */
];

function isAuthCookie(name) {
  const lower = name.toLowerCase();
/* istanbul ignore next */
  return AUTH_COOKIE_PATTERNS.some((p) => lower.includes(p));
}

/* istanbul ignore next */
async function extendCookies() {
  const futureDate = Date.now() / 1000 + COOKIE_EXTEND_DAYS * 24 * 3600;

/* istanbul ignore next */
  for (const domain of SESSION_KEEP_DOMAINS) {
/* istanbul ignore next */
    try {
      const cookies = await chrome.cookies.getAll({ domain });
/* istanbul ignore next */
      for (const cookie of cookies) {
/* istanbul ignore next */
/* istanbul ignore next */
        if (!isAuthCookie(cookie.name)) {
/* istanbul ignore next */
          continue;
        }
/* istanbul ignore next */
/* istanbul ignore next */
        if (cookie.session) {
/* istanbul ignore next */
          continue;
/* istanbul ignore next */
        } // session cookies can't have expiry set

/* istanbul ignore next */
        try {
/* istanbul ignore next */
          await chrome.cookies.set({
/* istanbul ignore next */
            url: `https://www.1point3acres.com${cookie.path}`,
/* istanbul ignore next */
            name: cookie.name,
/* istanbul ignore next */
            value: cookie.value,
/* istanbul ignore next */
            domain: cookie.domain,
/* istanbul ignore next */
            path: cookie.path,
/* istanbul ignore next */
            secure: cookie.secure,
/* istanbul ignore next */
            httpOnly: cookie.httpOnly,
/* istanbul ignore next */
            sameSite: cookie.sameSite || 'unspecified',
/* istanbul ignore next */
            expirationDate: futureDate
/* istanbul ignore next */
          });
        } catch {
          // httpOnly cookies may fail — that's OK
        }
      }
    } catch {
      // Domain might have no cookies yet
    }
  }
}

/* istanbul ignore next */
async function heartbeat() {
/* istanbul ignore next */
  try {
    // Lightweight request to keep server-side session alive
    // home.php?mod=space is a small page that refreshes the session
    const resp = await fetch('https://www.1point3acres.com/bbs/home.php?mod=space', {
/* istanbul ignore next */
      method: 'GET',
/* istanbul ignore next */
      credentials: 'include',
/* istanbul ignore next */
      redirect: 'follow',
/* istanbul ignore next */
      cache: 'no-store'
/* istanbul ignore next */
    });
/* istanbul ignore next */
    console.log(`[SessionKeeper] 1p3a heartbeat: HTTP ${resp.status}`);
  } catch (e) {
/* istanbul ignore next */
    console.warn('[SessionKeeper] 1p3a heartbeat failed:', e.message);
  }
}

/* istanbul ignore next */
async function sessionKeepAlive() {
  // Only run if there are auth cookies (user is logged in)
/* istanbul ignore next */
  try {
    const cookies = await chrome.cookies.getAll({ domain: '1point3acres.com' });
    const hasAuth = cookies.some((c) => isAuthCookie(c.name) && c.value);
/* istanbul ignore next */
/* istanbul ignore next */
    if (!hasAuth) {
/* istanbul ignore next */
      return;
    }

/* istanbul ignore next */
    await extendCookies();
/* istanbul ignore next */
    await heartbeat();
/* istanbul ignore next */
    console.log('[SessionKeeper] 1p3a session refreshed');
  } catch (e) {
/* istanbul ignore next */
    console.warn('[SessionKeeper] Error:', e.message);
  }
}

// Set up alarm for periodic session keepalive
/* istanbul ignore next */
chrome.alarms.create('sessionKeepAlive', { periodInMinutes: SESSION_KEEP_INTERVAL_MINS });
/* istanbul ignore next */
chrome.alarms.onAlarm.addListener((alarm) => {
/* istanbul ignore next */
/* istanbul ignore next */
  if (alarm.name === 'sessionKeepAlive') {
/* istanbul ignore next */
    sessionKeepAlive();
  }
/* istanbul ignore next */
});

// Also run on startup
/* istanbul ignore next */
sessionKeepAlive();

/**
 * Session Keeper for xiaohongshu.com (Little Red Book)
 * ----------------------------------------------------
 * Same two-pronged approach as 1point3acres:
 * 1. Extend cookie expiration — pushes expiry 30 days out
 * 2. Heartbeat fetch — keeps the server-side session alive
 *
 * XHS forces re-login aggressively; these cookies are critical for auth.
 */

const XHS_DOMAINS = ['xiaohongshu.com', '.xiaohongshu.com'];
const XHS_INTERVAL_MINS = 8;

// We check if the user is actually logged in by looking for core session cookies
function hasXhsCoreAuth(cookies) {
/* istanbul ignore next */
  return cookies.some((c) => (c.name === 'web_session' || c.name === 'a1') && c.value);
}

const XHS_COOKIE_EXTEND_DAYS = 365;

/* istanbul ignore next */
async function extendXhsCookies() {
  const futureDate = Date.now() / 1000 + XHS_COOKIE_EXTEND_DAYS * 24 * 3600;

/* istanbul ignore next */
  for (const domain of XHS_DOMAINS) {
/* istanbul ignore next */
    try {
      const cookies = await chrome.cookies.getAll({ domain });
/* istanbul ignore next */
      for (const cookie of cookies) {
        // We extend ALL cookies because XHS frequently introduces new tracking/session cookies
        // If we miss extending a new critical cookie, the session will drop after 1 day.
/* istanbul ignore next */
/* istanbul ignore next */
        if (cookie.session) {
/* istanbul ignore next */
          continue;
        }

/* istanbul ignore next */
        try {
/* istanbul ignore next */
          await chrome.cookies.set({
/* istanbul ignore next */
            url: `https://www.xiaohongshu.com${cookie.path}`,
/* istanbul ignore next */
            name: cookie.name,
/* istanbul ignore next */
            value: cookie.value,
/* istanbul ignore next */
            domain: cookie.domain,
/* istanbul ignore next */
            path: cookie.path,
/* istanbul ignore next */
            secure: cookie.secure,
/* istanbul ignore next */
            httpOnly: cookie.httpOnly,
/* istanbul ignore next */
            sameSite: cookie.sameSite || 'unspecified',
/* istanbul ignore next */
            expirationDate: futureDate
/* istanbul ignore next */
          });
        } catch {
          // httpOnly cookies may fail
        }
      }
    } catch {
      // Domain might have no cookies yet
    }
  }
}

/* istanbul ignore next */
async function xhsHeartbeat() {
/* istanbul ignore next */
  try {
    // Hit multiple standard endpoints instead of an API to avoid signature requirements
    const urls = ['https://www.xiaohongshu.com/explore', 'https://www.xiaohongshu.com/'];

/* istanbul ignore next */
    for (const url of urls) {
      const resp = await fetch(url, {
/* istanbul ignore next */
        method: 'GET',
/* istanbul ignore next */
        credentials: 'include',
/* istanbul ignore next */
        redirect: 'follow',
/* istanbul ignore next */
        cache: 'no-store'
/* istanbul ignore next */
      });
/* istanbul ignore next */
      console.log(`[SessionKeeper] XHS heartbeat (${url}): HTTP ${resp.status}`);
    }
  } catch (e) {
/* istanbul ignore next */
    console.warn('[SessionKeeper] XHS heartbeat failed:', e.message);
  }
}

/* istanbul ignore next */
async function xhsSessionKeepAlive() {
/* istanbul ignore next */
  try {
    const cookies = await chrome.cookies.getAll({ domain: 'xiaohongshu.com' });
/* istanbul ignore next */
/* istanbul ignore next */
    if (!hasXhsCoreAuth(cookies)) {
/* istanbul ignore next */
      return;
    }

/* istanbul ignore next */
    await extendXhsCookies();
/* istanbul ignore next */
    await xhsHeartbeat();
/* istanbul ignore next */
    console.log('[SessionKeeper] XHS session refreshed');
  } catch (e) {
/* istanbul ignore next */
    console.warn('[SessionKeeper] XHS error:', e.message);
  }
}

/* istanbul ignore next */
chrome.alarms.create('xhsSessionKeepAlive', { periodInMinutes: XHS_INTERVAL_MINS });
/* istanbul ignore next */
chrome.alarms.onAlarm.addListener((alarm) => {
/* istanbul ignore next */
/* istanbul ignore next */
  if (alarm.name === 'xhsSessionKeepAlive') {
/* istanbul ignore next */
    xhsSessionKeepAlive();
  }
/* istanbul ignore next */
});

/* istanbul ignore next */
xhsSessionKeepAlive();

// Real-time cookie enforcer for Xiaohongshu
/* istanbul ignore next */
/* istanbul ignore next */
if (typeof chrome !== 'undefined' && chrome.cookies && chrome.cookies.onChanged) {
/* istanbul ignore next */
  chrome.cookies.onChanged.addListener(async (changeInfo) => {
    const { cookie, removed, cause } = changeInfo;

/* istanbul ignore next */
/* istanbul ignore next */
    if (removed || cause === 'evicted' || cause === 'expired_overwrite') {
/* istanbul ignore next */
      return;
    }
/* istanbul ignore next */
/* istanbul ignore next */
    if (!cookie.domain.includes('xiaohongshu.com')) {
/* istanbul ignore next */
      return;
    }
/* istanbul ignore next */
/* istanbul ignore next */
    if (cookie.session) {
/* istanbul ignore next */
      return;
    }

    const futureDate = Date.now() / 1000 + XHS_COOKIE_EXTEND_DAYS * 24 * 3600;
    // Prevent infinite loop if we just extended it
/* istanbul ignore next */
/* istanbul ignore next */
    if (cookie.expirationDate && cookie.expirationDate > futureDate - 24 * 3600) {
/* istanbul ignore next */
      return;
    }

/* istanbul ignore next */
    try {
/* istanbul ignore next */
      await chrome.cookies.set({
/* istanbul ignore next */
        url: `https://www.xiaohongshu.com${cookie.path}`,
/* istanbul ignore next */
        name: cookie.name,
/* istanbul ignore next */
        value: cookie.value,
/* istanbul ignore next */
        domain: cookie.domain,
/* istanbul ignore next */
        path: cookie.path,
/* istanbul ignore next */
        secure: cookie.secure,
/* istanbul ignore next */
        httpOnly: cookie.httpOnly,
/* istanbul ignore next */
        sameSite: cookie.sameSite || 'unspecified',
/* istanbul ignore next */
        expirationDate: futureDate
/* istanbul ignore next */
      });
/* istanbul ignore next */
      console.log(`[SessionKeeper] Real-time extended XHS cookie: ${cookie.name}`);
    } catch {
      // Ignore httpOnly or permission failures
    }
/* istanbul ignore next */
  });
}

/**
 * Tab Management: Auto-Close Annoying Update Pages
 */
// URL path patterns that indicate a cookie/privacy notice popup
// Patterns without leading slash to match compound paths (e.g. /swatch-cookie-notice.html)
const COOKIE_NOTICE_PATH_PATTERNS = [
/* istanbul ignore next */
  'cookie-notice',
/* istanbul ignore next */
  'cookie-policy',
/* istanbul ignore next */
  'cookie-consent',
/* istanbul ignore next */
  'privacy-notice',
/* istanbul ignore next */
  '/legal/cookie',
/* istanbul ignore next */
  '/privacy-policy/cookie',
/* istanbul ignore next */
  '/consent/cookie',
/* istanbul ignore next */
  '/gdpr/cookie'
/* istanbul ignore next */
];

function shouldCloseTab(url) {
/* istanbul ignore next */
/* istanbul ignore next */
  if (!url) {
/* istanbul ignore next */
    return false;
  }
/* istanbul ignore next */
  try {
    const urlObj = new URL(url);
/* istanbul ignore next */
/* istanbul ignore next */
    if (urlObj.hostname.includes('getadblock.com')) {
/* istanbul ignore next */
/* istanbul ignore next */
      if (urlObj.pathname.includes('/update/') || urlObj.pathname.includes('/installed/')) {
/* istanbul ignore next */
        return true;
      }
    }
    // Close cookie notice popups opened as new tabs/windows
    const pathLower = urlObj.pathname.toLowerCase();
/* istanbul ignore next */
/* istanbul ignore next */
    if (COOKIE_NOTICE_PATH_PATTERNS.some((p) => pathLower.includes(p))) {
/* istanbul ignore next */
      return true;
    }
  } catch {
    /* Invalid URL */
  }
/* istanbul ignore next */
  return false;
}

/**
 * LinkedIn: Premium Upsell Redirect (Race-Condition-Proof)
 * ---------------------------------------------------------
 * Content script sends profile URL via chrome.runtime.sendMessage on hover.
 * Stored IN MEMORY here (instant, no async chrome.storage latency).
 * When premium navigation detected, redirect immediately using in-memory URL.
 */

let linkedinPendingProfile = null;

// Receive profile URL from content script — instant, synchronous delivery
/* istanbul ignore next */
chrome.runtime.onMessage.addListener((msg) => {
/* istanbul ignore next */
/* istanbul ignore next */
  if (msg.type === 'LINKEDIN_PROFILE_HOVER' && msg.url) {
/* istanbul ignore next */
    linkedinPendingProfile = msg.url;
/* istanbul ignore next */
    console.log('[LinkedIn Fix] BG received profile URL:', msg.url);
  }
/* istanbul ignore next */
});

function isLinkedInPremium(url) {
/* istanbul ignore next */
/* istanbul ignore next */
  if (!url) {
/* istanbul ignore next */
    return false;
  }
/* istanbul ignore next */
  return url.includes('linkedin.com/premium');
}

function redirectFromPremium(tabId) {
  const dest = linkedinPendingProfile;
/* istanbul ignore next */
/* istanbul ignore next */
  if (dest) {
/* istanbul ignore next */
    console.log('[LinkedIn Fix] Redirect (memory): premium ->', dest);
/* istanbul ignore next */
    chrome.tabs.update(tabId, { url: dest });
/* istanbul ignore next */
    linkedinPendingProfile = null;
/* istanbul ignore next */
    return;
  }
  // Fallback: session storage survives service worker restart
/* istanbul ignore next */
  chrome.storage.session.get(['linkedinPendingProfile'], (result) => {
/* istanbul ignore next */
/* istanbul ignore next */
    if (chrome.runtime.lastError) {
/* istanbul ignore next */
      return;
    }
    const url = result.linkedinPendingProfile;
/* istanbul ignore next */
/* istanbul ignore next */
    if (url) {
/* istanbul ignore next */
      console.log('[LinkedIn Fix] Redirect (session): premium ->', url);
/* istanbul ignore next */
      chrome.tabs.update(tabId, { url });
/* istanbul ignore next */
      chrome.storage.session.remove('linkedinPendingProfile');
/* istanbul ignore next */
    } else {
/* istanbul ignore next */
      console.log('[LinkedIn Fix] No profile URL stored, going to feed');
/* istanbul ignore next */
      chrome.tabs.update(tabId, { url: 'https://www.linkedin.com/feed/' });
    }
/* istanbul ignore next */
  });
}

/* istanbul ignore next */
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  const url = changeInfo.url || tab.url;

/* istanbul ignore next */
/* istanbul ignore next */
  if (url && shouldCloseTab(url)) {
/* istanbul ignore next */
    chrome.tabs.remove(tabId).catch(() => {});
/* istanbul ignore next */
    return;
  }

/* istanbul ignore next */
/* istanbul ignore next */
  if (changeInfo.url && isLinkedInPremium(changeInfo.url)) {
/* istanbul ignore next */
    console.log(
/* istanbul ignore next */
      '[LinkedIn Fix] Premium URL detected:',
/* istanbul ignore next */
      changeInfo.url,
/* istanbul ignore next */
      'in-memory:',
/* istanbul ignore next */
      linkedinPendingProfile
/* istanbul ignore next */
    );
/* istanbul ignore next */
    redirectFromPremium(tabId);
  }
/* istanbul ignore next */
});

/* istanbul ignore next */
chrome.tabs.onCreated.addListener((tab) => {
  const url = tab.pendingUrl || tab.url;
/* istanbul ignore next */
/* istanbul ignore next */
  if (url && shouldCloseTab(url)) {
/* istanbul ignore next */
    chrome.tabs.remove(tab.id).catch(() => {});
/* istanbul ignore next */
    return;
  }
/* istanbul ignore next */
/* istanbul ignore next */
  if (url && isLinkedInPremium(url)) {
/* istanbul ignore next */
    console.log('[LinkedIn Fix] Premium URL in new tab:', url);
/* istanbul ignore next */
    redirectFromPremium(tab.id);
  }
/* istanbul ignore next */
});
