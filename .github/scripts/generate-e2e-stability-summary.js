#!/usr/bin/env node
import fs from 'fs';

const reportPath = process.argv[2] || 'test-results/playwright-report.json';

function safeParse(path) {
  try {
    const raw = fs.readFileSync(path, 'utf8');

    return JSON.parse(raw);
  } catch (e) {
    // intentionally return null if parsing fails
    return null;
  }
}

const report = safeParse(reportPath);

if (!report) {
  console.error(`No report found at ${reportPath}. Exiting with success for workflow.`);
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
fs.writeFileSync(
  'e2e-stability.txt',
  `generatedAt: ${out.generatedAt}\ntotal: ${stats.total}\npassed: ${stats.passed}\nfailed: ${stats.failed}\nflaky: ${stats.flaky}\n`,
);

console.log('E2E stability summary written to e2e-stability.json and e2e-stability.txt');
console.log(JSON.stringify(out, null, 2));
