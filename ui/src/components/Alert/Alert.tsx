import React from 'react';
import { View, Text, TouchableOpacity, ViewStyle } from 'react-native';

import { factory } from '../../core/factory';
import { SizeValue, getSpacing } from '../../core/theme/sizes';
import { BorderRadiusProps, createRadiusStyles } from '../../core/theme/radius';
import { useTheme } from '../../core/theme/ThemeProvider';
import { SpacingProps, getSpacingStyles, extractSpacingProps } from '../../core/utils';
import { Icon } from '../Icon';

import type { AlertProps, AlertVariant, AlertColor, AlertSeverity, AlertFactoryPayload } from './types';

// Helper function to map severity to theme colors
const getSeverityColor = (severity: AlertSeverity): AlertColor => {
  switch (severity) {
    case 'info':
      return 'primary';
    case 'success':
      return 'success';
    case 'warning':
      return 'warning';
    case 'error':
      return 'error';
    default:
      return 'primary';
  }
};

// Helper function to get default icon for severity
const getSeverityIcon = (severity: AlertSeverity): React.ReactNode => {
  switch (severity) {
    case 'info':
      return <Icon name="info" size="md" />;
    case 'success':
      return <Icon name="success" size="md" />;
    case 'warning':
      return <Icon name="warning" size="md" />;
    case 'error':
      return <Icon name="error" size="md" />;
    default:
      return <Icon name="info" size="md" />;
  }
};

