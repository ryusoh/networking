
describe('popup.js', () => {
    beforeEach(() => {
        jest.resetModules();
        jest.clearAllMocks();
    });

    it('loads without crashing', () => {
        const code = require('fs').readFileSync(require('path').join(__dirname, 'popup.js'), 'utf8'); eval(code);
    });
});
