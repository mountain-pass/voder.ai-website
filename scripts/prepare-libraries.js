import fs from 'fs';
import path from 'path';

const root = process.cwd();

const pkgPath = path.join(root, 'package.json');

function log(...args) {
  console.log('[prepare-libraries]', ...args);
}
function warn(...args) {
  console.warn('[prepare-libraries][WARN]', ...args);
}
function fail(...args) {
  console.error('[prepare-libraries][ERROR]', ...args);
}

if (!fs.existsSync(pkgPath)) {
  fail('package.json not found. Run this script from the repository root.');
  process.exit(2);
}

const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

const deps = Object.assign({}, pkg.dependencies || {}, pkg.devDependencies || {});

const packageNames = Object.keys(deps).sort();

const nodeModulesDir = path.join(root, 'node_modules');

if (!fs.existsSync(nodeModulesDir)) {
  fail('node_modules/ not found. Please run "npm ci" or "npm install" before running this script.');
  process.exit(1);
}

const destDir = path.join(root, 'docs', 'libraries');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
  log('Created', path.relative(root, destDir));
}

const allowedReadmes = [
  'README.md',
  'README.MD',
  'readme.md',
  'Readme.md',
  'README',
  'readme',
  'README.markdown',
];

const created = [];

const skipped = [];

const errors = [];

for (const name of packageNames) {
  const parts = name.split('/');

  const pkgDir = path.join(nodeModulesDir, ...parts);

  if (!fs.existsSync(pkgDir)) {
    skipped.push({ name, reason: 'not-installed' });
    continue;
  }

  let readmePath = null;

  for (const rn of allowedReadmes) {
    const candidate = path.join(pkgDir, rn);

    if (fs.existsSync(candidate)) {
      readmePath = candidate;
      break;
    }
  }

  if (!readmePath) {
    skipped.push({ name, reason: 'no-readme' });
    continue;
  }

  const safeName = name.replace(/\//g, '--');

  const ext = path.extname(readmePath) || '.md';

  const destFile = path.join(destDir, `${safeName}${ext}`);

  // Remove stale destination if exists
  try {
    if (fs.existsSync(destFile)) {
      fs.unlinkSync(destFile);
    }

    // Try to create a symlink pointing to the README in node_modules
    try {
      // On Windows, creating symlinks may require special privileges. Attempt and fall back to copy.
      fs.symlinkSync(readmePath, destFile);
      created.push({ name, type: 'symlink', target: readmePath, dest: destFile });
      log('Linked', name, '->', path.relative(root, readmePath));
    } catch (symlinkErr) {
      // Fallback: copy the file contents
      try {
        fs.copyFileSync(readmePath, destFile);
        created.push({ name, type: 'copy', target: readmePath, dest: destFile });
        warn('Symlink failed for', name + ' (falling back to copy):', symlinkErr.message);
      } catch (copyErr) {
        errors.push({ name, error: copyErr.message });
        warn('Failed to copy README for', name + ':', copyErr.message);
      }
    }
  } catch (e) {
    errors.push({ name, error: e.message });
    warn('Error preparing', name + ':', e.message);
  }
}

// Clean up stale files in destDir that do not match current packages
const currentFiles = new Set(created.map((c) => path.basename(c.dest)));

const destEntries = fs.readdirSync(destDir, { withFileTypes: true });

for (const entry of destEntries) {
  if (!entry.isFile()) continue;
  if (!currentFiles.has(entry.name)) {
    const p = path.join(destDir, entry.name);

    try {
      fs.unlinkSync(p);
      log('Removed stale entry', path.relative(root, p));
    } catch (e) {
      warn('Failed to remove stale entry', p, e.message);
    }
  }
}

log('Summary:');
log('  packages examined:', packageNames.length);
log('  created:', created.length);
log('  skipped:', skipped.length);
if (errors.length) {
  warn('  errors:', errors.length);
  for (const er of errors) {
    warn('   -', er.name, er.error);
  }
}

if (errors.length) {
  process.exit(1);
}

process.exit(0);
