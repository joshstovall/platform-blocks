import React, { forwardRef, useMemo, useState, useCallback } from 'react';
import { Platform, Pressable, View } from 'react-native';
import type { PressableProps } from 'react-native';
import type { GestureResponderEvent } from 'react-native';
import { Text } from '../Text';
import { useTheme } from '../../core/theme';
import { getSpacingStyles, extractSpacingProps, SpacingProps } from '../../core/utils';
import { useDirection } from '../../core/providers/DirectionProvider';

export interface MenuItemButtonProps extends SpacingProps {
  /** Text label (alternative to children) */
  title?: string;
  /** Custom content */
  children?: React.ReactNode;
  /** Leading icon */
  startIcon?: React.ReactNode;
  /** Trailing icon / shortcut hint */
  endIcon?: React.ReactNode;
  /** Click handler */
  onPress?: () => void;
  /** Whether the button is disabled */
  disabled?: boolean;
  /** Whether the button is active (selected) */
  active?: boolean;
  /** Whether the button has destructive styling */
  danger?: boolean;
  /** Whether the button should take up full width */
  fullWidth?: boolean;
  /** Size of the button */
  size?: 'xs' | 'sm' | 'md' | 'lg';
  /** Whether to use compact styling */
  compact?: boolean;
  /** Whether to use fully rounded corners */
  rounded?: boolean;
  /** Custom styles override */
  style?: any;
  /** Callback fired when press starts */
  onPressIn?: (event: GestureResponderEvent) => void;
  /** Callback fired when press ends */
  onPressOut?: (event: GestureResponderEvent) => void;
  /** Web-only mouse down handler */
  onMouseDown?: (event: any) => void;
  /** Web-only mouse enter handler */
  onMouseEnter?: (event: any) => void;
  /** Web-only mouse leave handler */
  onMouseLeave?: (event: any) => void;
  /** Pointer hover start handler (web) */
  onHoverIn?: PressableProps['onHoverIn'];
  /** Pointer hover end handler (web) */
  onHoverOut?: PressableProps['onHoverOut'];
  /** Focus handler */
  onFocus?: PressableProps['onFocus'];
  /** Blur handler */
  onBlur?: PressableProps['onBlur'];
  /** Semantic tone for menu styling */
  tone?: 'default' | 'danger' | 'success' | 'warning';
  /** Tone to apply when hovered */
  hoverTone?: 'default' | 'danger' | 'success' | 'warning';
  /** Tone to apply when active/pressed */
  activeTone?: 'default' | 'danger' | 'success' | 'warning';
  /** Override text color for base state */
  textColor?: string;
  /** Override text color when hovered */
  hoverTextColor?: string;
  /** Override text color when active */
  activeTextColor?: string;
  /** Test identifier forwarded to Pressable */
  testID?: string;
}

// Size mapping for heights & spacing (tuned for sidebar / menus)
const SIZE_CONFIG = {
  xs: { fontSize: 'xs', padY: 4, padX: 8, gap: 6, radius: 4, minHeight: 30 },
  sm: { fontSize: 'sm', padY: 6, padX: 10, gap: 8, radius: 6, minHeight: 34 },
  md: { fontSize: 'sm', padY: 8, padX: 12, gap: 10, radius: 8, minHeight: 38 },
  lg: { fontSize: 'md', padY: 10, padX: 14, gap: 12, radius: 10, minHeight: 44 },
} as const;

