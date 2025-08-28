import { mkdir, readFile, stat } from 'fs/promises';
import { join } from 'path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { generateMarkdownlintConfig } from '../../../scripts/generate-markdownlint-config.js';
import { cleanupTempDir, createTempDir } from '../helpers/fs-utils';

describe('generate-markdownlint-config script units', () => {
  let testDir: string;

  beforeEach(async () => {
    testDir = await createTempDir('markdownlint-config-unit-test');
  });

  afterEach(async () => {
    await cleanupTempDir(testDir);
  });

  describe('generateMarkdownlintConfig', () => {
    it('creates .markdownlint.json file', async () => {
      const outputPath = generateMarkdownlintConfig(testDir);

      expect(outputPath).toBe(join(testDir, '.markdownlint.json'));

      // Verify file exists
      const stats = await stat(outputPath);

      expect(stats.isFile()).toBe(true);
    });

    it('generates valid JSON configuration', async () => {
      const outputPath = generateMarkdownlintConfig(testDir);

      const configContent = await readFile(outputPath, 'utf8');

      const config = JSON.parse(configContent);

      expect(typeof config).toBe('object');
      expect(config).not.toBeNull();
    });

    it('includes expected markdown rules', async () => {
      const outputPath = generateMarkdownlintConfig(testDir);

      const configContent = await readFile(outputPath, 'utf8');

      const config = JSON.parse(configContent);

      // Based on the markdown linter implementation, MD013 should be disabled
      expect(config).toHaveProperty('MD013', false);

      // Should have other markdown rules
      expect(Object.keys(config).length).toBeGreaterThan(1);
    });

    it('overwrites existing configuration file', async () => {
      // Create initial file with different content
      const outputPath = join(testDir, '.markdownlint.json');

      await import('fs/promises').then(({ writeFile }) =>
        writeFile(outputPath, '{"MD001": true}', 'utf8'),
      );

      // Generate new config
      generateMarkdownlintConfig(testDir);

      // Verify content was overwritten
      const configContent = await readFile(outputPath, 'utf8');

      const config = JSON.parse(configContent);

      // Should have the expected structure from getConfig(), not the initial content
      expect(config).toHaveProperty('MD013', false);
    });

    it('formats JSON with proper indentation', async () => {
      const outputPath = generateMarkdownlintConfig(testDir);

      const configContent = await readFile(outputPath, 'utf8');

      // Should be formatted with 2-space indentation and trailing newline
      expect(configContent).toMatch(/{\n {2}/);
      expect(configContent.endsWith('\n')).toBe(true);

      // Should be valid JSON
      expect(() => JSON.parse(configContent)).not.toThrow();
    });

    it('uses current working directory by default', async () => {
      const originalCwd = process.cwd();

      try {
        // Change to test directory
        process.chdir(testDir);

        const outputPath = generateMarkdownlintConfig();

        // Use realpath to handle path normalization (like symlinks on macOS)
        const { realpath } = await import('fs/promises');

        const { resolve } = await import('path');

        const normalizedOutputPath = await realpath(outputPath);

        const normalizedExpectedPath = await realpath(resolve(testDir, '.markdownlint.json'));

        expect(normalizedOutputPath).toBe(normalizedExpectedPath);
      } finally {
        // Restore original working directory
        process.chdir(originalCwd);
      }
    });

    it('works with custom output directory', async () => {
      const customDir = join(testDir, 'custom');

      await mkdir(customDir);

      const outputPath = generateMarkdownlintConfig(customDir);

      expect(outputPath).toBe(join(customDir, '.markdownlint.json'));

      // Verify file was created in custom directory
      const stats = await stat(outputPath);

      expect(stats.isFile()).toBe(true);
    });

    it('matches output from getConfig function', async () => {
      const outputPath = generateMarkdownlintConfig(testDir);

      const configContent = await readFile(outputPath, 'utf8');

      const generatedConfig = JSON.parse(configContent);

      // Import and call getConfig directly for comparison
      const { getConfig } = await import('../../../linters/markdown/index.js');

      const expectedConfig = getConfig();

      expect(generatedConfig).toEqual(expectedConfig);
    });

    it('handles special characters in output directory', async () => {
      const specialDir = join(testDir, 'special-chars_123');

      await mkdir(specialDir);

      const outputPath = generateMarkdownlintConfig(specialDir);

      expect(outputPath).toBe(join(specialDir, '.markdownlint.json'));

      // Verify file was created
      const stats = await stat(outputPath);

      expect(stats.isFile()).toBe(true);
    });
  });
});
