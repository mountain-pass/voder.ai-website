# Build & Validation Scripts

This document describes the internal build and validation scripts used within this project, including purpose, CLI invocation, available options, default behaviors, and exit codes.

## copy-assets

### Purpose

The `copy-assets` script copies all JSON files from the `typescript` directory and all JavaScript files from the `eslint` directory at the repository root into the corresponding `dist/typescript` and `dist/eslint` directories. It creates any missing destination directories and preserves file mode bits from the source files.

### CLI Invocation

```bash
node scripts/copy-assets.ts
```

### Options

This script does not accept any CLI options and always operates on the repository root.

### Default Behavior

When run without arguments, the script:

- Uses the current working directory as the repository root.
- Copies `*.json` files from `typescript/` to `dist/typescript/`.
- Copies `*.js` files from `eslint/` to `dist/eslint/`.
- Creates destination directories if they do not exist.
- Preserves the original file permission mode bits.

### Exit Codes

- `0`: Assets were copied successfully.
- `1`: An unexpected error occurred during execution.

## generate-markdownlint-config

### Purpose

The `generate-markdownlint-config` script generates a `.markdownlint.json` configuration file for markdownlint based on the project's standard lint rules. It sources rules from the project's markdown linter abstraction and writes the resulting config to the specified directory.

### CLI Invocation

```bash
node scripts/generate-markdownlint-config.ts [options]
```

### Options

- `--outputDir <path>`: Directory to write the `.markdownlint.json` file. Defaults to the current working directory.

### Default Behavior

When run without the `--outputDir` option, the script:

- Uses the current working directory for output.
- Retrieves the lint rules via the project's markdown linter abstraction (`getConfig()`).
- Serializes the rules as formatted JSON (2-space indentation with a trailing newline).
- Writes atomically to `.markdownlint.json` by writing to a temporary file and renaming it into place.
- Overwrites any existing `.markdownlint.json` in the target directory.

### Exit Codes

- `0`: Config file generated successfully.
- `1`: Invalid arguments (e.g., non-existent or non-writable `outputDir`).
- `2`: Failed to generate or write the config file.

## duplicate-detect.sh

### Purpose

The `duplicate-detect.sh` script scans all git-tracked files in the repository to detect any files with identical contents by computing SHA-1 checksums. It helps identify unintentional duplicate files within the project.

### CLI Invocation

```bash
./scripts/duplicate-detect.sh
```

### Options

This script does not accept any CLI options or arguments; it always scans all git-tracked files in the repository root.

### Default Behavior

When run, the script:

- Uses the current working directory as the repository root.
- Scans all git-tracked files (ignoring the `.git` directory and untracked files).
- Computes SHA-1 checksums for each tracked file and sorts them.
- Identifies groups of files sharing identical checksums (duplicates).
- Writes all checksums to `./tmp/all-shas.txt`.
- Writes duplicate hashes to `./tmp/duplicate-hashes.txt`.
- Prints details of duplicate files (if any) to standard error.

### Exit Codes

- `0`: No duplicates detected, or duplicates detected but `FAIL_ON_TRACKED` is not set (default behavior).
- `2`: Duplicate files detected and `FAIL_ON_TRACKED=1`, causing the script to fail.
- Any other non-zero code: An unexpected error occurred (e.g., missing dependencies or write permission issues).

## validate-runtime

### Purpose

The `validate-runtime` script verifies that the runtime environment prerequisites are met before using this package. It ensures that required peer dependencies (such as `jiti`) are installed and that the necessary TypeScript configuration files (`tsconfig.eslint.json` and `tsconfig.config.json`) exist in the project root. This helps catch missing dependencies or misconfigurations early in the workflow.

### CLI Invocation

```bash
node scripts/validate-runtime.ts
```

Or via npm script:

```bash
npm run validate:runtime
```

When running via npm and passing options, use:

```bash
npm run validate:runtime -- --env <environment>
```

### Options

- `--env <environment>`: (Reserved for future use) Specify the target environment to validate. Currently ignored.

### Default Behavior

When run without options, the script:

- Uses the current working directory as the project root.
- Resolves and loads `jiti` to verify it is installed.
- Checks for `typescript/tsconfig.eslint.json`.
- Checks for `typescript/tsconfig.config.json`.
- Exits with code `0` if all checks pass.

### Exit Codes

- `0`: Runtime environment is valid.
- `1`: A required peer dependency is missing (e.g., `jiti`).
- `2`: A required configuration file is missing (e.g., `tsconfig.eslint.json` or `tsconfig.config.json`).
