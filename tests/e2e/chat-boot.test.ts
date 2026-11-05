import fs from 'node:fs';
import path from 'node:path';
import { test, expect } from '@playwright/test';

test.describe('Playwright webServer environment & chat page boot (#43)', () => {
  test('workflow declares disposable Postgres DATABASE_URL and references secrets safely', () => {
    const workflowPath = path.resolve(process.cwd(), '.github/workflows/playwright.yml');
    const workflow = fs.readFileSync(workflowPath, 'utf8');

    expect(workflow).toContain('services:');
    expect(workflow).toContain('postgres:16-alpine');
    expect(workflow).toContain(
      'DATABASE_URL: postgresql://postgres:postgres_test_password@localhost:5432/stellar_studio_test'
    );
    expect(workflow).toContain('OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}');
    expect(workflow).not.toMatch(/echo.*secrets\./i);
  });

  test('reaches /chat without a server-side 500 crash', async ({ page }) => {
    const response = await page.goto('/chat');
    expect(response).not.toBeNull();
    expect(response!.status()).toBeLessThan(500);
    await expect(page.locator('body')).toBeVisible();
  });
});
