import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { View, Pressable, Platform } from 'react-native';
import { Input } from '../Input';
import { Icon } from '../Icon';
import { NumberInputProps } from './types';
import { ExtendedTextInputProps } from '../Input/types';
import { factory } from '../../core/factory';
import { useTheme } from '../../core/theme';

const DEFAULT_DECIMAL_SEPARATOR = '.';
const DEFAULT_STEP_DELAY = 500;
const DEFAULT_STEP_INTERVAL = 100;

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const getCurrencySymbol = (currency: string) => {
  try {
    const formatter = new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency,
      currencyDisplay: 'narrowSymbol',
    });
    const parts = formatter.formatToParts(0);
    return parts.find(part => part.type === 'currency')?.value ?? '';
  } catch {
    return '';
  }
};

const groupThousands = (
  intPart: string,
  separator: string | undefined,
  style: 'none' | 'thousand' | 'lakh' | 'wan'
) => {
  if (!separator || style === 'none') {
    return intPart;
  }

  const part = intPart === '' ? '0' : intPart;

  switch (style) {
    case 'lakh': {
      if (part.length <= 3) return part;
      const lastThree = part.slice(-3);
      let remaining = part.slice(0, -3);
      const groups: string[] = [];
      while (remaining.length > 2) {
        groups.unshift(remaining.slice(-2));
        remaining = remaining.slice(0, -2);
      }
      if (remaining.length) {
        groups.unshift(remaining);
      }
      return `${groups.join(separator)}${separator}${lastThree}`;
    }
    case 'wan':
      return part.replace(/\B(?=(\d{4})+(?!\d))/g, separator);
    case 'thousand':
    default:
      return part.replace(/\B(?=(\d{3})+(?!\d))/g, separator);
  }
};

interface FormatOptions {
  format: NumberInputProps['format'];
  currency: string;
  decimalSeparator: string;
  thousandSeparator?: string;
  thousandsGroupStyle: 'none' | 'thousand' | 'lakh' | 'wan';
  decimalScale?: number;
  precision?: number;
  fixedDecimalScale: boolean;
  prefix?: string;
  suffix?: string;
  formatter?: (value: number) => string;
  allowDecimal: boolean;
}

const formatDisplayValue = (value: number, options: FormatOptions): string => {
  if (!Number.isFinite(value)) return '';
  if (options.formatter) return options.formatter(value);

  const {
    format,
    currency,
    decimalSeparator,
    thousandSeparator,
    thousandsGroupStyle,
    decimalScale,
    precision,
    fixedDecimalScale,
    prefix,
    suffix,
    allowDecimal,
  } = options;

  const effectivePrefix = prefix ?? (format === 'currency' ? getCurrencySymbol(currency) : undefined);
  const effectiveSuffix = suffix ?? (format === 'percentage' ? '%' : undefined);

  let resolvedDecimalScale = decimalScale ?? precision;
  if (!allowDecimal) {
    resolvedDecimalScale = 0;
  }

  let workingValue = value;
  if (!allowDecimal) {
    workingValue = Math.trunc(workingValue);
  }

  const sign = workingValue < 0 ? '-' : '';
  const absoluteValue = Math.abs(workingValue);

  let base: string;
  if (typeof resolvedDecimalScale === 'number') {
    base = absoluteValue.toFixed(resolvedDecimalScale);
    if (!fixedDecimalScale && resolvedDecimalScale > 0) {
      base = base.replace(/(\.\d*?)0+$/, (_, group: string) => (group === '.' ? '' : group));
    }
  } else {
    base = absoluteValue.toString();
  }

  base = base.replace(/\.$/, '');

  const [intPartRaw, fracPartRaw = ''] = base.split('.');
  const intPart = groupThousands(intPartRaw, thousandSeparator, thousandsGroupStyle);
  const fracPart = fracPartRaw.length > 0 ? fracPartRaw : '';
  const decimalPortion = fracPart.length > 0 ? `${decimalSeparator}${fracPart}` : '';

  return `${sign}${effectivePrefix ?? ''}${intPart}${decimalPortion}${effectiveSuffix ?? ''}`;
};

