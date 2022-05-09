import { SSIPlugin } from '@server-side-include/vite-plugin';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    SSIPlugin({
      variables: {
        $locale: 'en',
      },
      rejectUnauthorized: true,
    }),
  ],
  server: {
    proxy: {
      '/services/': {
        target: 'https://access.redhat.com',
        changeOrigin: true,
      },
    },
  },
});
