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

    NavigationBar.setBackgroundColorAsync(resolvedBackgroundColor).catch(() => {
      /* noop */
    });

    NavigationBar.setButtonStyleAsync(resolvedStyle === 'light' ? 'light' : 'dark').catch(() => {
      /* noop */
    });
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
