import React, { forwardRef, useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { TextInput, View, Text, Pressable, Platform } from 'react-native';
import { useTheme } from '../../core/theme';
import { getSpacingStyles, extractSpacingProps, getLayoutStyles, extractLayoutProps } from '../../core/utils';
import { createRadiusStyles } from '../../core/theme/radius';
import { factory } from '../../core/factory/factory';
import { useTextAreaStyles } from './styles';
import { FieldHeader } from '../_internal/FieldHeader';
import { TextAreaProps, TextAreaStyleProps } from './types';
import { Icon } from '../Icon';
import { DESIGN_TOKENS } from '../../core/design-tokens';

interface TextAreaLabelProps {
  required?: boolean;
  children: React.ReactNode;
}

const TextAreaLabel: React.FC<TextAreaLabelProps> = ({ required, children }) => {
  const theme = useTheme();
  const { getTextAreaStyles } = useTextAreaStyles({ theme } as any);
  const styles = getTextAreaStyles({ size: 'md' } as any);

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

export const TextArea = factory<{
  props: TextAreaProps;
  ref: TextInput;
}>((props, ref) => {
  const { spacingProps, otherProps: propsAfterSpacing } = extractSpacingProps(props);
  const { layoutProps, otherProps } = extractLayoutProps(propsAfterSpacing);
  
  const {
    value,
    defaultValue = '',
    onChangeText,
    label,
    disabled = false,
    required = false,
    placeholder,
    error,
    helperText,
    description,
    size = 'md',
    radius = 'md',
    rows = 3,
    minRows = 1,
    maxRows,
    autoResize = false,
    maxLength,
    showCharCounter = false,
    resize = 'none',
    textInputProps = {},
    style,
    testID,
    clearable,
    clearButtonLabel,
    onClear,
    ...rest
  } = otherProps;

  const { height } = layoutProps;

  const theme = useTheme();
  const { getTextAreaStyles } = useTextAreaStyles({ theme } as any);
  const [focused, setFocused] = useState(false);
  const [currentRows, setCurrentRows] = useState(rows);
  const [internalValue, setInternalValue] = useState(defaultValue);
  const textInputRef = useRef<TextInput>(null);
  const assignRef = useCallback((node: TextInput | null) => {
    textInputRef.current = node;

    if (typeof ref === 'function') {
      ref(node);
    } else if (ref && 'current' in (ref as any)) {
      (ref as any).current = node;
    }
  }, [ref]);

  // Determine if this is a controlled component
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;

  // Calculate dynamic rows for autoResize
  useEffect(() => {
    if (autoResize && currentValue) {
      const lines = currentValue.split('\n').length;
      const calculatedRows = Math.max(
        minRows,
        maxRows ? Math.min(lines, maxRows) : lines
      );
      setCurrentRows(calculatedRows);
    }
  }, [currentValue, autoResize, minRows, maxRows]);

  const handleFocus = useCallback(() => {
    setFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    setFocused(false);
  }, []);

  const handleChangeText = useCallback((text: string) => {
    if (maxLength && text.length > maxLength) {
      return;
    }
    
    // Update internal state for uncontrolled mode
    if (!isControlled) {
      setInternalValue(text);
    }
    
    // Call the onChange callback if provided
    onChangeText?.(text);
  }, [onChangeText, maxLength, isControlled]);

  const styleProps: TextAreaStyleProps = {
    size,
    focused,
    disabled,
    error: !!error,
    rows: autoResize ? currentRows : rows,
  };

  const styles = getTextAreaStyles(styleProps);
  const spacingStyles = getSpacingStyles(spacingProps);
  const layoutStyles = getLayoutStyles(layoutProps);
  const radiusStyles = createRadiusStyles(radius);

  const containerStyles = [
    styles.container,
    spacingStyles,
    layoutStyles,
    style
  ];

  const inputContainerStyles = [
    styles.inputContainer,
    radiusStyles,
    { height }
  ];

  const textInputStyles = [
    styles.textInput,
    
    { height: height || (autoResize ? currentRows * 24 : rows * 24), // Approximate row height
      textAlignVertical: resize === 'none' ? 'top' : undefined,
      // Disable resizing by user if resize is 'none'
      ...(resize === 'none' ? { resizeMode: 'none' } : {})
    }
  ];

  const charCount = currentValue?.length || 0;
  const isCharCountError = maxLength ? charCount > maxLength : false;

  const showClearButton = useMemo(() => {
    if (!clearable || disabled) return false;
    return !!currentValue && currentValue.length > 0;
  }, [clearable, disabled, currentValue]);

  const handleClear = useCallback(() => {
    if (disabled) return;

    if (!isControlled) {
      setInternalValue('');
    }

    textInputRef.current?.clear?.();
    requestAnimationFrame(() => textInputRef.current?.focus?.());

    onChangeText?.('');
    onClear?.();
  }, [disabled, isControlled, onChangeText, onClear]);

  const clearLabel = clearButtonLabel || 'Clear input';

  return (
    <View style={containerStyles} testID={testID}>
      {(label || description) && (
        <FieldHeader
          label={label}
          description={description}
          required={required}
          disabled={disabled}
          error={!!error}
        />
      )}
      
      <View style={[inputContainerStyles, { position: 'relative' }]}>
        <TextInput
          ref={assignRef}
          // style={]}
          style={{height: height || (autoResize ? currentRows * 24 : rows * 24), // Approximate row height
            ...textInputStyles.reduce((acc, style) => ({ ...acc, ...style }), {}),
            textAlignVertical: resize === 'none' ? 'top' : undefined,
            // Disable resizing by user if resize is 'none'
            ...(resize === 'none' ? { resizeMode: 'none' } : {}),
            paddingRight: showClearButton ? 32 : undefined,
          }}
          
          value={currentValue}
          onChangeText={handleChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          placeholderTextColor={theme.text.muted}
          editable={!disabled}
          multiline={true}
          numberOfLines={autoResize ? currentRows : rows}
          maxLength={maxLength}
          textAlignVertical="top"
          scrollEnabled={!autoResize}
          accessibilityLabel={typeof label === 'string' ? label : undefined}
          accessibilityHint={helperText}
          accessibilityState={{
            disabled,
          }}
          {...textInputProps}
          {...rest}
        />

        {showClearButton && (
          <Pressable
            onPress={handleClear}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={clearLabel}
            style={({ pressed }) => ([
              {
                position: 'absolute',
                top: Platform.OS === 'web' ? DESIGN_TOKENS.spacing.xs : DESIGN_TOKENS.spacing.sm,
                right: Platform.OS === 'web' ? DESIGN_TOKENS.spacing.xs : DESIGN_TOKENS.spacing.sm,
                padding: DESIGN_TOKENS.component.clearButton.padding,
                borderRadius: DESIGN_TOKENS.component.clearButton.borderRadius,
                backgroundColor: 'transparent',
              },
              Platform.OS === 'web' ? { cursor: 'pointer' } : null,
              pressed ? { opacity: DESIGN_TOKENS.opacity.pressed } : null,
            ])}
          >
            <Icon name="close" size={DESIGN_TOKENS.component.clearButton.size} color={theme.text.muted} />
          </Pressable>
        )}
      </View>

      {/* Character Counter */}
      {showCharCounter && maxLength && (
        <Text 
          style={[
            styles.charCounter, 
            isCharCountError && styles.charCounterError
          ]}
        >
          {charCount}/{maxLength}
        </Text>
      )}

      {/* Helper Text */}
      {helperText && !error && (
        <Text style={styles.helperText}>{helperText}</Text>
      )}

      {/* Error Text */}
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </View>
  );
});

TextArea.displayName = 'TextArea';