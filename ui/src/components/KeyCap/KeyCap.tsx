import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Platform } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  withSequence 
} from 'react-native-reanimated';

import { factory } from '../../core/factory';
import { 
  SpacingProps, 
  getSpacingStyles, 
  extractSpacingProps,
  LayoutProps,
  getLayoutStyles,
  extractLayoutProps 
} from '../../core/utils';
import { BorderRadiusProps, createRadiusStyles } from '../../core/theme/radius';
import { useTheme } from '../../core/theme';
import { useKeyCapStyles } from './styles';
import { KeyCapProps } from './types';

// Helper function to normalize key codes
const normalizeKeyCode = (key: string): string => {
  const keyMap: Record<string, string> = {
    ' ': 'Space',
    'Control': 'Ctrl',
    'Meta': 'Cmd',
    'Command': 'Cmd',
    'Option': 'Alt',
    'Alt': 'Alt',
    'Shift': 'Shift',
  };
  
  return keyMap[key] || key;
};

// Helper function to check if modifiers match
const checkModifiers = (
  event: KeyboardEvent,
  requiredModifiers: KeyCapProps['modifiers'] = []
): boolean => {
  const currentModifiers: string[] = [];
  
  if (event.ctrlKey) currentModifiers.push('ctrl');
  if (event.metaKey) currentModifiers.push('cmd', 'meta');
  if (event.altKey) currentModifiers.push('alt');
  if (event.shiftKey) currentModifiers.push('shift');
  
  // Check if all required modifiers are present
  return requiredModifiers.every(mod => currentModifiers.includes(mod));
};

export const KeyCap = factory<{
  props: KeyCapProps;
  ref: View;
}>((props, ref) => {
  const {
    children,
    size = 'md',
    variant = 'default',
    color = 'gray',
    animateOnPress = true,
    keyCode,
    modifiers,
    pressed: controlledPressed,
    onKeyPress,
    testID,
    ...rest
  } = props;

  const { spacingProps, otherProps: propsAfterSpacing } = extractSpacingProps(rest);
  const { layoutProps, otherProps: propsAfterLayout } = extractLayoutProps(propsAfterSpacing);
  const radiusProps = propsAfterLayout as BorderRadiusProps;

  // Animation values
  const pressedValue = useSharedValue(0);
  const [isPressed, setIsPressed] = useState(false);

  // Calculate final pressed state
  const finalPressed = controlledPressed ?? isPressed;

  // Get theme for web styling
  const theme = useTheme();

  // Get styles
  const styles = useKeyCapStyles({
    size,
    variant,
    color,
    pressed: finalPressed,
  });

  const spacingStyles = getSpacingStyles(spacingProps);
  const layoutStyles = getLayoutStyles(layoutProps);
  const radiusStyles = createRadiusStyles(radiusProps.radius);

  // Trigger press animation
  const triggerPressAnimation = useCallback(() => {
    if (!animateOnPress || Platform.OS !== 'web') return;

    pressedValue.value = withSequence(
      withTiming(1, { duration: 100 }),
      withTiming(0, { duration: 150 })
    );

    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 250);
  }, [animateOnPress, pressedValue]);

  // Handle key press events (Web only)
  useEffect(() => {
    if (Platform.OS !== 'web' || !keyCode || !animateOnPress) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const normalizedKey = normalizeKeyCode(event.key);
      const normalizedKeyCode = normalizeKeyCode(keyCode);

      // Perform case-insensitive comparison so either lowercase or uppercase letter triggers
      const keyMatch = normalizedKey.toLowerCase() === normalizedKeyCode.toLowerCase();
      if (keyMatch && checkModifiers(event, modifiers)) {
        triggerPressAnimation();
        onKeyPress?.();
      }
    };

    // Add event listener to window for global key detection
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', handleKeyDown);
      
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [keyCode, modifiers, animateOnPress, triggerPressAnimation, onKeyPress]);

  // Animated styles for press effect
  const animatedStyle = useAnimatedStyle(() => {
    const translateY = pressedValue.value * 2;
    const scale = 1 - (pressedValue.value * 0.05);
    
    return {
      transform: [
        { translateY },
        { scale },
      ],
    };
  });

  // Combine all styles
  const containerStyle = [
    styles.container,
    spacingStyles,
    layoutStyles,
    radiusStyles,
  ];

  // On web, render as kbd element for semantic HTML and better default styling
  if (Platform.OS === 'web') {
    return (
      <kbd
        ref={ref as any}
        style={{
          ...Object.assign({}, ...containerStyle),
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
          fontSize: styles.text.fontSize,
          fontWeight: '500',
          color: styles.text.color,
          lineHeight: 1,
          userSelect: 'none',
          cursor: 'default',
          // Enhanced keycap styling
          background: finalPressed 
            ? theme.colors.surface[3]
            : `linear-gradient(180deg, ${theme.colors.surface[1]} 0%, ${theme.colors.surface[2]} 50%, ${theme.colors.surface[3]} 100%)`,
          border: `1px solid ${theme.colors.surface[3]}`,
          borderBottomColor: theme.colors.surface[4],
          borderBottomWidth: finalPressed ? '1px' : '2px',
          borderRadius: '6px',
          boxShadow: finalPressed 
            ? 'inset 0 1px 2px rgba(0, 0, 0, 0.1)'
            : '0 1px 0 rgba(255, 255, 255, 0.5) inset, 0 1px 3px rgba(0, 0, 0, 0.1)',
          transform: finalPressed ? 'translateY(1px)' : 'translateY(0)',
          transition: 'all 0.1s ease',
        }}
        {...(testID && { 'data-testid': testID })}
      >
        {children}
      </kbd>
    );
  }

  return (
    <Animated.View
      ref={ref}
      style={[containerStyle, animatedStyle]}
      testID={testID}
    >
      <Text style={styles.text}>
        {children}
      </Text>
    </Animated.View>
  );
});

KeyCap.displayName = 'KeyCap';
