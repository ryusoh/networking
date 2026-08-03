'use strict';

const path = require('path');
const { instrumentFile } = require('./helpers/instrument');

describe('gov_bypass offscreen.js', () => {
  let messageListener;

  beforeEach(() => {
    messageListener = null;
    global.chrome = {
      runtime: {
        onMessage: {
          addListener: (fn) => {
            messageListener = fn;
          }
        }
      }
    };

    global.fetch = jest.fn();

    // Manual stub for DOMParser
    global.DOMParser = class {
      parseFromString(html) {
        // Very basic stub just to make tests pass that depend on parseFromString returning a document-like object
        // JSDOM in Node doesn't always expose window.DOMParser appropriately directly to the eval scope
        // We will mock the required querySelectorAll functionality specifically for these tests
        return {
          querySelectorAll: (selector) => {
            if (html === 'bad') {
              throw new Error('parse error');
            }
            if (selector === 'table.layui-table tbody tr') {
              if (html.includes('layui-table')) {
                return [
                  {
                    querySelectorAll: () => [
                      { textContent: '192.168.1.100' },
                      { textContent: '8080' },
                      { textContent: 'China' },
                      { textContent: 'City' },
                      { textContent: '150 ms' },
                      { textContent: 'SOCKS5' }
                    ]
                  }
                ];
              }
              return [];
            }
            if (selector === 'table tbody tr') {
              if (html.includes('SOCKS4')) {
                return [
                  {
                    querySelectorAll: () => [
                      { textContent: '192.168.1.100' },
                      { textContent: '8080' },
                      { textContent: 'China' },
                      { textContent: 'City' },
                      { textContent: '150 ms' },
                      { textContent: 'SOCKS4' }
                    ]
                  }
                ];
              }
              return [];
            }
            if (selector === 'tr') {
              return [
                {}, // First row usually ignored or headers
                {
                  querySelectorAll: () => [
                    { textContent: '192.168.1.100' },
                    { textContent: '8080' },
                    { textContent: 'China' },
                    { textContent: 'City' },
                    { textContent: '150 ms' },
                    { textContent: 'UNKNOWN' }
                  ]
                }
              ];
            }
            if (selector === 'table tr') {
              return [
                {}, // First row is header
                {
                  querySelectorAll: () => [
                    { textContent: '10.0.0.1' },
                    { textContent: '3128' },
                    { textContent: 'HTTPS' },
                    { textContent: '45 ms' }
                  ]
                }
              ];
            }
            return [];
          }
        };
      }
    };

    const srcPath = path.resolve(__dirname, '../offscreen.js');
    const instrumented = instrumentFile(srcPath);
    eval(instrumented);
  });

  afterEach(() => {
    delete global.chrome;
    delete global.fetch;
    delete global.DOMParser;
  });

  test('FETCH_HTML performs a fetch with random UA and returns HTML text on success', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      text: async () => '<html>fake</html>'
    });

    const sendResponse = jest.fn();

    const isAsync = messageListener(
      { type: 'FETCH_HTML', url: 'http://test.local' },
      {},
      sendResponse
    );
    expect(isAsync).toBe(true);

    await new Promise((res) => setTimeout(res, 0));

    expect(global.fetch).toHaveBeenCalledWith(
      'http://test.local',
      expect.objectContaining({
        headers: expect.objectContaining({
          'Upgrade-Insecure-Requests': '1',
          'User-Agent': expect.any(String)
        })
      })
    );

    expect(sendResponse).toHaveBeenCalledWith({ html: '<html>fake</html>' });
  });

  test('FETCH_HTML returns error gracefully on network failure', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network disconnected'));

    const sendResponse = jest.fn();
    const isAsync = messageListener(
      { type: 'FETCH_HTML', url: 'http://test.local' },
      {},
      sendResponse
    );
    expect(isAsync).toBe(true);

    await new Promise((res) => setTimeout(res, 0));

    expect(sendResponse).toHaveBeenCalledWith({ error: 'Error: Network disconnected' });
  });

  test('FETCH_HTML returns error on non-ok HTTP status', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 403,
      statusText: 'Forbidden'
    });

    const sendResponse = jest.fn();
    messageListener({ type: 'FETCH_HTML', url: 'http://test.local' }, {}, sendResponse);
    await new Promise((res) => setTimeout(res, 0));
    expect(sendResponse).toHaveBeenCalledWith({ error: 'Error: HTTP 403: Forbidden' });
  });

  test('PARSE_PROXIES_MULTI correctly parses freeproxyworld table format', () => {
    const html = 'layui-table';
    const sendResponse = jest.fn();
    const isAsync = messageListener(
      { type: 'PARSE_PROXIES_MULTI', html, sourceType: 'freeproxyworld' },
      {},
      sendResponse
    );

    expect(isAsync).toBe(true);
    expect(sendResponse).toHaveBeenCalledWith({
      proxies: [{ ip: '192.168.1.100', port: '8080', scheme: 'SOCKS5', speed: 150 }]
    });
  });

  test('PARSE_PROXIES_MULTI correctly parses databay table format', () => {
    const html = 'databay';
    const sendResponse = jest.fn();
    messageListener({ type: 'PARSE_PROXIES_MULTI', html, sourceType: 'databay' }, {}, sendResponse);

    expect(sendResponse).toHaveBeenCalledWith({
      proxies: [{ ip: '10.0.0.1', port: '3128', scheme: 'HTTPS', speed: 45 }]
    });
  });

  test('PARSE_PROXIES_MULTI handles parsing error gracefully', () => {
    const sendResponse = jest.fn();

    messageListener(
      { type: 'PARSE_PROXIES_MULTI', html: 'bad', sourceType: 'freeproxyworld' },
      {},
      sendResponse
    );
    expect(sendResponse).toHaveBeenCalledWith({ error: 'Error: parse error', proxies: [] });
  });

  test('PARSE_PROXIES_MULTI parses raw text NAS proxies', () => {
    const text = '192.168.1.1:1080\n10.0.0.2:3128\nbadline\n';
    const sendResponse = jest.fn();
    messageListener(
      { type: 'PARSE_PROXIES_MULTI', html: text, sourceType: 'raw_text' },
      {},
      sendResponse
    );

    expect(sendResponse).toHaveBeenCalledWith({
      proxies: [
        { ip: '192.168.1.1', port: '1080', scheme: 'SOCKS5', speed: 10 },
        { ip: '10.0.0.2', port: '3128', scheme: 'SOCKS5', speed: 10 }
      ]
    });
  });

  test('PARSE_PROXIES_MULTI parses freeproxyworld alternative table format', () => {
    const html = 'SOCKS4';
    const sendResponse = jest.fn();
    messageListener(
      { type: 'PARSE_PROXIES_MULTI', html, sourceType: 'freeproxyworld' },
      {},
      sendResponse
    );

    expect(sendResponse).toHaveBeenCalledWith({
      proxies: [{ ip: '192.168.1.100', port: '8080', scheme: 'SOCKS4', speed: 150 }]
    });
  });

  test('PARSE_PROXIES_MULTI parses freeproxyworld fallback format', () => {
    const html = 'fallback';
    const sendResponse = jest.fn();
    messageListener(
      { type: 'PARSE_PROXIES_MULTI', html, sourceType: 'freeproxyworld' },
      {},
      sendResponse
    );

    expect(sendResponse).toHaveBeenCalledWith({
      proxies: [{ ip: '192.168.1.100', port: '8080', scheme: 'PROXY', speed: 150 }]
    });
  });
});
