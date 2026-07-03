describe('nytimes-unlocked.js', () => {
  let originalWindowLocation;
  beforeEach(() => {
    document.documentElement.innerHTML = '<html><head></head><body></body></html>';

    // Save original location
    originalWindowLocation = window.location;
    delete window.location;
    window.location = {
      hostname: 'www.nytimes.com',
      pathname: '/test',
      href: 'https://www.nytimes.com/test',
      search: '',
      protocol: 'https:',
      assign: jest.fn(),
      replace: jest.fn(),
      reload: jest.fn()
    };

    // Make sure origScrollTo won't crash
    window.scrollTo = jest.fn();

    jest.resetModules();
    jest.clearAllMocks();
  });

  afterEach(() => {
    window.location = originalWindowLocation;
    // Clear DOM to avoid unhandled async errors
    document.documentElement.innerHTML = '';
  });

  it('runs main removal script', () => {
    document.body.innerHTML = `
      <div id="gateway-content"></div>
      <div class="vi-gateway-container"></div>
      <iframe src="regiwall"></iframe>
      <p role="note"><a href="subscription">Subscribe</a></p>
      <article inert="true"></article>
      <section name="articleBody">
         <p>Existing paragraph</p>
         <div class="StoryBodyCompanionColumn"><div class="css-53u6y8"></div></div>
      </section>
    `;

    // Inject fake data
    window.__preloadedData = {
      initialData: {
        data: {
          article: {
            sprinkledBody: {
              content: [
                {
                  __typename: 'ParagraphBlock',
                  content: [
                    { __typename: 'TextInline', text: 'New content 1' },
                    {
                      __typename: 'TextInline',
                      text: 'bold',
                      formats: [{ __typename: 'BoldFormat' }]
                    },
                    {
                      __typename: 'TextInline',
                      text: 'italic',
                      formats: [{ __typename: 'ItalicFormat' }]
                    }
                  ]
                }
              ]
            }
          }
        }
      }
    };

    const { instrumentFile } = require('./helpers/instrument');
    const code = instrumentFile(require('path').join(__dirname, '..', 'nytimes-unlocked.js'));
    eval(code);

    document.dispatchEvent(new Event('DOMContentLoaded'));

    expect(document.getElementById('gateway-content').style.display).toBe('none');
    expect(document.querySelector('article').hasAttribute('inert')).toBeFalsy();

    // Trigger scroll wheel
    const event = new Event('wheel');
    window.dispatchEvent(event);
    window.scrollTo(0, 0); // test the intercept
    window.scrollTo({ top: 0, left: 0 }); // test the intercept

    // Add wait to allow observer to detach/complete
    return new Promise((resolve) => setTimeout(resolve, 100));
  });
});

describe('nytimes-unlocked.js additional tests', () => {
  let originalWindowLocation;
  beforeEach(() => {
    document.documentElement.innerHTML = '<html><head></head><body></body></html>';

    // Save original location
    originalWindowLocation = window.location;
    delete window.location;
    window.location = {
      hostname: 'www.nytimes.com',
      pathname: '/test',
      href: 'https://www.nytimes.com/test',
      search: '',
      protocol: 'https:',
      assign: jest.fn(),
      replace: jest.fn(),
      reload: jest.fn()
    };

    // Make sure origScrollTo won't crash
    window.scrollTo = jest.fn();

    jest.resetModules();
    jest.clearAllMocks();
  });

  afterEach(() => {
    window.location = originalWindowLocation;
    // Clear DOM to avoid unhandled async errors
    document.documentElement.innerHTML = '';
  });

  it('returns early when not nytimes.com', () => {
    window.location.hostname = 'example.com';
    const { instrumentFile } = require('./helpers/instrument');
    const code = instrumentFile(require('path').join(__dirname, '..', 'nytimes-unlocked.js'));
    eval(code);
    expect(document.getElementById('nyt-unlocked-css')).toBeNull();
  });

  it('handles missing companion column gracefully', () => {
    document.body.innerHTML = `
      <section name="articleBody">
         <p>Existing paragraph</p>
         <!-- missing companion column -->
      </section>
    `;

    window.__preloadedData = {
      initialData: {
        data: {
          article: {
            sprinkledBody: {
              content: [
                {
                  __typename: 'ParagraphBlock',
                  content: [{ __typename: 'TextInline', text: 'New content' }]
                }
              ]
            }
          }
        }
      }
    };

    const { instrumentFile } = require('./helpers/instrument');
    const code = instrumentFile(require('path').join(__dirname, '..', 'nytimes-unlocked.js'));
    eval(code);

    document.dispatchEvent(new Event('DOMContentLoaded'));

    // Should not have inserted new content anywhere without throwing
    expect(document.body.innerHTML).not.toContain('New content');
  });

  it('handles missing sprinkledBody content gracefully', () => {
    document.body.innerHTML = `
      <section name="articleBody">
         <div class="StoryBodyCompanionColumn"><div class="css-53u6y8"></div></div>
      </section>
    `;

    window.__preloadedData = {
      initialData: {
        data: {
          article: {
            sprinkledBody: {
              // missing content array
            }
          }
        }
      }
    };

    const { instrumentFile } = require('./helpers/instrument');
    const code = instrumentFile(require('path').join(__dirname, '..', 'nytimes-unlocked.js'));
    eval(code);
    document.dispatchEvent(new Event('DOMContentLoaded'));

    expect(document.body.innerHTML).not.toContain('New content');
  });

  it('handles missing initialData gracefully', () => {
    window.__preloadedData = {
      // missing initialData
    };
    const { instrumentFile } = require('./helpers/instrument');
    const code = instrumentFile(require('path').join(__dirname, '..', 'nytimes-unlocked.js'));
    expect(() => eval(code)).not.toThrow();
  });

  it('hides gateway iframes and unsupported overlay formats', () => {
    jest.useFakeTimers();

    document.body.innerHTML = `
      <div class="css-gx5sib"></div>
      <div style="position: absolute; display: block;">
        <iframe src="gateway"></iframe>
      </div>
      <p role="note"><a href="campaignId">Subscribe</a></p>
      <section name="articleBody">
         <div data-testid="companionColumn-0"><div></div></div>
      </section>
    `;
    window.__preloadedData = {
      initialData: {
        data: {
          article: {
            sprinkledBody: {
              content: [
                {
                  __typename: 'ParagraphBlock',
                  content: [{ __typename: 'TextInline', text: 'New content' }]
                },
                {
                  __typename: 'OtherBlock'
                }
              ]
            }
          }
        }
      }
    };

    const { instrumentFile } = require('./helpers/instrument');
    const code = instrumentFile(require('path').join(__dirname, '..', 'nytimes-unlocked.js'));
    eval(code);

    document.dispatchEvent(new Event('DOMContentLoaded'));
    jest.advanceTimersByTime(3100);

    // Scrim hidden
    expect(document.querySelector('.css-gx5sib').style.display).toBe('none');

    // Gateway iframe hidden via wrapper
    const iframeWrap = document.querySelector('iframe[src="gateway"]').parentElement;
    expect(iframeWrap.style.display).toBe('none');

    // Campaign ID CTA hidden
    expect(document.querySelector('p[role="note"]').style.display).toBe('none');

    // Companion column received paragraph
    const companion = document.querySelector('[data-testid="companionColumn-0"] > div');
    expect(companion.innerHTML).toContain('New content');

    jest.useRealTimers();
  });
});
