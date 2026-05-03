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
import { getControlIconSize } from '../../core/theme/sizes';

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
    labelProps,
    descriptionProps,
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
      const iconSize = getControlIconSize(size);
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

  const labelElement = labelContent ? (
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
        {iconElement ? (
          <View style={styles.iconWrapper}>
            {iconElement}
          </View>
        ) : null}
        <FieldHeader
          label={labelContent}
          description={!error ? description : undefined}
          required={required}
          withAsterisk={true}
          disabled={disabled}
          error={!!error}
          size={size as any}
          labelProps={labelProps}
          descriptionProps={descriptionProps}
        />
      </View>
      {error ? (
        <Text style={styles.error} size="sm" selectable={false}>{error}</Text>
      ) : null}
    </Pressable>
  ) : null;

  // Swap label positions in RTL so 'right' always means visual right
  const effectiveLabelPosition = isRTL
    ? (labelPosition === 'left' ? 'right' : 'left')
    : labelPosition;

  return (
    <View style={styles.container}>
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
    variant = 'default',
    size = 'md',
    color = 'primary',
    label,
    disabled = false,
    required = false,
    error,
    description,
    gap = 8,
    labelPosition,
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

  // `segmented` is always horizontal (joined buttons); `chip` wraps so
  // direction is implicit. Other variants honor the prop.
  const effectiveOrientation = variant === 'segmented' ? 'horizontal' : orientation;

  // Variant-driven color tokens are only consumed by `renderOptionButton`,
  // which itself only runs for non-default variants. Guarding the lookups
  // means the `default` path doesn't depend on `theme.backgrounds` etc.
  // (matters for tests that mock a slim theme).
  const variantColors = variant === 'default' ? null : (() => {
    const map: Record<string, any> = {
      primary: theme.colors.primary,
      secondary: theme.colors.secondary,
      success: theme.colors.success,
      warning: theme.colors.warning,
      error: theme.colors.error,
      gray: theme.colors.gray,
    };
    const palette = map[color as string] || theme.colors.primary;
    return {
      accentColor: palette[6] as string,
      accentTint: (theme.colorScheme === 'dark' ? palette[9] : palette[0]) as string,
      surfaceColor: (theme.backgrounds?.surface ?? '#ffffff') as string,
      subtleBorder: theme.colors.gray[3] as string,
    };
  })();

  const renderOptionButton = (
    option: RadioGroupProps['options'][number],
    index: number,
    selected: boolean,
    optDisabled: boolean,
  ) => {
    // Caller (the options.map below) only invokes this for non-default variants.
    const { accentColor, accentTint, surfaceColor, subtleBorder } = variantColors!;
    const baseTextColor = selected
      ? (variant === 'chip' || variant === 'segmented' ? '#fff' : accentColor)
      : (optDisabled ? theme.text.disabled : theme.text.primary);

    let containerStyle: any;
    if (variant === 'card') {
      containerStyle = {
        flex: orientation === 'horizontal' ? 1 : undefined,
        paddingVertical: 12,
        paddingHorizontal: 14,
        borderWidth: 1,
        borderRadius: 8,
        borderColor: selected ? accentColor : subtleBorder,
        backgroundColor: selected ? accentTint : surfaceColor,
        opacity: optDisabled ? 0.5 : 1,
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 10,
      };
    } else if (variant === 'segmented') {
      const isFirst = index === 0;
      const isLast = index === options.length - 1;
      containerStyle = {
        flex: 1,
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: selected ? accentColor : 'transparent',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderLeftWidth: isFirst ? 1 : 0,
        borderRightWidth: 1,
        borderColor: selected ? accentColor : subtleBorder,
        borderTopLeftRadius: isFirst ? 8 : 0,
        borderBottomLeftRadius: isFirst ? 8 : 0,
        borderTopRightRadius: isLast ? 8 : 0,
        borderBottomRightRadius: isLast ? 8 : 0,
        opacity: optDisabled ? 0.5 : 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 6,
      };
    } else {
      // chip
      containerStyle = {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: selected ? accentColor : subtleBorder,
        backgroundColor: selected ? accentColor : 'transparent',
        opacity: optDisabled ? 0.5 : 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
      };
    }

    return (
      <Pressable
        key={option.value}
        onPress={() => !optDisabled && handleChange(option.value)}
        disabled={optDisabled}
        accessibilityRole="radio"
        accessibilityState={{ checked: selected, disabled: optDisabled }}
        accessibilityLabel={typeof option.label === 'string' ? option.label : undefined}
        testID={`${testID}-option-${index}`}
        style={containerStyle}
        {...(Platform.OS === 'web' ? { onKeyDown: (event: any) => handleKeyNavigation(event, index) } : null)}
      >
        {option.icon ? (
          <View style={{ marginTop: variant === 'card' ? 2 : 0 }}>
            {React.isValidElement(option.icon)
              ? option.icon
              : typeof option.icon === 'string'
                ? <Icon name={option.icon as any} size={getControlIconSize(size)} color={typeof baseTextColor === 'string' ? baseTextColor : undefined} />
                : null}
          </View>
        ) : null}

        <View style={{ flex: variant === 'card' ? 1 : undefined }}>
          <Text
            size={size as any}
            style={{ color: baseTextColor, fontWeight: selected && variant !== 'card' ? '600' : '400' }}
            selectable={false}
          >
            {option.label}
          </Text>
          {variant === 'card' && option.description ? (
            <Text size="sm" style={{ color: theme.text.secondary, marginTop: 2 }} selectable={false}>
              {option.description}
            </Text>
          ) : null}
        </View>

        {variant === 'card' && selected ? (
          <Icon name="check" size={getControlIconSize(size)} color={accentColor} />
        ) : null}
      </Pressable>
    );
  };

  const groupStyle =
    variant === 'chip'
      ? { flexDirection: 'row' as const, flexWrap: 'wrap' as const, gap: gapValue }
      : variant === 'segmented'
        ? { flexDirection: 'row' as const } // segmented joins, no gap
        : { flexDirection: effectiveOrientation === 'horizontal' ? 'row' as const : 'column' as const, gap: gapValue };

  return (
    <View ref={ref} style={style} testID={testID}>
      {label ? (
        <Text
          style={[
            { marginBottom: 8 },
            disabled && { color: theme.text.disabled }
          ]}
          size={size}
        >
          {label}
          {required ? (
            <Text style={{ color: theme.colors.error[6] }}>
              {' *'}
            </Text>
          ) : null}
        </Text>
      ) : null}

      {description && !error ? (
        <Text
          style={{ color: theme.text.secondary, marginBottom: 8 }}
          size="sm"
        >
          {description}
        </Text>
      ) : null}

      <View
        style={groupStyle}
        accessibilityRole="radiogroup"
        accessibilityLabel={typeof label === 'string' ? label : undefined}
      >
        {variant === 'default'
          ? options.map((option, index) => (
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
                labelPosition={labelPosition}
                testID={`${testID}-option-${index}`}
              />
            ))
          : options.map((option, index) =>
              renderOptionButton(
                option,
                index,
                value === option.value,
                disabled || !!option.disabled,
              ),
            )}
      </View>

      {error ? (
        <Text
          style={{ color: theme.colors.error[6], marginTop: 8 }}
          size="sm"
        >
          {error}
        </Text>
      ) : null}
    </View>
  );
});

Radio.displayName = 'Radio';
RadioGroup.displayName = 'RadioGroup';
