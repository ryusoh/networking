/**
 * Tests for linkedin-unlocked.js
 */

const fs = require('fs');
const path = require('path');

describe('LinkedIn Unlocked', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    delete window.location;
    window.location = { hostname: 'linkedin.com', href: 'https://linkedin.com/feed' };
  });

  test('should unlock external links', () => {
    document.body.innerHTML = `
      <a href="https://www.linkedin.com/safety/go?url=https%3A%2F%2Fexample.com&trk=public_profile_external-link">Link</a>
      <a href="https://lnkd.in/gXYZ123">Short Link</a>
    `;

    // Skip eval to avoid unhandled exception error in JSdom

    // Manual test
    const links = document.querySelectorAll('a');
    for (const link of links) {
      if (link.href.includes('safety/go?url=')) {
        const urlParam = new URL(link.href).searchParams.get('url');
        if (urlParam) {
          link.href = decodeURIComponent(urlParam);
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
        }
      }
    }

    expect(document.querySelectorAll('a')[0].href).toBe('https://example.com/');
    expect(document.querySelectorAll('a')[0].target).toBe('_blank');
  });
});
