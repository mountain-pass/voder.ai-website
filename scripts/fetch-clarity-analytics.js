#!/usr/bin/env node

/**
 * Microsoft Clarity Analytics Data Fetcher
 *
 * This script provides guidance for fetching analytics data from Microsoft Clarity
 * to provide device/viewport breakdown for problem impact assessment.
 */

// Read environment variables from .env file manually
import { readFileSync } from 'fs';

// Dynamic import for fetch (not available in older Node.js)
async function getFetch() {
  if (typeof fetch !== 'undefined') {
    return fetch;
  }
  // For Node.js environments that don't have fetch
  try {
    const { default: fetch } = await import('node-fetch');

    return fetch;
  } catch {
    // If node-fetch is not available, provide a simple error
    throw new Error('fetch is not available. Please use Node.js 18+ or install node-fetch');
  }
}

// Load environment variables from .env file
function loadEnv() {
  try {
    const envContent = readFileSync('.env', 'utf8');

    const envVars = {};

    envContent.split('\n').forEach((line) => {
      const [key, value] = line.split('=');

      if (key && value) {
        envVars[key.trim()] = value.trim();
      }
    });

    return envVars;
  } catch {
    return {};
  }
}

const env = loadEnv();

const CLARITY_PROJECT_ID = env.CLARITY_PROJECT_ID || 't5zu4kays7';

/**
 * Microsoft Clarity API endpoints and authentication
 * Note: MS Clarity doesn't have a public API for fetching analytics data programmatically.
 * The dashboard is web-based only. We'll need to either:
 * 1. Use the dashboard manually to get device breakdown data
 * 2. Implement custom tracking to collect this data ourselves
 * 3. Use approximate industry standard breakdowns
 */

/**
 * Fetch device breakdown data from Clarity Data Export API
 */
async function fetchDeviceBreakdown() {
  console.log('🔍 Fetching device analytics data from MS Clarity API...');
  console.log(`📊 Clarity Project ID: ${CLARITY_PROJECT_ID}`);

  const CLARITY_API_TOKEN = env.CLARITY_API_TOKEN;

  if (!CLARITY_API_TOKEN) {
    console.log('\n❌ Error: CLARITY_API_TOKEN not found in .env file');
    console.log('Please generate an API token from:');
    console.log(`https://clarity.microsoft.com/projects/view/${CLARITY_PROJECT_ID}/settings`);
    console.log('Go to Settings -> Data Export -> Generate new API token');

    return null;
  }

  try {
    console.log('🌐 Calling Clarity Data Export API...');

    // Make API requests to get both device and OS breakdown for better classification
    const fetch = await getFetch();

    console.log('📱 Fetching Device breakdown...');
    const deviceResponse = await fetch(
      'https://www.clarity.ms/export-data/api/v1/project-live-insights?numOfDays=3&dimension1=Device',
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${CLARITY_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      },
    );

    console.log('💻 Fetching OS breakdown...');
    const osResponse = await fetch(
      'https://www.clarity.ms/export-data/api/v1/project-live-insights?numOfDays=3&dimension1=OS',
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${CLARITY_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      },
    );

    if (!deviceResponse.ok) {
      throw new Error(
        `Device API request failed: ${deviceResponse.status} ${deviceResponse.statusText}`,
      );
    }

    if (!osResponse.ok) {
      throw new Error(`OS API request failed: ${osResponse.status} ${osResponse.statusText}`);
    }

    const osData = await osResponse.json();

    console.log('✅ Successfully fetched analytics data');

    // Parse the OS breakdown for better device classification
    const osTrafficData = osData.find((metric) => metric.metricName === 'Traffic');

    if (!osTrafficData || !osTrafficData.information) {
      console.log('⚠️  No OS traffic data found in API response');

      return null;
    }

    // Calculate total sessions from OS data
    const totalSessions = osTrafficData.information.reduce((sum, os) => {
      return sum + parseInt(os.totalSessionCount || 0);
    }, 0);

    console.log(`📊 Total sessions analyzed: ${totalSessions.toLocaleString()}`);

    const deviceBreakdown = { mobile: 0, desktop: 0, tablet: 0, other: 0 };

    // Use OS data to classify devices more accurately
    osTrafficData.information.forEach((osInfo) => {
      const sessions = parseInt(osInfo.totalSessionCount || 0);

      const percentage = totalSessions > 0 ? (sessions / totalSessions) * 100 : 0;

      const osName = (osInfo.OS || '').toLowerCase();

      console.log(`📱 OS: ${osInfo.OS} - Sessions: ${sessions} (${percentage.toFixed(1)}%)`);

      // Classify based on OS patterns
      if (osName.includes('android') || osName.includes('ios') || osName.includes('iphone')) {
        deviceBreakdown.mobile += percentage;
      } else if (osName.includes('ipados') || osName.includes('tablet')) {
        deviceBreakdown.tablet += percentage;
      } else if (
        osName.includes('windows') ||
        osName.includes('macos') ||
        osName.includes('linux') ||
        osName.includes('mac os')
      ) {
        deviceBreakdown.desktop += percentage;
      } else {
        deviceBreakdown.other += percentage;
      }
    });

    // Round percentages
    Object.keys(deviceBreakdown).forEach((key) => {
      deviceBreakdown[key] = Math.round(deviceBreakdown[key] * 10) / 10;
    });

    console.log('\n� Actual Device Breakdown from Clarity API:');
    console.log(`- Mobile: ${deviceBreakdown.mobile}%`);
    console.log(`- Desktop: ${deviceBreakdown.desktop}%`);
    console.log(`- Tablet: ${deviceBreakdown.tablet}%`);
    console.log(`- Other: ${deviceBreakdown.other}%`);
    console.log(`- Total Sessions: ${totalSessions.toLocaleString()}`);

    return {
      mobile: deviceBreakdown.mobile,
      desktop: deviceBreakdown.desktop,
      tablet: deviceBreakdown.tablet,
      other: deviceBreakdown.other,
      totalSessions,
      note: 'Real data from MS Clarity Data Export API (last 3 days)',
    };
  } catch (error) {
    console.log(`\n❌ Error fetching from Clarity API: ${error.message}`);
    console.log('\n🔄 Fallback: Using typical web traffic patterns');
    console.log('- Mobile: ~55% of traffic');
    console.log('- Desktop: ~40% of traffic');
    console.log('- Tablet: ~5% of traffic');

    return {
      mobile: 55,
      desktop: 40,
      tablet: 5,
      note: 'Fallback estimates - API call failed',
    };
  }
}

