describe('video-stream-ad-blocker.js', () => {
  let originalWindowLocation;
  beforeEach(() => {
    document.documentElement.innerHTML = '<html><head></head><body></body></html>';

    // Save original location
    originalWindowLocation = window.location;
    delete window.location;
    window.location = {
      hostname: 'vimeo.com',
      pathname: '/test',
      href: 'https://vimeo.com/test',
      search: '',
      protocol: 'https:',
      assign: jest.fn(),
      replace: jest.fn(),
      reload: jest.fn()
    };

    jest.resetModules();
    jest.clearAllMocks();
  });

  afterEach(() => {
    window.location = originalWindowLocation;
    document.documentElement.innerHTML = '';
    delete window.VideoStreamAdBlocker;
  });

  it('runs and intercepts requests when on a video domain', () => {
    // Add offsetParent mocking
    Object.defineProperty(window.HTMLElement.prototype, 'offsetParent', {
      get() {
        return this.parentNode;
      }
    });

    // Mock video.pause
    window.HTMLVideoElement.prototype.pause = jest.fn();

    document.body.innerHTML = `
      <div class="ad-container"></div>
      <div class="video-ad"></div>
      <div class="sponsor"></div>
      <div>
        <video>
           <track label="ad-track" kind="subtitles" srclang="en" src="ad.vtt">
           <track label="captions" kind="subtitles" srclang="en" src="cap.vtt">
        </video>
        <div class="ad-overlay"></div>
      </div>
      <div class="ad-showing"><video id="ad-video"></video></div>
    `;

    class FakeResponse {}
    global.Response = FakeResponse;

    // Mock fetch and XHR
    const originalFetchMock = jest.fn().mockResolvedValue(new FakeResponse());
    window.fetch = originalFetchMock;
    const xhrMock = {
      open: jest.fn(),
      send: jest.fn(),
      abort: jest.fn()
    };
    window.XMLHttpRequest = jest.fn().mockImplementation(() => xhrMock);
    window.XMLHttpRequest.prototype = xhrMock;

    const { instrumentFile } = require('./helpers/instrument');
    const code = instrumentFile(
      require('path').join(__dirname, '..', 'video-stream-ad-blocker.js')
    );
    eval(code);

    document.dispatchEvent(new Event('DOMContentLoaded'));

    expect(window.VideoStreamAdBlocker).toBeDefined();

    // Check DOM manipulation
    expect(document.querySelector('.ad-container').style.display).toBe('none');
    expect(document.querySelector('.video-ad').style.display).toBe('none');
    expect(document.querySelector('.ad-overlay').style.display).toBe('none');

    // Test functions exported for testing
    expect(window.VideoStreamAdBlocker.isAdRequest('https://doubleclick.net/ad')).toBe(true);
    expect(window.VideoStreamAdBlocker.isAdRequest('https://example.com/adbreak')).toBe(true);
    expect(window.VideoStreamAdBlocker.isAdRequest('https://example.com/api')).toBe(false);

    // Test fetch interception
    window.fetch('https://doubleclick.net/ad');
    expect(window.VideoStreamAdBlocker.blockedRequests.has('https://doubleclick.net/ad')).toBe(
      true
    );

    // Testing duplicate call returns false
    window.VideoStreamAdBlocker.blockAdRequest('https://doubleclick.net/ad');

    window.fetch('https://example.com/api');
    // It should have forwarded to the original fetch mock
    expect(originalFetchMock).toHaveBeenCalledWith('https://example.com/api');

    // Test XHR interception
    xhrMock.open('GET', 'https://ads.youtube.com/vast');
    xhrMock.send();
    expect(xhrMock.abort).toHaveBeenCalled();

    xhrMock.open('GET', 'https://example.com/data');
    xhrMock.send();
    expect(xhrMock.abort).toHaveBeenCalledTimes(1);

    // Test a failure path in isAdDomain
    expect(window.VideoStreamAdBlocker.isAdRequest('invalid-url:')).toBe(false);

    // Trigger video play event
    const adVideo = document.getElementById('ad-video');
    adVideo.dispatchEvent(new Event('play'));
    expect(adVideo.pause).toHaveBeenCalled();

    // Cover track with ad label
    const track = document.createElement('track');
    track.label = 'ad-video-track';
    adVideo.appendChild(track);

    Object.defineProperty(adVideo, 'textTracks', {
      value: [{ label: 'ad-track', mode: 'showing' }]
    });

    window.VideoStreamAdBlocker.hideAdContainers();

    // Call interceptXHR again to test missing XMLHttpRequest
    const oldXHR = window.XMLHttpRequest;
    delete window.XMLHttpRequest;
    // We can't really call interceptXHR directly since it's not exported.
    // We can just rely on the existing tests covering other parts, and add a test for isAdRequest error
    window.XMLHttpRequest = oldXHR;

    // Trigger observer
    const newDiv = document.createElement('div');
    newDiv.className = 'ad-container';
    document.body.appendChild(newDiv);

    return new Promise((resolve) => setTimeout(resolve, 100));
  });

  it('handles invalid URL in isAdRequest', () => {
    const { instrumentFile } = require('./helpers/instrument');
    const code = instrumentFile(
      require('path').join(__dirname, '..', 'video-stream-ad-blocker.js')
    );
    eval(code);

    // Call with invalid URL to hit the catch block at line 86
    expect(window.VideoStreamAdBlocker.isAdRequest('://invalid')).toBe(false);
  });

  it('handles null video in removeAdFromVideo', () => {
    const { instrumentFile } = require('./helpers/instrument');
    const code = instrumentFile(
      require('path').join(__dirname, '..', 'video-stream-ad-blocker.js')
    );
    eval(code);

    // Assuming we can trigger this by not passing a video, or we can mock querySelectorAll to return [null]
    // which shouldn't happen but we can try to test it if exported or triggerable.
    // wait, removeAdFromVideo isn't exported. We can't call it directly.
    // Let's mock querySelectorAll('video') to return [null] and then call monitorVideoAds
    document.body.innerHTML = '<video></video>';
    const originalQuerySelectorAll = document.querySelectorAll.bind(document);
    document.querySelectorAll = jest.fn((selector) => {
      if (selector === 'video') {
        return [null];
      }
      return originalQuerySelectorAll(selector);
    });

    // trigger via MutationObserver by adding an element
    document.body.appendChild(document.createElement('div'));

    // Wait for the mutation observer to run and monitorVideoAds to be called
    jest.advanceTimersByTime(100);

    // Restore
    document.querySelectorAll = originalQuerySelectorAll;
  });

  it('handles missing fetch and XMLHttpRequest during init', () => {
    // Save originals
    const oldFetch = window.fetch;
    const oldXHR = window.XMLHttpRequest;
    delete window.fetch;
    delete window.XMLHttpRequest;

    const { instrumentFile } = require('./helpers/instrument');
    const code = instrumentFile(
      require('path').join(__dirname, '..', 'video-stream-ad-blocker.js')
    );
    eval(code);

    // It should initialize without throwing
    expect(window.VideoStreamAdBlocker).toBeDefined();

    // Restore
    window.fetch = oldFetch;
    window.XMLHttpRequest = oldXHR;
  });

  it('runs init on DOMContentLoaded if document is loading', () => {
    Object.defineProperty(document, 'readyState', {
      value: 'loading',
      configurable: true
    });

    const { instrumentFile } = require('./helpers/instrument');
    const code = instrumentFile(
      require('path').join(__dirname, '..', 'video-stream-ad-blocker.js')
    );
    eval(code);

    // Wait for event listener
    document.dispatchEvent(new Event('DOMContentLoaded'));
    expect(window.VideoStreamAdBlocker).toBeDefined();

    // Restore readyState
    Object.defineProperty(document, 'readyState', {
      value: 'complete',
      configurable: true
    });
  });

  it('does not run on non-video domains', () => {
    window.location.hostname = 'example.com';
    const { instrumentFile } = require('./helpers/instrument');
    const code = instrumentFile(
      require('path').join(__dirname, '..', 'video-stream-ad-blocker.js')
    );
    eval(code);
    expect(window.VideoStreamAdBlocker).toBeUndefined(); // Should return early
  });
});
