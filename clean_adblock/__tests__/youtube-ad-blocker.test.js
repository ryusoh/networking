describe('youtube-ad-blocker.js', () => {
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
    require('../youtube-ad-blocker.js');
  });

  it('runs blockYouTubeAds on correct hostname', () => {
    window.location.hostname = 'www.youtube.com';
    document.body.innerHTML = `
      <div class="ad-showing" data-ad-impressions="true"></div>
      <div id="masthead-ad"></div>
      <div class="not-an-ad"></div>
    `;

    // override matches and closest to cover invalid selectors block
    const originalMatches = global.Element.prototype.matches;
    let failMatches = false;
    global.Element.prototype.matches = function (s) {
      if (failMatches) {
        throw new Error('invalid selector');
      }
      return originalMatches.call(this, s);
    };

    require('../youtube-ad-blocker.js');

    // try invalid selector path
    failMatches = true;
    if (window.YouTubeAdBlocker) {
      window.YouTubeAdBlocker.blockYouTubeAds();
    }
    global.Element.prototype.matches = originalMatches;
  });

  it('handles mutations for dynamically added ads', () => {
    window.location.hostname = 'www.youtube.com';

    let observerCb;
    let classObserverCb;

    const origMO = global.MutationObserver;
    let count = 0;
    global.MutationObserver = class {
      constructor(cb) {
        if (count === 0) {
          observerCb = cb;
        }
        if (count === 1) {
          classObserverCb = cb;
        }
        count++;
      }
      observe() {}
      disconnect() {}
    };

    document.body.innerHTML = `
      <div class="video-ads">
         <video></video>
         <button class="ytp-ad-skip-button"></button>
      </div>
    `;

    require('../youtube-ad-blocker.js');

    const adEl = document.createElement('div');
    adEl.className = 'ytp-ad-overlay-container';
    document.body.appendChild(adEl);

    // trigger mutation
    if (observerCb) {
      observerCb([
        {
          addedNodes: [adEl]
        }
      ]);
    }

    const skipBtn = document.querySelector('.ytp-ad-skip-button');
    Object.defineProperty(skipBtn, 'offsetParent', { value: document.body, configurable: true });
    skipBtn.click = jest.fn();

    // trigger class mutation
    const videoContainer = document.querySelector('.video-ads');
    videoContainer.classList.add('ad-showing');
    if (classObserverCb) {
      classObserverCb([
        {
          type: 'attributes',
          attributeName: 'class',
          target: videoContainer
        }
      ]);
    }

    expect(skipBtn.click).toHaveBeenCalled();

    global.MutationObserver = origMO;
  });

  it('covers DOMContentLoaded event branch', () => {
    window.location.hostname = 'www.youtube.com';
    Object.defineProperty(document, 'readyState', { value: 'loading', configurable: true });

    require('../youtube-ad-blocker.js');

    const event = document.createEvent('Event');
    event.initEvent('DOMContentLoaded', true, true);
    document.dispatchEvent(event);
  });
});
