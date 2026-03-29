import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { View } from 'react-native';
// TODO: Add onItemToggle?: OnAccordionToggle (using existing reserved type).

// TODO: Expose Accordion.Root, Accordion.Item future-proofing a compound API while keeping current wrapper for backward compatibility.

// TODO: Provide forwardRef to expose expandAll(), collapseAll(), toggle(key).


import { useTheme } from '../../core/theme';
import { SizeValue, getFontSize, getSpacing } from '../../core/theme/sizes';
import { BorderRadiusProps, createRadiusStyles } from '../../core/theme/radius';
import type { PlatformBlocksTheme } from '../../core/theme/types';
import { SpacingProps, getSpacingStyles, extractSpacingProps } from '../../core/utils';
import type { AccordionProps, AccordionRef } from './types';
import { fastHash } from '../../core/utils/hash';
import { getAccordionStyles } from './styles';
import { AccordionItemComponent } from './AccordionItem';

// (Item component + styles moved to separate files)

/**
 * Accordion component with instant open/close behavior (no animations).
 * Expansion state toggles immediately for maximum reliability across platforms.
 */
const AccordionBase = (props: AccordionProps, ref: React.Ref<AccordionRef>) => {
  const {
    items,
    type = 'single',
    defaultExpanded = [],
    expanded: controlledExpanded,
    onExpandedChange,
    variant = 'default',
    size = 'md',
    color = 'primary',
    showChevron = true,
    style,
    headerStyle,
    contentStyle,
    headerTextStyle,
    radius,
    persistKey,
    autoPersist = true,
    animated = true,
    onItemToggle,
    chevronPosition = 'end',
    density = 'comfortable',
    ...rest
  } = props;

  const { spacingProps, otherProps } = extractSpacingProps(rest);
  const spacingStyles = getSpacingStyles(spacingProps);

  const theme = useTheme();
  const radiusStylesRef = useRef(radius ? createRadiusStyles(radius) : undefined);
  // Cache radius; update only if radius prop identity changes
  useEffect(() => { radiusStylesRef.current = radius ? createRadiusStyles(radius) : undefined; }, [radius]);

  // Internal instance id (used for deterministic aria ids on web)
  const instanceId = useRef(Math.random().toString(36).substr(2, 9));

  // Persistent store for uncontrolled accordions
  const persistStoreRef = useRef<Map<string, string[]> | undefined>(undefined); // initialized lazily below
  if (!persistStoreRef.current) persistStoreRef.current = (globalThis as any).__PLATFORM_BLOCKS_ACCORDION_PERSIST__ || ((globalThis as any).__PLATFORM_BLOCKS_ACCORDION_PERSIST__ = new Map<string, string[]>());

  // Auto key generation when uncontrolled and no persistKey
  const autoKeyRef = useRef<string | null>(null);
  if (autoKeyRef.current === null && !persistKey && autoPersist && controlledExpanded === undefined) {
    const sig = items.map(i => i.key).join('|') + '|' + type + '|' + variant;
    autoKeyRef.current = 'acc-' + fastHash(sig);
  }
  const effectivePersistKey = persistKey || autoKeyRef.current || undefined;

  // Initialize internal state with lazy initializer (handles persistence)
  const [internalExpanded, setInternalExpanded] = useState<string[]>(() => {
    if (controlledExpanded !== undefined) return controlledExpanded;
    if (effectivePersistKey && persistStoreRef.current?.has(effectivePersistKey)) {
      const saved = persistStoreRef.current.get(effectivePersistKey)!;
      return [...saved];
    }
    return type === 'single' && defaultExpanded.length > 0 ? [defaultExpanded[0]] : [...defaultExpanded];
  });

  // Persist on change (uncontrolled only)
  useEffect(() => {
    if (controlledExpanded === undefined && effectivePersistKey) {
      persistStoreRef.current?.set(effectivePersistKey, internalExpanded);
    }
  }, [internalExpanded, controlledExpanded, effectivePersistKey]);

  // Sync internal state if switching from controlled to uncontrolled or vice versa (rare)
  useEffect(() => {
    if (controlledExpanded !== undefined) return; // ignore when controlled
  }, [controlledExpanded]);

  const expanded = controlledExpanded !== undefined ? controlledExpanded : internalExpanded;
  const styles = getAccordionStyles(theme, variant, size, color, radiusStylesRef.current, density);

  // Dev warnings for duplicate keys
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      const seen = new Set<string>();
      const dups: string[] = [];
      items.forEach(i => { if (seen.has(i.key)) dups.push(i.key); else seen.add(i.key); });
      if (dups.length) console.warn(`[Accordion] Duplicate item keys detected: ${dups.join(', ')}`);
    }
  }, [items]);

  // Reconcile expanded keys when items change
  useEffect(() => {
    const itemKeySet = new Set(items.map(i => i.key));
    const filtered = expanded.filter(k => itemKeySet.has(k));
    if (filtered.length !== expanded.length) {
      if (controlledExpanded === undefined) setInternalExpanded(filtered);
      onExpandedChange?.(filtered);
    }
  }, [items]);

  const handleItemPress = (itemKey: string) => {
    const item = items.find(i => i.key === itemKey);
    if (item?.disabled) return;

    let newExpanded: string[];
    const currentlyExpanded = expanded.includes(itemKey);

    if (type === 'single') {
      // Single mode: only one item can be open at a time
      if (currentlyExpanded) {
        // Close the currently open item
        newExpanded = [];
      } else {
        // Close any currently open item and open the clicked one
        newExpanded = [itemKey];
      }
    } else {
      // Multiple mode: items are independent
      newExpanded = currentlyExpanded
        ? expanded.filter(key => key !== itemKey)
        : [...expanded, itemKey];
    }

    // Update state
    if (controlledExpanded === undefined) setInternalExpanded(newExpanded);
    onExpandedChange?.(newExpanded);
    onItemToggle?.({
      itemKey,
      expanded: !currentlyExpanded,
      expandedKeys: newExpanded,
      type,
      variant,
    });
  };

  // Ref methods
  useImperativeHandle(ref, () => ({
    expandAll: () => {
      if (type === 'single') {
        if (items[0]) handleItemPress(items[0].key); // ensure one open
        return;
      }
      const keys = items.filter(i => !i.disabled).map(i => i.key);
      if (controlledExpanded === undefined) setInternalExpanded(keys);
      onExpandedChange?.(keys);
    },
    collapseAll: () => {
      if (controlledExpanded === undefined) setInternalExpanded([]);
      onExpandedChange?.([]);
    },
    toggle: (key: string) => handleItemPress(key),
    getExpanded: () => [...expanded],
  }), [expanded, items, type, variant, controlledExpanded]);

  return (
    <View style={[styles.container, spacingStyles, style]} {...otherProps}>
      {items.map((item, index) => {
        const isExpanded = expanded.includes(item.key);
        const isDisabled = item.disabled;
        const isLast = index === items.length - 1;

        return (
          <AccordionItemComponent
            key={item.key}
            item={item}
            isExpanded={isExpanded}
            isDisabled={isDisabled || false}
            isLast={isLast}
            variant={variant}
            onPress={() => handleItemPress(item.key)}
            showChevron={showChevron}
            styles={styles}
            chevronColor={theme.colors.gray[6]}
            disabledChevronColor={theme.colors.gray[4]}
            headerStyle={headerStyle}
            contentStyle={contentStyle}
            headerTextStyle={headerTextStyle}
            idPrefix={`accordion-${instanceId.current}`}
            animated={animated}
            chevronPosition={chevronPosition}
          />
        );
      })}
    </View>
  );
};

export const Accordion = forwardRef<AccordionRef, AccordionProps>(AccordionBase);

// Compound API scaffolding (future-proof). For now they just proxy to main implementation.
export const Root = Accordion;
export const Item = AccordionItemComponent; // In future could be standalone for advanced composition.

export const AccordionNamespace = Object.assign(Accordion, { Root, Item });

