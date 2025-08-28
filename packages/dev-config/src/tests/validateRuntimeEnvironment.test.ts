import { mkdtempSync, rmSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { describe, expect,it } from 'vitest';

import { validateRuntimeEnvironment } from '../utils/validateRuntime.js';

describe('validateRuntimeEnvironment()', () => {
  it('throws if jiti cannot be resolved', () => {
    // Temporarily force require.resolve to fail
    const origResolve = require.resolve;

    // @ts-ignore
    require.resolve = () => { throw new Error('not found'); };

    expect(() => validateRuntimeEnvironment())
      .toThrow(/Missing required peer dependency \"jiti\"/);

    // Restore
    // @ts-ignore
    require.resolve = origResolve;
  });

  it('throws if tsconfig JSON files are missing', () => {
    const cwd = process.cwd();

    // Create an empty temp directory
    const temp = mkdtempSync(join(tmpdir(), 'voder-validate-'));

    process.chdir(temp);

    // Stub require.resolve to succeed
    const origResolve = require.resolve;

    // @ts-ignore
    require.resolve = () => __filename;

    expect(() => validateRuntimeEnvironment())
      .toThrow(/Missing TypeScript ESLint config/);

    // Clean up and restore
    // @ts-ignore
    require.resolve = origResolve;
    process.chdir(cwd);
    rmSync(temp, { recursive: true, force: true });
  });
});
