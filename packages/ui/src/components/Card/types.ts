import React from 'react';
import type { PlatformBlocksTheme } from '../../core/theme';
import { SpacingProps, LayoutProps } from '../../core/utils';
import { BorderRadiusProps } from '../../core/theme/radius';
import { ShadowProps } from '../../core/theme/shadow';

export interface CardProps extends SpacingProps, LayoutProps, BorderRadiusProps, ShadowProps {
  children?: React.ReactNode; // children optional to reduce noisy TS errors during composition
  variant?: 'outline' | 'filled' | 'elevated' | 'subtle' | 'ghost' | 'gradient';
  padding?: number;
  style?: any;
  // Interactive props
  onPress?: () => void;
  disabled?: boolean;
  // Web-only events passthrough
  onContextMenu?: (e: any) => void;
}

export type { PlatformBlocksTheme };
