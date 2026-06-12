
describe('nytimes-unlocked.js', () => {
    beforeEach(() => { delete window.location; window.location = { hostname: 'example.com', pathname: '/test', href: 'https://example.com/test', search: '', protocol: 'https:', assign: jest.fn(), replace: jest.fn(), reload: jest.fn() };
        jest.resetModules();
        jest.clearAllMocks();
    });

    it('loads without crashing', () => {
        const code = require('fs').readFileSync(require('path').join(__dirname, 'nytimes-unlocked.js'), 'utf8'); eval(code);
    });
});
