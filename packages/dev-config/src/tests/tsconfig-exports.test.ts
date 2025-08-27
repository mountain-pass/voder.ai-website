import { describe, it, expect } from 'vitest';
import tsconfigEslint from '@voder/dev-config/typescript/tsconfig.eslint.json' assert { type: 'json' };
import tsconfigConfig from '@voder/dev-config/typescript/tsconfig.config.json' assert { type: 'json' };

describe('TypeScript JSON config exports', () => {
  it('tsconfig.eslint.json has correct "extends" and compilerOptions', () => {
    expect(tsconfigEslint).toHaveProperty('extends', './base.json');
    expect(tsconfigEslint).toHaveProperty('compilerOptions');
    expect(Array.isArray((tsconfigEslint.compilerOptions as any).types)).toBe(true);
    expect((tsconfigEslint.compilerOptions as any).types).toEqual(
      expect.arrayContaining(['node', 'vitest/globals'])
    );
    expect((tsconfigEslint.compilerOptions as any)).toHaveProperty('isolatedModules', false);
  });

  it('tsconfig.config.json has correct "extends" and compilerOptions', () => {
    expect(tsconfigConfig).toHaveProperty('extends', './base.json');
    expect(tsconfigConfig).toHaveProperty('compilerOptions');
    expect(Array.isArray((tsconfigConfig.compilerOptions as any).types)).toBe(true);
    expect((tsconfigConfig.compilerOptions as any).types).toEqual(
      expect.arrayContaining(['node'])
    );
    expect((tsconfigConfig.compilerOptions as any)).toHaveProperty('isolatedModules', false);
  });
});
