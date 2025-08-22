import { existsSync,readFileSync } from 'fs';
import { join } from 'path';
import { describe, expect,test } from 'vitest';

/**
 * Version guard: ensure package-lock.json contains versions for jest-axe and axe-core.
 * Logs discovered versions to stdout for history and debugging.
 */
describe('Dependency version alignment: jest-axe & axe-core', () => {
  test('package-lock.json contains jest-axe and axe-core versions', () => {
    const lockPath = join(process.cwd(), 'package-lock.json');

    expect(existsSync(lockPath)).toBe(true);

    const lockRaw = readFileSync(lockPath, 'utf8');

    let lock: any;

    try {
      lock = JSON.parse(lockRaw);
    } catch (err) {
      throw new Error(`Failed to parse package-lock.json: ${(err as Error).message}`);
    }

    function findVersion(pkg: string): string | undefined {
      // npm v1/v2 lockfile structure
      if (lock.dependencies && lock.dependencies[pkg] && lock.dependencies[pkg].version) {
        return lock.dependencies[pkg].version;
      }
      // npm v3 package-lock (packages map)
      if (lock.packages) {
        const key = `node_modules/${pkg}`;

        if (lock.packages[key] && lock.packages[key].version) {
          return lock.packages[key].version;
        }
      }

      // Fallbacks not implemented (yarn/pnpm); return undefined if not found.
      return undefined;
    }

    const jestAxeVersion = findVersion('jest-axe');

    const axeCoreVersion = findVersion('axe-core');

    // Log discovered versions to stdout
    console.log(JSON.stringify({
      'jest-axe': jestAxeVersion ?? null,
      'axe-core': axeCoreVersion ?? null
    }, null, 2));

    // Assert both are present and non-empty strings
    expect(jestAxeVersion).toBeDefined();
    expect(typeof jestAxeVersion).toBe('string');
    expect(jestAxeVersion && jestAxeVersion.length).toBeGreaterThan(0);

    expect(axeCoreVersion).toBeDefined();
    expect(typeof axeCoreVersion).toBe('string');
    expect(axeCoreVersion && axeCoreVersion.length).toBeGreaterThan(0);
  });
});
