#!/usr/bin/env node

/**
 * VODER HIERARCHICAL DOCUMENTATION SYSTEM
 * =======================================
 *
 * This script implements a hierarchical documentation linking system that eliminates
 * redundancy while ensuring each package gets exactly the documentation it needs for
 * AI-assisted development.
 *
 * HIERARCHY PRINCIPLE: PACKAGES FIND SPECS, THEN INHERIT UPWARD
 * -------------------------------------------------------------
 *
 * The system works by:
 * 1. Finding a package's specification file (e.g., tools-file.md in prompts/runtime/tools/file/)
 * 2. Including ALL .md files from that directory AND all parent directories up to prompts/
 * 3. This creates automatic inheritance: runtime packages get runtime-level docs,
 *    development packages get development-level docs
 *
 * PATH-BASED NAMING SYSTEM
 * ------------------------
 *
 * Files are linked with path-based names to eliminate conflicts and provide clear context:
 * - Universal files (prompts/ root): architecture.md → architecture.md (no prefix)
 * - Layer files: prompts/runtime/runtime.md → runtime.md
 * - Sublayer files: prompts/runtime/sections/sections.md → runtime-sections.md  
 * - Package files: prompts/runtime/sections/brand-entry-section/brand-entry-section.md → runtime-sections-brand-entry-section.md
 * - Deep paths: prompts/runtime/applications/voder-website/voder-website.md → runtime-applications-voder-website.md
 * - Redundancy removal: prompts/runtime/runtime.md → runtime.md (not runtime-runtime.md)
 *
 * WHEN DOCUMENTATION ISN'T INHERITED CORRECTLY:
 * The solution is usually to IMPROVE THE HIERARCHY, not change the script.
 * - If a file should be inherited by more packages: move it UP the hierarchy
 * - If a file should be inherited by fewer packages: move it DOWN or create a new layer
 * - If some packages need it but others don't: create separate hierarchy branches
 *
 * CURRENT HIERARCHY STRUCTURE
 * ---------------------------
 *
 * prompts/
 * ├── universal-guide.md          # UNIVERSAL: All packages inherit this
 * │
 * ├── runtime/                    # RUNTIME LAYER: Website packages inherit
 * │   ├── accessibility-requirements.md
 * │   ├── brand-guide.md
 * │   ├── glossary.md
 * │   ├── runtime.md
 * │   ├── sections/               # Section layer for website components
 * │   │   ├── sections.md
 * │   │   ├── brand-entry-section/
 * │   │   │   └── brand-entry-section.md
 * │   │   ├── closing-moment-section/
 * │   │   │   └── closing-moment-section.md
 * │   │   ├── metaphor-section/
 * │   │   │   └── metaphor-section.md
 * │   │   ├── outcome-focus-section/
 * │   │   │   └── outcome-focus-section.md
 * │   │   ├── problem-space-section/
 * │   │   │   └── problem-space-section.md
 * │   │   ├── prompt-iteration-section/
 * │   │   │   └── prompt-iteration-section.md
 * │   │   ├── the-why-section/
 * │   │   │   └── the-why-section.md
 * │   │   └── vision-flow-section/
 * │   │       └── vision-flow-section.md
 * │   ├── effects/                # Effect layer for interactive components
 * │   │   ├── effects.md
 * │   │   ├── canvas-3d-effect/
 * │   │   │   └── canvas-3d-effect.md
 * │   │   ├── code-display-effect/
 * │   │   │   └── code-display-effect.md
 * │   │   ├── interactive-button-effect/
 * │   │   │   └── interactive-button-effect.md
 * │   │   ├── particle-system-effect/
 * │   │   │   └── particle-system-effect.md
 * │   │   └── typing-animation-effect/
 * │   │       └── typing-animation-effect.md
 * │   ├── core/
 * │   │   └── core.md             # Core package for shared functionality
 * │   ├── shared/
 * │   │   └── shared.md           # Shared utilities across components
 * │   ├── navigation/
 * │   │   └── navigation.md       # Navigation component
 * │   └── services/
 * │       └── services.md         # Service layer for data access
 * │
 * └── development/                # DEVELOPMENT LAYER: Development tooling
 *     └── dev-config/
 *         └── dev-config.md       # Development configuration package (consolidated tooling)
 *
 * CONSOLIDATED DEVELOPMENT TOOLING:
 * ---------------------------------
 * The dev-config package consolidates all development tooling configuration that was previously
 * split across multiple packages:
 * - TypeScript configuration
 * - ESLint configuration
 * - Prettier configuration
 * - Vitest testing configuration (Node.js testing environments)
 * - Markdown linting configuration
 * - Development configuration utilities
 *
 * ARCHITECTURE OVERVIEW
 * --------------------
 *
 * The system uses a hierarchical inheritance model:
 * 1. UNIVERSAL TIER: Core guidelines every package needs (prompts/ root)
 * 2. LAYER TIER: Runtime vs Development separation (prompts/runtime/ vs prompts/development/)
 * 3. SUBLAYER TIER: Specialized guidance (sections/, effects/ under runtime/)
 * 4. PACKAGE TIER: Specific implementation details (individual package directories)
 *
 * DEV-CONFIG CONSOLIDATION:
 * The dev-config package provides all development tooling configuration in one place,
 * eliminating the need for separate build-tools, eslint-config, and tsconfig packages.
 * This includes TypeScript configs, ESLint layers, Prettier settings, Vitest configurations
 * for both Node.js and UI testing (jsdom), and markdown linting.
 *
 * LINKING STRATEGY
 * ----------------
 *
 * Each package's prompts/ directory receives symlinks based on hierarchical inheritance:
 *
 * 1. FIND PACKAGE SPEC: Script locates the package's specification file
 *    (e.g., tools-file.md for voder-tools-file package)
 *
 * 2. INHERIT UPWARD: Include ALL .md files from:
 *    - The spec directory (prompts/runtime/tools/file/)
 *    - Parent directory (prompts/runtime/tools/)
 *    - Grandparent directory (prompts/runtime/)
 *    - Root directory (prompts/)
 *
 * 3. RESULT: Each package gets exactly what it needs through inheritance:
 *    - brand-entry-section: universal + runtime + sections + brand-entry-specific
 *    - canvas-3d-effect: universal + runtime + effects + canvas-3d-specific
 *    - dev-config: universal + development + dev-config-specific (consolidated tooling)
 *
 * TROUBLESHOOTING INHERITANCE ISSUES
 * ----------------------------------
 *
 * If a package isn't getting documentation it should:
 * 1. Check if the package spec file exists in the expected location
 * 2. Verify the hierarchy structure matches the inheritance needs
 * 3. Move files UP the hierarchy if more packages need them
 * 4. Create new hierarchy layers if some packages need it but others don't
 *
 * Common fixes:
 * - "All runtime packages need observability" → Move to prompts/runtime/
 * - "Only tools need error-handling" → Move to prompts/runtime/tools/
 * - "Build tools shouldn't get observability" → Keep it in runtime/, not universal
 *
 * PACKAGE CLASSIFICATION
 * ----------------------
 *
 * Packages are classified by their purpose and inherit from appropriate layers:
 *
 * - RUNTIME packages (inherit from prompts/runtime/):
 *   - WEBSITE SECTIONS: brand-entry-section, closing-moment-section, metaphor-section,
 *     outcome-focus-section, problem-space-section, prompt-iteration-section, 
 *     the-why-section, vision-flow-section
 *   - INTERACTIVE EFFECTS: canvas-3d-effect, code-display-effect, interactive-button-effect,
 *     particle-system-effect, typing-animation-effect  
 *   - CORE INFRASTRUCTURE: core, shared, navigation, services
 *
 * - DEVELOPMENT packages (inherit from prompts/development/):
 *   - DEVELOPMENT TOOLING: dev-config (consolidated configuration package)
 *
 * CONSOLIDATED vs ELIMINATED PACKAGES:
 * - dev-config: NEW - consolidates TypeScript, ESLint, Prettier, Vitest, Markdown configs
 * - build-tools: ELIMINATED - empty package, functionality moved to dev-config
 * - eslint-config: ELIMINATED - missing package, functionality moved to dev-config
 * - tsconfig: ELIMINATED - missing package, functionality moved to dev-config
 *
 *
 * DYNAMIC DIRECTORY DISCOVERY
 * ----------------------------
 *
 * The system uses dynamic directory scanning instead of hardcoded file lists:
 *
 * 1. UNIVERSAL FILES:
 *    - All packages: All .md files from prompts/ root (dynamically discovered)
 *    - New universal files automatically included without code changes
 *
 * 2. HIERARCHICAL INHERITANCE:
 *    - Each package spec directory and all parent directories scanned for .md files
 *    - New files added anywhere in the hierarchy are automatically inherited
 *    - No code changes needed when adding documentation
 *
 * 3. PACKAGE-SPECIFIC FILES:
 *    - Package spec directories scanned for implementation details (dynamically discovered)
 *    - File existence checked before creating symlinks
 *    - Graceful handling of missing files
 *
 * 4. BENEFITS OF DIRECTORY-BASED APPROACH:
 *    - ZERO HARDCODED FILES: All discovery through directory traversal
 *    - SELF-MAINTAINING: New documentation automatically discovered
 *    - ROBUST: Missing directories/files handled gracefully
 *    - TRANSPARENT: Clear logging shows exactly what files are found and linked
 *    - FUTURE-PROOF: Add any .md file and it's automatically included where appropriate
 * - RUNTIME: Website packages (sections, effects, core, shared, navigation, services)
 * - DEVELOPMENT: Development tooling (dev-config)
 *
 * BENEFITS
 * --------
 *
 * 1. ZERO REDUNDANCY: Each piece of documentation exists in exactly one place
 * 2. AUTOMATIC CONSISTENCY: Updates propagate to all relevant packages instantly
 * 3. CONTEXTUAL COMPLETENESS: Each package gets exactly what it needs, nothing more
 * 4. MAINTAINABLE: Single source of truth for each concept
 * 5. AI-OPTIMIZED: Clear context boundaries for LLM-assisted development
 * 6. SELF-MAINTAINING: New files automatically discovered without code changes
 * 7. ROBUST: Graceful handling of missing files and directories
 * 8. TRANSPARENT: Clear logging shows exactly what gets linked
 *
 * USAGE: HOW TO RUN THE DOCUMENTATION LINKING
 * ===========================================
 *
 * LINK ALL PACKAGES (RECOMMENDED):
 * --------------------------------
 * From the workspace root directory:
 *   npm run prepare
 *
 * This runs the prepare script for ALL packages and apps, ensuring every package
 * gets its proper hierarchical documentation links.
 *
 * LINK SPECIFIC PACKAGE:
 * ---------------------
 * From within a specific package directory (e.g., packages/voder-tools-file/):
 *   npm run prepare
 *
 * This links documentation only for that specific package.
 *
 * WHAT THE SCRIPT DOES:
 * --------------------
 * 1. Finds the package's specification file in the prompts/ hierarchy
 * 2. Creates symlinks to ALL .md files from that directory up to prompts/ root
 * 3. Links external dependency documentation from node_modules/
 * 4. Clears old symlinks first to ensure clean state
 * 5. Validates all targets exist before creating links
 *
 * DEBUGGING INHERITANCE ISSUES:
 * ----------------------------
 * If a package isn't getting expected documentation:
 * 1. Run: npm run prepare (to refresh all links)
 * 2. Check: Does the package spec file exist? (e.g., prompts/runtime/sections/brand-entry-section/brand-entry-section.md)
 * 3. Verify: Are parent directories structured correctly?
 * 4. Solution: Usually requires moving files in the hierarchy, not changing this script
 *
 * ADDING NEW DOCUMENTATION:
 * ------------------------
 * 1. Place new .md files at the appropriate hierarchy level
 * 2. Run: npm run prepare (script automatically discovers new files)
 * 3. No code changes needed - the system is completely directory-based
 *
 * THE HIERARCHY APPROACH PHILOSOPHY:
 * ---------------------------------
 * This system is designed so that HIERARCHY CHANGES solve most documentation
 * distribution problems. Rather than hardcoding file lists or complex logic,
 * we simply move files up/down the hierarchy or create new layers as needed.
 * This makes the system self-maintaining and easy to understand.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Global tracking for link usage across all packages
const globalLinkTracker = new Map(); // targetPath -> count

function trackLink(targetPath) {
  const current = globalLinkTracker.get(targetPath) || 0;
  globalLinkTracker.set(targetPath, current + 1);
}

function analyzePackageDocsForReport(packageDir, packageName, quietMode = false) {
  if (!quietMode) {
    console.log(`  Analyzing ${packageName}...`);
  }

  // Only analyze existing prompts symlinks for the report
  const promptsDir = path.join(packageDir, "prompts");

  if (!fs.existsSync(promptsDir)) {
    return;
  }

  try {
    const files = fs.readdirSync(promptsDir);
    for (const file of files) {
      const filePath = path.join(promptsDir, file);
      const stats = fs.lstatSync(filePath);

      if (stats.isSymbolicLink()) {
        // Resolve the symlink to track its target
        try {
          const targetPath = fs.readlinkSync(filePath);
          const fullTargetPath = path.resolve(promptsDir, targetPath);

          // Only track if the target actually exists
          if (fs.existsSync(fullTargetPath)) {
            trackLink(fullTargetPath);
          }
        } catch (error) {
          // Ignore broken symlinks
        }
      }
    }
  } catch (error) {
    // Directory might not exist or be empty, which is fine for reporting
  }
}

function setupPackageDocs(quietMode = false) {
  const packageDir = process.cwd();
  const packageName = path.basename(packageDir);

  if (!quietMode) {
    console.log(`Setting up documentation for ${packageName}...`);
  }

  // Setup docs/libraries symlinks
  setupLibrariesSymlinks(packageDir, packageName, quietMode);

  // Setup prompts symlinks
  setupPromptsSymlinks(packageDir, packageName, quietMode);

  // Setup ADR symlinks (decision records tagged for this package)
  setupAdrSymlinks(packageDir, packageName, quietMode);

  // Setup dependency ADR symlinks (inherited from dependencies)
  setupDependencyAdrSymlinks(packageDir, packageName, quietMode);

  // Setup prompt-assets symlinks
  setupPromptAssetsSymlinks(packageDir, packageName, quietMode);
}

/**
 * Parse a markdown file front-matter (very small YAML subset) and return an object.
 * We deliberately avoid adding a dependency (like gray-matter) to keep this script self-contained.
 */
