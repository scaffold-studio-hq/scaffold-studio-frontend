import { test, expect } from '@playwright/test';
import config, { resolvePlaywrightCiSettings } from '../../playwright.config';

let transientAttempts = 0;

test.describe('Playwright CI retry configuration (#44)', () => {
  test('resolves retries to 2 and workers to 1 when process.env.CI is set', () => {
    const ci = resolvePlaywrightCiSettings({ NODE_ENV: 'test', CI: 'true' });
    expect(ci.retries).toBe(2);
    expect(ci.workers).toBe(1);
  });

  test('keeps retries at 0 on local runs for fast feedback', () => {
    const local = resolvePlaywrightCiSettings({ NODE_ENV: 'test' });
    expect(local.retries).toBe(0);
    expect(local.workers).toBe(8);
  });

  test('retains html reporter so retries are recorded in the HTML report', () => {
    expect(config.reporter).toBe('html');
  });

  test('deliberately flaky spec passes on retry when retries are enabled', async ({}, testInfo) => {
    transientAttempts += 1;
    if (testInfo. project.retries > 0 && testInfo.retry === 0 && transientAttempts === 1) {
      // Simulate a first-attempt transient failure on CI so Playwright retries and marks the spec as flaky
      expect(testInfo.retry, 'Simulated transient failure on attempt 1').toBeGreaterThan(0);
    }
    expect(transientAttempts).toBeGreaterThanOrEqual(1);
  });
});
