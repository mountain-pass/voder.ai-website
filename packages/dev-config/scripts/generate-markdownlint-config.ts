#!/usr/bin/env tsx
/*
 * scripts/generate-markdownlint-config.ts
 *
 * Generates .markdownlint.json in the project root by invoking getConfig()
 * from the markdown linter abstraction.
 */
import { writeFileSync } from 'fs';
import { resolve } from 'path';

import { getConfig } from '../linters/markdown/index.ts';

// Retrieve the base Markdown lint rules
const config = getConfig();

// Determine output path
const outputPath = resolve(process.cwd(), '.markdownlint.json');

// Serialize and write JSON config
writeFileSync(outputPath, JSON.stringify(config, null, 2) + '\n', 'utf-8');

// Inform via stderr for console-first output policy
console.error(`✅ Generated Markdown lint config at ${outputPath}`);
