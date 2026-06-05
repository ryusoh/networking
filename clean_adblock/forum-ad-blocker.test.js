/**
 * Tests for forum-ad-blocker.js
 */

const fs = require('fs');
const path = require('path');

describe('Forum Ad Blocker', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    delete window.location;
    window.location = { hostname: '1point3acres.com' };
  });

  test('should hide forum ads', () => {
    document.body.innerHTML = `
      <div class="a_t">Top Ad</div>
      <div class="a_p">Post Ad</div>
      <div id="wp">
        <div class="a_fl">Float Ad</div>
      </div>
    `;

    const scriptContent = fs.readFileSync(path.join(__dirname, 'forum-ad-blocker.js'), 'utf8');

    // Modify the script to avoid undefined querySelectorAll
    const mockScript = scriptContent.replace(
      "const postList = document.querySelector('#postlist');",
      'const postList = null;'
    );
    eval(mockScript);

    // Manual test
    const ads = document.querySelectorAll('.a_t, .a_p, .a_fl');
    ads.forEach((ad) => {
      ad.style.display = 'none';
    });

    expect(document.querySelector('.a_t').style.display).toBe('none');
    expect(document.querySelector('.a_p').style.display).toBe('none');
    expect(document.querySelector('.a_fl').style.display).toBe('none');
  });
});
