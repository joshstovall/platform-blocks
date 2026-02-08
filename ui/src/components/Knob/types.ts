import type { FC, ReactNode } from 'react';
import type { TextStyle, ViewStyle, StyleProp } from 'react-native';
import type { SpacingProps, LayoutProps } from '../../core/utils';

export interface KnobMark {
  /** Absolute value within the knob range to display */
  value: number;
  /** Optional label rendered near the tick */
  label?: ReactNode;
  /** Optional accent color applied when the mark becomes active */
  accentColor?: string;
  /** Optional icon surfaced by status-oriented variants */
  icon?: ReactNode;
}

export type KnobVariant = 'level' | 'stepped' | 'endless' | 'dual' | 'status';

export type KnobValueLabelPosition = 'center' | 'top' | 'bottom' | 'left' | 'right';

export interface KnobValueLabelConfig {
  /** Placement relative to the knob surface */
  position?: KnobValueLabelPosition;
  /** Primary formatter for the displayed value */
  formatter?: (value: number) => ReactNode;
  /** Optional prefix rendered before the value */
  prefix?: ReactNode;
  /** Optional suffix rendered after the value */
  suffix?: ReactNode;
  /** Style overrides for the wrapper */
  containerStyle?: StyleProp<ViewStyle>;
  /** Style overrides for the primary text */
  textStyle?: StyleProp<TextStyle>;
  /** Secondary readout rendered at an independent slot */
  secondary?: {
    formatter?: (value: number) => ReactNode;
    position?: KnobValueLabelPosition;
    prefix?: ReactNode;
    suffix?: ReactNode;
    containerStyle?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
  };
}

export type KnobInteractionMode = 'spin' | 'vertical-slide' | 'horizontal-slide' | 'scroll';

export interface KnobInteractionConfig {
  /** Enabled gesture modalities */
  modes?: KnobInteractionMode[];
  /** Distance in pixels before committing to a gesture */
  lockThresholdPx?: number;
  /** Allowable perpendicular wiggle while detecting slides */
  variancePx?: number;
  /** Required dominance ratio (primary axis vs secondary) before locking into slide */
  slideDominanceRatio?: number;
  /** Pixels of movement required for one degree of rotation */
  slideRatio?: number;
  /** Minimum pixel delta before slides update, filters jitter */
  slideHysteresisPx?: number;
  /** Prevent spin gestures from wrapping past min/max in bounded mode */
  spinStopAtLimits?: boolean;
  /** Ignore tiny spin deltas (degrees) to avoid jitter */
  spinDeadZoneDegrees?: number;
  /** Radius at which spin drags increase precision */
  spinPrecisionRadius?: number;
  /** Whether to mirror GarageBand-style sidedness rules */
  respectStartSide?: boolean;
  /** Mouse/trackpad scroll behavior */
  scroll?: {
    enabled?: boolean;
    ratio?: number;
    invert?: boolean;
    preventPageScroll?: boolean;
  };
  /** Gesture change callback */
  onModeChange?: (mode: KnobInteractionMode | null) => void;
}

export interface KnobRingShadow {
  color?: string;
  offsetX?: number;
  offsetY?: number;
  blur?: number;
  opacity?: number;
}

export interface KnobRingStyle {
  thickness?: number;
  color?: string;
  trailColor?: string;
  backgroundColor?: string;
  cap?: 'butt' | 'round';
  radiusOffset?: number;
  shadow?: KnobRingShadow;
}

export interface KnobFillStyle {
  color?: string;
  borderWidth?: number;
  borderColor?: string;
  radiusOffset?: number;
}

export type KnobThumbShape = 'circle' | 'pill' | 'square';

export interface KnobThumbGlow {
  color?: string;
  blur?: number;
  intensity?: number;
}

export interface KnobThumbRenderContext {
  value: number;
  angle: number;
  size: number;
}

export interface KnobThumbStyle {
  size?: number;
  shape?: KnobThumbShape;
  color?: string;
  strokeWidth?: number;
  strokeColor?: string;
  offset?: number;
  glow?: KnobThumbGlow;
  style?: StyleProp<ViewStyle>;
  renderThumb?: (context: KnobThumbRenderContext) => ReactNode;
}

export type KnobTickSource = 'marks' | 'steps' | 'values';
export type KnobTickShape = 'dot' | 'line' | 'icon' | 'custom';

export interface KnobTickLabelConfig {
  show?: boolean;
  formatter?: (mark: KnobMark, index: number) => ReactNode;
  position?: 'inner' | 'center' | 'outer';
  offset?: number;
  style?: StyleProp<TextStyle>;
}

export interface KnobTickLayer {
  source?: KnobTickSource;
  values?: number[];
  shape?: KnobTickShape;
  length?: number;
  width?: number;
  radiusOffset?: number;
  position?: 'inner' | 'center' | 'outer';
  color?: string;
  inactiveColor?: string;
  iconName?: string;
  label?: KnobTickLabelConfig;
  renderTick?: (context: {
    value: number;
    angle: number;
    index: number;
    isActive: boolean;
    center: { x: number; y: number };
    radius: number;
  }) => ReactNode;
}

export interface KnobPointerStyle {
  visible?: boolean;
  length?: number;
  width?: number;
  offset?: number;
  color?: string;
  cap?: 'round' | 'butt';
  counterweight?: { size?: number; color?: string };
}

