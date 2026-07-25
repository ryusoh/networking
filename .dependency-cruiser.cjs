/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: 'no-circular',
      comment: 'Circular deps make modules untestable in isolation',
      severity: 'error',
      from: {},
      to: { circular: true }
    },
    {
      name: 'no-cross-subproject-imports',
      comment:
        'AGENTS.md non-negotiable #2: subprojects are independent — ' +
        'clean_adblock and tianditu_bypass must not import each other',
      severity: 'error',
      from: { path: '^(clean_adblock|tianditu_bypass)/' },
      to: { path: '^(clean_adblock|tianditu_bypass)/', pathNot: '^$1/' }
    },
    {
      name: 'prod-not-to-tests',
      comment:
        'production source must not import test code (helpers/ is test ' +
        'support, excluded from test discovery per AGENTS.md)',
      severity: 'error',
      from: { pathNot: '(__tests__|jest\\.setup\\.js)' },
      to: { path: '__tests__' }
    }
  ],
  options: {
    // No alias config on purpose: this repo has no path aliases (no import
    // map, no jsconfig.json `paths`, no bare specifiers — the graph resolves
    // fully with zero couldNotResolve). If aliases are ever added, resolve
    // them via a webpack-config stub (see fund's
    // .dependency-cruiser.webpack.cjs), never options.tsConfig: the tsConfig
    // route makes dependency-cruiser look for a typescript <7 compiler (this
    // repo has v7) and print a spurious "missing-typescript-transpiler"
    // warning every run.
    doNotFollow: { path: 'node_modules' },
    // _metadata/__pycache__: generated. clean_adblock/types: .d.ts
    // declarations only (JSDoc type-check surface, no runtime imports).
    exclude: { path: '(_metadata|__pycache__|clean_adblock/types)' }
  }
};
