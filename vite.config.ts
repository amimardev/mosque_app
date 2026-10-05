import tailwindcss from '@tailwindcss/vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import react from '@vitejs/plugin-react';
import { nitro } from 'nitro/vite';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const oneSignalAppId = process.env.PLAYWRIGHT_TEST === 'true'
    ? ''
    : process.env.ONESIGNAL_APP_ID || env.ONESIGNAL_APP_ID || '';

  return {
    cacheDir: './.vite-cache',
    define: {
      // OneSignal's App ID is public. Expose this one server variable to the
      // browser SDK without exposing the server-only REST API key.
      'import.meta.env.ONESIGNAL_APP_ID': JSON.stringify(oneSignalAppId),
    },
    plugins: [
      tailwindcss(),
      tanstackStart({ srcDirectory: 'src' }),
      react(),
      nitro(),
    ],
    resolve: {
      tsconfigPaths: true,
      dedupe: ['react', 'react-dom'],
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
