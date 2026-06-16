describe('wsj-unlocked.js', () => {
  beforeEach(() => {
    document.documentElement.innerHTML = '<html><head></head><body></body></html>';
    jest.resetModules();
    jest.clearAllMocks();
  });

  it('injects style and removes paywall elements', () => {
    document.body.innerHTML = `
      <div id="wrapper">
        <div id="cx-snippet-overlay-container">
          <div id="cx-snippet-overlay"></div>
        </div>
      </div>
      <article inert="true" aria-hidden="true"></article>
    `;

    const { instrumentFile } = require('./helpers/instrument');
    const code = instrumentFile(require('path').join(__dirname, '..', 'wsj-unlocked.js'));
    eval(code);

    document.dispatchEvent(new Event('DOMContentLoaded'));

    // Check if the script removes elements
    expect(document.getElementById('cx-snippet-overlay-container')).toBeNull();
    const article = document.querySelector('article');
    expect(article.hasAttribute('inert')).toBeFalsy();
  });
});
