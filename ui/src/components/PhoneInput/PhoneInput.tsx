import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { Platform } from 'react-native';
import { PhoneInputProps, PhoneFormat } from './types';
import { TextInputBase } from '../Input/InputBase';

// Predefined phone formats with mask patterns
const PHONE_FORMATS: Record<string, PhoneFormat> = {
  US: {
    name: 'United States',
    countryCode: '+1',
    mask: '(000) 000-0000',
    placeholder: '(555) 123-4567',
    maxDigits: 10
  },
  CA: {
    name: 'Canada', 
    countryCode: '+1',
    mask: '(000) 000-0000',
    placeholder: '(555) 123-4567', 
    maxDigits: 10
  },
  UK: {
    name: 'United Kingdom',
    countryCode: '+44',
    mask: '0000 000 0000',
    placeholder: '7911 123456',
    maxDigits: 11
  },
  FR: {
    name: 'France',
    countryCode: '+33',
    mask: '00 00 00 00 00',
    placeholder: '01 23 45 67 89',
    maxDigits: 10
  },
  DE: {
    name: 'Germany', 
    countryCode: '+49',
    mask: '000 000 0000',
    placeholder: '030 12345678',
    maxDigits: 11
  },
  AU: {
    name: 'Australia',
    countryCode: '+61',
    mask: '000 000 000',
    placeholder: '412 345 678',
    maxDigits: 9
  },
  BR: {
    name: 'Brazil',
    countryCode: '+55',
    mask: '(00) 00000-0000',
    placeholder: '(11) 99999-9999',
    maxDigits: 11
  },
  IN: {
    name: 'India',
    countryCode: '+91', 
    mask: '00000 00000',
    placeholder: '98765 43210',
    maxDigits: 10
  },
  JP: {
    name: 'Japan',
    countryCode: '+81',
    mask: '00-0000-0000',
    placeholder: '90-1234-5678', 
    maxDigits: 11
  },
  INTL: {
    name: 'International',
    countryCode: '+',
    mask: '000 000 000 000 000',
    placeholder: 'Enter phone number',
    maxDigits: 15
  }
};

