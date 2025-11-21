import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { View, Pressable, FlatList, Text as RNText, Platform, Modal } from 'react-native';

import { factory } from '../../core/factory/factory';
import { FieldHeader } from '../_internal/FieldHeader';
import { createInputStyles } from '../Input/styles';
import { useTheme } from '../../core/theme';
import { createRadiusStyles } from '../../core/theme/radius';
import { getSpacingStyles, extractSpacingProps, extractLayoutProps, getLayoutStyles } from '../../core/utils';
import type { SizeValue } from '../../core/theme/types';
import { MenuItemButton } from '../MenuItemButton';
import { ListGroup, ListGroupDivider } from '../ListGroup';
import { Icon } from '../Icon';
import { ClearButton } from '../../core/components/ClearButton';
import { useDirection } from '../../core/providers/DirectionProvider';
import { useMenuStyles } from '../Menu/styles';
import { Text } from '../Text';
import { useKeyboardManagerOptional } from '../../core/providers/KeyboardManagerProvider';
import { handleSelectionComplete } from '../../core/keyboard/selection';
import { useDropdownPositioning } from '../../core/hooks/useDropdownPositioning';
import type { PlacementType } from '../../core/utils/positioning-enhanced';

import type { SelectOption, SelectProps } from './Select.types';

const DROPDOWN_FALLBACK_PLACEMENTS: PlacementType[] = [
  'top-start',
  'top-end',
  'top',
  'bottom-start',
  'bottom-end',
  'bottom',
];

