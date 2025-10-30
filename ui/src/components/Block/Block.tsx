import React, { forwardRef } from 'react';
import { View } from 'react-native';
import { polymorphicFactory } from '../../core/factory';
import { extractSpacingProps, getSpacingStyles } from '../../core/utils/spacing';
import { getBlockStyles } from './utils';
import type { BlockFactory, BlockProps } from './types';
import { useDirection } from '../../core/providers/DirectionProvider';

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
      // Extract style props
      bg,
      radius,
      borderWidth,
      borderColor,
      shadow,
      opacity,
      w,
      h,
      fullWidth,
      fluid,
      minW,
      minH,
      maxW,
      maxH,
      grow,
      shrink,
      basis,
      direction,
      align,
      justify,
      wrap,
      gap,
      position,
      top,
      right,
      bottom,
      left,
      start,
      end,
      zIndex,
      flex,
      ...restProps
    } = otherProps;

    // Generate styles from props
    const spacingStyles = getSpacingStyles(spacingProps);
    const blockStyles = getBlockStyles({
      bg,
      radius,
      borderWidth,
      borderColor,
      shadow,
      opacity,
      w: fullWidth ? 'full' : w,
      h,
      minW,
      minH,
      maxW,
      maxH,
      grow,
      shrink,
      basis,
      direction,
      align,
      justify,
      wrap,
      gap,
      position,
      top,
      right,
      bottom,
      left,
      start,
      end,
      zIndex,
      flex,
    }, isRTL);

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
          {...restProps}
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
        {...restProps}
      >
        {children}
      </Component>
    );
  });

Block.displayName = 'Block';