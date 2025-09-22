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

// Historical data preservation
function preserveHistoricalData(currentData) {
  const historyFile = 'e2e-stability-history.json';

  let history = [];

  // Load existing history
  try {
    if (fs.existsSync(historyFile)) {
      const historyContent = fs.readFileSync(historyFile, 'utf8');

      const parsed = JSON.parse(historyContent);

      // Handle both old format (array) and new format (object with entries)
      history = Array.isArray(parsed) ? parsed : parsed.entries || [];
    }
  } catch (error) {
    console.warn('Failed to load history file, starting fresh:', error.message);
    history = [];
  }

  // Ensure history is an array
  if (!Array.isArray(history)) {
    history = [];
  }

  // Add current data to history
  history.push({
    timestamp: currentData.generatedAt,
    stats: currentData.stats,
    artifactCount: currentData.artifacts.length,
  });

  // Keep only last 30 days of data (assuming daily runs)
  const maxEntries = 30;

  if (history.length > maxEntries) {
    history = history.slice(-maxEntries);
  }

  // Calculate trends
  const trends = calculateTrends(history);

  // Save updated history
  try {
    const historyData = {
      lastUpdated: currentData.generatedAt,
      entries: history,
      trends: trends,
    };

    fs.writeFileSync(historyFile, JSON.stringify(historyData, null, 2));
    console.log(`Historical data preserved (${history.length} entries)`);

    return trends;
  } catch (error) {
    console.error('Failed to write history file:', error.message);

    return null;
  }
}

function calculateTrends(history) {
  if (history.length < 2) {
    return { message: 'Insufficient data for trend analysis' };
  }

  const recent = history.slice(-7); // Last 7 entries

  const passRates = recent.map((entry) =>
    entry.stats.total > 0 ? (entry.stats.passed / entry.stats.total) * 100 : 0,
  );

  const avgPassRate = passRates.reduce((a, b) => a + b, 0) / passRates.length;

  const trend = passRates.length > 1 ? passRates[passRates.length - 1] - passRates[0] : 0;

  // Early warning thresholds
  const isUnstable = Math.abs(trend) >= 10; // 10% change

  const isLowPerformance = avgPassRate < 80; // Less than 80% pass rate

  const isFailingTrend = trend < -5; // Declining by more than 5%

  const warnings = [];

  if (isUnstable) warnings.push('High variability detected');
  if (isLowPerformance) warnings.push('Low pass rate detected');
  if (isFailingTrend) warnings.push('Declining trend detected');

  return {
    averagePassRate: Math.round(avgPassRate * 100) / 100,
    trend: Math.round(trend * 100) / 100,
    isStable: Math.abs(trend) < 5, // Less than 5% change
    recentRuns: recent.length,
    warnings: warnings,
    alertLevel: warnings.length > 0 ? (warnings.length > 1 ? 'HIGH' : 'MEDIUM') : 'LOW',
  };
}

// Preserve historical data and get trends
const trends = preserveHistoricalData(out);

if (trends) {
  out.trends = trends;
}

try {
  // Ensure the output data is serializable
  const outputData = JSON.parse(JSON.stringify(out));

  fs.writeFileSync('e2e-stability.json', JSON.stringify(outputData, null, 2));
  fs.writeFileSync(
    'e2e-stability.txt',
    `generatedAt: ${out.generatedAt}\ntotal: ${stats.total}\npassed: ${stats.passed}\nfailed: ${stats.failed}\nflaky: ${stats.flaky}\npassRate: ${stats.total > 0 ? Math.round((stats.passed / stats.total) * 100) : 0}%\n${trends ? `avgPassRate: ${trends.averagePassRate}%\ntrend: ${trends.trend}%\nstable: ${trends.isStable}\nalertLevel: ${trends.alertLevel}\nwarnings: ${trends.warnings.join(', ') || 'none'}\n` : ''}`,
  );

  // Output alerts to console for GitHub Actions
  if (trends && trends.warnings.length > 0) {
    console.log('🚨 STABILITY ALERTS DETECTED:');
    trends.warnings.forEach((warning) => console.log(`  - ${warning}`));
    console.log(`Alert Level: ${trends.alertLevel}`);

    // Create GitHub Actions notice
    console.log(
      `::notice title=Stability Alert::${trends.warnings.join(', ')} (Alert Level: ${trends.alertLevel})`,
    );
  } else if (trends) {
    console.log('✅ Stability monitoring: No alerts detected');
  }
} catch (error) {
  console.error('Failed to write stability artifacts:', error.message);
  process.exit(3);
}

console.log('E2E stability summary written to e2e-stability.json and e2e-stability.txt');
console.log(JSON.stringify(out, null, 2));
process.exit(0);
