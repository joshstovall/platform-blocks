import React, { forwardRef, useMemo } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import type { KeyboardAvoidingViewProps, ScrollViewProps, StyleProp, ViewStyle } from 'react-native';

import { extractSpacingProps, getSpacingStyles } from '../../core/utils';
import type { SpacingProps } from '../../core/utils';
import { useKeyboardManagerOptional } from '../../core/providers/KeyboardManagerProvider';
import type { KeyboardAwareLayoutProps } from './types';

const DEFAULT_EXTRA_SCROLL_HEIGHT = 24;

export const KeyboardAwareLayout = forwardRef<KeyboardAvoidingView, KeyboardAwareLayoutProps>((props, ref) => {
  const {
    children,
    behavior,
    keyboardVerticalOffset = 0,
    enabled = true,
    scrollable = true,
    extraScrollHeight = DEFAULT_EXTRA_SCROLL_HEIGHT,
    style,
    contentContainerStyle,
    keyboardShouldPersistTaps = 'handled',
    scrollRef,
    scrollViewProps,
    ...rest
  } = props;

  const { spacingProps, otherProps } = extractSpacingProps(rest as SpacingProps & KeyboardAvoidingViewProps);
  const spacingStyles = getSpacingStyles(spacingProps);

  const keyboard = useKeyboardManagerOptional();

  const isKeyboardVisible = keyboard?.isKeyboardVisible ?? false;
  const keyboardHeight = keyboard?.keyboardHeight ?? 0;

  const { contentContainerStyle: scrollContentStyle, ...restScrollViewProps } = scrollViewProps ?? {};

  const resolvedBehavior: KeyboardAvoidingViewProps['behavior'] = behavior
    ?? (Platform.OS === 'ios' ? 'padding' : 'height');

  const bottomPadding = useMemo(() => {
    if (!enabled) {
      return extraScrollHeight;
    }

    if (!isKeyboardVisible) {
      return extraScrollHeight;
    }

    return keyboardHeight + extraScrollHeight;
  }, [enabled, extraScrollHeight, isKeyboardVisible, keyboardHeight]);

  const contentStyles = useMemo<StyleProp<ViewStyle>>(() => {
    const stylesArray: Array<StyleProp<ViewStyle>> = [styles.content];
    const mergedContentStyles: Array<StyleProp<ViewStyle>> = [...stylesArray];
    if (contentContainerStyle) {
      mergedContentStyles.push(contentContainerStyle);
    }
    if (scrollContentStyle) {
      mergedContentStyles.push(scrollContentStyle as StyleProp<ViewStyle>);
    }
    if (bottomPadding > 0) {
      mergedContentStyles.push({ paddingBottom: bottomPadding });
    }
    return mergedContentStyles;
  }, [contentContainerStyle, scrollContentStyle, bottomPadding]);

  const containerStyles = useMemo<StyleProp<ViewStyle>>(() => {
    const stylesArray: Array<StyleProp<ViewStyle>> = [styles.container, spacingStyles];
    if (style) {
      stylesArray.push(style);
    }
    return stylesArray;
  }, [spacingStyles, style]);

  return (
    <KeyboardAvoidingView
      ref={ref}
      behavior={resolvedBehavior}
      keyboardVerticalOffset={keyboardVerticalOffset}
      enabled={enabled}
      style={containerStyles}
      {...otherProps}
    >
      {scrollable ? (
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={contentStyles as ScrollViewProps['contentContainerStyle']}
          keyboardShouldPersistTaps={keyboardShouldPersistTaps}
          showsVerticalScrollIndicator={false}
          overScrollMode="never"
          {...restScrollViewProps}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={contentStyles}>{children}</View>
      )}
    </KeyboardAvoidingView>
  );
});

KeyboardAwareLayout.displayName = 'KeyboardAwareLayout';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
  },
});
