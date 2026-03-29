import React, { useCallback, useMemo } from 'react';
import { View, Pressable, Platform } from 'react-native';
import { factory } from '../../core/factory';
import { useTheme } from '../../core/theme';
import { Text } from '../Text';
import { FieldHeader } from '../_internal/FieldHeader';
import { RadioProps, RadioGroupProps } from './types';
import { useRadioStyles } from './styles';
import { Icon } from '../Icon';
import { useDirection } from '../../core/providers/DirectionProvider';

const RADIO_ICON_SIZE_MAP: Record<string, number> = {
  xs: 14,
  sm: 16,
  md: 18,
  lg: 20,
  xl: 24,
  '2xl': 28,
  '3xl': 32,
};

export const Radio = factory<{
  props: RadioProps;
  ref: View;
}>((props, ref) => {
  const {
    value,
    checked = false,
    onChange,
    name,
    size = 'md',
    color = 'primary',
    label,
    disabled = false,
    required = false,
    error,
    description,
    labelPosition = 'right',
    children,
    testID,
    style,
    icon,
    onKeyDown,
    ...spacingProps
  } = props;

  const theme = useTheme();
  const { isRTL } = useDirection();
  const styles = useRadioStyles({
    checked,
    disabled,
    error: !!error,
    size,
    color,
    theme
  });

  const handlePress = useCallback(() => {
    if (disabled) return;
    onChange?.(value);
  }, [disabled, onChange, value]);

  const labelContent = children || label;

  const iconElement = useMemo(() => {
    if (!icon) return null;

    if (React.isValidElement(icon)) {
      return icon;
    }

    if (typeof icon === 'string') {
      const iconSize = RADIO_ICON_SIZE_MAP[size as keyof typeof RADIO_ICON_SIZE_MAP] || RADIO_ICON_SIZE_MAP.md;
      const iconColor = disabled ? theme.text.disabled : theme.text.primary;

      return (
        <Icon
          name={icon as any}
          size={iconSize}
          color={typeof iconColor === 'string' ? iconColor : undefined}
        />
      );
    }

    return null;
  }, [icon, size, disabled, theme]);

  // react-native-web exposes onKeyDown, but core RN types omit it so we inject it conditionally
  const webKeyEvents = Platform.OS === 'web' && onKeyDown ? { onKeyDown } : undefined;

  const radioElement = (
    <View style={styles.radioContainer}>
      <Pressable
        ref={ref}
        style={[styles.radio, style]}
        onPress={handlePress}
        {...(webKeyEvents as any)}
        disabled={disabled}
        testID={testID}
        hitSlop={12} // Increase hitbox by 12px on all sides
        accessibilityRole="radio"
        accessibilityState={{
          checked,
          disabled
        }}
        accessibilityLabel={typeof labelContent === 'string' ? labelContent : undefined}
      >
        <View style={styles.radioInner} />
      </Pressable>
    </View>
  );

  const labelElement = labelContent && (
    <Pressable
      style={[
        styles.labelContainer,
        (isRTL ? labelPosition === 'right' : labelPosition === 'left') && styles.labelContainerLeft,
      ]}
      onPress={handlePress}
      disabled={disabled}
      hitSlop={8}
    >
      <View style={styles.labelContent}>
        {iconElement && (
          <View style={styles.iconWrapper}>
            {iconElement}
          </View>
        )}
        <FieldHeader
          label={labelContent}
          description={!error ? description : undefined}
          required={required}
          withAsterisk={true}
          disabled={disabled}
          error={!!error}
          size={size as any}
        />
      </View>
      {error && (
        <Text style={styles.error} size="sm" selectable={false}>{error}</Text>
      )}
    </Pressable>
  );

  const containerStyle = [
    styles.container,
    (isRTL ? labelPosition === 'right' : labelPosition === 'left') && styles.containerReverse,
  ];

  // Swap label positions in RTL
  const effectiveLabelPosition = labelPosition === 'left' && isRTL ? 'right' : labelPosition === 'right' && isRTL ? 'left' : labelPosition;

  return (
    <View style={containerStyle}>
      {effectiveLabelPosition === 'left' && labelElement}
      {radioElement}
      {effectiveLabelPosition === 'right' && labelElement}
    </View>
  );
});

export const RadioGroup = factory<{
  props: RadioGroupProps;
  ref: View;
}>((props, ref) => {
  const {
    options,
    value,
    onChange,
    name,
    orientation = 'vertical',
    size = 'md',
    color = 'primary',
    label,
    disabled = false,
    required = false,
    error,
    description,
    gap = 8,
    testID,
    style,
    ...spacingProps
  } = props;

  const theme = useTheme();

  const handleChange = useCallback((optionValue: string) => {
    if (disabled) return;
    onChange?.(optionValue);
  }, [disabled, onChange]);

  const handleKeyNavigation = useCallback((event: any, currentIndex: number) => {
    if (disabled) return;

    const key = event?.nativeEvent?.key || event?.key;
    if (!key) return;

    const forwardKeys = ['ArrowRight', 'ArrowDown'];
    const backwardKeys = ['ArrowLeft', 'ArrowUp'];

    let step = 0;
    if (forwardKeys.includes(key)) {
      step = 1;
    } else if (backwardKeys.includes(key)) {
      step = -1;
    } else {
      return;
    }

    event?.preventDefault?.();

    const total = options.length;
    for (let offset = 1; offset <= total; offset += 1) {
      const nextIndex = (currentIndex + step * offset + total) % total;
      if (nextIndex === currentIndex) {
        break;
      }

      const option = options[nextIndex];
      if (!(disabled || option.disabled)) {
        handleChange(option.value);
        break;
      }
    }
  }, [disabled, options, handleChange]);

  const gapValue = typeof gap === 'number' ? gap : 
    theme.spacing[gap as keyof typeof theme.spacing] ? 
    parseInt(theme.spacing[gap as keyof typeof theme.spacing]) : 8;

  const groupStyle = {
    flexDirection: orientation === 'horizontal' ? 'row' : 'column',
    gap: gapValue,
  } as const;

  return (
    <View ref={ref} style={style} testID={testID}>
      {label && (
        <Text
          style={[
            { marginBottom: 8 },
            disabled && { color: theme.text.disabled }
          ]}
          size={size}
        >
          {label}
          {required && (
            <Text style={{ color: theme.colors.error[6] }}>
              {' *'}
            </Text>
          )}
        </Text>
      )}
      
      {description && !error && (
        <Text 
          style={{ color: theme.text.secondary, marginBottom: 8 }} 
          size="sm"
        >
          {description}
        </Text>
      )}
      
      <View 
        style={groupStyle}
        accessibilityRole="radiogroup"
        accessibilityLabel={typeof label === 'string' ? label : undefined}
      >
        {options.map((option, index) => (
          <Radio
            key={option.value}
            value={option.value}
            checked={value === option.value}
            onChange={handleChange}
            onKeyDown={(event: any) => handleKeyNavigation(event, index)}
            name={name}
            size={size}
            color={color}
            label={option.label}
            disabled={disabled || option.disabled}
            description={option.description}
            icon={option.icon}
            testID={`${testID}-option-${index}`}
          />
        ))}
      </View>
      
      {error && (
        <Text 
          style={{ color: theme.colors.error[6], marginTop: 8 }} 
          size="sm"
        >
          {error}
        </Text>
      )}
    </View>
  );
});

Radio.displayName = 'Radio';
RadioGroup.displayName = 'RadioGroup';
