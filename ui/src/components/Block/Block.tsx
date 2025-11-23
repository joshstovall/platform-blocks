import React, { forwardRef } from 'react';
import { View } from 'react-native';
import { polymorphicFactory } from '../../core/factory';
import { extractSpacingProps, getSpacingStyles } from '../../core/utils/spacing';
import { getBlockStyles } from './utils';
import type { BlockFactory, BlockProps, BlockStyleProps } from './types';
import { useDirection } from '../../core/providers/DirectionProvider';

const BLOCK_STYLE_PROP_KEYS: Array<keyof BlockStyleProps> = [
  'bg',
  'radius',
  'borderWidth',
  'borderColor',
  'shadow',
  'opacity',
  'w',
  'h',
  'minW',
  'minH',
  'maxW',
  'maxH',
  'grow',
  'shrink',
  'basis',
  'direction',
  'align',
  'justify',
  'wrap',
  'gap',
  'position',
  'top',
  'right',
  'bottom',
  'left',
  'start',
  'end',
  'zIndex',
  'flex',
];

const BLOCK_STYLE_PROP_SET = new Set(BLOCK_STYLE_PROP_KEYS);

type BlockStyleKey = keyof BlockStyleProps;

const partitionBlockProps = (source: Record<string, any>) => {
  const style: Partial<BlockStyleProps> = {};
  const passthrough: Record<string, unknown> = {};

  Object.entries(source).forEach(([key, value]) => {
    if (BLOCK_STYLE_PROP_SET.has(key as BlockStyleKey)) {
      if (value !== undefined) {
        (style as Record<BlockStyleKey, unknown>)[key as BlockStyleKey] = value;
      }
      return;
    }

    passthrough[key] = value;
  });

  return { style, passthrough };
};

/**
 * Block - A polymorphic building block component
 * 
 * The Block component serves as a foundational building block that can replace View components
 * throughout the application. It provides a consistent API for styling, spacing, and layout
 * while supporting polymorphic rendering (can render as any HTML element or React component).
 * 
 * Key features:
 * - Polymorphic: Can render as any element via the `component` prop
 * - Spacing system: Supports margin/padding shorthand props (m, p, mx, py, etc.)
 * - Layout utilities: Flexbox, positioning, dimensions
 * - Theming: Consistent radius, shadow, and color values
 * - Accessibility: Full accessibility prop support
 * 
 * @example
 * ```tsx
 * // Basic usage
 * <Block bg="blue.500" p="md" radius="lg">
 *   Content
 * </Block>
 * 
 * // As a button
 * <Block component="button" bg="green.500" p="sm" radius="md">
 *   Click me
 * </Block>
 * 
 * // Flex layout
 * <Block direction="row" justify="space-between" align="center" gap="md">
 *   <Block>Item 1</Block>
 *   <Block>Item 2</Block>
 * </Block>
 * ```
 */
// Temporary simple implementation to avoid polymorphicFactory issues
export const Block = forwardRef<any, BlockProps>((props, ref) => {
  const { isRTL } = useDirection();
  // Extract spacing props from the rest
  const { spacingProps, otherProps } = extractSpacingProps(props);
  
  const {
    children,
    style,
    component = View,
    testID,
    accessibilityLabel,
    accessible,
    accessibilityRole,
    className,
    fluid,
    fullWidth,
    ...restProps
  } = otherProps;

  const { style: layoutProps, passthrough } = partitionBlockProps(restProps as Record<string, any>);
  const forwardedProps = passthrough as typeof restProps;

  const hasLayoutValues = fullWidth || Object.keys(layoutProps).length > 0;
  const blockStyles = hasLayoutValues
    ? getBlockStyles(
        {
          ...layoutProps,
          ...(fullWidth ? { w: 'full' as BlockStyleProps['w'] } : {}),
        } as BlockStyleProps,
        isRTL,
      )
    : undefined;

  // Generate styles from props
  const spacingStyles = getSpacingStyles(spacingProps);

  // Combine all styles
  const finalStyle = [
    blockStyles,
    spacingStyles,
    fluid && { flex: 1 }, // Apply flex: 1 if fluid prop is true
    style,
  ].filter(Boolean);

  // For React Native, always use View for default or string components
  if (component === View || component === 'div' || typeof component === 'string') {
    return (
      <View
        ref={ref}
        style={finalStyle}
        testID={testID}
        accessibilityLabel={accessibilityLabel}
        accessible={accessible}
        {...forwardedProps}
      >
        {children}
      </View>
    );
  }

  // For custom components, pass through props
  const Component = component as React.ElementType;
  return (
    <Component
      ref={ref}
      style={finalStyle}
      testID={testID}
      accessibilityLabel={accessibilityLabel}
      accessible={accessible}
      className={className}
      {...forwardedProps}
    >
      {children}
    </Component>
  );
});

Block.displayName = 'Block';