import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  base: '/apis-storage/',
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: 'src/**/*',
          dest: ''
        }
      ]
    })
  ],
  css: {
    postcss: './postcss.config.js',
  },
  build: {
    outDir: 'dist'
  }
});
