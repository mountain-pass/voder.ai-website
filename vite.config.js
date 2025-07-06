import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
  optimizeDeps: {
    include: ['gsap', 'gsap/ScrollTrigger']
  },
  ssr: {
    noExternal: [/^gsap/]
  },
  plugins: [sveltekit()]
});