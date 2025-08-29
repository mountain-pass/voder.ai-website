import { execSync } from 'child_process';
import { readdir, readFile } from 'fs/promises';
import { join } from 'path';
import { describe, expect, it } from 'vitest';

import { cleanupTempDir, createTempDir } from './helpers/fs-utils';

describe.skip('Manual NODE_V8_COVERAGE test', () => {
  it('should collect V8 coverage from subprocess when manually set', async () => {
    // Create a temporary directory for coverage output
    const coverageDir = await createTempDir('v8-coverage');

    console.log('Coverage dir:', coverageDir);

    try {
      // Run a simple script with NODE_V8_COVERAGE manually set
      const result = execSync(
        'node -e "console.log(\'Hello from subprocess\'); const x = 1 + 1; console.log(x);"',
        {
          encoding: 'utf8',
          env: {
            ...process.env,
            NODE_V8_COVERAGE: coverageDir,
          },
        },
      );

      console.log('Script output:', result);

      // Check if coverage files were created
      const files = await readdir(coverageDir);

      console.log('Coverage files:', files);

      if (files.length > 0) {
        // Read one of the coverage files
        const coverageFile = files[0];

        const content = await readFile(join(coverageDir, coverageFile), 'utf8');

        const coverage = JSON.parse(content);

        console.log('Coverage data sample:', Object.keys(coverage));
      }

      expect(files.length).toBeGreaterThan(0);
    } finally {
      await cleanupTempDir(coverageDir);
    }
  });
});
