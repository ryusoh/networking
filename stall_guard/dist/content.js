// stall-guard — auto-recover from HTML5 video stalls.
//
// Why this exists: on a lossy proxied path (e.g. a vmess/Shadowsocks tunnel
// with TCP-over-TCP freezes), the video flow stops dead for seconds at a
// time. The player then stalls even though the progress bar shows buffered
// video ahead (buffer holes, rendition-switch boundaries, starving audio
// track). The manual workaround — seek back a few seconds and resume —
// re-anchors playback at a contiguous buffered point. This script does that
// automatically.
//
// What it deliberately does NOT do: it cannot fix the network. It only
// shortens each stall from "until you notice and seek" to ~4 seconds.
//
// Loaded as an MV3 content script (all_frames, so it also reaches the Vimeo
// player iframe). Core logic is exported for unit tests when required as a
// CommonJS module.

/* global module */
(function () {
  'use strict';

  const POLL_MS = 1000; // how often each video is checked
  const GRACE_MS = 4000; // continuous stall time before acting
  const SEEK_BACK_S = 8; // rewind distance on recovery
  const COOLDOWN_MS = 15000; // min interval between recoveries of one video

  // A video counts as stalled when it is supposed to be playing (not paused,
  // not ended), has no future data decoded (readyState < HAVE_FUTURE_DATA),
  // and currentTime has stopped advancing.
  function shouldRecover(video, now, state) {
    if (video.paused || video.ended) {
      state.stalledSince = 0;
      return false;
    }
    if (!isFinite(video.duration)) {
      return false; // live stream: seeking is not meaningful
    }
    if (video.readyState >= 3) {
      state.stalledSince = 0;
      state.lastTime = video.currentTime;
      return false;
    }
    if (video.currentTime !== state.lastTime) {
      state.lastTime = video.currentTime;
      state.stalledSince = 0;
      return false;
    }
    if (state.stalledSince === 0) {
      state.stalledSince = now;
      return false;
    }
    if (now - state.lastRecovery < COOLDOWN_MS) {
      return false;
    }
    return now - state.stalledSince >= GRACE_MS;
  }

  // Rewind lands the playhead back inside contiguously buffered data, before
  // whatever hole or rendition boundary caused the stall. When the playhead
  // sits just past the end of a buffered range (a small hole — a failed or
  // timed-out segment), rewind only enough to land just inside that range
  // instead of the full SEEK_BACK_S: the seek alone re-triggers the missing
  // fetch, so a minimal rewind is less disruptive.
  function computeResumeTime(video) {
    const t = video.currentTime;
    if (video.buffered) {
      for (let i = 0; i < video.buffered.length; i++) {
        const start = video.buffered.start(i);
        const end = video.buffered.end(i);
        if (t >= start && t <= end) {
          break; // playhead is inside a range: use the default rewind
        }
        if (end < t && t - end < SEEK_BACK_S) {
          return Math.max(start, end - 1);
        }
      }
    }
    return Math.max(0, Math.min(t - SEEK_BACK_S, video.duration));
  }

  function recover(video, now, state) {
    const resumeAt = computeResumeTime(video);
    state.lastRecovery = now;
    state.stalledSince = 0;
    state.lastTime = resumeAt;
    state.recoveries += 1;
    video.currentTime = resumeAt;
    const playPromise = video.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(function () {
        // Autoplay policies may reject; the user pressing play still benefits
        // from the re-anchored position.
      });
    }
    if (typeof console !== 'undefined' && console.info) {
      console.info(
        '[stall-guard] recovered stall at ' +
          video.currentTime.toFixed(1) +
          's (recovery #' +
          state.recoveries +
          ')'
      );
    }
  }

  function makeState() {
    return { lastTime: -1, stalledSince: 0, lastRecovery: -COOLDOWN_MS, recoveries: 0 };
  }

  const api = {
    shouldRecover: shouldRecover,
    computeResumeTime: computeResumeTime,
    recover: recover,
    makeState: makeState,
    GRACE_MS: GRACE_MS,
    SEEK_BACK_S: SEEK_BACK_S,
    COOLDOWN_MS: COOLDOWN_MS,
    POLL_MS: POLL_MS
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
    return; // unit-test context: do not touch the page
  }

  // --- content-script runtime ---------------------------------------------

  const watched = new WeakMap();

  function watch(video) {
    if (watched.has(video)) {
      return;
    }
    const state = makeState();
    watched.set(video, state);
    if (typeof console !== 'undefined' && console.info) {
      console.info('[stall-guard] watching video in frame ' + window.location.host);
    }
    setInterval(function () {
      if (shouldRecover(video, Date.now(), state)) {
        recover(video, Date.now(), state);
      }
    }, POLL_MS);
  }

  function scan() {
    if (typeof document === 'undefined' || !document) {
      return;
    }
    const videos = document.querySelectorAll('video');
    for (let i = 0; i < videos.length; i++) {
      watch(videos[i]);
    }
  }

  scan();

  // Player iframes create their <video> late; keep looking for new ones.
  // The guard above also protects this observer callback after teardown.
  const observer = new MutationObserver(function () {
    scan();
  });
  if (document.documentElement) {
    observer.observe(document.documentElement, { childList: true, subtree: true });
  }
})();
