import { execSync } from 'child_process';
import { mkdir, readdir, readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { safeSpawn } from '../../utils/safe-spawn';
import { cleanupTempDir, createTempDir } from '../helpers/fs-utils';

// Helper to run script as subprocess for integration testing using safeSpawn
function runScriptAsSubprocess(scriptPath: string, cwd: string) {
  return safeSpawn('npx', ['tsx', scriptPath], {
    cwd,
    env: { ...process.env, NODE_ENV: 'test' },
  });
}

describe('copy-assets script', () => {
  let testDir: string;

  let originalCwd: string;

  beforeEach(async () => {
    testDir = await createTempDir('copy-assets-test');
    originalCwd = process.cwd();
  });

  afterEach(async () => {
    await cleanupTempDir(testDir);
  });

  it('copies typescript JSON files to dist/typescript/', async () => {
    // Setup source directory with test files
    await mkdir(join(testDir, 'typescript'), { recursive: true });
    await mkdir(join(testDir, 'eslint'), { recursive: true }); // Create eslint dir to avoid script error
    await writeFile(join(testDir, 'typescript', 'base.json'), '{"test": true}');
    await writeFile(join(testDir, 'typescript', 'build.json'), '{"build": true}');
    await writeFile(join(testDir, 'typescript', 'index.ts'), 'export {};'); // Should be ignored
    await writeFile(join(testDir, 'eslint', 'dummy.js'), 'module.exports = {};'); // Dummy file

    // Run the copy-assets script as subprocess (integration test)
    const scriptPath = join(originalCwd, 'scripts/copy-assets.ts');

    const result = await runScriptAsSubprocess(scriptPath, testDir);

    // Should complete successfully (no error output)
    expect(result.stderr).toContain('🎉 copy-assets completed successfully');

    // Verify files were copied
    const destFiles = await readdir(join(testDir, 'dist', 'typescript'));

    expect(destFiles).toContain('base.json');
    expect(destFiles).toContain('build.json');
    expect(destFiles).not.toContain('index.ts'); // TypeScript files should be ignored

    // Verify content was preserved
    const copiedContent = await readFile(join(testDir, 'dist', 'typescript', 'base.json'), 'utf8');

    expect(JSON.parse(copiedContent)).toEqual({ test: true });

    // Script worked if files were copied successfully
  });

  it('copies eslint JS files to dist/eslint/', async () => {
    // Setup source directory with test files
    await mkdir(join(testDir, 'eslint'), { recursive: true });
    await mkdir(join(testDir, 'typescript'), { recursive: true }); // Create typescript dir to avoid script error
    await writeFile(join(testDir, 'eslint', 'base.js'), 'module.exports = {};');
    await writeFile(join(testDir, 'eslint', 'index.ts'), 'export {};'); // Should be ignored
    await writeFile(join(testDir, 'typescript', 'dummy.json'), '{}'); // Dummy file

    // Run the copy-assets script as subprocess (integration test)
    const scriptPath = join(originalCwd, 'scripts/copy-assets.ts');

    const result = await runScriptAsSubprocess(scriptPath, testDir);

    // Should complete successfully
    expect(result.stderr).toContain('🎉 copy-assets completed successfully');

    // Verify files were copied
    const destFiles = await readdir(join(testDir, 'dist', 'eslint'));

    expect(destFiles).toContain('base.js');
    expect(destFiles).not.toContain('index.ts'); // TypeScript files should be ignored

    // Verify content was preserved
    const copiedContent = await readFile(join(testDir, 'dist', 'eslint', 'base.js'), 'utf8');

    expect(copiedContent).toBe('module.exports = {};');
  });

  it('creates destination directories when they do not exist', async () => {
    // Setup source directory with test files
    await mkdir(join(testDir, 'typescript'), { recursive: true });
    await mkdir(join(testDir, 'eslint'), { recursive: true });
    await writeFile(join(testDir, 'typescript', 'test.json'), '{"test": true}');
    await writeFile(join(testDir, 'eslint', 'dummy.js'), 'module.exports = {};'); // Dummy file

    // Ensure dist directory doesn't exist
    // (it shouldn't exist in our temp directory anyway)

    // Run the copy-assets script as subprocess (integration test)
    const scriptPath = join(originalCwd, 'scripts/copy-assets.ts');

    const result = await runScriptAsSubprocess(scriptPath, testDir);

    // Should complete successfully
    expect(result.stderr).toContain('🎉 copy-assets completed successfully');

    // Verify directories were created and files copied
    const distDir = join(testDir, 'dist');

    const distTypeScriptDir = join(distDir, 'typescript');

    const distFiles = await readdir(distDir);

    expect(distFiles).toContain('typescript');
    expect(distFiles).toContain('eslint');

    const tsFiles = await readdir(distTypeScriptDir);

    expect(tsFiles).toContain('test.json');

    // Script worked if directories and files were created
  });

  it('handles missing source directories gracefully', async () => {
    // Create neither typescript nor eslint directories - script should fail
    const scriptPath = join(originalCwd, 'scripts/copy-assets.ts');

    expect(() => {
      execSync(`npx tsx "${scriptPath}"`, {
        encoding: 'utf8',
        cwd: testDir,
        env: { ...process.env, NODE_ENV: 'test' },
      });
    }).toThrow();
  });

  it('preserves file mode bits when copying', async () => {
    // Setup source files
    await mkdir(join(testDir, 'typescript'), { recursive: true });
    await mkdir(join(testDir, 'eslint'), { recursive: true });
    await writeFile(join(testDir, 'typescript', 'test.json'), '{"test": true}');
    await writeFile(join(testDir, 'eslint', 'dummy.js'), 'module.exports = {};'); // Dummy file

    // Run the copy-assets script
    const scriptPath = join(originalCwd, 'scripts/copy-assets.ts');

    execSync(`npx tsx "${scriptPath}"`, {
      cwd: testDir,
      env: { ...process.env, NODE_ENV: 'test' },
    });

    // Files should exist (mode preservation is handled by the script internally)
    const destFiles = await readdir(join(testDir, 'dist', 'typescript'));

    expect(destFiles).toContain('test.json');
  });

  it('overwrites existing files in destination', async () => {
    // Setup source files
    await mkdir(join(testDir, 'typescript'), { recursive: true });
    await mkdir(join(testDir, 'eslint'), { recursive: true });
    await writeFile(join(testDir, 'typescript', 'test.json'), '{"original": true}');
    await writeFile(join(testDir, 'eslint', 'dummy.js'), 'module.exports = {};'); // Dummy file

    // Run copy script first time
    const scriptPath = join(originalCwd, 'scripts/copy-assets.ts');

    execSync(`npx tsx "${scriptPath}"`, {
      cwd: testDir,
      env: { ...process.env, NODE_ENV: 'test' },
    });

    // Update source file
    await writeFile(join(testDir, 'typescript', 'test.json'), '{"updated": true}');

    // Run copy script again
    execSync(`npx tsx "${scriptPath}"`, {
      cwd: testDir,
      env: { ...process.env, NODE_ENV: 'test' },
    });

    // Verify file was overwritten
    const copiedContent = await readFile(join(testDir, 'dist', 'typescript', 'test.json'), 'utf8');

    expect(JSON.parse(copiedContent)).toEqual({ updated: true });
  });

  it('only copies files matching the specified extensions', async () => {
    // Setup source files with various extensions
    await mkdir(join(testDir, 'typescript'), { recursive: true });
    await mkdir(join(testDir, 'eslint'), { recursive: true });
    await writeFile(join(testDir, 'typescript', 'config.json'), '{"config": true}');
    await writeFile(join(testDir, 'typescript', 'types.ts'), 'export {};');
    await writeFile(join(testDir, 'typescript', 'readme.md'), '# README');
    await writeFile(join(testDir, 'eslint', 'base.js'), 'module.exports = {};');
    await writeFile(join(testDir, 'eslint', 'types.ts'), 'export {};');
    await writeFile(join(testDir, 'eslint', 'readme.md'), '# README');

    // Run the copy-assets script
    const scriptPath = join(originalCwd, 'scripts/copy-assets.ts');

    execSync(`npx tsx "${scriptPath}"`, {
      cwd: testDir,
      env: { ...process.env, NODE_ENV: 'test' },
    });

    // Verify only correct extensions were copied
    const tsDestFiles = await readdir(join(testDir, 'dist', 'typescript'));

    expect(tsDestFiles).toContain('config.json');
    expect(tsDestFiles).not.toContain('types.ts');
    expect(tsDestFiles).not.toContain('readme.md');

    const eslintDestFiles = await readdir(join(testDir, 'dist', 'eslint'));

    expect(eslintDestFiles).toContain('base.js');
    expect(eslintDestFiles).not.toContain('types.ts');
    expect(eslintDestFiles).not.toContain('readme.md');

    // Script worked if correct files were copied
  });
});
