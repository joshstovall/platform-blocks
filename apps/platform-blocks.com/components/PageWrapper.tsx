import React from 'react';
import { Platform, ScrollView, ViewStyle } from 'react-native';
import { useTheme } from '@platform-blocks/ui';

interface PageWrapperProps {
  children: React.ReactNode;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
}

export function PageWrapper({ 
  children, 
  style, 
  contentContainerStyle, 
}: PageWrapperProps) {
  const theme = useTheme();
  return (
    <ScrollView 
      style={[{ flex: 1, backgroundColor: theme.backgrounds.base }, style]} 
      contentContainerStyle={[{ padding: 0 }, contentContainerStyle, {
      padding: Platform.OS === 'web' ? 24 : 0,
      minHeight: '100%',
      backgroundColor: theme.backgrounds.base
      }]}
    >
      {children}
    </ScrollView>
  );
}
