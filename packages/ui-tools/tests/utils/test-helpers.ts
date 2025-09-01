/**
 * Test helper functions for package validation
 */
/**
 * Walk through package.json exports field and validate paths
 */
export function walkExports(exports: any): string[] {
  const paths: string[] = [];

  function walk(obj: any, key = ''): void {
    if (typeof obj === 'string') {
      paths.push(obj);
    } else if (typeof obj === 'object' && obj !== null) {
      for (const [k, v] of Object.entries(obj)) {
        walk(v, key ? `${key}.${k}` : k);
      }
    }
  }
  walk(exports);

  return paths;
}
