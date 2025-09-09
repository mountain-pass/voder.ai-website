import fs from 'fs';
import path from 'path';

export function parseVersion(v) {
  if (!v) return null;
  let str = v;
  if (str[0] === 'v') str = str.slice(1);
  const m = str.match(/^(\d+)\.(\d+)\.(\d+)/);

  if (!m) return null;

  return { major: Number(m[1]), minor: Number(m[2]), patch: Number(m[3]) };
}

export function compareSemver(a, b) {
  const A = parseVersion(a);
  const B = parseVersion(b);

  if (!A || !B) return null;

  if (A.major !== B.major) return A.major > B.major ? 1 : -1;
  if (A.minor !== B.minor) return A.minor > B.minor ? 1 : -1;
  if (A.patch !== B.patch) return A.patch > B.patch ? 1 : -1;

  return 0;
}

export function checkLockfileAndNodeModules(root) {
  const projectRoot = root ? path.resolve(root) : process.cwd();

  const lockPath = path.join(projectRoot, 'package-lock.json');
  const nodeModulesPath = path.join(projectRoot, 'node_modules');

  return fs.existsSync(lockPath) && fs.existsSync(nodeModulesPath);
}
