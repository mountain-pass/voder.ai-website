import tsconfigConfig from '@voder/dev-config/typescript/tsconfig.config.json';
import tsconfigEslint from '@voder/dev-config/typescript/tsconfig.eslint.json';
import { describe, expect, it } from 'vitest';

describe('TypeScript JSON config exports', () => {
  it('tsconfig.eslint.json has correct "extends", types, and isolatedModules', () => {
    // matches typescript/tsconfig.eslint.json
    expect(tsconfigEslint).toHaveProperty('extends', './base.json');
    const optsEslint = tsconfigEslint.compilerOptions as any;

    expect(optsEslint).toHaveProperty('types');
    expect(Array.isArray(optsEslint.types)).toBe(true);
    expect(optsEslint.types).toEqual(expect.arrayContaining(['node', 'vitest/globals']));
    expect(optsEslint).toHaveProperty('isolatedModules', false);
  });

  it('tsconfig.config.json has correct "extends", types, and isolatedModules', () => {
    // matches typescript/tsconfig.config.json
    expect(tsconfigConfig).toHaveProperty('extends', './base.json');
    const optsConfig = tsconfigConfig.compilerOptions as any;

    expect(optsConfig).toHaveProperty('types');
    expect(Array.isArray(optsConfig.types)).toBe(true);
    expect(optsConfig.types).toEqual(expect.arrayContaining(['node']));
    expect(optsConfig).toHaveProperty('isolatedModules', false);
  });
});
