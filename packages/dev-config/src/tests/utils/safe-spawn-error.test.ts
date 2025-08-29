import { describe, expect, it } from 'vitest';

import { safeSpawn } from '../../utils/safe-spawn.js';

describe('safeSpawn() input validation', () => {
  it('rejects when given an empty command string', async () => {
    await expect(safeSpawn('', [])).rejects.toThrow(TypeError);
  });

  it('rejects when given non-string args array elements', async () => {
    // @ts-expect-error testing invalid args type
    await expect(safeSpawn('node', ['-e', 123] as any)).rejects.toThrow(TypeError);
  });

  it('rejects when args is not an array', async () => {
    // @ts-expect-error testing invalid args type
    await expect(safeSpawn('node', 'not-an-array' as any)).rejects.toThrow(TypeError);
  });
});
