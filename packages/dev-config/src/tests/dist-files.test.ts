import { execSync } from 'child_process';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { setupTestPackageInstallation, teardownTestEnvironment } from './helpers/common.js';

describe('package installation integration tests', () => {
  let tempDir: string;

  let packagePath: string;

  beforeAll(async () => {
    ({ tempDir, packagePath } = await setupTestPackageInstallation());
  }, 120000);

  afterAll(async () => {
    await teardownTestEnvironment(tempDir);
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
        hasMD001: cfg && cfg.MD001 && typeof cfg.MD001.level === 'number'
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
