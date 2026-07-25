// StrykerJS config — NON-BLOCKING mutation-testing scaffold (`make mutate-js`).
// Not part of any gate: `make precommit` never runs this. Scoped to one small,
// well-covered file (picker.js: 100% statements) so a smoke run finishes in
// minutes; widen `mutate` deliberately, one file at a time.
// Incremental mode caches results in .stryker-tmp/ (gitignored).
/** @type {import('@stryker-mutator/api/core').PartialStrykerOptions} */
export default {
  mutate: ['clean_adblock/picker.js'],
  testRunner: 'jest',
  reporters: ['clear-text', 'progress'],
  incremental: true,
  // Smoke-scaffold thresholds: informational only, never wired into a gate.
  thresholds: { high: 80, low: 60, break: null },
  timeoutMS: 30000
};
