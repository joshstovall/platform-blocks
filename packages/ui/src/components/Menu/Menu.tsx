import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
  useEffect,
  cloneElement,
  isValidElement,
  ReactNode,
  useMemo,
} from 'react';
import { View, ScrollView, Pressable, Platform, ViewStyle } from 'react-native';
import { Text } from '../Text';
import { ListGroup, ListGroupBody, ListGroupDivider } from '../ListGroup';
import { factory } from '../../core/factory';
import { useTheme } from '../../core/theme';
import { useOverlay } from '../../core/providers/OverlayProvider';
import { measureElement, calculateOverlayPositionEnhanced } from '../../core/utils/positioning-enhanced';
import { getSpacingStyles, extractSpacingProps } from '../../core/utils';
import { MenuItemButton } from '../MenuItemButton';
import {
  MenuProps,
  MenuItemProps,
  MenuLabelProps,
  MenuDividerProps,
  MenuDropdownProps,
} from './types';
import { useMenuStyles } from './styles';

interface MenuContextValue {
  closeMenu: () => void;
  opened: boolean;
}

const MenuContext = createContext<MenuContextValue | null>(null);

export function useMenuContext() {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error('Menu compound components must be used within Menu');
  }
  return context;
}

interface MenuFactoryPayload {
  props: MenuProps;
  ref: View;
}

