/**
 * NYTimes Unlocked (MAIN world)
 * Removes registration wall overlay so articles are readable.
 */
(function () {
  'use strict';

  if (!window.location.hostname.endsWith('nytimes.com')) return;

  function unlock() {
    // Remove gateway overlay
    document.querySelectorAll('#gateway-content, [data-testid="onsite-messaging-unit-gateway"]').forEach((el) => {
      el.style.setProperty('display', 'none', 'important');
    });

    // Remove inert attribute so page is interactive
    document.querySelectorAll('[inert]').forEach((el) => {
      el.removeAttribute('inert');
      el.removeAttribute('aria-hidden');
    });

    // Hide "Subscribe to The Times" CTA
    document.querySelectorAll('p a[href*="/subscribe"]').forEach((link) => {
      const p = link.closest('p');
      if (p && p.textContent.includes('Subscribe')) {
        p.style.setProperty('display', 'none', 'important');
      }
    });

    // Remove empty backdrop divs inside #story (gradient overlays)
    const story = document.getElementById('story');
    if (story) {
      story.querySelectorAll(':scope > div').forEach((div) => {
        if (div.children.length === 0 && div.textContent.trim() === '') {
          div.style.setProperty('display', 'none', 'important');
        }
      });
    }

    // Restore body scroll
    document.body && document.body.style.removeProperty('overflow');
    document.documentElement.style.removeProperty('overflow');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', unlock);
  } else {
    unlock();
  }

  setTimeout(unlock, 1000);
  setTimeout(unlock, 3000);

  const startObserver = () => {
    if (!document.body) { requestAnimationFrame(startObserver); return; }
    const observer = new MutationObserver(unlock);
    observer.observe(document.body, { childList: true, subtree: true });
  };
  startObserver();
})();
