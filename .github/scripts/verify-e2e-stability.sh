#!/usr/bin/env bash
set -euo pipefail

# Verify that e2e-stability.json exists and contains stats.total > 0 OR artifacts array non-empty.
# On failure print a concise failure summary, dump last 200 lines of preview.out (if present), and exit non-zero.

FILE="e2e-stability.json"
PREVIEW_OUT="preview.out"

if [ ! -f "${FILE}" ]; then
  echo "FAILURE: ${FILE} not found"
  if [ -f "${PREVIEW_OUT}" ]; then
    echo "--- Last 200 lines of ${PREVIEW_OUT} ---"
    tail -n 200 "${PREVIEW_OUT}" || true
  fi
  exit 2
fi

# Read values using node for robust JSON parsing
NODE_SCRIPT="
const fs = require('fs');
const p = 'e2e-stability.json';
try {
  const raw = fs.readFileSync(p,'utf8');
  const obj = JSON.parse(raw);
  const total = obj && obj.stats && Number(obj.stats.total) || 0;
  const artifacts = Array.isArray(obj.artifacts) ? obj.artifacts.length : 0;
  console.log(total, artifacts);
} catch (e) {
  console.error('FAILURE: Could not parse e2e-stability.json:', e && e.message);
  process.exit(3);
}
"

read -r TOTAL ARTIFACTS < <(node -e "$NODE_SCRIPT") || true

TOTAL=${TOTAL:-0}
ARTIFACTS=${ARTIFACTS:-0}

if [ "${TOTAL}" -gt 0 ] || [ "${ARTIFACTS}" -gt 0 ]; then
  echo "E2E stability check passed: total=${TOTAL}, artifacts=${ARTIFACTS}"
  exit 0
fi

# Otherwise failure: print concise summary and preview.out tail
echo "FAILURE: e2e-stability.json indicates no tests ran and no artifacts produced (total=${TOTAL}, artifacts=${ARTIFACTS})"
if [ -f "${PREVIEW_OUT}" ]; then
  echo "--- Last 200 lines of ${PREVIEW_OUT} ---"
  tail -n 200 "${PREVIEW_OUT}" || true
fi

exit 4
