// xhs-keepalive.js
// Silent randomized heartbeat to keep Xiaohongshu session alive.

/**
 * @param {number} minMins
 * @param {number} maxMins
 * @returns {number}
 */
function getRandomInterval(minMins, maxMins) {
  const minMs = minMins * 60 * 1000;
  const maxMs = maxMins * 60 * 1000;
  return Math.floor(Math.random() * (maxMs - minMs + 1) + minMs);
}

function sendHeartbeat() {
  try {
    // Inject an invisible iframe to bypass WAF fetch anomaly detection
    const iframe = document.createElement('iframe');
    iframe.src = 'https://www.xiaohongshu.com/';
    iframe.style.width = '1px';
    iframe.style.height = '1px';
    iframe.style.position = 'absolute';
    iframe.style.top = '-9999px';
    iframe.style.left = '-9999px';
    iframe.style.opacity = '0';
    iframe.style.pointerEvents = 'none';

    // Clean up after it loads (or after 10 seconds to be safe)
    iframe.onload = () => {
      setTimeout(() => {
        if (iframe.parentNode) {
          iframe.parentNode.removeChild(iframe);
        }
      }, 2000);
    };

    setTimeout(() => {
      if (iframe.parentNode) {
        iframe.parentNode.removeChild(iframe);
      }
    }, 15000); // 15s fallback timeout

    document.body.appendChild(iframe);
  } catch {
    // Suppress synchronous errors to protect vibe
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
