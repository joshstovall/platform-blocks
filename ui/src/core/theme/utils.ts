import { PlatformBlocksTheme, PlatformBlocksThemeOverride } from './types';

/**
 * Deep merges a theme override with the default theme
 */
export function mergeTheme(
  defaultTheme: PlatformBlocksTheme,
  themeOverride?: PlatformBlocksThemeOverride
): PlatformBlocksTheme {
  if (!themeOverride) {
    return defaultTheme;
  }

  return deepMerge(defaultTheme, themeOverride);
}

/**
 * Helper function for deep merging objects
 */
function deepMerge(target: any, source: any): any {
  const result = { ...target };

  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      const sourceValue = source[key];
      const targetValue = result[key];

      if (isObject(sourceValue) && isObject(targetValue)) {
        result[key] = deepMerge(targetValue, sourceValue);
      } else {
        result[key] = sourceValue;
      }
    }
  }

  return result;
}

function isObject(item: any): item is Record<string, any> {
  return item && typeof item === 'object' && !Array.isArray(item);
}

/**
 * Creates a theme object with proper type checking
 */
export function createTheme(themeOverride: PlatformBlocksThemeOverride): PlatformBlocksThemeOverride {
  return themeOverride;
}
