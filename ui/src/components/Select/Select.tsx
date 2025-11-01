import React, { useState, useRef, useCallback, useEffect, useLayoutEffect, useMemo } from 'react';
import { View, Pressable, FlatList, Text as RNText, Platform, Modal, LayoutChangeEvent } from 'react-native';
import { ListGroup, ListGroupDivider } from '../ListGroup';
import { useTheme } from '../../core/theme';
import { createRadiusStyles } from '../../core/theme/radius';
import { getSpacingStyles, extractSpacingProps, extractLayoutProps, getLayoutStyles, calculateOverlayPositionEnhanced, measureElement } from '../../core/utils';
import { factory } from '../../core/factory/factory';
import { createInputStyles } from '../Input/styles';
import { FieldHeader } from '../_internal/FieldHeader';
import { SizeValue } from '../../core/theme/sizes';
import { useOverlay } from '../../core/providers/OverlayProvider';
import { MenuItemButton } from '../MenuItemButton';
import { Icon } from '../Icon';
import { ClearButton } from '../../core/components/ClearButton';
import { useDirection } from '../../core/providers/DirectionProvider';
import { useMenuStyles } from '../Menu/styles';
import { Text } from '../Text';

import type { SelectOption, SelectProps } from './Select.types';

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
  onClear
  } = otherProps as SelectProps;

  const theme = useTheme();
  const menuStyles = useMenuStyles();
  const { isRTL } = useDirection();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<any>(valueProp ?? defaultValue ?? null);
  const [triggerWidth, setTriggerWidth] = useState<number | null>(null);
  const triggerRef = useRef<View | null>(null);
  const { openOverlay, closeOverlay, updateOverlay } = useOverlay();
  const overlayIdRef = useRef<string | null>(null);
  const menuSignatureRef = useRef<string>('');
  const menuLayoutRef = useRef<{ width: number; height: number } | null>(null);

  // keep controlled
  useEffect(()=>{ if(valueProp !== undefined) setValue(valueProp); },[valueProp]);

  const radiusStyles = createRadiusStyles(radius || 'md');
  const { getInputStyles } = createInputStyles(theme, isRTL);
  const inputStyles = getInputStyles({ size: size as any, focused: open, error: !!error, disabled: !!disabled, hasLeftSection:false, hasRightSection:true }, radiusStyles);

  const spacingStyles = getSpacingStyles(spacingProps);
  const layoutStyles = getLayoutStyles(layoutProps);

  // Determine if consumer explicitly controlled width (width, minWidth, flex or fullWidth)
  const hasExplicitWidth = !!(layoutProps as any)?.width || !!(layoutProps as any)?.minWidth || !!(layoutProps as any)?.flex || fullWidth;
  // Provide a sensible baseline so Select is not uncomfortably narrow on native (and web) when unconstrained.
  // Chosen 200 for balance; can be overridden via style/width/minWidth/fullWidth.
  const defaultMinWidthStyle = !hasExplicitWidth ? { minWidth: 200 } : null;
  const fullWidthStyle = fullWidth ? { width: '100%' as const } : null;

  const selectedOption = options.find((o: SelectOption)=>o.value === value) || null;
  const showClearButton = !!(clearable && selectedOption && !disabled);
  const clearLabel = clearButtonLabel || 'Clear selection';
  const optionRowHeight = useMemo(() => {
    switch (size) {
      case 'xs':
        return 30;
      case 'sm':
        return 34;
      case 'lg':
        return 44;
      case 'xl':
        return 48;
      default:
        return 38;
    }
  }, [size]);

  const close = useCallback(()=>{
    setOpen(false);
    if(overlayIdRef.current){
      closeOverlay(overlayIdRef.current);
      overlayIdRef.current=null;
    }
    menuLayoutRef.current = null;
  },[closeOverlay]);

  const measureTrigger = useCallback(() => {
    if (Platform.OS === 'web') return;
    if (!triggerRef.current) return;
    
    try {
      (triggerRef.current as any).measure?.((x: number, y: number, width: number, height: number) => {
        setTriggerWidth(width);
      });
    } catch (_e) {
      /* native measurement failures can be ignored safely */
    }
  }, []);

  const resolveDropdownPosition = useCallback(async (preferredSize?: { width?: number; height?: number }) => {
    if (Platform.OS !== 'web') return null;
    if (!triggerRef.current) return null;

    try {
      const anchorRect = await measureElement(triggerRef);
      if (!anchorRect || anchorRect.height === 0) {
        return null;
      }

      const optionCount = options.length || 1;
      const estimatedHeight = Math.min(
        maxHeight,
        Math.max(optionRowHeight * optionCount, optionRowHeight)
      );

  const estimatedWidth = (anchorRect.width && anchorRect.width > 0) ? anchorRect.width : (triggerWidth || 200);

      const overlayWidth = preferredSize?.width && preferredSize.width > 0
        ? preferredSize.width
        : estimatedWidth;
      const overlayHeight = preferredSize?.height && preferredSize.height > 0
        ? Math.min(preferredSize.height, maxHeight)
        : estimatedHeight;
      const overlaySize = {
        width: overlayWidth,
        height: overlayHeight,
      };

      const position = calculateOverlayPositionEnhanced(anchorRect, overlaySize, {
        placement: 'auto',
        offset: 6,
        strategy: 'fixed',
        flip: true,
        shift: true,
        boundary: 8,
      });

      const finalWidth = position.finalWidth || overlaySize.width;
      const finalHeight = position.finalHeight || overlaySize.height;

      setTriggerWidth(prev => {
        if (prev !== null && Math.abs(prev - finalWidth) < 1) {
          return prev;
        }
        return finalWidth;
      });

      return {
        position,
        overlaySize: {
          width: finalWidth,
          height: finalHeight,
        },
      };
    } catch (error) {
      console.warn('Select: failed to resolve dropdown position', error);
      return null;
    }
  }, [options, maxHeight, optionRowHeight, triggerWidth]);

  const handleMenuLayoutChange = useCallback(async (layout: { width: number; height: number }) => {
    const previous = menuLayoutRef.current;
    if (previous) {
      const widthDiff = Math.abs(previous.width - (layout.width || 0));
      const heightDiff = Math.abs(previous.height - (layout.height || 0));
      if (widthDiff < 1 && heightDiff < 1) {
        return;
      }
    }
    menuLayoutRef.current = layout;

    if (!open || Platform.OS !== 'web' || !overlayIdRef.current) return;

    const resolved = await resolveDropdownPosition({ width: layout.width, height: layout.height });
    if (!resolved) return;

    const { position, overlaySize } = resolved;
    updateOverlay(overlayIdRef.current, {
      anchor: {
        x: position.x,
        y: position.y,
        width: overlaySize.width,
        height: overlaySize.height,
      },
    });
  }, [open, resolveDropdownPosition, updateOverlay]);

  const handleMenuLayoutEvent = useCallback((event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout || {};
    if (width === undefined || height === undefined) return;
    handleMenuLayoutChange({ width, height });
  }, [handleMenuLayoutChange]);

  const handleSelect = useCallback((opt: SelectOption)=>{
    if(opt.disabled) return;
    if(valueProp === undefined) setValue(opt.value);
    onChange?.(opt.value, opt);
    if(closeOnSelect) close();
  },[onChange, valueProp, close, closeOnSelect]);

  const menu = useMemo(() => {
    const resolvedWidth = triggerWidth && triggerWidth > 0 ? triggerWidth : undefined;
    return (
      <View
        style={resolvedWidth ? { width: resolvedWidth, minWidth: resolvedWidth } : undefined}
        onLayout={Platform.OS === 'web' ? handleMenuLayoutEvent : undefined}
      >
        <ListGroup
          variant="default"
          size="sm"
          style={{
            ...menuStyles.dropdown,
            maxHeight,
            ...(resolvedWidth ? { width: resolvedWidth, minWidth: resolvedWidth } : {}),
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
          style={{ maxHeight }}
          bounces={false}
        />
        </ListGroup>
      </View>
    );
  }, [menuStyles.dropdown, maxHeight, triggerWidth, options, value, renderOption, handleSelect, handleMenuLayoutEvent]);

  const getMenuContent = useCallback(() => menu, [menu]);
  const menuSignature = useMemo(() => {
    const optionSignature = options
      .map(opt => `${String(opt.value)}-${opt.label}-${opt.disabled ? '1' : '0'}`)
      .join('|');
    const valueSignature = typeof value === 'object' && value !== null
      ? JSON.stringify(value)
      : String(value ?? '');
    const triggerSig = triggerWidth != null ? `tw:${Math.round(triggerWidth)}` : 'tw:auto';
    return `${optionSignature}|value:${valueSignature}|${triggerSig}|render:${renderOption ? 'custom' : 'default'}`;
  }, [options, value, triggerWidth, renderOption]);
  const openPortal = useCallback(async () => {
    if (disabled || Platform.OS !== 'web') return;

    const resolved = await resolveDropdownPosition();
    if (!resolved) {
      close();
      return;
    }

    const { position, overlaySize } = resolved;

    const id = openOverlay({
      content: getMenuContent(),
      anchor: {
        x: position.x,
        y: position.y,
        width: overlaySize.width,
        height: overlaySize.height,
      },
      strategy: 'fixed',
      zIndex: 1300,
      closeOnClickOutside: true,
      closeOnEscape: true,
      onClose: () => {
        setOpen(false);
      }
    });
    overlayIdRef.current = id;
    menuSignatureRef.current = menuSignature;
  },[disabled, resolveDropdownPosition, openOverlay, getMenuContent, close, menuSignature]);

  const toggle = useCallback(()=>{
    if(disabled) return;
    setOpen(o=>{
      const next = !o;
      if(next && Platform.OS === 'web') {
        openPortal().catch(()=>{
          close();
        });
      }
      if(next && Platform.OS !== 'web') measureTrigger();
      if(!next) close();
      return next;
    });
  },[disabled, openPortal, close, measureTrigger]);

  useLayoutEffect(() => {
    if (!open || Platform.OS !== 'web' || !overlayIdRef.current) return;

    let cancelled = false;

    (async () => {
      const resolved = await resolveDropdownPosition();
      if (!resolved || cancelled) return;

      const { position, overlaySize } = resolved;
      updateOverlay(overlayIdRef.current!, {
        anchor: {
          x: position.x,
          y: position.y,
          width: overlaySize.width,
          height: overlaySize.height,
        },
      });
    })();

    return () => {
      cancelled = true;
    };
  }, [open, value, options, resolveDropdownPosition, updateOverlay]);

  useEffect(() => {
    if (!open || Platform.OS !== 'web' || !overlayIdRef.current) return;
    if (menuSignatureRef.current === menuSignature) return;
    menuSignatureRef.current = menuSignature;
    updateOverlay(overlayIdRef.current, {
      content: getMenuContent(),
    });
  }, [open, menuSignature, getMenuContent, updateOverlay]);

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
    <RNText style={{ color: disabled ? theme.text.disabled : theme.text.primary }}>{selectedOption.label}</RNText>
  ) : (
    <RNText style={{ color: disabled ? theme.text.disabled : theme.text.muted }}>{placeholder}</RNText>
  );

  return (
    <View style={[defaultMinWidthStyle, fullWidthStyle, spacingStyles, layoutStyles,]}>
      <FieldHeader label={label} description={description} disabled={disabled} error={!!error} size={size as any} />
      <Pressable
        ref={(node)=>{ (triggerRef as any).current=node; if(typeof ref==='function') ref(node); else if(ref) (ref as any).current=node; }}
        onPress={toggle}
        accessibilityRole="button"
        accessibilityLabel={label || placeholder}
        disabled={disabled}
        style={[
          inputStyles.inputContainer,
          { 
            flexDirection: isRTL ? 'row-reverse' : 'row', 
            alignItems:'center', 
            justifyContent:'space-between',
            maxWidth: '100%',
            width: '100%'
          }
        ]}
      >
        <View style={{ flex:1, ...(isRTL ? { paddingLeft: showClearButton ? 8 : 0 } : { paddingRight: showClearButton ? 8 : 0 }) }}>{fieldContent}</View>
        <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems:'center' }}>
          {showClearButton && (
            <ClearButton
              onPress={handleClear}
              size={size as any}
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
          <Pressable style={{ flex:1, backgroundColor:'rgba(0,0,0,0.2)', padding:24, justifyContent:'center' }} onPress={close}>
            <Pressable style={{ boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)', elevation:4 }}>
              {menu}
            </Pressable>
          </Pressable>
        </Modal>
      )}
    </View>
  );
});

export default Select;
