import { spawn } from 'child_process';

export interface SafeSpawnResult {
  stdout: string;
  stderr: string;
  code: number;
}

/**
 * Spawn a subprocess safely without a shell, collecting stdout/stderr and exit code.
 *
 * - Validates inputs synchronously and throws on invalid types.
 * - Does not run a shell by default (no shell interpolation/word-splitting).
 * - Merges provided env with process.env when opts.env is supplied.
 *
 * @param cmd - Command to run (non-empty string)
 * @param args - Array of string arguments
 * @param opts - Optional options: cwd and env
 */
export async function safeSpawn(
  cmd: string,
  args: string[],
  opts?: { cwd?: string; env?: Record<string, string> },
): Promise<SafeSpawnResult> {
  // Basic synchronous validation to fail fast for callers
  if (typeof cmd !== 'string' || cmd.trim() === '') {
    throw new TypeError('safeSpawn: `cmd` must be a non-empty string');
  }

  if (!Array.isArray(args) || !args.every((a) => typeof a === 'string')) {
    throw new TypeError('safeSpawn: `args` must be an array of strings');
  }

  return await new Promise<SafeSpawnResult>((resolve, reject) => {
    const env = opts?.env ? { ...process.env, ...opts.env } : undefined;

    const stdoutBuffers: Buffer[] = [];

    const stderrBuffers: Buffer[] = [];

    let child;

    try {
      // spawn without a shell to avoid shell interpretation of arguments
      child = spawn(cmd, args, {
        cwd: opts?.cwd,
        env,
        shell: false,
        stdio: ['ignore', 'pipe', 'pipe'],
      });
    } catch (err) {
      // Synchronous spawn errors (e.g., invalid arguments) should reject
      return reject(err);
    }

    if (child.stdout) {
      child.stdout.on('data', (chunk: Buffer | string) => {
        stdoutBuffers.push(Buffer.from(chunk));
      });
    }

    if (child.stderr) {
      child.stderr.on('data', (chunk: Buffer | string) => {
        stderrBuffers.push(Buffer.from(chunk));
      });
    }

    child.on('error', (err) => {
      // e.g., command not found
      reject(err);
    });

    child.on('close', (code, signal) => {
      const stdout = Buffer.concat(stdoutBuffers).toString('utf8');

      const stderr = Buffer.concat(stderrBuffers).toString('utf8');

      // If the process terminated due to a signal, code will be null. Map that
      // to a non-zero exit code to indicate failure (1) while preserving numeric type.
      const exitCode = typeof code === 'number' && Number.isInteger(code) ? code : 1;

      resolve({ stdout, stderr, code: exitCode });
    });
  });
}
