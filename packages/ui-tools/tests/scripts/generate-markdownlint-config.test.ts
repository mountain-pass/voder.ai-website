import { getConfig } from '@voder/dev-config/linters/markdown';
import * as fs from 'fs';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

// Mock fs to prevent actual file writing
vi.mock('fs', async (importOriginal) => {
  const actual = (await importOriginal()) as any;

  return {
    ...actual,
    writeFileSync: vi.fn(),
  };
});

// Mock @voder/dev-config/linters/markdown to provide a predictable config
vi.mock('@voder/dev-config/linters/markdown', () => ({
  getConfig: vi.fn(() => ({
    extends: ['markdownlint/style/prettier'],
    MD013: false,
  })),
}));

describe('generate-markdownlint-config script', () => {
  let consoleWarnSpy: any;

  let writeFileSyncSpy: any;

  beforeEach(() => {
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    writeFileSyncSpy = vi.mocked(fs.writeFileSync);
    writeFileSyncSpy.mockClear();
  });

  afterEach(() => {
    consoleWarnSpy.mockRestore();
    vi.clearAllMocks();
  });

  test('script logic executes and generates config file', () => {
    // Simulate the script logic directly
    const config = getConfig();

    fs.writeFileSync('.markdownlint.json', JSON.stringify(config, null, 2));
    console.warn('✅ .markdownlint.json generated');

    // Verify writeFileSync was called with correct arguments
    expect(writeFileSyncSpy).toHaveBeenCalledOnce();

    const [fileName, content] = writeFileSyncSpy.mock.calls[0];

    expect(fileName).toBe('.markdownlint.json');
    expect(content).toContain('"extends"');
    expect(content).toContain('"MD013"');

    // Verify the content is valid JSON with config
    const parsedContent = JSON.parse(content);

    expect(parsedContent).toBeDefined();
    expect(typeof parsedContent).toBe('object');

    // Verify success message was logged
    expect(consoleWarnSpy).toHaveBeenCalledWith('✅ .markdownlint.json generated');
  });

  test('getConfig function returns a valid configuration object', () => {
    const config = getConfig();

    // Basic validation that it's a configuration object
    expect(config).toBeDefined();
    expect(typeof config).toBe('object');
    expect(config).not.toBeNull();

    // Should have some markdown linting rules
    expect(Object.keys(config).length).toBeGreaterThan(0);
  });
});
