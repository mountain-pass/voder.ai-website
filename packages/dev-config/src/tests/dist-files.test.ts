import { execSync, spawnSync } from 'child_process';
import { mkdir, mkdtemp, rm, writeFile } from 'fs/promises';
import { tmpdir } from 'os';
import { join, resolve } from 'path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe('package installation integration tests', () => {
  let tempDir: string;

  let packagePath: string;

  beforeAll(async () => {
    // Create temp directory
    tempDir = await mkdtemp(join(tmpdir(), 'voder-test-'));

    // Pack the current package
    const result = spawnSync('npm', ['pack'], { encoding: 'utf8', shell: false });

    if (result.error) throw result.error;
    const packResult = result.stdout;

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
  }, 60000); // 60 second timeout for setup

  afterAll(async () => {
    await rm(tempDir, { recursive: true, force: true });
  });

  it('testing factory exists and returns node environment', async () => {
    const testFile = join(packagePath, 'test-testing.mjs');

    await writeFile(
      testFile,
      `
      import { createVitestNodeConfig } from '@voder/dev-config/testing';
      const cfg = createVitestNodeConfig();
      console.log(JSON.stringify({ 
        success: true, 
        hasFunction: typeof createVitestNodeConfig === 'function',
        environment: cfg?.test?.environment 
      }));
    `,
    );

    const result = execSync(`node ${testFile}`, { cwd: packagePath, encoding: 'utf8' });

    const output = JSON.parse(result.trim());

    expect(output.success).toBe(true);
    expect(output.hasFunction).toBe(true);
    expect(output.environment).toBe('node');
  });

  it('markdown linter exposes getConfig and createCLICommand', async () => {
    const testFile = join(packagePath, 'test-markdown.mjs');

    await writeFile(
      testFile,
      `
      import { getConfig, createCLICommand } from '@voder/dev-config/linters/markdown';
      const cfg = getConfig();
      console.log(JSON.stringify({ 
        success: true,
        hasGetConfig: typeof getConfig === 'function',
        hasCreateCLI: typeof createCLICommand === 'function',
        hasMD013: cfg && cfg.MD013 === false,
        hasMD001: cfg && typeof cfg.MD001 === 'object'
      }));
    `,
    );

    const result = execSync(`node ${testFile}`, { cwd: packagePath, encoding: 'utf8' });

    const output = JSON.parse(result.trim());

    expect(output.success).toBe(true);
    expect(output.hasGetConfig).toBe(true);
    expect(output.hasCreateCLI).toBe(true);
    expect(output.hasMD013).toBe(true);
    expect(output.hasMD001).toBe(true);
  });

  it('prettier config has expected properties', async () => {
    const testFile = join(packagePath, 'test-prettier.mjs');

    await writeFile(
      testFile,
      `
      import prettierConfig from '@voder/dev-config/prettier';
      console.log(JSON.stringify({ 
        success: true,
        hasConfig: !!prettierConfig,
        hasPrintWidth: prettierConfig && typeof prettierConfig.printWidth === 'number',
        hasSemi: prettierConfig && typeof prettierConfig.semi === 'boolean'
      }));
    `,
    );

    const result = execSync(`node ${testFile}`, { cwd: packagePath, encoding: 'utf8' });

    const output = JSON.parse(result.trim());

    expect(output.success).toBe(true);
    expect(output.hasConfig).toBe(true);
    expect(output.hasPrintWidth).toBe(true);
    expect(output.hasSemi).toBe(true);
  });
});
