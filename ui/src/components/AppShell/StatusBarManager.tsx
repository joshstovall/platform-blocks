import React from 'react';
import { Platform } from 'react-native';
import { useTheme } from '../../core/theme/ThemeProvider';
import type { StatusBarConfig } from './types';

// Optional import of StatusBar with fallback
let StatusBar: any = null;
try {
  StatusBar = require('expo-status-bar').StatusBar;
} catch (e) {
  // expo-status-bar not available, will use fallback or nothing
}

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
