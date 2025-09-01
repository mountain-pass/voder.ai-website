import { readFileSync } from 'fs';
import { describe, expect, test } from 'vitest';

// use shared helpers for export-path validation
import { walkExports } from './utils/test-helpers.js';
describe('Package Structure Validation', () => {
  test('package.json exports are valid', () => {
    const packageJson = JSON.parse(readFileSync('./package.json', 'utf8'));

    const exportsField = packageJson.exports;

    expect(exportsField).toBeDefined();
    // reuse shared test-helpers
    walkExports(exportsField);
  });
});
