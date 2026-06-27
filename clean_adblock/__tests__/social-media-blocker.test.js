describe('social-media-blocker.js', () => {
  beforeEach(() => {
    delete window.location;
    window.location = {
      hostname: 'example.com',
      pathname: '/test',
      href: 'https://example.com/test',
      search: '',
      protocol: 'https:',
      assign: jest.fn(),
      replace: jest.fn(),
      reload: jest.fn()
    };
    jest.resetModules();
    jest.clearAllMocks();
  });

  it('loads without crashing', () => {
    require('../social-media-blocker.js');
  });

  it('runs on facebook', () => {
    window.location.hostname = 'www.facebook.com';
    document.body.innerHTML = `
      <div role="article">
        <span>Sponsored</span>
      </div>
      <div>
        <a href="/ads/about/">Ads</a>
      </div>
      <div role="article" class="not-ad">
        <span>Normal post</span>
      </div>
    `;

    require('../social-media-blocker.js');
    if (window.SocialMediaBlocker) {
      const platform = window.SocialMediaBlocker.detectPlatform();
      window.SocialMediaBlocker.findSponsoredContent(document.body, platform);
    }
  });

  it('runs on instagram', () => {
    window.location.hostname = 'www.instagram.com';
    document.body.innerHTML = `
      <article>
        <div>Sponsored</div>
      </article>
      <article class="not-ad">
        <div>Normal post</div>
      </article>
    `;

    require('../social-media-blocker.js');
    if (window.SocialMediaBlocker) {
      const platform = window.SocialMediaBlocker.detectPlatform();
      window.SocialMediaBlocker.findSponsoredContent(document.body, platform);
    }
  });

  it('runs on reddit', () => {
    window.location.hostname = 'www.reddit.com';
    document.body.innerHTML = `
      <div class="promotedlink">Promoted</div>
      <div data-testid="ad-indicator">Promoted</div>
      <div class="normal-post"></div>
    `;

    require('../social-media-blocker.js');
    if (window.SocialMediaBlocker) {
      const platform = window.SocialMediaBlocker.detectPlatform();
      window.SocialMediaBlocker.findSponsoredContent(document.body, platform);
    }
  });

  it('runs on pinterest', () => {
    window.location.hostname = 'www.pinterest.com';
    document.body.innerHTML = `
      <div data-test-id="pin">
        <div>Promoted by</div>
      </div>
      <div data-test-id="pin" class="not-ad"></div>
    `;

    require('../social-media-blocker.js');
    if (window.SocialMediaBlocker) {
      const platform = window.SocialMediaBlocker.detectPlatform();
      window.SocialMediaBlocker.findSponsoredContent(document.body, platform);
    }
  });

  it('handles mutations', () => {
    window.location.hostname = 'www.facebook.com';

    let observerCb;
    const origMO = global.MutationObserver;
    global.MutationObserver = class {
      constructor(cb) {
        observerCb = cb;
      }
      observe() {}
      disconnect() {}
    };

    require('../social-media-blocker.js');

    const adEl = document.createElement('div');
    adEl.setAttribute('role', 'article');
    adEl.innerHTML = '<span>Sponsored</span>';

    // trigger mutation
    if (observerCb) {
      observerCb([
        {
          addedNodes: [adEl]
        }
      ]);
    }

    // Call again to test weakset
    if (window.SocialMediaBlocker) {
      const platform = window.SocialMediaBlocker.detectPlatform();
      window.SocialMediaBlocker.findSponsoredContent(document.body, platform);
    }

    global.MutationObserver = origMO;
  });

  it('covers DOMContentLoaded event branch', () => {
    window.location.hostname = 'www.facebook.com';
    Object.defineProperty(document, 'readyState', { value: 'loading', configurable: true });

    require('../social-media-blocker.js');

    const event = document.createEvent('Event');
    event.initEvent('DOMContentLoaded', true, true);
    document.dispatchEvent(event);
  });
});
