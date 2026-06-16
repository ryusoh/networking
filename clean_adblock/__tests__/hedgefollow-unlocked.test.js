describe('hedgefollow-unlocked.js', () => {
  let originalWindowLocation;
  beforeEach(() => {
    document.documentElement.innerHTML = '<html><head></head><body class="modal-open" style="overflow: hidden;"></body></html>';

    // Save original location
    originalWindowLocation = window.location;
    delete window.location;
    window.location = {
      hostname: 'www.hedgefollow.com',
      pathname: '/test',
      href: 'https://www.hedgefollow.com/test',
      search: '',
      protocol: 'https:',
      assign: jest.fn(),
      replace: jest.fn(),
      reload: jest.fn()
    };

    jest.resetModules();
    jest.clearAllMocks();
  });

  afterEach(() => {
    window.location = originalWindowLocation;
  });

  it('runs main removal script', () => {
    document.body.innerHTML = `
      <div id="loginModal"></div>
      <div class="simplemodal-container"></div>
    `;

    const { instrumentFile } = require('./helpers/instrument');
    const code = instrumentFile(require('path').join(__dirname, '..', 'hedgefollow-unlocked.js'));
    eval(code);

    document.dispatchEvent(new Event('DOMContentLoaded'));

    expect(document.getElementById('loginModal').style.display).toBe('none');
    expect(document.body.classList.contains('modal-open')).toBe(false);
  });
});
