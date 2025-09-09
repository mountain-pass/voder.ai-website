import fs from 'fs';
import path from 'path';

export type Semver = { major: number; minor: number; patch: number } | null;

export function parseVersion(v?: string | null): Semver {
  if (!v) return null;
  let str = v;

  if (str[0] === 'v') str = str.slice(1);
  // drop pre-release/build metadata by matching the core semver
  const m = str.match(/^(\d+)\.(\d+)\.(\d+)/);

  if (!m) return null;

  return { major: Number(m[1]), minor: Number(m[2]), patch: Number(m[3]) };
}

export function compareSemver(a?: string | null, b?: string | null): 1 | 0 | -1 | null {
  const A = parseVersion(a || undefined);

  const B = parseVersion(b || undefined);

  if (!A || !B) return null;

  if (A.major !== B.major) return A.major > B.major ? 1 : -1;
  if (A.minor !== B.minor) return A.minor > B.minor ? 1 : -1;
  if (A.patch !== B.patch) return A.patch > B.patch ? 1 : -1;

  return 0;
}

/**
 * Check for the presence of a package-lock.json and node_modules directory under the given root.
 * Returns true when both are present, false otherwise. No side-effects.
 */
export function checkLockfileAndNodeModules(root?: string): boolean {
  const projectRoot = root ? path.resolve(root) : process.cwd();

  const lockPath = path.join(projectRoot, 'package-lock.json');

  const nodeModulesPath = path.join(projectRoot, 'node_modules');

  let ok = true;

  if (!fs.existsSync(lockPath)) {
    ok = false;
  }

  if (!fs.existsSync(nodeModulesPath)) {
    ok = false;
  }

  return ok;
}
