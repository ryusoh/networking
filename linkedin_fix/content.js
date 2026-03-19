/**
 * LinkedIn: Direct Profile Access - Content Script
 * -------------------------------------------
 * Intercepts clicks on recommendation links.
 * If a valid profile URL is found, it navigates directly.
 * If the link is "poisoned", it falls back to a name-based search.
 */

(function () {
  'use strict';

  function cleanLinkedInText(text) {
    if (!text) {
      return '';
    }
    return text
      .replace(/<!---->/g, '')
      .replace(/·/g, '')
      .replace(/\b(1st|2nd|3rd|Third degree connection|degree connection)\b/gi, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function handleIntercept(e) {
    // Kill the event immediately at the capture phase.
    // This is the primary defense to prevent LinkedIn's scripts from triggering the upsell.
    const isRecommendation =
      e.target.closest('#browsemap_recommendation') ||
      e.target.closest('.pv-profile-card__anchor') ||
      e.target.closest('.browsemap-profile') ||
      e.target.closest('.pv-browsemap-section__member-container') ||
      e.target.closest('li.artdeco-list__item') ||
      e.target.closest('.artdeco-list__item');

    if (!isRecommendation) {
      return;
    }

    // Total Event Annihilation
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();

    // 1. STRATEGY A: Direct URL Capture
    // Check if the clicked element or any parent is an <a> tag with a valid profile link
    const linkEl = e.target.closest('a');
    if (
      linkEl &&
      linkEl.href &&
      linkEl.href.includes('/in/') &&
      !linkEl.href.includes('premium/')
    ) {
      console.log('[LinkedIn Fix] Caught direct profile link:', linkEl.href);
      window.location.assign(linkEl.href);
      return;
    }

    // 2. STRATEGY B: Search-Bypass Fallback
    // If we didn't find a direct link, or the link was already poisoned, use the text-scraping logic.
    const card = isRecommendation; // card container found in step 1

    const nameSelectors = [
      'span[aria-hidden="true"]',
      '.name',
      '.actor-name',
      '.pv-browsemap-section__member-name',
      '[data-field="name"]',
      '.artdeco-entity-lockup__title'
    ];

    let name = '';
    let headline = '';

    for (const selector of nameSelectors) {
      const el = card.querySelector(selector);
      if (el) {
        const cleaned = cleanLinkedInText(el.innerText || el.textContent);
        if (cleaned.length > 1) {
          name = cleaned;
          break;
        }
      }
    }

    const allTextElements = Array.from(
      card.querySelectorAll('span[aria-hidden="true"], .headline, .inline-show-more-text')
    );
    for (const el of allTextElements) {
      const cleaned = cleanLinkedInText(el.innerText || el.textContent);
      if (cleaned.length > 1 && cleaned !== name) {
        headline = cleaned;
        break;
      }
    }

    if (name) {
      const query = encodeURIComponent(`${name} ${headline}`.trim());
      const searchUrl = `https://www.linkedin.com/search/results/people/?keywords=${query}`;
      console.log(`[LinkedIn Fix] Bypassing poisoned link for: ${name}. Searching...`);
      window.location.assign(searchUrl);
    }
  }

  // Expanded event shield to catch all possible interaction vectors
  ['mousedown', 'click', 'pointerdown', 'mouseup', 'auxclick'].forEach((eventType) => {
    document.addEventListener(eventType, handleIntercept, true);
  });

  console.log('[LinkedIn Fix] Aggressive Triple-Shield active.');
})();
