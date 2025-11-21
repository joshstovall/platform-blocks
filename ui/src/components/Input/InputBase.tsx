import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { TextInput, View, Text, TextInputProps as RNTextInputProps, StyleSheet, Pressable, Platform } from 'react-native';
import { useTheme } from '../../core/theme';
import { createRadiusStyles } from '../../core/theme/radius';
import { getSpacingStyles, extractSpacingProps, getLayoutStyles, extractLayoutProps } from '../../core/utils';
import { factory } from '../../core/factory/factory';
import { createInputStyles } from './styles';
import { FieldHeader } from '../_internal/FieldHeader';
import { BaseInputProps, InputStyleProps, ExtendedTextInputProps } from './types';
import { Icon } from '../Icon';
import { ClearButton } from '../../core/components/ClearButton';
import { useAnnouncer } from '../../core/accessibility/hooks';
import { createAccessibilityProps } from '../../core/accessibility/utils';
import { useDirection } from '../../core/providers/DirectionProvider';
import { useKeyboardManagerOptional } from '../../core/providers/KeyboardManagerProvider';

interface InputLabelProps {
  required?: boolean;
  children: React.ReactNode;
}

const InputLabel: React.FC<InputLabelProps> = ({ required, children }) => {
  const theme = useTheme();
  const { isRTL } = useDirection();
  const { getInputStyles } = createInputStyles(theme, isRTL);
  const styles = getInputStyles({ size: 'md' } as InputStyleProps);

  return (
    <Text style={styles.label}>
      {children}
      {required && (
        <Text style={styles.required} accessibilityLabel="required">
          {' *'}
        </Text>
      )}
    </Text>
  );
};

interface TextInputBaseProps extends BaseInputProps {
  /** Whether input is focused */
  focused?: boolean;
  /** Additional TextInput props */
  textInputProps?: ExtendedTextInputProps;
  /** External ref passthrough */
  inputRef?: any;
  /** Force secure entry regardless of type */
  secureTextEntry?: boolean;
}

