module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:cypress/recommended',
    'airbnb',
    'airbnb/hooks',
    '@kesills/airbnb-typescript',
    'prettier',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs', 'lint-staged.config.js'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['./tsconfig.*json'],
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
      },
    },
  },
  plugins: ['react-refresh', 'cypress', 'eslint-plugin-tsdoc'],
  rules: {
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    'react/react-in-jsx-scope': 'off',
    'tsdoc/syntax': 'warn',
    // Disabling this rule allows us to use blanket exports from components
    'import/prefer-default-export': 'off',
    /* 
    The fork of the eslint-config-airbnb-typescript package has added ESLint Stylistic plugin
    to the config. see:https://github.com/Kenneth-Sills/eslint-config-airbnb-typescript/pull/3
    Some of the stylistic rules are not compatible with our current prettier config so we disable them.
    */
    '@stylistic/indent': 'off',
    '@stylistic/comma-dangle': 'off',
  },
};
