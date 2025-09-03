import { describe, expect, test } from 'vitest';

import { disableRules } from '../../src/utils/disableRules.js';

describe('disableRules utility', () => {
  test('disables rules in existing rules object', () => {
    const config = {
      extends: ['some-base-config'],
      rules: {
        'existing-rule': true,
        'another-rule': { option: 'value' }
      }
    };

    const result = disableRules(config, ['rule-to-disable', 'existing-rule']);

    expect(result).toEqual({
      extends: ['some-base-config'],
      rules: {
        'existing-rule': false, // Should be disabled
        'another-rule': { option: 'value' }, // Should remain unchanged
        'rule-to-disable': false // Should be added as disabled
      }
    });
  });

  test('creates rules object when it does not exist', () => {
    const config = {
      extends: ['some-base-config']
    };

    const result = disableRules(config, ['rule-to-disable', 'another-rule']);

    expect(result).toEqual({
      extends: ['some-base-config'],
      rules: {
        'rule-to-disable': false,
        'another-rule': false
      }
    });
  });

  test('handles empty rules array', () => {
    const config = {
      extends: ['some-base-config'],
      rules: {
        'existing-rule': true
      }
    };

    const result = disableRules(config, []);

    expect(result).toEqual({
      extends: ['some-base-config'],
      rules: {
        'existing-rule': true
      }
    });
  });

  test('does not mutate original config', () => {
    const config = {
      rules: {
        'existing-rule': true
      }
    };

    const original = JSON.parse(JSON.stringify(config));
    const result = disableRules(config, ['new-rule']);

    expect(config).toEqual(original);
    expect(result).not.toBe(config);
    expect(result.rules).not.toBe(config.rules);
  });

  test('handles config with null/undefined rules', () => {
    const configWithNull = {
      extends: ['base'],
      rules: null
    };

    const result1 = disableRules(configWithNull as any, ['rule1']);
    expect(result1.rules).toEqual({ rule1: false });

    const configWithUndefined = {
      extends: ['base'],
      rules: undefined
    };

    const result2 = disableRules(configWithUndefined as any, ['rule2']);
    expect(result2.rules).toEqual({ rule2: false });
  });

  test('preserves other config properties', () => {
    const config = {
      extends: ['base-config'],
      plugins: ['some-plugin'],
      env: { browser: true },
      settings: { custom: true },
      rules: {
        'existing-rule': true
      }
    };

    const result = disableRules(config, ['new-rule']);

    expect(result.extends).toEqual(['base-config']);
    expect(result.plugins).toEqual(['some-plugin']);
    expect(result.env).toEqual({ browser: true });
    expect(result.settings).toEqual({ custom: true });
    expect(result.rules['new-rule']).toBe(false);
    expect(result.rules['existing-rule']).toBe(true);
  });

  test('handles duplicate rules in disable list', () => {
    const config = {
      rules: {
        'existing-rule': true
      }
    };

    const result = disableRules(config, ['rule1', 'rule1', 'rule2', 'rule1']);

    expect(result.rules).toEqual({
      'existing-rule': true,
      'rule1': false,
      'rule2': false
    });
  });

  test('overwrites existing rule values', () => {
    const config = {
      rules: {
        'rule1': { severity: 'error', options: {} },
        'rule2': 'warn',
        'rule3': 2
      }
    };

    const result = disableRules(config, ['rule1', 'rule2']);

    expect(result.rules).toEqual({
      'rule1': false, // Overwrote object
      'rule2': false, // Overwrote string
      'rule3': 2      // Unchanged
    });
  });
});
