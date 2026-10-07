import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { deployToken } from './deploy-token';
import { getCurrentNetwork } from '@/lib/stellar/config';

describe('deployToken AI Tool', () => {
  it('exposes a description and inputSchema to the AI SDK', () => {
    assert.ok(deployToken.description, 'Tool should have a description');
    assert.match(
      deployToken.description,
      /Deploy a custom token on Stellar using the TokenFactory contract/,
      'Description should mention deploying custom tokens'
    );
    assert.ok(
      deployToken.inputSchema || (deployToken as any).parameters,
      'Tool should have an input schema'
    );
  });

  it('rejects invalid tokenType via schema validation', () => {
    const schema = (deployToken.inputSchema || (deployToken as any).parameters) as any;
    const invalidInput = {
      name: 'Test Token',
      symbol: 'TEST',
      initialSupply: '1000000',
      tokenType: 'InvalidType',
    };

    const parsed = schema.safeParse(invalidInput);
    assert.strictEqual(parsed.success, false, 'Invalid tokenType should fail schema validation');
    if (!parsed.success) {
      const errorPaths = parsed.error.issues.map((i: any) => i.path.join('.'));
      assert.ok(errorPaths.includes('tokenType'), 'Error should be on tokenType field');
    }
  });

  it('defaults decimals to 7 when omitted in schema parsing', async () => {
    const schema = (deployToken.inputSchema || (deployToken as any).parameters) as any;
    const inputWithoutDecimals = {
      name: 'Default Decimal Token',
      symbol: 'DDT',
      initialSupply: '5000',
      tokenType: 'Pausable',
    };

    const parsed = schema.safeParse(inputWithoutDecimals);
    assert.strictEqual(parsed.success, true, 'Parsing without decimals should succeed');
    assert.strictEqual(parsed.data.decimals, 7, 'Decimals should default to 7');

    const result: any = await (deployToken as any).execute(parsed.data, { toolCallId: 'test', messages: [] });
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.transaction.params.config.decimals, 7);
    assert.strictEqual(result.data.decimals, 7);
  });

  it('generates a valid 64-character hex salt in transaction intent config', async () => {
    const params = {
      name: 'Salted Token',
      symbol: 'SALT',
      decimals: 7,
      initialSupply: '1000',
      tokenType: 'Allowlist' as const,
    };

    const result: any = await (deployToken as any).execute(params, { toolCallId: 'test', messages: [] });
    assert.strictEqual(result.success, true);
    const saltBuffer: Buffer = result.transaction.params.config.salt;
    assert.ok(Buffer.isBuffer(saltBuffer), 'Salt should be a Buffer');
    const saltHex = saltBuffer.toString('hex');
    assert.strictEqual(saltHex.length, 64, 'Salt should be 64 hex characters (32 bytes)');
    assert.match(saltHex, /^[0-9a-fA-F]{64}$/, 'Salt should be valid hex');
  });

  it('handles cap properly: included for Capped token and omitted/undefined otherwise', async () => {
    // 1. Capped token with cap specified
    const cappedParams = {
      name: 'Capped Token',
      symbol: 'CAP',
      decimals: 7,
      initialSupply: '1000',
      tokenType: 'Capped' as const,
      cap: '1000000',
    };

    const cappedResult: any = await (deployToken as any).execute(cappedParams, { toolCallId: 'test', messages: [] });
    assert.strictEqual(cappedResult.success, true);
    assert.strictEqual(cappedResult.transaction.params.config.cap, '1000000');

    // 2. Non-capped token without cap
    const uncappedParams = {
      name: 'Uncapped Token',
      symbol: 'UNCAP',
      decimals: 7,
      initialSupply: '1000',
      tokenType: 'Pausable' as const,
    };

    const uncappedResult: any = await (deployToken as any).execute(uncappedParams, { toolCallId: 'test', messages: [] });
    assert.strictEqual(uncappedResult.success, true);
    assert.strictEqual(uncappedResult.transaction.params.config.cap, undefined);
  });

  it('builds the exact transaction intent structure handed to the router', async () => {
    const params = {
      name: 'Phase4 Token',
      symbol: 'P4T',
      decimals: 6,
      initialSupply: '250000',
      tokenType: 'Vault' as const,
      admin: 'GBZXN7PIRZGNMHGA7MUUUF4GWPY5AYPV6LY4UV2GL6VJGIQRXFDNMADI',
      manager: 'GBLPZXN7PIRZGNMHGA7MUUUF4GWPY5AYPV6LY4UV2GL6VJGIQRXFDNM',
      cap: '500000',
    };

    const result: any = await (deployToken as any).execute(params, { toolCallId: 'test', messages: [] });
    assert.strictEqual(result.success, true);

    const tx = result.transaction;
    assert.strictEqual(tx.type, 'contract_call');
    assert.strictEqual(tx.operationType, 'write');
    assert.strictEqual(tx.contractType, 'token_factory');
    assert.strictEqual(tx.method, 'deploy_token');
    assert.strictEqual(tx.params.deployer, params.admin);

    const config = tx.params.config;
    assert.strictEqual(config.admin, params.admin);
    assert.strictEqual(config.manager, params.manager);
    assert.strictEqual(config.name, params.name);
    assert.strictEqual(config.symbol, params.symbol);
    assert.strictEqual(config.decimals, params.decimals);
    assert.strictEqual(config.initial_supply, params.initialSupply);
    assert.deepStrictEqual(config.token_type, { tag: 'Vault', values: undefined });
    assert.strictEqual(config.asset, undefined);
    assert.strictEqual(config.cap, '500000');
    assert.strictEqual(config.decimals_offset, undefined);
    assert.strictEqual(tx.comment, `Deploy ${params.name} (${params.symbol}) token on ${getCurrentNetwork()}`);
  });
});
