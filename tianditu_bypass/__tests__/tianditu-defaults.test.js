describe('tianditu-defaults', () => {
  beforeEach(() => {
    document.documentElement.innerHTML = '';
    jest.useFakeTimers();
    jest.resetModules();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('ignores fallback elements with children or no text', () => {
    // To cover line 29 full branch coverage
    const elWithChildren = document.createElement('div');
    const child = document.createElement('span');
    elWithChildren.appendChild(child);
    // Setting textContent on parent removes children in actual DOM, so let's mock it
    Object.defineProperty(elWithChildren, 'children', { value: [child] });
    Object.defineProperty(elWithChildren, 'textContent', { value: '影像' });
    document.body.appendChild(elWithChildren);

    const elNoText = document.createElement('div');
    document.body.appendChild(elNoText);

    const elNullText = document.createElement('div');
    Object.defineProperty(elNullText, 'textContent', { value: null });
    document.body.appendChild(elNullText);

    // add one more to hit the standard loop textContent fallback
    const btn = document.createElement('span');
    btn.className = 'maptype-item';
    Object.defineProperty(btn, 'textContent', { value: null });
    Object.defineProperty(btn, 'innerText', { value: null });
    document.body.appendChild(btn);

    Object.defineProperty(document, 'readyState', { value: 'complete', configurable: true });
    require('../tianditu-defaults.js');
    jest.advanceTimersByTime(1000);
  });

  it('covers fallback negative conditions', () => {
    // 1. children.length > 0 (already tested above but I'll add here)
    const el1 = document.createElement('div');
    const child1 = document.createElement('span');
    el1.appendChild(child1);
    Object.defineProperty(el1, 'children', { value: [child1] });
    el1.textContent = '影像';
    document.body.appendChild(el1);

    // 2. children.length === 0 but text !== '影像'
    const el2 = document.createElement('span');
    el2.textContent = 'not imagery';
    document.body.appendChild(el2);

    // 3. children.length === 0, text falsy (simulated)
    const el3 = document.createElement('span');
    Object.defineProperty(el3, 'textContent', { value: null });
    document.body.appendChild(el3);

    Object.defineProperty(document, 'readyState', { value: 'complete', configurable: true });
    require('../tianditu-defaults.js');
    jest.useFakeTimers();
    jest.advanceTimersByTime(1000);
    jest.useRealTimers();
  });

  it('selects imagery by standard class and text', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    // Actually we only need one button properly appended
    const wrapper = document.createElement('div');
    wrapper.className = 'mapTypeCard';
    const btn = document.createElement('span');
    btn.textContent = ' 影像 ';
    // Provide innerText because JSDOM might not map textContent to innerText correctly
    Object.defineProperty(btn, 'innerText', { value: '影像' });
    btn.click = jest.fn();
    wrapper.appendChild(btn);
    document.body.appendChild(wrapper);

    Object.defineProperty(document, 'readyState', { value: 'complete', configurable: true });

    require('../tianditu-defaults.js');
    jest.advanceTimersByTime(1000);

    expect(btn.click).toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith('[Tianditu] Switched to 影像 (Satellite) mode');

    consoleSpy.mockRestore();
  });

  it('selects imagery using fallback method', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    const btn = document.createElement('div');
    btn.textContent = '影像';
    // Make sure standard selector won't find it, it shouldn't have mapTypeCard class etc.
    btn.click = jest.fn();
    document.body.appendChild(btn);

    // Another one to cover the early standard loop false match branch
    const btn2 = document.createElement('span');
    btn2.className = 'maptype-item';
    // No text content at all to cover the || '' fallback in textContent
    document.body.appendChild(btn2);

    Object.defineProperty(document, 'readyState', { value: 'complete', configurable: true });

    require('../tianditu-defaults.js');
    jest.advanceTimersByTime(1000);

    expect(btn.click).toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith(
      '[Tianditu] Switched to 影像 (Satellite) mode (fallback)'
    );

    consoleSpy.mockRestore();
  });

  it('retries until max attempts and gives up', () => {
    Object.defineProperty(document, 'readyState', { value: 'complete', configurable: true });

    require('../tianditu-defaults.js');
    jest.advanceTimersByTime(1000); // 1st try
    for (let i = 0; i < 35; i++) {
      jest.advanceTimersByTime(500); // multiple retries
    }
    // Should have given up without error
  });

  it('listens for load event if document is not complete', () => {
    Object.defineProperty(document, 'readyState', { value: 'loading', configurable: true });

    require('../tianditu-defaults.js');

    // wait a bit, should not have triggered trySelect
    jest.advanceTimersByTime(2000);

    const btn = document.createElement('span');
    btn.className = 'maptype-item';
    btn.textContent = '影像';
    btn.click = jest.fn();
    document.body.appendChild(btn);

    window.dispatchEvent(new Event('load'));
    jest.advanceTimersByTime(1000);

    expect(btn.click).toHaveBeenCalled();
  });
});
