#!/usr/bin/env bash
# Non-interactive script to run Playwright E2E tests against a background preview server.
# Behavior:
#  - installs playwright browsers
#  - starts `npm run preview` in background (nohup)
#  - writes PID to preview.pid
#  - waits up to 30s for http://127.0.0.1:5173/ to respond 200
#  - runs Playwright tests and preserves test-results/ and playwright-results.json
#  - kills the preview server on exit and exits with Playwright exit code

set -euo pipefail

PREVIEW_HOST=127.0.0.1
PREVIEW_PORT=5173
PREVIEW_URL="http://${PREVIEW_HOST}:${PREVIEW_PORT}/"
PREVIEW_PID_FILE="preview.pid"
PREVIEW_OUT="preview.out"

cleanup() {
  echo "Cleaning up..."
  if [ -f "${PREVIEW_PID_FILE}" ]; then
    PID=$(cat "${PREVIEW_PID_FILE}")
    echo "Killing preview PID: ${PID}"
    if kill -0 "${PID}" 2>/dev/null; then
      kill "${PID}" || true
      # Wait a moment for process to exit
      sleep 1
    fi
    rm -f "${PREVIEW_PID_FILE}"
  fi
}

trap cleanup EXIT

echo "Installing Playwright browsers (non-interactive)..."
# install browsers non-interactively; fail loudly if install fails
npx playwright install --with-deps

echo "Starting preview server (nohup)..."
# Start preview in background, capture output and PID
nohup npm run preview --silent >"${PREVIEW_OUT}" 2>&1 &
PREVIEW_PID=$!
echo "${PREVIEW_PID}" >"${PREVIEW_PID_FILE}"
echo "Preview PID: ${PREVIEW_PID} (logs -> ${PREVIEW_OUT})"

# Wait for server to become available (up to 30s)
MAX_WAIT=30
COUNT=0
until curl -fsS "${PREVIEW_URL}" > /dev/null 2>&1; do
  COUNT=$((COUNT + 1))
  if [ ${COUNT} -ge ${MAX_WAIT} ]; then
    echo "Preview server did not start within ${MAX_WAIT} seconds. Dumping last ${PREVIEW_OUT} lines:" 
    tail -n 200 "${PREVIEW_OUT}" || true
    exit 2
  fi
  sleep 1
done

echo "Preview server is responding at ${PREVIEW_URL}"

# Run Playwright tests. Allow the test process to fail without exiting the script
set +e
# Use Playwright config for reporters/outputDir so artifacts are created as configured
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
[ -f playwright-results.json ] && echo "Found playwright-results.json (size: $(stat -c%s playwright-results.json) bytes)" || echo "playwright-results.json not present"

# Exit with the Playwright test exit code so CI can fail appropriately
exit ${TEST_EXIT_CODE}
