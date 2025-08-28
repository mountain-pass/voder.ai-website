import { mkdtempSync, rmSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { describe, expect, it, vi } from 'vitest';

import { validateRuntimeEnvironment } from '../utils/validateRuntime.js';

describe('validateRuntimeEnvironment()', () => {
  it.skip('throws if jiti cannot be resolved', () => {
    // Mock require.resolve to throw for jiti specifically
    const originalRequire = global.require;

    // Create a mock require with resolve method
    const mockRequire = Object.assign(
      function (id: string) {
        return originalRequire(id);
      },
      {
        ...originalRequire,
        resolve: vi.fn().mockImplementation((id: string) => {
          if (id === 'jiti') {
            throw new Error('Module not found');
          }

          return originalRequire.resolve(id);
        }),
      },
    );

    // Replace global require
    global.require = mockRequire as any;

    expect(() => validateRuntimeEnvironment()).toThrow(
      'Missing required peer dependency "jiti".\n' +
        'Please install it in your project: npm install --save-dev jiti',
    );

    // Restore original require
    global.require = originalRequire;
  });

  it('completes successfully when all dependencies are available', () => {
    // Test that the function completes without throwing when jiti is available
    expect(() => validateRuntimeEnvironment()).not.toThrow();
  });

  it('throws if tsconfig JSON files are missing', () => {
    const cwd = process.cwd();

    // Create an empty temp directory
    const temp = mkdtempSync(join(tmpdir(), 'voder-validate-'));

    process.chdir(temp);

    // Stub require.resolve to succeed for jiti
    const origResolve = require.resolve;

    // @ts-ignore
    require.resolve = (id: string) => {
      if (id === 'jiti') return __filename;

      return origResolve(id);
    };

    expect(() => validateRuntimeEnvironment()).toThrow(/Missing TypeScript ESLint config/);

    // Clean up and restore
    // @ts-ignore
    require.resolve = origResolve;
    process.chdir(cwd);
    rmSync(temp, { recursive: true, force: true });
  });

  it('throws if tsconfig.config.json is missing but tsconfig.eslint.json exists', () => {
    const { mkdirSync, writeFileSync } = require('fs');

    const cwd = process.cwd();

    // Create a temp directory with only eslint config
    const temp = mkdtempSync(join(tmpdir(), 'voder-validate-config-'));

    mkdirSync(join(temp, 'typescript'), { recursive: true });
    writeFileSync(join(temp, 'typescript', 'tsconfig.eslint.json'), '{}');

    process.chdir(temp);

    // Stub require.resolve to succeed
    const origResolve = require.resolve;

    // @ts-ignore
    require.resolve = () => __filename;

    expect(() => validateRuntimeEnvironment()).toThrow(/Missing TypeScript config file/);

    // Clean up and restore
    // @ts-ignore
    require.resolve = origResolve;
    process.chdir(cwd);
    rmSync(temp, { recursive: true, force: true });
  });
});
