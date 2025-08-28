import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

/**
 * Creates a temporary directory with the given prefix.
 * @param prefix - The prefix for the temp directory name.
 * @returns The path to the created temporary directory.
 */
export async function createTempDir(prefix: string): Promise<string> {
  const dir = await mkdtemp(join(tmpdir(), `${prefix}-`));
  return dir;
}

/**
 * Recursively removes the temporary directory.
 * @param dir - The path to the temporary directory to remove.
 */
export async function cleanupTempDir(dir: string): Promise<void> {
  await rm(dir, { recursive: true, force: true });
}
