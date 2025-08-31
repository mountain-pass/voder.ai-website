import { execSync } from 'child_process';
import { mkdir, mkdtemp, rm, writeFile } from 'fs/promises';
import { tmpdir } from 'os';
import { join, resolve } from 'path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe('package main exports integration test', () => {
  let tempDir: string;

  let packagePath: string;

  beforeAll(async () => {
    // Create temp directory
    tempDir = await mkdtemp(join(tmpdir(), 'voder-test-'));

    // Pack the current package
    const packResult = execSync('npm pack', { encoding: 'utf8' });

    const tarball = packResult.trim().split('\n').pop();

    // Create test package.json in temp dir
    packagePath = join(tempDir, 'test-package');
    await mkdir(packagePath, { recursive: true });
    await writeFile(
      join(packagePath, 'package.json'),
      JSON.stringify({
        name: 'test-consumer',
        type: 'module',
        dependencies: {
          '@voder/dev-config': `file:${resolve(tarball!)}`,
        },
      }),
    );

    // Install the package
    execSync('npm install', { cwd: packagePath });
  }, 120000); // 120 second timeout for setup

  afterAll(async () => {
    await rm(tempDir, { recursive: true, force: true });
  });

  it('imports main package entry and exposes expected top-level exports', async () => {
    const testFile = join(packagePath, 'test-main.mjs');

    await writeFile(
      testFile,
      `
      import * as mod from '@voder/dev-config';
      console.log(JSON.stringify({ 
        success: true,
        hasTesting: mod.testing && typeof mod.testing === 'object',
        hasEslint: mod.eslint && typeof mod.eslint === 'object',
        hasTypescript: mod.typescript && typeof mod.typescript === 'object'
      }));
    `,
    );

    const result = execSync(`node ${testFile}`, { cwd: packagePath, encoding: 'utf8' });

    const output = JSON.parse(result.trim());

    expect(output.success).toBe(true);
    expect(output.hasTesting).toBe(true);
    expect(output.hasEslint).toBe(true);
    expect(output.hasTypescript).toBe(true);
  });
});
