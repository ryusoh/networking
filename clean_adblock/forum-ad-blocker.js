/**
 * Forum Ad Blocker (Cleanroom Implementation)
 * -------------------------------------------
 * Blocks ads on forum websites, with deep support for 1point3acres.com.
 * Targets:
 * - 1point3acres ad placements (1p3a-ad-*)
 * - AdRecover anti-adblock circumvention
 * - AdPushup / Publift / VDO.AI / Primis / Undrads
 * - Google Funding Choices (ad blocker detection)
 * - OneSignal push notification prompts
 * - Generic forum ad patterns
 * @global
 */

/* global HTMLScriptElement */
(function () {
  'use strict';

  // Skip sites that have their own dedicated blocker (social-media-blocker.js)
  const EXCLUDED_DOMAINS = [
    'reddit.com',
    'facebook.com',
    'instagram.com',
    'pinterest.com',
    'linkedin.com',
    'twitter.com',
    'x.com',
    'youtube.com',
    'twitch.tv',
    'nasdaq.com',
    'fintel.io',
    'xueqiu.com',
    'google.com',
    'google.co.uk',
    'google.ca',
    'google.com.au',
    'google.de',
    'google.fr',
    'google.co.jp',
    'google.co.in',
    'wsj.com',
    'nvidia.com'
  ];
  const host = window.location.hostname;
  if (EXCLUDED_DOMAINS.some((d) => host === d || host.endsWith('.' + d))) {
    return;
  }

  // --- Phase 1: Early CSS injection (runs at document_start) ---
  // Hide ad elements BEFORE they render to prevent layout shift / flash

  const HIDE_CSS = `
    /* 1point3acres.com ad placements */
    [id^="1p3a-ad-"],
    [id^="1p3a_ad_"],
    [class*="1p3a-ad"],
    div[id*="adpushup"],
    div[class*="adpushup"],
    div[data-adpushup-id],

    /* AdRecover containers */
    [id*="adrecover"],
    [class*="adrecover"],
    iframe[src*="adrecover.com"],

    /* Publift / FuseAds */
    [id*="publift"],
    [class*="publift"],
    div[data-fuse],
    [id*="fuse-"],

    /* VDO.AI / Primis video ads */
    [id*="vdo_ai"],
    [class*="vdo-ai"],
    [id*="primis"],
    div[class*="primis"],

    /* Undrads */
    [id*="undrads"],
    [class*="undrads"],

    /* Google Funding Choices (ad blocker detection popup) */
    .fc-consent-root,
    .fc-dialog-overlay,
    .fc-dialog-container,
    #fc-dialog-overlay,
    div[class^="fc-"],

    /* OneSignal push notification prompts */
    #onesignal-slidedown-dialog,
    .onesignal-slidedown-dialog,
    #onesignal-popover-container,
    .onesignal-customlink-container,
    #onesignal-container,
    .onesignal-reset,

    /* 1point3acres portal ad blocks */
    #portal_block_479,

    /* Generic forum ad selectors */
    .deal-card,
    #iframe-ad-container,
    [class*="ad-container"],
    [class*="sponsor"],
    [class*="promotion"],
    iframe[id*="google_ads"],
    iframe[src*="doubleclick.net"],
    iframe[src*="googlesyndication"],
    .ad-unit,
    .ad-slot,
    .sidebar-ad,
    .header-ad,
    .footer-ad,
    .in-feed-ad,
    [class*="banner-ad"],
    [id*="banner-ad"],
    div[id*="div-gpt-ad"],
    ins.adsbygoogle,

    /* Admiral anti-adblock popups (uses "buoy" styled-components) */
    div:has(a[href*="getadmiral"]),
    div:has(a[href*="admiral.mgr"]),
    div:has([class*="buoy__sc-"] button),

    /* Google Funding Choices / ad-blocker detection banners (randomized classes) */
    div:has(> div img[src*="gstatic.com"][src*="warning"]),
    div[style*="z-index: 2147483568"],
    div[style*="z-index: 2147483647"],

    /* Taboola native ads */
    [dataurl*="taboola"],
    li:has(a[href*="taboola.com"]),
    div:has(> a[href*="taboola.com"]),
    .hot-banner:has(a[href*="taboola.com"]),
    .hot-content:has(a[href*="taboola.com"]),
    h3.adTitle,
    img[src*="images.taboola.com"],

    /* Douban native ads (erebor redirect + dale ad units) */
    .customize-slot,
    .article-card:has(a[href*="erebor.douban.com"]),
    a[href*="erebor.douban.com/redirect"],
    div[class*="dale_"],
    img[src*="dale-online"],
    img[src*="dale_ad"],

    /* Douban ad units */
    div[class*="dale_"],
    div[id*="dale_"],

    /* NYTimes registration wall / doorslam */
    #gateway-content,
    [data-testid="onsite-messaging-unit-gateway"],

    /* BuySellAds (BSA) — used by hedgefollow.com and others */
    div[id^="bsa-zone"],
    div[class*="bsa-zone"],
    div[id*="_bsa_"],
    .bsa_it_ad,
    .bsa_it_p,
    .bsa_it_i,
    .bsa_sticky,
    [id*="buysellads"],
    [class*="buysellads"],

    /* Google DV360 / DoubleClick display ads */
    a[id^="img_anch_"],
    a[href*="adclick.g.doubleclick.net"],
    a[href*="ad.doubleclick.net"],
    img[src*="2mdn.net"],
    img[src*="s0.2mdn.net"],
    img[src*="simgad"],
    div:has(> a[href*="adclick.g.doubleclick.net"]),
    div:has(> a[id^="img_anch_"]),

    /* PubNation / Mediavine / Google SafeFrame ad units */
    .ad_gutter,
    .ad_gutter_left,
    .ad_gutter_right,
    #ad_gutter_left,
    #ad_gutter_right,
    .adunitwrapper,
    .adunit,
    [id*="_btf_wrapper"],
    [id*="_atf_wrapper"],
    [data-wrapper*="sidebar_btf"],
    [data-wrapper*="sidebar_atf"],
    [data-wrapper*="leaderboard"],
    [data-wrapper*="content_btf"],
    .ahover,
    .upo-label,
    mv-ad-reporter,
    [data-offering-name="pubnation"],
    [data-offering-domain="pubnation.com"],
    [data-google-query-id],
    [data-slot-rendered-gutteratf],
    iframe[id*="google_ads_iframe_"],
    iframe[src*="safeframe.googlesyndication.com"],
    iframe[src*="upapi=true"],

    /* Sticky/floating ads */
    [id*="sticky-ad"],
    [class*="sticky-ad"],
    [id*="ad-sticky"],
    [class*="ad-sticky"] {
      display: none !important;
      visibility: hidden !important;
      height: 0 !important;
      min-height: 0 !important;
      max-height: 0 !important;
      overflow: hidden !important;
      opacity: 0 !important;
      pointer-events: none !important;
    }

    /* GuruFocus registration popup, backdrop, and summary paywall doorslam */
    .el-dialog__wrapper.gf,
    .el-dialog__wrapper:has([href*="pricing"]),
    .el-dialog__wrapper:has([action*="register"]),
    .el-dialog__wrapper:has([id*="register"]),
    .el-dialog__wrapper:has(.registration-dialog),
    .v-modal,
    .paywall-shadow,
    .paywall-node {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
      height: 0 !important;
      min-height: 0 !important;
      max-height: 0 !important;
      overflow: hidden !important;
      pointer-events: none !important;
    }

    /* Prevent body scroll lock from ad overlays and paywalls */
    body.fc-overflow-hidden,
    html.fc-overflow-hidden,
    body[style*="overflow: hidden"],
    html[style*="overflow: hidden"] {
      overflow: auto !important;
      overflow-y: auto !important;
      position: static !important;
    }
  `;

  const style = document.createElement('style');
  style.id = 'clean-adblock-forum';
  style.textContent = HIDE_CSS;
  (document.head || document.documentElement).appendChild(style);

  // --- Phase 2: Script blocking ---
  // Intercept and neutralize ad scripts before they execute

  const BLOCKED_SCRIPT_PATTERNS = [
    'adrecover.com',
    'adpushup.com',
    'publift.com',
    'vdo.ai',
    'primis.tech',
    'undrads.com',
    'fundingchoicesmessages.google.com',
    'googlesyndication.com/pagead',
    'securepubads.g.doubleclick.net',
    'adservice.google.com',
    'pagead2.googlesyndication.com',
    'admiral-media.com',
    'admiral.mgr.consensu.org',
    'admiralcdn.com',
    'cdn.buysellads.com',
    'srv.buysellads.com',
    's.buysellads.com',
    'cdn4.buysellads.net',
    'pubnation.com',
    'scripts.mediavine.com',
    'ads.mediavine.com',
    'ad.doubleclick.net',
    'adclick.g.doubleclick.net',
    's0.2mdn.net',
    'tpc.googlesyndication.com',
    'cdn.taboola.com',
    'trc.taboola.com',
    'api.taboola.com',
    'taboolasyndication.com'
  ];

  // Block script injection via DOM
  const originalCreateElement = document.createElement.bind(document);
  document.createElement = function (tagName, options) {
    const el = originalCreateElement(tagName, options);
    if (tagName.toLowerCase() === 'script') {
      const origSetAttribute = el.setAttribute.bind(el);
      el.setAttribute = function (name, value) {
        if (name === 'src' && shouldBlockScript(value)) {
          return;
        }
        return origSetAttribute(name, value);
      };

      // Also intercept .src property
      const descriptor = Object.getOwnPropertyDescriptor(HTMLScriptElement.prototype, 'src');
      if (descriptor) {
        Object.defineProperty(el, 'src', {
          set(value) {
            if (shouldBlockScript(value)) {
              return;
            }
            descriptor.set.call(this, value);
          },
          get() {
            return descriptor.get.call(this);
          },
          configurable: true
        });
      }
    }
    return el;
  };

  function shouldBlockScript(src) {
    if (!src) {
      return false;
    }
    const lower = src.toLowerCase();
    return BLOCKED_SCRIPT_PATTERNS.some((p) => lower.includes(p));
  }

  // --- Phase 3: Neutralize ad config objects ---

  function neutralizeAdConfig() {
    // Kill window.adTagConfig used by 1point3acres
    try {
      Object.defineProperty(window, 'adTagConfig', {
        get: () => ({ placements: {}, enabled: false }),
        set: () => {},
        configurable: false
      });
    } catch {
      /* already defined */
    }

    // Kill AdPushup
    try {
      Object.defineProperty(window, 'adpushup', {
        get: () => ({ que: [], triggerAd: () => {} }),
        set: () => {},
        configurable: false
      });
    } catch {
      /* already defined */
    }

    // Kill Google Funding Choices
    try {
      Object.defineProperty(window, 'googlefc', {
        get: () => ({
          callbackQueue: [],
          showRevocationMessage: () => {},
          getConsentStatus: () => 1,
          getConsentedProviderIds: () => []
        }),
        set: () => {},
        configurable: false
      });
    } catch {
      /* already defined */
    }
  }

  neutralizeAdConfig();

  // --- Phase 4: DOM cleanup (runs when DOM is ready) ---

  const FORUM_AD_SELECTORS = [
    // 1point3acres specific
    '[id^="1p3a-ad-"]',
    '[id^="1p3a_ad_"]',
    '[class*="1p3a-ad"]',
    '.deal-card',
    '#portal_block_479',
    '#iframe-ad-container',
    'iframe[src*="adrecover.com"]',

    // Ad network containers
    'div[data-adpushup-id]',
    'div[id*="adpushup"]',
    'div[id*="publift"]',
    'div[data-fuse]',
    'div[id*="vdo_ai"]',
    'div[id*="primis"]',
    'div[id*="undrads"]',
    'ins.adsbygoogle',
    'div[id*="div-gpt-ad"]',

    // Google Funding Choices overlay
    '.fc-consent-root',
    '.fc-dialog-overlay',
    '.fc-dialog-container',

    // OneSignal
    '#onesignal-slidedown-dialog',
    '#onesignal-popover-container',
    '#onesignal-container',

    // Google anti-adblock banners (randomized classes, match by structure)
    'div:has(img[src*="gstatic.com"][src*="warning"])[style*="position: fixed"]',
    'div[style*="z-index: 2147483568"]',
    'div[style*="z-index: 2147483647"]',

    // Taboola
    '[dataurl*="taboola"]',
    'h3.adTitle',

    // Douban native ads
    '.customize-slot',
    'a[href*="erebor.douban.com/redirect"]',

    // Generic
    '[class*="ad-container"]',
    '[class*="sponsor"]',
    '[class*="promotion"]',
    'iframe[src*="doubleclick.net"]',
    'iframe[src*="googlesyndication"]',
    '.ad-unit',
    '.ad-slot',
    '.sidebar-ad',
    '.header-ad',
    '.footer-ad',
    '.in-feed-ad',
    '[class*="banner-ad"]',
    '[id*="banner-ad"]',
    '[id*="sticky-ad"]',
    '[class*="sticky-ad"]',

    // BuySellAds (BSA)
    'div[id^="bsa-zone"]',
    'div[class*="bsa-zone"]',
    '.bsa_it_ad',
    '.bsa_it_p',
    '.bsa_sticky',
    '[id*="buysellads"]',

    // Google DV360 / DoubleClick display ads
    'a[id^="img_anch_"]',
    'a[href*="adclick.g.doubleclick.net"]',
    'a[href*="ad.doubleclick.net"]',
    'img[src*="2mdn.net"]',
    'img[src*="simgad"]',

    // PubNation / Mediavine ad units
    '.ad_gutter',
    '#ad_gutter_left',
    '#ad_gutter_right',
    '.adunitwrapper',
    '.adunit',
    '[id*="_btf_wrapper"]',
    '[id*="_atf_wrapper"]',
    '.ahover',
    '.upo-label',
    'mv-ad-reporter',
    '[data-offering-name="pubnation"]',
    '[data-google-query-id]',
    '[data-slot-rendered-gutteratf]',
    'iframe[id*="google_ads_iframe_"]',
    'iframe[src*="safeframe.googlesyndication.com"]',
    'iframe[src*="upapi=true"]'
  ];

  const processedElements = new WeakSet();

  function hideAd(element) {
    if (processedElements.has(element)) {
      return false;
    }
    element.style.setProperty('display', 'none', 'important');
    element.setAttribute('data-blocked-by-clean-adblock', 'true');
    processedElements.add(element);
    return true;
  }

  function removeAdScripts() {
    document.querySelectorAll('script[src]').forEach((script) => {
      if (shouldBlockScript(script.src)) {
        script.remove();
      }
    });
  }

  function removeAdIframes() {
    document.querySelectorAll('iframe').forEach((iframe) => {
      const src = iframe.src || iframe.getAttribute('data-src') || '';
      if (BLOCKED_SCRIPT_PATTERNS.some((p) => src.includes(p))) {
        hideAd(iframe);
      }
    });
  }

  function blockForumAds() {
    for (const selector of FORUM_AD_SELECTORS) {
      try {
        document.querySelectorAll(selector).forEach((el) => hideAd(el));
      } catch {
        /* invalid selector */
      }
    }
    removeAdScripts();
    removeAdIframes();

    // Hide Taboola ad containers (walk up from taboola links)
    document.querySelectorAll('a[href*="taboola.com"]').forEach((link) => {
      const container = link.closest('li, .hot-banner, .hot-content') || link.parentElement;
      if (container) {
        hideAd(container);
      }
    });

    // Hide Admaru ad label and its parent container (text says "Admaru")
    document.querySelectorAll('div').forEach((el) => {
      const txt = el.textContent || '';
      if (txt.includes('Admaru') && txt.length < 50) {
        hideAd(el);
        if (el.parentElement) {
          hideAd(el.parentElement);
        }
      }
    });

    // Hide DoubleClick / DV360 display ads and their containers
    // These are often injected dynamically by BSA or GPT into ad zones
    const dcSelectors = [
      'a[href*="adclick.g.doubleclick.net"]',
      'a[href*="ad.doubleclick.net"]',
      'a[id^="img_anch_"]',
      'img[src*="2mdn.net"]',
      'img[src*="simgad"]'
    ];
    for (const sel of dcSelectors) {
      document.querySelectorAll(sel).forEach((el) => {
        // Walk up to the nearest BSA zone or ad-sized container
        let target = el;
        let parent = el.parentElement;
        for (let i = 0; i < 10 && parent && parent !== document.body; i++) {
          const id = parent.id || '';
          const cls = parent.className || '';
          if (
            id.startsWith('bsa-zone') ||
            cls.includes('bsa') ||
            id.includes('buysellads') ||
            id.includes('div-gpt-ad') ||
            cls.includes('ad-container') ||
            cls.includes('ad-slot') ||
            cls.includes('ad-unit')
          ) {
            target = parent;
            break;
          }
          target = parent;
          parent = parent.parentElement;
        }
        hideAd(target);
      });
    }

    // Hide Douban erebor redirect ad containers
    document.querySelectorAll('a[href*="erebor.douban.com"]').forEach((link) => {
      const container = link.closest('.customize-slot, .article-card') || link.parentElement;
      if (container) {
        hideAd(container);
      }
    });

    // NYTimes regiwall: remove inert attribute and gateway overlay
    if (host.endsWith('nytimes.com')) {
      document.querySelectorAll('[data-testid="vi-gateway-container"][inert]').forEach((el) => {
        el.removeAttribute('inert');
        el.removeAttribute('aria-hidden');
      });
      document
        .querySelectorAll('#gateway-content, [data-testid="onsite-messaging-unit-gateway"]')
        .forEach((el) => {
          hideAd(el);
        });
    }

    // Restore scroll if ad overlay locked it
    if (document.body) {
      document.body.classList.remove('fc-overflow-hidden');
      document.documentElement.classList.remove('fc-overflow-hidden');

      [document.body, document.documentElement].forEach((el) => {
        const style = window.getComputedStyle(el);
        if (style.overflow === 'hidden' || style.overflowY === 'hidden') {
          el.style.setProperty('overflow', 'auto', 'important');
          el.style.setProperty('overflow-y', 'auto', 'important');
        }
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', blockForumAds);
  } else {
    blockForumAds();
  }

  // --- Phase 5: MutationObserver for dynamic ads ---

  function onMutation(mutations) {
    let needsFullScan = false;
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType !== 1) {
          continue;
        }

        // Check if the added node itself is an ad
        for (const selector of FORUM_AD_SELECTORS) {
          try {
            if (node.matches && node.matches(selector)) {
              hideAd(node);
            }
          } catch {
            /* invalid selector */
          }
        }

        // Check if it's an ad script
        if (node.tagName === 'SCRIPT' && node.src && shouldBlockScript(node.src)) {
          node.remove();
          continue;
        }

        // Check for ad elements inside the added node
        if (node.querySelectorAll) {
          needsFullScan = true;
        }
      }
    }
    if (needsFullScan) {
      blockForumAds();
    }
  }

  const startObserver = () => {
    if (!document.body) {
      requestAnimationFrame(startObserver);
      return;
    }
    const observer = new MutationObserver(onMutation);
    observer.observe(document.body, { childList: true, subtree: true });
  };
  startObserver();

  // Also re-scan periodically for the first 10 seconds (catches late-loading ads)
  let scanCount = 0;
  const periodicScan = setInterval(() => {
    blockForumAds();
    scanCount++;
    if (scanCount >= 20) {
      clearInterval(periodicScan);
    }
  }, 500);

  // Export for testing
  if (typeof window !== 'undefined') {
    window.ForumAdBlocker = { blockForumAds, hideAd };
  }
})();
