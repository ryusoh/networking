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

    // Trigger observer
    const newDiv = document.createElement('div');
    newDiv.className = 'ad-container';
    document.body.appendChild(newDiv);

    return new Promise((resolve) => setTimeout(resolve, 100));
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
