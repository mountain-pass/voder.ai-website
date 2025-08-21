import { defineConfig } from 'vite';

async function loadPlugins() {
  let inlineSourcePlugin: any;
  try {
    // Attempt to dynamically import the optional plugin; if it's not installed,
    // swallow the error and proceed without it.
    inlineSourcePlugin = (await import('vite-plugin-inline-source')).default;
  } catch {
    inlineSourcePlugin = undefined;
  }

  const plugins: any[] = [];
  if (inlineSourcePlugin) {
    try {
      plugins.push(inlineSourcePlugin());
    } catch {
      // If plugin initialization throws, ignore to avoid blocking startup.
    }
  }

  return plugins;
}

export default defineConfig(async () => {
  const plugins = await loadPlugins();
  return { plugins };
});
