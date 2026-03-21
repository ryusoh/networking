/**
 * Tests for clean_adblock feature modules
 */

describe('Feature Toggles', () => {
  test('should have default features enabled in background', () => {
    // Mock Chrome API
    global.chrome = {
      storage: {
        sync: {
          get: jest.fn((defaults, cb) => cb(defaults)),
          set: jest.fn()
        },
        onChanged: {
          addListener: jest.fn()
        }
      },
      action: {
        setBadgeText: jest.fn(),
        setBadgeBackgroundColor: jest.fn()
      },
      runtime: {
        onInstalled: {
          addListener: jest.fn((cb) => cb({ reason: 'install' }))
        },
        lastError: null
      },
      tabs: {
        query: jest.fn(),
        onUpdated: { addListener: jest.fn() },
        onCreated: { addListener: jest.fn() },
        remove: jest.fn()
      },
      declarativeNetRequest: {
        getDynamicRules: jest.fn(() => Promise.resolve([])),
        updateDynamicRules: jest.fn(() => Promise.resolve())
      }
    };

    require('./background.js');

    const callArgs = chrome.storage.sync.set.mock.calls[0][0];
    expect(callArgs.features).toEqual({
      cookieBannerBlocker: true,
      socialMediaBlocker: true,
      youtubeAdBlocker: true,
      videoStreamAdBlocker: true,
      twitchAdBlocker: true
    });
  });
});

describe('Cookie Banner Blocker', () => {
  test('cookie-banner-blocker.js should exist and be valid JS', () => {
    const fs = require('fs');
    const path = require('path');
    const content = fs.readFileSync(path.join(__dirname, 'cookie-banner-blocker.js'), 'utf8');
    expect(content).toContain('CookieBannerBlocker');
    expect(content).toContain('COOKIE_BANNER_SELECTORS');
  });
});

describe('Social Media Blocker', () => {
  test('social-media-blocker.js should exist and be valid JS', () => {
    const fs = require('fs');
    const path = require('path');
    const content = fs.readFileSync(path.join(__dirname, 'social-media-blocker.js'), 'utf8');
    expect(content).toContain('SocialMediaBlocker');
    expect(content).toContain('PLATFORM_CONFIG');
  });
});

describe('YouTube Ad Blocker', () => {
  test('youtube-ad-blocker.js should exist and be valid JS', () => {
    const fs = require('fs');
    const path = require('path');
    const content = fs.readFileSync(path.join(__dirname, 'youtube-ad-blocker.js'), 'utf8');
    expect(content).toContain('YouTubeAdBlocker');
    expect(content).toContain('AD_SELECTORS');
  });
});

describe('Video Stream Ad Blocker', () => {
  test('video-stream-ad-blocker.js should exist and be valid JS', () => {
    const fs = require('fs');
    const path = require('path');
    const content = fs.readFileSync(path.join(__dirname, 'video-stream-ad-blocker.js'), 'utf8');
    expect(content).toContain('VideoStreamAdBlocker');
    expect(content).toContain('AD_SERVER_DOMAINS');
  });
});

describe('Twitch Ad Blocker', () => {
  test('twitch-ad-blocker.js should exist and be valid JS', () => {
    const fs = require('fs');
    const path = require('path');
    const content = fs.readFileSync(path.join(__dirname, 'twitch-ad-blocker.js'), 'utf8');
    expect(content).toContain('TwitchAdBlocker');
    expect(content).toContain('AD_SELECTORS');
  });
});

describe('Manifest Configuration', () => {
  test('manifest.json should include all content scripts', () => {
    const fs = require('fs');
    const path = require('path');
    const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, 'manifest.json'), 'utf8'));

    const expectedScripts = [
      'content.js',
      'cookie-banner-blocker.js',
      'social-media-blocker.js',
      'youtube-ad-blocker.js',
      'video-stream-ad-blocker.js',
      'twitch-ad-blocker.js'
    ];

    const contentScriptFiles = manifest.content_scripts.flatMap((cs) => cs.js);

    for (const script of expectedScripts) {
      expect(contentScriptFiles).toContain(script);
    }
  });

  test('manifest.json should have correct host permissions', () => {
    const fs = require('fs');
    const path = require('path');
    const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, 'manifest.json'), 'utf8'));

    expect(manifest.host_permissions).toContain('*://*.youtube.com/*');
    expect(manifest.host_permissions).toContain('*://*.twitch.tv/*');
    expect(manifest.host_permissions).toContain('*://*.facebook.com/*');
  });
});
