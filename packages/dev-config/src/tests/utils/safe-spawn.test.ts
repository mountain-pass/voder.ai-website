import { describe, expect, it } from 'vitest';

import { safeSpawn } from '../../utils/safe-spawn.js';

describe('safeSpawn()', () => {
  it('captures stdout and returns code 0 for a successful command', async () => {
    const result = await safeSpawn('node', ['-e', 'console.log("ok")']);

    expect(result.code).toBe(0);
    expect(result.stdout).toContain('ok');
  });

  it('returns the correct non-zero exit code when the process exits with a code', async () => {
    const result = await safeSpawn('node', ['-e', 'process.exit(2)']);

    expect(result.code).toBe(2);
  });

  it('rejects when given an invalid command', async () => {
    await expect(safeSpawn('', [])).rejects.toThrow(TypeError);
  });
});
