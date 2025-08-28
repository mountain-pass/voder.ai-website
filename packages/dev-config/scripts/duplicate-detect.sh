#!/usr/bin/env sh
# report-only duplicate detection (POSIX)
set -eu
mkdir -p ./tmp
# Compute checksums for tracked files only (ignore .git directory)
git ls-files -z | xargs -0 sha1sum | sort > ./tmp/all-shas.txt
# Find duplicate hashes (show file list per hash)
awk '{print $1}' ./tmp/all-shas.txt | uniq -d > ./tmp/duplicate-hashes.txt || true
if [ -s ./tmp/duplicate-hashes.txt ]; then
  echo "Duplicates found (tracked files):" >&2
  while read -r hash; do
    echo "HASH: $hash" >&2
    grep -F "$hash" ./tmp/all-shas.txt | awk '{ $1=""; print substr($0,2) }' >&2
  done < ./tmp/duplicate-hashes.txt
else
  echo "No tracked duplicate hashes detected" >&2
fi
# Exit non-zero only if FAIL_ON_TRACKED=1 and duplicates exist
if [ -s ./tmp/duplicate-hashes.txt ] && [ "${FAIL_ON_TRACKED:-0}" != "0" ]; then
  echo "Tracked duplicates detected and FAIL_ON_TRACKED=1 -> failing" >&2
  exit 2
fi
exit 0
