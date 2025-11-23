import React from 'react';
import { View } from 'react-native';
import { Text, type TextProps } from '../Text';
import type { TitleProps } from './types';
import { useTheme } from '../../core/theme';
import { Block } from '../Block';
import { useTitleRegistration } from '../../hooks/useTitleRegistration';
import { useDirection } from '../../core/providers/DirectionProvider';

const levelToVariant: Record<number, TextProps['variant']> = {
  1: 'h1',
  2: 'h2',
  3: 'h3',
  4: 'h4',
  5: 'h5',
  6: 'h6',
};

export const Title: React.FC<TitleProps> = ({
  text,
  order = 2,
  underline = false,
  afterline = false,
  underlineColor,
  underlineStroke = 2,
  afterlineGap = 12,
  underlineOffset = 4,
  prefix = false,
  prefixVariant = 'bar',
  prefixColor,
  prefixSize = 4,
  prefixLength = 28,
  prefixGap = 12,
  prefixRadius,
  style,
  containerStyle,
  children,
  startIcon,
  endIcon,
  action, // right action button to the very right of the screen - after the afterline
  subtitle,
  subtitleProps,
  subtitleSpacing = 8,
  ...textProps
}) => {
  const theme = useTheme();
  const { isRTL } = useDirection();
  const color = underlineColor || theme.colors.primary?.[5] || theme.text.primary;
  const variant = levelToVariant[order] || 'h2';

  // Auto-register this title with the registry for TableOfContents
  const titleText = text || (typeof children === 'string' ? children : '');
  const { elementRef } = useTitleRegistration({
    text: titleText,
    order,
    autoRegister: !!titleText, // Only register if we have text content
  });

  const resolvedPrefixColor = prefixColor || color;
  const renderPrefix = () => {
    if (!prefix) return null;
    if (React.isValidElement(prefix)) return prefix;
    if (prefixVariant === 'dot') {
      const size = prefixSize || 6;
      return (
        <View
          testID="title-prefix"
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: resolvedPrefixColor,
            ...(isRTL ? { marginLeft: prefixGap } : { marginRight: prefixGap })
          }}
        />
      );
    }
    // bar variant
    return (
      <View
        testID="title-prefix"
        style={{
          width: prefixSize,
          height: prefixLength,
          backgroundColor: resolvedPrefixColor,
          borderRadius: prefixRadius ?? (prefixSize / 2),
          ...(isRTL ? { marginLeft: prefixGap } : { marginRight: prefixGap })
        }}
      />
    );
  };

  // Build underline element
  const Underline = underline ? (
    <View
      testID="title-underline"
      style={{
        height: underlineStroke,
        backgroundColor: color,
        marginTop: underlineOffset,
        borderRadius: underlineStroke / 2,
        alignSelf: 'flex-start',
        minWidth: 40,
      }}
    />
  ) : null;

  // Afterline layout: text + flexible line filling rest
  const Afterline = afterline ? (
    <View testID="title-afterline" style={{ flexDirection: 'row', alignItems: 'center', width: '100%', marginTop: underline ? afterlineGap : 4 }}>
      <View style={{ 
        flex: 1, 
        height: underlineStroke, 
        backgroundColor: color, 
        borderRadius: underlineStroke / 2, 
        ...(isRTL ? { marginRight: 12 } : { marginLeft: 12 })
      }} />
    </View>
  ) : null;

  const renderSubtitle = () => {
    if (!subtitle) return null;

    const spacingStyle = { marginTop: subtitleSpacing };

    if (React.isValidElement(subtitle)) {
      return (
        <View style={spacingStyle}>
          {subtitle}
        </View>
      );
    }

    return (
      <Text
        variant="p"
        colorVariant="secondary"
        {...subtitleProps}
        style={[spacingStyle, subtitleProps?.style]}
      >
        {subtitle}
      </Text>
    );
  };

  return (
    <View ref={elementRef} style={[{ width: '100%' }, containerStyle]}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center'
          // flex: action ? 1 : undefined
        }}>
          {startIcon && <Block mr={8}>{startIcon}</Block>}
          {renderPrefix()}
          <Text
            variant={variant}
            {...textProps}
            style={[{ fontWeight: '700' }, style]}
          >
            {text || children}
          </Text>
          {endIcon && <Block ml={8}>{endIcon}</Block>}
        </View>
        {afterline && !underline && (
          <View
            testID="title-afterline-inline"
            style={{ 
              flex: 1, 
              height: underlineStroke, 
              backgroundColor: color, 
              borderRadius: underlineStroke / 2,
              ...(isRTL ? { marginRight: 12 } : { marginLeft: 12 })
            }}
          />
        )}
        {action && <Block ml={12}>{action}</Block>}
      </View>
      {underline && Underline}
      {underline && afterline && Afterline}
      {renderSubtitle()}
    </View>
  );
};

export default Title;

// Convenience heading aliases that inherit all Title decorative props.
// These mirror the simple Text aliases but allow underline/afterline/prefix usage directly.
export const Heading1: React.FC<Omit<TitleProps, 'order'>> = (props) => <Title order={1} {...props} />;
export const Heading2: React.FC<Omit<TitleProps, 'order'>> = (props) => <Title order={2} {...props} />;
export const Heading3: React.FC<Omit<TitleProps, 'order'>> = (props) => <Title order={3} {...props} />;
export const Heading4: React.FC<Omit<TitleProps, 'order'>> = (props) => <Title order={4} {...props} />;
export const Heading5: React.FC<Omit<TitleProps, 'order'>> = (props) => <Title order={5} {...props} />;
export const Heading6: React.FC<Omit<TitleProps, 'order'>> = (props) => <Title order={6} {...props} />;