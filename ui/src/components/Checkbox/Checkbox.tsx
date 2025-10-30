import React, { useCallback, useState, useEffect } from 'react';
import { View, Pressable } from 'react-native';
import { useTheme } from '../../core/theme';
import { Text } from '../Text';
import { FieldHeader } from '../_internal/FieldHeader';
import { Icon } from '../Icon';
import { CheckboxProps } from './types';
import { useCheckboxStyles } from './styles';
import { Row, Column } from '../Layout';
import { useDirection } from '../../core/providers/DirectionProvider';

export const Checkbox = React.forwardRef<View, CheckboxProps>((props, ref) => {
  const {
    checked,
    defaultChecked = false,
    onChange,
    indeterminate = false,
    color,
    colorVariant = 'primary',
    size = 'md',
    label,
    disabled = false,
    required = false,
    error,
    description,
    icon,
    indeterminateIcon,
    labelPosition = 'right',
    children,
    testID,
    style,
    ...spacingProps
  } = props;

  const theme = useTheme();
  const { isRTL } = useDirection();
  const [internalChecked, setInternalChecked] = useState<boolean>(defaultChecked);

  // Determine if controlled
  const isControlled = typeof checked === 'boolean';
  const effectiveChecked = isControlled ? !!checked : internalChecked;

  // Sync internal when switching from uncontrolled to controlled (edge case)
  useEffect(() => {
    if (isControlled) {
      // no-op sync; could add logic if needed
    }
  }, [isControlled, checked]);

  // Resolve color from colorVariant or direct color prop
  const resolveColor = () => {
    // Direct color prop takes precedence
    if (color) {
      return color;
    }

    // Fall back to colorVariant
    if (colorVariant && (theme.colors as any)[colorVariant]) {
      const colorPalette = (theme.colors as any)[colorVariant];
      return colorPalette[5] || colorPalette[0] || colorPalette;
    }

    // Default fallback
    return theme.colors.primary[5];
  };

  const resolvedColor = resolveColor();

  const styles = useCheckboxStyles({
    checked: effectiveChecked,
    indeterminate,
    disabled,
    error: !!error,
    size,
    color: resolvedColor,
    colorVariant,
    labelPosition,
    theme
  });

  const handlePress = useCallback(() => {
    if (disabled) return;
    const next = indeterminate ? true : !effectiveChecked;
    if (!isControlled) setInternalChecked(next);
    onChange?.(next);
  }, [effectiveChecked, indeterminate, disabled, isControlled, onChange]);

  const renderCheckIcon = () => {
    if (indeterminate) {
      return indeterminateIcon || (
        <Icon
          name="minus"
          size={size}
          color={disabled ? theme.text.disabled : theme.text.onPrimary || 'white'}
        />
      );
    }

    if (effectiveChecked) {
      return icon || (
        <Icon
          name="check"
          size={size}
          color={disabled ? theme.text.disabled : theme.text.onPrimary || 'white'}
        />
      );
    }

    return null;
  };

  const labelContent = children || label;

  // Determine layout direction based on label position
  const isVertical = labelPosition === 'top' || labelPosition === 'bottom';

  const checkboxElement = (
    <View style={styles.checkboxContainer}>
      <Pressable
        ref={ref}
        style={[styles.checkbox, style]}
        onPress={handlePress}
        disabled={disabled}
        testID={testID}
        hitSlop={12} // Increase hitbox by 12px on all sides
        accessibilityRole="checkbox"
        accessibilityState={{
          checked: indeterminate ? 'mixed' : effectiveChecked,
          disabled
        }}
        accessibilityLabel={typeof labelContent === 'string' ? labelContent : undefined}
      >
        <View style={styles.checkboxInner}>
          {renderCheckIcon()}
        </View>
      </Pressable>
    </View>
  );

  const labelElement = labelContent && (
    <Pressable
      style={styles.labelContainer}
      onPress={handlePress}
      disabled={disabled}
      hitSlop={8}
    >
      <FieldHeader
        label={labelContent}
        description={!error ? description : undefined}
        required={required}
        withAsterisk={true}
        disabled={disabled}
        error={!!error}
        size={size as any}
        marginBottom={isVertical ? 0 : (error ? 2 : undefined)}
      />
      {error && (
        <Text style={styles.error} size="sm" selectable={false}>{error}</Text>
      )}
    </Pressable>
  );

  const containerStyle = [
    styles.container,
  ];

  // Use the already defined isVertical variable
  const LayoutComponent = isVertical ? Column : Row;

  // For vertical layouts (top/bottom), we want tighter spacing and center alignment
  const layoutProps = isVertical
    ? { gap: 'xs' as const, align: 'center' as const }
    : { gap: 'sm' as const, align: 'center' as const };

  // Swap label positions in RTL
  const effectiveLabelPosition = (() => {
    if (labelPosition === 'left') return isRTL ? 'right' : 'left';
    if (labelPosition === 'right') return isRTL ? 'left' : 'right';
    return labelPosition;
  })();

  return (
    <LayoutComponent {...layoutProps}>
      {effectiveLabelPosition === 'top' && labelElement}
      {effectiveLabelPosition === 'left' && labelElement}
      {checkboxElement}
      {effectiveLabelPosition === 'right' && labelElement}
      {effectiveLabelPosition === 'bottom' && labelElement}
    </LayoutComponent>
  );
});

Checkbox.displayName = 'Checkbox';
