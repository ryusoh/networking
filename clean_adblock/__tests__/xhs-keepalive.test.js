describe('xhs-keepalive.js', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.resetModules();
    jest.clearAllMocks();
    document.body.innerHTML = '';
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('injects iframe heartbeat and removes it via onload', () => {
    const { instrumentFile } = require('./helpers/instrument');
    const code = instrumentFile(require('path').join(__dirname, '..', 'xhs-keepalive.js'));

    // We should patch Math.random so we know exactly when it fires
    jest.spyOn(Math, 'random').mockReturnValue(0); // This means 8 minutes

    eval(code);

    // Fast-forward time to trigger the first heartbeat
    jest.advanceTimersByTime(8 * 60 * 1000);

    const iframe = document.querySelector('iframe');
    expect(iframe).not.toBeNull();

    // Execute the onload
    iframe.onload();

    // Advance time by 2000ms for the cleanup timeout
    jest.advanceTimersByTime(2000);

    // Iframe should be removed
    expect(iframe.parentNode).toBeNull();
  });

  it('does not crash if iframe is already removed when onload timeout fires', () => {
    const { instrumentFile } = require('./helpers/instrument');
    const code = instrumentFile(require('path').join(__dirname, '..', 'xhs-keepalive.js'));
    jest.spyOn(Math, 'random').mockReturnValue(0); // 8 minutes
    eval(code);

    jest.advanceTimersByTime(8 * 60 * 1000);
    const iframe = document.querySelector('iframe');

    iframe.onload();

    // forcefully remove iframe before timeout
    iframe.remove();

    // advance time to trigger the onload timeout
    expect(() => jest.advanceTimersByTime(2000)).not.toThrow();
  });

  it('removes iframe using fallback timeout if onload never fires', () => {
    const { instrumentFile } = require('./helpers/instrument');
    const code = instrumentFile(require('path').join(__dirname, '..', 'xhs-keepalive.js'));

    jest.spyOn(Math, 'random').mockReturnValue(0); // 8 minutes

    eval(code);

    // Fast-forward time to trigger the first heartbeat
    jest.advanceTimersByTime(8 * 60 * 1000);

    const iframe = document.querySelector('iframe');
    expect(iframe).not.toBeNull();

    // Fast-forward past the 15000ms fallback timeout
    jest.advanceTimersByTime(15000);

    // Iframe should be removed by the fallback timeout
    expect(iframe.parentNode).toBeNull();
  });

  it('does not crash if iframe is already removed when fallback timeout fires', () => {
    const { instrumentFile } = require('./helpers/instrument');
    const code = instrumentFile(require('path').join(__dirname, '..', 'xhs-keepalive.js'));
    jest.spyOn(Math, 'random').mockReturnValue(0); // 8 minutes
    eval(code);

    jest.advanceTimersByTime(8 * 60 * 1000);
    const iframe = document.querySelector('iframe');

    // forcefully remove iframe before fallback timeout
    iframe.remove();

    // advance time to trigger the fallback timeout
    expect(() => jest.advanceTimersByTime(15000)).not.toThrow();
  });

  it('catches and ignores errors if document.body is not available', () => {
    const { instrumentFile } = require('./helpers/instrument');
    const code = instrumentFile(require('path').join(__dirname, '..', 'xhs-keepalive.js'));

    jest.spyOn(document, 'createElement').mockImplementation(() => {
      throw new Error('Simulated error');
    });

    jest.spyOn(Math, 'random').mockReturnValue(0);

    eval(code);

    // Fast-forward time to trigger the first heartbeat
    expect(() => {
      jest.advanceTimersByTime(8 * 60 * 1000);
    }).not.toThrow();
  });
});