function AlertBase(props: AlertProps, ref: React.Ref<View>) {
  const {
    variant = 'light',
    color = 'primary',
    sev,
    title,
    children,
    icon,
    fullWidth = false,
    withCloseButton = false,
    closeButtonLabel,
    onClose,
    radius = 'md',
    style,
    testID,
    ...rest
  } = props;

  const { spacingProps, otherProps } = extractSpacingProps(rest);
  const spacingStyles = getSpacingStyles(spacingProps);

  const theme = useTheme();
  
  // Handle radius prop with 'md' as default for alerts  
  const radiusStyles = createRadiusStyles(radius || 'md');
  const padding = getSpacing('md');

  // Determine final color - severity overrides color prop
  const finalColor = sev ? getSeverityColor(sev) : color;
  
  // Determine final icon based on icon prop value
  const getFinalIcon = () => {
    // If icon is explicitly false, show no icon
    if (icon === false) {
      return null;
    }
    
    // If icon is a string, use it as an Icon name
    if (typeof icon === 'string') {
      return <Icon name={icon} size="md" />;
    }
    
    // If icon is a React component, use it as-is
    if (React.isValidElement(icon)) {
      return icon;
    }
    
    // If icon is null or undefined and severity exists, use default severity icon
    if ((icon === null || icon === undefined) && sev) {
      return getSeverityIcon(sev);
    }
    
    // If icon is null or undefined and no severity, show no icon
    return null;
  };
  
  const finalIcon = getFinalIcon();
  
  // Check if finalColor is a theme color or custom color string
  const isThemeColor = typeof finalColor === 'string' && 
    ['primary', 'secondary', 'success', 'warning', 'error', 'gray'].includes(finalColor);
  
  const colorConfig = isThemeColor 
    ? theme.colors[finalColor as keyof typeof theme.colors]
    : null;

  const getAlertStyles = () => {
    const baseStyles = {
      ...radiusStyles,
      padding,
      flexDirection: 'row' as const,
      alignItems: 'flex-start' as const,
      ...(fullWidth ? { width: '100%' as const } : {})
    };

    if (colorConfig) {
      // Use theme colors
      switch (variant) {
        case 'filled':
          return {
            ...baseStyles,
            backgroundColor: colorConfig[5]
          };
        case 'outline':
          return {
            ...baseStyles,
            backgroundColor: 'transparent',
            borderWidth: 1,
            borderColor: colorConfig[5]
          };
        case 'subtle':
          return {
            ...baseStyles,
            backgroundColor: 'transparent'
          };
        case 'light':
        default:
          return {
            ...baseStyles,
            backgroundColor: colorConfig[1],
            borderWidth: 1,
            borderColor: colorConfig[3]
          };
      }
    } else {
      // Use custom color
      const customColor = finalColor as string;
      switch (variant) {
        case 'filled':
          return {
            ...baseStyles,
            backgroundColor: customColor
          };
        case 'outline':
          return {
            ...baseStyles,
            backgroundColor: 'transparent',
            borderWidth: 1,
            borderColor: customColor
          };
        case 'subtle':
          return {
            ...baseStyles,
            backgroundColor: 'transparent'
          };
        case 'light':
        default:
          return {
            ...baseStyles,
            backgroundColor: customColor + '20', // Add transparency
            borderWidth: 1,
            borderColor: customColor + '40'
          };
      }
    }
  };

  const getTextColor = () => {
    if (colorConfig) {
      switch (variant) {
        case 'filled':
          return 'white';
        case 'subtle':
          return theme.colors.gray[7]; // Use neutral text color for subtle variant
        case 'outline':
        case 'light':
        default:
          return colorConfig[7];
      }
    } else {
      // Custom color
      const customColor = finalColor as string;
      switch (variant) {
        case 'filled':
          return 'white';
        case 'subtle':
          return '#374151'; // Default neutral text color for subtle variant
        case 'outline':
        case 'light':
        default:
          return customColor;
      }
    }
  };

  const getIconColor = () => {
    if (colorConfig) {
      switch (variant) {
        case 'filled':
          return 'white';
        case 'subtle':
          return colorConfig[5]; // Use colored icon for subtle variant
        case 'outline':
        case 'light':
        default:
          return colorConfig[5];
      }
    } else {
      // Custom color
      const customColor = finalColor as string;
      switch (variant) {
        case 'filled':
          return 'white';
        case 'subtle':
          return customColor; // Use colored icon for subtle variant
        case 'outline':
        case 'light':
        default:
          return customColor;
      }
    }
  };

  const alertStyles = getAlertStyles();
  const textColor = getTextColor();
  const iconColor = getIconColor();

  return (
    <View
      ref={ref}
      style={[alertStyles, spacingStyles, style]}
      testID={testID}
      accessibilityRole="alert"
      {...otherProps}
      {...spacingProps as SpacingProps}
    >
      {/* Icon */}
      {finalIcon && (
        <View style={{ marginRight: getSpacing('sm'), marginTop: 2 }}>
          {React.isValidElement(finalIcon)
            ? React.cloneElement(finalIcon as React.ReactElement<any>, {
              color: iconColor,
              size: 'md'
            })
            : finalIcon
          }
        </View>
      )}

      {/* Content */}
      <View style={{ flex: 1 }}>
        {title && (
          <Text
            style={{
              fontSize: 16,
              fontWeight: '600',
              color: textColor,
              marginBottom: children ? getSpacing('xs') : 0
            }}
          >
            {title}
          </Text>
        )}

        {children && (
          <Text
            style={{
              fontSize: 14,
              lineHeight: 20,
              color: textColor
            }}
          >
            {children}
          </Text>
        )}
      </View>

      {/* Close Button */}
      {withCloseButton && (
        <TouchableOpacity
          onPress={onClose}
          style={{
            marginLeft: getSpacing('sm'),
            padding: getSpacing('xs'),
            marginTop: -getSpacing('xs'),
            marginRight: -getSpacing('xs')
          }}
          accessibilityLabel={closeButtonLabel || 'Close alert'}
          accessibilityRole="button"
        >
          <Icon name="x" color={iconColor} />
        </TouchableOpacity>
      )}
    </View>
  );
}

export const Alert = factory<AlertFactoryPayload>(AlertBase);

Alert.displayName = 'Alert';