export const MenuItemButton = forwardRef<View, MenuItemButtonProps>((allProps, ref) => {
  const { spacingProps, otherProps } = extractSpacingProps(allProps);
  const {
    title,
    children,
    startIcon,
    endIcon,
    onPress,
    disabled = false,
    active = false,
    danger = false,
    fullWidth = true,
    size = 'sm',
    compact = false,
    rounded = false,
    style,
    onPressIn,
    onPressOut,
    onMouseDown,
  onMouseEnter,
  onMouseLeave,
    onHoverIn,
    onHoverOut,
    onFocus,
    onBlur,
    tone,
    hoverTone,
    activeTone,
    textColor: textColorOverride,
    hoverTextColor: hoverTextColorOverride,
    activeTextColor: activeTextColorOverride,
    testID,
    ...restProps
  } = otherProps as MenuItemButtonProps & { [key: string]: any };

  const theme = useTheme();
  const { isRTL } = useDirection();
  const spacingStyles = getSpacingStyles(spacingProps);
  const cfg = SIZE_CONFIG[size] ?? SIZE_CONFIG.sm;
  const content = children || title;
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const resolveTone = useCallback((toneKey?: 'default' | 'danger' | 'success' | 'warning') => {
    if (danger) return 'danger' as const;
    return toneKey ?? 'default';
  }, [danger]);

  const getPalette = useCallback((toneKey: 'default' | 'danger' | 'success' | 'warning') => {
    const isDark = theme.colorScheme === 'dark';
    switch (toneKey) {
      case 'danger':
        return {
          text: theme.colors.error[6],
          bg: 'transparent',
          hoverBg: isDark ? theme.colors.error[3] : theme.colors.error[0],
          activeBg: isDark ? theme.colors.error[4] : theme.colors.error[1],
          activeText: theme.colors.error[6],
        };
      case 'success':
        return {
          text: isDark ? theme.colors.success[2] : theme.colors.success[6],
          bg: 'transparent',
          hoverBg: isDark ? theme.colors.success[4] : theme.colors.success[0],
          activeBg: isDark ? theme.colors.success[5] : theme.colors.success[1],
          activeText: isDark ? theme.colors.success[2] : theme.colors.success[6],
        };
      case 'warning':
        return {
          text: isDark ? theme.colors.warning[2] : theme.colors.warning[6],
          bg: 'transparent',
          hoverBg: isDark ? theme.colors.warning[4] : theme.colors.warning[0],
          activeBg: isDark ? theme.colors.warning[5] : theme.colors.warning[1],
          activeText: isDark ? theme.colors.warning[2] : theme.colors.warning[6],
        };
      default:
        return {
          text: theme.text.primary,
          bg: 'transparent',
          hoverBg: isDark ? theme.colors.gray[3] : theme.colors.gray[1],
          activeBg: isDark ? theme.colors.primary[4] : theme.colors.primary[0],
          activeText: isDark ? (theme.text.onPrimary ?? theme.text.primary) : theme.colors.primary[6],
        };
    }
  }, [theme]);

  const baseTone = resolveTone(tone);
  const hoverToneResolved = resolveTone(hoverTone);
  const activeToneResolved = resolveTone(activeTone ?? tone);

  const basePalette = useMemo(() => getPalette(baseTone), [baseTone, getPalette]);
  const hoverPalette = useMemo(() => getPalette(hoverToneResolved), [hoverToneResolved, getPalette]);
  const activePalette = useMemo(() => getPalette(activeToneResolved), [activeToneResolved, getPalette]);

  const buttonBaseStyle = useMemo(() => ({
    flexDirection: isRTL ? 'row-reverse' : 'row',
    alignItems: 'center',
    minHeight: cfg.minHeight,
    paddingHorizontal: cfg.padX,
    paddingVertical: compact ? Math.max(2, cfg.padY - 4) : cfg.padY,
    width: fullWidth ? '100%' : undefined,
    borderRadius: rounded ? 999 : cfg.radius,
    opacity: disabled ? 0.45 : 1,
    gap: cfg.gap,
    backgroundColor: basePalette.bg,
  }), [isRTL, cfg, compact, fullWidth, rounded, disabled, basePalette.bg]);

  const handlePressIn = useCallback((event: GestureResponderEvent) => {
    if (!disabled) setIsPressed(true);
    onPressIn?.(event);
  }, [disabled, onPressIn]);

  const handlePressOut = useCallback((event: GestureResponderEvent) => {
    if (!disabled) setIsPressed(false);
    onPressOut?.(event);
  }, [disabled, onPressOut]);

  const handleHoverIn = useCallback((event: any) => {
    if (!disabled) setIsHovered(true);
    onHoverIn?.(event);
  }, [disabled, onHoverIn]);

  const handleHoverOut = useCallback((event: any) => {
    if (!disabled) setIsHovered(false);
    onHoverOut?.(event);
  }, [disabled, onHoverOut]);

  const handleMouseEnter = useCallback((event: any) => {
    if (!disabled) setIsHovered(true);
    onMouseEnter?.(event);
  }, [disabled, onMouseEnter]);

  const handleMouseLeave = useCallback((event: any) => {
    if (!disabled) setIsHovered(false);
    onMouseLeave?.(event);
  }, [disabled, onMouseLeave]);

  const isActive = active || isPressed;
  const baseText = textColorOverride ?? basePalette.text;
  const hoverText = hoverTextColorOverride ?? hoverPalette.text;
  const activeText = activeTextColorOverride ?? activePalette.activeText;

  const textColor = disabled
    ? theme.text.disabled
    : isActive
      ? activeText
      : isHovered
        ? hoverText
        : baseText;

  return (
    <View ref={ref} style={[fullWidth && { width: '100%' }, spacingStyles]}>
      <Pressable
        disabled={disabled}
        onPress={disabled ? undefined : onPress}
        onPressIn={disabled ? undefined : handlePressIn}
        onPressOut={disabled ? undefined : handlePressOut}
        {...(Platform.OS === 'web' && onMouseDown ? { onMouseDown } : {})}
        {...(Platform.OS === 'web' ? { onMouseEnter: handleMouseEnter, onMouseLeave: handleMouseLeave } : {})}
        onHoverIn={handleHoverIn}
        onHoverOut={handleHoverOut}
        onFocus={onFocus}
        onBlur={onBlur}
        testID={testID}
        style={(pressableState) => {
          const { pressed } = pressableState;
          const hovered = (pressableState as any).hovered || isHovered;
          const effectiveActive = isActive || pressed;
          return [
            buttonBaseStyle,
            !disabled && effectiveActive && { backgroundColor: activePalette.activeBg },
            !disabled && !effectiveActive && hovered && { backgroundColor: hoverPalette.hoverBg },
            style
          ];
        }}
        {...restProps}
      >
        {startIcon && (
          <View style={{ opacity: disabled ? 0.6 : 1 }}>
            {startIcon}
          </View>
        )}
        {content && (
          typeof content === 'string' ? (
            <Text
              size={cfg.fontSize as any}
              weight={active ? '600' : '500'}
              color={textColor}
              style={{ flex: 1, overflow: 'hidden' }}
            >
              {content}
            </Text>
          ) : content
        )}
        {endIcon && (
          <View style={isRTL ? { marginRight: cfg.gap, opacity: disabled ? 0.6 : 1 } : { marginLeft: cfg.gap, opacity: disabled ? 0.6 : 1 }}>
            {endIcon}
          </View>
        )}
      </Pressable>
    </View>
  );
});

MenuItemButton.displayName = 'MenuItemButton';

export default MenuItemButton;
