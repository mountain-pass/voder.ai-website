import { execSync } from 'child_process';
import { describe, expect, it } from 'vitest';

// Skip this test suite in CI environments to avoid NODE_V8_COVERAGE issues
const describeIfLocal = process.env.CI ? describe.skip : describe;

describeIfLocal('NODE_V8_COVERAGE debugging', () => {
  it('should show NODE_V8_COVERAGE environment variable', () => {
    console.log('NODE_V8_COVERAGE in main process:', process.env.NODE_V8_COVERAGE);
    console.log(
      'All coverage-related env vars:',
      Object.keys(process.env).filter((k) => k.includes('COVERAGE') || k.includes('V8')),
    );

    const result = execSync(
      "node -e \"console.log('NODE_V8_COVERAGE in subprocess:', process.env.NODE_V8_COVERAGE); console.log('All coverage env vars:', Object.keys(process.env).filter(k => k.includes('COVERAGE') || k.includes('V8')));\"",
      {
        encoding: 'utf8',
        env: {
          ...process.env,
          NODE_V8_COVERAGE: process.env.NODE_V8_COVERAGE,
        },
      },
    );

    console.log('Subprocess output:', result);
    expect(result).toContain('NODE_V8_COVERAGE in subprocess:');
  });
});
