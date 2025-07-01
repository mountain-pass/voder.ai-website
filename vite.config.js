// vite.config.js
module.exports = async () => {
  // dynamic import ensures we use Vite’s native ESM API for accurate typings and validation
  const { defineConfig } = await import('vite')
  return defineConfig({
    root: 'src',
    build: {
      outDir: '../dist',
      emptyOutDir: true
    }
  })
}