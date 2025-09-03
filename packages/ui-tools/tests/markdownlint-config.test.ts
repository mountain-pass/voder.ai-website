import { getConfig } from '@voder/dev-config/linters/markdown';
import { readFileSync } from 'fs';
import { describe, expect, it } from 'vitest';
describe('Markdownlint config generator', () => {
  it('getConfig() returns a valid markdownlint configuration', () => {
    // Generate the shared config programmatically
    const programmatic = getConfig();

    // Should be a valid config object
    expect(programmatic).toBeDefined();
    expect(typeof programmatic).toBe('object');
    expect(programmatic).not.toBeNull();

    // Should have some markdown rules
    expect(Object.keys(programmatic).length).toBeGreaterThan(0);
  });

  it('.markdownlint.json file exists and is valid', () => {
    // Read the JSON file produced by the script
    const fileRaw = readFileSync('.markdownlint.json', 'utf8');

    const fileConfig = JSON.parse(fileRaw);

    // Should be a valid config object
    expect(fileConfig).toBeDefined();
    expect(typeof fileConfig).toBe('object');
    expect(fileConfig).not.toBeNull();

    // Should have some markdown rules
    expect(Object.keys(fileConfig).length).toBeGreaterThan(0);
  });
});
