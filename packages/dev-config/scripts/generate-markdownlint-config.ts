#!/usr/bin/env tsx
/*
 * scripts/generate-markdownlint-config.ts
 *
 * Generates .markdownlint.json in the project root by invoking getConfig()
 * from the markdown linter abstraction.
 */
import { writeFileSync, renameSync, unlinkSync, existsSync } from 'fs';
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

  // Write atomically: write to a temp file in the same directory then rename
  const tempPath = resolve(
    resolvedOutputDir,
    `.markdownlint.json.${process.pid}.${Date.now()}.tmp`,
  );

  // Serialize content (keep trailing newline for POSIX-friendliness)
  const serialized = JSON.stringify(config, null, 2) + '\n';

  // Write temp file and then atomically rename into place. This reduces the
  // chance of consumers seeing a partial file if the process is interrupted.
  writeFileSync(tempPath, serialized, 'utf-8');

  try {
    // On POSIX this is atomic when on the same filesystem. On some Windows
    // environments renameSync may fail if the target exists, so fall back to
    // an explicit replace.
    renameSync(tempPath, outputPath);
  } catch (err) {
    if (existsSync(outputPath)) {
      try {
        unlinkSync(outputPath);
      } catch (unlinkErr) {
        // If we cannot remove the old file, rethrow the original error
        /* istanbul ignore next */
        throw err;
      }
      // Retry the rename after removing the existing file
      renameSync(tempPath, outputPath);
    } else {
      throw err;
    }
  }

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
