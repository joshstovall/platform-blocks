import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { View, TextInput, Platform } from 'react-native';
import { Text } from '../Text';
import { PinInputProps } from './types';
import { factory } from '../../core/factory';
import { useTheme } from '../../core/theme';
import { useKeyboardManagerOptional } from '../../core/providers/KeyboardManagerProvider';

export const PinInput = factory<{
  props: PinInputProps;
  ref: View;
}>((props, ref) => {
  const {
    length = 4,
    value = '',
    onChange,
    mask = false,
    maskChar = '•',
    manageFocus = true,
    type = 'numeric',
    placeholder = '',
    allowPaste = true,
    oneTimeCode = false,
    spacing = 8,
    disabled = false,
    error,
    size = 'md',
    onComplete,
    textInputProps,
    label,
    helperText,
    style,
    keyboardFocusId,
    name,
    testID,
    ...spacingProps
  } = props;

  const theme = useTheme();
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const keyboardManager = useKeyboardManagerOptional();

  const fallbackFocusIdRef = useRef(`pin-${Math.random().toString(36).slice(2, 10)}`);
  const focusTargetId = useMemo(() => {
    if (typeof keyboardFocusId === 'string' && keyboardFocusId.trim().length > 0) {
      return keyboardFocusId.trim();
    }
    if (typeof name === 'string' && name.trim().length > 0) {
      return name.trim();
    }
    if (typeof testID === 'string' && testID.trim().length > 0) {
      return testID.trim();
    }
    return fallbackFocusIdRef.current;
  }, [keyboardFocusId, name, testID]);
  
  // Initialize refs array
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, length);
    for (let i = inputRefs.current.length; i < length; i++) {
      inputRefs.current[i] = null;
    }
  }, [length]);

  // Split value into array of individual digits
  const digits = value.split('').slice(0, length);
  while (digits.length < length) {
    digits.push('');
  }

  // Call onComplete when all digits are filled
  useEffect(() => {
    if (value.length === length && onComplete) {
      onComplete(value);
    }
  }, [value, length, onComplete]);

  const handleChangeText = useCallback((text: string, index: number) => {
    if (disabled) return;

    // Handle paste
    if (text.length > 1 && allowPaste) {
      // Filter the pasted text based on type
      let filteredPaste = text;
      if (type === 'numeric') {
        filteredPaste = text.replace(/[^0-9]/g, '');
      } else {
        filteredPaste = text.replace(/[^a-zA-Z0-9]/g, '');
      }
      
      const pastedDigits = filteredPaste.slice(0, length);
      onChange?.(pastedDigits);
      
      // Focus the next empty input or the last input
      const nextEmptyIndex = Math.min(pastedDigits.length, length - 1);
      if (manageFocus && inputRefs.current[nextEmptyIndex]) {
        setTimeout(() => {
          inputRefs.current[nextEmptyIndex]?.focus();
        }, 0);
      }
      // If paste filled all digits, blur all
      if (pastedDigits.length === length) {
        setTimeout(() => {
          inputRefs.current.forEach(r => r?.blur());
          setFocusedIndex(-1);
        }, 0);
      }
      return;
    }

    // Filter input based on type
    let filteredText = text;
    if (type === 'numeric') {
      filteredText = text.replace(/[^0-9]/g, '');
    } else {
      filteredText = text.replace(/[^a-zA-Z0-9]/g, '');
    }

    // Only take the last character for single input
    const newDigit = filteredText.slice(-1);
    
    // Update the value
    const newDigits = [...digits];
    newDigits[index] = newDigit;
    const newValue = newDigits.join('');
    
    onChange?.(newValue);

    if (newValue.length === length) {
      // Completed entry: blur all inputs
      setTimeout(() => {
        inputRefs.current.forEach(r => r?.blur());
        setFocusedIndex(-1);
      }, 0);
    } else {
      // Auto-focus next input if not complete
      if (manageFocus && newDigit && index < length - 1) {
        setTimeout(() => {
          inputRefs.current[index + 1]?.focus();
        }, 0);
      }
    }
  }, [digits, disabled, allowPaste, length, onChange, manageFocus, type]);

  const handleKeyPress = useCallback((key: string, index: number) => {
    if (disabled) return;

    if (key === 'Backspace') {
      // If current input is empty, focus previous input
      if (!digits[index] && index > 0 && manageFocus) {
        setTimeout(() => {
          inputRefs.current[index - 1]?.focus();
        }, 0);
      }
    }
  }, [digits, disabled, manageFocus]);

  const handleFocus = useCallback((index: number) => {
    // Determine first empty index
    const firstEmpty = digits.findIndex(d => d === '');

    // If all empty, always force focus to 0
    if (firstEmpty === 0 && index !== 0) {
      setTimeout(() => inputRefs.current[0]?.focus(), 0);
      setFocusedIndex(0);
      return;
    }

    // If there is an earlier empty digit than the one focused, redirect to that
    if (firstEmpty !== -1 && index > firstEmpty) {
      setTimeout(() => inputRefs.current[firstEmpty]?.focus(), 0);
      setFocusedIndex(firstEmpty);
      return;
    }

    setFocusedIndex(index);
  }, [digits]);

  const handleBlur = useCallback(() => {
    setFocusedIndex(-1);
  }, []);

  const focusPreferredCell = useCallback(() => {
    const digitsArray = value.split('').slice(0, length);
    const firstEmptyIndex = digitsArray.findIndex(digit => digit === '');
    let targetIndex = 0;

    if (manageFocus) {
      if (firstEmptyIndex !== -1) {
        targetIndex = firstEmptyIndex;
      } else if (digitsArray.length > 0) {
        targetIndex = Math.min(digitsArray.length, length - 1);
      }
    }

    const node = inputRefs.current[targetIndex] ?? inputRefs.current[0];
    node?.focus?.();
    setFocusedIndex(targetIndex);
  }, [value, length, manageFocus]);

  useEffect(() => {
    if (!keyboardManager) {
      return;
    }

    if (keyboardManager.pendingFocusTarget !== focusTargetId) {
      return;
    }

    if (keyboardManager.consumeFocusTarget(focusTargetId)) {
      requestAnimationFrame(() => {
        focusPreferredCell();
      });
    }
  }, [keyboardManager, focusTargetId, focusPreferredCell]);

  // Input styles
  const getInputStyle = useCallback((index: number) => {
    const baseFontSize = size === 'xs' ? 14 : size === 'sm' ? 16 : size === 'lg' ? 20 : size === 'xl' ? 24 : 18;
    const baseStyle = {
      width: size === 'xs' ? 32 : size === 'sm' ? 40 : size === 'lg' ? 56 : size === 'xl' ? 64 : 48,
      height: size === 'xs' ? 32 : size === 'sm' ? 40 : size === 'lg' ? 56 : size === 'xl' ? 64 : 48,
      borderWidth: 1,
      borderColor: error 
        ? theme.colors.error[5]
        : focusedIndex === index 
          ? theme.colors.primary[5]
          : theme.colors.gray[3],
      borderRadius: 6,
      backgroundColor: disabled 
        ? theme.colors.gray[1] 
        : (theme.colorScheme === 'dark' ? theme.colors.gray[1] : 'white'),
      textAlign: 'center' as const,
      // Slightly larger font for masked dots for better visibility
      fontSize: mask ? baseFontSize + 6 : baseFontSize,
      color: disabled ? theme.text.disabled : theme.text.primary,
      marginRight: index < length - 1 ? spacing : 0,
    };
    
    return baseStyle;
  }, [size, error, focusedIndex, length, spacing, disabled, theme, mask]);

  return (
    <View
      ref={ref}
      style={[style, spacingProps]}
      testID={testID}
    >
      {label && (
        <Text 
          style={{ 
            marginBottom: 8, 
            fontSize: size === 'xs' ? 12 : size === 'sm' ? 14 : 16,
            color: theme.text.primary 
          }}
        >
          {label}
        </Text>
      )}
      
      <View 
        style={{ 
          flexDirection: 'row', 
          alignItems: 'center',
          justifyContent: 'center' 
        }}
      >
        {digits.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => {
              inputRefs.current[index] = ref;
            }}
            style={getInputStyle(index)}
            value={mask && digit ? maskChar : digit}
            onChangeText={(text) => handleChangeText(text, index)}
            onKeyPress={Platform.OS === 'web' ? ({ nativeEvent }) => {
              handleKeyPress(nativeEvent.key, index);
            } : undefined}
            onFocus={() => handleFocus(index)}
            onBlur={handleBlur}
            maxLength={allowPaste ? undefined : 1}
            keyboardType={type === 'numeric' ? 'number-pad' : 'default'}
            textContentType={oneTimeCode ? 'oneTimeCode' : undefined}
            autoComplete={oneTimeCode ? 'one-time-code' : 'off'}
            selectTextOnFocus
            editable={!disabled}
            placeholder={placeholder}
            placeholderTextColor={theme.text.muted}
            {...textInputProps}
          />
        ))}
      </View>
      
      {error && (
        <Text 
          style={{ 
            marginTop: 4, 
            fontSize: 12, 
            color: theme.colors.error[5] 
          }}
        >
          {error}
        </Text>
      )}
      
      {helperText && !error && (
        <Text 
          style={{ 
            marginTop: 4, 
            fontSize: 12, 
            color: theme.text.muted 
          }}
        >
          {helperText}
        </Text>
      )}
    </View>
  );
});

PinInput.displayName = 'PinInput';
