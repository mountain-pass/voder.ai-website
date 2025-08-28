/**
 * Markdown linter abstraction (ADR-0006: markdownlint-cli2)
 *
 * Provides:
 * - getConfig(overrides?) => JSON-serializable lint configuration object
 * - createCLICommand(opts?) => CLI invocation string consumers can place in package.json scripts
 *
 * Note: This module intentionally does NOT require the markdown CLI package at runtime.
 * Consumers who want to run linting must install markdownlint-cli2 as described in ADR-0006.
 */

export type MdLintOverrides = Record<string, unknown>;

export function getConfig(overrides: MdLintOverrides = {}): Record<string, unknown> {
  const baseRules: Record<string, unknown> = {
    // Enforce heading levels and order
    // (MD001 is commonly used for heading increment; adjust level as needed)
    MD001: { level: 2 },

    // Require fenced code blocks to include a language
    MD040: true,

    // Forbid raw HTML (allowed_elements empty)
    MD033: { allowed_elements: [] },

    // Disable line-length rule because formatting tools handle wrapping
    MD013: false,

        // Forbid relative links in public READMEs
    MD034: { no_reference_like: true },
  };

  // Shallow merge overrides into rules (caller can toggle or replace individual rule entries)
  const mergedRules = {
    ...baseRules,
    ...overrides,
  };

  // Return a JSON-serializable configuration object in the format expected by markdownlint-cli2
  return mergedRules;
}

export function createCLICommand(opts: { configPath?: string; fix?: boolean } = {}): string {
  const parts: string[] = [];

  // Recommend the tool selected in ADR-0006. This function only returns a string and does not require the tool.
  parts.push('markdownlint-cli2');

  if (opts.configPath) {
    parts.push('--config');
    parts.push(opts.configPath);
  }

  if (opts.fix) {
    parts.push('--fix');
  }

  // Default file globs we expect consumers to lint
  parts.push('"README.md"');
  parts.push('"docs/**/*.md"');

  return parts.join(' ').trim();
}
