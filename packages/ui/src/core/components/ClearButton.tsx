import React from 'react';
import { Pressable, Platform } from 'react-native';
import { Icon } from '../../components/Icon';
import { useTheme } from '../theme';
import { SizeValue } from '../theme/types';
import { getIconSize, getSectionSpacing } from '../theme/unified-sizing';

export interface ClearButtonProps {
  onPress: () => void;
  disabled?: boolean;
  size?: SizeValue;
  accessibilityLabel?: string;
  hasRightSection?: boolean;
  style?: any;
  /** Override the computed icon size (defaults to the small-context size). */
  iconSize?: number;
  /** Stroke width of the "close" glyph (defaults to the Icon default). */
  stroke?: number;
}

/**
 * Unified clear button component used across all input-like components
 * Ensures consistent sizing and behavior
 */
export function ClearButton({
  onPress,
  disabled = false,
  size = 'md',
  accessibilityLabel = 'Clear',
  hasRightSection = false,
  style,
  iconSize: iconSizeOverride,
  stroke,
}: ClearButtonProps) {
  const theme = useTheme();
  const iconSize = iconSizeOverride ?? getIconSize(size, 'small');
  const spacing = getSectionSpacing(size);

  return (
    <Pressable
      onPress={(event) => {
        event?.stopPropagation?.();
        onPress();
      }}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      hitSlop={6}
      style={({ pressed }) => ([
        {
          padding: 4,
          margin: -4, // Negative margin to not affect layout
          borderRadius: 6,
          marginRight: hasRightSection ? spacing : 0,
        },
        Platform.OS === 'web' ? { cursor: 'pointer' } : null,
        pressed ? { opacity: 0.6 } : null,
        style,
      ])}
    >
      <Icon name="close" size={iconSize} stroke={stroke} color={theme.text.muted} />
    </Pressable>
  );
}