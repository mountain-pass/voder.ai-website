const adapter = require('@sveltejs/adapter-static');
const preprocess = require('svelte-preprocess');

/** @type {import('@sveltejs/kit').Config} */
module.exports = {
  kit: {
    adapter: adapter()
  },
  preprocess: preprocess()
};