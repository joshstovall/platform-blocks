import React from 'react';
import { ViewStyle, StyleProp } from 'react-native';
import { BaseInputProps } from '../Input/types';
import { ColorValue, SizeValue, PlatformBlocksTheme } from '../../core/theme/types';

export type SliderColorScheme = keyof PlatformBlocksTheme['colors'] | (string & {});

export interface SliderTick {
  /** Tick value */
  value: number;
  /** Optional label for the tick */
  label?: string;
  /** Optional style for the tick */
  style?: any;
}

export interface SliderProps extends Omit<BaseInputProps, 'value' | 'onChangeText' | 'label'> {
  /** Slider value */
  value?: number;
  /** Uncontrolled initial value */
  defaultValue?: number;

  /** Change handler */
  onChange?: (value: number) => void;

  /** Minimum value */
  min?: number;

  /** Maximum value */
  max?: number;

  /** Step increment */
  step?: number;

  /** Slider orientation */
  orientation?: 'horizontal' | 'vertical';

  /** Track color */
  trackColor?: ColorValue;

  /** Active track color */
  activeTrackColor?: ColorValue;

  /** Thumb color */
  thumbColor?: ColorValue;

  /** Track height/width */
  trackSize?: number;

  /** Thumb size */
  thumbSize?: number;

  /** Theme color palette or custom color to drive active elements */
  colorScheme?: SliderColorScheme;

  /** Additional styling for the inactive track */
  trackStyle?: StyleProp<ViewStyle>;

  /** Additional styling for the active track */
  activeTrackStyle?: StyleProp<ViewStyle>;

  /** Additional styling for the thumb */
  thumbStyle?: StyleProp<ViewStyle>;

  /** Override inactive tick color */
  tickColor?: ColorValue;

  /** Override active tick color */
  activeTickColor?: ColorValue;

  /** Input label (above the slider) */
  label?: React.ReactNode;

  /** Value label formatter function, set to null to disable value label */
  valueLabel?: ((value: number) => string) | null;

  /** If true, value label will always be displayed */
  valueLabelAlwaysOn?: boolean;

  /** Value label position */
  valueLabelPosition?: 'top' | 'bottom' | 'left' | 'right';

  /** Show min/max labels */
  showMarks?: boolean;

  /** Custom ticks/marks to display on the slider */
  ticks?: SliderTick[];

  /** Slider container size (width for horizontal, height for vertical) */
  containerSize?: number;

  /** Whether to show automatic tick marks based on step */
  showTicks?: boolean;

  /** Restrict value changes to only tick positions */
  restrictToTicks?: boolean;

  /** Inverted slider (right-to-left or top-to-bottom) */
  inverted?: boolean;

  /** Precision for value display */
  precision?: number;

  /** Tooltip visibility */
  tooltip?: 'always' | 'hover' | 'never';

  /** Make slider stretch to fill parent width/height */
  fullWidth?: boolean;
}

export interface RangeSliderProps extends Omit<SliderProps, 'value' | 'onChange' | 'valueLabel' | 'defaultValue'> {
  /** Range value [min, max] */
  value?: [number, number];
  /** Uncontrolled initial range value */
  defaultValue?: [number, number];

  /** Change handler */
  onChange?: (value: [number, number]) => void;

  /** Value label formatter function for range values */
  valueLabel?: ((value: number, index: number) => string) | null;

  /** Minimum distance between thumbs */
  minRange?: number;

  /** Allow thumbs to cross */
  allowCross?: boolean;

  /** Whether thumbs should push each other when they overlap (default: true) */
  pushOnOverlap?: boolean;

  /** Labels for range values */
  rangeLabels?: [string, string];
}

export interface SliderStyleProps {
  error?: boolean;
  disabled?: boolean;
  focused?: boolean;
  size: SizeValue;
  orientation: 'horizontal' | 'vertical';
  containerSize: number;
  trackSize: number;
  thumbSize: number;
}


// Shared UI components with orientation support
export interface SliderTrackProps {
  disabled: boolean;
  theme: any;
  size: 'sm' | 'md' | 'lg';
  orientation: 'horizontal' | 'vertical';
  activeWidth?: number;
  activeLeft?: number;
  isRange?: boolean;
  trackColor?: ColorValue;
  activeTrackColor?: ColorValue;
  trackStyle?: StyleProp<ViewStyle>;
  activeTrackStyle?: StyleProp<ViewStyle>;
  trackHeight?: number;
  thumbSize?: number;
}

export interface SliderTicksProps {
  ticks: Array<{ value: number; position: number; isActive: boolean; label?: string }>;
  disabled: boolean;
  theme: any;
  size: 'sm' | 'md' | 'lg';
  orientation: 'horizontal' | 'vertical';
  keyPrefix?: string;
  trackHeight?: number;
  thumbSize?: number;
  activeTickColor?: ColorValue;
  tickColor?: ColorValue;
}

export interface SliderThumbProps {
  position: number;
  disabled: boolean;
  theme: any;
  size: 'sm' | 'md' | 'lg';
  orientation: 'horizontal' | 'vertical';
  isDragging: boolean;
  zIndex?: number;
  panHandlers?: any;
  thumbColor?: ColorValue;
  thumbStyle?: StyleProp<ViewStyle>;
  thumbSize?: number;
}

export interface SliderLabelProps {
  label: React.ReactNode;
}

export interface SliderValueLabelProps {
  value: string | number;
  position: number;
  size: 'sm' | 'md' | 'lg';
  orientation: 'horizontal' | 'vertical';
  isCard?: boolean;
  thumbSize?: number;
}
