import { describe, expect, it, vi } from 'vitest';

import { formatCLIOutput } from '../../scripts/copy-assets.js';

describe('formatCLIOutput()', () => {
  it('formats and displays CLI results correctly', () => {
    // Mock stderr.write to capture output
    const mockStderrWrite = vi.spyOn(process.stderr, 'write').mockImplementation(() => true);

    const testResult = {
      tsFiles: ['config1.json', 'config2.json'],
      jsFiles: ['eslint1.js', 'eslint2.js'],
    };

    formatCLIOutput(testResult);

    // Verify the correct output was written
    expect(mockStderrWrite).toHaveBeenCalledWith('✅ Copied TypeScript file: config1.json\n');
    expect(mockStderrWrite).toHaveBeenCalledWith('✅ Copied TypeScript file: config2.json\n');
    expect(mockStderrWrite).toHaveBeenCalledWith('✅ Copied ESLint file: eslint1.js\n');
    expect(mockStderrWrite).toHaveBeenCalledWith('✅ Copied ESLint file: eslint2.js\n');
    expect(mockStderrWrite).toHaveBeenCalledWith('🎉 copy-assets completed successfully\n');

    // Restore
    mockStderrWrite.mockRestore();
  });

  it('handles empty results correctly', () => {
    // Mock stderr.write to capture output
    const mockStderrWrite = vi.spyOn(process.stderr, 'write').mockImplementation(() => true);

    const testResult = {
      tsFiles: [],
      jsFiles: [],
    };

    formatCLIOutput(testResult);

    // Should still show completion message
    expect(mockStderrWrite).toHaveBeenCalledWith('🎉 copy-assets completed successfully\n');

    // Restore
    mockStderrWrite.mockRestore();
  });
});