const toLocalizedString = (normalized: string, decimalSeparator: string) => {
  if (!normalized) return '';
  if (decimalSeparator === DEFAULT_DECIMAL_SEPARATOR) return normalized;
  return normalized.replace('.', decimalSeparator);
};

interface NormalizeOptions {
  allowDecimal: boolean;
  allowNegative: boolean;
  allowLeadingZeros: boolean;
  decimalSeparator: string;
  allowedDecimalSeparators: string[];
  decimalScale?: number;
  thousandSeparator?: string;
  prefix?: string;
  suffix?: string;
}

interface NormalizeResult {
  normalized: string;
  localized: string;
  parsedValue?: number;
  hasValue: boolean;
}

const normalizeInput = (value: string, options: NormalizeOptions): NormalizeResult => {
  if (!value) {
    return { normalized: '', localized: '', parsedValue: undefined, hasValue: false };
  }

  let input = value.trim();

  if (options.prefix && input.startsWith(options.prefix)) {
    input = input.slice(options.prefix.length);
  }

  if (options.suffix && input.endsWith(options.suffix)) {
    input = input.slice(0, -options.suffix.length);
  }

  if (options.thousandSeparator) {
    const pattern = new RegExp(escapeRegExp(options.thousandSeparator), 'g');
    input = input.replace(pattern, '');
  }

  input = input.replace(/\s+/g, '');

  const decimalChars = new Set<string>(options.allowedDecimalSeparators);
  decimalChars.add(options.decimalSeparator);
  decimalChars.add(DEFAULT_DECIMAL_SEPARATOR);

  let normalized = '';
  let hasDecimal = false;
  let endedWithDecimal = false;

  for (let index = 0; index < input.length; index += 1) {
    const char = input[index];

    if (char >= '0' && char <= '9') {
      normalized += char;
      endedWithDecimal = false;
      continue;
    }

    if ((char === '-' || char === '+') && normalized.length === 0) {
      if (char === '-' && options.allowNegative) {
        normalized += char;
      }
      endedWithDecimal = false;
      continue;
    }

    if (options.allowDecimal && decimalChars.has(char)) {
      if (!hasDecimal) {
        normalized += '.';
        hasDecimal = true;
        endedWithDecimal = true;
      }
    }
  }

  if (!options.allowNegative) {
    normalized = normalized.replace(/-/g, '');
  } else if (normalized.includes('-', 1)) {
    normalized = normalized[0] === '-' ? `-${normalized.slice(1).replace(/-/g, '')}` : normalized.replace(/-/g, '');
  }

  if (!options.allowDecimal) {
    const decimalIndex = normalized.indexOf('.');
    if (decimalIndex !== -1) {
      normalized = normalized.slice(0, decimalIndex);
      hasDecimal = false;
      endedWithDecimal = false;
    }
  }

  if (options.decimalScale !== undefined && options.decimalScale >= 0 && hasDecimal) {
    const [intPart, fracPartRaw = ''] = normalized.split('.');
    const truncated = fracPartRaw.slice(0, options.decimalScale);
    const keepDecimal = options.decimalScale > 0 && (truncated.length > 0 || endedWithDecimal);

    if (options.decimalScale === 0) {
      normalized = intPart;
      hasDecimal = false;
      endedWithDecimal = false;
    } else {
      normalized = truncated.length > 0
        ? `${intPart}.${truncated}`
        : `${intPart}${keepDecimal ? '.' : ''}`;
      hasDecimal = truncated.length > 0 || keepDecimal;
      endedWithDecimal = truncated.length === 0 && keepDecimal;
    }
  }

  if (!options.allowLeadingZeros) {
    const negative = normalized.startsWith('-');
    let body = negative ? normalized.slice(1) : normalized;
    const [intPartRaw, fracRaw = ''] = body.split('.');
    let intPart = intPartRaw.replace(/^0+(?=\d)/, '');
    if (intPart === '') intPart = '0';

    if (fracRaw) {
      body = `${intPart}.${fracRaw}`;
    } else {
      body = intPart + (endedWithDecimal ? '.' : '');
    }

    normalized = negative ? `-${body}` : body;
  }

  const digits = normalized.replace(/[^0-9]/g, '');
  const hasValue = digits.length > 0;
  const parsedValue = hasValue ? Number(normalized) : undefined;

  return {
    normalized,
    localized: toLocalizedString(normalized, options.decimalSeparator),
    parsedValue: Number.isFinite(parsedValue) ? parsedValue : undefined,
    hasValue,
  };
};

