import React, { useCallback, useMemo, useState, forwardRef } from 'react';
import { View, Pressable } from 'react-native';
import { Input } from '../Input';
import { Icon } from '../Icon';
import { Dialog } from '../Dialog';
import { MonthPicker } from '../MonthPicker';
import { DESIGN_TOKENS } from '../../core';
import type { MonthPickerInputProps } from './types';

const DEFAULT_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  month: 'long',
  year: 'numeric',
};

export const MonthPickerInput = forwardRef<View, MonthPickerInputProps>(function MonthPickerInput(
  {
    value,
    defaultValue,
    onChange,
    locale = 'en-US',
    formatOptions,
    formatValue,
    placeholder = 'Select month',
    clearable = false,
    closeOnSelect = true,
    monthPickerProps,
    modalTitle = 'Select month',
    size = 'md',
    disabled = false,
    withAsterisk,
    onOpen,
    onClose,
    ...inputProps
  },
  ref
) {
  const [opened, setOpened] = useState(false);
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState<Date | null>(defaultValue ?? null);
  const currentValue = (isControlled ? value : internalValue) ?? null;

  const {
    required = false,
    rightSection,
    onFocus,
    onBlur,
    style,
    ...restInputProps
  } = inputProps;

  const inputClearable = (inputProps as { clearable?: boolean }).clearable;
  const inputOnClear = (inputProps as { onClear?: () => void }).onClear;

  const formatter = useMemo(() => {
    if (typeof formatValue === 'function') {
      return formatValue;
    }
    const options = formatOptions ?? DEFAULT_FORMAT_OPTIONS;
    const intl = new Intl.DateTimeFormat(locale, options);
    return (date: Date) => intl.format(date);
  }, [formatValue, formatOptions, locale]);

  const setValue = useCallback(
    (next: Date | null) => {
      if (!isControlled) {
        setInternalValue(next);
      }
      onChange?.(next);
    },
    [isControlled, onChange]
  );

  const handleOpen = useCallback(() => {
    if (disabled) return;
    setOpened(true);
    onFocus?.();
    onOpen?.();
  }, [disabled, onFocus, onOpen]);

  const handleClose = useCallback(() => {
    setOpened(false);
    onBlur?.();
    onClose?.();
  }, [onBlur, onClose]);

  const handleClear = useCallback(() => {
    setValue(null);
    inputOnClear?.();
  }, [setValue, inputOnClear]);

  const { onChange: monthPickerOnChange, ...restMonthPickerProps } = monthPickerProps ?? {};

  const handleMonthChange = useCallback(
    (next: Date | null) => {
      setValue(next);
      monthPickerOnChange?.(next ?? null);
      if (closeOnSelect && next) {
        handleClose();
      }
    },
    [closeOnSelect, handleClose, monthPickerOnChange, setValue]
  );

  const inputValue = currentValue ? formatter(currentValue) : '';
  const shouldShowClear = (clearable || inputClearable) && !!currentValue;
  const showAsterisk = withAsterisk ?? required;

  const resolvedLocale = restMonthPickerProps.locale ?? locale;
  const resolvedSize = restMonthPickerProps.size ?? size;

  return (
    <View ref={ref} accessibilityElementsHidden={false}>
      <Pressable
        onPress={handleOpen}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={inputValue || placeholder}
        accessibilityHint="Opens month picker"
        accessibilityState={{ disabled }}
        style={{ width: '100%' }}
      >
        <Input
          {...restInputProps}
          value={inputValue}
          placeholder={placeholder}
          disabled={disabled}
          size={size}
          required={required}
          withAsterisk={showAsterisk}
          clearable={shouldShowClear}
          onClear={shouldShowClear ? handleClear : undefined}
          rightSection={rightSection ?? <Icon name="calendar" size={16} />}
          onFocus={onFocus}
          onBlur={onBlur}
          style={style}
          textInputProps={{
            editable: false,
            pointerEvents: 'none',
            accessible: false,
            focusable: false,
          }}
        />
      </Pressable>

      <Dialog
        visible={opened}
        variant="modal"
        onClose={handleClose}
        title={modalTitle}
        width={360}
      >
        <View
          style={{
            padding: DESIGN_TOKENS.spacing.lg,
          }}
        >
          <MonthPicker
            {...restMonthPickerProps}
            value={currentValue}
            onChange={handleMonthChange}
            locale={resolvedLocale}
            size={resolvedSize}
          />
        </View>
      </Dialog>
    </View>
  );
});

MonthPickerInput.displayName = 'MonthPickerInput';
