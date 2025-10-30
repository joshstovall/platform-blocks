// Central type exports & helper discriminated unions for Accordion.
// Keeping this separate reduces import cycles and allows future generator tooling
// to introspect prop surfaces without parsing component implementation details.

import type { ReactNode } from 'react';
import type { ViewStyle, TextStyle } from 'react-native';
import type { SizeValue } from '../../core/theme/sizes';
import type { BorderRadiusProps } from '../../core/theme/radius';
import type { PlatformBlocksTheme } from '../../core/theme/types';
import type { SpacingProps } from '../../core/utils';

/**
 * Single logical panel within an `Accordion`.
 * Provide a stable, unique `key` for correct persistence and state reconciliation.
 */
export interface AccordionItem {
  /**
   * Unique identifier for the item. Must be stable across renders.
   */
  key: string;
  /**
   * Header label rendered in the item trigger row.
   */
  title: string;
  /**
   * Collapsible body content shown when the item is expanded.
   */
  content: ReactNode;
  /**
   * Disables user interaction and visually indicates the item is inactive.
   */
  disabled?: boolean;
  /**
   * Optional decorative or status icon rendered alongside the title.
   */
  icon?: ReactNode;
}

export type AccordionType = 'single' | 'multiple';
export type AccordionVariant = 'default' | 'separated' | 'bordered';
export type AccordionColor = 'primary' | 'secondary' | 'gray';

/**
 * Props for the `Accordion` component.
 * Supports controlled & uncontrolled usage patterns, single or multi expansion modes,
 * density & variant styling, and optional persistence between remounts.
 */
export interface AccordionProps extends SpacingProps, BorderRadiusProps {
  /**
   * Ordered list of items to render. The `key` for each item must be unique.
   */
  items: AccordionItem[];
  /**
   * Expansion behavior.
   * 'single' ensures only one item can be expanded at a time; 'multiple' allows independent expansion.
   * @default 'single'
   */
  type?: AccordionType;
  /**
   * Initial expanded item keys (uncontrolled). Ignored when `expanded` is provided.
   * For `type="single"` only the first key is used at initialization.
   * @default []
   */
  defaultExpanded?: string[];
  /**
   * Controlled set of expanded item keys. Provide alongside `onExpandedChange`.
   */
  expanded?: string[];
  /**
   * Called when the expanded keys change (both controlled & uncontrolled flows).
   */
  onExpandedChange?: (expanded: string[]) => void;
  /**
   * Per-item toggle event with rich metadata. Fires after state resolution.
   */
  onItemToggle?: OnAccordionToggle;
  /**
   * Visual variant style preset.
   * @default 'default'
   */
  variant?: AccordionVariant;
  /**
   * Size scale controlling paddings, font sizes, and icon dimensions.
   * @default 'md'
   */
  size?: SizeValue;
  /**
   * Color theme accent applied to active headers & focus states.
   * @default 'primary'
   */
  color?: AccordionColor;
  /**
   * Whether to render the chevron affordance.
   * @default true
   */
  showChevron?: boolean;
  /**
   * Chevron placement relative to the header text.
   * @default 'end'
   */
  chevronPosition?: 'start' | 'end';
  /**
   * Space efficiency / vertical density preset.
   * @default 'comfortable'
   */
  density?: 'comfortable' | 'compact' | 'spacious';
  /**
   * Root container style override.
   */
  style?: ViewStyle;
  /**
   * Header row style override applied to each item.
   */
  headerStyle?: ViewStyle;
  /**
   * Collapsible content container style override.
   */
  contentStyle?: ViewStyle;
  /**
   * Text style applied to the header label.
   */
  headerTextStyle?: TextStyle;
  /**
   * Explicit persistence key. If omitted, an automatic hash key will be generated when uncontrolled.
   */
  persistKey?: string;
  /**
   * Enables persistence of expanded state (uncontrolled only) across remounts in-process.
   * @default true
   */
  autoPersist?: boolean;
  /**
   * Enables animation or accepts a config object for custom durations & easing.
   * @default true
   */
  animated?: AccordionAnimationProp;
}

// Internal styling contract (not exported from barrel by default)
/**
 * Internal computed style contract resolved from theme + props.
 * Not part of the public API surface intentionally (subject to change).
 */
export interface AccordionComputedStyles {
  container: ViewStyle;
  item: ViewStyle;
  header: ViewStyle;
  content: ViewStyle;
  headerText: TextStyle;
  activeHeaderText: TextStyle;
  disabledHeaderText: TextStyle;
  chevron: ViewStyle;
}

export type AccordionStyleResolver = (
  theme: PlatformBlocksTheme,
  variant: AccordionVariant | undefined,
  size: SizeValue | undefined,
  color: AccordionColor | undefined,
  radiusStyles?: any
) => AccordionComputedStyles;

// Event detail for future onItemToggle callback (non-breaking placeholder)
/**
 * Detail object supplied to `onItemToggle` describing the transition and new state.
 */
export interface AccordionToggleDetail {
  itemKey: string;
  expanded: boolean;
  expandedKeys: string[];
  type: AccordionType;
  variant: AccordionVariant | undefined;
}

// Potential future public callback signature (reserved)
/**
 * Callback signature fired after an item toggles.
 */
export type OnAccordionToggle = (detail: AccordionToggleDetail) => void;

// Animation prop
/**
 * Controls animation behavior. `true` uses defaults; `false` disables transitions.
 * Provide an object to customize timing.
 */
export type AccordionAnimationProp = boolean | { duration?: number; easing?: (t: number) => number };

// Ref methods
/**
 * Imperative methods exposed via `ref` when using `forwardRef`.
 */
export interface AccordionRef {
  /** Expand all non-disabled items (multi mode) or ensure one item open (single). */
  expandAll: () => void;
  /** Collapse every expanded item. */
  collapseAll: () => void;
  /** Toggle a specific item by key. */
  toggle: (key: string) => void;
  /** Current expanded keys snapshot. */
  getExpanded: () => string[];
}

