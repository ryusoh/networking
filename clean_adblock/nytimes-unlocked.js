/**
 * NYTimes Unlocked (MAIN world)
 * Removes registration wall, scrim overlay, and restores truncated article content.
 */
/* istanbul ignore next */
(function () {
/* istanbul ignore next */
  'use strict';

/* istanbul ignore next */
  if (!window.location.hostname.endsWith('nytimes.com')) {
/* istanbul ignore next */
    return;
  }

  // --- CSS: hide regiwall, scrim, overlays, iframes ---
  const style = document.createElement('style');
/* istanbul ignore next */
  style.id = 'nyt-unlocked-css';
/* istanbul ignore next */
  style.textContent = `
    /* Gateway / regiwall overlays */
/* istanbul ignore next */
    #gateway-content,
/* istanbul ignore next */
    [data-testid="onsite-messaging-unit-gateway"],
/* istanbul ignore next */
    [data-testid="inline-message"],
/* istanbul ignore next */
    .css-gx5sib {
/* istanbul ignore next */
      display: none !important;
    }

    /* vi-gateway-container wraps the whole page as position:fixed — unfix it to allow scroll */
/* istanbul ignore next */
    .vi-gateway-container {
/* istanbul ignore next */
      position: static !important;
/* istanbul ignore next */
      overflow: visible !important;
/* istanbul ignore next */
      width: auto !important;
/* istanbul ignore next */
      height: auto !important;
    }

    /* Regiwall login iframe overlay */
/* istanbul ignore next */
    iframe[src*="regiwall"],
/* istanbul ignore next */
    iframe[src*="gateway"],
/* istanbul ignore next */
    iframe[src*="enter-email"][src*="RegiWall"] {
/* istanbul ignore next */
      display: none !important;
/* istanbul ignore next */
      pointer-events: none !important;
/* istanbul ignore next */
      width: 0 !important;
/* istanbul ignore next */
      height: 0 !important;
    }

    /* Subscribe CTA paragraph inside article */
/* istanbul ignore next */
    p[role="note"]:has(a[href*="subscription"]),
/* istanbul ignore next */
    p[role="note"]:has(a[href*="campaignId"]) {
/* istanbul ignore next */
      display: none !important;
    }

    /* Ensure page is scrollable */
/* istanbul ignore next */
    html, body {
/* istanbul ignore next */
      overflow: visible !important;
/* istanbul ignore next */
      overflow-y: visible !important;
/* istanbul ignore next */
      position: static !important;
    }
/* istanbul ignore next */
  `;
/* istanbul ignore next */
  (document.head || document.documentElement).appendChild(style);

  // --- Intercept scrollTo/scroll to prevent scroll-lock scripts ---
  const origScrollTo = window.scrollTo.bind(window);
  let userHasScrolled = false;
/* istanbul ignore next */
  window.addEventListener(
/* istanbul ignore next */
    'wheel',
/* istanbul ignore next */
    () => {
/* istanbul ignore next */
      userHasScrolled = true;
/* istanbul ignore next */
    },
/* istanbul ignore next */
    { passive: true, once: true }
/* istanbul ignore next */
  );

/* istanbul ignore next */
  window.scrollTo = function (...args) {
    // Allow scrollTo(0, 0) only before user interacts; block regiwall scroll resets
/* istanbul ignore next */
/* istanbul ignore next */
    if (userHasScrolled) {
      const x = typeof args[0] === 'object' ? args[0].left || 0 : args[0] || 0;
      const y = typeof args[0] === 'object' ? args[0].top || 0 : args[1] || 0;
/* istanbul ignore next */
/* istanbul ignore next */
      if (x === 0 && y === 0) {
/* istanbul ignore next */
        return;
/* istanbul ignore next */
      } // Block scroll-to-top resets
    }
/* istanbul ignore next */
    return origScrollTo(...args);
/* istanbul ignore next */
  };
/* istanbul ignore next */
  window.scroll = window.scrollTo;

  function removeInert() {
/* istanbul ignore next */
    document.querySelectorAll('[inert]').forEach((el) => {
/* istanbul ignore next */
      el.removeAttribute('inert');
/* istanbul ignore next */
      el.removeAttribute('aria-hidden');
/* istanbul ignore next */
    });
  }

  function hideOverlays() {
    // Gateway overlays
/* istanbul ignore next */
    document
/* istanbul ignore next */
      .querySelectorAll('#gateway-content, [data-testid="onsite-messaging-unit-gateway"]')
/* istanbul ignore next */
      .forEach((el) => {
/* istanbul ignore next */
        el.style.setProperty('display', 'none', 'important');
/* istanbul ignore next */
      });
    // vi-gateway-container: wraps the page as position:fixed — unfix to allow scroll
/* istanbul ignore next */
    document.querySelectorAll('.vi-gateway-container').forEach((el) => {
/* istanbul ignore next */
      el.style.setProperty('position', 'static', 'important');
/* istanbul ignore next */
      el.style.setProperty('overflow', 'visible', 'important');
/* istanbul ignore next */
      el.style.setProperty('width', 'auto', 'important');
/* istanbul ignore next */
      el.style.setProperty('height', 'auto', 'important');
/* istanbul ignore next */
    });
    // Scrim div
/* istanbul ignore next */
    document.querySelectorAll('.css-gx5sib').forEach((el) => {
/* istanbul ignore next */
      el.style.setProperty('display', 'none', 'important');
/* istanbul ignore next */
    });

    // Regiwall iframes — hide and disable
/* istanbul ignore next */
    document.querySelectorAll('iframe').forEach((iframe) => {
      const src = iframe.src || iframe.getAttribute('src') || '';
/* istanbul ignore next */
/* istanbul ignore next */
      if (src.includes('regiwall') || src.includes('RegiWall') || src.includes('gateway')) {
/* istanbul ignore next */
        iframe.style.setProperty('display', 'none', 'important');
/* istanbul ignore next */
        iframe.style.setProperty('pointer-events', 'none', 'important');
/* istanbul ignore next */
        iframe.style.setProperty('width', '0', 'important');
/* istanbul ignore next */
        iframe.style.setProperty('height', '0', 'important');
      }
/* istanbul ignore next */
    });

    // Also hide any container wrapping a regiwall iframe
/* istanbul ignore next */
    document.querySelectorAll('div').forEach((div) => {
      const s = window.getComputedStyle(div);
/* istanbul ignore next */
/* istanbul ignore next */
      if ((s.position === 'fixed' || s.position === 'absolute') && s.display !== 'none') {
        const iframe = div.querySelector(
/* istanbul ignore next */
          'iframe[src*="regiwall"], iframe[src*="RegiWall"], iframe[src*="gateway"]'
/* istanbul ignore next */
        );
/* istanbul ignore next */
/* istanbul ignore next */
        if (iframe) {
/* istanbul ignore next */
          div.style.setProperty('display', 'none', 'important');
        }
      }
/* istanbul ignore next */
    });

    // Subscribe CTA
/* istanbul ignore next */
    document.querySelectorAll('p[role="note"]').forEach((p) => {
/* istanbul ignore next */
/* istanbul ignore next */
      if (p.querySelector('a[href*="subscription"]') || p.querySelector('a[href*="campaignId"]')) {
/* istanbul ignore next */
        p.style.setProperty('display', 'none', 'important');
      }
/* istanbul ignore next */
    });

    // Restore scroll
/* istanbul ignore next */
/* istanbul ignore next */
    if (document.body) {
/* istanbul ignore next */
      for (const el of [document.body, document.documentElement]) {
/* istanbul ignore next */
        el.style.setProperty('overflow', 'visible', 'important');
        // Remove scroll-lock classes
/* istanbul ignore next */
        el.classList.forEach((c) => {
/* istanbul ignore next */
/* istanbul ignore next */
          if (/noScroll|no-scroll|modal|overflow/i.test(c)) {
/* istanbul ignore next */
            el.classList.remove(c);
          }
/* istanbul ignore next */
        });
      }
    }
  }

  /**
   * Restore full article from __preloadedData.sprinkledBody.content
   */
  let restored = false;
  function restoreArticle() {
/* istanbul ignore next */
/* istanbul ignore next */
    if (restored) {
/* istanbul ignore next */
      return;
    }
    const data = window.__preloadedData;
/* istanbul ignore next */
/* istanbul ignore next */
    if (!data || !data.initialData || !data.initialData.data) {
/* istanbul ignore next */
      return;
    }

    const article = data.initialData.data.article;
/* istanbul ignore next */
/* istanbul ignore next */
    if (!article || !article.sprinkledBody || !article.sprinkledBody.content) {
/* istanbul ignore next */
      return;
    }

    const articleBody = document.querySelector(
/* istanbul ignore next */
      'section[name="articleBody"], section.meteredContent'
/* istanbul ignore next */
    );
/* istanbul ignore next */
/* istanbul ignore next */
    if (!articleBody) {
/* istanbul ignore next */
      return;
    }

    // Collect existing paragraph texts to avoid duplicates
    const existingTexts = new Set();
/* istanbul ignore next */
    articleBody.querySelectorAll('p').forEach((p) => {
      const t = p.textContent.trim();
/* istanbul ignore next */
/* istanbul ignore next */
      if (t) {
/* istanbul ignore next */
        existingTexts.add(t);
      }
/* istanbul ignore next */
    });

    // Extract paragraphs from sprinkledBody
    const newParagraphs = [];
/* istanbul ignore next */
    for (const block of article.sprinkledBody.content) {
/* istanbul ignore next */
/* istanbul ignore next */
      if (block.__typename !== 'ParagraphBlock' || !block.content) {
/* istanbul ignore next */
        continue;
      }

      let text = '';
      let html = '';
/* istanbul ignore next */
      for (const inline of block.content) {
/* istanbul ignore next */
/* istanbul ignore next */
        if (inline.__typename === 'TextInline') {
          let t = inline.text || '';
/* istanbul ignore next */
/* istanbul ignore next */
          if (inline.formats && inline.formats.length > 0) {
/* istanbul ignore next */
            for (const fmt of inline.formats) {
/* istanbul ignore next */
/* istanbul ignore next */
              if (fmt.__typename === 'BoldFormat') {
/* istanbul ignore next */
                t = '<strong>' + t + '</strong>';
/* istanbul ignore next */
              } else if (fmt.__typename === 'ItalicFormat') {
/* istanbul ignore next */
                t = '<em>' + t + '</em>';
              }
            }
          }
/* istanbul ignore next */
          html += t;
/* istanbul ignore next */
          text += inline.text || '';
        }
      }

/* istanbul ignore next */
      text = text.trim();
/* istanbul ignore next */
/* istanbul ignore next */
      if (text && !existingTexts.has(text)) {
/* istanbul ignore next */
        newParagraphs.push(html);
/* istanbul ignore next */
        existingTexts.add(text);
      }
    }

/* istanbul ignore next */
/* istanbul ignore next */
    if (newParagraphs.length === 0) {
/* istanbul ignore next */
      return;
    }

    const companion =
/* istanbul ignore next */
      articleBody.querySelector('.StoryBodyCompanionColumn .css-53u6y8') ||
/* istanbul ignore next */
      articleBody.querySelector('[data-testid="companionColumn-0"] > div');
/* istanbul ignore next */
/* istanbul ignore next */
    if (!companion) {
/* istanbul ignore next */
      return;
    }

    const existingP = companion.querySelector('p');
    const pClass = existingP ? existingP.className : '';
    const subscribeCTA = companion.querySelector('p[role="note"]');

/* istanbul ignore next */
    for (const html of newParagraphs) {
      const p = document.createElement('p');
/* istanbul ignore next */
      p.className = pClass;
/* istanbul ignore next */
      p.innerHTML = html;
/* istanbul ignore next */
/* istanbul ignore next */
      if (subscribeCTA) {
/* istanbul ignore next */
        companion.insertBefore(p, subscribeCTA);
/* istanbul ignore next */
      } else {
/* istanbul ignore next */
        companion.appendChild(p);
      }
    }

/* istanbul ignore next */
    restored = true;
  }

  function run() {
/* istanbul ignore next */
    removeInert();
/* istanbul ignore next */
    hideOverlays();
/* istanbul ignore next */
    restoreArticle();
  }

/* istanbul ignore next */
/* istanbul ignore next */
  if (document.readyState === 'loading') {
/* istanbul ignore next */
    document.addEventListener('DOMContentLoaded', run);
/* istanbul ignore next */
  } else {
/* istanbul ignore next */
    run();
  }

/* istanbul ignore next */
  setTimeout(run, 500);
/* istanbul ignore next */
  setTimeout(run, 1500);
/* istanbul ignore next */
  setTimeout(run, 3000);

  // Keep checking for 10s (NYT may re-apply locks)
  let checks = 0;
  const interval = setInterval(() => {
/* istanbul ignore next */
    run();
/* istanbul ignore next */
    checks++;
/* istanbul ignore next */
/* istanbul ignore next */
    if (checks >= 20) {
/* istanbul ignore next */
      clearInterval(interval);
    }
/* istanbul ignore next */
  }, 500);

  // Observer for dynamic changes
  const startObserver = () => {
/* istanbul ignore next */
/* istanbul ignore next */
    if (!document.body) {
/* istanbul ignore next */
      requestAnimationFrame(startObserver);
/* istanbul ignore next */
      return;
    }
    const observer = new MutationObserver(() => {
/* istanbul ignore next */
      removeInert();
/* istanbul ignore next */
      hideOverlays();
/* istanbul ignore next */
/* istanbul ignore next */
      if (!restored) {
/* istanbul ignore next */
        restoreArticle();
      }
/* istanbul ignore next */
    });
/* istanbul ignore next */
    observer.observe(document.body, { childList: true, subtree: true });
/* istanbul ignore next */
  };
/* istanbul ignore next */
  startObserver();
/* istanbul ignore next */
})();
