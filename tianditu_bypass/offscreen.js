/**
 * Tianditu Auto-Proxy - Offscreen Parser
 * Parses the proxy list from freeproxy.world and picks the best one.
 */

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'PARSE_PROXIES_LIST') {
    const parser = new DOMParser();
    const doc = parser.parseFromString(request.html, 'text/html');

    let rows = Array.from(doc.querySelectorAll('table.layui-table tbody tr'));
    if (rows.length === 0) {
      rows = Array.from(doc.querySelectorAll('table tbody tr'));
    }
    if (rows.length === 0) {
      rows = Array.from(doc.querySelectorAll('tr')).slice(1);
    }

    if (rows.length === 0) {
      console.warn('No rows found in table. Check if site structure changed or if blocked by WAF.');
      sendResponse({ proxies: [] });
      return true;
    }

    const proxies = rows
      .map((row) => {
        const cols = row.querySelectorAll('td');
        if (cols.length < 6) {
          return null;
        }

        const ip = cols[0].textContent.trim();
        const port = cols[1].textContent.trim();
        const typeText = cols[5].textContent.trim().toUpperCase();
        const speedText = cols[4].textContent.trim();
        const speed = parseInt(speedText.replace(/[^0-9]/g, '')) || 9999;

        let scheme = 'PROXY';
        if (typeText.includes('SOCKS5')) {
          scheme = 'SOCKS5';
        } else if (typeText.includes('SOCKS4')) {
          scheme = 'SOCKS4';
        } else if (typeText.includes('HTTPS')) {
          scheme = 'HTTPS';
        }

        return { ip, port, scheme, speed };
      })
      .filter((p) => p && p.ip && p.port && p.ip.includes('.') && !isNaN(parseInt(p.port)));

    if (proxies.length > 0) {
      // Sort by speed (latency) ascending (lower is better)
      const sorted = proxies.sort((a, b) => a.speed - b.speed);
      console.log(`Parsed ${sorted.length} proxies from source.`);
      sendResponse({ proxies: sorted });
    } else {
      console.warn('No valid proxies parsed from rows.');
      sendResponse({ proxies: [] });
    }
    return true;
  }
});
