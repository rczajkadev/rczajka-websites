import { defineConfig } from 'vite';

const buildConfig = {
  root: './src',
  base: './',
  build: {
    emptyOutDir: true,
    minify: true,
    copyPublicDir: false,
  },
  css: {
    preprocessorOptions: {
      scss: { api: 'modern' },
    }
  }
};

const devConfig = {
  root: './src',
  base: './',
  server: {
    open: true,
  },
  css: {
    preprocessorOptions: {
      scss: { api: 'modern' },
    },
  }
};

export default defineConfig(({ command }) => {
  return command === 'serve' ? devConfig : buildConfig;
});
