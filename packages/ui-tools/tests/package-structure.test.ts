import { existsSync,readFileSync } from 'fs';
import { describe, expect,test } from 'vitest';

describe('Package Structure Validation', () => {
  test('package.json exports are valid', () => {
    const packageJson = JSON.parse(readFileSync('./package.json', 'utf8'));

    const exportsField = packageJson.exports;

    expect(exportsField).toBeDefined();

    function checkPath(p: string) {
  // must point into dist/
  expect(p).toMatch(/^\.\/dist\//);

  // Allow declaration files (./dist/.../*.d.ts) but reject non-declaration .ts source paths.
  if (!p.endsWith('.d.ts')) {
    expect(p).not.toMatch(/\.ts$/);
  }

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
