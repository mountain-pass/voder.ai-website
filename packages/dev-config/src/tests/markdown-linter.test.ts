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

  it('createCLICommand includes configPath when provided', () => {
    const cmd = createCLICommand({ configPath: '.custom-markdownlint.json' });

    expect(cmd).toContain('--config');
    expect(cmd).toContain('.custom-markdownlint.json');
  });

  it('createCLICommand includes fix flag when requested', () => {
    const cmd = createCLICommand({ fix: true });

    expect(cmd).toContain('--fix');
  });

  it('createCLICommand includes both configPath and fix when provided', () => {
    const cmd = createCLICommand({
      configPath: '.custom-config.json',
      fix: true,
    });

    expect(cmd).toContain('--config');
    expect(cmd).toContain('.custom-config.json');
    expect(cmd).toContain('--fix');
  });

  it('createCLICommand without options includes default file patterns', () => {
    const cmd = createCLICommand();

    expect(cmd).toContain('"README.md"');
    expect(cmd).toContain('"docs/**/*.md"');
  });

  it('createCLICommand with options still includes default file patterns', () => {
    const cmd = createCLICommand({ fix: true, configPath: '.test.json' });

    expect(cmd).toContain('"README.md"');
    expect(cmd).toContain('"docs/**/*.md"');
  });
});
