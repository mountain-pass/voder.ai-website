import { readFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { describe, expect, it } from 'vitest';

const __dirname = dirname(fileURLToPath(import.meta.url));

function lookupLockVersion(lock: any, name: string): string | undefined {
  // package-lock v1: lock.dependencies[name].version
  if (lock && lock.dependencies && lock.dependencies[name] && lock.dependencies[name].version) {
    return lock.dependencies[name].version;
  }
  // package-lock v2+: lock.packages keys like "node_modules/<name>"
  if (lock && lock.packages) {
    for (const key of Object.keys(lock.packages)) {
      if (key === `node_modules/${name}` || key.endsWith(`/node_modules/${name}`)) {
        const pkg = lock.packages[key];

        if (pkg && pkg.version) return pkg.version;
      }
    }
    // fallback: find any package entry whose name matches
    for (const pkg of Object.values(lock.packages)) {
      // @ts-ignore
      if (pkg && pkg.name === name && pkg.version) return pkg.version;
    }
  }

  return undefined;
}

describe('devDependency alignment', () => {
  it('vitest and @vitest/coverage-v8 must be version-aligned in package.json and package-lock.json', () => {
    const pkg = JSON.parse(readFileSync(resolve(__dirname, '../package.json'), 'utf8'));

    const lockRaw = readFileSync(resolve(__dirname, '../package-lock.json'), 'utf8');

    let lock;

    try {
      lock = JSON.parse(lockRaw);
    } catch (e) {
      // Explicit fail with helpful message if the lockfile is missing or invalid
      throw new Error('package-lock.json missing or invalid: ' + String(e));
    }

    const names = ['vitest', '@vitest/coverage-v8'];

    for (const name of names) {
      const devVer = pkg.devDependencies?.[name];

      expect(devVer, `package.json devDependencies.${name} must be defined`).toBeDefined();

      const lockVer = lookupLockVersion(lock, name);

      expect(lockVer, `package-lock.json must contain resolved version for ${name}`).toBeDefined();

      // exact equality expected
      expect(lockVer).toBe(devVer);
    }
  });
});
