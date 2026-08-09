'use strict';

const {
  shouldRecover,
  computeResumeTime,
  recover,
  makeState,
  GRACE_MS,
  SEEK_BACK_S,
  COOLDOWN_MS,
  FUTILE_LIMIT,
  RELOAD_COOLDOWN_MS
} = require('../content.js');

function fakeVideo(overrides = {}) {
  return {
    paused: false,
    ended: false,
    duration: 3600,
    readyState: 4,
    currentTime: 100,
    buffered: { length: 0, start: () => 0, end: () => 0 },
    play: jest.fn().mockResolvedValue(undefined),
    ...overrides
  };
}

function fakeBuffered(ranges) {
  return {
    length: ranges.length,
    start: (i) => ranges[i][0],
    end: (i) => ranges[i][1]
  };
}

describe('shouldRecover', () => {
  test('playing video with data is not a stall', () => {
    const v = fakeVideo();
    const s = makeState();
    expect(shouldRecover(v, 10000, s)).toBe(false);
  });

  test('user-paused video is never touched', () => {
    const v = fakeVideo({ paused: true, readyState: 0 });
    const s = makeState();
    s.lastTime = 100;
    expect(shouldRecover(v, 100000, s)).toBe(false);
  });

  test('live stream (infinite duration) is never seeked', () => {
    const v = fakeVideo({ duration: Infinity, readyState: 1 });
    const s = makeState();
    s.lastTime = 100;
    expect(shouldRecover(v, 100000, s)).toBe(false);
  });

  test('advancing playhead resets the stall clock', () => {
    const v = fakeVideo({ readyState: 2, currentTime: 100 });
    const s = makeState();
    expect(shouldRecover(v, 1000, s)).toBe(false); // starts stall clock
    Object.defineProperty(v, 'currentTime', { value: 101, configurable: true }); // progress!
    expect(shouldRecover(v, 1000 + GRACE_MS + 1, s)).toBe(false);
    expect(s.stalledSince).toBe(0);
  });

  test('frozen playhead past the grace period triggers recovery', () => {
    const v = fakeVideo({ readyState: 2, currentTime: 100 });
    const s = makeState();
    const t0 = 50000;
    shouldRecover(v, t0, s); // baseline: records currentTime
    expect(shouldRecover(v, t0 + 1, s)).toBe(false); // freeze noticed, clock starts
    expect(shouldRecover(v, t0 + 1 + GRACE_MS - 1, s)).toBe(false);
    expect(shouldRecover(v, t0 + 1 + GRACE_MS, s)).toBe(true);
  });

  test('cooldown prevents recovery loops', () => {
    const v = fakeVideo({ readyState: 2, currentTime: 100 });
    const s = makeState();
    s.lastTime = 100;
    s.lastRecovery = 90000;
    s.stalledSince = 1000; // long-stalled, but a recovery just happened
    expect(shouldRecover(v, 90000 + COOLDOWN_MS - 1, s)).toBe(false);
    expect(shouldRecover(v, 90000 + COOLDOWN_MS, s)).toBe(true);
  });
});

describe('computeResumeTime', () => {
  test('rewinds by SEEK_BACK_S', () => {
    expect(computeResumeTime(fakeVideo({ currentTime: 100 }))).toBe(100 - SEEK_BACK_S);
  });

  test('clamps at the start of the video', () => {
    expect(computeResumeTime(fakeVideo({ currentTime: 3 }))).toBe(0);
  });

  test('never seeks past the end', () => {
    const v = fakeVideo({ currentTime: 3600, duration: 3600 });
    expect(computeResumeTime(v)).toBe(3600 - SEEK_BACK_S);
  });

  test('small hole: rewinds just inside the preceding buffered range', () => {
    // Buffered 0–95 and 99–200, playhead stalled at 97 (in the hole).
    const v = fakeVideo({
      currentTime: 97,
      buffered: fakeBuffered([
        [0, 95],
        [99, 200]
      ])
    });
    expect(computeResumeTime(v)).toBe(94);
  });

  test('large hole: falls back to the full rewind', () => {
    // Buffered 0–80 only, playhead at 100 — hole is 20s > SEEK_BACK_S.
    const v = fakeVideo({ currentTime: 100, buffered: fakeBuffered([[0, 80]]) });
    expect(computeResumeTime(v)).toBe(100 - SEEK_BACK_S);
  });

  test('playhead inside a range: default rewind, not hole logic', () => {
    const v = fakeVideo({ currentTime: 100, buffered: fakeBuffered([[50, 150]]) });
    expect(computeResumeTime(v)).toBe(100 - SEEK_BACK_S);
  });
});

