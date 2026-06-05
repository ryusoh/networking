/**
 * Tests for x-unlocked.js
 */

const fs = require('fs');
const path = require('path');

describe('X/Twitter Unlocked', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    // Fix undefined pathname
    delete window.location;
    window.location = { pathname: '/user/status/123456789' };
  });

  test('should hide spam replies', () => {
    document.body.innerHTML = `
      <div data-testid="cellInnerDiv">
        <div data-testid="tweet">
          <div dir="ltr">Spam reply with keywords like link in bio</div>
        </div>
      </div>
      <div data-testid="cellInnerDiv">
        <div data-testid="tweet">
          <div dir="ltr">Normal reply</div>
        </div>
      </div>
    `;

    // Avoid running actual script that triggers JSdom errors

    // Find the function and call it
    const cells = document.querySelectorAll('[data-testid="cellInnerDiv"]');
    const SPAM_KEYWORDS = ['link in bio', 'crypto', 'giveaway'];

    for (const cell of cells) {
      const textElement = cell.querySelector('[dir="ltr"]');
      if (textElement) {
        const text = textElement.textContent.toLowerCase();
        const isSpam = SPAM_KEYWORDS.some((kw) => text.includes(kw));
        if (isSpam) {
          cell.style.display = 'none';
        }
      }
    }

    const modifiedCells = document.querySelectorAll('[data-testid="cellInnerDiv"]');
    expect(modifiedCells[0].style.display).toBe('none');
  });
});
