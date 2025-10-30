import { ReactNode } from 'react';
import { ViewProps } from 'react-native';

export interface TimelineItemProps extends Omit<ViewProps, 'children'> {
  /** Item content */
  children?: ReactNode;
  /** Item title */
  title?: string;
  /** Custom bullet content (icon, avatar, etc.) */
  bullet?: ReactNode;
  /** Line variant for this item */
  lineVariant?: 'solid' | 'dashed' | 'dotted';
  /** Item color (overrides timeline color) */
  color?: string;
  /** Item color variant token (e.g. primary.5 or primary) used if color not provided */
  colorVariant?: string;
  /** Whether this item is active */
  active?: boolean;
  /** Override timeline alignment for this specific item */
  itemAlign?: 'left' | 'right';
}

export interface TimelineProps extends Omit<ViewProps, 'children'> {
  /** Timeline items */
  children: ReactNode;
  /** Active item index - items before this will be highlighted */
  active?: number;
  /** Timeline color */
  color?: string;
  /** Timeline color variant token (e.g. primary.5) used when color not provided */
  colorVariant?: string;
  /** Line width */
  lineWidth?: number;
  /** Bullet size */
  bulletSize?: number;
  /** Alignment of timeline */
  align?: 'left' | 'right';
  /** Reverse active highlighting */
  reverseActive?: boolean;
  /** Component size */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Center mode renders a single central spine allowing items on both sides via itemAlign prop */
  centerMode?: boolean;
}

export interface TimelineContextValue {
  active?: number;
  color: string;
  lineWidth: number;
  bulletSize: number;
  align: 'left' | 'right';
  reverseActive: boolean;
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Whether layout is split with centered vertical line */
  centerMode?: boolean;
}
