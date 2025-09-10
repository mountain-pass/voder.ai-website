#!/usr/bin/env node
// Non-interactive health-check script
// Uses only Node built-ins: fs, path, child_process, os, process

// Using ESM import syntax to be compatible with package.json "type": "module"
import child_process from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

function readPackageJson() {
  const pkgPath = path.resolve(__dirname, '..', 'package.json');

  try {
    const raw = fs.readFileSync(pkgPath, 'utf8');

    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to read package.json at', pkgPath, '\n', err && err.message);
    process.exit(2);
  }
}

function parseVersion(v) {
  if (!v) return null;
  if (v[0] === 'v') v = v.slice(1);
  // drop pre-release/build metadata
  const m = v.match(/^(\d+)\.(\d+)\.(\d+)/);

  if (!m) return null;

  return { major: +m[1], minor: +m[2], patch: +m[3] };
}

function compareSemver(a, b) {
  // returns 1 if a>b, 0 if equal, -1 if a<b
  const A = parseVersion(a);

  const B = parseVersion(b);

  if (!A || !B) return null;
  if (A.major !== B.major) return A.major > B.major ? 1 : -1;
  if (A.minor !== B.minor) return A.minor > B.minor ? 1 : -1;
  if (A.patch !== B.patch) return A.patch > B.patch ? 1 : -1;

  return 0;
}

function checkNodeEngine(requiredRange) {
  const current = process.version.replace(/^v/, '');

  console.log(`Node required: ${requiredRange || '(not specified)'}  |  Node running: ${current}`);

  if (!requiredRange) return true;

  // Very small subset of semver range support: exact match or >=x.y.z
  const trimmed = requiredRange.trim();

  if (trimmed.startsWith('>=')) {
    const req = trimmed.slice(2).trim();

    const cmp = compareSemver(current, req);

    if (cmp === null) {
      console.warn('Unable to robustly compare Node versions; skipping strict engine check.');

      return true;
    }
    if (cmp < 0) {
      console.error(`Node runtime ${current} does not satisfy required range ${requiredRange}.`);
      console.error('Please install a Node.js version that satisfies this requirement. Examples:');
      console.error(`  nvm install ${req} && nvm use ${req}`);
      console.error(`  fnm install ${req} && fnm use ${req}`);

      return false;
    }

    return true;
  }

  // exact version (e.g., 22.17.0) or simple range like 22.17.0
  if (/^\d+\.\d+\.\d+/.test(trimmed)) {
    const cmp = compareSemver(current, trimmed);

    if (cmp === null) return true;
    if (cmp < 0) {
      console.error(`Node runtime ${current} is less than required ${trimmed}.`);
      console.error('Please install a newer Node.js version. Example:');
      console.error(`  nvm install ${trimmed} && nvm use ${trimmed}`);

      return false;
    }

    return true;
  }

  // fallback: warn but don't fail
  console.warn(`Unrecognized engines.node format '${requiredRange}'; skipping strict check.`);

  return true;
}

function checkLockfileAndNodeModules() {
  const root = path.resolve(__dirname, '..');

  const lockPath = path.join(root, 'package-lock.json');

  const nodeModulesPath = path.join(root, 'node_modules');

  let ok = true;

  if (!fs.existsSync(lockPath)) {
    console.error('Missing package-lock.json in project root.');
    console.error(
      'Remediation: run `npm install` to generate package-lock.json and install dependencies.',
    );
    console.error('If you use CI, prefer `npm ci` once package-lock.json is present.');
    ok = false;
  }
  if (!fs.existsSync(nodeModulesPath)) {
    console.error('Missing node_modules/ directory.');
    console.error(
      'Remediation: run `npm ci` to install dependencies (recommended) or `npm install`.',
    );
    ok = false;
  }

  return ok;
}

function runCommand(cmd, args, label) {
  return new Promise((resolve) => {
    console.log('='.repeat(72));
    console.log(`Running: ${label} -> ${cmd} ${args.join(' ')}`);
    console.log('='.repeat(72));

    const child = child_process.spawn(cmd, args, { stdio: 'inherit', shell: false });

    child.on('error', (err) => {
      console.error(`${label} failed to start:`, err && err.message);
      resolve({ code: 127, error: err });
    });

    child.on('exit', (code, signal) => {
      if (signal) {
        console.error(`${label} terminated with signal ${signal}`);
      }
      resolve({ code: code === null ? 1 : code });
    });
  });
}

async function main() {
  const pkg = readPackageJson();

  const enginesNode = pkg && pkg.engines && pkg.engines.node;

  const nodeOk = checkNodeEngine(enginesNode);

  if (!nodeOk) process.exitCode = 2;

  const depsOk = checkLockfileAndNodeModules();

  if (!depsOk) process.exitCode = 2;

  if (process.exitCode === 2) {
    console.error('\nHealth check cannot continue until the issues above are resolved.');
    process.exit(2);
  }

  const steps = [
    { cmd: 'npm', args: ['run', 'type-check'], label: 'TypeScript type-check' },
    { cmd: 'npm', args: ['run', 'lint:check'], label: 'ESLint (check - zero warnings allowed)' },
    { cmd: 'npm', args: ['run', 'format:check'], label: 'Prettier (format check)' },
  ];

  const results = [];

  for (const step of steps) {
    // Each step streams output to the console so the caller sees diagnostics first.
    // We await completion and store the exit code for summary reporting.
    // Note: spawn with shell false expects command to be in PATH (npm is available).
    // If npm isn't available in PATH, this will fail with code 127.
    // We intentionally do not run in interactive mode.
    // Print a short hint if a step is expected to be long.
    if (step.label === 'TypeScript type-check') {
      console.log('Note: type-check may take a few seconds on first run.');
    }
    // run

    const r = await runCommand(step.cmd, step.args, step.label);

    results.push({ label: step.label, code: r.code });
    if (r.code !== 0) {
      console.error(`\n${step.label} failed with exit code ${r.code}.`);
      if (step.label === 'TypeScript type-check') {
        console.error(
          'Remediation: run `npm run type-check` locally and address type errors reported above.',
        );
      } else if (step.label.includes('ESLint')) {
        console.error(
          'Remediation: run `npm run lint:fix` to try to auto-fix issues, then `npm run lint:check` to verify.',
        );
      } else if (step.label.includes('Prettier')) {
        console.error(
          'Remediation: run `npm run format` to auto-format files, then `npm run format:check`.',
        );
      }
      // stop further steps on first failure
      break;
    }
  }

  console.log('\nHealth-check summary:');
  let failed = false;

  for (const r of results) {
    const status = r.code === 0 ? 'OK' : `FAILED (code ${r.code})`;

    console.log(` - ${r.label}: ${status}`);
    if (r.code !== 0) failed = true;
  }

  if (failed) {
    console.error(
      '\nOne or more health-check steps failed. See logs above for details and run the remediation commands suggested.',
    );
    process.exit(1);
  }

  console.log('\nAll health-check steps passed.');
  process.exit(0);
}

main().catch((err) => {
  console.error(
    'Health-check encountered an unexpected error:',
    err && err.stack ? err.stack : err,
  );
  process.exit(3);
});
