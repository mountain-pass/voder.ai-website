import { getConfig } from '@voder/dev-config/linters/markdown';
import { writeFileSync } from 'fs';

// Generate the shared markdownlint config
const config = getConfig();

// Write it to .markdownlint.json in repo root
writeFileSync('.markdownlint.json', JSON.stringify(config, null, 2));

console.log('✅ .markdownlint.json generated');
