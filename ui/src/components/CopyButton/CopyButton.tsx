import React, { useCallback, useMemo } from 'react';
import { View, Pressable, Platform } from 'react-native';
import { IconButton } from '../IconButton';
import { Icon } from '../Icon/Icon';
import { useClipboard } from '../../hooks';
import { useToast } from '../Toast/ToastProvider';
import type { CopyButtonProps } from './types';
import { Tooltip } from '../Tooltip';

/**
 * Reusable copy control that uses useClipboard & toast toast.
 * Provides a quick consistent UX across components (CodeBlock, QRCode, etc).
 */
export function CopyButton({
  value,
  onCopy,
  iconOnly = true,
  label = 'Copy',
  size = 'md',
  style,
  tooltip,
  tooltipPosition = 'top',
  disableToast = false,
  toastTitle = 'Copied to clipboard',
  toastMessage,
  mode = 'button',
  buttonVariant = 'secondary',
  iconName = 'copy',
  copiedIconName = 'check',
  iconColor = '#202020ff',
  copiedIconColor = '#22c55e',
}: CopyButtonProps) {
  const { copy, copied } = useClipboard();

  const toast = useToast();

  const SIZE_MAP = useMemo(() => ({
    sm: { box: 28, icon: 18, font: 12 },
    md: { box: 32, icon: 22, font: 14 },
    lg: { box: 36, icon: 24, font: 16 },
  }), []);
  const dims = SIZE_MAP[size as keyof typeof SIZE_MAP] || SIZE_MAP.md;

  const truncate = useCallback((val: string, max = 60) => (
    val.length > max ? val.slice(0, max - 1) + '…' : val
  ), []);

  const effectiveMessage = toastMessage || truncate(value);
  const accLabel = copied ? 'Copied' : label;
  const tooltipLabel = tooltip || accLabel;
  const iconGlyph = copied ? copiedIconName : iconName;
  const iconTint = copied ? copiedIconColor : iconColor;
  const isIconMode = mode === 'icon';

  const handleCopy = useCallback(async () => {
    await copy(value);
    onCopy?.(value);
    if (
      Platform.OS === 'web' &&
      // only show if toast provider exists
      !!toast &&
      // only show if not disabled
      !disableToast
    ) {
      toast.show({
        title: toastTitle,
        message: effectiveMessage,
      });
    }
  }, [value, onCopy, disableToast, toast, toastTitle, effectiveMessage, copy]);

  if (isIconMode) {
    return (
      <Tooltip label={tooltipLabel} position={tooltipPosition}>
        <Pressable
          onPress={handleCopy}
          style={[{ width: dims.box, height: dims.box, alignItems: 'center', justifyContent: 'center' }, style]}
          accessibilityRole="button"
          accessibilityLabel={accLabel}
        >
          <Icon
            name={iconGlyph}
            size={dims.icon}
            color={iconTint}
            style={{ pointerEvents: 'none' }}
          />
        </Pressable>
      </Tooltip>
    );
  }

  return (
    <View style={style}>
      <IconButton
        onPress={handleCopy}
        size={size}
        variant={buttonVariant}
        icon={iconGlyph}
        iconColor={iconTint}
        accessibilityLabel={accLabel}
      />
    </View>
  );
}

CopyButton.displayName = 'CopyButton';
