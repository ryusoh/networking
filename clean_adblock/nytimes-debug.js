/**
 * NYTimes Scroll Debug (MAIN world)
 * Logs all elements that could be blocking scroll.
 * Load this temporarily to diagnose the issue.
 */
(function () {
  'use strict';
  if (!window.location.hostname.endsWith('nytimes.com')) return;

  function debugScroll() {
    console.log('=== NYT SCROLL DEBUG ===');

    // 1. Check body and html
    for (const el of [document.documentElement, document.body]) {
      const s = window.getComputedStyle(el);
      console.log(`<${el.tagName}>:`, {
        overflow: s.overflow,
        overflowY: s.overflowY,
        position: s.position,
        height: s.height,
        maxHeight: s.maxHeight,
        top: s.top,
        inlineStyle: el.getAttribute('style'),
        classes: el.className
      });
    }

    // 2. Check for inert elements
    const inerts = document.querySelectorAll('[inert]');
    console.log('Inert elements:', inerts.length);
    inerts.forEach((el) => console.log('  inert:', el.tagName, el.id, el.className));

    // 3. Check for fixed/absolute positioned overlays covering viewport
    const allEls = document.querySelectorAll('*');
    const blockers = [];
    for (const el of allEls) {
      const s = window.getComputedStyle(el);
      if ((s.position === 'fixed' || s.position === 'sticky') && s.display !== 'none' && s.visibility !== 'hidden') {
        const rect = el.getBoundingClientRect();
        if (rect.width > window.innerWidth * 0.5 && rect.height > window.innerHeight * 0.3) {
          blockers.push({
            tag: el.tagName,
            id: el.id,
            class: el.className.substring(0, 80),
            position: s.position,
            zIndex: s.zIndex,
            width: rect.width,
            height: rect.height,
            pointerEvents: s.pointerEvents,
            overflow: s.overflow
          });
        }
      }
    }
    console.log('Large fixed/sticky overlays:', blockers.length);
    blockers.forEach((b) => console.log('  blocker:', b));

    // 4. Check for elements with pointer-events: none or all that cover page
    const gateway = document.querySelector('#gateway-content, [data-testid="onsite-messaging-unit-gateway"]');
    if (gateway) {
      const gs = window.getComputedStyle(gateway);
      console.log('Gateway found:', {
        display: gs.display,
        visibility: gs.visibility,
        position: gs.position,
        zIndex: gs.zIndex
      });
    } else {
      console.log('Gateway: not found');
    }

    // 5. Check scrim
    const scrims = document.querySelectorAll('.css-gx5sib');
    console.log('Scrim elements (.css-gx5sib):', scrims.length);
    scrims.forEach((el) => {
      const s = window.getComputedStyle(el);
      console.log('  scrim:', { display: s.display, position: s.position, zIndex: s.zIndex, height: s.height });
    });

    // 6. Check if article body or its ancestors have overflow hidden
    const articleBody = document.querySelector('section[name="articleBody"], section.meteredContent');
    if (articleBody) {
      let current = articleBody;
      console.log('Article body ancestor chain:');
      while (current && current !== document.documentElement) {
        const s = window.getComputedStyle(current);
        if (s.overflow === 'hidden' || s.overflowY === 'hidden' || s.maxHeight !== 'none' || s.position === 'fixed') {
          console.log('  BLOCKING:', current.tagName, current.id, current.className.substring(0, 60), {
            overflow: s.overflow,
            overflowY: s.overflowY,
            maxHeight: s.maxHeight,
            height: s.height,
            position: s.position
          });
        }
        current = current.parentElement;
      }
    } else {
      console.log('Article body: not found');
    }

    // 7. Check document.body.scrollHeight vs clientHeight
    console.log('Scroll info:', {
      bodyScrollHeight: document.body.scrollHeight,
      bodyClientHeight: document.body.clientHeight,
      docScrollHeight: document.documentElement.scrollHeight,
      docClientHeight: document.documentElement.clientHeight,
      windowInnerHeight: window.innerHeight,
      scrollable: document.body.scrollHeight > window.innerHeight
    });

    console.log('=== END DEBUG ===');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(debugScroll, 2000));
  } else {
    setTimeout(debugScroll, 2000);
  }

  // Also run after 5s for late-loading elements
  setTimeout(debugScroll, 5000);
})();
