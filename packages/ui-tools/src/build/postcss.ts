/**
 * PostCSS configuration factory for @voder/ui-tools
 *
 * Provides a sensible default PostCSS config with Autoprefixer and
 * allows consumers to supply additional plugins or override browser targets.
 */
import autoprefixer from 'autoprefixer';

export interface PostCSSConfigOptions {
  /** Browser targets for autoprefixer */
  browsers?: string[];
  /** Additional PostCSS plugins */
  plugins?: any[];
}

/**
 * Create a PostCSS configuration object suitable for Vite's `css.postcss` option.
 *
 * Defaults:
 *  - browsers: ['last 2 versions', '> 1%', 'not dead']
 *  - plugins: []
 *
 * Consumers may pass additional PostCSS plugins via the `plugins` option.
 *
 * @param options Optional overrides for browsers and plugins
 * @returns PostCSS configuration object with a `plugins` array
 */
export function createPostCSSConfig(options: PostCSSConfigOptions = {}) {
    const { browsers = ['last 2 versions', '> 1%', 'not dead'], plugins = [] } = options;

    return {
        plugins: [
            autoprefixer({ overrideBrowserslist: browsers }),
            ...plugins
        ]
    };
}
