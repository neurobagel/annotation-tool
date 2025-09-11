/// <reference types="vitest" />
/* eslint-disable import/no-extraneous-dependencies */
import react from '@vitejs/plugin-react-swc';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import istanbul from 'vite-plugin-istanbul';

const injectAnalytics = () => ({
  name: 'inject-analytics',
  transformIndexHtml: {
    order: 'post',
    handler(html) {
      if (!process.env.NB_ANALYTICS) {
        return html;
      }

      const snippet = `
      <script async src="https://w.appzi.io/w.js?token=YVTHd"></script>
      <script defer data-domain="annotate.neurobagel.org" src="https://plausible.neurobagel.org/js/script.js"></script>`;

      return html.replace('</head>', `${snippet}</head>`);
    },
  },
});

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
    injectAnalytics(),
  ],
  envPrefix: 'NB_',
  resolve: {
    alias: {
      '~': resolve(__dirname, 'src'),
    },
  },
});