export const NumberInput = factory<{
  props: NumberInputProps;
  ref: any;
}>((props, ref) => {
  const {
    value,
    onChange,
    min,
    max,
    step = 1,
    precision,
    format = 'decimal',
    currency = 'USD',
    withControls = false,
    hideControlsOnMobile = true,
    formatter,
    parser,
    clampBehavior = 'blur',
    allowEmpty = true,
    disabled,
    error,
    textInputProps,
    allowDecimal: allowDecimalProp,
    allowNegative = true,
    allowLeadingZeros = true,
    allowedDecimalSeparators,
    decimalSeparator = DEFAULT_DECIMAL_SEPARATOR,
    decimalScale,
    fixedDecimalScale = false,
    thousandSeparator,
    thousandsGroupStyle = 'thousand',
    prefix,
    suffix,
    isAllowed,
    startValue = 0,
    stepHoldDelay = DEFAULT_STEP_DELAY,
    stepHoldInterval = DEFAULT_STEP_INTERVAL,
    withKeyboardEvents = true,
    ...inputProps
  } = props;

  const theme = useTheme();
  const [internalValue, setInternalValue] = useState('');
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<any>(null);
  const holdTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const holdIntervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stepCountRef = useRef(0);

  const {
    rightSection: userRightSection,
    onFocus: userInputOnFocus,
    onBlur: userInputOnBlur,
    ...restInputProps
  } = inputProps;

  const allowDecimal = allowDecimalProp ?? (format !== 'integer');

  const resolvedDecimalScale = useMemo(() => {
    if (!allowDecimal) return 0;
    if (decimalScale !== undefined) return decimalScale;
    if (precision !== undefined) return precision;
    if (format === 'integer') return 0;
    return undefined;
  }, [allowDecimal, decimalScale, precision, format]);

  const resolvedThousandSeparator = useMemo(() => {
    if (typeof thousandSeparator === 'string') return thousandSeparator;
    if (thousandSeparator === true) return ',';
    if (thousandSeparator === false) return undefined;
    return format === 'currency' ? ',' : undefined;
  }, [thousandSeparator, format]);

  const allowedDecimalSeparatorsResolved = useMemo(() => {
    const set = new Set<string>(allowedDecimalSeparators ?? []);
    set.add(decimalSeparator);
    set.add(DEFAULT_DECIMAL_SEPARATOR);
    return Array.from(set);
  }, [allowedDecimalSeparators, decimalSeparator]);

  const currencySymbol = useMemo(() => getCurrencySymbol(currency), [currency]);

  const effectivePrefix = prefix ?? (format === 'currency' ? currencySymbol : undefined);
  const effectiveSuffix = suffix ?? (format === 'percentage' ? '%' : undefined);

  const formatOptions = useMemo<FormatOptions>(() => ({
    format,
    currency,
    decimalSeparator,
    thousandSeparator: resolvedThousandSeparator,
    thousandsGroupStyle,
    decimalScale: resolvedDecimalScale,
    precision,
    fixedDecimalScale,
    prefix: effectivePrefix,
    suffix: effectiveSuffix,
    formatter,
    allowDecimal,
  }), [format, currency, decimalSeparator, resolvedThousandSeparator, thousandsGroupStyle, resolvedDecimalScale, precision, fixedDecimalScale, effectivePrefix, effectiveSuffix, formatter, allowDecimal]);

  const formatValue = useCallback((val: number) => formatDisplayValue(val, formatOptions), [formatOptions]);

  const normalizationOptions = useMemo<NormalizeOptions>(() => ({
    allowDecimal,
    allowNegative,
    allowLeadingZeros,
    decimalSeparator,
    allowedDecimalSeparators: allowedDecimalSeparatorsResolved,
    decimalScale: resolvedDecimalScale,
    thousandSeparator: resolvedThousandSeparator,
    prefix: effectivePrefix,
    suffix: effectiveSuffix,
  }), [allowDecimal, allowNegative, allowLeadingZeros, decimalSeparator, allowedDecimalSeparatorsResolved, resolvedDecimalScale, resolvedThousandSeparator, effectivePrefix, effectiveSuffix]);

  const formatEditableValue = useCallback((val: number) => {
    if (!Number.isFinite(val)) return '';

    let normalized: string;

    if (!allowDecimal) {
      normalized = Math.trunc(val).toString();
    } else if (typeof resolvedDecimalScale === 'number') {
      normalized = val.toFixed(resolvedDecimalScale);
      if (!fixedDecimalScale && resolvedDecimalScale > 0) {
        normalized = normalized.replace(/(\.\d*?)0+$/, (_, group: string) => (group === '.' ? '' : group));
      }
    } else {
      normalized = val.toString();
    }

    normalized = normalized.replace(/\.$/, '');

    return decimalSeparator === DEFAULT_DECIMAL_SEPARATOR
      ? normalized
      : normalized.replace('.', decimalSeparator);
  }, [allowDecimal, resolvedDecimalScale, fixedDecimalScale, decimalSeparator]);

  const allowedChecker = useCallback((nextValue: number, valueString: string) => {
    if (!isAllowed) return true;
    return isAllowed({
      floatValue: nextValue,
      formattedValue: formatValue(nextValue),
      value: valueString,
    });
  }, [isAllowed, formatValue]);

  const resolvedMin = useMemo(() => {
    if (!allowNegative) {
      const limit = 0;
      if (min === undefined) return limit;
      return Math.max(min, limit);
    }
    return min;
  }, [allowNegative, min]);

  // Format display value
  const displayValue = useMemo(() => {
    if (focused) return internalValue;
    if (value === undefined || value === null) return '';
    return formatValue(value);
  }, [focused, internalValue, value, formatValue]);

  // Clamp value to bounds
  const clampValue = useCallback((val: number): number => {
    let clamped = val;
    if (resolvedMin !== undefined && clamped < resolvedMin) clamped = resolvedMin;
    if (max !== undefined && clamped > max) clamped = max;
    return clamped;
  }, [resolvedMin, max]);

  useEffect(() => {
    if (!focused) return;
    if (value === undefined || value === null) {
      setInternalValue('');
      return;
    }
    setInternalValue(formatEditableValue(value));
  }, [value, focused, formatEditableValue]);

  // Handle text input changes
  const handleChangeText = useCallback((text: string) => {
    if (parser) {
      setInternalValue(text);
      const parsed = parser(text);
      if (!isNaN(parsed)) {
        const clamped = clampBehavior === 'strict' ? clampValue(parsed) : parsed;
        if (allowedChecker(clamped, clamped.toString())) {
          onChange?.(clamped);
        }
      } else if (allowEmpty && text === '') {
        onChange?.(undefined);
      }
      return;
    }

    const normalized = normalizeInput(text, normalizationOptions);
    setInternalValue(normalized.localized);

    if (!normalized.hasValue) {
      if (allowEmpty && normalized.localized === '') {
        onChange?.(undefined);
      }
      return;
    }

    if (normalized.parsedValue === undefined || Number.isNaN(normalized.parsedValue)) {
      return;
    }

    let nextValue = normalized.parsedValue;

    if (clampBehavior === 'strict') {
      nextValue = clampValue(nextValue);
      setInternalValue(formatEditableValue(nextValue));
    }

    if (!allowedChecker(nextValue, nextValue.toString())) {
      return;
    }

    onChange?.(nextValue);
  }, [parser, clampBehavior, clampValue, allowEmpty, onChange, normalizationOptions, formatEditableValue, allowedChecker]);

  // Handle focus
  const handleFocus = useCallback(() => {
    setFocused(true);
    if (value === undefined || value === null) {
      setInternalValue('');
    } else {
      setInternalValue(formatEditableValue(value));
    }
    userInputOnFocus?.();
  }, [value, formatEditableValue, userInputOnFocus]);

  // Handle blur
  const handleBlur = useCallback(() => {
    setFocused(false);
    setInternalValue('');
    
    // Apply clamping on blur if needed
    if (clampBehavior === 'blur' && value !== undefined) {
      const clamped = clampValue(value);
      if (clamped !== value && allowedChecker(clamped, clamped.toString())) {
        onChange?.(clamped);
      }
    }
    userInputOnBlur?.();
  }, [clampBehavior, clampValue, value, onChange, allowedChecker, userInputOnBlur]);

  // Handle increment/decrement
  const handleStep = useCallback((direction: 'up' | 'down') => {
    if (disabled) return;
    const hasValue = value !== undefined && value !== null;
    let nextValue: number;

    if (!hasValue) {
      nextValue = startValue;
    } else {
      const delta = direction === 'up' ? step : -step;
      nextValue = (value as number) + delta;
    }

    if (!allowDecimal) {
      nextValue = Math.round(nextValue);
    }

    const clamped = clampValue(nextValue);

    if (!allowedChecker(clamped, clamped.toString())) {
      return;
    }

    onChange?.(clamped);

    if (focused) {
      setInternalValue(formatEditableValue(clamped));
    }
  }, [disabled, value, startValue, step, allowDecimal, clampValue, allowedChecker, onChange, focused, formatEditableValue]);

  const clearHoldTimers = useCallback(() => {
    if (holdTimeoutRef.current) {
      clearTimeout(holdTimeoutRef.current);
      holdTimeoutRef.current = null;
    }
    if (holdIntervalRef.current) {
      clearTimeout(holdIntervalRef.current);
      holdIntervalRef.current = null;
    }
  }, []);

  const scheduleNextStep = useCallback((direction: 'up' | 'down') => {
    const interval = typeof stepHoldInterval === 'function'
      ? stepHoldInterval(stepCountRef.current)
      : stepHoldInterval;

    const delay = Math.max(interval ?? DEFAULT_STEP_INTERVAL, 0);

    holdIntervalRef.current = setTimeout(() => {
      stepCountRef.current += 1;
      handleStep(direction);
      scheduleNextStep(direction);
    }, delay);
  }, [handleStep, stepHoldInterval]);

  const startHold = useCallback((direction: 'up' | 'down') => {
    if (disabled) return;
    clearHoldTimers();
    stepCountRef.current = 0;
    handleStep(direction);

    const delay = Math.max(stepHoldDelay ?? DEFAULT_STEP_DELAY, 0);

    holdTimeoutRef.current = setTimeout(() => {
      stepCountRef.current = 1;
      scheduleNextStep(direction);
    }, delay);
  }, [disabled, clearHoldTimers, handleStep, stepHoldDelay, scheduleNextStep]);

  const stopHold = useCallback(() => {
    clearHoldTimers();
    stepCountRef.current = 0;
  }, [clearHoldTimers]);

  useEffect(() => () => {
    clearHoldTimers();
  }, [clearHoldTimers]);

  // Controls visibility
  const showControls = useMemo(() => {
    if (!withControls) return false;
    if (hideControlsOnMobile && Platform.OS !== 'web') return false;
    return true;
  }, [withControls, hideControlsOnMobile]);

  // Right section with controls
  const rightSection = useMemo(() => {
  if (!showControls) return userRightSection;
    const comparisonValue = value ?? startValue;
    const disableIncrement = disabled || (max !== undefined && comparisonValue >= max);
    const disableDecrement = disabled || (resolvedMin !== undefined && comparisonValue <= resolvedMin);

    return (
      <View style={{ flexDirection: 'column' }}>
        <Pressable
          onPressIn={() => startHold('up')}
          onPressOut={stopHold}
          onTouchEnd={stopHold}
          disabled={disableIncrement}
          accessibilityRole="button"
          style={{
            padding: 4,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.gray[3],
          }}
        >
          <Icon name="chevron-up" size={12} color={theme.text.secondary} />
        </Pressable>
        
        <Pressable
          onPressIn={() => startHold('down')}
          onPressOut={stopHold}
          onTouchEnd={stopHold}
          disabled={disableDecrement}
          accessibilityRole="button"
          style={{
            padding: 4,
          }}
        >
          <Icon name="chevron-down" size={12} color={theme.text.secondary} />
        </Pressable>
      </View>
    );
  }, [
    showControls,
    userRightSection,
    disabled,
    max,
    startValue,
    resolvedMin,
    value,
    startHold,
    stopHold,
    theme
  ]);

  const userOnKeyDown = textInputProps?.onKeyDown;

  const handleKeyDown = useCallback((event: any) => {
    userOnKeyDown?.(event);
    if (!withKeyboardEvents) return;
    if (event?.defaultPrevented) return;

    const key = event?.nativeEvent?.key ?? event?.key;
    if (key === 'ArrowUp' || key === 'ArrowDown') {
      event.preventDefault?.();
      event.stopPropagation?.();
      handleStep(key === 'ArrowUp' ? 'up' : 'down');
    }
  }, [userOnKeyDown, withKeyboardEvents, handleStep]);

  useEffect(() => {
    if (Platform.OS !== 'web' || !withKeyboardEvents) return;

    const element = inputRef.current as unknown as {
      addEventListener?: (type: string, listener: any) => void;
      removeEventListener?: (type: string, listener: any) => void;
    } | null;

    if (!element?.addEventListener || !element?.removeEventListener) {
      return;
    }

    const listener = (event: any) => {
      handleKeyDown(event);
    };

    const add = element.addEventListener.bind(element);
    const remove = element.removeEventListener.bind(element);

    add('keydown', listener);

    return () => {
      remove('keydown', listener);
    };
  }, [handleKeyDown, withKeyboardEvents]);

  const enhancedTextInputProps = useMemo<NumberInputProps['textInputProps']>(() => {
    if (Platform.OS !== 'web' || !withKeyboardEvents) {
      return textInputProps;
    }

    if (textInputProps) {
      return {
        ...textInputProps,
        onKeyDown: handleKeyDown,
      };
    }

    return {
      onKeyDown: handleKeyDown,
    } as ExtendedTextInputProps;
  }, [textInputProps, handleKeyDown, withKeyboardEvents]);

  const keyboardType = allowDecimal ? 'decimal-pad' : 'number-pad';

  return (
    <Input
      {...restInputProps}
      value={displayValue}
      onChangeText={handleChangeText}
      onBlur={handleBlur}
      onFocus={handleFocus}
      keyboardType={keyboardType}
      rightSection={rightSection}
      disabled={disabled}
      error={error}
      inputRef={inputRef}
      textInputProps={enhancedTextInputProps}
    />
  );
});

NumberInput.displayName = 'NumberInput';
