import React from 'react';
import { SizeValue, ColorValue, SpacingProps } from '../../core/theme/types';

export interface BaseComponentProps extends SpacingProps {
  /** Component test ID for testing */
  testID?: string;
  
  /** Additional CSS styles */
  style?: any;
}

export interface GaugeRange {
  /** Starting value for the range */
  from: number;
  /** Ending value for the range */
  to: number;
  /** Color for this range */
  color: string;
  /** Optional label for the range */
  label?: string;
}

export interface GaugeTicks {
  /** Number of major ticks */
  major?: number;
  /** Number of minor ticks */
  minor?: number;
  /** Custom major tick positions */
  majorPositions?: number[];
  /** Custom minor tick positions */
  minorPositions?: number[];
  /** Major tick length */
  majorLength?: number;
  /** Minor tick length */
  minorLength?: number;
  /** Tick color */
  color?: string;
  /** Tick width */
  width?: number;
}

export interface GaugeLabels {
  /** Whether to show labels */
  show?: boolean;
  /** Custom label positions */
  positions?: number[];
  /** Label formatter function */
  formatter?: (value: number) => string;
  /** Label color */
  color?: string;
  /** Label font size */
  fontSize?: number;
  /** Label offset from gauge edge */
  offset?: number;
}

export interface GaugeNeedle {
  /** Needle color */
  color?: string;
  /** Needle width/thickness */
  width?: number;
  /** Needle length (0-1, percentage of radius) */
  length?: number;
  /** Needle shape */
  shape?: 'line' | 'arrow' | 'triangle';
  /** Whether to show center dot */
  showCenter?: boolean;
  /** Center dot color */
  centerColor?: string;
  /** Center dot size */
  centerSize?: number;
}

export interface GaugeProps extends BaseComponentProps {
  /** Current value */
  value: number;
  /** Minimum value */
  min?: number;
  /** Maximum value */
  max?: number;
  
  /** Gauge size */
  size?: number | string;
  /** Track thickness */
  thickness?: number;
  
  /** Start angle in degrees (0° = top) */
  startAngle?: number;
  /** End angle in degrees */
  endAngle?: number;
  /** Rotation offset in degrees (rotates entire gauge) */
  rotationOffset?: number;
  
  /** Main gauge color */
  color?: ColorValue | string;
  /** Background track color */
  backgroundColor?: string;
  
  /** Color ranges */
  ranges?: GaugeRange[];
  
  /** Tick configuration */
  ticks?: GaugeTicks;
  
  /** Label configuration */
  labels?: GaugeLabels;
  
  /** Needle configuration */
  needle?: GaugeNeedle;
  
  /** Animation duration in ms */
  animationDuration?: number;
  /** Animation easing */
  animationEasing?: string;
  
  /** Whether the gauge is disabled */
  disabled?: boolean;
  
  /** Accessibility label */
  'aria-label'?: string;
  
  /** Children for compound component pattern */
  children?: React.ReactNode;
}

// Compound component props
export interface GaugeTrackProps extends BaseComponentProps {
  /** Track color */
  color?: string;
  /** Track thickness */
  thickness?: number;
  /** Track opacity */
  opacity?: number;
}

export interface GaugeRangeProps extends BaseComponentProps {
  /** Range start value */
  from: number;
  /** Range end value */
  to: number;
  /** Range color */
  color: string;
  /** Range thickness (inherits from parent if not specified) */
  thickness?: number;
  /** Range label */
  label?: string;
}

export interface GaugeTicksProps extends BaseComponentProps {
  /** Tick configuration */
  config?: GaugeTicks;
  /** Major tick count */
  major?: number;
  /** Minor tick count */
  minor?: number;
  /** Custom positions */
  positions?: number[];
  /** Tick length */
  length?: number;
  /** Tick color */
  color?: string;
  /** Tick width */
  width?: number;
  /** Tick type */
  type?: 'major' | 'minor';
}

export interface GaugeLabelsProps extends BaseComponentProps {
  /** Labels configuration */
  config?: GaugeLabels;
  /** Custom positions */
  positions?: number[];
  /** Label formatter */
  formatter?: (value: number) => string;
  /** Label color */
  color?: string;
  /** Font size */
  fontSize?: number;
  /** Offset from edge */
  offset?: number;
}

export interface GaugeNeedleProps extends BaseComponentProps {
  /** Needle value (angle will be calculated) */
  value?: number;
  /** Direct angle override */
  angle?: number;
  /** Needle configuration */
  config?: GaugeNeedle;
  /** Needle color */
  color?: string;
  /** Needle width */
  width?: number;
  /** Needle length */
  length?: number;
  /** Needle shape */
  shape?: 'line' | 'arrow' | 'triangle';
  /** Animation duration */
  animationDuration?: number;
}

export interface GaugeCenterProps extends BaseComponentProps {
  /** Center dot color */
  color?: string;
  /** Center dot size */
  size?: number;
  /** Whether to show center */
  show?: boolean;
  /** Custom center content */
  children?: React.ReactNode;
}

// Context for passing gauge configuration to compound components
export interface GaugeContextValue {
  value: number;
  min: number;
  max: number;
  size: number;
  thickness: number;
  startAngle: number; // Keep these as original angles
  endAngle: number;   // Keep these as original angles
  rotationOffset: number;
  center: { x: number; y: number };
  radius: number;
  innerRadius: number;
  disabled: boolean;
  animationDuration: number;
  animationEasing: string;
}

export interface GaugeStyleProps {
  size: number;
  disabled: boolean;
  thickness: number;
}
