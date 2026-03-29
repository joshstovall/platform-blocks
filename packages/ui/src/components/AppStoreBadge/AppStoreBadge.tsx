import React from 'react';
import { Pressable, View, Platform } from 'react-native';
import { Text } from '../Text';
import { BrandIcon } from '../BrandIcon';
import { useTheme } from '../../core/theme';
import { factory } from '../../core/factory';
import type { AppStoreBadgeProps } from './types';

export const AppStoreBadge = factory<{
  props: AppStoreBadgeProps;
  ref: any;
}>((props, ref) => {
  const {
    brand,
    primaryText,
    secondaryText,
    size = 'md',
    backgroundColor,
    textColor,
    borderColor,
    style,
    onPress,
    disabled = false,
    testID,
    darkMode,
    ...rest
  } = props;

  const theme = useTheme();
  const isDarkMode = darkMode ?? theme.colorScheme === 'dark';

  // Default colors based on theme
  const defaultBackgroundColor = isDarkMode ? '#1a1a1a' : '#000000';
  const defaultTextColor = isDarkMode ? '#ffffff' : '#ffffff';
  const defaultBorderColor = isDarkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.1)';

  const finalBackgroundColor = backgroundColor || defaultBackgroundColor;
  const finalTextColor = textColor || defaultTextColor;
  const finalBorderColor = borderColor || defaultBorderColor;

  // Size configurations
  const sizeConfigs = {
    sm: {
      height: 32,
      paddingHorizontal: 8,
      paddingVertical: 4,
      iconSize: 16,
      primaryFontSize: 9,
      secondaryFontSize: 11,
      borderRadius: 4,
      spacing: 6,
    },
    md: {
      height: 40,
      paddingHorizontal: 12,
      paddingVertical: 6,
      iconSize: 20,
      primaryFontSize: 10,
      secondaryFontSize: 13,
      borderRadius: 6,
      spacing: 8,
    },
    lg: {
      height: 48,
      paddingHorizontal: 16,
      paddingVertical: 8,
      iconSize: 24,
      primaryFontSize: 11,
      secondaryFontSize: 15,
      borderRadius: 8,
      spacing: 10,
    },
    xl: {
      height: 56,
      paddingHorizontal: 20,
      paddingVertical: 10,
      iconSize: 28,
      primaryFontSize: 12,
      secondaryFontSize: 17,
      borderRadius: 10,
      spacing: 12,
    }
  };

  const sizeConfig = sizeConfigs[size];

  const buttonStyle = {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: finalBackgroundColor,
    borderRadius: sizeConfig.borderRadius,
    paddingHorizontal: sizeConfig.paddingHorizontal,
    paddingVertical: sizeConfig.paddingVertical,
    minHeight: sizeConfig.height,
      minWidth: 'fit-content',
    opacity: disabled ? 0.6 : 1,
    borderWidth: 1,
    borderColor: finalBorderColor,
    ...(Platform.OS === 'ios' && {
      boxShadow: isDarkMode 
        ? '0 2px 3px rgba(255, 255, 255, 0.1)' 
        : '0 2px 3px rgba(0, 0, 0, 0.25)',
    }),
    ...(Platform.OS === 'android' && {
      elevation: 3,
      minWidth: 120, // hack to prevent Android from being too small...
    }),
    ...(Platform.OS === 'web' && {
      boxShadow: isDarkMode 
        ? '0 2px 8px rgba(255, 255, 255, 0.05)' 
        : '0 2px 8px rgba(0, 0, 0, 0.15)',
      cursor: disabled ? 'default' : 'pointer',
      transition: 'all 0.2s ease',
    }),
  };

  const pressedStyle = {
    ...buttonStyle,
    opacity: disabled ? 0.6 : 0.8,
    transform: [{ scale: 0.98 }],
  };

  return (
    <Pressable
      ref={ref}
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      style={({ pressed }) => [
        pressed ? pressedStyle : buttonStyle,
        style,
      ]}
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={`${primaryText} ${secondaryText}`}
      {...rest}
    >
      <BrandIcon
        brand={brand}
        size={sizeConfig.iconSize}
        // color={finalTextColor}
        // variant="mono"
        invertInDarkMode={false} // We handle colors ourselves
      />
      
      <View style={{ marginLeft: sizeConfig.spacing, }}>
        <Text
          style={{
            fontSize: sizeConfig.primaryFontSize,
            color: finalTextColor,
            opacity: 0.85,
            lineHeight: sizeConfig.primaryFontSize + 2,
            fontWeight: '400',
          }}
        >
          {primaryText}
        </Text>
        <Text
          style={{
            fontSize: sizeConfig.secondaryFontSize,
            color: finalTextColor,
            fontWeight: '600',
            lineHeight: sizeConfig.secondaryFontSize + 2,
            marginTop: -1,
          }}
        >
          {secondaryText}
        </Text>
      </View>
    </Pressable>
  );
});

AppStoreBadge.displayName = 'AppStoreBadge';