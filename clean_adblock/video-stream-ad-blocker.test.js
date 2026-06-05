/**
 * Tests for Video Stream Ad Blocker
 */

const fs = require('fs');
const path = require('path');

describe('Video Stream Ad Blocker', () => {
  beforeEach(() => {
    document.body.innerHTML = '';

    delete window.location;
    window.location = { hostname: 'www.dailymotion.com' };

    if (window.VideoStreamAdBlocker) {
      window.VideoStreamAdBlocker.adContainersHidden = 0;
      window.VideoStreamAdBlocker.blockedRequests.clear();
    }
  });

  test('should hide ad containers', () => {
    document.body.innerHTML = `
      <div class="video-ad">Ad</div>
      <div id="ad-container">Container</div>
      <div class="ad-overlay">Overlay</div>
    `;

    Object.defineProperty(window.HTMLElement.prototype, 'offsetParent', {
      get() {
        return this;
      },
      configurable: true
    });

    const scriptContent = fs.readFileSync(
      path.join(__dirname, 'video-stream-ad-blocker.js'),
      'utf8'
    );
    eval(scriptContent);

    expect(document.querySelector('.video-ad').style.display).toBe('none');
    expect(document.querySelector('#ad-container').style.display).toBe('none');
    expect(document.querySelector('.ad-overlay').style.display).toBe('none');

    expect(window.VideoStreamAdBlocker.adContainersHidden).toBe(3);
  });

  test('isAdRequest should match ad URLs', () => {
    const scriptContent = fs.readFileSync(
      path.join(__dirname, 'video-stream-ad-blocker.js'),
      'utf8'
    );
    eval(scriptContent);

    expect(window.VideoStreamAdBlocker.isAdRequest('https://doubleclick.net/ad')).toBe(true);
    expect(window.VideoStreamAdBlocker.isAdRequest('https://ads.youtube.com/test')).toBe(true);
    expect(window.VideoStreamAdBlocker.isAdRequest('https://example.com/vast.xml')).toBe(true);
    expect(window.VideoStreamAdBlocker.isAdRequest('https://example.com/video.mp4')).toBe(false);
  });

  test('blockAdRequest should track blocked requests', () => {
    const scriptContent = fs.readFileSync(
      path.join(__dirname, 'video-stream-ad-blocker.js'),
      'utf8'
    );
    eval(scriptContent);

    expect(window.VideoStreamAdBlocker.blockAdRequest('test-url')).toBe(true);
    expect(window.VideoStreamAdBlocker.blockedRequests.has('test-url')).toBe(true);
    expect(window.VideoStreamAdBlocker.blockAdRequest('test-url')).toBe(false); // Already blocked
  });
});
