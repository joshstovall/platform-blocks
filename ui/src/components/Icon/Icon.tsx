import React from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { factory } from '../../core/factory';
import { getIconSize } from '../../core/theme/sizes';
import { useTheme } from '../../core/theme/ThemeProvider';
// Avoid CSS variable colors on native; prefer theme colors directly
import { getSpacingStyles } from '../../core/utils/spacing';
import { iconRegistry, registerIcons } from './registry';
import { navigationIcons } from './icons/navigation';
import { actionIcons } from './icons/actions';
import { uiIcons } from './icons/ui';
import { statusIcons } from './icons/status';
import { platformIcons } from './icons/platforms';
import { multimediaIcons } from './icons/multimedia';
import {dataIcons} from './icons/data';
import type { IconProps } from './types';
import { useDirection } from '../../core/providers/DirectionProvider';
import { shouldMirrorIcon } from '../../core/utils/rtl';

// Initialize icons on first import
let iconsInitialized = false;
const initializeIcons = () => {
  if (!iconsInitialized) {
    registerIcons({
      ...navigationIcons,
      ...actionIcons,
      ...uiIcons,
      ...statusIcons,
      ...dataIcons,
      ...platformIcons,
      ...multimediaIcons,
    });
    iconsInitialized = true;
  }
};

export const Icon = factory<{
  props: IconProps;
  ref: View;
}>((props, ref) => {
  const {
    name,
    size = 'md',
    color,
    stroke = 1.5,
    variant,
    style,
    label,
    decorative = false,
    mirrorInRTL,
    ...spacingProps
  } = props;
  
  const theme = useTheme();
  const { isRTL } = useDirection();
  
  // Initialize icons if not already done
  initializeIcons();
  
  // Resolve size using UI package size system
  const resolvedSize = getIconSize(size);
  
  // Use explicit color if provided; otherwise fall back to theme token
  const resolvedColor = color
    || (theme?.text?.primary
      || (theme as any)?.colors?.gray?.[8]
      || '#333333');
  
  // Get spacing styles
  const spacingStyle = getSpacingStyles(spacingProps);
  
  // Determine if icon should be mirrored
  const shouldMirror = mirrorInRTL !== undefined 
    ? mirrorInRTL 
    : shouldMirrorIcon(name, isRTL);
  const applyMirror = isRTL && shouldMirror;
  
  // Get icon from registry
  const iconDef = iconRegistry[name];
  
  if (!iconDef) {
    // Return empty view for missing icons in production
    if (process.env.NODE_ENV === 'production') {
      return <View ref={ref} style={[{ width: resolvedSize, height: resolvedSize }, spacingStyle, style]} />;
    }
    // Show warning in development
    console.warn(`Icon "${name}" not found in registry`);
    return (
      <View 
        ref={ref}
        style={[
          { 
            width: resolvedSize, 
            height: resolvedSize, 
            backgroundColor: (theme as any)?.colors?.error?.[5] || '#ff0000', 
            opacity: 0.3 
          }, 
          spacingStyle,
          style
        ]} 
      />
    );
  }

  const {
    content,
    viewBox = '0 0 24 24',
    variant: defaultVariant = 'outlined',
    preserveStrokeOnFill = false,
  } = iconDef;
  
  // Use provided variant or fall back to icon's default variant
  const resolvedVariant = variant || defaultVariant;
  
  // Handle string content (SVG path)
  if (typeof content === 'string') {
    const isFilled = resolvedVariant === 'filled';
    
    // Calculate stroke width scaled to icon size
    // Base stroke width is designed for 24x24, scale it proportionally
    const scaledStrokeWidth = stroke * (resolvedSize / 24);
    const fillColor = isFilled ? resolvedColor : 'none';
    const strokeColor = isFilled && !preserveStrokeOnFill ? 'none' : resolvedColor;
    const appliedStrokeWidth = isFilled && !preserveStrokeOnFill ? 0 : scaledStrokeWidth;
    
    // Apply mirror transform if needed
    const containerStyle = [
      { width: resolvedSize, height: resolvedSize },
      applyMirror && { transform: [{ scaleX: -1 }] },
      spacingStyle,
      style
    ];
    
    return (
      <View ref={ref} style={containerStyle}>
        <Svg
          width="100%"
          height="100%"
          viewBox={viewBox}
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth={appliedStrokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          accessibilityLabel={decorative ? undefined : label || `${name} icon`}
          accessibilityRole={decorative ? 'none' : 'image'}
        >
          <Path
            d={content}
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth={appliedStrokeWidth}
          />
        </Svg>
      </View>
    );
  }
  
  // Handle component content
  const IconComponent = content;
  const componentStyle = [
    applyMirror && { transform: [{ scaleX: -1 }] },
    spacingStyle,
    style
  ];
  
  return (
    <IconComponent
      ref={ref}
      width={resolvedSize}
      height={resolvedSize}
      color={resolvedColor}
      strokeWidth={stroke}
      stroke={stroke}
      style={componentStyle}
      accessibilityLabel={decorative ? undefined : label || `${name} icon`}
    />
  );
});