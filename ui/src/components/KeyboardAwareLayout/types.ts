import type React from 'react';
import type { KeyboardAvoidingViewProps, ScrollView, ScrollViewProps, StyleProp, ViewStyle } from 'react-native';
import type { SpacingProps } from '../../core/utils';

export interface KeyboardAwareLayoutProps extends SpacingProps, Omit<KeyboardAvoidingViewProps, 'behavior' | 'children' | 'keyboardVerticalOffset'> {
  children: React.ReactNode;
  /** Optional behavior override for KeyboardAvoidingView */
  behavior?: KeyboardAvoidingViewProps['behavior'];
  /** Additional offset passed to KeyboardAvoidingView (defaults to 0) */
  keyboardVerticalOffset?: number;
  /** Enables or disables KeyboardAvoidingView adjustments */
  enabled?: boolean;
  /** When true (default) content is wrapped in a ScrollView */
  scrollable?: boolean;
  /** Extra padding added in addition to keyboard height */
  extraScrollHeight?: number;
  /** Style applied to the outer KeyboardAvoidingView */
  style?: StyleProp<ViewStyle>;
  /** Style applied to the ScrollView/inner content container */
  contentContainerStyle?: StyleProp<ViewStyle>;
  /** Controls ScrollView keyboard tap handling */
  keyboardShouldPersistTaps?: 'always' | 'never' | 'handled';
  /** Forward ref to the internal ScrollView when scrollable is true */
  scrollRef?: React.Ref<ScrollView>;
  /** Additional props that will be spread onto the internal ScrollView */
  scrollViewProps?: ScrollViewProps;
}
