import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config({override: true});
/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  timeout: 60000,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: 1,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    // baseURL: 'http://localhost:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
    headless: true,
    actionTimeout: 90000,
    navigationTimeout: 90000,
    storageState: 'data/auth.json',
  },

  expect: {
    timeout: 10000,  // default is 5000ms
  },

  /* Configure projects for major browsers */
 projects: [
    // Login project runs first
    {
      name: 'setup',
      testMatch: /.*himtrekLogin\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
      },
    },

    // All other tests depend on login
    {
      name: 'chromium',
      dependencies: ['setup'],
      testIgnore: /.*himtrekLogin\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'data/auth.json',
      },
    },
  ],
});