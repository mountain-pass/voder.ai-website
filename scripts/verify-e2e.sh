#!/usr/bin/env bash
# Non-interactive verifier to be run after scripts/run-e2e.sh
# Ensures e2e-stability.json exists and contains a non-zero total or has artifacts
set -euo pipefail

FILE=e2e-stability.json
if [ ! -f "$FILE" ]; then
  echo "$FILE not found"
  exit 2
fi

TOTAL=$(node -e "console.log(Math.max(0, (JSON.parse(require('fs').readFileSync('$FILE','utf8')).stats || {}).total || 0))")
ARTIFACTS=$(node -e "const data=JSON.parse(require('fs').readFileSync('$FILE','utf8')); console.log((data.artifacts && data.artifacts.length) || 0)")

if [ "$TOTAL" -gt 0 ] || [ "$ARTIFACTS" -gt 0 ]; then
  echo "E2E stability indicates tests ran: total=$TOTAL artifacts=$ARTIFACTS"
  exit 0
else
  echo "E2E stability indicates no tests ran (total=$TOTAL artifacts=$ARTIFACTS). Dumping preview.out (if present):"
  if [ -f preview.out ]; then
    echo "--- last 200 lines of preview.out ---"
    tail -n 200 preview.out || true
  fi
  exit 3
fi
