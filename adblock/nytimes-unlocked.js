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

  /**
   * Helper to extract horizontal scroll position.
   * @param {unknown} a0
   * @returns {number}
   */
  function getScrollX(a0) {
    if (typeof a0 === 'object' && a0 !== null) {
      return /** @type {ScrollToOptions} */ (a0).left || 0;
    }
    return typeof a0 === 'number' ? a0 : 0;
  }

  /**
   * Helper to extract vertical scroll position.
   * @param {unknown} a0
   * @param {unknown} a1
   * @returns {number}
   */
  function getScrollY(a0, a1) {
    if (typeof a0 === 'object' && a0 !== null) {
      return /** @type {ScrollToOptions} */ (a0).top || 0;
    }
    return typeof a1 === 'number' ? a1 : 0;
  }

  window.scrollTo = /** @type {typeof window.scrollTo} */ (
    function () {
      // Allow scrollTo(0, 0) only before user interacts; block regiwall scroll resets
      if (userHasScrolled) {
        const x = getScrollX(arguments[0]);
        const y = getScrollY(arguments[0], arguments[1]);
        if (x === 0 && y === 0) {
          return;
        } // Block scroll-to-top resets
      }
      return Reflect.apply(origScrollTo, window, arguments);
    }
  );
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
        if (el instanceof HTMLElement) {
          el.style.setProperty('display', 'none', 'important');
        }
      });
    // vi-gateway-container: wraps the page as position:fixed — unfix to allow scroll
    document.querySelectorAll('.vi-gateway-container').forEach((el) => {
      if (el instanceof HTMLElement) {
        el.style.setProperty('position', 'static', 'important');
        el.style.setProperty('overflow', 'visible', 'important');
        el.style.setProperty('width', 'auto', 'important');
        el.style.setProperty('height', 'auto', 'important');
      }
    });
    // Scrim div
    document.querySelectorAll('.css-gx5sib').forEach((el) => {
      if (el instanceof HTMLElement) {
        el.style.setProperty('display', 'none', 'important');
      }
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
    document
      .querySelectorAll('iframe[src*="regiwall"], iframe[src*="RegiWall"], iframe[src*="gateway"]')
      .forEach((iframe) => {
        let el = iframe.parentElement;
        while (el && el !== document.body) {
          if (el.tagName === 'DIV') {
            const s = window.getComputedStyle(el);
            if ((s.position === 'fixed' || s.position === 'absolute') && s.display !== 'none') {
              el.style.setProperty('display', 'none', 'important');
              break;
            }
          }
          el = el.parentElement;
        }
      });

    // Subscribe CTA
    document
      .querySelectorAll(
        'p[role="note"] a[href*="subscription"], p[role="note"] a[href*="campaignId"]'
      )
      .forEach((a) => {
        const p = a.closest('p[role="note"]');
        if (p instanceof HTMLElement) {
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
   * Extract NYT data from window
   * @returns {{ sprinkledBody?: { content?: import("./types/nytimes").NYTBlock[] } } | null}
   */
  function getArticleData() {
    const data = /** @type {Record<string, import("./types/nytimes").NYTData | undefined>} */ (
      /** @type {unknown} */ (window)
    )['__preloadedData'];
    if (!data || !data.initialData || !data.initialData.data) {
      return null;
    }
    const article = data.initialData.data.article;
    if (!article || !article.sprinkledBody || !article.sprinkledBody.content) {
      return null;
    }
    return article;
  }

  /**
   * Format a single inline block of text
   * @param {import("./types/nytimes").NYTInline} inline
   * @returns {{ text: string, html: string }}
   */
  function formatInlineText(inline) {
    if (inline.__typename !== 'TextInline') {
      return { text: '', html: '' };
    }
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
    return { text: inline.text || '', html: t };
  }

  /**
   * Process and extract new paragraphs from sprinkledBody
   * @param {import("./types/nytimes").NYTBlock[]} content
   * @param {Set<string>} existingTexts
   * @returns {string[]}
   */
  function extractNewParagraphs(content, existingTexts) {
    const newParagraphs = [];
    for (const block of content) {
      if (block.__typename !== 'ParagraphBlock' || !block.content) {
        continue;
      }

      let text = '';
      let html = '';
      for (const inline of block.content) {
        const fmt = formatInlineText(inline);
        text += fmt.text;
        html += fmt.html;
      }

      text = text.trim();
      if (text && !existingTexts.has(text)) {
        newParagraphs.push(html);
        existingTexts.add(text);
      }
    }
    return newParagraphs;
  }

  /**
   * Insert extracted paragraphs into the companion column
   * @param {string[]} newParagraphs
   * @param {Element} articleBody
   */
  function insertNewParagraphs(newParagraphs, articleBody) {
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
  }

  /**
   * Restore full article from __preloadedData.sprinkledBody.content
   */
  let restored = false;
  function restoreArticle() {
    if (restored) {
      return;
    }

    const article = getArticleData();
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
      const t = /** @type {string} */ (p.textContent).trim();
      if (t) {
        existingTexts.add(t);
      }
    });

    const newParagraphs = extractNewParagraphs(article.sprinkledBody.content, existingTexts);
    insertNewParagraphs(newParagraphs, articleBody);

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
    const observer = new MutationObserver((mutations) => {
      if (typeof document === 'undefined' || !document) {
        return;
      }
      let hasAdded = false;
      for (let i = 0; i < mutations.length; i++) {
        if (mutations[i].addedNodes.length > 0) {
          hasAdded = true;
          break;
        }
      }
      if (!hasAdded) {
        return;
      }
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
