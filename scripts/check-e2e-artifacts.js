#!/usr/bin/env node
// Non-interactive CI-local verifier for e2e-stability artifacts.
// Exits 0 when tests ran (stats.total > 0 or artifacts.length > 0), otherwise prints helpful diagnostics and exits 3.
import fs from 'fs';
import path from 'path';

const file = path.resolve(process.cwd(), 'e2e-stability.json');
const previewOut = path.resolve(process.cwd(), 'preview.out');

function fail(msg, code = 3) {
  console.error(msg);
  try {
    if (fs.existsSync(previewOut)) {
      console.error('\n--- Last 200 lines of preview.out ---');
      const raw = fs.readFileSync(previewOut, 'utf8');
      const lines = raw.split(/\r?\n/).slice(-200).join('\n');
      console.error(lines);
    }
  } catch (e) {
    console.error('Failed to read preview.out:', e && e.message);
  }
  process.exit(code);
}

if (!fs.existsSync(file)) {
  fail(`FAILURE: ${file} not found`);
}

let data;
try {
  data = JSON.parse(fs.readFileSync(file, 'utf8'));
} catch (e) {
  fail(`FAILURE: Could not parse ${file}: ${e && e.message}`);
}

const stats = (data && data.stats) || {};
const total = Number(stats.total || 0);
const artifacts = Array.isArray(data.artifacts) ? data.artifacts.length : 0;

if (total > 0 || artifacts > 0) {
  console.log(`E2E artifacts check passed: total=${total} artifacts=${artifacts}`);
  process.exit(0);
}

fail(`FAILURE: e2e-stability.json indicates no tests ran and no artifacts produced (total=${total}, artifacts=${artifacts})`, 3);
