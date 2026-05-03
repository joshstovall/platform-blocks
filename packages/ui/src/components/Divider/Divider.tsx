import React from 'react';
import { View, ViewStyle } from 'react-native';

import type { DividerProps, DividerFactoryPayload, DividerColorVariant } from './types';
import { factory } from '../../core/factory';
import { getSpacing } from '../../core/theme/sizes';
import { useTheme } from '../../core/theme/ThemeProvider';
import { getSpacingStyles, extractSpacingProps } from '../../core/utils';
import { Text } from '../Text';
import { resolveLinearGradient } from '../../utils/optionalDependencies';

const { LinearGradient: OptionalLinearGradient } = resolveLinearGradient();

const PALETTE_DIVIDER_SHADE = 3 as const;

function resolveDividerColor(
  theme: any,
  colorVariant?: DividerColorVariant,
  color?: string,
): string {
  if (color) return color;

  switch (colorVariant) {
    case 'subtle':
      return theme.backgrounds?.subtle ?? theme.backgrounds?.border ?? '#E5E5EA';
    case 'muted':
      return theme.text?.muted ?? theme.backgrounds?.border ?? '#999999';
    case 'primary':
    case 'secondary':
    case 'success':
    case 'warning':
    case 'error':
    case 'gray': {
      const palette = (theme.colors as any)?.[colorVariant];
      if (!palette) return theme.backgrounds?.border ?? '#E5E5EA';
      return Array.isArray(palette)
        ? (palette[PALETTE_DIVIDER_SHADE] ?? palette[5] ?? palette[0])
        : palette;
    }
    case 'border':
    default:
      return theme.backgrounds?.border ?? '#E5E5EA';
  }
}

function DividerBase(props: DividerProps, ref: React.Ref<View>) {
  const {
    orientation = 'horizontal',
    variant = 'solid',
    color,
    colorVariant = 'border',
    size = 1,
    opacity,
    label,
    labelPosition = 'center',
    labelProps,
    style,
    testID,
    ...rest
  } = props;

  const { spacingProps, otherProps } = extractSpacingProps(rest);
  const spacingStyles = getSpacingStyles(spacingProps);

  const theme = useTheme();
  const dividerColor = resolveDividerColor(theme, colorVariant, color);
  const dividerSize = typeof size === 'number' ? size : getSpacing(size);
  const labelSpacing = getSpacing('sm');

  const renderLabel = () => {
    if (!label) return null;
    if (typeof label === 'string') {
      return (
        <Text
          size="sm"
          colorVariant="muted"
          weight="medium"
          align={orientation === 'vertical' ? 'center' : undefined}
          {...labelProps}
        >
          {label}
        </Text>
      );
    }
    return label;
  };

  const isGradient = variant === 'gradient';
  const borderStyle: 'solid' | 'dashed' | 'dotted' =
    variant === 'dashed' ? 'dashed' : variant === 'dotted' ? 'dotted' : 'solid';

  const renderLine = (flex?: number, edge?: 'leading' | 'trailing') => {
    if (isGradient && OptionalLinearGradient) {
      // Fade transparent → color → transparent for a true gradient line. When a
      // segment is on the leading edge of a labelled divider we keep the bright
      // side near the label, and vice versa.
      const transparent = `${dividerColor}00`;
      const colors = (() => {
        if (edge === 'leading') return [transparent, dividerColor];
        if (edge === 'trailing') return [dividerColor, transparent];
        return [transparent, dividerColor, transparent];
      })();
      const gradientStyle: ViewStyle =
        orientation === 'vertical'
          ? { width: dividerSize, alignSelf: 'center', flex }
          : { height: dividerSize, width: '100%', flex };
      return (
        <OptionalLinearGradient
          colors={colors}
          start={orientation === 'vertical' ? { x: 0, y: 0 } : { x: 0, y: 0 }}
          end={orientation === 'vertical' ? { x: 0, y: 1 } : { x: 1, y: 0 }}
          style={gradientStyle}
        />
      );
    }

    if (orientation === 'vertical') {
      return (
        <View
          style={{
            borderLeftWidth: dividerSize,
            borderLeftColor: dividerColor,
            borderStyle,
            alignSelf: 'center',
            flex,
          }}
        />
      );
    }

    return (
      <View
        style={{
          height: dividerSize,
          borderTopWidth: dividerSize,
          borderTopColor: dividerColor,
          borderStyle,
          width: '100%',
          flex,
        }}
      />
    );
  };

  const renderWithLabel = () => {
    const labelContainerStyle: ViewStyle =
      orientation === 'vertical'
        ? {
            paddingVertical: labelSpacing,
            alignItems: 'center',
            alignSelf: 'center',
          }
        : { paddingHorizontal: labelSpacing };

    if (orientation === 'vertical') {
      return (
        <View
          style={{
            flexDirection: 'column',
            alignItems: 'center',
            height: '100%',
          }}
        >
          {renderLine(labelPosition === 'left' ? 0.2 : 1, 'leading')}
          {label && <View style={labelContainerStyle}>{renderLabel()}</View>}
          {renderLine(labelPosition === 'right' ? 0.2 : 1, 'trailing')}
        </View>
      );
    }

    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          width: '100%',
        }}
      >
        {renderLine(labelPosition === 'left' ? 0.2 : 1, 'leading')}
        {label && <View style={labelContainerStyle}>{renderLabel()}</View>}
        {renderLine(labelPosition === 'right' ? 0.2 : 1, 'trailing')}
      </View>
    );
  };

  return (
    <View
      ref={ref}
      style={[
        orientation === 'horizontal' ? { width: '100%' } : { height: '100%' },
        opacity !== undefined ? { opacity } : null,
        spacingStyles,
        style,
      ]}
      testID={testID}
      {...otherProps}
    >
      {label ? renderWithLabel() : renderLine()}
    </View>
  );
}

export const Divider = factory<DividerFactoryPayload>(DividerBase);

Divider.displayName = 'Divider';