export interface KnobArcConfig {
  startAngle?: number;
  sweepAngle?: number;
  direction?: 'cw' | 'ccw';
  clampInput?: boolean;
  wrap?: boolean;
}

export type KnobProgressMode = 'none' | 'contiguous' | 'split';

export interface KnobProgressConfig {
  mode?: KnobProgressMode;
  color?: string;
  trailColor?: string;
  roundedCaps?: boolean;
  thickness?: number;
}

export interface KnobPanningConfig {
  pivotValue?: number;
  positiveColor?: string;
  negativeColor?: string;
  showZeroIndicator?: boolean;
  valueFormatter?: (value: number) => string | ReactNode;
  mirrorThumbOffset?: boolean;
}

export interface KnobAppearance {
  ring?: KnobRingStyle;
  fill?: KnobFillStyle;
  thumb?: KnobThumbStyle | false;
  ticks?: KnobTickLayer | KnobTickLayer[] | false;
  pointer?: KnobPointerStyle | false;
  arc?: KnobArcConfig;
  progress?: KnobProgressConfig | false;
  panning?: KnobPanningConfig;
  interaction?: KnobInteractionConfig;
}

export interface KnobProps extends SpacingProps, LayoutProps {
  /** Visual preset that tunes defaults for common encoder scenarios */
  variant?: KnobVariant;
  /** Interaction mode for bounded or endless rotary behavior */
  mode?: 'bounded' | 'endless';
  /** Controlled value */
  value?: number;
  /** Uncontrolled initial value */
  defaultValue?: number;
  /** Minimum selectable value */
  min?: number;
  /** Maximum selectable value */
  max?: number;
  /** Step increment applied when interacting */
  step?: number;
  /** Called on every value change */
  onChange?: (value: number) => void;
  /** Called after interaction completes */
  onChangeEnd?: (value: number) => void;
  /** Fired when the user begins dragging */
  onScrubStart?: () => void;
  /** Fired when the user ends dragging */
  onScrubEnd?: () => void;
  /** Diameter of the control in pixels */
  size?: number;
  /** Diameter of the thumb indicator */
  thumbSize?: number;
  /** Disable all user interaction */
  disabled?: boolean;
  /** Prevent interaction but keep visual state */
  readOnly?: boolean;
  /** Custom formatter for the value label */
  formatLabel?: (value: number) => ReactNode;
  /** Render the value label inside the knob */
  withLabel?: boolean;
  /** Structured configuration for the value label block */
  valueLabel?: KnobValueLabelConfig | false;
  /** Optional marks rendered around the control */
  marks?: KnobMark[];
  /** Restrict interaction to the supplied marks */
  restrictToMarks?: boolean;
  /** Optional visual label rendered outside the knob */
  label?: ReactNode;
  /** Optional helper text rendered with the label */
  description?: ReactNode;
  /** Placement for the external label */
  labelPosition?: 'left' | 'right' | 'top' | 'bottom';
  /** Style overrides for the outer container */
  style?: StyleProp<ViewStyle>;
  /** Style overrides for the circular track */
  trackStyle?: StyleProp<ViewStyle>;
  /** Style overrides for the thumb */
  thumbStyle?: StyleProp<ViewStyle>;
  /** Style overrides for mark labels */
  markLabelStyle?: StyleProp<TextStyle>;
  /** Accessibility identifier */
  testID?: string;
  /** Screen reader label */
  accessibilityLabel?: string;
  /** Unified surface styling and interaction overrides */
  appearance?: KnobAppearance;
}

export interface KnobRootProps extends KnobProps {
  /** Modular children composed of Knob.* sub-components */
  children?: ReactNode;
}

export interface KnobFillPartProps extends KnobFillStyle {
  visible?: boolean;
}

export interface KnobRingPartProps extends KnobRingStyle {
  visible?: boolean;
}

export interface KnobProgressPartProps extends KnobProgressConfig {
  visible?: boolean;
}

export type KnobTickLayerPartProps = KnobTickLayer;

export interface KnobPointerPartProps extends KnobPointerStyle {
  enabled?: boolean;
}

export interface KnobThumbPartProps extends KnobThumbStyle {
  visible?: boolean;
}

export interface KnobValueLabelPartProps extends KnobValueLabelConfig {
  visible?: boolean;
}

export type KnobPartKind =
  | 'fill'
  | 'ring'
  | 'progress'
  | 'tick'
  | 'pointer'
  | 'thumb'
  | 'valueLabel';

export type KnobPartEntry =
  | { kind: 'fill'; props: KnobFillPartProps; order: number }
  | { kind: 'ring'; props: KnobRingPartProps; order: number }
  | { kind: 'progress'; props: KnobProgressPartProps; order: number }
  | { kind: 'tick'; props: KnobTickLayerPartProps; order: number }
  | { kind: 'pointer'; props: KnobPointerPartProps; order: number }
  | { kind: 'thumb'; props: KnobThumbPartProps; order: number }
  | { kind: 'valueLabel'; props: KnobValueLabelPartProps; order: number };

export type KnobPartComponent<P> = FC<P> & {
  __knobPartKind: KnobPartKind;
};
