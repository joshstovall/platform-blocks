import React from 'react';
import { View, StyleSheet } from 'react-native';

import type { ScreenProps } from './types';

export interface ScreenComponentProps extends ScreenProps {
  children?: React.ReactNode;
}

export function Screen({ component: Component, name, options, initialParams, children }: ScreenComponentProps) {
  // This is mainly used for type definition and structure
  // The actual rendering is handled by navigator components
  return (
    <View style={styles.screen}>
      {Component ? <Component /> : children}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1
  }
});
