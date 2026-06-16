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
