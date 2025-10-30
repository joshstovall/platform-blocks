import React, { useState, useRef, useCallback, useEffect, forwardRef } from 'react';
import { View, TextInput, Pressable } from 'react-native';
import { Text } from '../Text';
import { factory } from '../../core/factory';
import { useTheme } from '../../core/theme';
import { FieldHeader } from '../_internal/FieldHeader';
import { getSpacingStyles, extractSpacingProps } from '../../core/utils';
import { useDropdownPositioning } from '../../core/hooks/useDropdownPositioning';
import type { PlacementType } from '../../core/utils/positioning-enhanced';
import { useColorPickerStyles } from './styles';
import { ColorPickerProps } from './types';

import { isValidHex, normalizeHex } from './utils';
import { ColorSwatch } from '../ColorSwatch';
import { Icon } from '../Icon';
import { ClearButton } from '../../core/components/ClearButton';

// Common color swatches
const DEFAULT_SWATCHES = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57',
  '#FF9FF3', '#54A0FF', '#5F27CD', '#00D2D3', '#FF9F43',
  '#C44569', '#F8B500', '#6C5CE7', '#A29BFE', '#FD79A8',
  '#E84393', '#00B894', '#00CEC9', '#74B9FF', '#0984E3',
];

const DEFAULT_FALLBACK_PLACEMENTS: PlacementType[] = ['bottom-start', 'bottom-end', 'top-start', 'top-end', 'bottom', 'top'];

interface ColorPickerFactoryPayload {
  props: ColorPickerProps;
  ref: View;
}

