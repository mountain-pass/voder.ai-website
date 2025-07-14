#!/bin/bash

# Performance Testing Script for Voder.ai Website
# This script runs comprehensive performance tests and provides detailed output

set -e

echo "🔍 Voder.ai Performance Testing Suite"
echo "======================================"

# Clean up any existing servers
echo "🧹 Cleaning up existing servers..."
lsof -ti:4173 | xargs kill -9 2>/dev/null || true
lsof -ti:5173 | xargs kill -9 2>/dev/null || true

# Run Lighthouse CI with detailed output (includes build via npm run preview)
echo "🚀 Running Lighthouse CI (3 runs for reliability)..."
npm run assert:lhci

echo "✅ Performance testing complete!"
echo "� View detailed reports at the URLs provided above."
