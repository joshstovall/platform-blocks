import { useState, useEffect } from 'react';
import { Platform } from 'react-native';

export type ColorScheme = 'light' | 'dark';

/**
 * Synchronously get the current color scheme to avoid flash
 * This runs before the first render to prevent light mode flash
 */
function getInitialColorScheme(): ColorScheme {
  if (Platform.OS === 'web') {
    // Check if we're in a browser environment
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
  } else {
    // For React Native, try to get the current scheme synchronously
    try {
      const { Appearance } = require('react-native');
      const currentScheme = Appearance.getColorScheme();
      return currentScheme || 'light';
    } catch (error) {
      // Appearance API not available, fall back to light mode
      console.warn('Appearance API not available');
    }
  }
  // Default to light mode
  return 'light';
}

/**
 * Hook that detects and responds to OS color scheme changes
 * Works on web and React Native
 */
export function useColorScheme(): ColorScheme {
  const [colorScheme, setColorScheme] = useState<ColorScheme>(getInitialColorScheme);

  useEffect(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

      const handleChange = (e: MediaQueryListEvent) => {
        setColorScheme(e.matches ? 'dark' : 'light');
      };

      // Listen for changes
      mediaQuery.addEventListener('change', handleChange);

      // Clean up
      return () => {
        mediaQuery.removeEventListener('change', handleChange);
      };
    }

    // For React Native, you would use Appearance API
    if (Platform.OS !== 'web') {
      try {
        const { Appearance } = require('react-native');

        const subscription = Appearance.addChangeListener(({ colorScheme: newColorScheme }: { colorScheme: ColorScheme | null }) => {
          setColorScheme(newColorScheme || 'light');
        });

        // Set initial value
        const currentScheme = Appearance.getColorScheme();
        if (currentScheme) {
          setColorScheme(currentScheme);
        }

        return () => subscription?.remove();
      } catch (error) {
        // Appearance API not available, fall back to light mode
        console.warn('Appearance API not available');
      }
    }
  }, []);

  return colorScheme;
}
