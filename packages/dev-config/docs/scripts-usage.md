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

TBD: Describe the purpose of the **duplicate-detect.sh** script.

### CLI Invocation

```bash
./scripts/duplicate-detect.sh [directory]
```

### Options

- `<directory>`: Directory to scan for duplicates.

### Default Behavior

TBD: Describe default directory to scan (e.g., `src/`).

### Exit Codes

- `0`: No duplicates found.
- `1`: Duplicates detected.
- `2`: Error during scanning.

## validate-runtime

### Purpose

TBD: Describe the purpose of the **validate-runtime** script.

### CLI Invocation

```bash
node scripts/validate-runtime.ts
```

### Options

- `--env <environment>`: Target environment to validate.

### Default Behavior

TBD: Describe default runtime validation behavior.

### Exit Codes

- `0`: Environment is valid.
- `1`: Missing dependencies.
- `2`: Invalid configuration.
