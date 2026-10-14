import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { resolvePlaywrightOptions } from '../../playwright.config';

interface SpecAttemptResult {
  retry: number;
  status: 'passed' | 'failed';
}

interface SpecExecutionSummary {
  outcome: 'expected' | 'flaky' | 'unexpected';
  attempts: SpecAttemptResult[];
  htmlReportEntry: string;
}

function executeSpecWithRetries(
  maxRetries: number,
  runAttempt: (retryIndex: number) => void
): SpecExecutionSummary {
  const attempts: SpecAttemptResult[] = [];

  for (let retry = 0; retry <= maxRetries; retry++) {
    try {
      runAttempt(retry);
      attempts.push({ retry, status: 'passed' });
      break;
    } catch {
      attempts.push({ retry, status: 'failed' });
    }
  }

  const passedAttempt = attempts.find((a) => a.status === 'passed');
  const outcome: SpecExecutionSummary['outcome'] = !passedAttempt
    ? 'unexpected'
    : attempts.length > 1
      ? 'flaky'
      : 'expected';

  const htmlReportEntry = `<div class="test-outcome" data-outcome="${outcome}" data-retries="${attempts.length - 1}">${attempts
    .map((a) => `<span class="attempt" data-retry="${a.retry}" data-status="${a.status}">Attempt #${a.retry + 1}: ${a.status}</span>`)
    .join('')}</div>`;

  return { outcome, attempts, htmlReportEntry };
}

describe('playwright.config.ts CI retry configuration', () => {
  it('resolves retries to 2 and workers to 1 when process.env.CI is set', () => {
    const ciConfig = resolvePlaywrightOptions({ CI: 'true' });

    assert.strictEqual(ciConfig.retries, 2);
    assert.strictEqual(ciConfig.workers, 1);
    assert.strictEqual(ciConfig.forbidOnly, true);
    assert.strictEqual(ciConfig.reporter, 'html');
    assert.strictEqual(ciConfig.webServer?.reuseExistingServer, false);
  });

  it('resolves retries to 0 for local runs when process.env.CI is unset', () => {
    const localConfig = resolvePlaywrightOptions({});

    assert.strictEqual(localConfig.retries, 0);
    assert.strictEqual(localConfig.workers, 8);
    assert.strictEqual(localConfig.forbidOnly, false);
    assert.strictEqual(localConfig.webServer?.reuseExistingServer, true);
  });

  it('passes a deliberately flaky spec on retry in CI, reports it as flaky rather than failed, and records the retry in the HTML report', () => {
    const ciConfig = resolvePlaywrightOptions({ CI: '1' });
    let callCount = 0;

    const summary = executeSpecWithRetries(ciConfig.retries ?? 0, () => {
      callCount += 1;
      if (callCount === 1) {
        throw new Error('Transient RPC / web-server startup flake on first attempt');
      }
    });

    assert.strictEqual(summary.outcome, 'flaky');
    assert.notStrictEqual(summary.outcome, 'unexpected');
    assert.strictEqual(summary.attempts.length, 2);
    assert.deepStrictEqual(summary.attempts, [
      { retry: 0, status: 'failed' },
      { retry: 1, status: 'passed' },
    ]);
    assert.match(summary.htmlReportEntry, /data-outcome="flaky"/);
    assert.match(summary.htmlReportEntry, /data-retries="1"/);
    assert.match(summary.htmlReportEntry, /Attempt #2: passed/);
  });

  it('keeps zero retries on local runs for fast feedback when a spec fails', () => {
    const localConfig = resolvePlaywrightOptions({});
    let callCount = 0;

    const summary = executeSpecWithRetries(localConfig.retries ?? 0, () => {
      callCount += 1;
      throw new Error('Immediate failure on local run');
    });

    assert.strictEqual(localConfig.retries, 0);
    assert.strictEqual(callCount, 1);
    assert.strictEqual(summary.outcome, 'unexpected');
    assert.strictEqual(summary.attempts.length, 1);
  });

  it('declares retries: process.env.CI ? 2 : 0 and workers: process.env.CI ? 1 : 8 in playwright.config.ts source', () => {
    const configPath = new URL('../../playwright.config.ts', import.meta.url);
    const configSource = fs.readFileSync(configPath, 'utf8');

    assert.match(configSource, /retries:\s*(process\.)?env\.CI\s*\?\s*2\s*:\s*0/);
    assert.match(configSource, /workers:\s*(process\.)?env\.CI\s*\?\s*1\s*:\s*8/);
  });
});
