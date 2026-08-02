// Coverage for eval'd content scripts.
//
// Several content scripts are browser IIFEs that touch `document`/`window` on
// load, so their tests run them with `eval(fs.readFileSync(...))` in the test's
// own scope rather than `require()`. That bypasses Jest's babel-plugin-istanbul
// transform, so those files report 0% coverage even though the tests exercise
// them. Instrumenting the source here — with the same `__coverage__` global Jest
// collects from (default `babel` coverage provider) — restores real numbers.
//
// Usage (keep the eval in the test so jsdom scope is unchanged):
//   const { instrumentFile } = require('./helpers/instrument');
//   const code = instrumentFile(require('path').join(__dirname, '..', 'foo.js'));
//   eval(code);
const fs = require('fs');
const { createInstrumenter } = require('istanbul-lib-instrument');

const instrumenter = createInstrumenter({
  esModules: false,
  coverageVariable: '__coverage__'
});

/**
 * Read a script and return an instrumented version suitable for `eval()`.
 * Pass the same absolute path Jest's `collectCoverageFrom` resolves to, so the
 * coverage key matches and the report shows real coverage instead of 0%.
 * @param {string} absPath absolute path to the source file
 * @returns {string} instrumented source
 */
function instrumentFile(absPath) {
  const source = fs.readFileSync(absPath, 'utf8');
  return instrumenter.instrumentSync(source, absPath);
}

module.exports = { instrumentFile };
