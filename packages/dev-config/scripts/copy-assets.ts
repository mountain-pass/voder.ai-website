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

import { chmod, copyFile, mkdir, readdir, stat } from 'fs/promises';
import { join, resolve } from 'path';
import { exit, stderr } from 'process';

async function ensureDir(dir: string): Promise<void> {
  try {
    await mkdir(dir, { recursive: true });
  } catch (err) {
    stderr.write(`❌ Failed to create directory ${dir}: ${String(err)}\n`);
    exit(1);
  }
}

async function copyMatchingFiles(
  srcDir: string,
  predicate: (name: string) => boolean,
  destDir: string,
): Promise<void> {
  try {
    const entries = await readdir(srcDir, { withFileTypes: true });

    for (const ent of entries) {
      if (!ent.isFile()) continue;
      const name = ent.name;

      if (!predicate(name)) continue;

      const srcPath = resolve(srcDir, name);

      const destPath = resolve(destDir, name);

      // Copy file (overwrite if exists)
      await copyFile(srcPath, destPath);

      // Preserve mode bits where possible
      try {
        const st = await stat(srcPath);

        await chmod(destPath, st.mode);
      } catch (modeErr) {
        stderr.write(
          `❌ Failed to preserve mode for ${srcPath} -> ${destPath}: ${String(modeErr)}\n`,
        );
        exit(1);
      }

      stderr.write(`✅ Copied: ${srcPath} -> ${destPath}\n`);
    }
  } catch (err) {
    // If directory doesn't exist or other error happens, fail loudly
    stderr.write(`❌ Error copying from ${srcDir} to ${destDir}: ${String(err)}\n`);
    exit(1);
  }
}

(async (): Promise<void> => {
  const repoRoot = process.cwd();

  const tsSrc = join(repoRoot, 'typescript');

  const eslintSrc = join(repoRoot, 'eslint');

  const tsDest = join(repoRoot, 'dist', 'typescript');

  const eslintDest = join(repoRoot, 'dist', 'eslint');

  await ensureDir(tsDest);
  await ensureDir(eslintDest);

  await copyMatchingFiles(tsSrc, (name) => name.endsWith('.json'), tsDest);
  await copyMatchingFiles(eslintSrc, (name) => name.endsWith('.js'), eslintDest);

  stderr.write('🎉 copy-assets completed successfully\n');
})();
