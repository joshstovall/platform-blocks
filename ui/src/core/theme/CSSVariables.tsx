import { useEffect } from 'react';

import { useTheme } from './ThemeProvider';
import { PlatformBlocksTheme } from './types';

interface CSSVariablesProps {
  /** CSS selector where variables should be applied */
  selector?: string;
}

/**
 * Component that injects CSS variables based on the current theme
 */
export function CSSVariables({ selector = ':root' }: CSSVariablesProps) {
  const theme = useTheme();

  useEffect(() => {
    const cssVariables = generateCSSVariables(theme);
    injectCSSVariables(cssVariables, selector);
  }, [theme, selector]);

  return null;
}

/**
 * Generates CSS variables from theme object
 */
function generateCSSVariables(theme: PlatformBlocksTheme): Record<string, string> {
  const variables: Record<string, string> = {};

  // Color scheme
  variables['--platform-blocks-color-scheme'] = theme.colorScheme;

  // Primary color
  variables['--platform-blocks-primary-color'] = theme.primaryColor;

  // Colors
  Object.entries(theme.colors).forEach(([name, shades]) => {
    shades.forEach((shade, index) => {
      variables[`--platform-blocks-color-${name}-${index}`] = shade;
    });
  });

  // Font family
  variables['--platform-blocks-font-family'] = theme.fontFamily;

  // Backgrounds / surfaces
  variables['--platform-blocks-bg-base'] = theme.backgrounds.base;
  variables['--platform-blocks-bg-subtle'] = theme.backgrounds.subtle;
  variables['--platform-blocks-bg-surface'] = theme.backgrounds.surface;
  variables['--platform-blocks-bg-elevated'] = theme.backgrounds.elevated;
  variables['--platform-blocks-border-color'] = theme.backgrounds.border;
  
  // State colors
  if (theme.states?.focusRing) {
    variables['--platform-blocks-focus-ring'] = theme.states.focusRing;
  }
  if (theme.states?.textSelection) {
    variables['--platform-blocks-text-selection'] = theme.states.textSelection;
  }
  if (theme.states?.highlightText) {
    variables['--platform-blocks-highlight-text'] = theme.states.highlightText;
  }
  if (theme.states?.highlightBackground) {
    variables['--platform-blocks-highlight-background'] = theme.states.highlightBackground;
  }

  // Font sizes
  Object.entries(theme.fontSizes).forEach(([size, value]) => {
    variables[`--platform-blocks-font-size-${size}`] = value;
  });

  // Spacing
  Object.entries(theme.spacing).forEach(([size, value]) => {
    variables[`--platform-blocks-spacing-${size}`] = value;
  });

  // Radii
  Object.entries(theme.radii).forEach(([size, value]) => {
    variables[`--platform-blocks-radius-${size}`] = value;
  });

  // Shadows
  Object.entries(theme.shadows).forEach(([size, value]) => {
    variables[`--platform-blocks-shadow-${size}`] = value;
  });

  // Breakpoints
  Object.entries(theme.breakpoints).forEach(([size, value]) => {
    variables[`--platform-blocks-breakpoint-${size}`] = value;
  });

  return variables;
}

/**
 * Injects CSS variables into the document
 */
function injectCSSVariables(variables: Record<string, string>, selector: string) {
  if (typeof document === 'undefined') {
    return; // SSR safety
  }

  const existingStyle = document.querySelector('[data-platform-blocks-variables]');
  if (existingStyle) {
    existingStyle.remove();
  }

  const cssRules = Object.entries(variables)
    .map(([property, value]) => `  ${property}: ${value};`)
    .join('\n');

  // Add text selection styles
  const selectionCSS = variables['--platform-blocks-text-selection'] 
    ? `\n\n::selection {\n  background-color: ${variables['--platform-blocks-text-selection']};\n}\n\n::-moz-selection {\n  background-color: ${variables['--platform-blocks-text-selection']};\n}` 
    : '';

  const cssText = `${selector} {\n${cssRules}\n}${selectionCSS}`;

  const style = document.createElement('style');
  style.setAttribute('data-platform-blocks-variables', 'true');
  style.textContent = cssText;

  document.head.appendChild(style);

  // Apply body background automatically if selector is :root or body
  if (typeof document !== 'undefined') {
    const target = document.body;
    if (target) {
      target.style.backgroundColor = variables['--platform-blocks-bg-base'];
      target.style.color = variables['--platform-blocks-color-scheme'] === 'dark' ? '#F2F2F7' : '#1C1C1E';
    }
  }
}
