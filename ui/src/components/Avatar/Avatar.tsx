import React from 'react';
import { View, ViewStyle, Image } from 'react-native';
import { Text } from '../Text';
import { useTheme } from '../../core/theme';
import type { AvatarProps } from './types';
import { Indicator } from '../Indicator';

const AVATAR_SIZES = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 48,
  xl: 64,
};

const BADGE_SIZES = {
  xs: 6,
  sm: 8,
  md: 10,
  lg: 12,
  xl: 16,
};

const TEXT_SIZES = {
  xs: 'xs' as const,
  sm: 'xs' as const,
  md: 'sm' as const,
  lg: 'md' as const,
  xl: 'lg' as const,
};

export function Avatar({
  size = 'md',
  src,
  fallback,
  backgroundColor,
  textColor = 'white',
  online,
  badgeColor,
  style,
  accessibilityLabel,
  label,
  description,
  gap = 8,
  showText = true,
}: AvatarProps) {
  const theme = useTheme();
  
  const avatarSize = typeof size === 'number' ? size : AVATAR_SIZES[size];
  const badgeSize = typeof size === 'number' ? avatarSize * 0.25 : BADGE_SIZES[size];
  const textSize = typeof size === 'number' ? 'sm' : TEXT_SIZES[size];
  
  const avatarStyle: ViewStyle = {
    width: avatarSize,
    height: avatarSize,
    borderRadius: avatarSize / 2,
    backgroundColor: backgroundColor || theme.colors.gray[5],
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  };


  const containerStyle: ViewStyle = {
    position: 'relative',
    ...style,
  };

  const content = (
    <View style={containerStyle}>
      <View style={avatarStyle}>
        {src ? (
          <Image
            source={{ uri: src }}
            style={{
              width: avatarSize,
              height: avatarSize,
              borderRadius: avatarSize / 2,
            }}
            accessibilityLabel={accessibilityLabel}
          />
        ) : (
          <Text
            size={textSize}
            color={textColor}
            weight="semibold"
            style={{ textAlign: 'center' }}
          >
            {fallback || '?'}
          </Text>
        )}
      </View>
      {online && (
        <Indicator
          size={badgeSize}
          color={badgeColor || theme.colors.success[5]}
          borderColor={theme.colors.gray[0]}
          placement="bottom-right"
        />
      )}
    </View>
  );

  if (label || description) {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {content}
        {showText && (
          <View style={{ marginLeft: gap, justifyContent: 'center' }}>
            {label && (
              typeof label === 'string' ? (
                <Text size={textSize} weight="semibold">{label}</Text>
              ) : label
            )}
            {description && (
              typeof description === 'string' ? (
                <Text size={textSize} color={theme.colors.gray[6]}>{description}</Text>
              ) : description
            )}
          </View>
        )}
      </View>
    );
  }

  return content;
}
