import { defineConfig, devices } from '@playwright/test';
import { config } from 'dotenv';

config({
  path: '.env.local',
});

const PORT = process.env.PORT || 3000;
const baseURL = `http://localhost:${PORT}`;

export const webServerEnv: Record<string, string> = {
  ...(process.env as Record<string, string>),
  PLAYWRIGHT: 'True',
  DATABASE_URL:
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    'postgresql://postgres:postgres_test_password@localhost:5432/stellar_studio_test',
  POSTGRES_URL:
    process.env.POSTGRES_URL ||
    process.env.DATABASE_URL ||
    'postgresql://postgres:postgres_test_password@localhost:5432/stellar_studio_test',
  AUTH_SECRET:
    process.env.AUTH_SECRET || 'local-playwright-test-secret-32-chars',
  NEXTAUTH_URL: process.env.NEXTAUTH_URL || baseURL,
  NEXT_PUBLIC_STELLAR_NETWORK:
    process.env.NEXT_PUBLIC_STELLAR_NETWORK || 'testnet',
  OPENAI_API_KEY:
    process.env.OPENAI_API_KEY || 'sk-playwright-test-placeholder',
};

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: process.env.CI ? 2 : 8,
  reporter: 'html',
  use: {
    baseURL,
    trace: 'retain-on-failure',
  },
  timeout: 240 * 1000,
  expect: {
    timeout: 240 * 1000,
  },
  projects: [
    {
      name: 'e2e',
      testMatch: /e2e\/.*\.test\.ts/,
      use: {
        ...devices['Desktop Chrome'],
      },
    },
    {
      name: 'routes',
      testMatch: /routes\/.*\.test\.ts/,
      use: {
        ...devices['Desktop Chrome'],
      },
    },
  ],
  webServer: {
    command: 'pnpm dev',
    url: `${baseURL}/ping`,
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI,
    env: webServerEnv,
  },
});
