import React, { useMemo, useState, useCallback } from 'react';
import { TextInput, KeyboardTypeOptions, Pressable, Platform, View } from 'react-native';
import { factory } from '../../core/factory/factory';
import { TextInputBase } from './InputBase';
import { InputProps } from './types';
import { Icon } from '../Icon';
import { useTheme } from '../../core/theme';
import { Text } from '../Text';

const getInputTypeConfig = (type?: InputProps['type']) => {
  const configs = {
    text: {
      keyboardType: 'default' as KeyboardTypeOptions,
      secureTextEntry: false,
      autoCapitalize: 'sentences' as const,
      autoComplete: 'off' as const
    },
    password: {
      keyboardType: 'default' as KeyboardTypeOptions,
      secureTextEntry: true,
      autoCapitalize: 'none' as const,
      autoComplete: 'password' as const,
      // Additional props to ensure immediate masking on iOS
      textContentType: 'password' as const,
      passwordRules: undefined, // Disable password rules to prevent any character preview
      // Ensure no auto-correction or suggestions that might reveal characters
      autoCorrect: false,
      spellCheck: false,
      clearButtonMode: 'never' as const, // Prevent clear button from showing characters
    },
    email: {
      keyboardType: 'email-address' as KeyboardTypeOptions,
      secureTextEntry: false,
      autoCapitalize: 'none' as const,
      autoComplete: 'email' as const
    },
    tel: {
      keyboardType: 'phone-pad' as KeyboardTypeOptions,
      secureTextEntry: false,
      autoCapitalize: 'none' as const,
      autoComplete: 'tel' as const
    },
    number: {
      keyboardType: 'numeric' as KeyboardTypeOptions,
      secureTextEntry: false,
      autoCapitalize: 'none' as const,
      autoComplete: 'off' as const
    },
    search: {
      keyboardType: 'default' as KeyboardTypeOptions,
      secureTextEntry: false,
      autoCapitalize: 'none' as const,
      autoComplete: 'off' as const
    }
  };

  return configs[type || 'text'];
};

export const Input = factory<{
  props: InputProps;
  ref: TextInput;
}>((props, ref) => {
  const {
    type = 'text',
    validation,
    autoComplete,
    keyboardType,
    multiline,
    numberOfLines,
    minLines = 1,
    maxLines,
    maxLength,
    secureTextEntry,
    textInputProps,
    required,
    withAsterisk,
    rightSection,
    inputRef,
    value,
    onChangeText,
    ...baseProps
  } = props;

  const theme = useTheme();
  
  // State for password visibility
  const [showPassword, setShowPassword] = useState(false);
  
  // State for dynamic line counting
  const [currentLines, setCurrentLines] = useState(minLines);

  // Function to count lines in text
  const countLines = useCallback((text: string) => {
    if (!text) return minLines;
    const lineCount = text.split('\n').length;
    return Math.max(minLines, maxLines ? Math.min(lineCount, maxLines) : lineCount);
  }, [minLines, maxLines]);

  // Handle text changes with dynamic line counting
  const handleChangeText = useCallback((text: string) => {
    if (multiline && !numberOfLines) {
      // Only update line count if multiline and numberOfLines is not explicitly set
      setCurrentLines(countLines(text));
    }
    onChangeText?.(text);
  }, [multiline, numberOfLines, countLines, onChangeText]);

  // Get type-specific configuration
  const typeConfig = useMemo(() => getInputTypeConfig(type), [type]);

  // Handle password visibility toggle
  const isPasswordType = type === 'password';
  const actualSecureTextEntry = isPasswordType ? !showPassword : (secureTextEntry ?? typeConfig.secureTextEntry);

  // Create password toggle button
  const passwordToggleButton = isPasswordType ? (
    <Pressable
      onPress={() => setShowPassword(!showPassword)}
      style={{
        padding: 4,
        justifyContent: 'center',
        alignItems: 'center',
        margin: -8, // Negative margin to extend hitbox outside the visual bounds
      }}
      hitSlop={8} // Additional hit area of 8px on all sides
      accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
      accessibilityRole="button"
    >
      <Icon
        name={showPassword ? 'eye' : 'eyeOff'}
        size={20}
        color={theme.text.muted}
      />
    </Pressable>
  ) : null;

  // Determine the right section content
  const finalRightSection = isPasswordType ? passwordToggleButton : rightSection;

  // Default withAsterisk to true when required is true
  const finalWithAsterisk = withAsterisk ?? required;

  // Calculate effective numberOfLines for dynamic multiline behavior
  const effectiveNumberOfLines = useMemo(() => {
    if (numberOfLines) return numberOfLines; // Explicit numberOfLines takes priority
    if (multiline) return currentLines; // Use dynamic line count for multiline
    return undefined; // Single line by default
  }, [numberOfLines, multiline, currentLines]);

  // Merge type config with explicit props
  const mergedTextInputProps = useMemo(() => {
    const baseProps = {
      ...typeConfig,
      ...textInputProps,
      // Override secureTextEntry for password visibility toggle
      secureTextEntry: actualSecureTextEntry,
      // Explicit props override type config
      ...(autoComplete && { autoComplete }),
      ...(keyboardType && { keyboardType }),
      ...(multiline !== undefined && { multiline }),
      ...(effectiveNumberOfLines && { numberOfLines: effectiveNumberOfLines }),
      ...(maxLength && { maxLength })
    };

    // For password type, ensure additional security properties are preserved when not showing password
    if (isPasswordType && !showPassword) {
      return {
        ...baseProps,
        // Ensure these security properties are always applied for hidden passwords
        autoCorrect: false,
        spellCheck: false,
        textContentType: 'password' as const,
        clearButtonMode: 'never' as const,
        // Ensure immediate masking
        secureTextEntry: true,
        // iOS-specific properties for better security
        ...(Platform.OS === 'ios' && {
          keyboardAppearance: 'default' as const,
          enablesReturnKeyAutomatically: false,
          // Disable smart punctuation and auto-correction features that might reveal characters
          smartInsertDelete: false,
          smartQuotes: false,
          smartDashes: false,
        }),
      };
    }

    return baseProps;
  }, [
    typeConfig,
    textInputProps,
    actualSecureTextEntry,
    autoComplete,
    keyboardType,
    multiline,
    effectiveNumberOfLines,
    maxLength,
    isPasswordType,
    showPassword
  ]);

  return (<>
    <TextInputBase
      {...baseProps}
      value={value}
      onChangeText={handleChangeText}
      inputRef={inputRef || ref}
      required={required}
      withAsterisk={finalWithAsterisk}
      rightSection={finalRightSection}
    
      textInputProps={mergedTextInputProps}
      secureTextEntry={
        // Ensure secureTextEntry is only passed when not controlled by password toggle
        isPasswordType ? undefined : mergedTextInputProps.secureTextEntry
      }
    />
    </>
  );
});

// Set display name for debugging
Input.displayName = 'Input';
