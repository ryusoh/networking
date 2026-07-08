const path = require('path');
const { instrumentFile } = require('./helpers/instrument');

describe('Forum Ad Blocker - DoubleClick and Erebor', () => {
  beforeEach(() => {
    document.documentElement.innerHTML = '<html><head></head><body></body></html>';
    jest.resetModules();
    jest.clearAllMocks();
  });

  function loadScript() {
    const code = instrumentFile(path.resolve(__dirname, '../forum-ad-blocker.js'));
    eval(code);
  }

  it('removes DoubleClick elements and crawls up to find ad containers', () => {
    delete window.location;
    window.location = { hostname: 'example.com' };

    document.body.innerHTML = `
      <div id="bsa-zone-123">
        <div>
           <a href="https://adclick.g.doubleclick.net/abc" id="ad-link-1">Click me</a>
        </div>
      </div>

      <div class="ad-container">
         <img src="https://s2.2mdn.net/123.jpg" id="ad-img-1" />
      </div>

      <div id="div-gpt-ad-12345">
         <a id="img_anch_1" href="#">ad</a>
      </div>

      <div class="ad-slot">
         <a href="https://ad.doubleclick.net/xyz">Link</a>
      </div>

      <div class="ad-unit">
         <img src="https://tpc.googlesyndication.com/simgad/123" />
      </div>

      <div id="buysellads-container">
        <a href="https://adclick.g.doubleclick.net/def">Link</a>
      </div>

      <div class="some-bsa-class">
        <a href="https://adclick.g.doubleclick.net/ghi">Link</a>
      </div>

      <div id="normal-div">
        <div>
          <div>
            <div>
              <div>
                <div>
                  <div>
                    <div>
                      <div>
                        <div>
                          <div>
                            <a href="https://adclick.g.doubleclick.net/deep">Deep</a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    loadScript();

    // Check if the ad containers were hidden (display: none)
    expect(document.getElementById('bsa-zone-123').style.display).toBe('none');
    expect(document.querySelector('.ad-container').style.display).toBe('none');
    expect(document.getElementById('div-gpt-ad-12345').style.display).toBe('none');
    expect(document.querySelector('.ad-slot').style.display).toBe('none');
    expect(document.querySelector('.ad-unit').style.display).toBe('none');
    expect(document.getElementById('buysellads-container').style.display).toBe('none');
    expect(document.querySelector('.some-bsa-class').style.display).toBe('none');

    // For the deep one, it crawls up to 10 parents, and since none match the criteria, it just hides the 10th parent (or similar)
    const deepLink = document.querySelector('a[href*="deep"]');
    // We just verify it doesn't crash and hides something in the hierarchy
    let hiddenNode = false;
    let node = deepLink;
    while (node && node !== document.body) {
      if (node.style && node.style.display === 'none') {
        hiddenNode = true;
        break;
      }
      node = node.parentElement;
    }
    expect(hiddenNode).toBe(true);
  });

  it('removes douban erebor ads', () => {
    delete window.location;
    window.location = { hostname: 'douban.com' };

    document.body.innerHTML = `
      <div class="customize-slot">
        <a href="https://erebor.douban.com/redirect/123">Ad</a>
      </div>
      <div class="article-card">
        <a href="https://erebor.douban.com/redirect/456">Ad</a>
      </div>
      <div class="normal-parent">
        <a href="https://erebor.douban.com/redirect/789">Ad</a>
      </div>
    `;

    loadScript();

    expect(document.querySelector('.customize-slot').style.display).toBe('none');
    expect(document.querySelector('.article-card').style.display).toBe('none');
    expect(document.querySelector('.normal-parent').style.display).toBe('none');
  });
});
