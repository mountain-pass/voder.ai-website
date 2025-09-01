/**
 * Utility function to disable specific rules in a configuration object
 */
export function disableRules(
  config: Record<string, any>,
  rulesToDisable: string[],
): Record<string, any> {
  const result = { ...config };

  if (result.rules) {
    result.rules = { ...result.rules };
    for (const rule of rulesToDisable) {
      result.rules[rule] = false; // Use false for HTML linting rules
    }
  } else {
    result.rules = {};
    for (const rule of rulesToDisable) {
      result.rules[rule] = false;
    }
  }

  return result;
}
