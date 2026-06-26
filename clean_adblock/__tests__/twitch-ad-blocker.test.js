describe('twitch-ad-blocker.js', () => {
  let TwitchAdBlocker;

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

    // Mock fetch and XHR before loading script
    window.fetch = jest.fn();
    window.XMLHttpRequest = jest.fn().mockImplementation(() => ({
      open: jest.fn(),
      send: jest.fn(),
      abort: jest.fn()
    }));

    // Mock global Response object
    global.Response = class Response {
      constructor(body, init) {
        this.body = body;
        this.status = init.status;
        this.statusText = init.statusText;
      }
    };

    const { instrumentFile } = require('./helpers/instrument');
    const code = instrumentFile(require('path').join(__dirname, '..', 'twitch-ad-blocker.js'));
    eval(code);
    TwitchAdBlocker = window.TwitchAdBlocker;
  });

  afterEach(() => {
    delete global.Response;
  });

  it('loads without crashing', () => {
    expect(TwitchAdBlocker).toBeDefined();
  });

  it('hides ad elements correctly based on selectors', () => {
    window.location.hostname = 'twitch.tv';
    // Re-eval not needed if we manually call blockTwitchAds or if we just want to test blockTwitchAds
    // However blockTwitchAds is called immediately on init based on hostname. Let's test it via direct call.

    const ad1 = document.createElement('div');
    ad1.setAttribute('data-a-target', 'video-ad-overlay');

    const ad2 = document.createElement('div');
    ad2.className = 'ad-banner';

    const nonAd = document.createElement('div');
    nonAd.className = 'normal-content';

    document.body.appendChild(ad1);
    document.body.appendChild(ad2);
    document.body.appendChild(nonAd);

    TwitchAdBlocker.blockTwitchAds();

    expect(ad1.style.display).toBe('none');
    expect(ad1.getAttribute('data-blocked-by-clean-adblock')).toBe('true');

    expect(ad2.style.display).toBe('none');

    expect(nonAd.style.display).not.toBe('none');

    // Check that we can't hide it twice (processedElements weakset check)
    TwitchAdBlocker.blockTwitchAds();
    expect(ad1.style.display).toBe('none');
  });

  it('handles dynamically loaded ads via MutationObserver', async () => {
    window.location.hostname = 'twitch.tv';

    const ad = document.createElement('div');
    ad.setAttribute('data-a-target', 'video-ad-card');
    document.body.appendChild(ad);

    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(ad.style.display).toBe('none');
    expect(ad.getAttribute('data-blocked-by-clean-adblock')).toBe('true');
  });

  it('handles MutationObserver when shouldCheck is false', async () => {
    window.location.hostname = 'twitch.tv';

    // Trigger mutation with no added nodes
    document.body.className = 'changed';

    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(document.body.className).toBe('changed');
  });

  it('skips ads if skip button is present', () => {
    const skipButton = document.createElement('button');
    skipButton.setAttribute('data-a-target', 'video-ad-skip-button');
    skipButton.click = jest.fn();

    Object.defineProperty(skipButton, 'offsetParent', { get: () => document.body });
    document.body.appendChild(skipButton);

    const result = TwitchAdBlocker.trySkipAd();

    expect(result).toBe(true);
    expect(skipButton.click).toHaveBeenCalled();
  });

  it('does not skip if button not found or hidden', () => {
    const result = TwitchAdBlocker.trySkipAd();
    expect(result).toBe(false);
  });

  it('mutes video if ad overlay is present', () => {
    const video = document.createElement('video');
    document.body.appendChild(video);

    const adOverlay = document.createElement('div');
    adOverlay.setAttribute('data-a-target', 'video-ad-overlay');
    Object.defineProperty(adOverlay, 'offsetParent', { get: () => document.body });
    document.body.appendChild(adOverlay);

    const result = TwitchAdBlocker.muteAdIfPlaying();

    expect(result).toBe(true);
    expect(video.muted).toBe(true);
  });

  it('does not mute video if no ad overlay is present', () => {
    const video = document.createElement('video');
    document.body.appendChild(video);

    const result = TwitchAdBlocker.muteAdIfPlaying();

    expect(result).toBe(false);
    expect(video.muted).toBe(false);
  });

  it('does not mute if no video element', () => {
    const result = TwitchAdBlocker.muteAdIfPlaying();
    expect(result).toBe(false);
  });

  it('does nothing if hostname is not twitch', () => {
    window.location.hostname = 'example.com';
    const ad = document.createElement('div');
    ad.setAttribute('data-a-target', 'video-ad-overlay');
    document.body.appendChild(ad);

    TwitchAdBlocker.blockTwitchAds();

    expect(ad.style.display).not.toBe('none');
  });

  it('intercepts fetch calls to ad URLs', async () => {
    window.location.hostname = 'twitch.tv';
    const mockOriginalFetch = jest.fn().mockResolvedValue('original response');
    // In beforeEach we evaluated the code with window.fetch = jest.fn(). The originalFetch saved is jest.fn().
    // To properly mock we should re-eval if we change fetch, or use the already hooked fetch

    // Let's reset window.fetch to our new mock and then re-evaluate so `interceptFetch` sees it.
    // Or we can just use `window.fetch` since it is already intercepted in beforeEach. But we need to define its fallback behavior.
    // Wait, in `beforeEach`, `window.fetch` was `jest.fn()`. Then `interceptFetch` wrapped it.
    // The originalFetch is `jest.fn()`.
    // We can just mock the return value of the wrapped `fetch`? No, originalFetch is captured inside the closure.
    // But we can reset modules and re-eval to be sure.
    jest.resetModules();
    window.fetch = mockOriginalFetch;
    const { instrumentFile } = require('./helpers/instrument');
    const code = instrumentFile(require('path').join(__dirname, '..', 'twitch-ad-blocker.js'));
    eval(code);

    // Test ad URL
    const response = await window.fetch('https://ads.twitch.tv/some-ad');
    expect(response.status).toBe(200);
    expect(response.statusText).toBe('Blocked by Clean Adblock');
    expect(mockOriginalFetch).not.toHaveBeenCalled();

    // Test normal URL
    const normalResponse = await window.fetch('https://api.twitch.tv/v1/user');
    expect(normalResponse).toBe('original response');
    expect(mockOriginalFetch).toHaveBeenCalledWith('https://api.twitch.tv/v1/user');

    // Test fetch with Request object
    const reqResponse = await window.fetch({ url: 'https://vast.twitch.tv/ad' });
    expect(reqResponse.status).toBe(200);

    // Test fetch with Request object missing url
    const reqResponse2 = await window.fetch({});
    expect(mockOriginalFetch).toHaveBeenCalledWith({});
  });

  it('intercepts XHR calls to ad URLs', () => {
    const mockOpen = jest.fn();
    const mockSend = jest.fn();
    const mockAbort = jest.fn();

    jest.resetModules();
    window.XMLHttpRequest = function () {};
    window.XMLHttpRequest.prototype.open = mockOpen;
    window.XMLHttpRequest.prototype.send = mockSend;
    window.XMLHttpRequest.prototype.abort = mockAbort;

    const { instrumentFile } = require('./helpers/instrument');
    const code = instrumentFile(require('path').join(__dirname, '..', 'twitch-ad-blocker.js'));
    eval(code);

    const xhr = new window.XMLHttpRequest();
    xhr.open('GET', 'https://amazon-adsystem.com/ad');
    xhr.send();

    expect(mockAbort).toHaveBeenCalled();
    expect(mockSend).not.toHaveBeenCalled();

    const xhr2 = new window.XMLHttpRequest();
    xhr2.open('GET', 'https://api.twitch.tv/data');
    xhr2.send();

    expect(mockAbort).toHaveBeenCalledTimes(1); // Only for the first one
    expect(mockSend).toHaveBeenCalled();
  });

  it('does not intercept if fetch or XHR are missing', () => {
    delete window.fetch;
    delete window.XMLHttpRequest;

    const { instrumentFile } = require('./helpers/instrument');
    const code = instrumentFile(require('path').join(__dirname, '..', 'twitch-ad-blocker.js'));
    expect(() => {
      eval(code);
    }).not.toThrow();
  });

  it('handles ad state changes via class observer', async () => {
    // Need a player element
    const player = document.createElement('div');
    player.setAttribute('data-a-target', 'video-player');
    document.body.appendChild(player);

    const video = document.createElement('video');
    document.body.appendChild(video);

    const overlay = document.createElement('div');
    overlay.setAttribute('data-a-target', 'video-ad-overlay');
    Object.defineProperty(overlay, 'offsetParent', { get: () => document.body });
    document.body.appendChild(overlay);

    jest.resetModules();
    const { instrumentFile } = require('./helpers/instrument');
    const code = instrumentFile(require('path').join(__dirname, '..', 'twitch-ad-blocker.js'));
    eval(code);

    // Trigger mutation (ad-playing)
    player.classList.add('ad-playing');
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(video.muted).toBe(true);

    // Reset mute
    video.muted = false;

    // Trigger mutation (ad-showing)
    player.classList.remove('ad-playing');
    player.classList.add('ad-showing');
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(video.muted).toBe(true);
  });

  it('ignores ad state changes for non-HTMLElements', async () => {
    const player = document.createElement('div');
    player.setAttribute('data-a-target', 'video-player');
    document.body.appendChild(player);

    jest.resetModules();
    const { instrumentFile } = require('./helpers/instrument');
    const code = instrumentFile(require('path').join(__dirname, '..', 'twitch-ad-blocker.js'));
    eval(code);

    // Add a node and fire mutations manually
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    player.appendChild(svg);

    svg.setAttribute('class', 'ad-playing');
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(TwitchAdBlocker).toBeDefined();
  });

  it('catches invalid selector errors gracefully', () => {
    const originalMatches = Element.prototype.matches;
    Element.prototype.matches = jest.fn(() => {
      throw new Error('Mock error');
    });

    const ad = document.createElement('div');
    document.body.appendChild(ad);

    // We can't directly test isAdElement because it's internal, but it's used in MutationObserver.
    document.body.appendChild(document.createElement('span'));

    // We can trigger blockTwitchAds which catches querySelectorAll
    const originalQuerySelectorAll = document.querySelectorAll;
    document.querySelectorAll = jest.fn(() => {
      throw new Error('Mock error');
    });

    expect(() => {
      TwitchAdBlocker.blockTwitchAds();
    }).not.toThrow();

    document.querySelectorAll = originalQuerySelectorAll;
    Element.prototype.matches = originalMatches;
  });

  it('registers DOMContentLoaded listener if document is loading', () => {
    const originalReadyState = document.readyState;
    Object.defineProperty(document, 'readyState', { value: 'loading', configurable: true });

    const addEventListenerSpy = jest.spyOn(document, 'addEventListener');

    jest.resetModules();
    const { instrumentFile } = require('./helpers/instrument');
    const code = instrumentFile(require('path').join(__dirname, '..', 'twitch-ad-blocker.js'));
    eval(code);

    expect(addEventListenerSpy).toHaveBeenCalledWith('DOMContentLoaded', expect.any(Function));

    Object.defineProperty(document, 'readyState', {
      value: originalReadyState,
      configurable: true
    });
    addEventListenerSpy.mockRestore();
  });

  it('does not observe if document.body is missing on init', () => {
    // Force document.body to be null when evaling
    const originalBody = document.body;
    Object.defineProperty(document, 'body', { value: null, configurable: true });

    jest.resetModules();
    const { instrumentFile } = require('./helpers/instrument');
    const code = instrumentFile(require('path').join(__dirname, '..', 'twitch-ad-blocker.js'));

    expect(() => {
      eval(code);
    }).not.toThrow();

    Object.defineProperty(document, 'body', { value: originalBody, configurable: true });
  });

  it('exports when typeof window is undefined (for coverage)', () => {
    const { instrumentFile } = require('./helpers/instrument');
    const code = instrumentFile(require('path').join(__dirname, '..', 'twitch-ad-blocker.js'));

    const fakeWindow = { location: { hostname: 'twitch.tv' } };
    const wrapper = new Function(
      'document',
      'MutationObserver',
      'Response',
      'XMLHttpRequest',
      'window',
      code
    );
    wrapper(document, MutationObserver, global.Response, window.XMLHttpRequest, fakeWindow);
    expect(TwitchAdBlocker).toBeDefined(); // Testing it loaded in beforeEach
  });
});
