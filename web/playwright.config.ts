import { defineConfig, devices } from '@playwright/test';

const API_PORT = 8110;
const WEB_PORT = 3100;

// The mock server doubles as the Supabase Auth endpoint, so sign-in can be tested through the real UI.
const env = {
  NEXT_PUBLIC_API_URL: `http://localhost:${API_PORT}/api`,
  NEXT_PUBLIC_SUPABASE_URL: `http://localhost:${API_PORT}`,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: 'e2e-anon-key',
  NEXT_PUBLIC_SITE_URL: `http://localhost:${WEB_PORT}`,
  NEXT_DIST_DIR: '.next-e2e',
};

export default defineConfig({
  testDir: './tests/e2e',
  testMatch: '**/*.spec.ts',
  // Tests share one in-memory mock backend, so they run one at a time and reset it first.
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : [['list']],
  use: {
    baseURL: `http://localhost:${WEB_PORT}`,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    locale: 'lt-LT',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: [
    {
      command: 'node tests/e2e/mock-api.mjs',
      url: `http://localhost:${API_PORT}/api/health`,
      env: { MOCK_PORT: String(API_PORT) },
      reuseExistingServer: !process.env.CI,
    },
    {
      command: `npm run build && npm run start -- -p ${WEB_PORT}`,
      url: `http://localhost:${WEB_PORT}`,
      env,
      timeout: 180_000,
      reuseExistingServer: !process.env.CI,
    },
  ],
});
