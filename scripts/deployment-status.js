#!/usr/bin/env node

/**
 * Deployment Status Monitor
 *
 * This script provides deployment status information and monitoring
 * for the voder.ai website deployment infrastructure.
 */

import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

const __dirname = dirname(__filename);

function getGitInfo() {
  try {
    const branch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();

    const commit = execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();

    const shortCommit = commit.substring(0, 7);

    const message = execSync('git log -1 --pretty=%B', { encoding: 'utf8' }).trim();

    return {
      branch,
      commit,
      shortCommit,
      message,
    };
  } catch {
    return {
      branch: 'unknown',
      commit: 'unknown',
      shortCommit: 'unknown',
      message: 'unknown',
    };
  }
}

function getPackageInfo() {
  try {
    const packagePath = join(__dirname, '..', 'package.json');

    const packageJson = JSON.parse(readFileSync(packagePath, 'utf8'));

    return {
      name: packageJson.name,
      version: packageJson.version,
      description: packageJson.description,
    };
  } catch {
    return {
      name: 'unknown',
      version: 'unknown',
      description: 'unknown',
    };
  }
}

function getBuildInfo() {
  try {
    // Check if dist directory exists
    execSync('ls dist/index.html', { stdio: 'ignore' });
    const buildTime = execSync('stat -f "%m" dist/index.html', { encoding: 'utf8' }).trim();

    const buildDate = new Date(parseInt(buildTime) * 1000);

    return {
      built: true,
      buildDate: buildDate.toISOString(),
    };
  } catch {
    return {
      built: false,
      buildDate: null,
    };
  }
}

function main() {
  const gitInfo = getGitInfo();

  const packageInfo = getPackageInfo();

  const buildInfo = getBuildInfo();

  console.log('🚀 Voder.ai Website Deployment Status');
  console.log('=====================================');
  console.log('');

  console.log('📦 Project Information:');
  console.log(`   Name: ${packageInfo.name}`);
  console.log(`   Version: ${packageInfo.version}`);
  console.log(`   Description: ${packageInfo.description}`);
  console.log('');

  console.log('🔀 Git Information:');
  console.log(`   Branch: ${gitInfo.branch}`);
  console.log(`   Commit: ${gitInfo.shortCommit} (${gitInfo.commit})`);
  console.log(`   Message: ${gitInfo.message}`);
  console.log('');

  console.log('🏗️  Build Information:');
  if (buildInfo.built) {
    console.log(`   Status: ✅ Built`);
    console.log(`   Build Date: ${buildInfo.buildDate}`);
  } else {
    console.log(`   Status: ❌ Not built (run 'npm run build')`);
  }
  console.log('');

  console.log('🌐 Deployment Information:');
  console.log('   Platform: Vercel (automatic deployment)');
  console.log('   Trigger: Push to main branch');
  console.log('   Custom Domain: To be configured');
  console.log('   SSL: Automatic via Vercel');
  console.log('   Monitoring: GitHub Actions + Vercel Dashboard');
  console.log('');

  if (gitInfo.branch === 'main' && buildInfo.built) {
    console.log('✅ Ready for deployment to production');
  } else if (gitInfo.branch !== 'main') {
    console.log('ℹ️  Not on main branch - deployment will not trigger');
  } else {
    console.log('⚠️  Build required before deployment');
  }
}

main();
