import React, { useMemo } from 'react';
import { Platform, Pressable, View } from 'react-native';
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
}

// Size mapping for heights & spacing (tuned for sidebar / menus)
const SIZE_CONFIG = {
  xs: { fontSize: 'xs', padY: 4, padX: 8, gap: 6, radius: 4, minHeight: 30 },
  sm: { fontSize: 'sm', padY: 6, padX: 10, gap: 8, radius: 6, minHeight: 34 },
  md: { fontSize: 'sm', padY: 8, padX: 12, gap: 10, radius: 8, minHeight: 38 },
  lg: { fontSize: 'md', padY: 10, padX: 14, gap: 12, radius: 10, minHeight: 44 },
} as const;

export const MenuItemButton: React.FC<MenuItemButtonProps> = (allProps) => {
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
    ...restProps
  } = otherProps as MenuItemButtonProps & { [key: string]: any };

  const theme = useTheme();
  const { isRTL } = useDirection();
  const spacingStyles = getSpacingStyles(spacingProps);
  const cfg = SIZE_CONFIG[size] ?? SIZE_CONFIG.sm;
  const content = children || title;

  const colors = useMemo(() => {
    const base = {
      text: theme.text.primary,
      bg: 'transparent',
      hoverBg: theme.colors.gray[1],
      activeBg: theme.colors.primary[0],
      activeText: theme.colors.primary[6],
      dangerText: theme.colors.error[6],
      dangerHoverBg: theme.colors.error[0],
      dangerActiveBg: theme.colors.error[1],
    };
    if (danger) {
      return {
        ...base,
        text: base.dangerText,
        hoverBg: base.dangerHoverBg,
        activeBg: base.dangerActiveBg,
        activeText: base.dangerText,
      };
    }
    if (active) {
      return {
        ...base,
        bg: base.activeBg,
        text: base.activeText,
      };
    }
    return base;
  }, [theme, active, danger]);

  const horizontalPad = cfg.padX;
  const verticalPad = compact ? Math.max(2, cfg.padY - 4) : cfg.padY;

  return (
    <View style={[fullWidth && { width: '100%' }, spacingStyles]}>
      <Pressable
        disabled={disabled}
        onPress={disabled ? undefined : onPress}
        onPressIn={disabled ? undefined : onPressIn}
        onPressOut={disabled ? undefined : onPressOut}
        {...(Platform.OS === 'web' && onMouseDown ? { onMouseDown } : {})}
        style={({ pressed }) => [
          {
            flexDirection: isRTL ? 'row-reverse' : 'row',
            alignItems: 'center',
            minHeight: cfg.minHeight,
            paddingHorizontal: horizontalPad,
            paddingVertical: verticalPad,
            width: fullWidth ? '100%' : undefined,
            borderRadius: rounded ? 999 : cfg.radius,
            backgroundColor: pressed ? colors.activeBg : colors.bg,
            opacity: disabled ? 0.45 : 1,
            gap: cfg.gap,
          },
          active && !danger && !pressed && { backgroundColor: colors.activeBg },
          style
        ]}
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
              color={danger ? colors.text : active ? colors.text : theme.text.primary}
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
};

MenuItemButton.displayName = 'MenuItemButton';

export default MenuItemButton;
