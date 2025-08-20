import { existsSync, readFileSync } from 'fs';
import path from 'path';
import { describe, expect, test } from 'vitest';

describe('Package Structure Validation', () => {
  test('package.json exports point to files under ./dist and do not reference .ts; main/types point to dist artifacts; runtime exports have corresponding .d.ts', () => {
    const packageJson = JSON.parse(readFileSync('./package.json', 'utf8'));

    const exportsField = packageJson.exports;

    expect(exportsField).toBeDefined();

    // Check top-level main and types
    expect(typeof packageJson.main).toBe('string');
    expect(packageJson.main).toMatch(/^\.\/dist\//);
    expect(packageJson.types).toMatch(/^\.\/dist\//);
    expect(packageJson.types).toMatch(/\.d\.ts$/);

    function _fileExistsRel(relPath: string) {
      const resolved = path.resolve(process.cwd(), relPath.replace(/^\.\//, ''));

      return existsSync(resolved);
    }

    // Recursively validate an export value which may be a string, object, or array
    function validateExportValue(value: unknown) {
      if (typeof value === 'string') {
        // Must point to ./dist/ and not to a .ts file
        expect(value).toMatch(/^\.\/dist\//);
        if (!value.endsWith('.d.ts')) {
          expect(value).not.toMatch(/\.ts$/);
        }

        // Resolve the runtime file exists using helper
        expect(_fileExistsRel(value.replace(/^\.\//, ''))).toBe(true);

        // If the runtime path is a .js under dist, check for corresponding .d.ts
        if (value.endsWith('.js')) {
          const dtsPath = value.replace(/\.js$/, '.d.ts');

          expect(_fileExistsRel(dtsPath.replace(/^\.\//, ''))).toBe(true);
        }

        return;
      }

      if (Array.isArray(value)) {
        for (const item of value) validateExportValue(item);

        return;
      }

      if (value && typeof value === 'object') {
        for (const [, v] of Object.entries(value as Record<string, unknown>)) {
          validateExportValue(v);
        }

        return;
      }

      // Unexpected shape
      throw new Error(`Unexpected export value shape: ${String(value)}`);
    }

    // Validate each top-level export key
    for (const [, exportValue] of Object.entries(exportsField)) {
      validateExportValue(exportValue);
    }
  });
});