export const Select = factory<{ props: SelectProps; ref: any }>((allProps, ref) => {
  const { spacingProps, otherProps: propsAfterSpacing } = extractSpacingProps(allProps as any);
  const { layoutProps, otherProps } = extractLayoutProps(propsAfterSpacing);
  const {
    value: valueProp,
    defaultValue,
    onChange,
    options,
    placeholder = 'Select…',
    size = 'md',
    radius = 'md',
    disabled,
    label,
    helperText,
    description,
    error,
    renderOption,
    fullWidth,
    maxHeight = 260,
    closeOnSelect = true,
    clearable,
    clearButtonLabel,
    onClear,
    refocusAfterSelect,
    keyboardAvoidance = true,
  } = otherProps as SelectProps;

  const theme = useTheme();
  const menuStyles = useMenuStyles();
  const { isRTL } = useDirection();

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<any>(valueProp ?? defaultValue ?? null);
  const [triggerWidth, setTriggerWidth] = useState<number | null>(null);

  const triggerRef = useRef<View | null>(null);
  const keyboardManager = useKeyboardManagerOptional();
  const dismissKeyboardRef = keyboardManager?.dismissKeyboard;

  const {
    position,
    anchorRef,
    popoverRef,
    showOverlay,
    hideOverlay,
    updatePosition,
  } = useDropdownPositioning({
    isOpen: open && Platform.OS === 'web',
    placement: 'bottom-start',
    flip: true,
    shift: true,
    offset: 6,
    boundary: 8,
    fallbackPlacements: DROPDOWN_FALLBACK_PLACEMENTS,
    keyboardAvoidance,
    closeOnClickOutside: true,
    closeOnEscape: true,
    onClose: () => setOpen(false),
  });

  const hasMeasuredDropdownRef = useRef(false);

  useEffect(() => {
    if (!open) {
      hasMeasuredDropdownRef.current = false;
    }
  }, [open]);

  useEffect(() => {
    if (valueProp !== undefined) {
      setValue(valueProp);
    }
  }, [valueProp]);

  useEffect(() => {
    if (!open) {
      dismissKeyboardRef?.();
    }
  }, [open, dismissKeyboardRef]);

  const focusTrigger = useCallback(() => {
    const node: any = triggerRef.current;
    node?.focus?.();
  }, []);

  const blurTrigger = useCallback(() => {
    const node: any = triggerRef.current;
    node?.blur?.();
  }, []);

  const setTriggerNode = useCallback((node: View | null) => {
    triggerRef.current = node;
    (anchorRef as any).current = node;

    if (typeof ref === 'function') {
      ref(node);
    } else if (ref) {
      (ref as any).current = node;
    }
  }, [anchorRef, ref]);

  const radiusStyles = createRadiusStyles(radius || 'md');
  const { getInputStyles } = createInputStyles(theme, isRTL);
  const inputStyles = getInputStyles({
    size: size as SizeValue,
    focused: open,
    error: !!error,
    disabled: !!disabled,
    hasLeftSection: false,
    hasRightSection: true,
  }, radiusStyles);

  const spacingStyles = getSpacingStyles(spacingProps);
  const layoutStyles = getLayoutStyles(layoutProps);

  const hasExplicitWidth = !!(layoutProps as any)?.width || !!(layoutProps as any)?.minWidth || !!(layoutProps as any)?.flex || fullWidth;
  const defaultMinWidthStyle = !hasExplicitWidth ? { minWidth: 200 } : null;
  const fullWidthStyle = fullWidth ? { width: '100%' as const } : null;

  const selectedOption = options.find((o: SelectOption) => o.value === value) || null;
  const showClearButton = !!(clearable && selectedOption && !disabled);
  const clearLabel = clearButtonLabel || 'Clear selection';

  const close = useCallback(() => {
    setOpen(false);
    hideOverlay();
    keyboardManager?.dismissKeyboard();
  }, [hideOverlay, keyboardManager]);

  const measureTrigger = useCallback(() => {
    if (Platform.OS === 'web') return;
    if (!triggerRef.current) return;

    try {
      (triggerRef.current as any).measure?.((x: number, y: number, width: number) => {
        setTriggerWidth(width);
      });
    } catch {
      /* native measurement failures can be ignored safely */
    }
  }, []);

  const toggle = useCallback(() => {
    if (disabled) return;

    setOpen(prev => {
      const next = !prev;
      if (next) {
        if (Platform.OS !== 'web') {
          measureTrigger();
        }
      } else {
        hideOverlay();
        keyboardManager?.dismissKeyboard();
      }
      return next;
    });
  }, [disabled, measureTrigger, hideOverlay, keyboardManager]);

  const handleDropdownLayout = useCallback(() => {
    if (Platform.OS !== 'web' || !open) {
      return;
    }

    const runUpdate = () => {
      updatePosition();
    };

    if (!hasMeasuredDropdownRef.current) {
      hasMeasuredDropdownRef.current = true;
      setTimeout(runUpdate, 16);
      return;
    }

    runUpdate();
  }, [open, updatePosition]);

  useEffect(() => {
    if (Platform.OS !== 'web') {
      return;
    }

    const width = position?.finalWidth;
    if (!width || width <= 0) {
      return;
    }

    setTriggerWidth(prev => {
      if (prev !== null && Math.abs(prev - width) < 1) {
        return prev;
      }
      return width;
    });
  }, [position]);

  const resolvedDropdownWidth = useMemo(() => {
    if (position?.finalWidth && position.finalWidth > 0) {
      return position.finalWidth;
    }
    if (triggerWidth && triggerWidth > 0) {
      return triggerWidth;
    }
    return undefined;
  }, [position?.finalWidth, triggerWidth]);

  const resolvedDropdownMaxHeight = useMemo(() => {
    const keyboardMax = typeof position?.maxHeight === 'number' ? position.maxHeight : undefined;
    if (typeof maxHeight === 'number') {
      return keyboardMax ? Math.min(maxHeight, keyboardMax) : maxHeight;
    }
    return keyboardMax ?? maxHeight;
  }, [maxHeight, position?.maxHeight]);

  const handleSelect = useCallback((opt: SelectOption) => {
    if (opt.disabled) return;
      hideOverlay(); // <-- add this line before changing state


    if (valueProp === undefined) {
      setValue(opt.value);
    }

    onChange?.(opt.value, opt);

    handleSelectionComplete({
      mode: 'single',
      preferRefocus: refocusAfterSelect,
      keyboardManager,
      focusCallbacks: {
        focusPrimary: focusTrigger,
        blurPrimary: blurTrigger,
      },
    });

    if (closeOnSelect) {
      close();
    }
  }, [closeOnSelect, close, onChange, valueProp, refocusAfterSelect, keyboardManager, focusTrigger, blurTrigger]);

  const listMaxHeight = resolvedDropdownMaxHeight ?? maxHeight;
  const menu = useMemo(() => {
    const widthStyle = resolvedDropdownWidth && resolvedDropdownWidth > 0
      ? { width: resolvedDropdownWidth, minWidth: resolvedDropdownWidth }
      : undefined;
    const maxHeightStyle = listMaxHeight
      ? { maxHeight: listMaxHeight }
      : undefined;

    return (
      <View style={widthStyle}>
        <ListGroup
          variant="default"
          size="sm"
          style={{
            ...menuStyles.dropdown,
            ...(maxHeightStyle ?? {}),
            ...(widthStyle ?? {}),
          }}
        >
          <FlatList
            data={options}
            keyExtractor={o => String(o.value)}
            renderItem={({ item }) => {
              const selected = item.value === value;

              if (renderOption) {
                return <View>{renderOption(item, false, selected)}</View>;
              }

              const successPalette = theme.colors.success || [];
              const highlightColor = theme.colorScheme === 'dark'
                ? successPalette[4] || successPalette[5] || '#30D158'
                : successPalette[6] || successPalette[5] || '#2f9e44';
              const baseTextColor = item.disabled ? theme.text.disabled : theme.text.primary;
              const accentTextColor = item.disabled ? theme.text.disabled : highlightColor;

              return (
                <MenuItemButton
                  onPress={() => handleSelect(item)}
                  disabled={!!item.disabled}
                  active={selected}
                  tone={selected ? 'success' : 'default'}
                  hoverTone="success"
                  textColor={baseTextColor}
                  hoverTextColor={accentTextColor}
                  activeTextColor={accentTextColor}
                  compact
                  rounded={false}
                  style={{ borderRadius: 0 }}
                >
                  {item.label}
                </MenuItemButton>
              );
            }}
            ItemSeparatorComponent={renderOption ? undefined : ListGroupDivider}
            style={maxHeightStyle}
            bounces={false}
          />
        </ListGroup>
      </View>
    );
  }, [resolvedDropdownWidth, listMaxHeight, menuStyles.dropdown, options, value, renderOption, theme.colors.success, theme.colorScheme, theme.text.disabled, theme.text.primary, handleSelect]);

  useEffect(() => {
    if (Platform.OS !== 'web') {
      return () => {};
    }

    if (!open) {
      return () => {
        hideOverlay();
      }
      
    }

    if (!position) {
      return () => {};
    }

    const dropdownWidth = resolvedDropdownWidth;
    const dropdownMaxHeight = resolvedDropdownMaxHeight;

    const overlayContent = (
      <View
        ref={popoverRef}
        onLayout={handleDropdownLayout}
        style={[
          dropdownWidth ? { width: dropdownWidth, minWidth: dropdownWidth } : null,
          dropdownMaxHeight ? { maxHeight: dropdownMaxHeight } : null,
        ]}
      >
        {menu}
      </View>
    );

    showOverlay(overlayContent, {
      width: dropdownWidth,
      maxHeight: dropdownMaxHeight,
      zIndex: 1300,
    });

    // return () => hideOverlay();
  }, [open, 
    position, resolvedDropdownWidth, resolvedDropdownMaxHeight, popoverRef, handleDropdownLayout, menu, showOverlay, hideOverlay
  ]);

  useEffect(() => {
    return () => {
      hideOverlay();
    };
  }, [hideOverlay]);

  const handleClear = useCallback((event?: any) => {
    event?.stopPropagation?.();
    if (disabled) return;

    if (valueProp === undefined) {
      setValue(null);
    }

    onChange?.(null, null);
    onClear?.();
    close();
  }, [disabled, valueProp, onChange, onClear, close]);

  const fieldContent = selectedOption ? (
    <RNText style={{ color: disabled ? theme.text.disabled : theme.text.primary }}>
      {selectedOption.label}
    </RNText>
  ) : (
    <RNText style={{ color: disabled ? theme.text.disabled : theme.text.muted }}>
      {placeholder}
    </RNText>
  );

  return (
    <View style={[defaultMinWidthStyle, fullWidthStyle, spacingStyles, layoutStyles]}>
      <FieldHeader
        label={label}
        description={description}
        disabled={disabled}
        error={!!error}
        size={size as SizeValue}
      />
      <Pressable
        ref={setTriggerNode}
        onPress={toggle}
        accessibilityRole="button"
        accessibilityLabel={label || placeholder}
        disabled={disabled}
        style={[
          inputStyles.inputContainer,
          {
            flexDirection: isRTL ? 'row-reverse' : 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            maxWidth: '100%',
            width: '100%',
          },
        ]}
      >
        <View
          style={{
            flex: 1,
            ...(isRTL ? { paddingLeft: showClearButton ? 8 : 0 } : { paddingRight: showClearButton ? 8 : 0 }),
          }}
        >
          {fieldContent}
        </View>
        <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center' }}>
          {showClearButton && (
            <ClearButton
              onPress={handleClear}
              size={size as SizeValue}
              accessibilityLabel={clearLabel}
              hasRightSection={true}
            />
          )}
          <Icon
            name={open ? 'chevron-up' : 'chevron-down'}
            size={16}
            color={disabled ? theme.text.disabled : theme.text.muted}
          />
        </View>
      </Pressable>
      {error && <RNText style={inputStyles.error}>{error}</RNText>}
      {!error && helperText && <RNText style={inputStyles.helperText}>{helperText}</RNText>}

      {open && Platform.OS !== 'web' && (
        <Modal transparent animationType="fade" visible onRequestClose={close}>
          <Pressable
            style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.2)', padding: 24, justifyContent: 'center' }}
            onPress={close}
          >
            <Pressable style={{ boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)', elevation: 4 }}>
              {menu}
            </Pressable>
          </Pressable>
        </Modal>
      )}
    </View>
  );
});
