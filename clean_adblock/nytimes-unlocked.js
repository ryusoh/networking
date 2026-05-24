/**
 * NYTimes Unlocked (MAIN world)
 * Removes registration wall, scrim overlay, and restores truncated article content.
 */
(function () {
  'use strict';

  if (!window.location.hostname.endsWith('nytimes.com')) {
    return;
  }

  // --- CSS: hide regiwall, scrim, overlays, iframes ---
  const style = document.createElement('style');
  style.id = 'nyt-unlocked-css';
  style.textContent = `
    /* Gateway / regiwall overlays */
    #gateway-content,
    [data-testid="onsite-messaging-unit-gateway"],
    [data-testid="inline-message"],
    .css-gx5sib {
      display: none !important;
    }

    /* vi-gateway-container wraps the whole page as position:fixed — unfix it to allow scroll */
    .vi-gateway-container {
      position: static !important;
      overflow: visible !important;
      width: auto !important;
      height: auto !important;
    }

    /* Regiwall login iframe overlay */
    iframe[src*="regiwall"],
    iframe[src*="gateway"],
    iframe[src*="enter-email"][src*="RegiWall"] {
      display: none !important;
      pointer-events: none !important;
      width: 0 !important;
      height: 0 !important;
    }

    /* Subscribe CTA paragraph inside article */
    p[role="note"]:has(a[href*="subscription"]),
    p[role="note"]:has(a[href*="campaignId"]) {
      display: none !important;
    }

    /* Ensure page is scrollable */
    html, body {
      overflow: visible !important;
      overflow-y: visible !important;
      position: static !important;
    }
  `;
  (document.head || document.documentElement).appendChild(style);

  // --- Intercept scrollTo/scroll to prevent scroll-lock scripts ---
  const origScrollTo = window.scrollTo.bind(window);
  let userHasScrolled = false;
  window.addEventListener(
    'wheel',
    () => {
      userHasScrolled = true;
    },
    { passive: true, once: true }
  );

  window.scrollTo = function (...args) {
    // Allow scrollTo(0, 0) only before user interacts; block regiwall scroll resets
    if (userHasScrolled) {
      const x = typeof args[0] === 'object' ? args[0].left || 0 : args[0] || 0;
      const y = typeof args[0] === 'object' ? args[0].top || 0 : args[1] || 0;
      if (x === 0 && y === 0) {
        return;
      } // Block scroll-to-top resets
    }
    return origScrollTo(...args);
  };
  window.scroll = window.scrollTo;

  function removeInert() {
    document.querySelectorAll('[inert]').forEach((el) => {
      el.removeAttribute('inert');
      el.removeAttribute('aria-hidden');
    });
  }

  function hideOverlays() {
    // Gateway overlays
    document
      .querySelectorAll('#gateway-content, [data-testid="onsite-messaging-unit-gateway"]')
      .forEach((el) => {
        el.style.setProperty('display', 'none', 'important');
      });
    // vi-gateway-container: wraps the page as position:fixed — unfix to allow scroll
    document.querySelectorAll('.vi-gateway-container').forEach((el) => {
      el.style.setProperty('position', 'static', 'important');
      el.style.setProperty('overflow', 'visible', 'important');
      el.style.setProperty('width', 'auto', 'important');
      el.style.setProperty('height', 'auto', 'important');
    });
    // Scrim div
    document.querySelectorAll('.css-gx5sib').forEach((el) => {
      el.style.setProperty('display', 'none', 'important');
    });

    // Regiwall iframes — hide and disable
    document.querySelectorAll('iframe').forEach((iframe) => {
      const src = iframe.src || iframe.getAttribute('src') || '';
      if (src.includes('regiwall') || src.includes('RegiWall') || src.includes('gateway')) {
        iframe.style.setProperty('display', 'none', 'important');
        iframe.style.setProperty('pointer-events', 'none', 'important');
        iframe.style.setProperty('width', '0', 'important');
        iframe.style.setProperty('height', '0', 'important');
      }
    });

    // Also hide any container wrapping a regiwall iframe
    document.querySelectorAll('div').forEach((div) => {
      const s = window.getComputedStyle(div);
      if ((s.position === 'fixed' || s.position === 'absolute') && s.display !== 'none') {
        const iframe = div.querySelector(
          'iframe[src*="regiwall"], iframe[src*="RegiWall"], iframe[src*="gateway"]'
        );
        if (iframe) {
          div.style.setProperty('display', 'none', 'important');
        }
      }
    });

    // Subscribe CTA
    document.querySelectorAll('p[role="note"]').forEach((p) => {
      if (p.querySelector('a[href*="subscription"]') || p.querySelector('a[href*="campaignId"]')) {
        p.style.setProperty('display', 'none', 'important');
      }
    });

    // Restore scroll
    if (document.body) {
      for (const el of [document.body, document.documentElement]) {
        el.style.setProperty('overflow', 'visible', 'important');
        // Remove scroll-lock classes
        el.classList.forEach((c) => {
          if (/noScroll|no-scroll|modal|overflow/i.test(c)) {
            el.classList.remove(c);
          }
        });
      }
    }
  }

  /**
   * Restore full article from __preloadedData.sprinkledBody.content
   */
  let restored = false;
  function restoreArticle() {
    if (restored) {
      return;
    }
    const data = window.__preloadedData;
    if (!data || !data.initialData || !data.initialData.data) {
      return;
    }

    const article = data.initialData.data.article;
    if (!article || !article.sprinkledBody || !article.sprinkledBody.content) {
      return;
    }

    const articleBody = document.querySelector(
      'section[name="articleBody"], section.meteredContent'
    );
    if (!articleBody) {
      return;
    }

    // Collect existing paragraph texts to avoid duplicates
    const existingTexts = new Set();
    articleBody.querySelectorAll('p').forEach((p) => {
      const t = p.textContent.trim();
      if (t) {
        existingTexts.add(t);
      }
    });

    // Extract paragraphs from sprinkledBody
    const newParagraphs = [];
    for (const block of article.sprinkledBody.content) {
      if (block.__typename !== 'ParagraphBlock' || !block.content) {
        continue;
      }

      let text = '';
      let html = '';
      for (const inline of block.content) {
        if (inline.__typename === 'TextInline') {
          let t = inline.text || '';
          if (inline.formats && inline.formats.length > 0) {
            for (const fmt of inline.formats) {
              if (fmt.__typename === 'BoldFormat') {
                t = '<strong>' + t + '</strong>';
              } else if (fmt.__typename === 'ItalicFormat') {
                t = '<em>' + t + '</em>';
              }
            }
          }
          html += t;
          text += inline.text || '';
        }
      }

      text = text.trim();
      if (text && !existingTexts.has(text)) {
        newParagraphs.push(html);
        existingTexts.add(text);
      }
    }

    if (newParagraphs.length === 0) {
      return;
    }

    const companion =
      articleBody.querySelector('.StoryBodyCompanionColumn .css-53u6y8') ||
      articleBody.querySelector('[data-testid="companionColumn-0"] > div');
    if (!companion) {
      return;
    }

    const existingP = companion.querySelector('p');
    const pClass = existingP ? existingP.className : '';
    const subscribeCTA = companion.querySelector('p[role="note"]');

    for (const html of newParagraphs) {
      const p = document.createElement('p');
      p.className = pClass;
      p.innerHTML = html;
      if (subscribeCTA) {
        companion.insertBefore(p, subscribeCTA);
      } else {
        companion.appendChild(p);
      }
    }

    restored = true;
  }

  function run() {
    removeInert();
    hideOverlays();
    restoreArticle();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }

  setTimeout(run, 500);
  setTimeout(run, 1500);
  setTimeout(run, 3000);

  // Keep checking for 10s (NYT may re-apply locks)
  let checks = 0;
  const interval = setInterval(() => {
    run();
    checks++;
    if (checks >= 20) {
      clearInterval(interval);
    }
  }, 500);

  // Observer for dynamic changes
  const startObserver = () => {
    if (!document.body) {
      requestAnimationFrame(startObserver);
      return;
    }
    const observer = new MutationObserver(() => {
      removeInert();
      hideOverlays();
      if (!restored) {
        restoreArticle();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  };
  startObserver();
})();
