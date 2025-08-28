import { readFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

const __dirname = dirname(__filename);

/**
 * Synchronously load and parse a JSON file from the typescript directory.
 * @param relPath - Path to the JSON file, relative to typescript/ directory
 */
export function loadJSON(relPath: string): any {
  // Handle both test environment (src/utils) and compiled environment (dist/src/utils)
  // From src/utils/ to typescript/: ../../typescript/
  // From dist/src/utils/ to typescript/: ../../../typescript/
  const environment = `${__dirname.includes('/dist/')}` as 'true' | 'false';

  const pathLevels = {
    true: ['..', '..', '..'], // compiled environment: dist/src/utils -> typescript
    false: ['..', '..'], // source environment: src/utils -> typescript
  };

  const levelsUp = pathLevels[environment];

  const fullPath = resolve(__dirname, ...levelsUp, 'typescript', relPath);

  return JSON.parse(readFileSync(fullPath, 'utf8'));
}

export default loadJSON;
