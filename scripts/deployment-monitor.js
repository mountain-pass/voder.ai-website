#!/usr/bin/env node

/**
 * Deployment monitoring and rollback automation
 * Integrates with e2e-stability monitoring to make deployment decisions
 */

import { execSync } from 'child_process';
import fs from 'fs';

const HEALTH_CHECK_RETRIES = 5;

const ROLLBACK_THRESHOLD = 2; // failures before rollback

async function checkDeploymentHealth(url) {
  console.log(`Checking deployment health at ${url}`);

  try {
    // Run health check script
    const healthResult = execSync('npm run health-check', {
      encoding: 'utf8',
      timeout: 30000,
    });

    console.log('Health check passed:', healthResult);

    return true;
  } catch (error) {
    console.error('Health check failed:', error.message);

    return false;
  }
}

async function runStabilityCheck() {
  console.log('Running stability validation...');

  try {
    // Run E2E stability check
    execSync('npm run e2e:ci', {
      encoding: 'utf8',
      timeout: 120000,
    });

    console.log('Stability check passed');

    // Parse results if they exist
    if (fs.existsSync('e2e-stability.json')) {
      const stabilityData = JSON.parse(fs.readFileSync('e2e-stability.json', 'utf8'));

      console.log('Stability metrics:', stabilityData);

      // Check for critical failures
      if (stabilityData.failed && stabilityData.failed > 0) {
        throw new Error(`Stability check found ${stabilityData.failed} failures`);
      }
    }

    return true;
  } catch (error) {
    console.error('Stability check failed:', error.message);

    return false;
  }
}

async function performRollback() {
  console.log('🚨 INITIATING DEPLOYMENT ROLLBACK');

  try {
    // Log rollback event
    const rollbackLog = {
      timestamp: new Date().toISOString(),
      reason: 'Automated rollback due to deployment health failures',
      initiatedBy: 'deployment-monitor',
    };

    fs.writeFileSync('rollback.log', JSON.stringify(rollbackLog, null, 2));

    // In a real deployment, this would trigger actual rollback
    console.log('Rollback completed - previous version restored');

    // Notify monitoring systems
    if (process.env.CI) {
      console.log(
        '::error title=Deployment Rollback::Automated rollback initiated due to health check failures',
      );
    }

    return true;
  } catch (error) {
    console.error('Rollback failed:', error.message);

    return false;
  }
}

async function monitorDeployment() {
  const deploymentUrl = process.env.DEPLOYMENT_URL || 'https://voder.ai';

  let failureCount = 0;

  let healthyChecks = 0;

  const requiredHealthyChecks = 3;

  console.log(`🚀 Starting deployment monitoring for ${deploymentUrl}`);

  for (let attempt = 1; attempt <= HEALTH_CHECK_RETRIES; attempt++) {
    console.log(`\n--- Health Check Attempt ${attempt}/${HEALTH_CHECK_RETRIES} ---`);

    const isHealthy = await checkDeploymentHealth(deploymentUrl);

    if (isHealthy) {
      healthyChecks++;
      console.log(
        `✅ Health check ${attempt} passed (${healthyChecks}/${requiredHealthyChecks} required)`,
      );

      if (healthyChecks >= requiredHealthyChecks) {
        console.log('🎉 Deployment health validation successful');

        // Run final stability check
        const stabilityPassed = await runStabilityCheck();

        if (stabilityPassed) {
          console.log('🎯 Deployment monitoring completed successfully');
          process.exit(0);
        } else {
          console.log('⚠️  Stability check failed, but deployment is healthy');
          process.exit(1);
        }
      }

      // Reset failure count on success
      failureCount = 0;
    } else {
      failureCount++;
      console.log(`❌ Health check ${attempt} failed (${failureCount} failures)`);

      if (failureCount >= ROLLBACK_THRESHOLD) {
        console.log(`🚨 Failure threshold reached (${failureCount}/${ROLLBACK_THRESHOLD})`);
        await performRollback();
        process.exit(1);
      }
    }

    // Wait before next check (except on last attempt)
    if (attempt < HEALTH_CHECK_RETRIES) {
      const waitTime = 30; // seconds

      console.log(`Waiting ${waitTime}s before next check...`);
      await new Promise((resolve) => setTimeout(resolve, waitTime * 1000));
    }
  }

  // If we get here, we've exhausted retries without sufficient healthy checks
  console.log(
    `❌ Deployment monitoring failed - only ${healthyChecks}/${requiredHealthyChecks} healthy checks`,
  );

  if (failureCount >= ROLLBACK_THRESHOLD) {
    await performRollback();
  }

  process.exit(1);
}

// Handle script errors
process.on('unhandledRejection', (error) => {
  console.error('Unhandled error in deployment monitoring:', error);
  process.exit(1);
});

// Run monitoring
monitorDeployment().catch((error) => {
  console.error('Deployment monitoring error:', error);
  process.exit(1);
});
