import React, { useState, useRef, useCallback, useEffect, useLayoutEffect } from 'react';
import { View, Pressable, FlatList, Text, Platform, Modal, StyleSheet } from 'react-native';
import { ListGroup } from '../ListGroup';
import { useTheme } from '../../core/theme';
import { createRadiusStyles } from '../../core/theme/radius';
import { getSpacingStyles, extractSpacingProps, extractLayoutProps, getLayoutStyles } from '../../core/utils';
import { factory } from '../../core/factory/factory';
import { createInputStyles } from '../Input/styles';
import { FieldHeader } from '../_internal/FieldHeader';
import { SizeValue } from '../../core/theme/sizes';
import { useOverlay } from '../../core/providers/OverlayProvider';
import { MenuItemButton } from '../MenuItemButton';
import { Icon } from '../Icon';
import { ClearButton } from '../../core/components/ClearButton';
import { useDirection } from '../../core/providers/DirectionProvider';

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
  const { isRTL } = useDirection();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<any>(valueProp ?? defaultValue ?? null);
  const [triggerWidth, setTriggerWidth] = useState<number | null>(null);
  const triggerRef = useRef<View | null>(null);
  const { openOverlay, closeOverlay, updateOverlay } = useOverlay();
  const overlayIdRef = useRef<string | null>(null);

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

  const close = useCallback(()=>{
    setOpen(false);
    if(overlayIdRef.current){
      closeOverlay(overlayIdRef.current);
      overlayIdRef.current=null;
    }
  },[closeOverlay]);

  const computeAnchor = useCallback(()=>{
    if(Platform.OS !== 'web') return undefined;
    if(!triggerRef.current) return undefined;
    try {
      const node: any = (triggerRef.current as any)._node || (triggerRef.current as any);
      const rect = node?.getBoundingClientRect?.();
      if(rect){
        setTriggerWidth(rect.width);
        // In RTL, use rect.right instead of rect.left to align the dropdown
        const xPos = isRTL ? rect.right - rect.width : rect.left;
        return { x: xPos, y: rect.bottom + 4, width: rect.width, height: rect.height };
      }
    } catch(_e) {
      /* measurement failures are non-fatal on web */
    }
    return undefined;
  },[isRTL]);

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

  const getMenuContent = useCallback(()=> menu, [/* menu recomputed below */]);
  const openPortal = useCallback(()=>{
    if(disabled || Platform.OS !== 'web') return;
    const anchor = computeAnchor();
    const id = openOverlay({
      content: getMenuContent(),
      anchor,
      width: anchor?.width,
      strategy: 'fixed',
      zIndex: 1300,
      closeOnClickOutside: true,
      onClose: ()=>{ setOpen(false); }
    });
    overlayIdRef.current = id;
  },[disabled, computeAnchor, openOverlay, getMenuContent]);

  const toggle = useCallback(()=>{
    if(disabled) return;
    setOpen(o=>{
      const next = !o;
      if(next && Platform.OS === 'web') openPortal();
      if(next && Platform.OS !== 'web') measureTrigger();
      if(!next) close();
      return next;
    });
  },[disabled, openPortal, close, measureTrigger]);

  useLayoutEffect(()=>{
    if(open && Platform.OS === 'web' && overlayIdRef.current){
      const anchor = computeAnchor();
      if(anchor) updateOverlay(overlayIdRef.current,{ anchor });
    }
  },[open, value, options, computeAnchor, updateOverlay]);

  const handleSelect = useCallback((opt: SelectOption)=>{
    if(opt.disabled) return;
    if(valueProp === undefined) setValue(opt.value);
    onChange?.(opt.value, opt);
    if(closeOnSelect) close();
  },[onChange, valueProp, close, closeOnSelect]);

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

  const menu = (
    <ListGroup
      variant="default"
      size="sm"
      style={{
        maxHeight,
        width: triggerWidth || undefined,
        minWidth: triggerWidth || undefined,
      }}
    >
      <FlatList
        data={options}
        keyExtractor={o=>String(o.value)}
        renderItem={({item, index})=> {
          const selected = item.value === value;

          if (renderOption) {
            return <View>{renderOption(item, false, selected)}</View>;
          }

          const isLast = index === options.length - 1;

          return (
            <MenuItemButton
              onPress={() => handleSelect(item)}
              disabled={!!item.disabled}
              active={selected}
              compact
              rounded={false}
              style={{
                borderRadius: 0,
                borderBottomWidth: isLast ? 0 : StyleSheet.hairlineWidth,
                borderBottomColor: theme.colorScheme === 'dark' ? theme.colors.gray[4] : theme.colors.gray[2],
              }}
            >
              {item.label}
            </MenuItemButton>
          );
        }}
        style={{ maxHeight }}
        bounces={false}
      />
    </ListGroup>
  );

  const fieldContent = selectedOption ? (
    <Text style={{ color: disabled ? theme.text.disabled : theme.text.primary }}>{selectedOption.label}</Text>
  ) : (
    <Text style={{ color: disabled ? theme.text.disabled : theme.text.muted }}>{placeholder}</Text>
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
      {error && <Text style={inputStyles.error}>{error}</Text>}
      {!error && helperText && <Text style={inputStyles.helperText}>{helperText}</Text>}

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
