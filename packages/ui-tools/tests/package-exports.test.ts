import { describe, test, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';

describe('Package Export Integration', () => {
  test('package.json exports point into ./dist/ and target files exist', () => {
    const packageJson = JSON.parse(readFileSync('./package.json', 'utf8'));
    const exportsField = packageJson.exports;
    expect(exportsField).toBeDefined();

    function checkPath(p: string) {
      // must point into dist/ and not to .ts source files
      expect(p).toMatch(/^\.\/dist\//);
      expect(p).not.toMatch(/\.ts$/);
      // existsSync expects a path without the leading './'
      expect(existsSync(p.replace(/^\.\//, ''))).toBe(true);
    }

    function walk(value: unknown) {
      if (typeof value === 'string') {
        checkPath(value);
      } else if (value && typeof value === 'object') {
        for (const v of Object.values(value as Record<string, unknown>)) {
          walk(v);
        }
      }
    }

    walk(exportsField);
  });
});