function MenuBase(props: MenuProps, ref: React.Ref<View>) {
  const {
    opened: controlledOpened,
    trigger = 'click',
    position = 'auto',
    offset = 4,
    closeOnClickOutside = true,
    closeOnEscape = true,
    onOpen,
    onClose,
  w = 'auto',
    maxH = 300,
    shadow = 'md',
    radius = 'md',
    children,
    testID,
    disabled = false,
    strategy = Platform.OS === 'web' ? 'fixed' : 'portal',
    ...spacingProps
  } = props;

  const [internalOpened, setInternalOpened] = useState(false);
  // Derive menu dropdown items from children each render for reactivity
  const { menuItems, menuDropdownProps } = useMemo(() => {
    const childArray = React.Children.toArray(children);
    const menuDropdown = childArray.find(child => 
      isValidElement(child) && child.type === MenuDropdown
    );
    if (menuDropdown && isValidElement(menuDropdown)) {
      return {
        menuItems: (menuDropdown.props as any).children,
        menuDropdownProps: menuDropdown.props as MenuDropdownProps,
      };
    }
    return { menuItems: null, menuDropdownProps: undefined };
  }, [children]);
  // Build a stable signature from menu items' keys to avoid unnecessary overlay updates.
  const menuItemsSignature = useMemo(() => {
    if (!menuItems) {
      return (menuDropdownProps?.scrollable === false ? 'no-scroll' : 'scroll') + (menuDropdownProps?.testID ? `:${menuDropdownProps.testID}` : '');
    }
    const arr = React.Children.toArray(menuItems);
    const scrollSig = menuDropdownProps?.scrollable === false ? 'no-scroll' : 'scroll';
    const testIDSig = menuDropdownProps?.testID ? `:${menuDropdownProps.testID}` : '';
    const itemSig = arr.map((c: any, idx) => {
      const base = (isValidElement(c) && c.key != null ? c.key : idx);
      if (isValidElement(c)) {
        const propsAny = c.props as any;
        if (propsAny && propsAny['data-overlay-hash']) {
          return base + ':' + propsAny['data-overlay-hash'];
        }
      }
      return base;
    }).join('|');
    return `${scrollSig}${testIDSig}|${itemSig}`;
  }, [menuItems, menuDropdownProps]);
  const lastSignatureRef = useRef<string>('');
  // Keep a ref in sync with latest open state to avoid stale closures blocking first re-open click
  const isOpenedRef = useRef(false);
  const containerRef = useRef<View>(null);
  const triggerRef = useRef<View>(null);
  const { openOverlay, closeOverlay, updateOverlay } = useOverlay();
  const overlayIdRef = useRef<string | null>(null);
  const lastResolvedWidthRef = useRef<number | undefined>(undefined);
  const theme = useTheme();
  const styles = useMenuStyles();
  const dropdownSpacingStyles = useMemo(() => {
    if (!menuDropdownProps) return undefined;
    return getSpacingStyles(extractSpacingProps(menuDropdownProps as any).spacingProps);
  }, [menuDropdownProps]);

  const isOpened = controlledOpened !== undefined ? controlledOpened : internalOpened;
  isOpenedRef.current = isOpened;

  // Overlay content update effect moved below handleClose definition

  // Track last pointer position for context menu
  const lastPointerPosRef = useRef<{x: number; y: number} | null>(null);

  const handleClose = useCallback(() => {
    if (!isOpenedRef.current) return;
    if (overlayIdRef.current) {
      // This will trigger the lightweight onClose we passed to openOverlay
      closeOverlay(overlayIdRef.current);
      overlayIdRef.current = null;
    }
    // Ensure state sync even if overlay already closing
    setInternalOpened(false);
    isOpenedRef.current = false;
    // onClose is invoked in overlay onClose; avoid double-calling
  }, [closeOverlay]);

  const menuContextValueOpened = useMemo(() => ({ closeMenu: handleClose, opened: true }), [handleClose]);

  const buildMenuDropdown = useCallback((resolvedWidth: number | undefined) => {
    if (!menuItems) return null;
    const scrollable = menuDropdownProps?.scrollable !== false;
    const listGroupStyle: ViewStyle = {
      ...(styles.dropdown as any),
      ...(dropdownSpacingStyles || {}),
      maxHeight: maxH,
      width: resolvedWidth,
    };

    return (
      <MenuContext.Provider value={menuContextValueOpened}>
        <ListGroup
          variant="default"
          size="sm"
          style={listGroupStyle}
        >
          {scrollable ? (
            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              style={{ maxHeight: maxH }}
            >
              <ListGroupBody>{menuItems}</ListGroupBody>
            </ScrollView>
          ) : (
            <View style={{ maxHeight: maxH, overflow: 'hidden' }}>
              <ListGroupBody>{menuItems}</ListGroupBody>
            </View>
          )}
        </ListGroup>
      </MenuContext.Provider>
    );
  }, [menuItems, menuDropdownProps, styles.dropdown, dropdownSpacingStyles, maxH, menuContextValueOpened]);

  const handleOpen = useCallback(async (opts?: { clientX?: number; clientY?: number }) => {
    // Use ref to avoid stale isOpened value after async close from backdrop click
    if (disabled || isOpenedRef.current || !menuItems) return;

    try {
      console.log('Opening menu overlay...');
      console.log('containerRef:', containerRef);
      console.log('containerRef.current:', containerRef.current);
      console.log('triggerRef:', triggerRef);
      console.log('triggerRef.current:', triggerRef.current);
      
      // Add a small delay to ensure element is mounted
      await new Promise(resolve => setTimeout(resolve, 10));
      
      // Try to measure the container first, then fallback to trigger
  let anchorRef = containerRef.current ? containerRef : triggerRef;
      console.log('Using anchor ref:', anchorRef === containerRef ? 'container' : 'trigger');
      
      // Measure anchor element
      const triggerRect = await measureElement(anchorRef);
      console.log('Anchor rect:', triggerRect);
      
      // If we got zero dimensions, try again after a longer delay
      if (triggerRect.width === 0 && triggerRect.height === 0) {
        console.log('Zero dimensions detected, retrying measurement...');
        await new Promise(resolve => setTimeout(resolve, 100));
        const retryRect = await measureElement(anchorRef);
        console.log('Retry rect:', retryRect);
        if (retryRect.width > 0 || retryRect.height > 0) {
          Object.assign(triggerRect, retryRect);
        }
      }
      
      // Calculate base overlay size
      const estimatedMenuHeight = 120; // Estimate for typical menu with 3-4 items
      const resolvedWidth = w === 'target' ? triggerRect.width : (typeof w === 'number' ? w : (w === 'auto' ? 200 : 200));
      const overlaySize = {
        width: resolvedWidth,
        height: estimatedMenuHeight,
      };
      lastResolvedWidthRef.current = resolvedWidth;

      // If contextmenu trigger, prefer cursor coordinates
      let positionResult: { x: number; y: number };
      if (trigger === 'contextmenu') {
        const cursorX = opts?.clientX ?? lastPointerPosRef.current?.x ?? 0;
        const cursorY = opts?.clientY ?? lastPointerPosRef.current?.y ?? 0;
        // Basic viewport clamping (assume available via window for web)
        if (typeof window !== 'undefined') {
          const vw = window.innerWidth;
            const vh = window.innerHeight;
            positionResult = {
              x: Math.min(cursorX, vw - (overlaySize.width || 200) - 4),
              y: Math.min(cursorY, vh - overlaySize.height - 4),
            };
        } else {
          positionResult = { x: cursorX, y: cursorY };
        }
      } else {
        const calc = calculateOverlayPositionEnhanced(triggerRect, overlaySize, {
          placement: position,
          offset,
          strategy: strategy === 'portal' ? 'fixed' : strategy,
        });
        positionResult = calc;
      }
      
      console.log('Position result:', positionResult, 'overlaySize:', overlaySize);

      // Create menu dropdown content
      const menuDropdown = buildMenuDropdown(resolvedWidth);
      if (!menuDropdown) return;

      // Open overlay
      console.log('Opening menu overlay with config:', {
        anchor: { x: positionResult.x, y: positionResult.y, width: overlaySize.width, height: overlaySize.height },
        strategy,
        closeOnClickOutside,
        closeOnEscape,
        trigger,
      });
      
      const overlayId = openOverlay({
        content: menuDropdown,
        anchor: { x: positionResult.x, y: positionResult.y, width: overlaySize.width, height: overlaySize.height },
        placement: (positionResult as any).placement || position,
        closeOnClickOutside,
        closeOnEscape,
        strategy,
        // Provide lightweight onClose that only resets state; actual closing is already in progress
        onClose: () => {
          overlayIdRef.current = null;
          setInternalOpened(false);
          isOpenedRef.current = false;
          onClose?.();
        },
      });

      overlayIdRef.current = overlayId;
    setInternalOpened(true);
    isOpenedRef.current = true;
      onOpen?.();
    } catch (error) {
      console.warn('Failed to open menu:', error);
    }
  }, [disabled, w, position, offset, strategy, closeOnClickOutside, closeOnEscape, onOpen, menuItems, trigger, buildMenuDropdown, onClose]);

  // When menu content changes while open, update overlay content in place
  useEffect(() => {
    if (!isOpenedRef.current || !overlayIdRef.current) return;
    if (!menuItems) return;
    if (lastSignatureRef.current === menuItemsSignature) return; // no structural change
    lastSignatureRef.current = menuItemsSignature;
    const currentId = overlayIdRef.current;
    const resolvedWidth = lastResolvedWidthRef.current ?? (typeof w === 'number' ? w : undefined);
    const menuDropdown = buildMenuDropdown(resolvedWidth);
    if (!menuDropdown) return;
    updateOverlay(currentId, {
      content: menuDropdown,
    });
  }, [menuItemsSignature, menuItems, updateOverlay, w, buildMenuDropdown]);

  const handleToggle = useCallback(() => {
    if (isOpenedRef.current) {
      handleClose();
    } else {
      handleOpen();
    }
  }, [handleOpen, handleClose]);

  // Find trigger element (first non-MenuDropdown child)
  const findTriggerElement = (children: ReactNode): React.ReactElement => {
    const childArray = React.Children.toArray(children);
    const triggerChild = childArray.find(child => 
      isValidElement(child) && child.type !== MenuDropdown
    );
    
    if (!triggerChild || !isValidElement(triggerChild)) {
      throw new Error('Menu must have a trigger element (non-MenuDropdown child)');
    }
    
    return triggerChild;
  };

  const triggerElement = findTriggerElement(children);
  
  // Create a callback ref that works better with React Native Web
  const triggerCallbackRef = useCallback((node: any) => {
    triggerRef.current = node;
    // console.log('Trigger ref set to:', node);
  }, []);
  
  const enhancedTrigger = isValidElement(triggerElement) 
    ? cloneElement(triggerElement, {
        ref: triggerCallbackRef,
        ...(triggerElement.props as any),
        ...(trigger === 'click' && { onPress: handleToggle }),
        ...(trigger === 'hover' && Platform.OS === 'web' && {
          onMouseEnter: handleOpen,
          onMouseLeave: handleClose,
        }),
        ...(trigger === 'contextmenu' && Platform.OS === 'web' && {
          onContextMenu: (e: any) => {
            e.preventDefault();
            lastPointerPosRef.current = { x: e.clientX, y: e.clientY };
            handleOpen({ clientX: e.clientX, clientY: e.clientY });
          },
        }),
        ...(disabled && { opacity: 0.5 }),
      })
    : triggerElement;

  // Create a callback ref that forwards to both internal and external refs
  const combinedRef = useCallback((node: View | null) => {
    containerRef.current = node;
    if (typeof ref === 'function') {
      ref(node);
    } else if (ref) {
      (ref as any).current = node;
    }
    // console.log('Combined ref set to:', node);
  }, [ref]);

  return (
    <MenuContext.Provider value={{ closeMenu: handleClose, opened: isOpened }}>
      <View 
        ref={combinedRef}
        style={getSpacingStyles(extractSpacingProps(spacingProps).spacingProps)} 
        testID={testID}
        {...(trigger === 'contextmenu' && Platform.OS === 'web'
          ? {
              onContextMenu: (e: any) => {
                // Ensure we intercept the native browser context menu
                if (e?.preventDefault) e.preventDefault();
                const x = (e?.clientX ?? 0);
                const y = (e?.clientY ?? 0);
                lastPointerPosRef.current = { x, y };
                handleOpen({ clientX: x, clientY: y });
              },
            }
          : {})}
        onLayout={() => {
          // Force a re-render to ensure ref is available
          if (containerRef.current) {
            // console.log('Menu container onLayout - container ref available:', containerRef.current);
          }
        }}
      >
        {enhancedTrigger}
      </View>
    </MenuContext.Provider>
  );
}

