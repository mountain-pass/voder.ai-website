#!/usr/bin/env bash
# Non-interactive script to run Playwright E2E tests against a background preview server.
# This variant avoids using 'nohup' to remain portable across environments.
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
          sleep 1
        fi
      fi
      rm -f "${PREVIEW_PID_FILE}" || true
    fi
  else
    echo "Preview was not started by this script. Leaving external preview running (if present)."
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

# Reuse an existing preview if present and responsive
if [ -f "${PREVIEW_PID_FILE}" ]; then
  EXISTING_PID=$(cat "${PREVIEW_PID_FILE}" 2>/dev/null || true)
  if [ -n "${EXISTING_PID}" ] && kill -0 "${EXISTING_PID}" 2>/dev/null; then
    echo "Found existing preview PID: ${EXISTING_PID}. Checking HTTP responsiveness at ${PREVIEW_URL}..."
    if curl -fsS --max-time 5 "${PREVIEW_URL}" >/dev/null 2>&1; then
      echo "Existing preview is responding at ${PREVIEW_URL}. Will reuse it and will not stop it on exit."
      PREVIEW_STARTED=false
      if [ ! -f "${PREVIEW_OUT}" ]; then
        echo "Existing preview PID: ${EXISTING_PID} (reused)" >"${PREVIEW_OUT}" || true
      fi
    else
      echo "Existing preview PID ${EXISTING_PID} did not respond at ${PREVIEW_URL}. Starting a new one."
      rm -f "${PREVIEW_PID_FILE}" || true
    fi
  else
    echo "No valid running preview found in ${PREVIEW_PID_FILE}. Will start a new preview."
    rm -f "${PREVIEW_PID_FILE}" || true
  fi
fi

# Start preview if no valid existing preview
if [ ! -f "${PREVIEW_PID_FILE}" ]; then
  echo "Installing Playwright browsers (non-interactive)..."
  npx playwright install --with-deps || true

  echo "Starting preview server in background (output -> ${PREVIEW_OUT})..."
  # Start preview in background and redirect output
  npm run preview >"${PREVIEW_OUT}" 2>&1 &
  PREVIEW_PID=$!
  echo "${PREVIEW_PID}" >"${PREVIEW_PID_FILE}"
  PREVIEW_STARTED=true
  echo "Preview PID: ${PREVIEW_PID} (logs -> ${PREVIEW_OUT})"

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

# Health-check
if ! curl -fsS --max-time 5 "${PREVIEW_URL}" > /dev/null 2>&1; then
  echo "Quick health-check failed (${PREVIEW_URL} not reachable within 5s). Dumping last ${PREVIEW_OUT} lines:"
  tail -n 200 "${PREVIEW_OUT}" || true
  write_empty_stability
  exit 3
fi

# Run Playwright tests and gather artifacts
set +e
npx playwright test --output=test-results/
TEST_EXIT_CODE=$?
set -e

echo "Playwright tests completed with exit code: ${TEST_EXIT_CODE}"

# Ensure playwright-results.json exists
if [ ! -f playwright-results.json ]; then
  FOUND_JSON=$(find test-results -maxdepth 2 -type f -name "*.json" | head -n 1 || true)
  if [ -n "${FOUND_JSON}" ]; then
    cp "${FOUND_JSON}" playwright-results.json || true
  fi
fi

# Artifacts summary
ls -la test-results || true
if [ -f playwright-results.json ]; then
  echo "Found playwright-results.json (size: $(stat -c%s playwright-results.json 2>/dev/null || echo '?'))"
fi

# Generate e2e stability summary
if command -v node >/dev/null 2>&1 && [ -f .github/scripts/generate-e2e-stability-summary.js ]; then
  node .github/scripts/generate-e2e-stability-summary.js || true
else
  write_empty_stability
fi

# Run verifier
VERIFIER_EXIT=0
if [ -f "scripts/verify-e2e.sh" ]; then
  echo "Running e2e verifier..."
  bash scripts/verify-e2e.sh || VERIFIER_EXIT=$?
else
  echo "Verifier not found; skipping"
fi

# Decide exit code
if [ "${TEST_EXIT_CODE}" -ne 0 ]; then
  echo "Playwright reported failures (exit ${TEST_EXIT_CODE}), exiting with that code."
  exit ${TEST_EXIT_CODE}
fi

if [ "${VERIFIER_EXIT}" -ne 0 ]; then
  echo "Verifier reported failure (exit ${VERIFIER_EXIT}), exiting with that code."
  if [ -f "${PREVIEW_OUT}" ]; then
    echo "--- last 200 lines of ${PREVIEW_OUT} ---"
    tail -n 200 "${PREVIEW_OUT}" || true
  fi
  exit ${VERIFIER_EXIT}
fi

exit 0
