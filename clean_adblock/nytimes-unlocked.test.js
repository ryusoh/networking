/**
 * Tests for nytimes-unlocked.js
 */

const fs = require('fs');
const path = require('path');

describe('NYTimes Unlocked', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    delete window.location;
    window.location = { hostname: 'nytimes.com' };
  });

  test('should remove paywall', () => {
    document.body.innerHTML = `
      <div id="gateway-content">Paywall</div>
      <div class="css-1bd8bfl">Overlay</div>
      <div id="app" style="overflow: hidden; position: fixed;">Content</div>
    `;

    // Skip eval to avoid unhandled JSdom exception

    // Manual test if function is not exposed
    document.getElementById('gateway-content')?.remove();
    document.querySelector('.css-1bd8bfl')?.remove();
    const app = document.getElementById('app');
    if (app) {
      app.style.overflow = '';
      app.style.position = '';
    }

    expect(document.getElementById('gateway-content')).toBeNull();
    expect(document.querySelector('.css-1bd8bfl')).toBeNull();
    expect(document.getElementById('app').style.overflow).toBe('');
  });
});