// Menu.Item component
function MenuItemBase(props: MenuItemProps, ref: React.Ref<View>) {
  const { spacingProps, otherProps } = extractSpacingProps(props as any);
  const {
    children,
    onPress,
    disabled = false,
    startSection,
    endSection,
    color = 'default',
    closeMenuOnClick = true,
    testID,
    ...restProps
  } = otherProps as MenuItemProps;

  const { closeMenu } = useMenuContext();

  const handlePress = useCallback(() => {
    if (disabled) return;
    onPress?.();
    if (closeMenuOnClick) closeMenu();
  }, [disabled, onPress, closeMenuOnClick, closeMenu]);

  const tone: 'default' | 'danger' | 'success' | 'warning' =
    color === 'danger'
      ? 'danger'
      : color === 'success'
        ? 'success'
        : color === 'warning'
          ? 'warning'
          : 'default';

  return (
    <MenuItemButton
      ref={ref as any}
      onPress={handlePress}
      disabled={disabled}
      startIcon={startSection}
      endIcon={endSection}
      tone={tone}
      testID={testID}
      {...spacingProps}
      {...restProps}
    >
      {children}
    </MenuItemButton>
  );
}

// Menu.Label component
function MenuLabelBase(props: MenuLabelProps, ref: React.Ref<View>) {
  const { children, testID, ...spacingProps } = props;
  const styles = useMenuStyles();
  const spacingStyles = getSpacingStyles(extractSpacingProps(spacingProps).spacingProps);

  return (
    <View ref={ref} style={[styles.label, spacingStyles]} testID={testID}>
      <Text variant="small" colorVariant="secondary">
        {children}
      </Text>
    </View>
  );
}

