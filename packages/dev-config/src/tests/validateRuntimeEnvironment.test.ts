import { join } from 'path';
import { describe, expect, it, vi } from 'vitest';
import { cleanupTempDir, createTempDir } from './helpers/fs-utils';

// Tests for validateRuntimeEnvironment using dynamic imports and module mocking

describe('validateRuntimeEnvironment()', () => {
  it('throws if jiti cannot be resolved', async () => {
    // Clear module cache and mock createRequire to simulate missing jiti
    vi.resetModules();
    vi.mock('module', async () => {
      const actual = await vi.importActual<typeof import('module')>('module');
      const origCreateRequire = actual.createRequire;
      return {
        ...actual,
        createRequire: (url: string) => {
          const req = origCreateRequire(url);
          return {
            resolve: (id: string) => {
              if (id === 'jiti') {
                throw new Error('Cannot resolve jiti');
              }
              if (
                id === 'typescript/tsconfig.eslint.json' ||
                id === 'typescript/tsconfig.config.json'
              ) {
                // Return a dummy existing path for config files
                return __filename;
              }
              return req.resolve(id);
            },
          };
        },
      };
    });

    const { validateRuntimeEnvironment } = await import('../utils/validateRuntime.js');
    expect(() => validateRuntimeEnvironment()).toThrow(/Missing required peer dependency "jiti"/);
  });

  it('completes successfully when all dependencies are available', async () => {
    // Clear mocks and cache
    vi.resetModules();
    // Mock createRequire to simulate resolution of jiti and config files
    vi.mock('module', async () => {
      const actual = await vi.importActual<typeof import('module')>('module');
      const origCreateRequire = actual.createRequire;
      return {
        ...actual,
        createRequire: (url: string) => {
          const req = origCreateRequire(url);
          return {
            resolve: (id: string) => {
              if (id === 'jiti') {
                // Simulate jiti resolution
                return __filename;
              }
              if (
                id === 'typescript/tsconfig.eslint.json' ||
                id === 'typescript/tsconfig.config.json'
              ) {
                return __filename;
              }
              return req.resolve(id);
            },
          };
        },
      };
    });

    const { validateRuntimeEnvironment } = await import('../utils/validateRuntime.js');
    expect(() => validateRuntimeEnvironment()).not.toThrow();
  });

  it('throws if tsconfig JSON files are missing', async () => {
    // Prepare isolated environment with no tsconfig files
    const cwd = process.cwd();
    const temp = await createTempDir('voder-validate');
    process.chdir(temp);

    // Stub createRequire to simulate resolution of jiti and config files
    vi.resetModules();
    vi.mock('module', async () => {
      const actual = await vi.importActual<typeof import('module')>('module');
      const origCreateRequire = actual.createRequire;
      return {
        ...actual,
        createRequire: (url: string) => {
          const req = origCreateRequire(url);
          return {
            resolve: (id: string) => {
              if (id === 'jiti') {
                return __filename;
              }
              if (
                id === 'typescript/tsconfig.eslint.json' ||
                id === 'typescript/tsconfig.config.json'
              ) {
                return __filename;
              }
              return req.resolve(id);
            },
          };
        },
      };
    });

    try {
      const { validateRuntimeEnvironment } = await import('../utils/validateRuntime.js');
      expect(() => validateRuntimeEnvironment()).toThrow(/Missing TypeScript ESLint config/);
    } finally {
      process.chdir(cwd);
      await cleanupTempDir(temp);
    }
  });

  it('throws if tsconfig.config.json is missing but tsconfig.eslint.json exists', async () => {
    // Prepare isolated environment with only eslint tsconfig
    const cwd = process.cwd();
    const temp = await createTempDir('voder-validate-config');
    const { mkdirSync, writeFileSync } = await import('fs');

    mkdirSync(join(temp, 'typescript'), { recursive: true });
    writeFileSync(join(temp, 'typescript', 'tsconfig.eslint.json'), '{}');

    process.chdir(temp);

    // Stub createRequire to simulate resolution of jiti and config files
    vi.resetModules();
    vi.mock('module', async () => {
      const actual = await vi.importActual<typeof import('module')>('module');
      const origCreateRequire = actual.createRequire;
      return {
        ...actual,
        createRequire: (url: string) => {
          const req = origCreateRequire(url);
          return {
            resolve: (id: string) => {
              if (id === 'jiti') {
                return __filename;
              }
              if (
                id === 'typescript/tsconfig.eslint.json' ||
                id === 'typescript/tsconfig.config.json'
              ) {
                return __filename;
              }
              return req.resolve(id);
            },
          };
        },
      };
    });

    try {
      const { validateRuntimeEnvironment } = await import('../utils/validateRuntime.js');
      expect(() => validateRuntimeEnvironment()).toThrow(/Missing TypeScript config file/);
    } finally {
      process.chdir(cwd);
      await cleanupTempDir(temp);
    }
  });
});
