import { mkdir, readFile, rmdir, stat, writeFile } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { copyAssets, copyMatchingFiles, ensureDir } from '../../../scripts/copy-assets.js';

describe('copy-assets script units', () => {
  let testDir: string;

  async function createTempDir(prefix: string): Promise<string> {
    const dir = join(
      tmpdir(),
      `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
    );

    await mkdir(dir, { recursive: true });

    return dir;
  }

  async function cleanupTempDir(dir: string): Promise<void> {
    try {
      await rmdir(dir, { recursive: true });
    } catch {
      // Ignore cleanup errors
    }
  }

  beforeEach(async () => {
    testDir = await createTempDir('copy-assets-unit-test');
  });

  afterEach(async () => {
    await cleanupTempDir(testDir);
  });

  describe('ensureDir', () => {
    it('creates a directory that does not exist', async () => {
      const newDir = join(testDir, 'new-directory');

      await ensureDir(newDir);

      const stats = await stat(newDir);

      expect(stats.isDirectory()).toBe(true);
    });

    it('succeeds when directory already exists', async () => {
      const existingDir = join(testDir, 'existing');

      await mkdir(existingDir);

      // Should not throw
      await ensureDir(existingDir);

      const stats = await stat(existingDir);

      expect(stats.isDirectory()).toBe(true);
    });

    it('creates nested directories', async () => {
      const nestedDir = join(testDir, 'level1', 'level2', 'level3');

      await ensureDir(nestedDir);

      const stats = await stat(nestedDir);

      expect(stats.isDirectory()).toBe(true);
    });

    it('throws error for invalid path', async () => {
      // Use a path that would be invalid (file as parent of directory)
      const filePath = join(testDir, 'some-file.txt');

      await writeFile(filePath, 'content');

      const invalidDir = join(filePath, 'subdir');

      await expect(ensureDir(invalidDir)).rejects.toThrow();
    });
  });

  describe('copyMatchingFiles', () => {
    it('copies files matching predicate', async () => {
      const srcDir = join(testDir, 'src');

      const destDir = join(testDir, 'dest');

      await mkdir(srcDir);
      await mkdir(destDir);

      await writeFile(join(srcDir, 'config.json'), '{"test": true}');
      await writeFile(join(srcDir, 'other.txt'), 'text content');
      await writeFile(join(srcDir, 'another.json'), '{"other": true}');

      const copiedFiles = await copyMatchingFiles(
        srcDir,
        (name) => name.endsWith('.json'),
        destDir,
      );

      expect(copiedFiles).toHaveLength(2);
      expect(copiedFiles).toContain('config.json');
      expect(copiedFiles).toContain('another.json');
      expect(copiedFiles).not.toContain('other.txt');

      // Verify files were actually copied
      const configContent = await readFile(join(destDir, 'config.json'), 'utf8');

      expect(JSON.parse(configContent)).toEqual({ test: true });

      const anotherContent = await readFile(join(destDir, 'another.json'), 'utf8');

      expect(JSON.parse(anotherContent)).toEqual({ other: true });

      // Verify non-matching file was not copied
      await expect(readFile(join(destDir, 'other.txt'), 'utf8')).rejects.toThrow();
    });

    it('returns empty array when no files match', async () => {
      const srcDir = join(testDir, 'src');

      const destDir = join(testDir, 'dest');

      await mkdir(srcDir);
      await mkdir(destDir);

      await writeFile(join(srcDir, 'file.txt'), 'content');
      await writeFile(join(srcDir, 'other.md'), 'markdown');

      const copiedFiles = await copyMatchingFiles(
        srcDir,
        (name) => name.endsWith('.json'),
        destDir,
      );

      expect(copiedFiles).toHaveLength(0);
    });

    it('overwrites existing files', async () => {
      const srcDir = join(testDir, 'src');

      const destDir = join(testDir, 'dest');

      await mkdir(srcDir);
      await mkdir(destDir);

      // Create initial files
      await writeFile(join(srcDir, 'config.json'), '{"version": 1}');
      await writeFile(join(destDir, 'config.json'), '{"version": 0}');

      await copyMatchingFiles(srcDir, (name) => name.endsWith('.json'), destDir);

      // Verify file was overwritten
      const content = await readFile(join(destDir, 'config.json'), 'utf8');

      expect(JSON.parse(content)).toEqual({ version: 1 });
    });

    it('ignores subdirectories', async () => {
      const srcDir = join(testDir, 'src');

      const destDir = join(testDir, 'dest');

      await mkdir(srcDir);
      await mkdir(destDir);
      await mkdir(join(srcDir, 'subdir'));

      await writeFile(join(srcDir, 'file.json'), '{"test": true}');
      await writeFile(join(srcDir, 'subdir', 'nested.json'), '{"nested": true}');

      const copiedFiles = await copyMatchingFiles(
        srcDir,
        (name) => name.endsWith('.json'),
        destDir,
      );

      expect(copiedFiles).toHaveLength(1);
      expect(copiedFiles).toContain('file.json');
    });

    it('throws error when source directory does not exist', async () => {
      const srcDir = join(testDir, 'nonexistent');

      const destDir = join(testDir, 'dest');

      await mkdir(destDir);

      await expect(
        copyMatchingFiles(srcDir, (name) => name.endsWith('.json'), destDir),
      ).rejects.toThrow(/Error copying from/);
    });

    it('preserves file mode bits', async () => {
      const srcDir = join(testDir, 'src');

      const destDir = join(testDir, 'dest');

      await mkdir(srcDir);
      await mkdir(destDir);

      const srcFile = join(srcDir, 'executable.json');

      await writeFile(srcFile, '{"executable": true}');

      // Make file executable
      await stat(srcFile).then(async (_stats) => {
        // Skip on platforms that don't support mode bits properly
        if (process.platform === 'win32') return;

        const { chmod } = await import('fs/promises');

        await chmod(srcFile, 0o755);
      });

      await copyMatchingFiles(srcDir, (name) => name.endsWith('.json'), destDir);

      // Verify mode bits were preserved (skip on Windows)
      if (process.platform !== 'win32') {
        const srcStats = await stat(srcFile);

        const destStats = await stat(join(destDir, 'executable.json'));

        expect(destStats.mode).toBe(srcStats.mode);
      }
    });
  });

  describe('copyAssets', () => {
    it('copies both typescript and eslint files', async () => {
      // Set up source structure
      const tsDir = join(testDir, 'typescript');

      const eslintDir = join(testDir, 'eslint');

      await mkdir(tsDir);
      await mkdir(eslintDir);

      await writeFile(join(tsDir, 'base.json'), '{"extends": "./node.json"}');
      await writeFile(join(tsDir, 'build.json'), '{"compilerOptions": {}}');
      await writeFile(join(tsDir, 'readme.md'), '# TypeScript configs');

      await writeFile(join(eslintDir, 'base.js'), 'module.exports = {};');
      await writeFile(join(eslintDir, 'dx.js'), 'module.exports = { extends: ["./base"] };');
      await writeFile(join(eslintDir, 'readme.md'), '# ESLint configs');

      const result = await copyAssets(testDir);

      expect(result.tsFiles).toHaveLength(2);
      expect(result.tsFiles).toContain('base.json');
      expect(result.tsFiles).toContain('build.json');
      expect(result.tsFiles).not.toContain('readme.md');

      expect(result.jsFiles).toHaveLength(2);
      expect(result.jsFiles).toContain('base.js');
      expect(result.jsFiles).toContain('dx.js');
      expect(result.jsFiles).not.toContain('readme.md');

      // Verify files exist in destination
      const destBaseJson = await readFile(join(testDir, 'dist', 'typescript', 'base.json'), 'utf8');

      expect(JSON.parse(destBaseJson)).toEqual({ extends: './node.json' });

      const destBaseJs = await readFile(join(testDir, 'dist', 'eslint', 'base.js'), 'utf8');

      expect(destBaseJs).toBe('module.exports = {};');
    });

    it('creates destination directories', async () => {
      // Set up minimal source structure
      const tsDir = join(testDir, 'typescript');

      const eslintDir = join(testDir, 'eslint');

      await mkdir(tsDir);
      await mkdir(eslintDir);

      await writeFile(join(tsDir, 'test.json'), '{}');
      await writeFile(join(eslintDir, 'test.js'), '');

      await copyAssets(testDir);

      // Verify destination directories were created
      const distStats = await stat(join(testDir, 'dist'));

      expect(distStats.isDirectory()).toBe(true);

      const tsDestStats = await stat(join(testDir, 'dist', 'typescript'));

      expect(tsDestStats.isDirectory()).toBe(true);

      const eslintDestStats = await stat(join(testDir, 'dist', 'eslint'));

      expect(eslintDestStats.isDirectory()).toBe(true);
    });

    it('handles empty source directories', async () => {
      // Set up empty source directories
      const tsDir = join(testDir, 'typescript');

      const eslintDir = join(testDir, 'eslint');

      await mkdir(tsDir);
      await mkdir(eslintDir);

      const result = await copyAssets(testDir);

      expect(result.tsFiles).toHaveLength(0);
      expect(result.jsFiles).toHaveLength(0);
    });

    it('fails when source directories do not exist', async () => {
      // Don't create source directories
      await expect(copyAssets(testDir)).rejects.toThrow();
    });
  });
});
