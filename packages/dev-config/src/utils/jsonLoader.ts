import { readFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

const __dirname = dirname(__filename);

/**
 * Synchronously load and parse a JSON file relative to this module.
 * @param relPath - Path to the JSON file, relative to src/utils/jsonLoader.ts
 */
export function loadJSON(relPath: string): any {
  const fullPath = resolve(__dirname, '..', '..', 'typescript', relPath);

  return JSON.parse(readFileSync(fullPath, 'utf8'));
}

export default loadJSON;
