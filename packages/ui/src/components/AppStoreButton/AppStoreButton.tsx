import React from 'react';
import { Pressable, View, Image, Platform } from 'react-native';
import { Text } from '../Text';
import { Icon } from '../Icon';
import { useTheme } from '../../core/theme';
import { factory } from '../../core/factory';
import type { AppStoreButtonProps } from './types';

export const AppStoreButton = factory<{
  props: AppStoreButtonProps;
  ref: any;
}>((props, ref) => {
  const {
    store,
    size = 'md',
    locale = 'en',
    style,
    onPress,
    disabled = false,
    testID,
    ...rest
  } = props;

  const theme = useTheme();

  // Store configurations with proper badge styling
  const storeConfigs = {
    'app-store': {
      backgroundColor: '#000000',
      textColor: '#FFFFFF',
      iconName: 'apple' as const,
      primaryText: {
        en: 'Download on the',
        es: 'Descargar en',
        fr: 'Télécharger sur',
        de: 'Laden im',
        it: 'Scarica su',
        pt: 'Baixar na',
        ru: 'Загрузить в',
        ja: 'ダウンロード',
        ko: '다운로드',
        zh: '下载应用',
      },
      secondaryText: {
        en: 'App Store',
        es: 'App Store',
        fr: 'App Store',
        de: 'App Store',
        it: 'App Store',
        pt: 'App Store',
        ru: 'App Store',
        ja: 'App Store',
        ko: 'App Store',
        zh: 'App Store',
      }
    },
    'google-play': {
      backgroundColor: '#000000',
      textColor: '#FFFFFF',
      iconName: 'google' as const,
      primaryText: {
        en: 'Get it on',
        es: 'Disponible en',
        fr: 'Disponible sur',
        de: 'Jetzt bei',
        it: 'Disponibile su',
        pt: 'Disponível no',
        ru: 'Доступно в',
        ja: '今すぐ',
        ko: '다운로드하기',
        zh: '立即下载',
      },
      secondaryText: {
        en: 'Google Play',
        es: 'Google Play',
        fr: 'Google Play',
        de: 'Google Play',
        it: 'Google Play',
        pt: 'Google Play',
        ru: 'Google Play',
        ja: 'Google Play',
        ko: 'Google Play',
        zh: 'Google Play',
      }
    },
    'microsoft-store': {
      backgroundColor: '#0078D4',
      textColor: '#FFFFFF',
      iconName: 'microsoft' as const,
      primaryText: {
        en: 'Get it from',
        es: 'Obtener de',
        fr: 'Obtenir sur',
        de: 'Beziehen über',
        it: 'Scarica da',
        pt: 'Obter na',
        ru: 'Скачать из',
        ja: '入手先',
        ko: '다운로드',
        zh: '获取来源',
      },
      secondaryText: {
        en: 'Microsoft',
        es: 'Microsoft',
        fr: 'Microsoft',
        de: 'Microsoft',
        it: 'Microsoft',
        pt: 'Microsoft',
        ru: 'Microsoft',
        ja: 'Microsoft',
        ko: 'Microsoft',
        zh: 'Microsoft',
      }
    },
    'amazon-appstore': {
      backgroundColor: '#232F3E',
      textColor: '#FFFFFF',
      iconName: 'star' as const, // Using star as Amazon placeholder
      primaryText: {
        en: 'Available at',
        es: 'Disponible en',
        fr: 'Disponible sur',
        de: 'Erhältlich bei',
        it: 'Disponibile su',
        pt: 'Disponível na',
        ru: 'Доступно в',
        ja: '利用可能',
        ko: '이용 가능',
        zh: '可在以下位置获得',
      },
      secondaryText: {
        en: 'Amazon Appstore',
        es: 'Amazon Appstore',
        fr: 'Amazon Appstore',
        de: 'Amazon Appstore',
        it: 'Amazon Appstore',
        pt: 'Amazon Appstore',
        ru: 'Amazon Appstore',
        ja: 'Amazon Appstore',
        ko: 'Amazon Appstore',
        zh: 'Amazon Appstore',
      }
    },
    'mac-app-store': {
      backgroundColor: '#000000',
      textColor: '#FFFFFF',
      iconName: 'apple' as const,
      primaryText: {
        en: 'Download on the',
        es: 'Descargar en',
        fr: 'Télécharger sur',
        de: 'Laden im',
        it: 'Scarica su',
        pt: 'Baixar na',
        ru: 'Загрузить в',
        ja: 'ダウンロード',
        ko: '다운로드',
        zh: '下载应用',
      },
      secondaryText: {
        en: 'Mac App Store',
        es: 'Mac App Store',
        fr: 'Mac App Store',
        de: 'Mac App Store',
        it: 'Mac App Store',
        pt: 'Mac App Store',
        ru: 'Mac App Store',
        ja: 'Mac App Store',
        ko: 'Mac App Store',
        zh: 'Mac App Store',
      }
    },
    'f-droid': {
      backgroundColor: '#1976D2',
      textColor: '#FFFFFF',
      iconName: 'star' as const, // Using star as F-Droid placeholder
      primaryText: {
        en: 'Get it on',
        es: 'Obtener en',
        fr: 'Obtenir sur',
        de: 'Beziehen über',
        it: 'Scarica da',
        pt: 'Obter no',
        ru: 'Скачать из',
        ja: '入手先',
        ko: '다운로드',
        zh: '获取来源',
      },
      secondaryText: {
        en: 'F-Droid',
        es: 'F-Droid',
        fr: 'F-Droid',
        de: 'F-Droid',
        it: 'F-Droid',
        pt: 'F-Droid',
        ru: 'F-Droid',
        ja: 'F-Droid',
        ko: 'F-Droid',
        zh: 'F-Droid',
      }
    }
  };

  const config = storeConfigs[store];
  const primaryText = config.primaryText[locale] || config.primaryText.en;
  const secondaryText = config.secondaryText[locale] || config.secondaryText.en;

  // Size configurations
  const sizeConfigs = {
    sm: {
      height: 32,
      paddingHorizontal: 8,
      paddingVertical: 4,
      iconSize: 16,
      primaryFontSize: 10,
      secondaryFontSize: 12,
      borderRadius: 4,
    },
    md: {
      height: 40,
      paddingHorizontal: 12,
      paddingVertical: 6,
      iconSize: 20,
      primaryFontSize: 11,
      secondaryFontSize: 14,
      borderRadius: 6,
    },
    lg: {
      height: 48,
      paddingHorizontal: 16,
      paddingVertical: 8,
      iconSize: 24,
      primaryFontSize: 12,
      secondaryFontSize: 16,
      borderRadius: 8,
    },
    xl: {
      height: 56,
      paddingHorizontal: 20,
      paddingVertical: 10,
      iconSize: 28,
      primaryFontSize: 13,
      secondaryFontSize: 18,
      borderRadius: 10,
    }
  };

  const sizeConfig = sizeConfigs[size];

  const buttonStyle = {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: config.backgroundColor,
    borderRadius: sizeConfig.borderRadius,
    paddingHorizontal: sizeConfig.paddingHorizontal,
    paddingVertical: sizeConfig.paddingVertical,
    minHeight: sizeConfig.height,
    opacity: disabled ? 0.6 : 1,
    // Add subtle border and shadow for better definition
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    ...(Platform.OS === 'ios' && {
      boxShadow: '0 2px 3px rgba(0, 0, 0, 0.25)',
    }),
    ...(Platform.OS === 'android' && {
      elevation: 3,
    }),
    ...(Platform.OS === 'web' && {
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
      cursor: disabled ? 'default' : 'pointer',
      transition: 'all 0.2s ease',
    }),
  };

  const pressedStyle = {
    ...buttonStyle,
    opacity: 0.8,
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
      <Icon
        name={config.iconName}
        size={sizeConfig.iconSize}
        color={config.textColor}
      />
      
      <View style={{ marginLeft: 8, flex: 1 }}>
        <Text
          style={{
            fontSize: sizeConfig.primaryFontSize,
            color: config.textColor,
            opacity: 0.9,
            lineHeight: sizeConfig.primaryFontSize + 2,
            fontWeight: '400',
          }}
        >
          {primaryText}
        </Text>
        <Text
          style={{
            fontSize: sizeConfig.secondaryFontSize,
            color: config.textColor,
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

AppStoreButton.displayName = 'AppStoreButton';