/**
 * Calculate problem impact based on device breakdown
 */
function calculateProblemImpact(deviceBreakdown, affectedDevices) {
  let totalImpact = 0;

  if (affectedDevices.includes('mobile')) {
    totalImpact += deviceBreakdown.mobile;
  }
  if (affectedDevices.includes('desktop')) {
    totalImpact += deviceBreakdown.desktop;
  }
  if (affectedDevices.includes('tablet')) {
    totalImpact += deviceBreakdown.tablet;
  }

  return Math.min(totalImpact, 100); // Cap at 100%
}

/**
 * Get impact level based on percentage of affected users
 */
function getImpactLevel(impactPercentage) {
  if (impactPercentage > 70) return { level: 'High', score: 3 };
  if (impactPercentage >= 30) return { level: 'Medium', score: 2 };

  return { level: 'Low', score: 1 };
}

/**
 * Main function to fetch and analyze analytics data
 */
async function main() {
  try {
    console.log('🚀 Starting Microsoft Clarity Analytics Fetch...\n');

    const deviceBreakdown = await fetchDeviceBreakdown();

    console.log('\n📊 Example Problem Impact Calculations:');

    // Calculate impact for current problems
    const problems = [
      {
        name: 'Mobile 3D Cube Size Jump',
        affectedDevices: ['mobile'],
        description: 'Mobile-only problem',
      },
      {
        name: 'Text Flash Before 3D Render',
        affectedDevices: ['mobile', 'desktop', 'tablet'],
        description: 'All devices affected',
      },
      {
        name: '3D Cube Responsive Positioning (Closed)',
        affectedDevices: ['mobile', 'tablet'],
        description: 'Mobile + Tablet problem',
      },
    ];

    console.log('\n' + '='.repeat(60));

    problems.forEach((problem) => {
      const impactPercent = calculateProblemImpact(deviceBreakdown, problem.affectedDevices);

      const impactLevel = getImpactLevel(impactPercent);

      console.log(`\n📋 ${problem.name}`);
      console.log(`   Devices: ${problem.affectedDevices.join(', ')}`);
      console.log(`   Impact: ${impactPercent}% of users affected`);
      console.log(`   Level: ${impactLevel.level} (${impactLevel.score})`);

      // Calculate priority (Impact × Likelihood)
      const likelihood = 3; // High likelihood for all these problems

      const priority = impactLevel.score * likelihood;

      const priorityLevel =
        priority === 9 ? 'Critical' : priority >= 6 ? 'High' : priority >= 4 ? 'Medium' : 'Low';

      console.log(
        `   Priority: ${priority} (${impactLevel.level}×High) - ${priorityLevel} priority`,
      );
    });

    console.log('\n' + '='.repeat(60));
    console.log('\n✅ Next Steps:');
    console.log('1. Verify device breakdown percentages in Clarity dashboard');
    console.log('2. Update problem files with accurate impact assessments');
    console.log('3. Recalculate priorities using Impact × Likelihood matrix');
  } catch (error) {
    console.error('❌ Error fetching analytics data:', error.message);
    process.exit(1);
  }
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { calculateProblemImpact, fetchDeviceBreakdown, getImpactLevel };
