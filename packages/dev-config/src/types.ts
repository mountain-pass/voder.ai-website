/**
 * Shared type declarations for @voder/dev-config
 *
 * Keep this file small and focused on public-facing types used by the package exports.
 */

/**
 * Minimal component contract used by test utilities.
 * This is intentionally lightweight so consumer packages can implement it without extra peer types.
 */
export interface IComponent {
  /**
   * Mount the component into a given root element.
   * @param root - Element to mount into
   */
  mount(root: Element): void;

  /**
   * Optional update API used by test helpers to update props/state.
   * @param props - Arbitrary props object
   */
  update?(props: unknown): void;

  /**
   * Optional unmount hook to cleanup mounted component.
   */
  unmount?(): void;
}

/**
 * Build factory option shapes (minimal, extendable).
 */
export interface CreatePackageConfigOptions {
  packageName: string;
  [key: string]: unknown;
}

export interface CreateAppConfigOptions {
  appName: string;
  [key: string]: unknown;
}

/**
 * Generic representation for TypeScript preset objects exported under `typescript`.
 */
export type TsPreset = Record<string, unknown>;

/**
 * Generic Vitest configuration shape exposed by testing factories.
 */
export type VitestConfig = Record<string, unknown>;

export const __runtimeShim = true as const;
