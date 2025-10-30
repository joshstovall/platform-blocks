import React from 'react';
import { View, Pressable } from 'react-native';
import { factory } from '../../core/factory';
import { useTheme } from '../../core/theme';
import { getSpacingStyles, extractSpacingProps } from '../../core/utils';
import { Icon } from '../Icon';
import type { ColorSwatchProps } from './types';

export const ColorSwatch = factory<{ props: ColorSwatchProps; ref: View }>((props, ref) => {
  const {
    color,
    size = 32,
    selected = false,
    disabled = false,
    onPress,
    showBorder = true,
    borderColor,
    borderWidth = 1,
    borderRadius = 4,
    showCheckmark = true,
    checkmarkColor,
    accessibilityLabel,
    testID,
    ...spacing
  } = props;

  const theme = useTheme();
  const containerStyles = getSpacingStyles(extractSpacingProps(spacing).spacingProps);

  const defaultBorderColor = borderColor || theme.colors.gray[3];
  const selectedBorderColor = borderColor || theme.colors.primary[6];
  const finalBorderColor = selected ? selectedBorderColor : defaultBorderColor;
  const finalBorderWidth = selected ? Math.max(borderWidth, 2) : borderWidth;

  // Calculate if the color is light or dark to determine checkmark color
  const getContrastColor = (hexColor: string): string => {
    if (checkmarkColor) return checkmarkColor;
    
    // Remove # if present
    const hex = hexColor.replace('#', '');
    
    // Convert to RGB
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    // Calculate relative luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    // Return white for dark colors, black for light colors
    return luminance > 0.5 ? '#000000' : '#FFFFFF';
  };

  const swatchStyle = {
    width: size,
    height: size,
    backgroundColor: color,
    borderRadius,
    ...(showBorder && {
      borderWidth: finalBorderWidth,
      borderColor: finalBorderColor,
    }),
    ...(disabled && {
      opacity: 0.5,
    }),
  };

  const content = (
    <View
      ref={ref}
      style={[swatchStyle, containerStyles]}
      testID={testID}
    >
      {selected && showCheckmark && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon
            name="success"
            size={Math.min(size * 0.5, 16)}
            color={getContrastColor(color)}
            variant="filled"
          />
        </View>
      )}
    </View>
  );

  if (onPress && !disabled) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => ({
          opacity: pressed ? 0.8 : 1,
        })}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel || `Color ${color}`}
        accessibilityState={{ selected, disabled }}
      >
        {content}
      </Pressable>
    );
  }

  return content;
});

ColorSwatch.displayName = 'ColorSwatch';