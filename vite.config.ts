import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    headers: {
      'Accept-Ranges': 'bytes',
      'Access-Control-Allow-Origin': '*',
    },
    fs: {
      strict: false,
      allow: ['..']
    },
    port: 5174,
    host: true,
    open: true,
    middlewares: [
      (req, res, next) => {
        if (req.url.endsWith('.mp3')) {
          res.setHeader('Accept-Ranges', 'bytes');
        }
        next();
      }
    ]
  },
  publicDir: 'public', // Change this to use the public directory
  assetsInclude: ['**/*.mp3'],
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name.endsWith('.mp3')) {
            return 'assets/audio/[name][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        },
      },
    },
  },
});