export const TextInputBase = factory<{
  props: TextInputBaseProps;
  ref: TextInput;
}>((props, ref) => {
  const { spacingProps, otherProps: propsAfterSpacing } = extractSpacingProps(props);
  const { layoutProps, otherProps } = extractLayoutProps(propsAfterSpacing);
  
  const {
    value,
    onChangeText,
    onEnter,
  label,
  description,
    error,
    helperText,
    disabled,
    required,
    size = 'md',
    withAsterisk,
    placeholder,
    leftSection,
    rightSection,
    focused: focusedProp,
    accessibilityLabel,
    accessibilityHint,
    testID,
    textInputProps,
    style,
    radius,
    secureTextEntry,
    clearable,
    clearButtonLabel,
    onClear,
    inputRef,
    name,
    keyboardFocusId,
    ...rest
  } = otherProps;

  const [focused, setFocused] = useState(false);
  const theme = useTheme();
  const { isRTL } = useDirection();
  const internalInputRef = useRef<TextInput | null>(null);

  // Accessibility hooks
  const { announce } = useAnnouncer();
  const generatedInputIdRef = useRef(`input-${(typeof label === 'string' && label) || 'field'}-${Math.random().toString(36).substr(2, 9)}`);
  const inputId = generatedInputIdRef.current;

  const fallbackFocusIdRef = useRef(`focus-${Math.random().toString(36).substr(2, 8)}`);
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

  const keyboardManager = useKeyboardManagerOptional();

  // Handle radius prop with 'md' as default for inputs
  const radiusStyles = createRadiusStyles(radius || 'md');

  const isFocused = focusedProp !== undefined ? focusedProp : focused;

  const textInputStyleProp = (textInputProps as any)?.style;
  const selectionColorProp = (textInputProps as any)?.selectionColor;
  const secureTextEntryProp = (textInputProps as any)?.secureTextEntry;
  const textInputOnChange = (textInputProps as any)?.onChangeText as ((text: string) => void) | undefined;

  const restTextInputProps = useMemo(() => {
    if (!textInputProps) return {} as Partial<RNTextInputProps>;
    const { style: _style, selectionColor: _selectionColor, secureTextEntry: _secureEntry, ...restProps } = textInputProps as any;
    return restProps as Partial<RNTextInputProps>;
  }, [textInputProps]);

  const normalizedValue = useMemo(() => {
    if (value == null) return '';
    return typeof value === 'string' ? value : String(value);
  }, [value]);

  const showClearButton = useMemo(() => {
    if (!clearable || disabled) return false;
    return normalizedValue.length > 0;
  }, [clearable, disabled, normalizedValue]);

  const styleProps: InputStyleProps = useMemo(() => ({
    error: !!error,
    disabled: !!disabled,
    focused: isFocused,
    size,
    hasLeftSection: !!leftSection,
    hasRightSection: !!rightSection || showClearButton
  }), [error, disabled, isFocused, size, leftSection, rightSection, showClearButton]);

  const { getInputStyles } = createInputStyles(theme, isRTL);
  const styles = getInputStyles(styleProps, radiusStyles);
  const spacingStyles = getSpacingStyles(spacingProps);
  const layoutStyles = getLayoutStyles(layoutProps);

  const flattenedInputStyle = useMemo(
    () => (textInputStyleProp ? StyleSheet.flatten(textInputStyleProp) : undefined),
    [textInputStyleProp]
  );

  const isSecureEntry = useMemo(() => {
    if (secureTextEntry !== undefined) {
      return secureTextEntry;
    }
    return secureTextEntryProp ?? false;
  }, [secureTextEntry, secureTextEntryProp]);

  const maskedValue = useMemo(() => {
    if (!isSecureEntry) return '';
    const length = Array.from(normalizedValue).length;
    if (length === 0) return '';
    return '•'.repeat(length);
  }, [isSecureEntry, normalizedValue]);

  const textColor = (flattenedInputStyle?.color as string) ?? (styleProps.disabled ? theme.text.disabled : theme.text.primary);

  const resolvedInputStyle = useMemo(() => {
    const base = [styles.input] as any[];
    if (textInputStyleProp) {
      base.push(textInputStyleProp);
    }
    base.push({ color: isSecureEntry ? 'transparent' : textColor });
    return base;
  }, [styles.input, textInputStyleProp, isSecureEntry, textColor]);

  const overlayStyle = useMemo(() => {
    const base = [styles.input] as any[];
    if (textInputStyleProp) {
      base.push(textInputStyleProp);
    }
    base.push({
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      color: textColor,
      flex: undefined,
    });
    return base;
  }, [styles.input, textInputStyleProp, textColor]);

  const handleFocus = useCallback(() => {
    setFocused(true);
    
    // Announce field information for screen readers
    if (label) {
      const announcement = `${label}${required ? ', required' : ''} text field`;
      announce(announcement);
    }
  }, [announce, label, required]);

  const handleBlur = useCallback(() => {
    setFocused(false);
    
    // Announce validation errors on blur
    if (error) {
      announce(`Error: ${error}`, { priority: 'assertive' });
    }
  }, [announce, error]);

  const handleSubmitEditing = useCallback(() => {
    if (onEnter) {
      onEnter();
    }
  }, [onEnter]);

  // Enhanced accessibility props
  const accessibilityState = {
    disabled: !!disabled,
  };

  const inputAccessibilityProps = {
    accessibilityLabel: accessibilityLabel || (typeof label === 'string' ? label : undefined),
    accessibilityHint: accessibilityHint || helperText,
    accessibilityState,
    accessibilityRequired: required,
    nativeID: inputId,
  };

  const assignInputRef = useCallback((node: TextInput | null) => {
    internalInputRef.current = node;

    if (typeof inputRef === 'function') {
      inputRef(node);
    } else if (inputRef && 'current' in inputRef) {
      (inputRef as any).current = node;
    }

    if (typeof ref === 'function') {
      ref(node);
    } else if (ref && 'current' in ref) {
      (ref as any).current = node;
    }
  }, [inputRef, ref]);

  const handleClear = useCallback(() => {
    if (disabled) return;

    internalInputRef.current?.clear?.();

    // Keep cursor focus for seamless editing
    requestAnimationFrame(() => {
      internalInputRef.current?.focus?.();
    });

    textInputOnChange?.('');
    onChangeText?.('');
    onClear?.();
  }, [disabled, textInputOnChange, onChangeText, onClear]);

  const clearButtonLabelText = clearButtonLabel || 'Clear input';

  const pendingFocusTarget = keyboardManager?.pendingFocusTarget;

  useEffect(() => {
    if (!keyboardManager || !pendingFocusTarget) {
      return;
    }

    if (pendingFocusTarget !== focusTargetId) {
      return;
    }

    if (keyboardManager.consumeFocusTarget(focusTargetId)) {
      requestAnimationFrame(() => {
        internalInputRef.current?.focus?.();
      });
    }
  }, [keyboardManager, pendingFocusTarget, focusTargetId]);

  return (
    <View style={[styles.container, spacingStyles, layoutStyles, style]} {...rest}>
      <FieldHeader
        label={label}
        description={description}
        required={required}
        withAsterisk={withAsterisk}
        disabled={disabled}
        error={!!error}
        size={size}
      />

      <View style={styles.inputContainer}>
        {leftSection && (
          <View style={styles.leftSection}>
            {leftSection}
          </View>
        )}

        <View style={{ flex: 1, position: 'relative', justifyContent: 'center' }}>
          <TextInput
            ref={assignInputRef}
            value={value}
            onChangeText={onChangeText}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onSubmitEditing={handleSubmitEditing}
            editable={!disabled}
            placeholder={placeholder}
            placeholderTextColor={theme.text.muted}
            style={resolvedInputStyle}
            selectionColor={selectionColorProp ?? textColor}
            testID={testID}
            secureTextEntry={isSecureEntry}
            {...inputAccessibilityProps}
            {...restTextInputProps}
          />
          {isSecureEntry && maskedValue.length > 0 && (
            <Text
              pointerEvents="none"
              accessible={false}
              style={overlayStyle}
              numberOfLines={1}
              ellipsizeMode="clip"
            >
              {maskedValue}
            </Text>
          )}
        </View>

        {(showClearButton || rightSection) && (
          <View style={styles.rightSection}>
            {showClearButton && (
              <ClearButton
                onPress={handleClear}
                size={size}
                accessibilityLabel={clearButtonLabelText}
                hasRightSection={!!rightSection}
              />
            )}
            {rightSection}
          </View>
        )}
      </View>

      {error && (
        <Text style={styles.error} role="alert" accessibilityLiveRegion="polite">
          {error}
        </Text>
      )}

      {helperText && !error && (
        <Text style={styles.helperText}>
          {helperText}
        </Text>
      )}
    </View>
  );
});
