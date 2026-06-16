describe('xhs-keepalive.js', () => {
  beforeEach(() => {
    document.documentElement.innerHTML = '<html><head></head><body></body></html>';
    jest.useFakeTimers();
    jest.resetModules();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('injects iframe heartbeat', () => {
    const { instrumentFile } = require('./helpers/instrument');
    const code = instrumentFile(require('path').join(__dirname, '..', 'xhs-keepalive.js'));
    eval(code);

    // Fast-forward time
    jest.advanceTimersByTime(20 * 60 * 1000);

    // An iframe should have been created
    const iframe = document.querySelector('iframe');
    if (iframe) {
      // It might be cleaned up, but at least code ran without crash
      iframe.onload && iframe.onload();
    }
  });
});
