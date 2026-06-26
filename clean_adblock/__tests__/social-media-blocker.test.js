describe('social-media-blocker.js', () => {
  let SocialMediaBlocker;

  beforeEach(() => {
    delete window.location;
    window.location = {
      hostname: 'example.com',
      pathname: '/',
      href: 'https://example.com/',
      search: '',
      protocol: 'https:',
      assign: jest.fn(),
      replace: jest.fn(),
      reload: jest.fn()
    };
    jest.resetModules();
    jest.clearAllMocks();
    document.body.innerHTML = '';
  });

  function evalScript() {
    const { instrumentFile } = require('./helpers/instrument');
    const code = instrumentFile(require('path').join(__dirname, '..', 'social-media-blocker.js'));
    eval(code);
    SocialMediaBlocker = window.SocialMediaBlocker;
  }

  it('loads without crashing', () => {
    evalScript();
    expect(SocialMediaBlocker).toBeDefined();
  });

  it('detects platform based on hostname', () => {
    evalScript();
    window.location.hostname = 'www.facebook.com';
    expect(SocialMediaBlocker.detectPlatform()).toBe('facebook');

    window.location.hostname = 'instagram.com';
    expect(SocialMediaBlocker.detectPlatform()).toBe('instagram');

    window.location.hostname = 'old.reddit.com';
    expect(SocialMediaBlocker.detectPlatform()).toBe('reddit');

    window.location.hostname = 'pinterest.com';
    expect(SocialMediaBlocker.detectPlatform()).toBe('pinterest');

    window.location.hostname = 'unknown-site.com';
    expect(SocialMediaBlocker.detectPlatform()).toBeNull();
  });

  it('finds and hides sponsored content by selector', () => {
    window.location.hostname = 'facebook.com';
    evalScript();

    const ad1 = document.createElement('div');
    ad1.setAttribute('data-ad-preview', 'true');
    // Ensure visibility
    Object.defineProperty(window, 'getComputedStyle', {
      value: () => ({
        display: 'block',
        visibility: 'visible',
        opacity: '1'
      })
    });

    const nonAd = document.createElement('div');
    nonAd.className = 'normal';

    document.body.appendChild(ad1);
    document.body.appendChild(nonAd);

    // Call finding manually
    const found = SocialMediaBlocker.findSponsoredContent();
    expect(found.length).toBe(1);
    expect(found[0]).toBe(ad1);

    // Call block
    SocialMediaBlocker.hideElement(ad1);

    expect(ad1.style.display).toBe('none');
    expect(ad1.getAttribute('data-blocked-by-clean-adblock')).toBe('true');
  });

  it('handles dynamically loaded content via MutationObserver', async () => {
    window.location.hostname = 'facebook.com';
    evalScript();

    Object.defineProperty(window, 'getComputedStyle', {
      value: () => ({
        display: 'block',
        visibility: 'visible',
        opacity: '1'
      })
    });

    const ad = document.createElement('div');
    ad.setAttribute('data-ad-preview', 'true');
    document.body.appendChild(ad);

    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(ad.style.display).toBe('none');
  });

  it('finds sponsored content by text pattern using TreeWalker', () => {
    window.location.hostname = 'instagram.com';
    evalScript();

    Object.defineProperty(window, 'getComputedStyle', {
      value: () => ({
        display: 'block',
        visibility: 'visible',
        opacity: '1'
      })
    });

    const article = document.createElement('article');
    const label = document.createElement('div');
    label.textContent = 'Sponsored';
    article.appendChild(label);

    document.body.appendChild(article);

    const found = SocialMediaBlocker.findSponsoredContent();
    expect(found.length).toBe(1);
    expect(found[0]).toBe(article);
  });

  it('finds sponsored content without closest article fallback', () => {
    window.location.hostname = 'instagram.com';
    evalScript();

    Object.defineProperty(window, 'getComputedStyle', {
      value: () => ({
        display: 'block',
        visibility: 'visible',
        opacity: '1'
      })
    });

    // Provide an element that has 'Sponsored' but no closest article, role=article or data-testid
    const wrapper = document.createElement('div');
    const label = document.createElement('div');
    label.textContent = 'Sponsored';
    wrapper.appendChild(label);
    document.body.appendChild(wrapper);

    const found = SocialMediaBlocker.findSponsoredContent();
    expect(found.length).toBe(1);
    // The label is accepted, and its closest post returns the label itself (since none of the other selectors match)
    expect(found[0]).toBe(label);
  });

  it('skips non-Element nodes in walker', () => {
    window.location.hostname = 'instagram.com';
    evalScript();

    Object.defineProperty(window, 'getComputedStyle', {
      value: () => ({
        display: 'block',
        visibility: 'visible',
        opacity: '1'
      })
    });

    const wrapper = document.createElement('div');
    const label = document.createElement('div');
    label.textContent = 'Sponsored';
    wrapper.appendChild(label);
    document.body.appendChild(wrapper);

    // Override walker so it returns a text node
    const originalCreateTreeWalker = document.createTreeWalker;
    document.createTreeWalker = jest.fn(() => ({
      nextNode: jest
        .fn()
        .mockReturnValueOnce(document.createTextNode('Sponsored'))
        .mockReturnValueOnce(null)
    }));

    const found = SocialMediaBlocker.findSponsoredContent();
    expect(found.length).toBe(0);

    document.createTreeWalker = originalCreateTreeWalker;
  });

  it('handles processed elements correctly in TreeWalker', () => {
    window.location.hostname = 'instagram.com';
    evalScript();

    Object.defineProperty(window, 'getComputedStyle', {
      value: () => ({
        display: 'block',
        visibility: 'visible',
        opacity: '1'
      })
    });

    const article = document.createElement('article');
    const label = document.createElement('div');
    label.textContent = 'Sponsored';
    article.appendChild(label);

    document.body.appendChild(article);

    // Mark as processed manually by calling findSponsoredContent once
    const found = SocialMediaBlocker.findSponsoredContent();
    expect(found.length).toBe(1);

    // Second time it should not find the same elements because they are processed!
    const foundAgain = SocialMediaBlocker.findSponsoredContent();
    expect(foundAgain.length).toBe(0); // Should be filtered out

    // Also test tree walker direct text false condition (nodeType text but not matching pattern)
    const article2 = document.createElement('article');
    const label2 = document.createElement('div');
    label2.textContent = 'Not an Ad';
    article2.appendChild(label2);
    document.body.appendChild(article2);

    const found3 = SocialMediaBlocker.findSponsoredContent();
    expect(found3.length).toBe(0);
  });

  it('skips finding if element is not visible', () => {
    window.location.hostname = 'facebook.com';
    evalScript();

    Object.defineProperty(window, 'getComputedStyle', {
      value: () => ({
        display: 'none',
        visibility: 'hidden',
        opacity: '0'
      })
    });

    const ad = document.createElement('div');
    ad.setAttribute('data-ad-preview', 'true');
    document.body.appendChild(ad);

    const found = SocialMediaBlocker.findSponsoredContent();
    expect(found.length).toBe(0);

    // Also test tree walker visibility
    window.location.hostname = 'instagram.com';
    const article = document.createElement('article');
    const label = document.createElement('div');
    label.textContent = 'Sponsored';
    article.appendChild(label);
    document.body.appendChild(article);

    const found2 = SocialMediaBlocker.findSponsoredContent();
    expect(found2.length).toBe(0);

    // Test null element in isVisible logic
    const originalQuerySelectorAll = document.querySelectorAll;
    document.querySelectorAll = jest.fn(() => [null]);
    const found3 = SocialMediaBlocker.findSponsoredContent();
    expect(found3.length).toBe(0);
    document.querySelectorAll = originalQuerySelectorAll;
  });

  it('does nothing if platform is not matched', () => {
    window.location.hostname = 'example.com';
    evalScript();

    const found = SocialMediaBlocker.findSponsoredContent();
    expect(found.length).toBe(0);
  });

  it('catches invalid selector errors gracefully', () => {
    window.location.hostname = 'facebook.com';
    evalScript();
    const originalQuerySelectorAll = document.querySelectorAll;
    document.querySelectorAll = jest.fn(() => {
      throw new Error('Mock error');
    });

    expect(() => {
      SocialMediaBlocker.findSponsoredContent();
    }).not.toThrow();

    document.querySelectorAll = originalQuerySelectorAll;
  });

  it('registers DOMContentLoaded listener if document is loading', () => {
    const originalReadyState = document.readyState;
    Object.defineProperty(document, 'readyState', { value: 'loading', configurable: true });

    const addEventListenerSpy = jest.spyOn(document, 'addEventListener');

    evalScript();

    expect(addEventListenerSpy).toHaveBeenCalledWith('DOMContentLoaded', expect.any(Function));

    Object.defineProperty(document, 'readyState', {
      value: originalReadyState,
      configurable: true
    });
    addEventListenerSpy.mockRestore();
  });

  it('handles MutationObserver when shouldCheck is false', async () => {
    window.location.hostname = 'facebook.com';
    evalScript();

    // Trigger mutation with no added nodes to cover `if (mutation.addedNodes.length > 0)` false branch
    document.body.className = 'changed';

    await new Promise((resolve) => setTimeout(resolve, 0));
  });

  it('skips missing text content gracefully', () => {
    // test empty text content matching
    window.location.hostname = 'instagram.com';
    evalScript();

    Object.defineProperty(window, 'getComputedStyle', {
      value: () => ({
        display: 'block',
        visibility: 'visible',
        opacity: '1'
      })
    });

    const article = document.createElement('article');
    const label = document.createElement('div');

    // We inject an element with an overridden textContent to simulate missing/empty text Content in tree walker
    Object.defineProperty(label, 'textContent', { get: () => undefined });
    article.appendChild(label);
    document.body.appendChild(article);

    const found = SocialMediaBlocker.findSponsoredContent();
    expect(found.length).toBe(0);
  });

  it('does not observe if document.body is missing on init', () => {
    // Force document.body to be null when evaling
    const originalBody = document.body;
    Object.defineProperty(document, 'body', { value: null, configurable: true });

    expect(() => {
      evalScript();
    }).not.toThrow();

    Object.defineProperty(document, 'body', { value: originalBody, configurable: true });
  });
});
