import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
    preprocess: vitePreprocess(),

    kit: {
        adapter: adapter({
            // Папка куда будет собираться сайт
            pages: 'build',
            assets: 'build',
            fallback: null,
            precompress: false,
            strict: true
        })
    },
    compilerOptions: {
    warningFilter: (warning) => {
      // Игнорировать все a11y предупреждения
      if (warning.code.startsWith('a11y_')) return false;

      return true;
    }
  }

};

export default config;
