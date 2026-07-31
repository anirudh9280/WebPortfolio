module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } },
  plugins: ['react-refresh'],
  rules: {
    // Off by design. Every section is exported through the SectionWrapper HOC,
    // which this rule reads as an anonymous component, and card components are
    // deliberately colocated with the section that owns them. The rule only
    // affects Fast Refresh granularity in dev, and with --max-warnings 0 it was
    // making `npm run lint` fail on the whole codebase.
    'react-refresh/only-export-components': 'off',
  },
  overrides: [
    {
      // Build config runs in Node, not the browser.
      files: ['*.config.js', 'postcss.config.js', 'tailwind.config.js'],
      env: { node: true, browser: false },
    },
  ],
}
