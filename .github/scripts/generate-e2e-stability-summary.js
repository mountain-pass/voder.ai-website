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

if (!reportPath) {
  console.error('No Playwright JSON report found. Exiting with success for workflow.');
  // still write empty stability artifacts so CI artifact upload steps have something
  fs.writeFileSync('e2e-stability.json', JSON.stringify({ generatedAt: new Date().toISOString(), stats: { total: 0, passed: 0, failed: 0, flaky: 0 } }, null, 2));
  fs.writeFileSync('e2e-stability.txt', `generatedAt: ${new Date().toISOString()}\ntotal: 0\npassed: 0\nfailed: 0\nflaky: 0\n`);
  process.exit(0);
}

const report = safeParse(reportPath);

if (!report) {
  console.error(`Failed to parse report JSON at ${reportPath}. Exiting with success for workflow.`);
  fs.writeFileSync('e2e-stability.json', JSON.stringify({ generatedAt: new Date().toISOString(), stats: { total: 0, passed: 0, failed: 0, flaky: 0 } }, null, 2));
  fs.writeFileSync('e2e-stability.txt', `generatedAt: ${new Date().toISOString()}\ntotal: 0\npassed: 0\nfailed: 0\nflaky: 0\n`);
  process.exit(0);
}

const stats = { total: 0, passed: 0, failed: 0, flaky: 0 };

function walk(node) {
  if (!node || typeof node !== 'object') return;
  if (Array.isArray(node.tests)) {
    for (const t of node.tests) {
      stats.total += 1;
      const s = (t.status || '').toLowerCase();
      if (s === 'passed') stats.passed += 1;
      else if (s === 'failed') stats.failed += 1;
      else if (s === 'flaky') stats.flaky += 1;
    }
  }
  for (const key of Object.keys(node)) {
    const val = node[key];
    if (val && typeof val === 'object') walk(val);
  }
}

walk(report);

const out = { generatedAt: new Date().toISOString(), stats };
fs.writeFileSync('e2e-stability.json', JSON.stringify(out, null, 2));
fs.writeFileSync('e2e-stability.txt', `generatedAt: ${out.generatedAt}\ntotal: ${stats.total}\npassed: ${stats.passed}\nfailed: ${stats.failed}\nflaky: ${stats.flaky}\n`);

console.log('E2E stability summary written to e2e-stability.json and e2e-stability.txt');
console.log(JSON.stringify(out, null, 2));
