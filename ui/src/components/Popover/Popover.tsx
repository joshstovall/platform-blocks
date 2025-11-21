import React, {
  cloneElement,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Platform, View } from 'react-native';

import { factory } from '../../core/factory';
import { useTheme } from '../../core/theme';
import { getSpacingStyles, extractSpacingProps } from '../../core/utils';
import { measureElement } from '../../core/utils/positioning-enhanced';
import { useDropdownPositioning } from '../../core/hooks/useDropdownPositioning';
import type { PlacementType } from '../../core/utils/positioning-enhanced';

import { createPopoverStyles } from './styles';
import type {
  PopoverProps,
  PopoverTargetProps,
  PopoverDropdownProps,
  RegisteredDropdown,
  ArrowPosition,
} from './types';
import { PlatformBlocksThemeProvider } from '../../core/theme/ThemeProvider';

interface PopoverContextValue {
  opened: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  registerDropdown: (dropdown: RegisteredDropdown) => void;
  unregisterDropdown: () => void;
  anchorRef: React.MutableRefObject<any>;
  targetId: string;
  dropdownId: string;
  withRoles: boolean;
  disabled: boolean;
  returnFocus: boolean;
}

const PopoverContext = createContext<PopoverContextValue | null>(null);

function usePopoverContext(component: string): PopoverContextValue {
  const context = useContext(PopoverContext);
  if (!context) {
    throw new Error(`${component} must be used within Popover`);
  }
  return context;
}

type CloseReason = 'programmatic' | 'dismiss';

const DEFAULT_ARROW_SIZE = 7;

