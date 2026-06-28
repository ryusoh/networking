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
/* istanbul ignore next */
(function () {
/* istanbul ignore next */
  'use strict';

  // Skip sites that have their own dedicated blocker (social-media-blocker.js)
  const EXCLUDED_DOMAINS = [
/* istanbul ignore next */
    'reddit.com',
/* istanbul ignore next */
    'facebook.com',
/* istanbul ignore next */
    'instagram.com',
/* istanbul ignore next */
    'pinterest.com',
/* istanbul ignore next */
    'linkedin.com',
/* istanbul ignore next */
    'twitter.com',
/* istanbul ignore next */
    'x.com',
/* istanbul ignore next */
    'youtube.com',
/* istanbul ignore next */
    'twitch.tv',
/* istanbul ignore next */
    'nasdaq.com',
/* istanbul ignore next */
    'fintel.io',
/* istanbul ignore next */
    'xueqiu.com',
/* istanbul ignore next */
    'google.com',
/* istanbul ignore next */
    'google.co.uk',
/* istanbul ignore next */
    'google.ca',
/* istanbul ignore next */
    'google.com.au',
/* istanbul ignore next */
    'google.de',
/* istanbul ignore next */
    'google.fr',
/* istanbul ignore next */
    'google.co.jp',
/* istanbul ignore next */
    'google.co.in',
/* istanbul ignore next */
    'wsj.com',
/* istanbul ignore next */
    'nvidia.com'
/* istanbul ignore next */
  ];
  const host = window.location.hostname;
/* istanbul ignore next */
/* istanbul ignore next */
  if (EXCLUDED_DOMAINS.some((d) => host === d || host.endsWith('.' + d))) {
/* istanbul ignore next */
    return;
  }

  // --- Phase 1: Early CSS injection (runs at document_start) ---
  // Hide ad elements BEFORE they render to prevent layout shift / flash

  const HIDE_CSS = `
    /* 1point3acres.com ad placements */
/* istanbul ignore next */
    [id^="1p3a-ad-"],
/* istanbul ignore next */
    [id^="1p3a_ad_"],
/* istanbul ignore next */
    [class*="1p3a-ad"],
/* istanbul ignore next */
    div[id*="adpushup"],
/* istanbul ignore next */
    div[class*="adpushup"],
/* istanbul ignore next */
    div[data-adpushup-id],

    /* AdRecover containers */
/* istanbul ignore next */
    [id*="adrecover"],
/* istanbul ignore next */
    [class*="adrecover"],
/* istanbul ignore next */
    iframe[src*="adrecover.com"],

    /* Publift / FuseAds */
/* istanbul ignore next */
    [id*="publift"],
/* istanbul ignore next */
    [class*="publift"],
/* istanbul ignore next */
    div[data-fuse],
/* istanbul ignore next */
    [id*="fuse-"],

    /* VDO.AI / Primis video ads */
/* istanbul ignore next */
    [id*="vdo_ai"],
/* istanbul ignore next */
    [class*="vdo-ai"],
/* istanbul ignore next */
    [id*="primis"],
/* istanbul ignore next */
    div[class*="primis"],

    /* Undrads */
/* istanbul ignore next */
    [id*="undrads"],
/* istanbul ignore next */
    [class*="undrads"],

    /* Google Funding Choices (ad blocker detection popup) */
/* istanbul ignore next */
    .fc-consent-root,
/* istanbul ignore next */
    .fc-dialog-overlay,
/* istanbul ignore next */
    .fc-dialog-container,
/* istanbul ignore next */
    #fc-dialog-overlay,
/* istanbul ignore next */
    div[class^="fc-"],

    /* OneSignal push notification prompts */
/* istanbul ignore next */
    #onesignal-slidedown-dialog,
/* istanbul ignore next */
    .onesignal-slidedown-dialog,
/* istanbul ignore next */
    #onesignal-popover-container,
/* istanbul ignore next */
    .onesignal-customlink-container,
/* istanbul ignore next */
    #onesignal-container,
/* istanbul ignore next */
    .onesignal-reset,

    /* 1point3acres portal ad blocks */
/* istanbul ignore next */
    #portal_block_479,

    /* Generic forum ad selectors */
/* istanbul ignore next */
    .deal-card,
/* istanbul ignore next */
    #iframe-ad-container,
/* istanbul ignore next */
    [class*="ad-container"],
/* istanbul ignore next */
    [class*="sponsor"],
/* istanbul ignore next */
    [class*="promotion"],
/* istanbul ignore next */
    iframe[id*="google_ads"],
/* istanbul ignore next */
    iframe[src*="doubleclick.net"],
/* istanbul ignore next */
    iframe[src*="googlesyndication"],
/* istanbul ignore next */
    .ad-unit,
/* istanbul ignore next */
    .ad-slot,
/* istanbul ignore next */
    .sidebar-ad,
/* istanbul ignore next */
    .header-ad,
/* istanbul ignore next */
    .footer-ad,
/* istanbul ignore next */
    .in-feed-ad,
/* istanbul ignore next */
    [class*="banner-ad"],
/* istanbul ignore next */
    [id*="banner-ad"],
/* istanbul ignore next */
    div[id*="div-gpt-ad"],
/* istanbul ignore next */
    ins.adsbygoogle,

    /* Admiral anti-adblock popups (uses "buoy" styled-components) */
/* istanbul ignore next */
    div:has(a[href*="getadmiral"]),
/* istanbul ignore next */
    div:has(a[href*="admiral.mgr"]),
/* istanbul ignore next */
    div:has([class*="buoy__sc-"] button),

    /* Google Funding Choices / ad-blocker detection banners (randomized classes) */
/* istanbul ignore next */
    div:has(> div img[src*="gstatic.com"][src*="warning"]),
/* istanbul ignore next */
    div[style*="z-index: 2147483568"],
/* istanbul ignore next */
    div[style*="z-index: 2147483647"],

    /* Taboola native ads */
/* istanbul ignore next */
    [dataurl*="taboola"],
/* istanbul ignore next */
    li:has(a[href*="taboola.com"]),
/* istanbul ignore next */
    div:has(> a[href*="taboola.com"]),
/* istanbul ignore next */
    .hot-banner:has(a[href*="taboola.com"]),
/* istanbul ignore next */
    .hot-content:has(a[href*="taboola.com"]),
/* istanbul ignore next */
    h3.adTitle,
/* istanbul ignore next */
    img[src*="images.taboola.com"],

    /* Douban native ads (erebor redirect + dale ad units) */
/* istanbul ignore next */
    .customize-slot,
/* istanbul ignore next */
    .article-card:has(a[href*="erebor.douban.com"]),
/* istanbul ignore next */
    a[href*="erebor.douban.com/redirect"],
/* istanbul ignore next */
    div[class*="dale_"],
/* istanbul ignore next */
    img[src*="dale-online"],
/* istanbul ignore next */
    img[src*="dale_ad"],

    /* Douban ad units */
/* istanbul ignore next */
    div[class*="dale_"],
/* istanbul ignore next */
    div[id*="dale_"],

    /* NYTimes registration wall / doorslam */
/* istanbul ignore next */
    #gateway-content,
/* istanbul ignore next */
    [data-testid="onsite-messaging-unit-gateway"],

    /* BuySellAds (BSA) — used by hedgefollow.com and others */
/* istanbul ignore next */
    div[id^="bsa-zone"],
/* istanbul ignore next */
    div[class*="bsa-zone"],
/* istanbul ignore next */
    div[id*="_bsa_"],
/* istanbul ignore next */
    .bsa_it_ad,
/* istanbul ignore next */
    .bsa_it_p,
/* istanbul ignore next */
    .bsa_it_i,
/* istanbul ignore next */
    .bsa_sticky,
/* istanbul ignore next */
    [id*="buysellads"],
/* istanbul ignore next */
    [class*="buysellads"],

    /* Google DV360 / DoubleClick display ads */
/* istanbul ignore next */
    a[id^="img_anch_"],
/* istanbul ignore next */
    a[href*="adclick.g.doubleclick.net"],
/* istanbul ignore next */
    a[href*="ad.doubleclick.net"],
/* istanbul ignore next */
    img[src*="2mdn.net"],
/* istanbul ignore next */
    img[src*="s0.2mdn.net"],
/* istanbul ignore next */
    img[src*="simgad"],
/* istanbul ignore next */
    div:has(> a[href*="adclick.g.doubleclick.net"]),
/* istanbul ignore next */
    div:has(> a[id^="img_anch_"]),

    /* PubNation / Mediavine / Google SafeFrame ad units */
/* istanbul ignore next */
    .ad_gutter,
/* istanbul ignore next */
    .ad_gutter_left,
/* istanbul ignore next */
    .ad_gutter_right,
/* istanbul ignore next */
    #ad_gutter_left,
/* istanbul ignore next */
    #ad_gutter_right,
/* istanbul ignore next */
    .adunitwrapper,
/* istanbul ignore next */
    .adunit,
/* istanbul ignore next */
    [id*="_btf_wrapper"],
/* istanbul ignore next */
    [id*="_atf_wrapper"],
/* istanbul ignore next */
    [data-wrapper*="sidebar_btf"],
/* istanbul ignore next */
    [data-wrapper*="sidebar_atf"],
/* istanbul ignore next */
    [data-wrapper*="leaderboard"],
/* istanbul ignore next */
    [data-wrapper*="content_btf"],
/* istanbul ignore next */
    .ahover,
/* istanbul ignore next */
    .upo-label,
/* istanbul ignore next */
    mv-ad-reporter,
/* istanbul ignore next */
    [data-offering-name="pubnation"],
/* istanbul ignore next */
    [data-offering-domain="pubnation.com"],
/* istanbul ignore next */
    [data-google-query-id],
/* istanbul ignore next */
    [data-slot-rendered-gutteratf],
/* istanbul ignore next */
    iframe[id*="google_ads_iframe_"],
/* istanbul ignore next */
    iframe[src*="safeframe.googlesyndication.com"],
/* istanbul ignore next */
    iframe[src*="upapi=true"],

    /* Sticky/floating ads */
/* istanbul ignore next */
    [id*="sticky-ad"],
/* istanbul ignore next */
    [class*="sticky-ad"],
/* istanbul ignore next */
    [id*="ad-sticky"],
/* istanbul ignore next */
    [class*="ad-sticky"] {
/* istanbul ignore next */
      display: none !important;
/* istanbul ignore next */
      visibility: hidden !important;
/* istanbul ignore next */
      height: 0 !important;
/* istanbul ignore next */
      min-height: 0 !important;
/* istanbul ignore next */
      max-height: 0 !important;
/* istanbul ignore next */
      overflow: hidden !important;
/* istanbul ignore next */
      opacity: 0 !important;
/* istanbul ignore next */
      pointer-events: none !important;
    }

    /* GuruFocus registration popup, backdrop, and summary paywall doorslam */
/* istanbul ignore next */
    .el-dialog__wrapper.gf,
/* istanbul ignore next */
    .el-dialog__wrapper:has([href*="pricing"]),
/* istanbul ignore next */
    .el-dialog__wrapper:has([action*="register"]),
/* istanbul ignore next */
    .el-dialog__wrapper:has([id*="register"]),
/* istanbul ignore next */
    .el-dialog__wrapper:has(.registration-dialog),
/* istanbul ignore next */
    .v-modal,
/* istanbul ignore next */
    .paywall-shadow,
/* istanbul ignore next */
    .paywall-node {
/* istanbul ignore next */
      display: none !important;
/* istanbul ignore next */
      visibility: hidden !important;
/* istanbul ignore next */
      opacity: 0 !important;
/* istanbul ignore next */
      height: 0 !important;
/* istanbul ignore next */
      min-height: 0 !important;
/* istanbul ignore next */
      max-height: 0 !important;
/* istanbul ignore next */
      overflow: hidden !important;
/* istanbul ignore next */
      pointer-events: none !important;
    }

    /* Prevent body scroll lock from ad overlays and paywalls */
/* istanbul ignore next */
    body.fc-overflow-hidden,
/* istanbul ignore next */
    html.fc-overflow-hidden,
/* istanbul ignore next */
    body[style*="overflow: hidden"],
/* istanbul ignore next */
    html[style*="overflow: hidden"] {
/* istanbul ignore next */
      overflow: auto !important;
/* istanbul ignore next */
      overflow-y: auto !important;
/* istanbul ignore next */
      position: static !important;
    }
/* istanbul ignore next */
  `;

  const style = document.createElement('style');
/* istanbul ignore next */
  style.id = 'clean-adblock-forum';
/* istanbul ignore next */
  style.textContent = HIDE_CSS;
/* istanbul ignore next */
  (document.head || document.documentElement).appendChild(style);

  // --- Phase 2: Script blocking ---
  // Intercept and neutralize ad scripts before they execute

  const BLOCKED_SCRIPT_PATTERNS = [
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
    'googlesyndication.com/pagead',
/* istanbul ignore next */
    'securepubads.g.doubleclick.net',
/* istanbul ignore next */
    'adservice.google.com',
/* istanbul ignore next */
    'pagead2.googlesyndication.com',
/* istanbul ignore next */
    'admiral-media.com',
/* istanbul ignore next */
    'admiral.mgr.consensu.org',
/* istanbul ignore next */
    'admiralcdn.com',
/* istanbul ignore next */
    'cdn.buysellads.com',
/* istanbul ignore next */
    'srv.buysellads.com',
/* istanbul ignore next */
    's.buysellads.com',
/* istanbul ignore next */
    'cdn4.buysellads.net',
/* istanbul ignore next */
    'pubnation.com',
/* istanbul ignore next */
    'scripts.mediavine.com',
/* istanbul ignore next */
    'ads.mediavine.com',
/* istanbul ignore next */
    'ad.doubleclick.net',
/* istanbul ignore next */
    'adclick.g.doubleclick.net',
/* istanbul ignore next */
    's0.2mdn.net',
/* istanbul ignore next */
    'tpc.googlesyndication.com',
/* istanbul ignore next */
    'cdn.taboola.com',
/* istanbul ignore next */
    'trc.taboola.com',
/* istanbul ignore next */
    'api.taboola.com',
/* istanbul ignore next */
    'taboolasyndication.com'
/* istanbul ignore next */
  ];

  // Block script injection via DOM
  const originalCreateElement = document.createElement.bind(document);
/* istanbul ignore next */
  document.createElement = function (tagName, options) {
    const el = originalCreateElement(tagName, options);
/* istanbul ignore next */
/* istanbul ignore next */
    if (tagName.toLowerCase() === 'script') {
      const origSetAttribute = el.setAttribute.bind(el);
/* istanbul ignore next */
      el.setAttribute = function (name, value) {
/* istanbul ignore next */
/* istanbul ignore next */
        if (name === 'src' && shouldBlockScript(value)) {
/* istanbul ignore next */
          return;
        }
/* istanbul ignore next */
        return origSetAttribute(name, value);
/* istanbul ignore next */
      };

      // Also intercept .src property
      const descriptor = Object.getOwnPropertyDescriptor(HTMLScriptElement.prototype, 'src');
/* istanbul ignore next */
/* istanbul ignore next */
      if (descriptor) {
/* istanbul ignore next */
        Object.defineProperty(el, 'src', {
/* istanbul ignore next */
          set(value) {
/* istanbul ignore next */
/* istanbul ignore next */
            if (shouldBlockScript(value)) {
/* istanbul ignore next */
              return;
            }
/* istanbul ignore next */
            descriptor.set.call(this, value);
/* istanbul ignore next */
          },
/* istanbul ignore next */
          get() {
/* istanbul ignore next */
            return descriptor.get.call(this);
/* istanbul ignore next */
          },
/* istanbul ignore next */
          configurable: true
/* istanbul ignore next */
        });
      }
    }
/* istanbul ignore next */
    return el;
/* istanbul ignore next */
  };

  function shouldBlockScript(src) {
/* istanbul ignore next */
/* istanbul ignore next */
    if (!src) {
/* istanbul ignore next */
      return false;
    }
    const lower = src.toLowerCase();
/* istanbul ignore next */
    return BLOCKED_SCRIPT_PATTERNS.some((p) => lower.includes(p));
  }

  // --- Phase 3: Neutralize ad config objects ---

  function neutralizeAdConfig() {
    // Kill window.adTagConfig used by 1point3acres
/* istanbul ignore next */
    try {
/* istanbul ignore next */
      Object.defineProperty(window, 'adTagConfig', {
/* istanbul ignore next */
        get: () => ({ placements: {}, enabled: false }),
/* istanbul ignore next */
        set: () => {},
/* istanbul ignore next */
        configurable: false
/* istanbul ignore next */
      });
    } catch {
      /* already defined */
    }

    // Kill AdPushup
/* istanbul ignore next */
    try {
/* istanbul ignore next */
      Object.defineProperty(window, 'adpushup', {
/* istanbul ignore next */
        get: () => ({ que: [], triggerAd: () => {} }),
/* istanbul ignore next */
        set: () => {},
/* istanbul ignore next */
        configurable: false
/* istanbul ignore next */
      });
    } catch {
      /* already defined */
    }

    // Kill Google Funding Choices
/* istanbul ignore next */
    try {
/* istanbul ignore next */
      Object.defineProperty(window, 'googlefc', {
/* istanbul ignore next */
        get: () => ({
/* istanbul ignore next */
          callbackQueue: [],
/* istanbul ignore next */
          showRevocationMessage: () => {},
/* istanbul ignore next */
          getConsentStatus: () => 1,
/* istanbul ignore next */
          getConsentedProviderIds: () => []
/* istanbul ignore next */
        }),
/* istanbul ignore next */
        set: () => {},
/* istanbul ignore next */
        configurable: false
/* istanbul ignore next */
      });
    } catch {
      /* already defined */
    }
  }

/* istanbul ignore next */
  neutralizeAdConfig();

  // --- Phase 4: DOM cleanup (runs when DOM is ready) ---

  const FORUM_AD_SELECTORS = [
    // 1point3acres specific
/* istanbul ignore next */
    '[id^="1p3a-ad-"]',
/* istanbul ignore next */
    '[id^="1p3a_ad_"]',
/* istanbul ignore next */
    '[class*="1p3a-ad"]',
/* istanbul ignore next */
    '.deal-card',
/* istanbul ignore next */
    '#portal_block_479',
/* istanbul ignore next */
    '#iframe-ad-container',
/* istanbul ignore next */
    'iframe[src*="adrecover.com"]',

    // Ad network containers
/* istanbul ignore next */
    'div[data-adpushup-id]',
/* istanbul ignore next */
    'div[id*="adpushup"]',
/* istanbul ignore next */
    'div[id*="publift"]',
/* istanbul ignore next */
    'div[data-fuse]',
/* istanbul ignore next */
    'div[id*="vdo_ai"]',
/* istanbul ignore next */
    'div[id*="primis"]',
/* istanbul ignore next */
    'div[id*="undrads"]',
/* istanbul ignore next */
    'ins.adsbygoogle',
/* istanbul ignore next */
    'div[id*="div-gpt-ad"]',

    // Google Funding Choices overlay
/* istanbul ignore next */
    '.fc-consent-root',
/* istanbul ignore next */
    '.fc-dialog-overlay',
/* istanbul ignore next */
    '.fc-dialog-container',

    // OneSignal
/* istanbul ignore next */
    '#onesignal-slidedown-dialog',
/* istanbul ignore next */
    '#onesignal-popover-container',
/* istanbul ignore next */
    '#onesignal-container',

    // Google anti-adblock banners (randomized classes, match by structure)
/* istanbul ignore next */
    'div:has(img[src*="gstatic.com"][src*="warning"])[style*="position: fixed"]',
/* istanbul ignore next */
    'div[style*="z-index: 2147483568"]',
/* istanbul ignore next */
    'div[style*="z-index: 2147483647"]',

    // Taboola
/* istanbul ignore next */
    '[dataurl*="taboola"]',
/* istanbul ignore next */
    'h3.adTitle',

    // Douban native ads
/* istanbul ignore next */
    '.customize-slot',
/* istanbul ignore next */
    'a[href*="erebor.douban.com/redirect"]',

    // Generic
/* istanbul ignore next */
    '[class*="ad-container"]',
/* istanbul ignore next */
    '[class*="sponsor"]',
/* istanbul ignore next */
    '[class*="promotion"]',
/* istanbul ignore next */
    'iframe[src*="doubleclick.net"]',
/* istanbul ignore next */
    'iframe[src*="googlesyndication"]',
/* istanbul ignore next */
    '.ad-unit',
/* istanbul ignore next */
    '.ad-slot',
/* istanbul ignore next */
    '.sidebar-ad',
/* istanbul ignore next */
    '.header-ad',
/* istanbul ignore next */
    '.footer-ad',
/* istanbul ignore next */
    '.in-feed-ad',
/* istanbul ignore next */
    '[class*="banner-ad"]',
/* istanbul ignore next */
    '[id*="banner-ad"]',
/* istanbul ignore next */
    '[id*="sticky-ad"]',
/* istanbul ignore next */
    '[class*="sticky-ad"]',

    // BuySellAds (BSA)
/* istanbul ignore next */
    'div[id^="bsa-zone"]',
/* istanbul ignore next */
    'div[class*="bsa-zone"]',
/* istanbul ignore next */
    '.bsa_it_ad',
/* istanbul ignore next */
    '.bsa_it_p',
/* istanbul ignore next */
    '.bsa_sticky',
/* istanbul ignore next */
    '[id*="buysellads"]',

    // Google DV360 / DoubleClick display ads
/* istanbul ignore next */
    'a[id^="img_anch_"]',
/* istanbul ignore next */
    'a[href*="adclick.g.doubleclick.net"]',
/* istanbul ignore next */
    'a[href*="ad.doubleclick.net"]',
/* istanbul ignore next */
    'img[src*="2mdn.net"]',
/* istanbul ignore next */
    'img[src*="simgad"]',

    // PubNation / Mediavine ad units
/* istanbul ignore next */
    '.ad_gutter',
/* istanbul ignore next */
    '#ad_gutter_left',
/* istanbul ignore next */
    '#ad_gutter_right',
/* istanbul ignore next */
    '.adunitwrapper',
/* istanbul ignore next */
    '.adunit',
/* istanbul ignore next */
    '[id*="_btf_wrapper"]',
/* istanbul ignore next */
    '[id*="_atf_wrapper"]',
/* istanbul ignore next */
    '.ahover',
/* istanbul ignore next */
    '.upo-label',
/* istanbul ignore next */
    'mv-ad-reporter',
/* istanbul ignore next */
    '[data-offering-name="pubnation"]',
/* istanbul ignore next */
    '[data-google-query-id]',
/* istanbul ignore next */
    '[data-slot-rendered-gutteratf]',
/* istanbul ignore next */
    'iframe[id*="google_ads_iframe_"]',
/* istanbul ignore next */
    'iframe[src*="safeframe.googlesyndication.com"]',
/* istanbul ignore next */
    'iframe[src*="upapi=true"]'
/* istanbul ignore next */
  ];

  const processedElements = new WeakSet();

  function hideAd(element) {
/* istanbul ignore next */
/* istanbul ignore next */
    if (processedElements.has(element)) {
/* istanbul ignore next */
      return false;
    }
/* istanbul ignore next */
    element.style.setProperty('display', 'none', 'important');
/* istanbul ignore next */
    element.setAttribute('data-blocked-by-clean-adblock', 'true');
/* istanbul ignore next */
    processedElements.add(element);
/* istanbul ignore next */
    return true;
  }

  function removeAdScripts() {
/* istanbul ignore next */
    document.querySelectorAll('script[src]').forEach((script) => {
/* istanbul ignore next */
/* istanbul ignore next */
      if (shouldBlockScript(script.src)) {
/* istanbul ignore next */
        script.remove();
      }
/* istanbul ignore next */
    });
  }

  function removeAdIframes() {
/* istanbul ignore next */
    document.querySelectorAll('iframe').forEach((iframe) => {
      const src = iframe.src || iframe.getAttribute('data-src') || '';
/* istanbul ignore next */
/* istanbul ignore next */
      if (BLOCKED_SCRIPT_PATTERNS.some((p) => src.includes(p))) {
/* istanbul ignore next */
        hideAd(iframe);
      }
/* istanbul ignore next */
    });
  }

  function blockForumAds() {
/* istanbul ignore next */
    for (const selector of FORUM_AD_SELECTORS) {
/* istanbul ignore next */
      try {
/* istanbul ignore next */
        document.querySelectorAll(selector).forEach((el) => hideAd(el));
      } catch {
        /* invalid selector */
      }
    }
/* istanbul ignore next */
    removeAdScripts();
/* istanbul ignore next */
    removeAdIframes();

    // Hide Taboola ad containers (walk up from taboola links)
/* istanbul ignore next */
    document.querySelectorAll('a[href*="taboola.com"]').forEach((link) => {
      const container = link.closest('li, .hot-banner, .hot-content') || link.parentElement;
/* istanbul ignore next */
/* istanbul ignore next */
      if (container) {
/* istanbul ignore next */
        hideAd(container);
      }
/* istanbul ignore next */
    });

    // Hide Admaru ad label and its parent container (text says "Admaru")
/* istanbul ignore next */
    document.querySelectorAll('div').forEach((el) => {
      const txt = el.textContent || '';
/* istanbul ignore next */
/* istanbul ignore next */
      if (txt.includes('Admaru') && txt.length < 50) {
/* istanbul ignore next */
        hideAd(el);
/* istanbul ignore next */
/* istanbul ignore next */
        if (el.parentElement) {
/* istanbul ignore next */
          hideAd(el.parentElement);
        }
      }
/* istanbul ignore next */
    });

    // Hide DoubleClick / DV360 display ads and their containers
    // These are often injected dynamically by BSA or GPT into ad zones
    const dcSelectors = [
/* istanbul ignore next */
      'a[href*="adclick.g.doubleclick.net"]',
/* istanbul ignore next */
      'a[href*="ad.doubleclick.net"]',
/* istanbul ignore next */
      'a[id^="img_anch_"]',
/* istanbul ignore next */
      'img[src*="2mdn.net"]',
/* istanbul ignore next */
      'img[src*="simgad"]'
/* istanbul ignore next */
    ];
/* istanbul ignore next */
    for (const sel of dcSelectors) {
/* istanbul ignore next */
      document.querySelectorAll(sel).forEach((el) => {
        // Walk up to the nearest BSA zone or ad-sized container
        let target = el;
        let parent = el.parentElement;
/* istanbul ignore next */
        for (let i = 0; i < 10 && parent && parent !== document.body; i++) {
          const id = parent.id || '';
          const cls = parent.className || '';
/* istanbul ignore next */
/* istanbul ignore next */
          if (
/* istanbul ignore next */
            id.startsWith('bsa-zone') ||
/* istanbul ignore next */
            cls.includes('bsa') ||
/* istanbul ignore next */
            id.includes('buysellads') ||
/* istanbul ignore next */
            id.includes('div-gpt-ad') ||
/* istanbul ignore next */
            cls.includes('ad-container') ||
/* istanbul ignore next */
            cls.includes('ad-slot') ||
/* istanbul ignore next */
            cls.includes('ad-unit')
/* istanbul ignore next */
          ) {
/* istanbul ignore next */
            target = parent;
/* istanbul ignore next */
            break;
          }
/* istanbul ignore next */
          target = parent;
/* istanbul ignore next */
          parent = parent.parentElement;
        }
/* istanbul ignore next */
        hideAd(target);
/* istanbul ignore next */
      });
    }

    // Hide Douban erebor redirect ad containers
/* istanbul ignore next */
    document.querySelectorAll('a[href*="erebor.douban.com"]').forEach((link) => {
      const container = link.closest('.customize-slot, .article-card') || link.parentElement;
/* istanbul ignore next */
/* istanbul ignore next */
      if (container) {
/* istanbul ignore next */
        hideAd(container);
      }
/* istanbul ignore next */
    });

    // NYTimes regiwall: remove inert attribute and gateway overlay
/* istanbul ignore next */
/* istanbul ignore next */
    if (host.endsWith('nytimes.com')) {
/* istanbul ignore next */
      document.querySelectorAll('[data-testid="vi-gateway-container"][inert]').forEach((el) => {
/* istanbul ignore next */
        el.removeAttribute('inert');
/* istanbul ignore next */
        el.removeAttribute('aria-hidden');
/* istanbul ignore next */
      });
/* istanbul ignore next */
      document
/* istanbul ignore next */
        .querySelectorAll('#gateway-content, [data-testid="onsite-messaging-unit-gateway"]')
/* istanbul ignore next */
        .forEach((el) => {
/* istanbul ignore next */
          hideAd(el);
/* istanbul ignore next */
        });
    }

    // Restore scroll if ad overlay locked it
/* istanbul ignore next */
/* istanbul ignore next */
    if (document.body) {
/* istanbul ignore next */
      document.body.classList.remove('fc-overflow-hidden');
/* istanbul ignore next */
      document.documentElement.classList.remove('fc-overflow-hidden');

/* istanbul ignore next */
      [document.body, document.documentElement].forEach((el) => {
        const style = window.getComputedStyle(el);
/* istanbul ignore next */
/* istanbul ignore next */
        if (style.overflow === 'hidden' || style.overflowY === 'hidden') {
/* istanbul ignore next */
          el.style.setProperty('overflow', 'auto', 'important');
/* istanbul ignore next */
          el.style.setProperty('overflow-y', 'auto', 'important');
        }
/* istanbul ignore next */
      });
    }
  }

/* istanbul ignore next */
/* istanbul ignore next */
  if (document.readyState === 'loading') {
/* istanbul ignore next */
    document.addEventListener('DOMContentLoaded', blockForumAds);
/* istanbul ignore next */
  } else {
/* istanbul ignore next */
    blockForumAds();
  }

  // --- Phase 5: MutationObserver for dynamic ads ---

  function onMutation(mutations) {
    let needsFullScan = false;
/* istanbul ignore next */
    for (const mutation of mutations) {
/* istanbul ignore next */
      for (const node of mutation.addedNodes) {
/* istanbul ignore next */
/* istanbul ignore next */
        if (node.nodeType !== 1) {
/* istanbul ignore next */
          continue;
        }

        // Check if the added node itself is an ad
/* istanbul ignore next */
        for (const selector of FORUM_AD_SELECTORS) {
/* istanbul ignore next */
          try {
/* istanbul ignore next */
/* istanbul ignore next */
            if (node.matches && node.matches(selector)) {
/* istanbul ignore next */
              hideAd(node);
            }
          } catch {
            /* invalid selector */
          }
        }

        // Check if it's an ad script
/* istanbul ignore next */
/* istanbul ignore next */
        if (node.tagName === 'SCRIPT' && node.src && shouldBlockScript(node.src)) {
/* istanbul ignore next */
          node.remove();
/* istanbul ignore next */
          continue;
        }

        // Check for ad elements inside the added node
/* istanbul ignore next */
/* istanbul ignore next */
        if (node.querySelectorAll) {
/* istanbul ignore next */
          needsFullScan = true;
        }
      }
    }
/* istanbul ignore next */
/* istanbul ignore next */
    if (needsFullScan) {
/* istanbul ignore next */
      blockForumAds();
    }
  }

  const startObserver = () => {
/* istanbul ignore next */
/* istanbul ignore next */
    if (!document.body) {
/* istanbul ignore next */
      requestAnimationFrame(startObserver);
/* istanbul ignore next */
      return;
    }
    const observer = new MutationObserver(onMutation);
/* istanbul ignore next */
    observer.observe(document.body, { childList: true, subtree: true });
/* istanbul ignore next */
  };
/* istanbul ignore next */
  startObserver();

  // Also re-scan periodically for the first 10 seconds (catches late-loading ads)
  let scanCount = 0;
  const periodicScan = setInterval(() => {
/* istanbul ignore next */
    blockForumAds();
/* istanbul ignore next */
    scanCount++;
/* istanbul ignore next */
/* istanbul ignore next */
    if (scanCount >= 20) {
/* istanbul ignore next */
      clearInterval(periodicScan);
    }
/* istanbul ignore next */
  }, 500);

  // Export for testing
/* istanbul ignore next */
/* istanbul ignore next */
  if (typeof window !== 'undefined') {
/* istanbul ignore next */
    window.ForumAdBlocker = { blockForumAds, hideAd };
  }
/* istanbul ignore next */
})();
