import { getConfig } from '@voder/dev-config/linters/markdown';
import { readFileSync } from 'fs';
import { describe, expect, it } from 'vitest';
describe('Markdownlint config generator', () => {
    it('getConfig() matches .markdownlint.json', () => {
        // Generate the shared config programmatically
        const programmatic = getConfig();

        // Read the JSON file produced by `npm run prepare`
        const fileRaw = readFileSync('.markdownlint.json', 'utf8');

        const fileConfig = JSON.parse(fileRaw);

        // Deep-equal comparison
        expect(programmatic).toEqual(fileConfig);
    });
});
