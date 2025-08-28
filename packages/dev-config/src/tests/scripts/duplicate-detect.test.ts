import { execSync } from 'child_process';
import { join } from 'path';
import { describe, expect, it } from 'vitest';

describe('duplicate-detect script', () => {
  it('reports no tracked duplicate hashes detected', () => {
    // Construct the path to the duplicate-detect script
    const scriptPath = join(process.cwd(), 'scripts', 'duplicate-detect.sh');

    // Execute the script, redirecting stderr to stdout to capture the diagnostic message
    const output = execSync(`sh "${scriptPath}" 2>&1`, {
      encoding: 'utf8',
    });

    // Assert the expected message is present
    expect(output).toContain('No tracked duplicate hashes detected');
  });
});
