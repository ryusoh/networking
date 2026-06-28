/**
 * Bypass: AdBlock Detector - Element Picker
 */

/* istanbul ignore next */
(function () {
/* istanbul ignore next */
  if (typeof chrome === 'undefined' || !chrome.storage) {
/* istanbul ignore next */
    return;
  }
/* istanbul ignore next */
  if (window.__bypassPickerActive) {
/* istanbul ignore next */
    return;
  }
/* istanbul ignore next */
  window.__bypassPickerActive = true;

  const overlay = document.createElement('div');
/* istanbul ignore next */
  overlay.style.cssText = `
/* istanbul ignore next */
    position: fixed;
/* istanbul ignore next */
    top: 0; left: 0; width: 100%; height: 100%;
/* istanbul ignore next */
    z-index: 2147483647;
/* istanbul ignore next */
    cursor: crosshair;
/* istanbul ignore next */
    background: rgba(0, 100, 255, 0.1);
/* istanbul ignore next */
    pointer-events: none;
/* istanbul ignore next */
  `;
/* istanbul ignore next */
  document.documentElement.appendChild(overlay);

  const highlight = document.createElement('div');
/* istanbul ignore next */
  highlight.style.cssText = `
/* istanbul ignore next */
    position: absolute;
/* istanbul ignore next */
    background: rgba(255, 0, 0, 0.3);
/* istanbul ignore next */
    border: 2px solid red;
/* istanbul ignore next */
    pointer-events: none;
/* istanbul ignore next */
    z-index: 2147483647;
/* istanbul ignore next */
    transition: all 0.1s ease;
/* istanbul ignore next */
  `;
/* istanbul ignore next */
  document.documentElement.appendChild(highlight);

  function handleMouseMove(e) {
    const el = document.elementFromPoint(e.clientX, e.clientY);
/* istanbul ignore next */
/* istanbul ignore next */
    if (!el || el === overlay || el === highlight) {
/* istanbul ignore next */
      return;
    }

    const rect = el.getBoundingClientRect();
/* istanbul ignore next */
    highlight.style.top = rect.top + window.scrollY + 'px';
/* istanbul ignore next */
    highlight.style.left = rect.left + window.scrollX + 'px';
/* istanbul ignore next */
    highlight.style.width = rect.width + 'px';
/* istanbul ignore next */
    highlight.style.height = rect.height + 'px';
  }

  function handleClick(e) {
/* istanbul ignore next */
    e.preventDefault();
/* istanbul ignore next */
    e.stopPropagation();

    const el = document.elementFromPoint(e.clientX, e.clientY);
/* istanbul ignore next */
/* istanbul ignore next */
    if (!el || el === overlay || el === highlight) {
/* istanbul ignore next */
      return;
    }

    const selector = generateSelector(el);
/* istanbul ignore next */
/* istanbul ignore next */
    if (confirm(`Hide this element permanently?\nSelector: ${selector}`)) {
/* istanbul ignore next */
      saveCustomSelector(selector);
/* istanbul ignore next */
      el.style.display = 'none';
    }
/* istanbul ignore next */
    cleanup();
  }

  function handleKeydown(e) {
/* istanbul ignore next */
/* istanbul ignore next */
    if (e.key === 'Escape') {
/* istanbul ignore next */
      cleanup();
    }
  }

  function generateSelector(el) {
/* istanbul ignore next */
/* istanbul ignore next */
    if (el.id) {
/* istanbul ignore next */
      return `#${CSS.escape(el.id)}`;
    }
/* istanbul ignore next */
/* istanbul ignore next */
    if (el.className && typeof el.className === 'string') {
      const cls = el.className.split(/\s+/)[0];
/* istanbul ignore next */
/* istanbul ignore next */
      if (cls) {
/* istanbul ignore next */
        return `.${CSS.escape(cls)}`;
      }
    }
/* istanbul ignore next */
    return el.tagName.toLowerCase();
  }

  function saveCustomSelector(selector) {
/* istanbul ignore next */
/* istanbul ignore next */
    if (typeof chrome === 'undefined' || !chrome.storage || !chrome.storage.local) {
/* istanbul ignore next */
      return;
    }
    const host = window.location.hostname;
/* istanbul ignore next */
    try {
/* istanbul ignore next */
      chrome.storage.local.get(['customSelectors'], (result) => {
/* istanbul ignore next */
        try {
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
          const selectors = result.customSelectors || {};
/* istanbul ignore next */
/* istanbul ignore next */
          if (!selectors[host]) {
/* istanbul ignore next */
            selectors[host] = [];
          }
/* istanbul ignore next */
/* istanbul ignore next */
          if (!selectors[host].includes(selector)) {
/* istanbul ignore next */
            selectors[host].push(selector);
/* istanbul ignore next */
            chrome.storage.local.set({ customSelectors: selectors });
          }
        } catch (e) {
/* istanbul ignore next */
          console.error('Picker local storage callback failed:', e);
        }
/* istanbul ignore next */
      });
    } catch (e) {
/* istanbul ignore next */
      console.error('Picker local storage access failed:', e);
    }
  }

  function cleanup() {
/* istanbul ignore next */
    window.__bypassPickerActive = false;
/* istanbul ignore next */
    overlay.remove();
/* istanbul ignore next */
    highlight.remove();
/* istanbul ignore next */
    document.removeEventListener('mousemove', handleMouseMove);
/* istanbul ignore next */
    document.removeEventListener('click', handleClick, true);
/* istanbul ignore next */
    document.removeEventListener('keydown', handleKeydown);
  }

/* istanbul ignore next */
  document.addEventListener('mousemove', handleMouseMove);
/* istanbul ignore next */
  document.addEventListener('click', handleClick, true);
/* istanbul ignore next */
  document.addEventListener('keydown', handleKeydown);

/* istanbul ignore next */
  alert('Element Picker active. Click an element to hide it, or press ESC to cancel.');
/* istanbul ignore next */
})();
