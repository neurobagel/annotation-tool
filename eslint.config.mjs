import eslint from '@eslint/js';
import cypressPlugin from 'eslint-plugin-cypress/flat';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import reactRefreshPlugin from 'eslint-plugin-react-refresh';
import tsdocPlugin from 'eslint-plugin-tsdoc';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['dist/', 'lint-staged.config.js', 'eslint.config.mjs', 'eslint-freeze.json'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  cypressPlugin.configs.recommended,
  {
    files: ['**/*.{ts,tsx}', '**/*.js', '**/*.cjs'],
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      'react-refresh': reactRefreshPlugin,
      tsdoc: tsdocPlugin,
    },
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.*json'],
      },
      globals: {
        ...globals.browser,
        ...globals.es2020,
        ...globals.node,
      },
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'react/react-in-jsx-scope': 'off',
      'react/require-default-props': 'off',
      'tsdoc/syntax': 'warn',
      /* 
      @typescript-eslint/no-unused-vars is turned off since eslint wasn't picking up on using `_` for unused variables
      which is the solution that we've been using for it.
      */
      '@typescript-eslint/no-unused-vars': 'off',
      /*
      The no-param-reassign rule prevents direct assignment to function parameters. 
      However, in the context of Immer, this rule can be safely ignored because 
      Immer is designed to handle mutations to the draft object in a controlled way.
      */
      'no-param-reassign': [
        'error',
        {
          props: true,
          ignorePropertyModificationsFor: ['draft'],
        },
      ],
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  }
);