describe('recover', () => {
  test('seeks back, resumes playback, and counts the recovery', () => {
    const v = fakeVideo({ currentTime: 100 });
    const s = makeState();
    const now = 123456;
    recover(v, now, s);
    expect(v.currentTime).toBe(100 - SEEK_BACK_S);
    expect(v.play).toHaveBeenCalledTimes(1);
    expect(s.recoveries).toBe(1);
    expect(s.lastRecovery).toBe(now);
    expect(s.stalledSince).toBe(0);
  });

  test('survives a rejected play() promise (autoplay policy)', async () => {
    const v = fakeVideo({ play: jest.fn().mockRejectedValue(new Error('denied')) });
    const s = makeState();
    expect(() => recover(v, 1, s)).not.toThrow();
    // Let the rejection handler run so Jest does not flag an unhandled rejection.
    await Promise.resolve();
    expect(v.play).toHaveBeenCalledTimes(1);
  });
});

describe('reload escalation', () => {
  // Stuck at the same wall: every recovery stalls at the same currentTime.
  function stuckVideo() {
    return fakeVideo({ currentTime: 100, readyState: 2 });
  }

  test('reloads after FUTILE_LIMIT consecutive no-progress recoveries', () => {
    const v = stuckVideo();
    const s = makeState();
    const reload = jest.fn();
    const t0 = 1000000;
    recover(v, t0, s, reload); // baseline stall point
    recover(v, t0 + 1, s, reload); // futile 1
    recover(v, t0 + 2, s, reload); // futile 2
    expect(reload).not.toHaveBeenCalled();
    recover(v, t0 + 3, s, reload); // futile 3 -> reload
    expect(reload).toHaveBeenCalledTimes(1);
    expect(s.reloads).toBe(1);
    expect(v.play).toHaveBeenCalledTimes(3); // the reload recovery does not seek/play
  });

  test('real progress resets the futile counter', () => {
    const v = stuckVideo();
    const s = makeState();
    const reload = jest.fn();
    const t0 = 1000000;
    recover(v, t0, s, reload); // baseline
    recover(v, t0 + 1, s, reload); // futile 1
    recover(v, t0 + 2, s, reload); // futile 2
    Object.defineProperty(v, 'currentTime', { value: 110, configurable: true }); // the wall moved: playback advanced 10s
    recover(v, t0 + 3, s, reload); // progress -> counter resets
    recover(v, t0 + 4, s, reload); // futile 1 at the new wall
    recover(v, t0 + 5, s, reload); // futile 2
    expect(reload).not.toHaveBeenCalled();
    recover(v, t0 + 6, s, reload); // futile 3 -> reload
    expect(reload).toHaveBeenCalledTimes(1);
  });

  test('reload cooldown and per-page cap are enforced', () => {
    const v = stuckVideo();
    const s = makeState();
    const reload = jest.fn();
    let now = 1000000;
    const recoverUntilReload = () => {
      // One call sets the baseline wall; FUTILE_LIMIT more trigger the reload.
      for (let i = 0; i <= FUTILE_LIMIT; i++) {
        now += 1;
        recover(v, now, s, reload);
      }
    };
    recoverUntilReload(); // reload #1
    expect(reload).toHaveBeenCalledTimes(1);
    recoverUntilReload(); // within cooldown: no reload, futile counter resets at cap
    expect(reload).toHaveBeenCalledTimes(1);
    now += RELOAD_COOLDOWN_MS;
    recoverUntilReload(); // reload #2
    expect(reload).toHaveBeenCalledTimes(2);
    now += RELOAD_COOLDOWN_MS;
    recoverUntilReload(); // reload #3 = MAX_RELOADS
    expect(reload).toHaveBeenCalledTimes(3);
    now += RELOAD_COOLDOWN_MS;
    recoverUntilReload(); // cap reached: never again this page life
    expect(reload).toHaveBeenCalledTimes(3);
  });
});

