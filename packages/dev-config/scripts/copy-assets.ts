#!/usr/bin/env tsx
/* eslint-env node */
/**
 * scripts/copy-assets.ts
 *
 * Cross-platform asset copy for builds:
 * - copies typescript/*.json -> dist/typescript/
 * - copies eslint/*.js -> dist/eslint/
 * - creates destination directories if missing
 * - preserves mode bits where possible
 * - exits non-zero on unexpected errors and writes diagnostics to stderr
 *
 * This file uses TypeScript and tsx for execution.
 */

import { chmod, copyFile, lstat,mkdir, readdir, stat } from 'fs/promises';
import { join, resolve, sep } from 'path';
import { exit, stderr } from 'process';

import { ensureDir } from '../src/utils/fs.js';

/**
 * Copies files matching a predicate from source to destination directory
 */
export async function copyMatchingFiles(
  srcDir: string,
  predicate: (name: string) => boolean,
  destDir: string,
): Promise<string[]> {
  const copiedFiles: string[] = [];

  try {
    const entries = await readdir(srcDir, { withFileTypes: true });

    // Ensure we have an absolute, normalized source directory for validation
    const absSrcDir = resolve(srcDir);

    const absSrcDirWithSep = absSrcDir.endsWith(sep) ? absSrcDir : `${absSrcDir}${sep}`;

    for (const ent of entries) {
      // Only consider names that match the predicate
      if (!predicate(ent.name)) {
        continue;
      }

      const name = ent.name;

      const srcPath = resolve(absSrcDir, name);

      // Basic path traversal check: ensure resolved path is inside the intended srcDir
      if (!srcPath.startsWith(absSrcDirWithSep)) {
        stderr.write(`⚠️ Skipping ${name} - path traversal detected: ${srcPath}\n`);
        continue;
      }

      // Lstat to detect symbolic links and non-regular files. Skip symlinks.
      let lst;

      try {
        lst = await lstat(srcPath);
      } catch (lstatErr) {
        // If we can't stat the file, skip it with a warning instead of failing the whole copy
        stderr.write(`⚠️ Skipping ${name} - unable to stat source: ${String(lstatErr)}\n`);
        continue;
      }

      if (lst.isSymbolicLink()) {
        stderr.write(`⚠️ Skipping ${name} - symbolic link detected and not allowed\n`);
        continue;
      }

      // Only copy regular files
      if (!lst.isFile()) {
        // skip directories, device files, etc.
        continue;
      }

      const destPath = resolve(destDir, name);

      // Copy file (overwrite if exists)
      await copyFile(srcPath, destPath);

      // Preserve mode bits where possible
      try {
        // Use the lstat result (mode) which is appropriate for regular files
        await chmod(destPath, lst.mode);
      } catch (modeErr) {
        /* istanbul ignore next */
        throw new Error(
          `Failed to preserve mode for ${srcPath} -> ${destPath}: ${String(modeErr)}`,
        );
      }

      copiedFiles.push(name);
    }
  } catch (err) {
    // If directory doesn't exist or other error happens, throw
    /* istanbul ignore next */
    throw new Error(`Error copying from ${srcDir} to ${destDir}: ${String(err)}`);
  }

  return copiedFiles;
}

/**
 * Main copy assets function that can be tested
 */
export async function copyAssets(
  repoRoot?: string,
): Promise<{ tsFiles: string[]; jsFiles: string[] }> {
  // Resolve root directory using explicit logic to avoid branching
  let resolvedRoot = repoRoot;

  /* istanbul ignore if */
  if (!resolvedRoot) {
    /* istanbul ignore next */
    resolvedRoot = process.cwd();
  }

  const tsSrc = join(resolvedRoot, 'typescript');

  const eslintSrc = join(resolvedRoot, 'eslint');

  const tsDest = join(resolvedRoot, 'dist', 'typescript');

  const eslintDest = join(resolvedRoot, 'dist', 'eslint');

  await ensureDir(tsDest);
  await ensureDir(eslintDest);

  // Use explicit predicate functions to avoid branching in anonymous functions
  const isJsonFile = (name: string): boolean => name.endsWith('.json');

  const isJsFile = (name: string): boolean => name.endsWith('.js');

  const tsFiles = await copyMatchingFiles(tsSrc, isJsonFile, tsDest);

  const jsFiles = await copyMatchingFiles(eslintSrc, isJsFile, eslintDest);

  return { tsFiles, jsFiles };
}

/**
 * Formats and displays CLI results. Extracted for testability.
 */
export function formatCLIOutput(result: { tsFiles: string[]; jsFiles: string[] }): void {
  result.tsFiles.forEach((file: string) => {
    stderr.write(`✅ Copied TypeScript file: ${file}\n`);
  });

  result.jsFiles.forEach((file: string) => {
    stderr.write(`✅ Copied ESLint file: ${file}\n`);
  });

  stderr.write('🎉 copy-assets completed successfully\n');
}

// CLI execution - only runs when this file is executed directly
/* istanbul ignore if */
if (process.argv[1] === new URL(import.meta.url).pathname) {
  /* istanbul ignore next */
  (async (): Promise<void> => {
    try {
      const result = await copyAssets();

      formatCLIOutput(result);
    } catch (err) {
      stderr.write(`❌ ${String(err)}\n`);
      exit(1);
    }
  })();
}
