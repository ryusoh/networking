/**
 * Tests for Twitch Ad Blocker
 */

const fs = require('fs');
const path = require('path');

describe('Twitch Ad Blocker', () => {
  beforeEach(() => {
    document.body.innerHTML = '';

    delete window.location;
    window.location = { hostname: 'www.twitch.tv' };

    if (window.TwitchAdBlocker) {
      window.TwitchAdBlocker.adsBlocked = 0;
    }
  });

  test('should hide ad elements', () => {
    document.body.innerHTML = `
      <div data-a-target="video-ad-overlay">Ad Overlay</div>
      <div class="video-player__ad-overlay">Ad Video Overlay</div>
      <div data-test-id="ad-banner">Ad Banner</div>
    `;

    const scriptContent = fs.readFileSync(path.join(__dirname, 'twitch-ad-blocker.js'), 'utf8');
    eval(scriptContent);

    expect(document.querySelector('[data-a-target="video-ad-overlay"]').style.display).toBe('none');
    expect(document.querySelector('.video-player__ad-overlay').style.display).toBe('none');
    expect(document.querySelector('[data-test-id="ad-banner"]').style.display).toBe('none');

    expect(window.TwitchAdBlocker.adsBlocked).toBeGreaterThan(0);
  });

  test('should try skip ad', () => {
    document.body.innerHTML = `
      <button data-a-target="video-ad-skip-button">Skip Ad</button>
    `;

    Object.defineProperty(window.HTMLElement.prototype, 'offsetParent', {
      get() {
        return this;
      },
      configurable: true
    });

    const scriptContent = fs.readFileSync(path.join(__dirname, 'twitch-ad-blocker.js'), 'utf8');
    eval(scriptContent);

    const skipBtn = document.querySelector('[data-a-target="video-ad-skip-button"]');
    skipBtn.click = jest.fn();

    expect(window.TwitchAdBlocker.trySkipAd()).toBe(true);
    expect(skipBtn.click).toHaveBeenCalled();
  });

  test('should mute ad if playing', () => {
    document.body.innerHTML = `
      <div data-a-target="video-ad-overlay">
        <video></video>
      </div>
    `;

    Object.defineProperty(window.HTMLElement.prototype, 'offsetParent', {
      get() {
        return this;
      },
      configurable: true
    });

    const scriptContent = fs.readFileSync(path.join(__dirname, 'twitch-ad-blocker.js'), 'utf8');
    eval(scriptContent);

    expect(window.TwitchAdBlocker.muteAdIfPlaying()).toBe(true);
    expect(document.querySelector('video').muted).toBe(true);
  });
});
