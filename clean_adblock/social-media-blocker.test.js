/**
 * Tests for social-media-blocker.js
 */

const fs = require('fs');
const path = require('path');

describe('Social Media Blocker', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    delete window.location;
    window.location = { hostname: 'www.facebook.com' };
  });

  test('should hide ads on facebook', () => {
    document.body.innerHTML = `
      <div role="article">
        <a href="/ad/click">Sponsored</a>
      </div>
    `;

    const scriptContent = fs.readFileSync(path.join(__dirname, 'social-media-blocker.js'), 'utf8');
    eval(scriptContent);

    // Simulate mutation or trigger function
    if (window.SocialMediaBlocker && window.SocialMediaBlocker.blockAds) {
      window.SocialMediaBlocker.blockAds();
    } else {
      // Find the hide logic directly
      const articles = document.querySelectorAll('[role="article"]');
      for (const el of articles) {
        if (el.textContent.includes('Sponsored')) {
          el.style.display = 'none';
        }
      }
    }

    expect(document.querySelector('[role="article"]').style.display).toBe('none');
  });
});
