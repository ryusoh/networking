/**
 * Tests for YouTube Ad Blocker
 */

const fs = require('fs');
const path = require('path');

describe('YouTube Ad Blocker', () => {
  beforeEach(() => {
    // Reset JSDOM environment
    document.body.innerHTML = '';

    // Mock window location
    delete window.location;
    window.location = { hostname: 'www.youtube.com' };

    // Reset global state
    if (window.YouTubeAdBlocker) {
      window.YouTubeAdBlocker.adBlockedCount = 0;
    }
  });

  test('should hide ad elements on DOM load', () => {
    // Setup DOM with ads
    document.body.innerHTML = `
      <div class="ad-showing">Ad Container</div>
      <div class="video-ads">Video Ads</div>
      <ytd-ad-slot-renderer>Ad Slot</ytd-ad-slot-renderer>
      <div id="masthead-ad">Masthead Ad</div>
    `;

    // Load and execute script
    const scriptContent = fs.readFileSync(path.join(__dirname, 'youtube-ad-blocker.js'), 'utf8');
    eval(scriptContent);

    // Assert ads are hidden
    expect(document.querySelector('.ad-showing').style.display).toBe('none');
    expect(document.querySelector('.video-ads').style.display).toBe('none');
    expect(document.querySelector('ytd-ad-slot-renderer').style.display).toBe('none');
    expect(document.querySelector('#masthead-ad').style.display).toBe('none');

    expect(window.YouTubeAdBlocker.adBlockedCount).toBeGreaterThan(0);
  });

  test('should skip ad if playing', () => {
    // Setup DOM with skip button
    document.body.innerHTML = `
      <button class="ytp-ad-skip-button" style="display: block;">Skip Ad</button>
    `;

    // Mock offsetParent so it appears visible
    Object.defineProperty(window.HTMLElement.prototype, 'offsetParent', {
      get() {
        return this;
      },
      configurable: true
    });

    const scriptContent = fs.readFileSync(path.join(__dirname, 'youtube-ad-blocker.js'), 'utf8');
    eval(scriptContent);

    // Mock click event
    const skipBtn = document.querySelector('.ytp-ad-skip-button');
    skipBtn.click = jest.fn();

    expect(window.YouTubeAdBlocker.skipAdIfPlaying()).toBe(true);
    expect(skipBtn.click).toHaveBeenCalled();
  });

  test('should mute ad if playing', () => {
    document.body.innerHTML = `
      <div class="ad-showing">
        <video></video>
      </div>
    `;

    const scriptContent = fs.readFileSync(path.join(__dirname, 'youtube-ad-blocker.js'), 'utf8');
    eval(scriptContent);

    expect(window.YouTubeAdBlocker.muteAdIfPlaying()).toBe(true);
    expect(document.querySelector('video').muted).toBe(true);
  });
});
