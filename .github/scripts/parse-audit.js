#!/usr/bin/env node
import fs from 'fs';

function exitWithError(msg, code = 2) {
  console.error(msg);
  process.exit(code);
}

const filePath = process.argv[2] || './audit.json';

let raw;

try {
  raw = fs.readFileSync(filePath, 'utf8');
} catch (err) {
  exitWithError(`Failed to read audit file at ${filePath}: ${err.message}`);
}

let audit;

try {
  audit = JSON.parse(raw);
} catch (err) {
  exitWithError(`Failed to parse JSON from ${filePath}: ${err.message}`);
}

// Initialize counts
const severities = ['critical', 'high', 'moderate', 'low', 'info'];

const counts = { critical: 0, high: 0, moderate: 0, low: 0, info: 0 };

const highItems = [];

// Helper to normalize severity string
function normSeverity(s) {
  if (!s) return 'info';
  const sLower = String(s).toLowerCase();

  if (
    sLower === 'high' ||
    sLower === 'critical' ||
    sLower === 'moderate' ||
    sLower === 'low' ||
    sLower === 'info'
  )
    return sLower;

  return 'info';
}

// 1) New npm format: audit.vulnerabilities (object keyed by package)
if (
  audit.vulnerabilities &&
  typeof audit.vulnerabilities === 'object' &&
  Object.keys(audit.vulnerabilities).length
) {
  for (const [pkg, info] of Object.entries(audit.vulnerabilities)) {
    let severity = info.severity || null;

    if (!severity && info.via && Array.isArray(info.via) && info.via.length) {
      // via can be array of objects or strings
      const first = info.via[0];

      if (typeof first === 'string') {
        severity = 'unknown';
      } else if (first && first.severity) {
        severity = first.severity;
      }
    }
    severity = normSeverity(severity);
    counts[severity] = (counts[severity] || 0) + 1;
    if (severity === 'high' || severity === 'critical') {
      highItems.push({
        package: pkg,
        severity,
        title: info.title || null,
        range: info.range || null,
        via: info.via || null,
      });
    }
  }
}

// 2) Older format: audit.advisories
if (
  audit.advisories &&
  typeof audit.advisories === 'object' &&
  Object.keys(audit.advisories).length
) {
  for (const adv of Object.values(audit.advisories)) {
    const sev = normSeverity(adv.severity || adv.effect || adv.title);

    counts[sev] = (counts[sev] || 0) + 1;
    if (sev === 'high' || sev === 'critical') {
      highItems.push({
        module: adv.module_name || adv.module || adv.name,
        severity: sev,
        id: adv.id,
        title: adv.title || null,
        vulnerable_versions: adv.vulnerable_versions || null,
        url: adv.url || null,
      });
    }
  }
}

// 3) Metadata summary if present (useful for audit output shape differences)
if (
  audit.metadata &&
  audit.metadata.vulnerabilities &&
  typeof audit.metadata.vulnerabilities === 'object'
) {
  // merge counts without overwriting detected counts
  for (const [k, v] of Object.entries(audit.metadata.vulnerabilities)) {
    const key = normSeverity(k);

    // prefer counts computed above; only set if we don't have data
    if (!counts[key]) counts[key] = Number(v) || 0;
  }
}

// Print concise summary
console.log('npm audit summary:');
for (const s of severities) {
  console.log(`  ${s}: ${counts[s] || 0}`);
}

if (highItems.length) {
  console.log('\nHigh/Critical advisories:');
  for (const it of highItems) {
    if (it.package) {
      console.log(`- package: ${it.package}`);
      if (it.title) console.log(`  title: ${it.title}`);
      if (it.range) console.log(`  range: ${it.range}`);
      if (it.via) console.log(`  via: ${JSON.stringify(it.via)}`);
    } else {
      console.log(`- module: ${it.module || 'unknown'}`);
      if (it.id) console.log(`  id: ${it.id}`);
      if (it.vulnerable_versions) console.log(`  vulnerable_versions: ${it.vulnerable_versions}`);
      if (it.url) console.log(`  url: ${it.url}`);
    }
  }
}

if ((counts.high || 0) > 0 || (counts.critical || 0) > 0) {
  console.error('\nSecurity policy: high or critical vulnerabilities detected. Failing.');
  process.exit(1);
}

console.log('\nNo high or critical vulnerabilities detected.');
process.exit(0);
