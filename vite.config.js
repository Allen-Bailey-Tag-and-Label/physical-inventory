import { sveltekit } from '@sveltejs/kit/vite';
import { resolve } from 'path';

const config = {
  plugins: [sveltekit()],
  resolve: {
    alias: {
      $components: resolve('./src/components'),
      $db: resolve('./src/db')
    }
  }
};

export default config;
