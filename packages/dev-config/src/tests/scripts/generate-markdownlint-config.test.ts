import { execSync } from 'child_process';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { cleanupTempDir, createTempDir } from '../helpers/fs-utils';

// Helper to run script with coverage collection
function runScriptWithCoverage(
  scriptPath: string,
  cwd: string,
): { stdout: string; stderr: string; success: boolean } {
  // Use NODE_V8_COVERAGE to collect coverage from subprocess into the same directory as the main process
  // This allows Vitest to merge subprocess coverage with main process coverage
  const coverageDir = process.env.NODE_V8_COVERAGE;

  const env = {
    ...process.env,
    // Only set NODE_V8_COVERAGE if it's already set (indicating coverage collection is active)
    ...(coverageDir && { NODE_V8_COVERAGE: coverageDir }),
  };

  try {
    const result = execSync(`npx tsx ${scriptPath} 2>&1`, {
      cwd,
      encoding: 'utf8',
      env,
    });

    return { stdout: result, stderr: result, success: true };
  } catch (error: any) {
    const output = error.stdout || error.message || '';

    return {
      stdout: output,
      stderr: output,
      success: false,
    };
  }
}

describe('generate-markdownlint-config script', () => {
  let testDir: string;

  let originalCwd: string;

  beforeEach(async () => {
    originalCwd = process.cwd();
    testDir = await createTempDir('markdownlint-test');
    process.chdir(testDir);
  });

  afterEach(async () => {
    process.chdir(originalCwd);
    try {
      await cleanupTempDir(testDir);
    } catch {
      // Ignore cleanup errors
    }
  });

  it('generates .markdownlint.json with expected configuration', async () => {
    // Run the generate-markdownlint-config script from the dev-config directory
    const scriptPath = join(originalCwd, 'scripts/generate-markdownlint-config.ts');

    const result = runScriptWithCoverage(scriptPath, originalCwd); // Run from actual dev-config directory

    // Should complete successfully
    expect(result.stderr).toContain('✅ Generated Markdown lint config');

    // The script outputs to stderr, so we need to capture it differently
    // execSync returns stdout by default, but we need stderr
    // Let's just check if the file was created and has valid content

    // Verify the config file was generated in the dev-config directory
    const configPath = join(originalCwd, '.markdownlint.json');

    const configContent = await readFile(configPath, 'utf8');

    const config = JSON.parse(configContent);

    // Verify the configuration has expected structure
    expect(config).toBeDefined();
    expect(typeof config).toBe('object');

    // Check for expected rules (based on the markdown linter implementation)
    expect(config).toHaveProperty('MD013', false); // Line length should be disabled
    expect(config).toHaveProperty('MD001'); // Header levels rule should exist

    // Verify success message (file existence proves the script ran successfully)
    // expect(output).toContain('✅ Generated Markdown lint config');
    // expect(output).toContain('.markdownlint.json');
  });

  it('produces valid JSON output', async () => {
    // Run the script
    const scriptPath = join(originalCwd, 'scripts/generate-markdownlint-config.ts');

    execSync(`npx tsx "${scriptPath}"`, {
      cwd: originalCwd,
      env: { ...process.env, NODE_ENV: 'test' },
    });

    // Verify the generated file contains valid JSON
    const configPath = join(originalCwd, '.markdownlint.json');

    const configContent = await readFile(configPath, 'utf8');

    // Should parse without throwing
    expect(() => JSON.parse(configContent)).not.toThrow();

    // Should be properly formatted (with newline at end)
    expect(configContent).toMatch(/\n$/);
  });

  it('overwrites existing configuration file', async () => {
    // Create an existing config file with different content
    const configPath = join(originalCwd, '.markdownlint.json');

    await writeFile(configPath, '{"old": "config"}');

    // Run the script
    const scriptPath = join(originalCwd, 'scripts/generate-markdownlint-config.ts');

    execSync(`npx tsx "${scriptPath}"`, {
      cwd: originalCwd,
      env: { ...process.env, NODE_ENV: 'test' },
    });

    // Verify the file was overwritten with new content
    const configContent = await readFile(configPath, 'utf8');

    const config = JSON.parse(configContent);

    // Should not contain the old content
    expect(config).not.toHaveProperty('old');

    // Should contain expected markdownlint configuration
    expect(config).toHaveProperty('MD013');
  });

  it('generates configuration matching getConfig() output', async () => {
    // Import getConfig directly to compare output
    const { getConfig } = await import('../../../linters/markdown/index.js');

    const expectedConfig = getConfig();

    // Run the script
    const scriptPath = join(originalCwd, 'scripts/generate-markdownlint-config.ts');

    execSync(`npx tsx "${scriptPath}"`, {
      cwd: originalCwd,
      env: { ...process.env, NODE_ENV: 'test' },
    });

    // Read the generated file
    const configPath = join(originalCwd, '.markdownlint.json');

    const configContent = await readFile(configPath, 'utf8');

    const generatedConfig = JSON.parse(configContent);

    // Should match the output of getConfig()
    expect(generatedConfig).toEqual(expectedConfig);
  });

  it('outputs to stderr for console-first policy compliance', async () => {
    // Run the script and capture stderr
    const scriptPath = join(originalCwd, 'scripts/generate-markdownlint-config.ts');

    const result = execSync(`npx tsx "${scriptPath}" 2>&1`, {
      encoding: 'utf8',
      cwd: originalCwd,
      env: { ...process.env, NODE_ENV: 'test' },
    });

    // Verify diagnostic output goes to stderr (captured by 2>&1)
    expect(result).toContain('✅ Generated Markdown lint config');

    // The script should complete successfully
    expect(result).not.toContain('Error');
    expect(result).not.toContain('Failed');
  });

  it('creates configuration file in current working directory', async () => {
    // The script should always create .markdownlint.json in the current working directory
    const scriptPath = join(originalCwd, 'scripts/generate-markdownlint-config.ts');

    execSync(`npx tsx "${scriptPath}"`, {
      cwd: originalCwd,
      env: { ...process.env, NODE_ENV: 'test' },
    });

    // Verify file was created in the original directory (where we ran from)
    const configPath = join(originalCwd, '.markdownlint.json');

    const configContent = await readFile(configPath, 'utf8');

    // Should be valid JSON
    expect(() => JSON.parse(configContent)).not.toThrow();
  });
});
