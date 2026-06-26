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
  });

  afterEach(() => {
    delete global.Response;
  });

  function evalScript() {
    const { instrumentFile } = require('./helpers/instrument');
    const code = instrumentFile(require('path').join(__dirname, '..', 'twitch-ad-blocker.js'));
    eval(code);
    TwitchAdBlocker = window.TwitchAdBlocker;
  }

  it('loads without crashing', () => {
    evalScript();
    expect(TwitchAdBlocker).toBeDefined();
  });

  it('hides ad elements correctly based on selectors', () => {
    window.location.hostname = 'twitch.tv';
    evalScript();

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
    const result = TwitchAdBlocker.blockTwitchAds();
    // Since blockTwitchAds returns undefined we check nothing changed
    expect(ad1.style.display).toBe('none');
  });

  it('handles dynamically loaded ads via MutationObserver', async () => {
    window.location.hostname = 'twitch.tv';
    evalScript();

    const ad = document.createElement('div');
    ad.setAttribute('data-a-target', 'video-ad-card');
    document.body.appendChild(ad);

    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(ad.style.display).toBe('none');
    expect(ad.getAttribute('data-blocked-by-clean-adblock')).toBe('true');
  });

  it('skips ads if skip button is present', () => {
    evalScript();
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
    evalScript();
    const result = TwitchAdBlocker.trySkipAd();
    expect(result).toBe(false);
  });

  it('mutes video if ad overlay is present', () => {
    evalScript();
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
    evalScript();
    const video = document.createElement('video');
    document.body.appendChild(video);

    const result = TwitchAdBlocker.muteAdIfPlaying();

    expect(result).toBe(false);
    expect(video.muted).toBe(false);
  });

  it('does not mute if no video element', () => {
    evalScript();
    const result = TwitchAdBlocker.muteAdIfPlaying();
    expect(result).toBe(false);
  });

  it('does nothing if hostname is not twitch', () => {
    window.location.hostname = 'example.com';
    evalScript();
    const ad = document.createElement('div');
    ad.setAttribute('data-a-target', 'video-ad-overlay');
    document.body.appendChild(ad);

    TwitchAdBlocker.blockTwitchAds();

    expect(ad.style.display).not.toBe('none');
  });

  it('intercepts fetch calls to ad URLs', async () => {
    window.location.hostname = 'twitch.tv';
    const mockOriginalFetch = jest.fn().mockResolvedValue('original response');
    window.fetch = mockOriginalFetch;

    evalScript();

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
    await window.fetch({});
    expect(mockOriginalFetch).toHaveBeenCalledWith({});
  });

  it('intercepts XHR calls to ad URLs', () => {
    const mockOpen = jest.fn();
    const mockSend = jest.fn();
    const mockAbort = jest.fn();

    window.XMLHttpRequest = function () {};
    window.XMLHttpRequest.prototype.open = mockOpen;
    window.XMLHttpRequest.prototype.send = mockSend;
    window.XMLHttpRequest.prototype.abort = mockAbort;

    evalScript();

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

    expect(() => {
      evalScript();
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

    evalScript();

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

    evalScript();
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

    evalScript();

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

    expect(() => {
      evalScript();
    }).not.toThrow();

    Object.defineProperty(document, 'body', { value: originalBody, configurable: true });
  });
});
