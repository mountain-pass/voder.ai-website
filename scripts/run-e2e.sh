#!/usr/bin/env bash
# Non-interactive script to run Playwright E2E tests against a background preview server.
# Enhanced behavior:
#  - If preview.pid exists and the PID is alive and ${PREVIEW_HOST}:${PREVIEW_PORT} responds, reuse it and do not kill it on exit.
#  - Otherwise start `npm run preview` in background (nohup), write PID to preview.pid and kill it on cleanup.
#  - Perform a quick health-check with curl --max-time 5; on failure dump last 200 lines of preview.out and write empty e2e-stability artifacts.
#  - Run Playwright tests and generate e2e-stability.json/txt via the provided generator script.

set -euo pipefail

PREVIEW_HOST=127.0.0.1
PREVIEW_PORT=5173
PREVIEW_URL="http://${PREVIEW_HOST}:${PREVIEW_PORT}/"
PREVIEW_PID_FILE="preview.pid"
PREVIEW_OUT="preview.out"
PREVIEW_STARTED=false

cleanup() {
  echo "Cleaning up..."
  if [ "${PREVIEW_STARTED}" = "true" ]; then
    if [ -f "${PREVIEW_PID_FILE}" ]; then
      PID=$(cat "${PREVIEW_PID_FILE}" 2>/dev/null || true)
      if [ -n "${PID}" ]; then
        echo "Killing preview PID: ${PID}"
        if kill -0 "${PID}" 2>/dev/null; then
          kill "${PID}" || true
          # Allow process to exit
          sleep 1
        fi
      fi
      rm -f "${PREVIEW_PID_FILE}" || true
    fi
  else
    echo "Preview was not started by this script. Leaving any external preview running (if present)."
  fi
}

trap cleanup EXIT

write_empty_stability() {
  cat > e2e-stability.json <<JSON
{
  "generatedAt": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "stats": { "total": 0, "passed": 0, "failed": 0, "flaky": 0 }
}
JSON

  cat > e2e-stability.txt <<TXT
generatedAt: $(date -u +"%Y-%m-%dT%H:%M:%SZ")
total: 0
passed: 0
failed: 0
flaky: 0
TXT

  echo "Wrote empty e2e-stability.json and e2e-stability.txt"
}

# Check for an existing preview PID we can reuse
if [ -f "${PREVIEW_PID_FILE}" ]; then
  EXISTING_PID=$(cat "${PREVIEW_PID_FILE}" 2>/dev/null || true)
  if [ -n "${EXISTING_PID}" ] && kill -0 "${EXISTING_PID}" 2>/dev/null; then
    echo "Found existing preview PID: ${EXISTING_PID}. Checking HTTP responsiveness at ${PREVIEW_URL}..."
    if curl -fsS --max-time 5 "${PREVIEW_URL}" >/dev/null 2>&1; then
      echo "Existing preview is responding at ${PREVIEW_URL}. Will reuse it and will not stop it on exit."
      PREVIEW_STARTED=false
      # Ensure preview.out exists for diagnostics even when reusing external preview
      if [ ! -f "${PREVIEW_OUT}" ]; then
        echo "No ${PREVIEW_OUT} found for existing preview PID ${EXISTING_PID}. Creating a placeholder." >"${PREVIEW_OUT}" || true
        echo "Existing preview PID: ${EXISTING_PID} (reused)" >>"${PREVIEW_OUT}" || true
      fi
    else
      echo "Existing preview PID ${EXISTING_PID} is alive but server did not respond at ${PREVIEW_URL}. Will start a new preview."
      rm -f "${PREVIEW_PID_FILE}" || true
      EXISTING_PID=""
    fi
  else
    echo "No valid running preview found in ${PREVIEW_PID_FILE}. Will start a new preview."
    rm -f "${PREVIEW_PID_FILE}" || true
  fi
fi

# If no valid preview PID file present, start preview
if [ ! -f "${PREVIEW_PID_FILE}" ]; then
  echo "Installing Playwright browsers (non-interactive)..."
  # install browsers non-interactively; fail loudly if install fails
  npx playwright install --with-deps

  echo "Starting preview server (nohup)..."
  # Start preview in background, capture output and PID
  nohup npm run preview --silent >"${PREVIEW_OUT}" 2>&1 &
  PREVIEW_PID=$!
  echo "${PREVIEW_PID}" >"${PREVIEW_PID_FILE}"
  echo "Preview PID: ${PREVIEW_PID} (logs -> ${PREVIEW_OUT})"
  PREVIEW_STARTED=true

  # Wait for server to become available (up to MAX_WAIT seconds)
  MAX_WAIT=30
  COUNT=0
  until curl -fsS "${PREVIEW_URL}" > /dev/null 2>&1; do
    COUNT=$((COUNT + 1))
    if [ ${COUNT} -ge ${MAX_WAIT} ]; then
      echo "Preview server did not start within ${MAX_WAIT} seconds. Dumping last ${PREVIEW_OUT} lines:" 
      tail -n 200 "${PREVIEW_OUT}" || true
      write_empty_stability
      exit 2
    fi
    sleep 1
  done
fi

# Final quick health-check
echo "Preview server is responding at ${PREVIEW_URL}. Performing quick health-check..."
if ! curl -fsS --max-time 5 "${PREVIEW_URL}" > /dev/null 2>&1; then
  echo "Quick health-check failed (${PREVIEW_URL} not reachable within 5s). Dumping last ${PREVIEW_OUT} lines:"
  tail -n 200 "${PREVIEW_OUT}" || true
  write_empty_stability
  exit 3
fi

# Run Playwright tests (allow failures so we can gather artifacts)
set +e
npx playwright test --output=test-results/
TEST_EXIT_CODE=$?
set -e

echo "Playwright tests completed with exit code: ${TEST_EXIT_CODE}"

# Ensure playwright-results.json is present (Playwright config writes it by default)
if [ ! -f playwright-results.json ]; then
  echo "playwright-results.json not found in repo root. Attempting to locate JSON result inside test-results/..."
  FOUND_JSON=$(find test-results -maxdepth 2 -type f -name "*.json" | head -n 1 || true)
  if [ -n "${FOUND_JSON}" ]; then
    echo "Found JSON at ${FOUND_JSON}, copying to playwright-results.json"
    cp "${FOUND_JSON}" playwright-results.json || true
  else
    echo "No JSON results found. Playwright reporter may not have produced JSON output."
  fi
fi

# Print a short artifacts summary
echo "Artifacts summary:"
ls -la test-results || true
if [ -f playwright-results.json ]; then
  if stat --version >/dev/null 2>&1; then
    SIZE=$(stat -c%s playwright-results.json 2>/dev/null || echo "?")
  else
    SIZE=$(stat -f%z playwright-results.json 2>/dev/null || echo "?")
  fi
  echo "Found playwright-results.json (size: ${SIZE} bytes)"
else
  echo "playwright-results.json not present"
fi

# Generate e2e stability summary using provided script (graceful fallback to default empty artifacts)
echo "Generating E2E stability summary..."
if command -v node >/dev/null 2>&1 && [ -f .github/scripts/generate-e2e-stability-summary.js ]; then
  node .github/scripts/generate-e2e-stability-summary.js || true
else
  echo "Node or generator script not available; writing default e2e-stability artifacts."
  write_empty_stability
fi

# Exit with the Playwright test exit code so CI can fail appropriately
exit ${TEST_EXIT_CODE}
