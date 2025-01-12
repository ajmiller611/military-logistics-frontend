import { defineConfig, devices } from '@playwright/test';
import path from 'path';

const PORT = process.env.PORT ?? 3000;

const baseURL = `http://localhost:${PORT}`;

export default defineConfig({
  forbidOnly: !!process.env.CI, // Fail the build on CI if test.only left in the source code.
  fullyParallel: true,
  outputDir: 'test-results/',
  projects: [
    {
      name: 'Desktop Chrome',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
    {
      name: 'Mobile Safari',
      use: devices['iPhone 15'],
    },
  ],
  retries: process.env.CI ? 2 : 0,
  reporter: 'html',
  testDir: path.join(__dirname, 'tests/e2e'),
  timeout: process.env.CI ? 60 * 1000 : 30 * 1000,
  use: {
    baseURL,
    headless: true,
    trace: process.env.CI ? 'on-first-retry' : 'off',
    screenshot: process.env.CI ? 'only-on-failure' : 'off',
    video: process.env.CI ? 'retry-with-video' : 'off',
  },
  webServer: {
    command: 'npm run dev',
    url: baseURL,
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI,
  },
  workers: process.env.CI ? 1 : undefined,
});
