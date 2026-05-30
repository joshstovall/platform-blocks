import React from 'react';
import { Platform } from 'react-native';
import { useTheme } from '../../core/theme/ThemeProvider';
import { resolveOptionalModule } from '../../utils/optionalModule';
import type { StatusBarConfig } from './types';

const StatusBar = resolveOptionalModule<any>('expo-status-bar', {
  accessor: module => module.StatusBar,
  devWarning: 'expo-status-bar not found, status bar will not render',
});

const NavigationBar = resolveOptionalModule<any>('expo-navigation-bar', {
  devWarning: 'expo-navigation-bar not found, navigation bar will not be styled',
});

interface StatusBarManagerProps extends StatusBarConfig {
  children?: React.ReactNode;
}

export const StatusBarManager: React.FC<StatusBarManagerProps> = ({
  style: statusBarStyle,
  backgroundColor,
  translucent = true,
  hidden = false,
  children
}) => {
  const theme = useTheme();

  // Auto-determine status bar style based on theme if not specified
  const resolvedStyle = statusBarStyle || (theme.colorScheme === 'dark' ? 'light' : 'dark');
  
  // Auto-determine background color based on theme if not specified
  const resolvedBackgroundColor = backgroundColor || (
    Platform.OS === 'android' ? theme.backgrounds.base : 'transparent'
  );

  React.useEffect(() => {
    if (Platform.OS !== 'android' || !NavigationBar) {
      return;
    }

    // expo-navigation-bar (SDK 56+, Android edge-to-edge) replaced the async
    // setButtonStyleAsync/setBackgroundColorAsync APIs with a synchronous setStyle.
    // Feature-detect so this works across expo-navigation-bar versions.
    const buttonStyle = resolvedStyle === 'light' ? 'light' : 'dark';
    const setStyle = NavigationBar.NavigationBar?.setStyle ?? NavigationBar.setStyle;
    try {
      if (typeof setStyle === 'function') {
        setStyle(buttonStyle);
      } else if (typeof NavigationBar.setButtonStyleAsync === 'function') {
        NavigationBar.setButtonStyleAsync(buttonStyle).catch(() => {
          /* noop */
        });
      }

      // Background color is only settable on legacy (pre-edge-to-edge) versions.
      if (typeof NavigationBar.setBackgroundColorAsync === 'function') {
        NavigationBar.setBackgroundColorAsync(resolvedBackgroundColor).catch(() => {
          /* noop */
        });
      }
    } catch {
      /* noop */
    }
  }, [resolvedBackgroundColor, resolvedStyle]);

  return (
    <>
      {StatusBar && Platform.OS !== 'web' && (
        <StatusBar
          style={resolvedStyle}
          backgroundColor={resolvedBackgroundColor}
          translucent={translucent}
          hidden={hidden}
        />
      )}
      {children}
    </>
  );
};