const ColorPickerBase = forwardRef<View, ColorPickerProps>((props, ref) => {
  const {
    value,
    defaultValue = '',
    onChange,
    label,
    placeholder = 'Select color',
    disabled = false,
    required = false,
    error,
    description,
    size = 'md',
    variant = 'default',
    radius = 'md',
    showPreview = true,
    showInput = true,
    swatches = DEFAULT_SWATCHES,
    withSwatches = true,
    format = 'hex',
    withAlpha = false,
    style,
    previewStyle,
    inputStyle,
  testID,
  clearable = false,
  clearButtonLabel = 'Clear color',
    // Positioning props
    placement = 'bottom-start',
    flip = true,
    shift = true,
    boundary,
    offset = 8,
    autoReposition = true,
    fallbackPlacements = DEFAULT_FALLBACK_PLACEMENTS,
    ...spacingProps
  } = props;

  // Determine if this is a controlled or uncontrolled component
  const isControlled = value !== undefined;

  // Internal state for uncontrolled usage
  const [internalValue, setInternalValue] = useState(defaultValue);

  // Compute the effective value
  const effectiveValue = isControlled ? value : internalValue;

  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(effectiveValue);
  const [focused, setFocused] = useState(false);

  const theme = useTheme();
  const styles = useColorPickerStyles();
  const spacingStyles = getSpacingStyles(extractSpacingProps(spacingProps).spacingProps);

  // Enhanced positioning system using shared dropdown hook
  const {
    position,
    anchorRef,
    popoverRef,
    showOverlay,
    hideOverlay,
    updatePosition,
  } = useDropdownPositioning({
    isOpen,
    placement,
    flip,
    shift,
    boundary,
    offset,
    autoUpdate: autoReposition,
    fallbackPlacements,
    onClose: () => setIsOpen(false),
  });

  const hasMeasuredDropdownRef = useRef(false);

  useEffect(() => {
    if (!isOpen) {
      hasMeasuredDropdownRef.current = false;
    }
  }, [isOpen]);

  const handleDropdownLayout = useCallback(() => {
    if (hasMeasuredDropdownRef.current) return;
    hasMeasuredDropdownRef.current = true;
    setTimeout(() => {
      updatePosition();
    }, 16);
  }, [updatePosition]);

  // Sync inputValue when effectiveValue changes (controlled mode or defaultValue changes)
  useEffect(() => {
    setInputValue(effectiveValue);
  }, [effectiveValue]);

  const handleColorSelect = useCallback((color: string) => {
    const normalizedColor = normalizeHex(color);
    setInputValue(normalizedColor);

    // Update internal state for uncontrolled mode
    if (!isControlled) {
      setInternalValue(normalizedColor);
    }

    onChange?.(normalizedColor);
    setIsOpen(false);

    // Close overlay
    hideOverlay();
  }, [onChange, isControlled, hideOverlay]);

  const renderDropdownContent = useCallback(() => (
    <>
      {withSwatches && (
        <View style={styles.colorPalette}>
          <Text style={styles.paletteTitle}>Color Swatches</Text>
          <View style={styles.swatchGrid}>
            {swatches.map((swatchColor) => (
              <ColorSwatch
                key={swatchColor}
                color={swatchColor}
                size={32}
                onPress={() => handleColorSelect(swatchColor)}
                selected={effectiveValue === swatchColor}
                showBorder={false}
              />
            ))}
          </View>
        </View>
      )}
    </>
  ), [withSwatches, styles, swatches, handleColorSelect, effectiveValue]);

  const handleInputChange = useCallback((text: string) => {
    setInputValue(text);
    // Only update the value if it's a complete hex (3 or 6 chars after #)
    // Don't normalize here to allow typing without interference
    if (isValidHex(text)) {
      // Update internal state for uncontrolled mode without normalizing
      if (!isControlled) {
        setInternalValue(text);
      }

      onChange?.(text);
    }
  }, [onChange, isControlled]);

  const handleInputSubmit = useCallback(() => {
    if (isValidHex(inputValue)) {
      const normalizedColor = normalizeHex(inputValue);
      setInputValue(normalizedColor);

      // Update internal state for uncontrolled mode
      if (!isControlled) {
        setInternalValue(normalizedColor);
      }

      onChange?.(normalizedColor);
    } else {
      setInputValue(effectiveValue); // Reset to valid value
    }
    setFocused(false);
    setIsOpen(false);

    // Close overlay
    hideOverlay();
  }, [inputValue, effectiveValue, onChange, isControlled, hideOverlay]);

  const handleInputBlur = useCallback(() => {
    setFocused(false);

    // Normalize the hex value when user finishes editing
    if (isValidHex(inputValue)) {
      const normalizedColor = normalizeHex(inputValue);
      setInputValue(normalizedColor);

      // Update internal state for uncontrolled mode
      if (!isControlled) {
        setInternalValue(normalizedColor);
      }

      onChange?.(normalizedColor);
    } else if (inputValue !== effectiveValue) {
      // Reset to valid value if invalid
      setInputValue(effectiveValue);
    }
  }, [inputValue, effectiveValue, onChange, isControlled]);

  const handleToggleDropdown = useCallback(() => {
    if (disabled) return;
    setIsOpen(!isOpen);
  }, [disabled, isOpen]);

  const handleClear = useCallback(() => {
    if (disabled) return;

    setInputValue('');

    if (!isControlled) {
      setInternalValue('');
    }

    onChange?.('');
    hideOverlay();
    setIsOpen(false);
  }, [disabled, hideOverlay, isControlled, onChange]);

  const showClearButton = clearable && showInput && !disabled && (inputValue?.length ?? 0) > 0;

  // Handle opening/closing overlay with positioning
  useEffect(() => {
    if (isOpen && position) {
      const minimumWidth = typeof styles.dropdown.minWidth === 'number'
        ? styles.dropdown.minWidth
        : 320;
      const dropdownWidth = Math.max(position.finalWidth ?? 0, minimumWidth);
      const dropdownMaxHeight = position.maxHeight ?? 420;

      const dropdownContent = (
        <View
          ref={popoverRef}
          onLayout={handleDropdownLayout}
          style={[
            styles.dropdown,
            {
              width: dropdownWidth,
              maxHeight: dropdownMaxHeight,
            },
          ]}
        >
          {renderDropdownContent()}
        </View>
      );

      showOverlay(dropdownContent, {
        width: dropdownWidth,
        maxHeight: dropdownMaxHeight,
      });
    }
  }, [
    isOpen,
    position,
    showOverlay,
    handleDropdownLayout,
    renderDropdownContent,
    styles.dropdown,
  ]);

  return (
    <View ref={ref} style={[spacingStyles, style]} testID={testID}>
      {label && (
        <FieldHeader
          label={label}
          required={required}
          error={!!error}
          description={description}
        />
      )}

      <View ref={anchorRef} style={styles.wrapper}>
        <View
          style={[
            styles.input,
            focused && styles.inputFocused,
            error && styles.inputError,
            disabled && styles.inputDisabled,
            inputStyle,
          ]}
        >
          <View style={[styles.preview, previewStyle]}>
            <View
              style={[
                styles.preview,
                {
                  backgroundColor: effectiveValue || 'transparent',
                  // Show a subtle border when no color is selected
                  ...((!effectiveValue) && {
                    borderWidth: 1,
                    borderColor: theme.colors.gray[3],
                    borderStyle: 'dashed',
                  })
                },
              ]}
            />
          </View>

          {showInput && (
            <TextInput
              value={inputValue}
              onChangeText={handleInputChange}
              onSubmitEditing={handleInputSubmit}
              onFocus={() => setFocused(true)}
              onBlur={handleInputBlur}
              placeholder={placeholder}
              placeholderTextColor={theme.text.secondary}
              style={[
                styles.textInput,
                { flex: 1 }
              ]}
              autoCapitalize="characters"
              autoComplete="off"
              autoCorrect={false}
              maxLength={7}
              editable={!disabled}
            />
          )}

          {showClearButton && (
            <ClearButton
              onPress={handleClear}
              disabled={disabled}
              size="md"
              accessibilityLabel={clearButtonLabel}
              hasRightSection={true}
              style={{ marginRight: 4 }}
            />
          )}

          <Pressable
            onPress={handleToggleDropdown}
            disabled={disabled}
            style={({ pressed }) => ([
              styles.dropdownTrigger,
              pressed ? styles.dropdownTriggerPressed : null,
            ])}
            accessibilityRole="button"
            accessibilityLabel={isOpen ? 'Collapse color options' : 'Expand color options'}
            accessibilityState={{ expanded: isOpen }}
          >
            <Text style={styles.dropdownIcon}>{isOpen ? '▲' : '▼'}</Text>
          </Pressable>
        </View>
      </View>

    </View>
  );
});

export const ColorPicker = factory<ColorPickerFactoryPayload>((props, ref) => (
  <ColorPickerBase {...props} ref={ref} />
));

ColorPicker.displayName = 'ColorPicker';