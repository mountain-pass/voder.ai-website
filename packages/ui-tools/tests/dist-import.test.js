import { execSync } from 'child_process';
import { describe, expect, test } from 'vitest';
describe('Dist Import Integration', () => {
  test('build output can be imported and core APIs are functions', async () => {
    // Run the build
    execSync('npm run build', { stdio: 'inherit' });
    // Import the main entry from dist
    const mainMod = await import('../dist/index.js');
    expect(typeof mainMod.createPostCSSConfig).toBe('function');
    expect(typeof mainMod.createViteLibraryConfig).toBe('function');
    expect(typeof mainMod.createVitestJsdomConfig).toBe('function');
    expect(typeof mainMod.renderComponent).toBe('function');
    expect(typeof mainMod.expectAccessible).toBe('function');
    expect(typeof mainMod.setupJsdomTestEnvironment).toBe('function');
    expect(typeof mainMod.createHTMLLintConfig).toBe('function');
    expect(typeof mainMod.createCSSLintConfig).toBe('function');
    expect(typeof mainMod.createAccessibilityLintConfig).toBe('function');
    // Import the testing barrel from dist
    const testMod = await import('../dist/testing/index.js');
    expect(typeof testMod.createVitestJsdomConfig).toBe('function');
    expect(typeof testMod.renderComponent).toBe('function');
    expect(typeof testMod.expectAccessible).toBe('function');
    expect(typeof testMod.setupJsdomTestEnvironment).toBe('function');
  });
});
