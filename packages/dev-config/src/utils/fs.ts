import { mkdir } from 'fs/promises';

/**
 * Ensures a directory exists, creating it recursively if needed.
 */
export async function ensureDir(dir: string): Promise<void> {
  try {
    await mkdir(dir, { recursive: true });
  } catch (err) {
    throw new Error(`Failed to create directory ${dir}: ${String(err)}`);
  }
}