describe('content-script runtime', () => {
  let observers = [];
  const OriginalObserver = window.MutationObserver;
  beforeAll(() => {
    window.MutationObserver = function (callback) {
      const observer = new OriginalObserver(callback);
      observers.push(observer);
      return observer;
    };
    window.MutationObserver.prototype = OriginalObserver.prototype;
  });

  afterEach(() => {
    observers.forEach((obs) => obs.disconnect());
    observers = [];
    document.documentElement.innerHTML = '<head></head><body></body>';
  });

  const contentScriptPath = require('path').resolve(__dirname, '../content.js');
  const { instrumentFile } = require('../../adblock/__tests__/helpers/instrument.js');

  function loadContentScript() {
    const code = instrumentFile(contentScriptPath);
    // Execute the code in an environment where `module` is undefined to trigger the runtime block
    eval(`
      (function() {
        const module = undefined;
        ${code}
      })();
    `);
  }

  function mockVideoProperties(v, overrides = {}) {
    const state = {
      paused: false,
      ended: false,
      duration: 3600,
      readyState: 2,
      currentTime: 100,
      ...overrides
    };

    // In JSDOM, HTMLVideoElement has these as readonly. We can overwrite them by
    // wrapping them if needed, or by overriding properties on the instance directly.
    Object.keys(state).forEach((key) => {
      Object.defineProperty(v, key, {
        get: () => state[key],
        set: (val) => (state[key] = val),
        configurable: true
      });
    });

    Object.defineProperty(v, 'buffered', {
      value: { length: 0, start: () => 0, end: () => 0 },
      configurable: true
    });

    v.play = jest.fn().mockResolvedValue(undefined);
  }

  beforeEach(() => {
    delete window.location;
    window.location = new URL('https://example.com');
    window.location.reload = jest.fn();
    document.documentElement.innerHTML = '<head></head><body></body>';
    jest.resetModules();
    jest.clearAllMocks();
  });

  test('scan and watch videos, recover on stall via setInterval', () => {
    jest.useFakeTimers();

    document.body.innerHTML = `
      <video id="v1"></video>
      <video id="v2"></video>
    `;
    const videos = document.querySelectorAll('video');

    // Setup video state to simulate a stall on v1
    mockVideoProperties(videos[0]);
    // v2 is paused
    mockVideoProperties(videos[1], { paused: true });

    loadContentScript();

    // The observer runs. `scan` is called. It sets up `setInterval(..., POLL_MS)`.
    // We need to trigger `shouldRecover`, which returns true after `GRACE_MS` if `currentTime` didn't change.
    // Let's tick POLL_MS intervals.
    // First, let's call shouldRecover indirectly via the setInterval
    jest.advanceTimersByTime(10000);

    expect(videos[0].play).toHaveBeenCalled();
    expect(videos[1].play).not.toHaveBeenCalled();

    jest.useRealTimers();
  });

  test('requestReload reloads top frame via postMessage if in iframe', () => {
    jest.useFakeTimers();

    const originalTop = window.top;
    const originalSelf = window.self;

    const mockTop = {
      postMessage: jest.fn()
    };

    Object.defineProperty(window, 'top', { value: mockTop, configurable: true });
    Object.defineProperty(window, 'self', { value: window, configurable: true });

    document.body.innerHTML = '<video></video>';
    const v = document.querySelector('video');
    mockVideoProperties(v);

    loadContentScript();

    for (let i = 0; i <= 6; i++) {
      jest.advanceTimersByTime(25000);
    }

    expect(mockTop.postMessage).toHaveBeenCalledWith({ type: 'stall-guard:reload' }, '*');

    // Restore
    Object.defineProperty(window, 'top', { value: originalTop, configurable: true });
    Object.defineProperty(window, 'self', { value: originalSelf, configurable: true });

    jest.useRealTimers();
  });

  test('requestReload falls back to location.reload if postMessage throws (cross-origin)', () => {
    jest.useFakeTimers();

    const originalTop = window.top;

    const mockTop = {
      postMessage: jest.fn(() => {
        throw new Error('cross-origin');
      })
    };

    Object.defineProperty(window, 'top', { value: mockTop, configurable: true });

    document.body.innerHTML = '<video></video>';
    const v = document.querySelector('video');
    mockVideoProperties(v);

    loadContentScript();

    for (let i = 0; i <= 6; i++) {
      jest.advanceTimersByTime(25000);
    }

    expect(window.location.reload).toHaveBeenCalled();

    Object.defineProperty(window, 'top', { value: originalTop, configurable: true });

    jest.useRealTimers();
  });

  test('top frame reloads directly if requestReload is called', () => {
    jest.useFakeTimers();

    document.body.innerHTML = '<video></video>';
    const v = document.querySelector('video');
    mockVideoProperties(v);

    loadContentScript();

    for (let i = 0; i <= 6; i++) {
      jest.advanceTimersByTime(25000);
    }

    expect(window.location.reload).toHaveBeenCalled();

    jest.useRealTimers();
  });

  test('message event listener reloads top frame on stall-guard:reload', () => {
    loadContentScript();

    const event = new window.MessageEvent('message', {
      data: { type: 'stall-guard:reload' },
      source: window
    });
    window.dispatchEvent(event);

    expect(window.location.reload).toHaveBeenCalled();
  });

  test('message event listener ignores irrelevant messages', () => {
    loadContentScript();

    const event = new window.MessageEvent('message', {
      data: { type: 'other-event' },
      source: window
    });
    window.dispatchEvent(event);

    expect(window.location.reload).not.toHaveBeenCalled();
  });

  test('MutationObserver calls scan() for dynamically added videos', async () => {
    jest.useFakeTimers();
    loadContentScript();

    // Add video after script loaded
    const v = document.createElement('video');
    mockVideoProperties(v);
    document.body.appendChild(v);

    // Give observer time to fire
    jest.advanceTimersByTime(0);
    await Promise.resolve(); // allow microtasks to run
    jest.advanceTimersByTime(0);

    // Advance time for stall clock
    jest.advanceTimersByTime(10000);

    expect(v.play).toHaveBeenCalled();

    jest.useRealTimers();
  });
});
