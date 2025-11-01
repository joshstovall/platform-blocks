import React from 'react';
import { View, ImageBackground, ViewStyle, ImageStyle, StyleSheet } from 'react-native';
import { useTheme } from '../../core/theme';
import { extractSpacingProps, getSpacingStyles } from '../../core/utils/spacing';
import type { ContainerProps } from './types';
import { resolveLinearGradient } from '../../utils/optionalDependencies';

const { LinearGradient: OptionalLinearGradient, hasLinearGradient } = resolveLinearGradient();

export function Container(props: ContainerProps) {
  const theme = useTheme();
  
  // Extract spacing props and other props
  const { spacingProps, otherProps } = extractSpacingProps(props);
  const { children, style, backgroundImage, padding, margin, fluid = false } = otherProps;
  
  // Get spacing styles from shorthand props
  const spacingStyles = getSpacingStyles(spacingProps);

  const containerStyle: ViewStyle = {
    // Apply flex: 1 if fluid is true
    ...(fluid && { flex: 1 }),
    // Legacy padding/margin props (for backward compatibility)
    padding,
    margin,
    // Spacing shorthand props (takes precedence)
    ...spacingStyles,
    // User-provided style (takes highest precedence)
    ...style,
  };

  if (!backgroundImage) {
    return <View style={containerStyle}>{children}</View>;
  }

  const imageStyle: ImageStyle = {
    opacity: backgroundImage.opacity ?? 1,
  };

  const overlayStyle: ViewStyle = backgroundImage.overlay
    ? {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: backgroundImage.overlay.color || theme.colors.gray[9],
        opacity: backgroundImage.overlay.opacity ?? 0.3,
      }
    : {};

  return (
    <ImageBackground
      source={{ uri: backgroundImage.uri }}
      style={containerStyle}
      imageStyle={imageStyle}
      resizeMode="cover"
    >
      {backgroundImage.overlay && <View style={overlayStyle} />}
      {backgroundImage.gradient && (
        hasLinearGradient ? (
          <OptionalLinearGradient
            colors={backgroundImage.gradient.colors}
            locations={backgroundImage.gradient.locations}
            start={backgroundImage.gradient.start || { x: 0, y: 0 }}
            end={backgroundImage.gradient.end || { x: 0, y: 1 }}
            style={StyleSheet.absoluteFillObject}
          />
        ) : (
          <View
            style={[
              StyleSheet.absoluteFillObject,
              { backgroundColor: backgroundImage.gradient.colors?.[0] ?? 'transparent' },
            ]}
          />
        )
      )}
      {children}
    </ImageBackground>
  );
}
