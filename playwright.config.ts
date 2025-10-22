import { defineConfig, devices } from '@playwright/test';

const isCI = !!process.env.CI;

// Always use dev server on port 3100 for latest code
const DEV_PORT = '3100';

const BASE_URL = `http://127.0.0.1:${DEV_PORT}`;

export default defineConfig({
  testDir: 'tests/e2e',
  timeout: isCI ? 60_000 : 30_000, // Increase timeout in CI for FOUC prevention tests
  retries: isCI ? 2 : 0,

  // Enhanced reporting for screenshot testing and CI integration
  reporter: [
    ['list'],
    ['json', { outputFile: 'playwright-results.json' }],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    // Add GitHub Actions reporter in CI
    ...(isCI ? [['github'] as const] : []),
  ],
  use: {
    // Base URL for `page.goto('/')` - resolved from env so CI and scripts can coordinate
    baseURL: BASE_URL,

    // Enhanced artifacts and diagnostic helpers for comprehensive testing
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',

    // sensible defaults
    actionTimeout: 0,
    navigationTimeout: 30_000,

    // Enhanced settings for screenshot testing and visual regression
    ignoreHTTPSErrors: true, // For production testing
  },

  // Configure expect for screenshot testing
  expect: {
    // Custom timeout for screenshot operations
    timeout: 10_000,
  },

  // Always use dev server for latest code
  webServer: {
    command: 'npm run dev -- --port 3100 --host 127.0.0.1 --strictPort',
    url: BASE_URL,
    reuseExistingServer: false, // Always start fresh
    stdout: 'pipe',
    stderr: 'pipe',
    timeout: 120_000,
  },
  projects: [
    // Desktop browsers
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: {
          // Consistent screenshot rendering for Chromium
          args: ['--disable-web-security', '--disable-features=VizDisplayCompositor'],
        },
      },
    },
    // Firefox temporarily disabled due to initialization timeout issues
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    // Mobile browsers for comprehensive cross-device testing
    {
      name: 'Mobile Chrome',
      use: {
        ...devices['Pixel 5'],
        // Increase timeouts for Mobile Chrome due to performance issues with 3D rendering
        actionTimeout: 45_000,
        navigationTimeout: 45_000,
        launchOptions: {
          // Consistent screenshot rendering for Chromium
          args: ['--disable-web-security', '--disable-features=VizDisplayCompositor'],
        },
      },
      timeout: 45_000, // Increase test timeout for Mobile Chrome
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  // where to put test artifacts
  outputDir: 'test-results/',
});