function parseFrontMatter(content) {
  if (!content.startsWith('---')) return {};
  const end = content.indexOf('\n---', 3);
  if (end === -1) return {};
  const block = content.substring(3, end).trim();
  const lines = block.split(/\r?\n/);
  const data = {};
  let currentKey = null;
  for (const line of lines) {
    if (/^\s*-\s+/.test(line) && currentKey) {
      // list item
      const value = line.replace(/^\s*-\s+/, '').trim();
      if (!Array.isArray(data[currentKey])) data[currentKey] = [];
      data[currentKey].push(value);
      continue;
    }
    const m = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (m) {
      currentKey = m[1];
      let raw = m[2].trim();
      if (raw === '') {
        data[currentKey] = [];
        continue;
      }
      // strip quotes
      raw = raw.replace(/^['"]/, '').replace(/['"]$/, '');
      data[currentKey] = raw;
    }
  }
  return data;
}

/** Link ADRs tagged with this package into docs/decisions */
function setupAdrSymlinks(packageDir, packageName, quietMode = false) {
  const adrSourceDir = path.resolve(packageDir, '../../docs/decisions');
  if (!fs.existsSync(adrSourceDir)) { if (!quietMode) console.log('  No root ADR directory found'); return; }
  const adrTargetDir = path.join(packageDir, 'docs', 'decisions');
  fs.mkdirSync(adrTargetDir, { recursive: true });
  for (const file of fs.readdirSync(adrTargetDir)) {
    const p = path.join(adrTargetDir, file);
    try { if (fs.lstatSync(p).isSymbolicLink()) fs.unlinkSync(p); } catch {}
  }
  const normalized = packageName.startsWith('@') ? packageName : `@voder/${packageName.replace(/^voder-/, '')}`;
  const shortName = normalized.replace(/^@voder\//, '');
  let linked = 0;
  for (const file of fs.readdirSync(adrSourceDir)) {
    if (!file.endsWith('.md')) continue;
    const full = path.join(adrSourceDir, file);
    const content = fs.readFileSync(full, 'utf8');
    const fm = parseFrontMatter(content);
    const pkgs = fm.packages || [];
    if (!Array.isArray(pkgs) || pkgs.length === 0) continue;
    const matches = pkgs.includes(normalized) || pkgs.includes(shortName) || pkgs.includes(packageName);
    if (!matches) continue;

    // Build symlink name: replace leading 'adr-' with 'shared-', otherwise prefix with 'shared-'
    let linkFileName = file;
    if (file.startsWith('adr-')) {
      linkFileName = 'shared-' + file.slice(4);
    } else if (!file.startsWith('shared-')) {
      linkFileName = 'shared-' + file;
    }

    const relativeTarget = path.relative(adrTargetDir, full);
    const linkPath = path.join(adrTargetDir, linkFileName);
    try {
      fs.symlinkSync(relativeTarget, linkPath);
      if (!quietMode) console.log(`    Linked ADR ${file} -> ${linkFileName}`);
      linked++;
    } catch (e) {
      console.error(`    Failed to link ADR ${file}: ${e.message}`);
    }
  }
  if (!quietMode) console.log(`  ADR linking complete (${linked} linked)`);
  const summaryPath = path.join(adrTargetDir, 'README.md');
  try {
    // Gather decision entries and separate local files from shared (symlinks)
    const allEntries = fs
      .readdirSync(adrTargetDir)
      .filter(f => f.endsWith('.md') && f !== 'README.md')
      .sort();

    const localEntries = [];
    const sharedEntries = [];

    for (const e of allEntries) {
      const p = path.join(adrTargetDir, e);
      let isLink = false;
      try { isLink = fs.lstatSync(p).isSymbolicLink(); } catch {}
      if (isLink) sharedEntries.push(e); else localEntries.push(e);
    }

    const lines = [
      `# Decision Records for ${packageName}`,
      '',
    ];

    if (localEntries.length > 0) {
      lines.push(
        '## Local decisions',
        '',
        'These decisions are authored and owned by this package.',
        '',
        ...localEntries.map(e => `- [${e}](./${e})`),
        ''
      );
    }

    if (sharedEntries.length > 0) {
      lines.push(
        '## Shared decisions',
        '',
        'These are shared ADRs linked from the root docs/decisions because they declare applicability to this package via front-matter `packages:`.',
        '',
        ...sharedEntries.map(e => `- [${e}](./${e})`),
        ''
      );
    }

    if (localEntries.length === 0 && sharedEntries.length === 0) {
      lines.push('_No decisions present._', '');
    }

    lines.push('> This file is auto-generated by setup-package-docs.js; do not edit manually.');

    fs.writeFileSync(summaryPath, lines.join('\n') + '\n');
  } catch (e) { console.error('    Failed to write ADR README:', e.message); }
}

/** Link ADRs from dependency packages into docs/decisions with 'inherited-' prefix */
function setupDependencyAdrSymlinks(packageDir, packageName, quietMode = false) {
  // Read package.json to get dependencies
  const packageJsonPath = path.join(packageDir, "package.json");
  if (!fs.existsSync(packageJsonPath)) {
    if (!quietMode) console.log("  No package.json found for dependency ADR linking");
    return;
  }

  let packageJson;
  try {
    packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
  } catch (error) {
    console.error("  Error reading package.json for dependency ADRs:", error.message);
    return;
  }

  // Extract ALL dependencies (both dependencies and devDependencies)
  const allDeps = {
    ...(packageJson.dependencies || {}),
    ...(packageJson.devDependencies || {}),
  };

  const depNames = Object.keys(allDeps);
  
  if (depNames.length === 0) {
    if (!quietMode) console.log("  No dependencies found for ADR inheritance");
    return;
  }

  const adrTargetDir = path.join(packageDir, 'docs', 'decisions');
  fs.mkdirSync(adrTargetDir, { recursive: true });

  let totalLinked = 0;
  
  if (!quietMode) console.log(`  Linking dependency ADRs from ${depNames.length} dependencies...`);

  // Process each dependency
  for (const depName of depNames) {
    // Skip non-local dependencies (external packages)
    if (!depName.startsWith('@voder/') && !allDeps[depName].startsWith('file:')) {
      continue;
    }

    let depPath;
    if (allDeps[depName].startsWith('file:')) {
      // Local file reference like "file:../dev-config"
      depPath = path.resolve(packageDir, allDeps[depName].replace('file:', ''));
    } else if (depName.startsWith('@voder/')) {
      // Convert @voder/dep-name to ../dep-name
      const depBaseName = depName.replace('@voder/', '');
      depPath = path.resolve(packageDir, `../${depBaseName}`);
    }

    if (!depPath || !fs.existsSync(depPath)) {
      continue;
    }

    const depAdrDir = path.join(depPath, 'docs', 'decisions');
    if (!fs.existsSync(depAdrDir)) {
      continue;
    }

    let linkedFromDep = 0;

    try {
      const adrFiles = fs.readdirSync(depAdrDir).filter(f => 
        f.endsWith('.md') && f !== 'README.md'
      );

      for (const adrFile of adrFiles) {
        const sourceAdrPath = path.join(depAdrDir, adrFile);
        
        // Skip if it's already a symlink (inherited from another dependency)
        try {
          if (fs.lstatSync(sourceAdrPath).isSymbolicLink()) {
            continue;
          }
        } catch (e) {
          continue;
        }

        // Build inherited link name: add 'inherited-' prefix unless already present
        let inheritedFileName = adrFile;
        if (!adrFile.startsWith('inherited-')) {
          inheritedFileName = 'inherited-' + adrFile;
        }

        const linkPath = path.join(adrTargetDir, inheritedFileName);
        
        // Skip if link already exists
        if (fs.existsSync(linkPath)) {
          continue;
        }

        const relativeTarget = path.relative(adrTargetDir, sourceAdrPath);
        
        try {
          fs.symlinkSync(relativeTarget, linkPath);
          if (!quietMode) console.log(`    Inherited ADR ${depName}/${adrFile} -> ${inheritedFileName}`);
          linkedFromDep++;
          totalLinked++;
        } catch (e) {
          console.error(`    Failed to inherit ADR ${depName}/${adrFile}: ${e.message}`);
        }
      }
    } catch (e) {
      // Error reading dependency ADR directory, continue with next dependency
    }

    if (!quietMode && linkedFromDep > 0) {
      console.log(`    Linked ${linkedFromDep} ADRs from ${depName}`);
    }
  }

  if (!quietMode) console.log(`  Dependency ADR linking complete (${totalLinked} inherited)`);

  // Update the README.md to include inherited decisions
  updateAdrReadmeWithInherited(adrTargetDir, packageName);
}

/** Update ADR README to include inherited decisions section */
function updateAdrReadmeWithInherited(adrTargetDir, packageName) {
  const summaryPath = path.join(adrTargetDir, 'README.md');
  
  try {
    // Gather decision entries and categorize them
    const allEntries = fs
      .readdirSync(adrTargetDir)
      .filter(f => f.endsWith('.md') && f !== 'README.md')
      .sort();

    const localEntries = [];
    const sharedEntries = [];
    const inheritedEntries = [];

    for (const e of allEntries) {
      const p = path.join(adrTargetDir, e);
      let isLink = false;
      try { isLink = fs.lstatSync(p).isSymbolicLink(); } catch {}
      
      if (isLink) {
        if (e.startsWith('inherited-')) {
          inheritedEntries.push(e);
        } else {
          sharedEntries.push(e);
        }
      } else {
        localEntries.push(e);
      }
    }

    const lines = [
      `# Decision Records for ${packageName}`,
      '',
    ];

    if (localEntries.length > 0) {
      lines.push(
        '## Local decisions',
        '',
        'These decisions are authored and owned by this package.',
        '',
        ...localEntries.map(e => `- [${e}](./${e})`),
        ''
      );
    }

    if (sharedEntries.length > 0) {
      lines.push(
        '## Shared decisions',
        '',
        'These are shared ADRs linked from the root docs/decisions because they declare applicability to this package via front-matter `packages:`.',
        '',
        ...sharedEntries.map(e => `- [${e}](./${e})`),
        ''
      );
    }

    if (inheritedEntries.length > 0) {
      lines.push(
        '## Inherited decisions',
        '',
        'These are decision records inherited from dependency packages that may affect this package.',
        '',
        ...inheritedEntries.map(e => `- [${e}](./${e})`),
        ''
      );
    }

    if (localEntries.length === 0 && sharedEntries.length === 0 && inheritedEntries.length === 0) {
      lines.push('_No decisions present._', '');
    }

    lines.push('> This file is auto-generated by setup-package-docs.js; do not edit manually.');

    fs.writeFileSync(summaryPath, lines.join('\n') + '\n');
  } catch (e) { 
    console.error('    Failed to update ADR README with inherited decisions:', e.message); 
  }
}

function setupLibrariesSymlinks(packageDir, packageName, quietMode = false) {
  const docsDir = path.join(packageDir, "docs");
  const librariesDir = path.join(docsDir, "libraries");
  const usageDir = path.join(librariesDir, "usage");
  const needsDir = path.join(librariesDir, "needs");

  if (!quietMode) {
    console.log(`  Setting up docs/libraries structure...`);
  }

  // Create docs/libraries/usage and docs/libraries/needs directories
  fs.mkdirSync(usageDir, { recursive: true });
  fs.mkdirSync(needsDir, { recursive: true });

  // Clean existing symlinks in both directories
  for (const dir of [usageDir, needsDir]) {
    try {
      const files = fs.readdirSync(dir);
      for (const file of files) {
        const filePath = path.join(dir, file);
        const stats = fs.lstatSync(filePath);
        if (stats.isSymbolicLink()) {
          fs.unlinkSync(filePath);
        }
      }
    } catch (error) {
      // Directory might not exist or be empty, which is fine
    }
  }

  // Clean old docs/libraries structure (remove files directly in libraries/)
  try {
    const files = fs.readdirSync(librariesDir);
    for (const file of files) {
      const filePath = path.join(librariesDir, file);
      const stats = fs.lstatSync(filePath);
      if (stats.isSymbolicLink() || (stats.isFile() && file.endsWith(".md"))) {
        fs.unlinkSync(filePath);
      }
    }
  } catch (error) {
    // Directory might not exist or be empty, which is fine
  }

  // Read package.json to get dependencies
  const packageJsonPath = path.join(packageDir, "package.json");
  if (!fs.existsSync(packageJsonPath)) {
    console.log("  No package.json found");
    return;
  }

  let packageJson;
  try {
    packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
  } catch (error) {
    console.error("  Error reading package.json:", error.message);
    return;
  }

  // Extract ALL dependencies (both dependencies and devDependencies)
  const allDeps = {
    ...(packageJson.dependencies || {}),
    ...(packageJson.devDependencies || {}),
  };

  const depNames = Object.keys(allDeps);

  if (depNames.length === 0) {
    console.log("  No dependencies found");
    return;
  }

  console.log(`  Found ${depNames.length} dependencies, creating usage docs...`);

  // Link to node_modules for ALL dependencies in docs/libraries/usage/
  for (const dep of depNames) {
    // Sanitize package name for filename (remove @ and replace / with -)
    const depFilename = dep.replace(/^@/, "").replace(/\//g, "-") + ".md";

    // All dependencies link to node_modules (from docs/libraries/usage to root node_modules)
    const targetPath = `../../../../../node_modules/${dep}/README.md`;
    const linkPath = path.join(usageDir, depFilename);

    // Check if target README exists before creating symlink
    // Resolve the path from the docs/libraries/usage directory, not the package directory
    const fullTargetPath = path.resolve(usageDir, targetPath);
    if (fs.existsSync(fullTargetPath)) {
      try {
        fs.symlinkSync(targetPath, linkPath);
        console.log(`    Linked ${dep} -> usage/${depFilename}`);
      } catch (error) {
        console.error(`    Failed to link ${dep}: ${error.message}`);
      }
    } else {
      console.log(`    Skipped ${dep} (no README.md found in node_modules)`);
    }
  }

  // Note: NEEDS files belong in each package's own docs/libraries/needs/ directory
  // They should not be linked between packages - that violates the principle
  // Instead, they should be accessible through the prompts hierarchy

  // Create symlinks to master README files for both directories
  const needsReadmePath = path.join(needsDir, "README.md");
  const usageReadmePath = path.join(usageDir, "README.md");

  // Symlink to master needs README (from docs/libraries/needs to root)
  const needsReadmeTarget = "../../../../../docs-libraries-needs-README.md";
  if (!fs.existsSync(needsReadmePath)) {
    const fullNeedsTarget = path.resolve(needsDir, needsReadmeTarget);
    if (fs.existsSync(fullNeedsTarget)) {
      try {
        fs.symlinkSync(needsReadmeTarget, needsReadmePath);
        console.log(`    Linked needs README -> ${needsReadmeTarget}`);
      } catch (error) {
        console.error(`    Failed to link needs README: ${error.message}`);
      }
    } else {
      console.log(`    Skipped needs README (master file not found: ${fullNeedsTarget})`);
    }
  }

  // Symlink to master usage README (from docs/libraries/usage to root)
  const usageReadmeTarget = "../../../../../docs-libraries-usage-README.md";
  if (!fs.existsSync(usageReadmePath)) {
    const fullUsageTarget = path.resolve(usageDir, usageReadmeTarget);
    if (fs.existsSync(fullUsageTarget)) {
      try {
        fs.symlinkSync(usageReadmeTarget, usageReadmePath);
        console.log(`    Linked usage README -> ${usageReadmeTarget}`);
      } catch (error) {
        console.error(`    Failed to link usage README: ${error.message}`);
      }
    } else {
      console.log(`    Skipped usage README (master file not found: ${fullUsageTarget})`);
    }
  }
}

function setupPromptsSymlinks(packageDir, packageName, quietMode = false) {
  const promptsDir = path.join(packageDir, "prompts");

  if (!quietMode) {
    console.log(`  Setting up prompts...`);
  }

  // Create prompts directory
  fs.mkdirSync(promptsDir, { recursive: true });

  // Clean existing symlinks
  try {
    const files = fs.readdirSync(promptsDir);
    for (const file of files) {
      const filePath = path.join(promptsDir, file);
      const stats = fs.lstatSync(filePath);
      if (stats.isSymbolicLink()) {
        fs.unlinkSync(filePath);
      }
    }
  } catch (error) {
    // Directory might not exist or be empty, which is fine
  }

  // Determine package type and create appropriate symlinks
  const packageJson = getPackageJson(packageDir);
  const symlinksToCreate = getHierarchicalPromptSymlinks(packageJson, packageDir);

  for (const { filename, targetPath } of symlinksToCreate) {
    const linkPath = path.join(promptsDir, filename);
    const fullTargetPath = path.resolve(promptsDir, targetPath);

    if (fs.existsSync(fullTargetPath)) {
      try {
        fs.symlinkSync(targetPath, linkPath);
        trackLink(fullTargetPath); // Track this link for global usage reporting
        console.log(`    Linked ${filename} -> ${targetPath}`);
      } catch (error) {
        console.error(`    Failed to link ${filename}: ${error.message}`);
      }
    } else {
      console.log(`    Skipped ${filename} (target not found: ${targetPath})`);
    }
  }
}

function setupPromptAssetsSymlinks(packageDir, packageName, quietMode = false) {
  if (!quietMode) {
    console.log(`  Setting up prompt-assets links...`);
  }

  // Create prompt-assets directory in the package
  const promptAssetsDir = path.join(packageDir, "prompt-assets");
  fs.mkdirSync(promptAssetsDir, { recursive: true });

  // Clean existing symlinks
  try {
    const files = fs.readdirSync(promptAssetsDir);
    for (const file of files) {
      const filePath = path.join(promptAssetsDir, file);
      const stats = fs.lstatSync(filePath);
      if (stats.isSymbolicLink()) {
        fs.unlinkSync(filePath);
      }
    }
  } catch (error) {
    // Directory might not exist or be empty, which is fine
  }

  // Link all .md files from prompt-assets directory
  const sourcePromptAssetsDir = path.resolve(packageDir, "../../prompt-assets");
  
  if (!fs.existsSync(sourcePromptAssetsDir)) {
    if (!quietMode) console.log(`    Prompt-assets directory not found: ${sourcePromptAssetsDir}`);
    return;
  }

  let linkedCount = 0;

  try {
    const files = fs.readdirSync(sourcePromptAssetsDir);
    
    for (const file of files) {
      // Only link .md files
      if (!file.endsWith('.md')) {
        continue;
      }

      const sourceFilePath = path.join(sourcePromptAssetsDir, file);
      const stats = fs.statSync(sourceFilePath);
      
      // Only link regular files (not directories or symlinks)
      if (!stats.isFile()) {
        continue;
      }

      const relativeTargetPath = `../../../prompt-assets/${file}`;
      const linkPath = path.join(promptAssetsDir, file);

      try {
        fs.symlinkSync(relativeTargetPath, linkPath);
        trackLink(sourceFilePath);
        if (!quietMode) console.log(`    Linked ${file} -> ${relativeTargetPath}`);
        linkedCount++;
      } catch (error) {
        if (!quietMode) console.log(`    Skipped ${file} (link failed: ${error.message})`);
      }
    }
  } catch (error) {
    console.error(`    Error reading prompt-assets directory: ${error.message}`);
  }

  if (!quietMode) console.log(`    Linked ${linkedCount} prompt-asset files`);
}

/**
 * Generate path-based filename for hierarchical documentation linking
 * 
 * Converts file paths to kebab-case linked names that provide clear context
 * and eliminate naming conflicts between universal and layer-specific files.
 * 
 * Examples:
 * - prompts/architecture.md → architecture.md (universal, no prefix)
 * - prompts/runtime/runtime.md → runtime.md
 * - prompts/runtime/sections/sections.md → runtime-sections.md
 * - prompts/runtime/sections/brand-entry-section/brand-entry-section.md → runtime-sections-brand-entry-section.md
 * - prompts/runtime/applications/voder-website/voder-website.md → runtime-applications-voder-website.md
 * 
 * @param {string} targetPath - Relative path like "../../../prompts/runtime/sections/sections.md"
 * @param {string} originalFilename - Original filename like "sections.md"
 * @returns {string} Path-based filename
 */
function generatePathBasedFilename(targetPath, originalFilename) {
  // Extract the path relative to prompts/
  // targetPath: "../../../prompts/runtime/sections/sections.md"
  // Split and find prompts index
  const pathParts = targetPath.split('/');
  const promptsIndex = pathParts.indexOf('prompts');
  
  if (promptsIndex === -1) {
    // Fallback to original filename if prompts not found
    return originalFilename;
  }
  
  // Get path components after prompts/
  const pathComponents = pathParts.slice(promptsIndex + 1);
  
  // Remove the filename from path components
  const fileNameWithExt = pathComponents[pathComponents.length - 1];
  const pathWithoutFile = pathComponents.slice(0, -1);
  
  // If it's a universal file (directly in prompts/), keep original name
  if (pathWithoutFile.length === 0) {
    return originalFilename;
  }
  
  // Extract filename without extension for redundancy check
  const filenameWithoutExt = fileNameWithExt.replace(/\.md$/, '');
  const pathForNaming = [...pathWithoutFile];
  
  // Remove redundant segments where directory name matches filename
  // e.g., runtime/runtime.md → just "runtime" not "runtime-runtime"
  if (pathForNaming.length > 0 && pathForNaming[pathForNaming.length - 1] === filenameWithoutExt) {
    // The filename matches the last directory, so skip adding the filename part
    // Just use the path: runtime/runtime.md → runtime.md
    return pathForNaming.join('-') + '.md';
  }
  
  // Normal case: join path components with hyphens
  // runtime/sections/brand-entry-section/brand-entry-section.md → runtime-sections-brand-entry-section.md
  return pathForNaming.join('-') + '-' + filenameWithoutExt + '.md';
}

function getPackageJson(packageDir) {
  const packageJsonPath = path.join(packageDir, "package.json");
  if (!fs.existsSync(packageJsonPath)) {
    return { keywords: [] };
  }

  try {
    return JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
  } catch (error) {
    console.error(`  Error reading package.json: ${error.message}`);
    return { keywords: [] };
  }
}

function getUniversalFiles(packageDir) {
  const promptsDir = path.join(packageDir, "prompts");
  const rootPromptsPath = path.resolve(promptsDir, "../../../prompts");

  if (!fs.existsSync(rootPromptsPath)) {
    console.log(`    Universal prompts directory not found: ${rootPromptsPath}`);
    return [];
  }

  const universalFiles = [];
  try {
    const files = fs.readdirSync(rootPromptsPath);
    console.log(`    Scanning universal prompts (${files.length} items)`);

    for (const file of files) {
      const filePath = path.join(rootPromptsPath, file);
      const stats = fs.statSync(filePath);

      // Only include root-level .md files (not directories) but exclude README.md
      if (stats.isFile() && file.endsWith(".md") && file !== "README.md") {
        const targetPath = `../../../prompts/${file}`;
        universalFiles.push({
          filename: generatePathBasedFilename(targetPath, file),
          targetPath: targetPath,
        });
        console.log(`      Found universal file: ${file} → linked as ${generatePathBasedFilename(targetPath, file)}`);
      } else if (file === "README.md") {
        console.log(`      Skipped directory index: ${file}`);
      }
    }
  } catch (error) {
    console.error(`    Error scanning universal prompts: ${error.message}`);
  }

  return universalFiles;
}

function getLayerSpecificFiles(layerPath, packageDir, excludeFiles = []) {
  const promptsDir = path.join(packageDir, "prompts");
  const fullPath = path.resolve(promptsDir, `../../../prompts/${layerPath}`);

  if (!fs.existsSync(fullPath)) {
    console.log(`    Layer directory not found: ${layerPath}`);
    return [];
  }

  const layerFiles = [];
  try {
    const files = fs.readdirSync(fullPath);
    console.log(`    Scanning layer ${layerPath} (${files.length} items)`);

    for (const file of files) {
      const filePath = path.join(fullPath, file);
      const stats = fs.statSync(filePath);

      // Only include root-level .md files (not directories) and exclude specified files
      if (stats.isFile() && file.endsWith(".md") && !excludeFiles.includes(file)) {
        const targetPath = `../../../prompts/${layerPath}/${file}`;
        layerFiles.push({
          filename: generatePathBasedFilename(targetPath, file),
          targetPath: targetPath,
        });
        console.log(`      Found layer file: ${file} → linked as ${generatePathBasedFilename(targetPath, file)}`);
      }
    }
  } catch (error) {
    console.error(`    Error scanning layer ${layerPath}: ${error.message}`);
  }

  return layerFiles;
}

function getDirectoryFiles(relativePath, packageDir) {
  const promptsDir = path.join(packageDir, "prompts");
  const fullPath = path.resolve(promptsDir, relativePath);

  if (!fs.existsSync(fullPath)) {
    console.log(`    Directory not found: ${relativePath}`);
    return [];
  }

  const symlinks = [];
  try {
    const files = fs.readdirSync(fullPath);
    console.log(`    Scanning directory ${relativePath} (${files.length} items)`);

    for (const file of files) {
      const filePath = path.join(fullPath, file);
      const stats = fs.statSync(filePath);

      // Only include .md files, skip directories and other file types, exclude README.md
      if (stats.isFile() && file.endsWith(".md") && file !== "README.md") {
        const targetPath = path.join(relativePath, file);
        symlinks.push({
          filename: generatePathBasedFilename(targetPath, file),
          targetPath: targetPath,
        });
        console.log(`      Found: ${file} → linked as ${generatePathBasedFilename(targetPath, file)}`);
      } else if (file === "README.md") {
        console.log(`      Skipped directory index: ${file}`);
      }
    }
  } catch (error) {
    console.error(`    Error reading directory ${relativePath}: ${error.message}`);
  }

  return symlinks;
}

function getRootPromptFiles(relativePath, packageDir) {
  const promptsDir = path.join(packageDir, "prompts");
  const fullPath = path.resolve(promptsDir, relativePath);

  if (!fs.existsSync(fullPath)) {
    return [];
  }

  const symlinks = [];
  try {
    const files = fs.readdirSync(fullPath);
    for (const file of files) {
      const filePath = path.join(fullPath, file);
      const stats = fs.statSync(filePath);

      // Only include root-level .md files (not directories or subdirectories), exclude README.md
      if (stats.isFile() && file.endsWith(".md") && file !== "README.md") {
        const targetPath = path.join(relativePath, file);
        symlinks.push({
          filename: generatePathBasedFilename(targetPath, file),
          targetPath: targetPath,
        });
      }
    }
  } catch (error) {
    console.error(`  Error reading root prompts directory: ${error.message}`);
  }

  return symlinks;
}

function getPackageSpecificFile(packageName, packageDir) {
  // Convert package name to file name
  // @voder/build-tools -> build-tools.md
  // @voder/tools-file -> tools-file.md
  // @voder/phase-observe -> phase-observe.md
  let fileName = packageName;
  if (fileName.startsWith("@voder/")) {
    fileName = fileName.substring(7); // Remove @voder/ prefix
  }
  fileName = fileName + ".md";

  const targetPath = `../../../prompts/packages/${fileName}`;
  const promptsDir = path.join(packageDir, "prompts");
  const fullTargetPath = path.resolve(promptsDir, targetPath);

  // Check if the package-specific file exists
  if (fs.existsSync(fullTargetPath)) {
    return {
      filename: `${fileName.replace(".md", "")}-spec.md`, // build-tools-spec.md
      targetPath: targetPath,
    };
  }

  return null;
}

function getHierarchicalPromptSymlinks(packageJson, packageDir) {
  const packageName = packageJson.name || "";
  const symlinks = [];

  // Define legacy packages and apps that are NOT in scope for the new linking system
  const legacyPackages = [
    "voder-cli-v2",
    "voder-core",
    "voder-core-2",
    "voder-graph", // replaced by voder-langgraph
  ];

  const legacyApps = [
    "voder-cli", // replaced by voder-cli-v3
  ];

  // Check if this is a legacy package/app that should not use the new system
  const currentPackageDir = process.cwd();
  const packageDirName = path.basename(currentPackageDir);

  if (legacyPackages.includes(packageDirName) || legacyApps.includes(packageDirName)) {
    console.error(`\n❌ ERROR: ${packageDirName} is a legacy package that is NOT in scope for the hierarchical documentation system.`);
    console.error(`   This package should not use the new setup-package-docs.js script.`);
    console.error(`   Please remove the "prepare" hook from its package.json.`);
    console.error(`\n   Legacy packages not in scope:`);
    console.error(`   - ${legacyPackages.join("\n   - ")}`);
    console.error(`\n   Legacy apps not in scope:`);
    console.error(`   - ${legacyApps.join("\n   - ")}`);
    process.exit(1);
  }

  // Handle both @voder/ and voder- naming patterns first
  let baseName = "";
  if (packageName.startsWith("@voder/")) {
    baseName = packageName.substring(7); // Remove @voder/ prefix
  } else if (packageName.startsWith("voder-")) {
    baseName = packageName.substring(6); // Remove voder- prefix
  } else {
    console.error(`\n❌ ERROR: Package name "${packageName}" does not follow voder naming conventions.`);
    console.error(`   Expected: @voder/package-name or voder-package-name`);
    process.exit(1);
  }

  // Universal files - all packages get these (root level of hierarchy)
  const universalFiles = getUniversalFiles(packageDir);
  symlinks.push(...universalFiles);

  // Find the package-specific file in the hierarchy and inherit everything above it
  const packageSpecificFile = findPackageInHierarchy(baseName, packageDir);
  if (packageSpecificFile) {
    // Add the package-specific file
    symlinks.push(packageSpecificFile);

    // Add all files from the package file's directory and parent directories in the hierarchy path
    // Extract the directory path from the target path
    const targetPath = packageSpecificFile.targetPath; // e.g., "../../../prompts/workflow/graph/langgraph.md"
    const pathParts = targetPath.split("/"); // ["...", "...", "...", "prompts", "workflow", "graph", "langgraph.md"]

    // Start from the package file's directory (includes siblings) and work up to parent directories
    for (let i = pathParts.length - 2; i >= 4; i--) {
      // Start from directory containing the file, stop at prompts/
      const dirParts = pathParts.slice(0, i + 1); // Include the directory at index i
      const relativePath = dirParts.join("/");
      console.log(`    Checking directory: ${relativePath}`);
      symlinks.push(...getDirectoryFiles(relativePath, packageDir));
    }
  }

  // Add needs files from dependent packages to the prompts hierarchy
  const needsFiles = getNeedsFiles(packageJson, packageDir);
  symlinks.push(...needsFiles);

  // Deduplicate symlinks by target path, preferring original filename over -spec version
  const uniqueSymlinks = [];
  const seenTargets = new Map(); // targetPath -> symlink object

  for (const symlink of symlinks) {
    const existingSymlink = seenTargets.get(symlink.targetPath);

    if (!existingSymlink) {
      // First time seeing this target
      uniqueSymlinks.push(symlink);
      seenTargets.set(symlink.targetPath, symlink);
    } else {
      // We've seen this target before - prefer the original filename over -spec version
      if (symlink.filename.endsWith("-spec.md") && !existingSymlink.filename.endsWith("-spec.md")) {
        // Keep the existing non-spec version, skip this -spec version
        continue;
      } else if (!symlink.filename.endsWith("-spec.md") && existingSymlink.filename.endsWith("-spec.md")) {
        // Replace the existing -spec version with this non-spec version
        const index = uniqueSymlinks.indexOf(existingSymlink);
        uniqueSymlinks[index] = symlink;
        seenTargets.set(symlink.targetPath, symlink);
      }
      // If both are -spec or both are non-spec, keep the first one (existing)
    }
  }

  return uniqueSymlinks;
}

function findPackageInHierarchy(baseName, packageDir) {
  const promptsDir = path.join(packageDir, "prompts");
  const rootPromptsPath = path.resolve(promptsDir, "../../../prompts");

  if (!fs.existsSync(rootPromptsPath)) {
    console.log(`    Prompts directory not found: ${rootPromptsPath}`);
    return null;
  }

  // Recursively search the entire hierarchy for a file matching the package name
  function searchDirectory(dir, relativePath = "") {
    try {
      const items = fs.readdirSync(dir);

      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stats = fs.statSync(fullPath);

        if (stats.isFile() && item.endsWith(".md") && item !== "README.md") {
          // Check if this file matches our package name
          const fileBaseName = item.replace(".md", "");
          if (fileBaseName === baseName) {
            const targetPath = `../../../prompts/${relativePath}${item}`;
            console.log(`      Found package file: ${relativePath}${item} → linked as ${generatePathBasedFilename(targetPath, item)}`);
            return {
              filename: generatePathBasedFilename(targetPath, item),
              targetPath: targetPath,
            };
          }
        } else if (stats.isDirectory()) {
          // Recursively search subdirectories
          const subResult = searchDirectory(fullPath, `${relativePath}${item}/`);
          if (subResult) {
            return subResult;
          }
        }
      }
    } catch (error) {
      console.error(`    Error searching directory ${dir}: ${error.message}`);
    }

    return null;
  }

  return searchDirectory(rootPromptsPath);
}

function getNeedsFiles(packageJson, packageDir) {
  const packageName = packageJson.name || "";
  if (!packageName) {
    return [];
  }

  console.log(`    Scanning for needs files that describe what dependents need from ${packageName}...`);

  // Convert package name to expected needs file name
  // @voder/config-types -> config-types-needs.md
  let needsFileName = packageName;
  if (needsFileName.startsWith("@voder/")) {
    needsFileName = needsFileName.substring(7); // Remove @voder/ prefix
  }
  needsFileName = needsFileName.replace(/\//g, "-") + "-needs.md";

  console.log(`      Looking for needs files named: ${needsFileName}`);

  const needsSymlinks = [];
  const workspaceRoot = path.resolve(packageDir, "../..");
  const packagesDir = path.join(workspaceRoot, "packages");
  const appsDir = path.join(workspaceRoot, "apps");

  // Scan packages directory
  if (fs.existsSync(packagesDir)) {
    const packages = fs.readdirSync(packagesDir);

    for (const pkg of packages) {
      const pkgPath = path.join(packagesDir, pkg);
      if (fs.statSync(pkgPath).isDirectory()) {
        const needsFilePath = path.join(pkgPath, "docs", "libraries", "needs", needsFileName);

        if (fs.existsSync(needsFilePath)) {
          // Calculate relative path from current package's prompts dir to the needs file
          const promptsDir = path.join(packageDir, "prompts");
          const relativePath = path.relative(promptsDir, needsFilePath);

          const linkName = `needs-from-${pkg}.md`;
          needsSymlinks.push({
            filename: linkName,
            targetPath: relativePath,
          });
          console.log(`      Found needs from ${pkg} -> ${linkName}`);
        }
      }
    }
  }

  // Scan apps directory
  if (fs.existsSync(appsDir)) {
    const apps = fs.readdirSync(appsDir);
    for (const app of apps) {
      const appPath = path.join(appsDir, app);
      if (fs.statSync(appPath).isDirectory()) {
        const needsFilePath = path.join(appPath, "docs", "libraries", "needs", needsFileName);

        if (fs.existsSync(needsFilePath)) {
          const promptsDir = path.join(packageDir, "prompts");
          const relativePath = path.relative(promptsDir, needsFilePath);

          const linkName = `needs-from-${app}.md`;
          needsSymlinks.push({
            filename: linkName,
            targetPath: relativePath,
          });
          console.log(`      Found needs from ${app} -> ${linkName}`);
        }
      }
    }
  }

  if (needsSymlinks.length === 0) {
    console.log(`      No packages found that need ${packageName}`);
  } else {
    console.log(`      Found ${needsSymlinks.length} package(s) that need ${packageName}`);
  }

  return needsSymlinks;
}

function reportLinkUsage() {
  console.log("\n📊 LINK USAGE REPORT");
  console.log("====================");

  // Find all .md files in prompts directory
  const promptsPath = path.resolve(__dirname, "prompts");
  const allPromptFiles = new Set();

  function scanPromptsDirectory(dir, relativePath = "") {
    try {
      const items = fs.readdirSync(dir);

      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stats = fs.statSync(fullPath);

        if (stats.isFile() && item.endsWith(".md") && item !== "README.md") {
          allPromptFiles.add(fullPath);
        } else if (stats.isDirectory()) {
          scanPromptsDirectory(fullPath, `${relativePath}${item}/`);
        }
      }
    } catch (error) {
      console.error(`Error scanning prompts directory: ${error.message}`);
    }
  }

  if (fs.existsSync(promptsPath)) {
    scanPromptsDirectory(promptsPath);
  }

  // Categorize files by usage
  const linkedFiles = [];
  const unlinkedFiles = [];

  for (const filePath of allPromptFiles) {
    const linkCount = globalLinkTracker.get(filePath) || 0;
    const relativePath = path.relative(promptsPath, filePath);

    if (linkCount > 0) {
      linkedFiles.push({ path: relativePath, count: linkCount });
    } else {
      unlinkedFiles.push(relativePath);
    }
  }

  // Sort linked files by usage count (descending)
  linkedFiles.sort((a, b) => b.count - a.count);

  console.log(`\n✅ FILES WITH LINKS (${linkedFiles.length}):`);
  for (const { path: filePath, count } of linkedFiles) {
    const countStr = count === 1 ? "1 link" : `${count} links`;
    console.log(`   ${filePath} → ${countStr}`);
  }

  if (unlinkedFiles.length > 0) {
    console.log(`\n⚠️  FILES WITH NO LINKS (${unlinkedFiles.length}):`);
    unlinkedFiles.sort();
    for (const filePath of unlinkedFiles) {
      console.log(`   ${filePath} → UNUSED`);
    }
    console.log(`\n💡 Consider removing unused files or check if they should be linked.`);
  } else {
    console.log(`\n🎉 All prompt files are being used!`);
  }

  console.log(`\nTOTAL: ${allPromptFiles.size} prompt files, ${linkedFiles.length} linked, ${unlinkedFiles.length} unused`);
}

// Only run if called directly (not when imported as module)
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  const isRootDirectory = process.cwd() === __dirname;

  if (args.includes('--all')) {
    // Link docs for all packages/apps without invoking their npm prepare scripts to avoid recursion
    const packagesDir = path.resolve(__dirname, 'packages');
    const appsDir = path.resolve(__dirname, 'apps');
    const targets = [];
    if (fs.existsSync(packagesDir)) {
      for (const p of fs.readdirSync(packagesDir)) {
        const pPath = path.join(packagesDir, p);
        if (fs.existsSync(path.join(pPath, 'package.json')) && fs.statSync(pPath).isDirectory()) targets.push(pPath);
      }
    }
    if (fs.existsSync(appsDir)) {
      for (const a of fs.readdirSync(appsDir)) {
        const aPath = path.join(appsDir, a);
        if (fs.existsSync(path.join(aPath, 'package.json')) && fs.statSync(aPath).isDirectory()) targets.push(aPath);
      }
    }
    console.log(`🔗 Linking documentation for ${targets.length} workspaces...`);
    const original = process.cwd();
    for (const t of targets) {
      try {
        process.chdir(t);
        setupPackageDocs(true);
        console.log(`  ✅ ${path.basename(t)}`);
      } catch (e) {
        console.error(`  ❌ ${path.basename(t)}: ${e.message}`);
      } finally {
        process.chdir(original);
      }
    }
    console.log('✅ Documentation linking complete.');
    process.exit(0);
  }

  if (args.includes("--report") || args.includes("--global-report")) {
    // Global report mode: analyze all packages and show usage
    console.log("🔍 SCANNING ALL PACKAGES FOR GLOBAL LINK USAGE REPORT...\n");

    // Find all packages and run setup for each
    const packagesDir = path.resolve(__dirname, "packages");
    const appsDir = path.resolve(__dirname, "apps");

    const allPackageDirs = [];

    // Scan packages directory
    if (fs.existsSync(packagesDir)) {
      const packages = fs.readdirSync(packagesDir);
      for (const pkg of packages) {
        const pkgPath = path.join(packagesDir, pkg);
        if (fs.statSync(pkgPath).isDirectory() && fs.existsSync(path.join(pkgPath, "package.json"))) {
          allPackageDirs.push(pkgPath);
        }
      }
    }

    // Scan apps directory
    if (fs.existsSync(appsDir)) {
      const apps = fs.readdirSync(appsDir);
      for (const app of apps) {
        const appPath = path.join(appsDir, app);
        if (fs.statSync(appPath).isDirectory() && fs.existsSync(path.join(appPath, "package.json"))) {
          allPackageDirs.push(appPath);
        }
      }
    }

    console.log(`Found ${allPackageDirs.length} packages to analyze...\n`);

    // Define legacy packages to skip (same as in setupPromptsSymlinks)
    const legacyPackages = [
      "voder-cli-v2", // replaced by voder-cli-v3
      "voder-core", // replaced by voder-core-2
      "voder-core-2",
      "voder-graph", // replaced by voder-langgraph
    ];

    const legacyApps = [
      "voder-cli", // replaced by voder-cli-v3
    ];

    // Run setup for each package (this populates the global tracker)
    for (const pkgDir of allPackageDirs) {
      const originalCwd = process.cwd();
      try {
        process.chdir(pkgDir);
        const pkgName = path.basename(pkgDir);

        // Skip legacy packages
        if (legacyPackages.includes(pkgName) || legacyApps.includes(pkgName)) {
          console.log(`  Skipping legacy package: ${pkgName}`);
          continue;
        }

        console.log(`  Analyzing ${pkgName}...`);
        analyzePackageDocsForReport(pkgDir, pkgName, true); // quiet mode - only analyze existing symlinks
      } catch (error) {
        console.error(`  Error processing ${path.basename(pkgDir)}: ${error.message}`);
      } finally {
        process.chdir(originalCwd);
      }
    }

    // Generate the global report
    reportLinkUsage();
  } else if (isRootDirectory) {
    // Run from root directory: execute npm run prepare to update all packages
    console.log("🚀 Running from root directory - executing 'npm run prepare' to update all packages...\n");

    try {
      execSync("npm run prepare", {
        stdio: "inherit",
        cwd: __dirname,
      });
      console.log("\n✅ All packages updated successfully!");
    } catch (error) {
      console.error(`\n❌ Error running npm prepare: ${error.message}`);
      process.exit(1);
    }

    process.exit(0);
  } else {
    setupPackageDocs();
  }
}

export { setupPackageDocs, reportLinkUsage };
