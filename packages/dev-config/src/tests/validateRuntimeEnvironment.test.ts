import { mkdtempSync, rmSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { describe, expect, it, vi } from 'vitest';
import * as moduleApi from 'module';

import { validateRuntimeEnvironment } from '../utils/validateRuntime.js';

describe('validateRuntimeEnvironment()', () => {
  it('throws if jiti cannot be resolved', () => {
    // Spy on createRequire to throw for jiti specifically
    const originalRequireInstance = moduleApi.createRequire(import.meta.url);
    const spy = vi
      .spyOn(moduleApi, 'createRequire')
      .mockImplementation((url: string) => {
        return {
          ...originalRequireInstance,
          resolve: (id: string) => {
            if (id === 'jiti') {
              throw new Error('Module not found');
            }
            return originalRequireInstance.resolve(id);
          },
        } as any;
      });

    expect(() => validateRuntimeEnvironment()).toThrow(
      'Missing required peer dependency "jiti".\n' +
        'Please install it in your project: npm install --save-dev jiti',
    );

    spy.mockRestore();
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
