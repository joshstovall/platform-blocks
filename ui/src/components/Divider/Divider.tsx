import React from 'react';
import { View, ViewStyle } from 'react-native';

import type { DividerProps, DividerFactoryPayload } from './types';
import { factory } from '../../core/factory';
import { SizeValue, getSpacing } from '../../core/theme/sizes';
import { useTheme } from '../../core/theme/ThemeProvider';
import { getSpacingStyles, extractSpacingProps } from '../../core/utils';
import { Text } from '../Text';

// Types extracted to types.ts

function DividerBase(props: DividerProps, ref: React.Ref<View>) {
  const {
    orientation = 'horizontal',
    variant = 'solid',
    color,
    colorVariant,
    size = 1,
    label,
    labelPosition = 'center',
    style,
    testID,
    ...rest
  } = props;

  const { spacingProps, otherProps } = extractSpacingProps(rest);
  const spacingStyles = getSpacingStyles(spacingProps);

  const theme = useTheme();
  
  // Resolve divider color with semantic variants
  const getDividerColor = (): string => {
    // Direct color override takes priority
    if (color) {
      return color;
    }
    
    // Handle colorVariant
    if (colorVariant) {
      switch (colorVariant) {
        case 'muted':
          return theme.colors.surface[8] || theme.colors.surface[7];
        case 'subtle':
          return theme.colors.surface[6] || theme.colors.surface[5];
        case 'primary':
        case 'secondary':
        case 'tertiary':
        case 'success':
        case 'warning':
        case 'error':
        case 'gray': {
          const palette = (theme.colors as any)[colorVariant];
          return Array.isArray(palette) ? (palette[5] || palette[0]) : palette;
        }
        case 'surface':
        default:
          return theme.colors.surface[9] || theme.colors.surface[7];
      }
    }
    
    // Default fallback
    return theme.colors.surface[9] || theme.colors.surface[7];
  };

  const dividerColor = getDividerColor();
  const dividerSize = typeof size === 'number' ? size : getSpacing(size);
  const labelSpacing = getSpacing('sm');

  // Helper function to wrap plain text labels in Text component
  const renderLabel = () => {
    if (!label) return null;
    
    // If label is a string, wrap it in Text component
    if (typeof label === 'string') {
      return (
        <Text size="sm" color="muted" weight="medium">
          {label}
        </Text>
      );
    }
    
    // If it's already a React element, return as is
    return label;
  };

  const getBorderStyle = () => {
    switch (variant) {
      case 'dashed':
        return 'dashed';
      case 'dotted':
        return 'dotted';
      case 'solid':
      default:
        return 'solid';
    }
  };

  const getDividerStyles = (): ViewStyle => {
    if (orientation === 'vertical') {
      return {
        width: dividerSize,
        borderLeftWidth: dividerSize,
        borderLeftColor: dividerColor,
        alignSelf: 'stretch'
      };
    }

    return {
      height: dividerSize,
      borderTopWidth: dividerSize,
      borderTopColor: dividerColor,
      width: '100%'
    };
  };

  const renderWithLabel = () => {
    const dividerStyles = getDividerStyles();

    if (orientation === 'vertical') {
      return (
        <View
          style={{
            flexDirection: 'column',
            alignItems: 'center',
            height: '100%'
          }}
        >
          <View style={[dividerStyles, { flex: labelPosition === 'left' ? 0.2 : 1 }]} />
          {label && (
            <View style={{ paddingVertical: labelSpacing }}>
              {renderLabel()}
            </View>
          )}
          <View style={[dividerStyles, { flex: labelPosition === 'right' ? 0.2 : 1 }]} />
        </View>
      );
    }

    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          width: '100%'
        }}
      >
        <View style={[dividerStyles, { flex: labelPosition === 'left' ? 0.2 : 1 }]} />
        {label && (
          <View style={{ paddingHorizontal: labelSpacing }}>
            {renderLabel()}
          </View>
        )}
        <View style={[dividerStyles, { flex: labelPosition === 'right' ? 0.2 : 1 }]} />
      </View>
    );
  };

  const renderSimple = () => {
    const dividerStyles = getDividerStyles();
    return <View style={dividerStyles} />;
  };

  return (
    <View
      ref={ref}
      style={[
        {
          ...(orientation === 'horizontal' ? { width: '100%' } : { height: '100%' })
        },
        spacingStyles,
        style
      ]}
      testID={testID}
      {...otherProps}
    >
      {label ? renderWithLabel() : renderSimple()}
    </View>
  );
}

export const Divider = factory<DividerFactoryPayload>(DividerBase);

Divider.displayName = 'Divider';
