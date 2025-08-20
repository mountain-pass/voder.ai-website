import { describe, expect, it } from 'vitest';

import { createCLICommand, getConfig } from '../../linters/markdown/index.js';

describe('markdown linter abstraction', () => {
  it('getConfig returns rules and disables MD013', () => {
    const cfg = getConfig();

    expect(typeof cfg).toBe('object');
    // Configuration should be a direct rules object, not wrapped in a rules property
    expect(cfg).toHaveProperty('MD013');
    expect(cfg).toHaveProperty('MD001');
    expect(cfg).toHaveProperty('MD040');

    // MD013 (line length) should be disabled (false)
    expect(cfg.MD013).toBe(false);

    // Other rules should be configured
    expect(cfg.MD040).toBe(true); // Require language in code blocks
    expect(cfg.MD001).toEqual({ level: 2 }); // Heading levels
  });

  it('createCLICommand returns a CLI string that references markdownlint', () => {
    const cmd = createCLICommand();

    expect(typeof cmd).toBe('string');
    // accept either markdownlint or markdownlint-cli2 in the returned command
    expect(cmd).toMatch(/markdownlint(-cli2)?/);
  });
});
