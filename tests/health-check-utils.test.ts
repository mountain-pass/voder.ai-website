import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import * as utils from '../scripts/health-check-utils';

describe('health-check-utils', () => {
  describe('parseVersion', () => {
    it('parses semantic versions correctly', () => {
      expect(utils.parseVersion('1.2.3')).toEqual({ major: 1, minor: 2, patch: 3 });
      expect(utils.parseVersion('v10.20.30')).toEqual({ major: 10, minor: 20, patch: 30 });
      expect(utils.parseVersion('2.3.4-beta.1')).toEqual({ major: 2, minor: 3, patch: 4 });
    });

    it('returns null for invalid versions', () => {
      expect(utils.parseVersion('')).toBeNull();
      expect(utils.parseVersion('abc')).toBeNull();
      expect(utils.parseVersion(null)).toBeNull();
      expect(utils.parseVersion(undefined)).toBeNull();
    });
  });

  describe('compareSemver', () => {
    it('compares versions properly', () => {
      expect(utils.compareSemver('1.0.0', '1.0.0')).toBe(0);
      expect(utils.compareSemver('1.2.3', '1.2.0')).toBe(1);
      expect(utils.compareSemver('1.2.0', '1.2.3')).toBe(-1);
      expect(utils.compareSemver('v2.0.0', '1.9.9')).toBe(1);
      expect(utils.compareSemver('1.0.0-alpha', '1.0.0')).toBe(0);
    });

    it('returns null when versions cannot be parsed', () => {
      expect(utils.compareSemver('garbage', '1.0.0')).toBeNull();
      expect(utils.compareSemver(null, '1.0.0')).toBeNull();
    });
  });

  describe('checkLockfileAndNodeModules', () => {
    const existsSpy = vi.spyOn(require('fs'), 'existsSync');

    beforeEach(() => {
      existsSpy.mockReset();
    });

    afterEach(() => {
      existsSpy.mockRestore();
    });

    it('returns true when both lockfile and node_modules exist', () => {
      existsSpy.mockImplementation((p: string) => {
        if (p.endsWith('package-lock.json')) return true;
        if (p.endsWith('node_modules')) return true;
        return false;
      });

      expect(utils.checkLockfileAndNodeModules('/some/project')).toBe(true);
    });

    it('returns false when missing either', () => {
      existsSpy.mockImplementation((p: string) => {
        if (p.endsWith('package-lock.json')) return false;
        if (p.endsWith('node_modules')) return true;
        return false;
      });

      expect(utils.checkLockfileAndNodeModules('/some/project')).toBe(false);

      existsSpy.mockImplementation((p: string) => false);

      expect(utils.checkLockfileAndNodeModules('/some/project')).toBe(false);
    });
  });
});
