/// <reference types="vitest" />
/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import istanbul from 'vite-plugin-istanbul';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  // This setting fixes the preview port to the same
  // default as the dev server port.
  // Allows cypress e2e tests to run both on dev and
  // on preview.
  preview: {
    port: 5173,
    strictPort: true,
    host: true,
  },
  test: {
    environment: 'jsdom',
    coverage: {
      provider: 'istanbul',
      reporter: ['json'],
    },
  },
  plugins: [
    react(),
    istanbul({
      cypress: true,
      requireEnv: false,
      nycrcPath: './.nycrc.json',
      forceBuildInstrument: true,
    }),
  ],
  resolve: {
    alias: {
      '~': resolve(__dirname, 'src'),
    },
  },
});
