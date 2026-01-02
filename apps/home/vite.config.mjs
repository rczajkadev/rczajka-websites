import { defineConfig } from 'vite';

const sharedConfig = {
  root: './src',
  base: './',
  css: {
    preprocessorOptions: {
      scss: { api: 'modern' }
    }
  }
};

const buildConfig = {
  ...sharedConfig,
  build: {
    emptyOutDir: true,
    minify: true,
    copyPublicDir: false,
    outDir: '../dist'
  }
};

const devConfig = {
  ...sharedConfig,
  server: {
    open: true
  }
};

export default defineConfig(({ command }) => {
  return command === 'serve' ? devConfig : buildConfig;
});
