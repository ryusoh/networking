const fs = require('fs');
const path = require('path');

const contentScriptPath = path.resolve(__dirname, './content.js');

describe('LinkedIn Interceptor: Race Condition & Event Shielding', () => {
  let anchor, span;

  beforeEach(() => {
    // Mock window.location properly
    delete window.location;
    window.location = {
      href: 'https://www.linkedin.com/feed/',
      assign: jest.fn((url) => {
        window.location.href = url;
      })
    };

    document.body.innerHTML = `
      <div id="browsemap_recommendation">
        <a href="https://www.linkedin.com/in/safe-profile/">
          <span class="actor-name">Race Condition Test</span>
        </a>
      </div>
    `;

    anchor = document.getElementById('browsemap_recommendation');
    span = anchor.querySelector('.actor-name');

    jest.resetModules();
    const code = fs.readFileSync(contentScriptPath, 'utf8');
    eval(code);
  });

  test('should kill the event and navigate only ONCE during high-frequency event barrage', () => {
    // LinkedIn often fires multiple events for a single user action
    const eventTypes = ['pointerdown', 'mousedown', 'mouseup', 'click'];
    const eventSpies = eventTypes.map((type) => {
      const ev = new MouseEvent(type, { bubbles: true, cancelable: true });
      jest.spyOn(ev, 'preventDefault');
      jest.spyOn(ev, 'stopImmediatePropagation');
      return { type, ev };
    });

    // Simulate rapid fire clicks
    eventSpies.forEach((s) => span.dispatchEvent(s.ev));

    // 1. Verification: All events were intercepted and neutralized
    eventSpies.forEach((s) => {
      expect(s.ev.preventDefault).toHaveBeenCalled();
      expect(s.ev.stopImmediatePropagation).toHaveBeenCalled();
    });

    // 2. Verification: Navigation was triggered
    expect(window.location.assign).toHaveBeenCalledWith(
      'https://www.linkedin.com/in/safe-profile/'
    );
  });

  test('should prioritize Strategy A (direct link) if it exists at click-time', () => {
    const event = new MouseEvent('mousedown', { bubbles: true, cancelable: true });
    span.dispatchEvent(event);

    expect(window.location.assign).toHaveBeenCalledWith(
      'https://www.linkedin.com/in/safe-profile/'
    );
    // Verify it didn't need to construct a search URL
    expect(window.location.assign).not.toHaveBeenCalledWith(expect.stringContaining('/search/'));
  });

  test('should fallback to Strategy B (search) only if link is poisoned', () => {
    // Poison the link
    const link = anchor.querySelector('a');
    link.href = 'https://www.linkedin.com/premium/products/?poisoned=true';

    const event = new MouseEvent('mousedown', { bubbles: true, cancelable: true });
    span.dispatchEvent(event);

    // Verify it switched to search fallback
    expect(window.location.assign).toHaveBeenCalledWith(expect.stringContaining('/search/'));
    expect(window.location.assign).toHaveBeenCalledWith(
      expect.stringContaining('keywords=Race%20Condition%20Test')
    );
  });

  test('should neutralize event even if parsing fails (Tab Safety check)', () => {
    // Destroy the DOM so parsing fails
    anchor.innerHTML = 'Just some text, no name element';

    const event = new MouseEvent('click', { bubbles: true, cancelable: true });
    jest.spyOn(event, 'preventDefault');

    anchor.dispatchEvent(event);

    // Event must still be prevented to ensure LinkedIn's scripts don't redirect the main tab
    expect(event.preventDefault).toHaveBeenCalled();
    expect(window.location.assign).not.toHaveBeenCalled();
  });
});
