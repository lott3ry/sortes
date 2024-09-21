import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { createHtmlPlugin } from 'vite-plugin-html';
import fs from 'node:fs/promises';
import path from 'node:path';

const dir = 'build-app';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    createHtmlPlugin({
      template: 'app.html',
    }),
    {
      name: 'vite-postbuild',
      closeBundle: async () => {
        const buildDir = path.join(__dirname, dir);
        const oldPath = path.join(buildDir, 'app.html');
        const newPath = path.join(buildDir, 'index.html');
        await fs.rename(oldPath, newPath);
      },
    },
  ],
  build: {
    rollupOptions: {
      input: {
        index: './app.html',
      },
      output: [
        {
          dir: dir,
        },
      ],
    },
  },
  resolve: {
    alias: {
      '/@': path.resolve(__dirname, 'src'),
      '/@root': path.resolve(__dirname),
    },
  },
});
