import React from 'react';
import { View, ViewStyle, Image } from 'react-native';
import { Text } from '../Text';
import { useTheme } from '../../core/theme';
import { resolveComponentSize, type ComponentSize, type ComponentSizeValue } from '../../core/theme/componentSize';
import type { AvatarProps } from './types';
import { Indicator } from '../Indicator';

type AvatarMetrics = {
  avatar: number;
  badge: number;
  text: ComponentSize;
};

const AVATAR_ALLOWED_SIZES: ComponentSize[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'];

const AVATAR_SIZE_SCALE: Record<ComponentSize, AvatarMetrics> = {
  xs: { avatar: 24, badge: 6, text: 'xs' },
  sm: { avatar: 32, badge: 8, text: 'xs' },
  md: { avatar: 40, badge: 10, text: 'sm' },
  lg: { avatar: 48, badge: 12, text: 'md' },
  xl: { avatar: 64, badge: 16, text: 'lg' },
  '2xl': { avatar: 80, badge: 20, text: 'xl' },
  '3xl': { avatar: 96, badge: 24, text: '2xl' },
};

const BASE_AVATAR_METRICS = AVATAR_SIZE_SCALE.md;

function resolveAvatarMetrics(value: ComponentSizeValue | undefined): AvatarMetrics {
  if (typeof value === 'number') {
    return calculateNumericMetrics(value);
  }

  const resolved = resolveComponentSize(value, AVATAR_SIZE_SCALE, {
    allowedSizes: AVATAR_ALLOWED_SIZES,
    fallback: 'md',
  });

  if (typeof resolved === 'number') {
    return calculateNumericMetrics(resolved);
  }

  return resolved;
}

function calculateNumericMetrics(value: number): AvatarMetrics {
  const ratio = value / BASE_AVATAR_METRICS.avatar;
  const badge = Math.max(4, Math.round(BASE_AVATAR_METRICS.badge * ratio));
  const text = pickTextSize(value);

  return {
    avatar: value,
    badge,
    text,
  };
}

function pickTextSize(value: number): ComponentSize {
  if (value >= 92) return '3xl';
  if (value >= 80) return '2xl';
  if (value >= 64) return 'xl';
  if (value >= 52) return 'lg';
  if (value >= 44) return 'md';
  if (value >= 32) return 'sm';
  return 'xs';
}

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

  const { avatar: avatarSize, badge: badgeSize, text: textSize } = resolveAvatarMetrics(size);

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
