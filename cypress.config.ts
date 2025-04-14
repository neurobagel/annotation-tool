/* eslint-disable import/no-extraneous-dependencies */
import codeCoverageTask from '@cypress/code-coverage/task.js';
import { defineConfig } from 'cypress';

export default defineConfig({
  viewportWidth: 1280,
  viewportHeight: 720,
  e2e: {
    experimentalStudio: true,
    baseUrl: 'http://localhost:5173',
    setupNodeEvents(on, config) {
      codeCoverageTask(on, config);
      return config;
    },
  },

  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite',
    },
    setupNodeEvents(on, config) {
      codeCoverageTask(on, config);
      return config;
    },
  },
});
