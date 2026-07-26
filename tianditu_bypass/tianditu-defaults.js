/**
 * Tianditu: Auto-select 影像 (Satellite Imagery) mode
 * Clicks the imagery layer button once the map UI loads.
 */
(function () {
  'use strict';

  let attempts = 0;
  const MAX_ATTEMPTS = 30; /* 30 * 500ms = 15 seconds max wait */

  function findPrimaryImageryBtn() {
    /* The layer switcher buttons contain text like 影像, 地图, 地形 */
    const buttons = document.querySelectorAll(
      '.mapTypeCard span, .maptype-item, .map-type-item, [class*="mapType"] span, .tdtBaseItem'
    );
    for (const btn of buttons) {
      if (!(btn instanceof window.HTMLElement)) {
        continue;
      }
      const text = (btn.textContent || btn.innerText || '').trim();
      if (text === '影像') {
        return btn;
      }
    }
    return null;
  }

  function findFallbackImageryBtn() {
    /* Fallback: look for any clickable element containing 影像 */
    const allEls = document.querySelectorAll('span, div, a, button, li');
    for (const el of allEls) {
      if (!(el instanceof window.HTMLElement)) {
        continue;
      }
      if (el.children.length === 0 && (el.textContent || '').trim() === '影像') {
        return el;
      }
    }
    return null;
  }

  function selectImagery() {
    const primaryBtn = findPrimaryImageryBtn();
    if (primaryBtn) {
      primaryBtn.click();
      console.log('[Tianditu] Switched to 影像 (Satellite) mode');
      return true;
    }

    const fallbackBtn = findFallbackImageryBtn();
    if (fallbackBtn) {
      fallbackBtn.click();
      console.log('[Tianditu] Switched to 影像 (Satellite) mode (fallback)');
      return true;
    }

    return false;
  }

  function trySelect() {
    if (selectImagery()) {
      return;
    }
    attempts++;
    if (attempts < MAX_ATTEMPTS) {
      setTimeout(trySelect, 500);
    }
  }

  /* Wait for DOM to be ready, then start trying */
  if (document.readyState === 'complete') {
    setTimeout(trySelect, 1000);
  } else {
    window.addEventListener('load', () => setTimeout(trySelect, 1000));
  }
})();
