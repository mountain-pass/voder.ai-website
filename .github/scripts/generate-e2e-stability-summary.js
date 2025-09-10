#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

// Accept optional path or look for common Playwright JSON outputs
const candidates = [
  process.argv[2],
  'playwright-results.json',
  'test-results/playwright-report.json',
  'test-results/playwright-results.json',
];

function findFirstExisting(pathsList) {
  for (const p of pathsList) {
    if (!p) continue;

    try {
      if (fs.existsSync(p)) return p;
    } catch {
      // ignore
    }
  }

  // last resort: search for any JSON in test-results/
  try {
    const dir = 'test-results';

    if (fs.existsSync(dir) && fs.statSync(dir).isDirectory()) {
      const files = fs.readdirSync(dir);

      for (const file of files) {
        if (file.endsWith('.json')) return path.join(dir, file);
      }
    }
  } catch {
    // ignore
  }

  return null;
}

const reportPath = findFirstExisting(candidates) || null;

function safeParse(pathToFile) {
  try {
    const raw = fs.readFileSync(pathToFile, 'utf8');

    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function scanArtifacts() {
  const artifacts = [];

  const root = 'test-results';

  try {
    if (fs.existsSync(root) && fs.statSync(root).isDirectory()) {
      const walk = (dir) => {
        const entries = fs.readdirSync(dir);

        for (const entry of entries) {
          const full = path.join(dir, entry);

          try {
            const stat = fs.statSync(full);

            if (stat.isDirectory()) {
              walk(full);
            } else if (stat.isFile()) {
              const rel = path.relative(process.cwd(), full);

              // include common Playwright artifacts
              if (
                rel.endsWith('.zip') ||
                rel.endsWith('.html') ||
                rel.endsWith('.json') ||
                rel.endsWith('.png') ||
                rel.endsWith('.webm') ||
                rel.endsWith('.trace') ||
                rel.endsWith('.txt') ||
                rel.endsWith('.mp4')
              ) {
                artifacts.push(rel);
              }
            }
          } catch {
            // ignore file stat errors
          }
        }
      };

      walk(root);
    }
  } catch {
    // ignore scanning errors
  }

  // Also include a few common root-level artifacts if present
  ['playwright-results.json', 'preview.out', 'preview.log', 'preview.pid'].forEach((p) => {
    try {
      if (fs.existsSync(p) && fs.statSync(p).isFile()) artifacts.push(p);
    } catch {
      // ignore
    }
  });

  // Deduplicate & sort
  return Array.from(new Set(artifacts)).sort();
}

function writeEmpty(exitCode) {
  const out = {
    generatedAt: new Date().toISOString(),
    stats: { total: 0, passed: 0, failed: 0, flaky: 0 },
    artifacts: [],
  };

  try {
    fs.writeFileSync('e2e-stability.json', JSON.stringify(out, null, 2));
    fs.writeFileSync(
      'e2e-stability.txt',
      `generatedAt: ${out.generatedAt}\ntotal: 0\npassed: 0\nfailed: 0\nflaky: 0\n`,
    );
  } catch {
    console.error('Failed to write empty stability artifacts');
    process.exit(exitCode || 2);
  }

  process.exit(exitCode || 1);
}

if (!reportPath) {
  console.error(
    'No Playwright JSON report found. Writing empty stability artifacts and exiting non-zero.',
  );
  writeEmpty(1);
}

const report = safeParse(reportPath);

if (!report) {
  console.error(
    `Failed to parse report JSON at ${reportPath}. Writing empty stability artifacts and exiting non-zero.`,
  );
  writeEmpty(2);
}

const stats = { total: 0, passed: 0, failed: 0, flaky: 0 };

function walk(node) {
  if (!node || typeof node !== 'object') return;

  if (Array.isArray(node.tests)) {
    for (const t of node.tests) {
      stats.total += 1;
      const s = (t.status || '').toString().toLowerCase();

      if (s === 'passed') stats.passed += 1;
      else if (s === 'failed') stats.failed += 1;
      else if (s === 'flaky') stats.flaky += 1;
    }
  }

  // Some Playwright reporters emit 'suites' or arrays; try to handle arrays of test results
  if (Array.isArray(node)) {
    for (const item of node) walk(item);
  }

  for (const key of Object.keys(node)) {
    const val = node[key];

    if (val && typeof val === 'object') walk(val);
  }
}

walk(report);

const artifacts = scanArtifacts();

const out = { generatedAt: new Date().toISOString(), stats, artifacts };

try {
  fs.writeFileSync('e2e-stability.json', JSON.stringify(out, null, 2));
  fs.writeFileSync(
    'e2e-stability.txt',
    `generatedAt: ${out.generatedAt}\ntotal: ${stats.total}\npassed: ${stats.passed}\nfailed: ${stats.failed}\nflaky: ${stats.flaky}\n`,
  );
} catch {
  console.error('Failed to write stability artifacts');
  process.exit(3);
}

console.log('E2E stability summary written to e2e-stability.json and e2e-stability.txt');
console.log(JSON.stringify(out, null, 2));
process.exit(0);
