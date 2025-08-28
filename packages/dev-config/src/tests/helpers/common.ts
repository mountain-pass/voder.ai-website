import { execSync } from 'child_process';
import { mkdir, mkdtemp, rm, writeFile } from 'fs/promises';
import { tmpdir } from 'os';
import { join, resolve } from 'path';

export interface SetupResult {
  tempDir: string;
  packagePath: string;
}

/**
 * Packs this package, creates a temp consumer project that depends on it,
 * runs `npm install`, and returns its directory paths.
 */
export async function setupTestPackageInstallation(): Promise<SetupResult> {
  // 1) create a temp directory
  const tempDir = await mkdtemp(join(tmpdir(), 'voder-test-'));

  // 2) pack current package and locate tarball
  const packOutput = execSync('npm pack', { encoding: 'utf8' }).trim().split('\n').pop()!;

  const tarballPath = resolve(process.cwd(), packOutput);

  // 3) scaffold a test consumer
  const packagePath = join(tempDir, 'test-package');

  await mkdir(packagePath, { recursive: true });

  // 4) write a minimal package.json that installs our tarball
  const pkg = {
    name: 'test-consumer',
    type: 'module',
    dependencies: {
      '@voder/dev-config': `file:${tarballPath}`,
    },
  };

  await writeFile(join(packagePath, 'package.json'), JSON.stringify(pkg, null, 2), 'utf8');

  // 5) install dependencies
  execSync('npm install', { cwd: packagePath, stdio: 'inherit' });

  return { tempDir, packagePath };
}

/**
 * Cleans up the temp directory created by setupTestPackageInstallation.
 */
export async function teardownTestEnvironment(tempDir: string): Promise<void> {
  await rm(tempDir, { recursive: true, force: true });
}
