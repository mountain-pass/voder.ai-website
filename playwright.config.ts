import { defineConfig, devices } from '@playwright/test';

const isCI = !!process.env.CI;

export default defineConfig({
  testDir: 'tests/e2e',
  timeout: 30_000,
  retries: isCI ? 2 : 0,
  reporter: [['list'], ['json', { outputFile: 'playwright-results.json' }]],
  use: {
    // Base URL for `page.goto('/')`
    baseURL: 'http://localhost:5173',

    // Artifacts and diagnostic helpers for flaky tests
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',

    // sensible defaults
    actionTimeout: 0,
    navigationTimeout: 30_000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  // where to put test artifacts
  outputDir: 'test-results/',
});
