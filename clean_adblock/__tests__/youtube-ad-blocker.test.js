describe('youtube-ad-blocker.js', () => {
  let YouTubeAdBlocker;

  beforeEach(() => {
    delete window.location;
    window.location = {
      hostname: 'youtube.com',
      pathname: '/',
      href: 'https://youtube.com/',
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
    const code = instrumentFile(require('path').join(__dirname, '..', 'youtube-ad-blocker.js'));
    eval(code);
    YouTubeAdBlocker = window.YouTubeAdBlocker;
  }

  it('loads without crashing', () => {
    evalScript();
    expect(YouTubeAdBlocker).toBeDefined();
  });

  it('hides ad elements correctly based on class and attribute patterns', () => {
    evalScript();
    const ad1 = document.createElement('div');
    ad1.className = 'ad-showing';

    const ad2 = document.createElement('div');
    ad2.setAttribute('data-ad-impressions', 'true');
    const nonAd = document.createElement('div');
    nonAd.className = 'normal-content';

    document.body.appendChild(ad1);
    document.body.appendChild(ad2);
    document.body.appendChild(nonAd);

    YouTubeAdBlocker.blockYouTubeAds();

    expect(ad1.style.display).toBe('none');
    expect(ad1.getAttribute('data-blocked-by-clean-adblock')).toBe('true');

    expect(nonAd.style.display).not.toBe('none');
  });

  it('handles dynamically loaded ads via MutationObserver based on attributes', async () => {
    evalScript();
    const ad2 = document.createElement('div');
    ad2.setAttribute('data-ad-impressions', 'true');
    document.body.appendChild(ad2);

    // Wait for microtasks
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(ad2.style.display).toBe('none');
    expect(ad2.getAttribute('data-blocked-by-clean-adblock')).toBe('true');
  });

  it('handles dynamically loaded ads via MutationObserver based on AD_SELECTORS', async () => {
    evalScript();
    const ad = document.createElement('ytd-ad-slot-renderer');
    document.body.appendChild(ad);

    // Wait for microtasks
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(ad.style.display).toBe('none');
    expect(ad.getAttribute('data-blocked-by-clean-adblock')).toBe('true');
  });

  it('hides parent ad containers', () => {
    evalScript();
    const container = document.createElement('div');
    container.className = 'video-ads';
    const ad = document.createElement('div');
    ad.className = 'ytp-ad-overlay-container';
    container.appendChild(ad);
    document.body.appendChild(container);

    // This will process `ad` and also its `parentAd` (container)
    YouTubeAdBlocker.blockYouTubeAds();

    expect(ad.style.display).toBe('none');
    expect(container.style.display).toBe('none');
  });

  it('hides parent ad containers from within observer', async () => {
    evalScript();
    const container = document.createElement('div');
    container.className = 'video-ads';
    document.body.appendChild(container);

    const ad = document.createElement('div');
    ad.className = 'ytp-ad-overlay-container';
    container.appendChild(ad);

    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(ad.style.display).toBe('none');
    expect(container.style.display).toBe('none');
  });

  it('skips processing if ad element already processed', () => {
    evalScript();
    const container = document.createElement('div');
    container.className = 'video-ads';

    const ad = document.createElement('div');
    ad.className = 'ytp-ad-overlay-container';
    container.appendChild(ad);
    document.body.appendChild(container);

    YouTubeAdBlocker.blockYouTubeAds();
    expect(ad.style.display).toBe('none');
    expect(container.style.display).toBe('none');

    // Call again to hit the early return and parent processed checks
    const result = YouTubeAdBlocker.blockYouTubeAds();
    expect(result).toBeUndefined();
  });

  it('skips ads if skip button is present', () => {
    evalScript();
    const skipButton = document.createElement('button');
    skipButton.className = 'ytp-ad-skip-button';
    skipButton.click = jest.fn();

    // Mock offsetParent so it's considered visible
    Object.defineProperty(skipButton, 'offsetParent', { get: () => document.body });
    document.body.appendChild(skipButton);

    const result = YouTubeAdBlocker.skipAdIfPlaying();

    expect(result).toBe(true);
    expect(skipButton.click).toHaveBeenCalled();
  });

  it('mutes video if ad is playing', () => {
    evalScript();
    const video = document.createElement('video');
    const adContainer = document.createElement('div');
    adContainer.className = 'ad-showing';

    document.body.appendChild(video);
    document.body.appendChild(adContainer);

    const result = YouTubeAdBlocker.muteAdIfPlaying();

    expect(result).toBe(true);
    expect(video.muted).toBe(true);
  });

  it('does not mute video if ad is not playing', () => {
    evalScript();
    const video = document.createElement('video');
    document.body.appendChild(video);

    const result = YouTubeAdBlocker.muteAdIfPlaying();

    expect(result).toBe(false);
    expect(video.muted).toBe(false);
  });

  it('does nothing if hostname is not youtube', () => {
    window.location.hostname = 'example.com';
    evalScript();
    const ad = document.createElement('div');
    ad.className = 'ad-showing';
    document.body.appendChild(ad);

    YouTubeAdBlocker.blockYouTubeAds();

    expect(ad.style.display).not.toBe('none');
  });

  it('handles dynamically loaded ads via MutationObserver', async () => {
    evalScript();
    const ad = document.createElement('div');
    ad.className = 'ad-showing';
    document.body.appendChild(ad);

    // Wait for microtasks
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(ad.style.display).toBe('none');
  });

  it('skips and mutes via class observer when ad starts playing', async () => {
    const video = document.createElement('video');
    const container = document.createElement('div');
    container.appendChild(video);
    document.body.appendChild(container);

    evalScript();

    const skipButton = document.createElement('button');
    skipButton.className = 'ytp-ad-skip-button';
    skipButton.click = jest.fn();
    Object.defineProperty(skipButton, 'offsetParent', { get: () => document.body });
    document.body.appendChild(skipButton);

    // Trigger mutation
    container.className = 'ad-showing';

    // Wait for microtasks
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(video.muted).toBe(true);
    expect(skipButton.click).toHaveBeenCalled();
  });

  it('catches invalid selector errors gracefully', () => {
    evalScript();
    const originalMatches = Element.prototype.matches;
    Element.prototype.matches = jest.fn(() => {
      throw new Error('Mock error');
    });

    const ad = document.createElement('div');
    document.body.appendChild(ad);

    // Should not throw
    expect(() => {
      YouTubeAdBlocker.blockYouTubeAds();
    }).not.toThrow();

    Element.prototype.matches = originalMatches;

    const originalQuerySelectorAll = document.querySelectorAll;
    document.querySelectorAll = jest.fn(() => {
      throw new Error('Mock error');
    });

    expect(() => {
      YouTubeAdBlocker.blockYouTubeAds();
    }).not.toThrow();

    document.querySelectorAll = originalQuerySelectorAll;
  });

  it('registers DOMContentLoaded listener if document is loading', () => {
    // Need to mock document.readyState and addEventListener
    const originalReadyState = document.readyState;
    Object.defineProperty(document, 'readyState', { value: 'loading', configurable: true });

    const addEventListenerSpy = jest.spyOn(document, 'addEventListener');

    evalScript();

    expect(addEventListenerSpy).toHaveBeenCalledWith('DOMContentLoaded', expect.any(Function));

    // cleanup
    Object.defineProperty(document, 'readyState', {
      value: originalReadyState,
      configurable: true
    });
    addEventListenerSpy.mockRestore();
  });
});
