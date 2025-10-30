import React from 'react';
import { ViewStyle } from 'react-native';
import type { SpacingProps } from '../../core/utils/spacing';

export interface ContainerProps extends SpacingProps {
  children: React.ReactNode;
  style?: ViewStyle;
  /** Makes container take full available height (flex: 1) */
  fluid?: boolean;
  backgroundImage?: {
    uri: string;
    opacity?: number;
    overlay?: {
      color?: string;
      opacity?: number;
    };
    gradient?: {
      colors: string[];
      locations?: number[];
      start?: { x: number; y: number };
      end?: { x: number; y: number };
    };
  };
  padding?: number;
  margin?: number;
}
