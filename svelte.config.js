import adapter from '@sveltejs/adapter-static';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: preprocess({ typescript: false }),
  kit: {
    adapter: adapter({
      fallback: 'index.html'
    }),
    files: {
      assets: 'public'
    }
  }
};

export default config;