'use strict';

const {
  shouldRecover,
  computeResumeTime,
  recover,
  makeState,
  GRACE_MS,
  SEEK_BACK_S,
  COOLDOWN_MS
} = require('../content.js');

function fakeVideo(overrides = {}) {
  return {
    paused: false,
    ended: false,
    duration: 3600,
    readyState: 4,
    currentTime: 100,
    play: jest.fn().mockResolvedValue(undefined),
    ...overrides
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
    v.currentTime = 101; // progress!
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