const DIGIT_PLACEHOLDER_REGEX = /[0#]/g;

// Extract digits only
function extractDigits(value: string): string {
  return value.replace(/\D/g, '');
}

function isDigitPlaceholder(char: string): boolean {
  return char === '0' || char === '#';
}

function countMaskDigits(mask?: string): number {
  if (!mask) return 0;
  const matches = mask.match(DIGIT_PLACEHOLDER_REGEX);
  return matches ? matches.length : 0;
}

interface FormatDigitsResult {
  formatted: string;
  mapping: number[];
}

function formatDigitsWithMask(digits: string, mask?: string): FormatDigitsResult {
  if (!mask || mask.length === 0) {
    return {
      formatted: digits,
      mapping: Array.from({ length: digits.length }, (_, index) => index)
    };
  }

  let formatted = '';
  const mapping: number[] = [];
  let digitIndex = 0;

  for (let i = 0; i < mask.length; i += 1) {
    const maskChar = mask[i];

    if (isDigitPlaceholder(maskChar)) {
      if (digitIndex >= digits.length) {
        break;
      }

      formatted += digits[digitIndex];
      mapping.push(digitIndex);
      digitIndex += 1;
    } else {
      // Only include formatting characters once typing has started
      if (digitIndex === 0 && digits.length === 0) {
        continue;
      }

      if (digitIndex > 0 || digitIndex < digits.length) {
        formatted += maskChar;
        mapping.push(-1);
      }
    }
  }

  return { formatted, mapping };
}

function removeDigitAt(value: string, index: number): string {
  if (index < 0 || index >= value.length) return value;
  return value.slice(0, index) + value.slice(index + 1);
}

function findFirstDifferenceIndex(prev: string, next: string): number {
  const minLength = Math.min(prev.length, next.length);

  for (let i = 0; i < minLength; i += 1) {
    if (prev[i] !== next[i]) {
      return i;
    }
  }

  if (prev.length !== next.length) {
    return minLength;
  }

  return -1;
}

function removeDigitForDeletion(digits: string, mapping: number[], diffIndex: number): string {
  if (!digits.length) {
    return digits;
  }

  let searchIndex = diffIndex;

  if (searchIndex === -1 || searchIndex >= mapping.length) {
    searchIndex = mapping.length - 1;
  }

  for (let i = searchIndex; i >= 0; i -= 1) {
    const digitIndex = mapping[i];
    if (digitIndex !== -1) {
      return removeDigitAt(digits, digitIndex);
    }
  }

  // Fallback: remove last digit
  return digits.slice(0, -1);
}

// Auto-detect format based on country code or digit count
function autoDetectFormat(value: string): PhoneFormat {
  const digits = extractDigits(value);
  
  // Check for country codes
  if (digits.startsWith('1') && digits.length >= 10) {
    return PHONE_FORMATS.US;
  }
  if (digits.startsWith('44')) {
    return PHONE_FORMATS.UK;
  }
  if (digits.startsWith('33')) {
    return PHONE_FORMATS.FR; 
  }
  if (digits.startsWith('49')) {
    return PHONE_FORMATS.DE;
  }
  if (digits.startsWith('61')) {
    return PHONE_FORMATS.AU;
  }
  if (digits.startsWith('55')) {
    return PHONE_FORMATS.BR;
  }
  if (digits.startsWith('91')) {
    return PHONE_FORMATS.IN;
  }
  if (digits.startsWith('81')) {
    return PHONE_FORMATS.JP;
  }
  
  // Default to US format for 10-digit numbers
  if (digits.length === 10) {
    return PHONE_FORMATS.US;
  }
  
  // Otherwise use international
  return PHONE_FORMATS.INTL;
}

export const PhoneInput: React.FC<PhoneInputProps> = (props) => {
  const {
    value = '',
    onChange,
    country = 'US',
    autoDetect = true,
    showCountryCode = true,
    mask: customMask,
    placeholder,
    leftSection,
    rightSection,
    size = 'md',
    ...base
  } = props;

  const fallbackFormat = useMemo(() => PHONE_FORMATS[country] || PHONE_FORMATS.US, [country]);
  const [internalValue, setInternalValue] = useState(() => extractDigits(value));

  const currentFormat = useMemo(() => {
    if (autoDetect && internalValue) {
      return autoDetectFormat(internalValue);
    }
    return fallbackFormat;
  }, [autoDetect, internalValue, fallbackFormat]);

  const maskPattern = useMemo(() => customMask || currentFormat.mask || '', [customMask, currentFormat.mask]);

  const maxDigits = useMemo(() => {
    const maskDigitCount = countMaskDigits(maskPattern);

    if (customMask) {
      return maskDigitCount > 0 ? maskDigitCount : 15;
    }

    const fallback = currentFormat.maxDigits ?? (maskDigitCount > 0 ? maskDigitCount : 15);
    if (maskDigitCount > 0) {
      return Math.min(maskDigitCount, fallback);
    }

    return fallback;
  }, [customMask, maskPattern, currentFormat.maxDigits]);

  useEffect(() => {
    const sanitized = extractDigits(value);
    const limited = sanitized.slice(0, maxDigits);

    if (limited !== internalValue) {
      setInternalValue(limited);
    }
  }, [value, maxDigits, internalValue]);

  const formatInfo = useMemo(() => formatDigitsWithMask(internalValue, maskPattern), [internalValue, maskPattern]);

  const prefix = useMemo(() => {
    if (showCountryCode && currentFormat.countryCode && currentFormat.countryCode !== '+') {
      return `${currentFormat.countryCode} `;
    }
    return '';
  }, [showCountryCode, currentFormat.countryCode]);

  const displayValue = useMemo(() => {
    if (!formatInfo.formatted.length) {
      return '';
    }

    if (prefix) {
      return `${prefix}${formatInfo.formatted}`;
    }

    return formatInfo.formatted;
  }, [formatInfo.formatted, prefix]);

  const handleChangeText = useCallback((text: string) => {
    const textWithoutPrefix = prefix && text.startsWith(prefix) ? text.slice(prefix.length) : text;
    const rawDigits = extractDigits(textWithoutPrefix);
    let nextDigits = rawDigits.slice(0, maxDigits);

    const prevFormatted = formatInfo.formatted;
    const isDeleting = textWithoutPrefix.length < prevFormatted.length;

    if (nextDigits === internalValue && isDeleting && prevFormatted.length > 0) {
      const diffIndex = findFirstDifferenceIndex(prevFormatted, textWithoutPrefix);
      nextDigits = removeDigitForDeletion(internalValue, formatInfo.mapping, diffIndex);
    }

    if (nextDigits === internalValue) {
      return;
    }

    const formattedResult = formatDigitsWithMask(nextDigits, maskPattern);
    let formattedDisplay = formattedResult.formatted;

    if (formattedDisplay && prefix) {
      formattedDisplay = `${prefix}${formattedDisplay}`;
    }

    setInternalValue(nextDigits);

    if (onChange) {
      onChange(nextDigits, formattedDisplay);
    }
  }, [prefix, maxDigits, formatInfo, internalValue, maskPattern, onChange]);

  const effectivePlaceholder = useMemo(() => {
    if (placeholder) {
      return placeholder;
    }

    if (customMask) {
      return customMask.replace(DIGIT_PLACEHOLDER_REGEX, '0');
    }

    let placeholderText = currentFormat.placeholder || 'Enter phone number';

    if (showCountryCode && currentFormat.countryCode !== '+') {
      placeholderText = `${currentFormat.countryCode} ${placeholderText}`;
    }

    return placeholderText;
  }, [placeholder, customMask, currentFormat, showCountryCode]);

  return (
    <TextInputBase
      {...base}
      value={displayValue}
      onChangeText={handleChangeText}
      placeholder={effectivePlaceholder}
      size={size as any}
      leftSection={leftSection}
      rightSection={rightSection}
      textInputProps={{
        keyboardType: Platform.OS === 'ios' ? 'number-pad' : 'phone-pad',
        autoComplete: 'tel',
        textContentType: 'telephoneNumber'
      }}
      accessibilityLabel={base.accessibilityLabel || `Phone number input for ${currentFormat.name}`}
    />
  );
};

PhoneInput.displayName = 'PhoneInput';
