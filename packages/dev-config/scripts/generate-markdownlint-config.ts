#!/usr/bin/env tsx
/*
 * scripts/generate-markdownlint-config.ts
 *
 * Generates .markdownlint.json in the project root by invoking getConfig()
 * from the markdown linter abstraction.
 */
import { writeFileSync } from 'fs';
import { resolve } from 'path';

import { getConfig } from '../linters/markdown/index.js';

/**
 * Generates a markdownlint config file that can be tested
 */
export function generateMarkdownlintConfig(outputDir?: string): string {
  // Retrieve the base Markdown lint rules
  const config = getConfig();

  // Determine output path using explicit logic to avoid branching
  let resolvedOutputDir = outputDir;

  /* istanbul ignore if */
  if (!resolvedOutputDir) {
    /* istanbul ignore next */
    resolvedOutputDir = process.cwd();
  }
  const outputPath = resolve(resolvedOutputDir, '.markdownlint.json');

  // Serialize and write JSON config
  writeFileSync(outputPath, JSON.stringify(config, null, 2) + '\n', 'utf-8');

  return outputPath;
}

// CLI execution - only runs when this file is executed directly
/* istanbul ignore if */
if (process.argv[1] === new URL(import.meta.url).pathname) {
  /* istanbul ignore next */
  const outputPath = generateMarkdownlintConfig();

  /* istanbul ignore next */
  // Inform via stderr for console-first output policy
  console.error(`✅ Generated Markdown lint config at ${outputPath}`);
}
