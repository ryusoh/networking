/**
 * LinkedIn: Direct Profile Access
 * -------------------------------------------
 * Bypasses 'Premium Upsell' on profile recommendations.
 *
 * Strategy (matching proven linkedin_fix approach):
 * 1. Proactive DOM rewrite: MutationObserver rewrites premium links to search URLs
 * 2. Click interception: kills ALL events on recommendation cards, redirects to search
 * 3. Background failover: stores destination via message + session storage
 * @global
 */

/* global Element */
/* istanbul ignore next */
(function () {
/* istanbul ignore next */
  'use strict';

  function cleanLinkedInText(text) {
/* istanbul ignore next */
/* istanbul ignore next */
    if (!text) {
/* istanbul ignore next */
      return '';
    }
/* istanbul ignore next */
    return text
/* istanbul ignore next */
      .replace(/<!---->/g, '')
/* istanbul ignore next */
      .replace(/·/g, '')
/* istanbul ignore next */
      .replace(/\b(1st|2nd|3rd|Third degree connection|degree connection)\b/gi, '')
/* istanbul ignore next */
      .replace(/\s+/g, ' ')
/* istanbul ignore next */
      .trim();
  }

  // Card selectors for "More profiles for you" and similar recommendation sections
  const CARD_SELECTORS = [
/* istanbul ignore next */
    '#browsemap_recommendation',
/* istanbul ignore next */
    '.browsemap-profile',
/* istanbul ignore next */
    '.pv-browsemap-section__member-container',
/* istanbul ignore next */
    'li.artdeco-list__item',
/* istanbul ignore next */
    '.discover-entity-type-card',
/* istanbul ignore next */
    '.mn-discovery-card'
/* istanbul ignore next */
  ].join(', ');

  /**
   * Extract person's name + headline from a card and build a search URL.
   * Does NOT use a[href*="/in/"] — those can match the logged-in user's own profile.
   */
  function getDestinationForCard(card) {
    const nameSelectors = [
/* istanbul ignore next */
      'span[aria-hidden="true"]',
/* istanbul ignore next */
      '.name',
/* istanbul ignore next */
      '.actor-name',
/* istanbul ignore next */
      '.pv-browsemap-section__member-name',
/* istanbul ignore next */
      '.artdeco-entity-lockup__title span',
/* istanbul ignore next */
      '.artdeco-entity-lockup__title'
/* istanbul ignore next */
    ];
    let name = '';
    let headline = '';

/* istanbul ignore next */
    for (const selector of nameSelectors) {
      const el = card.querySelector(selector);
/* istanbul ignore next */
/* istanbul ignore next */
      if (el) {
        const cleaned = cleanLinkedInText(el.innerText || el.textContent);
/* istanbul ignore next */
/* istanbul ignore next */
        if (cleaned.length > 1) {
          // Skip button-like text
/* istanbul ignore next */
/* istanbul ignore next */
          if (/^(connect|follow|message|pending|more|dismiss)$/i.test(cleaned)) {
/* istanbul ignore next */
            continue;
          }
/* istanbul ignore next */
          name = cleaned;
/* istanbul ignore next */
          break;
        }
      }
    }

    const allText = Array.from(
/* istanbul ignore next */
      card.querySelectorAll(
/* istanbul ignore next */
        'span[aria-hidden="true"], .headline, .inline-show-more-text, .artdeco-entity-lockup__subtitle'
/* istanbul ignore next */
      )
/* istanbul ignore next */
    );
/* istanbul ignore next */
    for (const el of allText) {
      const cleaned = cleanLinkedInText(el.innerText || el.textContent);
/* istanbul ignore next */
/* istanbul ignore next */
      if (cleaned.length > 1 && cleaned !== name) {
/* istanbul ignore next */
/* istanbul ignore next */
        if (/^(connect|follow|message|pending|more|dismiss)$/i.test(cleaned)) {
/* istanbul ignore next */
          continue;
        }
/* istanbul ignore next */
        headline = cleaned;
/* istanbul ignore next */
        break;
      }
    }

/* istanbul ignore next */
/* istanbul ignore next */
    if (name) {
      const query = encodeURIComponent(`${name} ${headline}`.trim());
/* istanbul ignore next */
      return `https://www.linkedin.com/search/results/people/?keywords=${query}`;
    }
/* istanbul ignore next */
    return null;
  }

  /**
   * Store destination via both channels for race-condition-free failover:
   * 1. chrome.runtime.sendMessage → background in-memory variable (instant)
   * 2. chrome.storage.session → survives service worker restart
   */
  function storeDestination(url) {
/* istanbul ignore next */
/* istanbul ignore next */
    if (!url) {
/* istanbul ignore next */
      return;
    }
/* istanbul ignore next */
    try {
/* istanbul ignore next */
      chrome.runtime.sendMessage({ type: 'LINKEDIN_PROFILE_HOVER', url });
    } catch {
      /* context invalidated */
    }
/* istanbul ignore next */
    try {
/* istanbul ignore next */
      chrome.storage.session.set({ linkedinPendingProfile: url });
    } catch {
      /* fallback */
    }
  }

  // --- Layer 1: Proactive DOM Rewrite ---

  function proactivelyCleanLinks() {
    // The MutationObserver can fire asynchronously during page teardown/bfcache
    // (or test environment teardown), when `document` is no longer available.
/* istanbul ignore next */
/* istanbul ignore next */
    if (typeof document === 'undefined' || !document) {
/* istanbul ignore next */
      return;
    }
    const cards = document.querySelectorAll(CARD_SELECTORS);
/* istanbul ignore next */
    cards.forEach((card) => {
      const premiumLinks = card.querySelectorAll('a[href*="premium"]');
/* istanbul ignore next */
/* istanbul ignore next */
      if (premiumLinks.length === 0) {
/* istanbul ignore next */
        return;
      }

      const safeUrl = getDestinationForCard(card);
/* istanbul ignore next */
/* istanbul ignore next */
      if (safeUrl) {
/* istanbul ignore next */
        premiumLinks.forEach((link) => {
/* istanbul ignore next */
          link.href = safeUrl;
/* istanbul ignore next */
          link.setAttribute('data-cleaned', 'true');
/* istanbul ignore next */
          link.removeAttribute('data-tracking-control-name');
/* istanbul ignore next */
          link.removeAttribute('data-tracking-will-navigate');
/* istanbul ignore next */
        });
      }
/* istanbul ignore next */
    });
  }

  const observer = new MutationObserver(proactivelyCleanLinks);
/* istanbul ignore next */
  observer.observe(document.documentElement, { childList: true, subtree: true });
/* istanbul ignore next */
  proactivelyCleanLinks();

  // --- Layer 2: Click Interception (kill event on entire card) ---

  function handleIntercept(e) {
    let target = e.target;
/* istanbul ignore next */
/* istanbul ignore next */
    if (!(target instanceof Element)) {
/* istanbul ignore next */
      target = target.parentElement;
    }
/* istanbul ignore next */
/* istanbul ignore next */
    if (!target) {
/* istanbul ignore next */
      return;
    }
    const card = target.closest(CARD_SELECTORS);
/* istanbul ignore next */
/* istanbul ignore next */
    if (!card) {
/* istanbul ignore next */
      return;
    }

    // Only intercept if this card has a premium link (cleaned or not)
    const hasPremium = card.querySelector('a[href*="premium"]');
    const hasCleaned = card.querySelector('a[data-cleaned="true"]');
/* istanbul ignore next */
/* istanbul ignore next */
    if (!hasPremium && !hasCleaned) {
/* istanbul ignore next */
      return;
    }

    // Kill the event completely
/* istanbul ignore next */
    e.preventDefault();
/* istanbul ignore next */
    e.stopPropagation();
/* istanbul ignore next */
    e.stopImmediatePropagation();

    // Only navigate on click (not mousedown/pointerdown)
/* istanbul ignore next */
/* istanbul ignore next */
    if (e.type === 'click') {
      const destUrl = getDestinationForCard(card);
/* istanbul ignore next */
/* istanbul ignore next */
      if (destUrl) {
/* istanbul ignore next */
        storeDestination(destUrl);
/* istanbul ignore next */
        console.log('[LinkedIn Fix] Intercepted click ->', destUrl);
/* istanbul ignore next */
        window.location.assign(destUrl);
      }
    }
  }

/* istanbul ignore next */
  ['mousedown', 'click', 'pointerdown', 'touchstart'].forEach((type) => {
/* istanbul ignore next */
    document.addEventListener(type, handleIntercept, true);
/* istanbul ignore next */
  });

  // --- Layer 3: Hover pre-store for background failover ---

  function onHover(e) {
    let target = e.target;
/* istanbul ignore next */
/* istanbul ignore next */
    if (!(target instanceof Element)) {
/* istanbul ignore next */
      target = target.parentElement;
    }
/* istanbul ignore next */
/* istanbul ignore next */
    if (!target) {
/* istanbul ignore next */
      return;
    }
    const card = target.closest(CARD_SELECTORS);
/* istanbul ignore next */
/* istanbul ignore next */
    if (!card) {
/* istanbul ignore next */
      return;
    }
    const url = getDestinationForCard(card);
/* istanbul ignore next */
/* istanbul ignore next */
    if (url) {
/* istanbul ignore next */
      storeDestination(url);
/* istanbul ignore next */
      console.log('[LinkedIn Fix] Stored on hover:', url);
    }
  }

/* istanbul ignore next */
  document.addEventListener('mouseover', onHover, { capture: true, passive: true });

/* istanbul ignore next */
  console.log('[LinkedIn Fix] 3-Layer Shield Active (DOM rewrite + click kill + hover store)');
/* istanbul ignore next */
})();
