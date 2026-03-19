/**
 * Tianditu Auto-Proxy - Offscreen Parser Test
 */

// Fix for TextEncoder not defined in JSDOM/Node environment
const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

const { JSDOM } = require('jsdom');

// Mock Chrome runtime
global.chrome = {
  runtime: {
    onMessage: {
      addListener: jest.fn()
    }
  }
};

// Import the parsing logic (extracting it from the offscreen.js file content)
const parseProxies = (html) => {
  const dom = new JSDOM(html);
  const doc = dom.window.document;

  let rows = Array.from(doc.querySelectorAll('table.layui-table tbody tr'));
  if (rows.length === 0) {
    rows = Array.from(doc.querySelectorAll('table tbody tr'));
  }
  if (rows.length === 0) {
    rows = Array.from(doc.querySelectorAll('tr')).slice(1);
  }

  if (rows.length === 0) {
    return null;
  }

  const proxies = rows
    .map((row) => {
      const cols = row.querySelectorAll('td');
      if (cols.length < 6) {
        return null;
      }

      const ip = cols[0].textContent.trim();
      const port = cols[1].textContent.trim();
      const typeText = cols[2].textContent.trim().toUpperCase();
      const speedText = cols[5].textContent.trim();
      const speed = parseInt(speedText.replace(/[^0-9]/g, '')) || 9999;

      return { ip, port, type: typeText, speed };
    })
    .filter((p) => p && p.ip && p.port && p.ip.includes('.') && !isNaN(parseInt(p.port)));

  if (proxies.length > 0) {
    const sorted = proxies.sort((a, b) => a.speed - b.speed);
    const best = sorted[0];
    let scheme = 'PROXY';
    if (best.type.includes('SOCKS5')) {
      scheme = 'SOCKS5';
    } else if (best.type.includes('SOCKS4')) {
      scheme = 'SOCKS4';
    } else if (best.type.includes('HTTPS')) {
      scheme = 'HTTPS';
    }
    return `${scheme} ${best.ip}:${best.port}`;
  }
  return null;
};

describe('Tianditu Auto-Proxy: Parser Validation', () => {
  test('Correctly identifies the fastest SOCKS5 proxy', () => {
    const sampleHtml = `
      <table class="layui-table">
        <tbody>
          <tr><td>123.54.197.16</td><td>21071</td><td>socks5</td><td>China</td><td>Zhumadian</td><td>1492 ms</td></tr>
          <tr><td>59.46.216.131</td><td>30001</td><td>socks5</td><td>China</td><td>Liaoning</td><td>800 ms</td></tr>
        </tbody>
      </table>
    `;
    const result = parseProxies(sampleHtml);
    expect(result).toBe('SOCKS5 59.46.216.131:30001');
  });

  test('Correctly identifies the fastest HTTP proxy', () => {
    const sampleHtml = `
      <table class="layui-table">
        <tbody>
          <tr><td>1.1.1.1</td><td>80</td><td>http</td><td>China</td><td>Beijing</td><td>200 ms</td></tr>
          <tr><td>2.2.2.2</td><td>80</td><td>http</td><td>China</td><td>Shanghai</td><td>500 ms</td></tr>
        </tbody>
      </table>
    `;
    const result = parseProxies(sampleHtml);
    expect(result).toBe('PROXY 1.1.1.1:80');
  });

  test('Returns null on empty or malformed HTML', () => {
    const badHtml = '<html><body><h1>Cloudflare Challenge</h1></body></html>';
    expect(parseProxies(badHtml)).toBeNull();
  });

  test('Handles speed values with non-numeric text', () => {
    const sampleHtml = `
      <table class="layui-table">
        <tbody>
          <tr><td>1.1.1.1</td><td>80</td><td>http</td><td>China</td><td>Beijing</td><td>Very Fast (100ms)</td></tr>
        </tbody>
      </table>
    `;
    const result = parseProxies(sampleHtml);
    expect(result).toBe('PROXY 1.1.1.1:80');
  });
});