const PopoverBase = (props: PopoverProps, ref: React.Ref<View>) => {
  const {
    children,
    opened: controlledOpened,
    defaultOpened = false,
    onChange,
    onOpen,
    onClose,
    onDismiss,
    disabled = false,
    closeOnClickOutside = true,
    closeOnEscape = true,
    clickOutsideEvents, // currently not implemented
    trapFocus = false,
    keepMounted = false,
    returnFocus = false,
    withinPortal = true,
    withOverlay = false,
    overlayProps,
    width,
    minWidth,
    minHeight,
    maxWidth,
    maxHeight,
    radius,
    shadow,
    zIndex = 300,
    position = 'bottom',
    offset = 8,
    floatingStrategy = 'fixed',
    middlewares,
    preventPositionChangeWhenVisible = false,
    hideDetached = true,
    viewport,
  keyboardAvoidance = true,
    fallbackPlacements,
    boundary,
    withRoles = true,
    id,
    withArrow = false,
    arrowSize = DEFAULT_ARROW_SIZE,
    arrowRadius = 0,
    arrowOffset = 5,
    arrowPosition = 'center',
    onPositionChange,
    testID,
    ...rest
  } = props;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  void clickOutsideEvents; // reserved for future implementation
  const theme = useTheme();
  const { spacingProps } = extractSpacingProps(rest);

  // Reserved props for future enhancements (portal, overlay behaviours, detached handling)
  void withOverlay;
  void overlayProps;
  void withinPortal;
  void hideDetached;
  const spacingStyles = getSpacingStyles(spacingProps);

  const isControlled = controlledOpened !== undefined;
  const [internalOpened, setInternalOpened] = useState(defaultOpened);
  const [dropdownState, setDropdownState] = useState<RegisteredDropdown | null>(null);

  const opened = isControlled ? !!controlledOpened : internalOpened;
  const openedRef = useRef(opened);
  const closingReasonRef = useRef<CloseReason | null>(null);
  const anchorMeasurementsRef = useRef<{ width: number; height: number } | null>(null);

  useEffect(() => {
    openedRef.current = opened;
  }, [opened]);

  const resolvedOffset = typeof offset === 'number' ? offset : offset?.mainAxis ?? 8;
  const resolvedFlip = preventPositionChangeWhenVisible
    ? false
    : middlewares?.flip === false
      ? false
      : true;
  const resolvedShift = preventPositionChangeWhenVisible
    ? false
    : middlewares?.shift === false
      ? false
      : true;
  const resolvedStrategy = floatingStrategy ?? 'fixed';

  const { position: positioningResult, anchorRef, popoverRef, showOverlay, hideOverlay, updatePosition } = useDropdownPositioning({
    isOpen: opened && !disabled && !!dropdownState,
    placement: position,
    offset: resolvedOffset,
    strategy: resolvedStrategy,
    flip: resolvedFlip,
    shift: resolvedShift,
    boundary,
    keyboardAvoidance,
    fallbackPlacements,
    viewport,
    onClose: () => handleOverlayClose('dismiss'),
    closeOnClickOutside,
    closeOnEscape,
  });

  const popoverStyles = useMemo(() => createPopoverStyles(theme)({
    radius,
    shadow,
    arrowSize,
  }), [theme, radius, shadow, arrowSize]);

  const layoutUpdateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasMeasuredLayoutRef = useRef(false);

  // Defer re-measuring to the next frame so overlay position uses final layout metrics
  const schedulePositionUpdate = useCallback(() => {
    if (layoutUpdateTimeoutRef.current) {
      clearTimeout(layoutUpdateTimeoutRef.current);
    }

    layoutUpdateTimeoutRef.current = setTimeout(() => {
      updatePosition();
    }, 16);
  }, [updatePosition]);

  useEffect(() => {
    return () => {
      if (layoutUpdateTimeoutRef.current) {
        clearTimeout(layoutUpdateTimeoutRef.current);
        layoutUpdateTimeoutRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!opened) {
      hasMeasuredLayoutRef.current = false;
      if (layoutUpdateTimeoutRef.current) {
        clearTimeout(layoutUpdateTimeoutRef.current);
        layoutUpdateTimeoutRef.current = null;
      }
    }
  }, [opened]);

  useEffect(() => {
    hasMeasuredLayoutRef.current = false;
  }, [dropdownState]);

  const handleDropdownLayout = useCallback(() => {
    if (hasMeasuredLayoutRef.current) {
      return;
    }
    hasMeasuredLayoutRef.current = true;
    schedulePositionUpdate();
  }, [schedulePositionUpdate]);

  const updateAnchorMeasurements = useCallback(async () => {
    if (!anchorRef.current) return;
    try {
      const rect = await measureElement(anchorRef);
      anchorMeasurementsRef.current = { width: rect.width, height: rect.height };
    } catch {
      // noop – measurement failed (likely not mounted yet)
    }
  }, [anchorRef]);

  const commitOpen = useCallback(() => {
    if (openedRef.current || disabled) return;
    if (!isControlled) {
      setInternalOpened(true);
    }
    onChange?.(true);
    onOpen?.();
    openedRef.current = true;
  }, [disabled, isControlled, onChange, onOpen]);

  const commitClose = useCallback((reason: CloseReason) => {
    if (!openedRef.current) return;
    if (!isControlled) {
      setInternalOpened(false);
    }
    onChange?.(false);
    onClose?.();
    if (reason === 'dismiss') {
      onDismiss?.();
    }
    openedRef.current = false;
  }, [isControlled, onChange, onClose, onDismiss]);

  const handleOverlayClose = useCallback((reason: CloseReason) => {
    const closingReason = closingReasonRef.current ?? reason;
    closingReasonRef.current = null;
    commitClose(closingReason);
  }, [commitClose]);

  const openPopover = useCallback(() => {
    if (disabled) return;
    closingReasonRef.current = null;
    commitOpen();
  }, [commitOpen, disabled]);

  const closePopover = useCallback((reason: CloseReason = 'programmatic') => {
    if (!openedRef.current) return;
    closingReasonRef.current = reason;
    hideOverlay();
  }, [hideOverlay]);

  const togglePopover = useCallback(() => {
    if (openedRef.current) {
      closePopover('programmatic');
    } else {
      openPopover();
    }
  }, [closePopover, openPopover]);

  useEffect(() => {
    if (opened) {
      updateAnchorMeasurements();
    }
  }, [opened, updateAnchorMeasurements]);

  useEffect(() => {
    if (!opened) {
      closingReasonRef.current = null;
      hideOverlay();
      if (returnFocus && anchorRef.current && typeof anchorRef.current.focus === 'function') {
        anchorRef.current.focus();
      }
      return;
    }

    if (!dropdownState) return;

    updatePosition();
  }, [opened, dropdownState, updatePosition, hideOverlay, anchorRef, returnFocus]);

  useEffect(() => {
    if (!opened || !dropdownState) {
      hideOverlay();
      return;
    }

    if (!positioningResult) {
      return;
    }

    const computedFinalWidth = positioningResult.finalWidth && positioningResult.finalWidth > 0
      ? positioningResult.finalWidth
      : undefined;

    const widthOverride = (() => {
      if (typeof width === 'number') return width;
      if (width === 'target') {
        return anchorMeasurementsRef.current?.width ?? computedFinalWidth;
      }
      return computedFinalWidth;
    })();

    const sizeStyles: Record<string, number> = {};
    if (typeof minWidth === 'number') sizeStyles.minWidth = minWidth;
    if (typeof minHeight === 'number') sizeStyles.minHeight = minHeight;
    if (typeof maxWidth === 'number') sizeStyles.maxWidth = maxWidth;

    const computedMaxHeight = positioningResult.maxHeight;
    const resolvedMaxHeight = (() => {
      if (typeof maxHeight === 'number') {
        if (typeof computedMaxHeight === 'number') {
          return Math.min(maxHeight, computedMaxHeight);
        }
        return maxHeight;
      }
      return typeof computedMaxHeight === 'number' ? computedMaxHeight : maxHeight;
    })();

    if (typeof resolvedMaxHeight === 'number') sizeStyles.maxHeight = resolvedMaxHeight;

    const dropdownStyle = [popoverStyles.dropdown, dropdownState.style, sizeStyles];

    const content = (
      <View
        ref={popoverRef}
        style={[popoverStyles.wrapper, widthOverride ? { width: widthOverride } : null]}
        pointerEvents={dropdownState.trapFocus ? 'auto' : 'box-none'}
        testID={dropdownState.testID}
        onLayout={handleDropdownLayout}
        {...dropdownState.containerProps}
      >
        <View style={dropdownStyle as any}>
          {dropdownState.content}
        </View>
        {withArrow && (
          <View style={getArrowStyle(positioningResult.placement, arrowSize, arrowRadius, arrowOffset, arrowPosition, theme) as any} />
        )}
      </View>
    );

    showOverlay(content, {
      width: widthOverride,
      maxHeight: resolvedMaxHeight,
      zIndex,
    });

    onPositionChange?.(positioningResult.placement as PlacementType);
  }, [opened, dropdownState, positioningResult, popoverRef, showOverlay, hideOverlay, popoverStyles.dropdown, popoverStyles.wrapper, width, maxHeight, minWidth, minHeight, maxWidth, withArrow, arrowSize, arrowRadius, arrowOffset, arrowPosition, theme, zIndex, onPositionChange, schedulePositionUpdate]);

  useEffect(() => {
    return () => {
      hideOverlay();
    };
  }, [hideOverlay]);

  const registerDropdown = useCallback((dropdown: RegisteredDropdown) => {
    setDropdownState(dropdown);
  }, []);

  const unregisterDropdown = useCallback(() => {
    if (!keepMounted) {
      setDropdownState(null);
    }
  }, [keepMounted]);

  const targetId = useMemo(() => id ? `${id}-target` : `popover-target-${Math.random().toString(36).slice(2)}`, [id]);
  const dropdownId = useMemo(() => id ? `${id}-dropdown` : `popover-dropdown-${Math.random().toString(36).slice(2)}`, [id]);

  const contextValue = useMemo<PopoverContextValue>(() => ({
    opened,
    open: openPopover,
    close: () => closePopover('programmatic'),
    toggle: togglePopover,
    registerDropdown,
    unregisterDropdown,
    anchorRef,
    targetId,
    dropdownId,
    withRoles,
    disabled,
    returnFocus,
  }), [opened, openPopover, closePopover, togglePopover, registerDropdown, unregisterDropdown, anchorRef, targetId, dropdownId, withRoles, disabled, returnFocus]);

  const setContainerRef = useCallback((node: View | null) => {
    if (typeof ref === 'function') {
      ref(node);
    } else if (ref && 'current' in (ref as any)) {
      (ref as any).current = node;
    }
  }, [ref]);

  return (
    <PopoverContext.Provider value={contextValue}>
      <View ref={setContainerRef} style={spacingStyles} testID={testID}>
        {children}
      </View>
    </PopoverContext.Provider>
  );
};

function mergeRefs<T>(...refs: Array<React.Ref<T> | undefined>) {
  return (value: T | null) => {
    refs.forEach(ref => {
      if (!ref) return;
      if (typeof ref === 'function') {
        ref(value);
      } else if ('current' in ref) {
        (ref as React.MutableRefObject<T | null>).current = value;
      }
    });
  };
}

const PopoverTargetBase = (props: PopoverTargetProps, ref: React.Ref<any>) => {
  const { children, popupType = 'dialog', refProp = 'ref', targetProps } = props;
  const context = usePopoverContext('Popover.Target');

  if (!isValidElement(children)) {
    throw new Error('Popover.Target expects a single React element child');
  }

  const childProps = children.props as Record<string, any>;
  const sanitizedTargetProps = { ...(targetProps ?? {}) } as Record<string, any>;

  let externalTargetRef: React.Ref<any> | undefined;
  if (refProp && Object.prototype.hasOwnProperty.call(sanitizedTargetProps, refProp)) {
    externalTargetRef = sanitizedTargetProps[refProp];
    delete sanitizedTargetProps[refProp];
  }

  const accessibilityProps = context.withRoles && Platform.OS === 'web'
    ? {
      role: childProps.role ?? 'button',
      'aria-haspopup': popupType,
      'aria-expanded': context.opened,
      'aria-controls': context.opened ? context.dropdownId : undefined,
      id: context.targetId,
    }
    : { id: context.targetId };

  const composedRef = mergeRefs<any>((children as any).ref, externalTargetRef);

  const triggerHandlers: Record<string, any> = {};

  triggerHandlers.onPress = (...args: any[]) => {
    const tgt = targetProps as Record<string, any> | undefined;
    if (tgt && typeof tgt.onPress === 'function') {
      tgt.onPress(...args);
    }
    if (typeof childProps.onPress === 'function') {
      childProps.onPress(...args);
    }
    context.toggle();
  };

  if (Platform.OS === 'web') {
    triggerHandlers.onKeyDown = (event: any) => {
      const tgt = targetProps as Record<string, any> | undefined;
      if (tgt && typeof tgt.onKeyDown === 'function') {
        tgt.onKeyDown(event);
      }
      if (typeof childProps.onKeyDown === 'function') {
        childProps.onKeyDown(event);
      }
      if (event.defaultPrevented) return;
      if (event.key === 'Escape' && context.opened) {
        context.close();
      }
      if ((event.key === 'Enter' || event.key === ' ') && !context.opened) {
        event.preventDefault();
        context.open();
      }
    };
  }

  const dynamicRefProp: Record<string, any> = { [refProp]: composedRef };

  delete sanitizedTargetProps.onPress;
  delete sanitizedTargetProps.onKeyDown;

  const mergedProps: Record<string, any> = {
    ...sanitizedTargetProps,
    ...triggerHandlers,
    ...accessibilityProps,
    ...dynamicRefProp,
  };

  if (context.disabled) {
    mergedProps.disabled = true;
  }

  const anchorWrapperRef = mergeRefs(context.anchorRef, ref);

  return (
    <View ref={anchorWrapperRef} collapsable={false}>
      {cloneElement(children, mergedProps)}
    </View>
  );
};

const PopoverDropdownBase = (props: PopoverDropdownProps, _ref: React.Ref<View>) => {
  const { children, trapFocus = false, keepMounted, style, testID, ...rest } = props;
  const context = usePopoverContext('Popover.Dropdown');
  const theme = useTheme();

  const dropdownValue = useMemo<RegisteredDropdown>(() => ({
    content: (
      <PlatformBlocksThemeProvider theme={theme} inherit>
        {children}
      </PlatformBlocksThemeProvider>
    ),
    style,
    trapFocus,
    keepMounted,
    testID,
    containerProps: rest,
  }), [children, rest, style, trapFocus, keepMounted, testID, theme]);

  useEffect(() => {
    context.registerDropdown(dropdownValue);
    return () => context.unregisterDropdown();
  }, [context, dropdownValue]);

  if (keepMounted) {
    return (
      <View style={{ display: 'none' }}>
        {children}
      </View>
    );
  }

  return null;
};

function getArrowStyle(
  placement: PlacementType,
  arrowSize: number,
  arrowRadius: number,
  arrowOffset: number,
  arrowPosition: ArrowPosition,
  theme: ReturnType<typeof useTheme>
): Record<string, any> {
  if (Platform.OS !== 'web') {
    return {
      width: 0,
      height: 0,
      opacity: 0,
    };
  }
  const base = {
    position: 'absolute' as const,
    width: arrowSize * 2,
    height: arrowSize * 2,
    backgroundColor: theme.backgrounds.surface,
    transform: [{ rotate: '45deg' }] as const,
    borderRadius: arrowRadius,
    borderColor: theme.backgrounds.border,
    borderWidth: 1,
  };

  const [side, alignment] = placement.split('-') as [PlacementType, string | undefined];

  switch (side) {
    case 'top':
      return {
        ...base,
        bottom: -arrowSize,
        left: alignment === 'end'
          ? `calc(100% - ${(arrowPosition === 'side' ? arrowOffset : arrowSize)}px)`
          : alignment === 'start'
            ? (arrowPosition === 'side' ? arrowOffset : arrowSize)
            : '50%',
        marginLeft: alignment || arrowPosition === 'side' ? 0 : -arrowSize,
      };
    case 'bottom':
      return {
        ...base,
        top: -arrowSize,
        left: alignment === 'end'
          ? `calc(100% - ${(arrowPosition === 'side' ? arrowOffset : arrowSize)}px)`
          : alignment === 'start'
            ? (arrowPosition === 'side' ? arrowOffset : arrowSize)
            : '50%',
        marginLeft: alignment || arrowPosition === 'side' ? 0 : -arrowSize,
      };
    case 'left':
      return {
        ...base,
        right: -arrowSize,
        top: alignment === 'end'
          ? `calc(100% - ${(arrowPosition === 'side' ? arrowOffset : arrowSize)}px)`
          : alignment === 'start'
            ? (arrowPosition === 'side' ? arrowOffset : arrowSize)
            : '50%',
        marginTop: alignment || arrowPosition === 'side' ? 0 : -arrowSize,
      };
    case 'right':
      return {
        ...base,
        left: -arrowSize,
        top: alignment === 'end'
          ? `calc(100% - ${(arrowPosition === 'side' ? arrowOffset : arrowSize)}px)`
          : alignment === 'start'
            ? (arrowPosition === 'side' ? arrowOffset : arrowSize)
            : '50%',
        marginTop: alignment || arrowPosition === 'side' ? 0 : -arrowSize,
      };
    default:
      return base;
  }
}

const PopoverComponent = factory<{ props: PopoverProps; ref: View }>(PopoverBase);
const PopoverTarget = factory<{ props: PopoverTargetProps; ref: View }>(PopoverTargetBase);
const PopoverDropdown = factory<{ props: PopoverDropdownProps; ref: View }>(PopoverDropdownBase);

type PopoverCompoundComponent = typeof PopoverComponent & {
  Target: typeof PopoverTarget;
  Dropdown: typeof PopoverDropdown;
};

const Popover = PopoverComponent as PopoverCompoundComponent;
Popover.Target = PopoverTarget;
Popover.Dropdown = PopoverDropdown;

Popover.displayName = 'Popover';
Popover.Target.displayName = 'Popover.Target';
Popover.Dropdown.displayName = 'Popover.Dropdown';

export { Popover };
