import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
  optimizeDeps: {
    include: ['gsap', 'gsap/ScrollTrigger', '@threlte/core', 'three']
  },
  ssr: {
    noExternal: [
      /^gsap/,
      '@threlte/core',
      'three'
    ]
  },
  plugins: [sveltekit()]
});