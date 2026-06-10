// xhs-keepalive.js
// Silent randomized heartbeat to keep Xiaohongshu session alive.

function getRandomInterval(minMins, maxMins) {
  const minMs = minMins * 60 * 1000;
  const maxMs = maxMins * 60 * 1000;
  return Math.floor(Math.random() * (maxMs - minMs + 1) + minMs);
}

function sendHeartbeat() {
  try {
    fetch('https://www.xiaohongshu.com/explore', {
      method: 'GET',
      credentials: 'include',
      cache: 'no-store'
    })
      .then(() => {
        // Silently succeed or fail
      })
      .catch(() => {
        // Suppress network errors to not disturb vibe
      });
  } catch (e) {
    // Suppress synchronous errors
  }
}

function scheduleNextHeartbeat() {
  const nextInterval = getRandomInterval(8, 15);
  setTimeout(() => {
    sendHeartbeat();
    scheduleNextHeartbeat();
  }, nextInterval);
}

// Start the cycle
scheduleNextHeartbeat();
