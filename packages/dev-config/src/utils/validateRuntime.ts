import { existsSync } from 'fs'
import { resolve } from 'path'

/**
 * Validates that the runtime environment is correctly set up:
 * - that `jiti` can be resolved
 * - that both tsconfig JSON files exist on disk
 * Throws an Error with a clear message if any check fails.
 */
export function validateRuntimeEnvironment(): void {
  // 1) Ensure `jiti` is installed
  try {
    // this will throw if jiti is not installed
     
    require.resolve('jiti')
  } catch {
    throw new Error(
      'Missing required peer dependency "jiti".\n' +
      'Please install it in your project: npm install --save-dev jiti'
    )
  }

  // 2) Ensure tsconfig.eslint.json exists
  const eslintConfig = resolve(process.cwd(), 'typescript/tsconfig.eslint.json')

  if (!existsSync(eslintConfig)) {
    throw new Error(
      `Missing TypeScript ESLint config at "${eslintConfig}".\n` +
      'Ensure that `typescript/tsconfig.eslint.json` is present in the package.'
    )
  }

  // 3) Ensure tsconfig.config.json exists
  const configConfig = resolve(process.cwd(), 'typescript/tsconfig.config.json')

  if (!existsSync(configConfig)) {
    throw new Error(
      `Missing TypeScript config file at "${configConfig}".\n` +
      'Ensure that `typescript/tsconfig.config.json` is present in the package.'
    )
  }
}