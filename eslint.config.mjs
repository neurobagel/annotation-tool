import eslint from '@eslint/js';
import stylisticPlugin from '@stylistic/eslint-plugin';
import cypressPlugin from 'eslint-plugin-cypress/flat';
import importPlugin from 'eslint-plugin-import';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import reactRefreshPlugin from 'eslint-plugin-react-refresh';
import tsdocPlugin from 'eslint-plugin-tsdoc';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { customRules } from './eslint-custom-rules.js';

export default tseslint.config(
  {
    ignores: [
      'dist/',
      'lint-staged.config.js',
      'eslint.config.mjs',
      'eslint-freeze.json',
      'eslint-custom-rules.js',
      'test-rules.mjs',
    ],
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
      import: importPlugin,
      'jsx-a11y': jsxA11yPlugin,
      '@stylistic': stylisticPlugin,
    },
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      parserOptions: {
        project: ['./tsconfig.*json'],
        ecmaFeatures: {
          jsx: true,
          generators: false,
          objectLiteralDuplicateProperties: false,
        },
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
      ...customRules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'react/react-in-jsx-scope': 'off',
      'react/require-default-props': 'off',
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
      'react/jsx-props-no-spreading': 'off',
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
        pragma: 'React',
        version: 'detect',
      },
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx', '.d.ts'],
      },
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
        },
        node: {
          extensions: ['.mjs', '.js', '.jsx', '.json', '.ts', '.tsx', '.d.ts'],
        },
      },
      'import/extensions': ['.js', '.mjs', '.jsx', '.ts', '.tsx', '.d.ts'],
      'import/external-module-folders': ['node_modules', 'node_modules/@types'],
      propWrapperFunctions: ['forbidExtraProps', 'exact', 'Object.freeze'],
      'import/core-modules': [],
      'import/ignore': ['node_modules', '\\.(coffee|scss|css|less|hbs|svg|json)$'],
    },
  }
);