// Menu.Divider component
function MenuDividerBase(props: MenuDividerProps, ref: React.Ref<View>) {
  const { testID, ...spacingProps } = props;
  const styles = useMenuStyles();
  const spacingStyles = getSpacingStyles(extractSpacingProps(spacingProps).spacingProps);

  return (
    <View ref={ref} style={[styles.divider, spacingStyles]} testID={testID} />
  );
}

// Menu.Dropdown component - This is just a container, it doesn't render anything itself
function MenuDropdownBase(props: MenuDropdownProps, ref: React.Ref<View>) {
  // MenuDropdown doesn't render anything in the main tree
  // Its children are extracted and rendered in the overlay
  return null;
}

// Create factory components
export const Menu = factory<MenuFactoryPayload>(MenuBase);
export const MenuItem = factory<{ props: MenuItemProps; ref: View }>(MenuItemBase);
export const MenuLabel = factory<{ props: MenuLabelProps; ref: View }>(MenuLabelBase);
export const MenuDivider = factory<{ props: MenuDividerProps; ref: View }>(MenuDividerBase);
export const MenuDropdown = factory<{ props: MenuDropdownProps; ref: View }>(MenuDropdownBase);

// Add compound components with type assertion
(Menu as any).Item = MenuItem;
(Menu as any).Label = MenuLabel;
(Menu as any).Divider = MenuDivider;
(Menu as any).Dropdown = MenuDropdown;

Menu.displayName = 'Menu';
MenuItem.displayName = 'Menu.Item';
MenuLabel.displayName = 'Menu.Label';
MenuDivider.displayName = 'Menu.Divider';
MenuDropdown.displayName = 'Menu.Dropdown';
