import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { View, TextInput, Modal, Pressable, ScrollView, Platform, DimensionValue, Keyboard, InteractionManager, StyleSheet } from 'react-native';
import { Text } from '../Text';
import { Loader } from '../Loader';
import { ListGroup } from '../ListGroup';
import { FieldHeader } from '../_internal/FieldHeader';
import { factory } from '../../core/factory';
import { useTheme } from '../../core/theme';
import { createInputStyles } from '../Input/styles';
import { createRadiusStyles } from '../../core/theme/radius';
import type { SizeValue } from '../../core/theme/types';
import { extractSpacingProps, getSpacingStyles } from '../../core/utils/spacing';
import { extractLayoutProps, getLayoutStyles } from '../../core/utils/layout';
import { useOverlay } from '../../core/providers/OverlayProvider';
import { usePopoverPositioning } from '../../core/hooks/usePopoverPositioning';
import type { PlacementType } from '../../core/utils/positioning-enhanced';
import type { AutoCompleteProps, AutoCompleteOption } from './types';
import { MenuItemButton } from '../MenuItemButton';
import { Icon } from '../Icon';
import { Chip } from '../Chip';
import type { ChipProps } from '../Chip/types';
import { FlashList } from '@shopify/flash-list';
import { ClearButton } from '../../core/components/ClearButton';
import { Highlight } from '../Highlight';

const debounce = require('lodash.debounce');

const DEFAULT_FALLBACK_PLACEMENTS: PlacementType[] = ['top-start', 'top-end', 'top', 'bottom-start', 'bottom-end', 'bottom'];

const defaultFilter = (item: AutoCompleteOption, query: string): boolean => {
  return item.label.toLowerCase().includes(query.toLowerCase()) ||
    item.value.toLowerCase().includes(query.toLowerCase());
};

export const AutoComplete = factory<{
  props: AutoCompleteProps;
  ref: View;
}>((props, ref) => {
  // Extract spacing and layout props but keep custom width props intact
  const { spacingProps, otherProps: propsAfterSpacing } = extractSpacingProps(props);
  const { layoutProps, otherProps } = extractLayoutProps(propsAfterSpacing);

  const {
    label,
    description,
    helperText,
    required = false,
    error,
    data = [],
    onSearch,
    minSearchLength = 2,
    searchDelay = 300,
    renderItem,
    onSelect,
    allowCustomValue = false,
    maxSuggestions = 10,
    showSuggestionsOnFocus = true,
    renderEmptyState,
    renderLoadingState,
    filter = defaultFilter,
    highlightMatches = true,
    suggestionsStyle,
    suggestionItemStyle,
    value,
    onChangeText,
    placeholder,
    style,
    disabled,
    size = 'md',
    radius = 'md',
    multiSelect = false,
    selectedValues = [],
  renderSelectedValue,
  selectedValuesContainerStyle,
  selectedValueChipProps,
    freeSolo = false,
    displayProperty = 'value',
    // Use modal on mobile native, portal on web
    useModal = Platform.OS !== 'web',
    usePortal = Platform.OS === 'web',
    inputWidth,
    minWidth = Platform.OS === 'android' ? 240 : undefined,
    // Enhanced positioning props
    placement = 'bottom-start',
    flip = true,
    shift = false,
    boundary = 12,
    offset = 4,
    autoReposition = true,
    fallbackPlacements = DEFAULT_FALLBACK_PLACEMENTS,
    clearable,
    clearButtonLabel,
    onClear,
    ...inputProps
  } = otherProps as any; // cast to allow new props (inputWidth, minWidth, usePortal, positioning props)

  const autoFocusProp = (inputProps as any)?.autoFocus as boolean | undefined;
  const restInputProps = useMemo(() => {
    if (!inputProps) {
      return {} as Record<string, any>;
    }

    const { autoFocus: _autoFocus, ...rest } = inputProps as Record<string, any>;
    return rest;
  }, [inputProps]);

  const baseTextInputProps = useMemo(() => ({
    ...restInputProps,
    autoFocus: useModal ? false : autoFocusProp,
  }), [restInputProps, useModal, autoFocusProp]);

  const modalTextInputProps = useMemo(() => ({
    ...restInputProps,
    autoFocus: autoFocusProp ?? true,
  }), [restInputProps, autoFocusProp]);

  const theme = useTheme();
  const radiusStyles = useMemo(() => createRadiusStyles(radius, undefined, 'input'), [radius]);
  const inputStyleFactory = useMemo(() => createInputStyles(theme), [theme]);
  const { openOverlay, closeOverlay, updateOverlay } = useOverlay();
  const [suggestions, setSuggestions] = useState<AutoCompleteOption[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState(value || '');
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const modalInputRef = useRef<TextInput>(null);
  const suggestionsRef = useRef<ScrollView>(null);
  const overlayIdRef = useRef<string | null>(null);
  const containerRef = useRef<View>(null);
  const prevPushedPositionRef = useRef<null | { x: number; y: number; w: number; h: number; mw?: number; mh?: number }>(null);

  // Enhanced positioning system - only use when usePortal is true
  const {
    position,
    anchorRef,
    popoverRef,
    updatePosition,
  } = usePopoverPositioning(
    showSuggestions && usePortal && !useModal,
    {
      placement,
      flip,
      shift,
      boundary,
      offset,
      autoUpdate: autoReposition,
      fallbackPlacements,
    }
  );

  // Guard: remember last popover size to avoid re-triggering updatePosition on position-only changes
  const lastPopoverSizeRef = useRef<{ w: number; h: number } | null>(null);
  const didInitialMeasureRef = useRef(false);
  const updatePositionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [inputHeight, setInputHeight] = useState(0);
  const [measuredWidth, setMeasuredWidth] = useState<number | undefined>(
    Platform.OS === 'web' ? undefined : 300 // Default fallback for mobile
  );
  const showClearButton = useMemo(() => {
    if (!clearable || disabled) return false;
    return query.length > 0;
  }, [clearable, disabled, query]);

  const inputStyles = useMemo(() => inputStyleFactory.getInputStyles({
    size: size as SizeValue,
    focused,
    error: !!error,
    disabled: !!disabled,
    hasLeftSection: false,
    hasRightSection: showClearButton,
  }, radiusStyles), [inputStyleFactory, size, focused, error, disabled, showClearButton, radiusStyles]);

  const clearLabel = clearButtonLabel || 'Clear input';

  const selectedCount = selectedValues?.length ?? 0;
  const hasSelectedValues = multiSelect && selectedCount > 0;

  const currentQueryRef = useRef(query);
  const currentSelectedValuesRef = useRef(selectedValues);

  currentQueryRef.current = query;
  currentSelectedValuesRef.current = selectedValues;

  const handlePopoverLayout = useCallback((e: any) => {
    const { width, height } = e?.nativeEvent?.layout || {};
    if (!width || !height) return;

    // Clear any pending update position calls to avoid race conditions
    if (updatePositionTimeoutRef.current) {
      clearTimeout(updatePositionTimeoutRef.current);
      updatePositionTimeoutRef.current = null;
    }

    // Call once on first mount to allow flip/fit logic to run with real size
    if (!didInitialMeasureRef.current) {
      didInitialMeasureRef.current = true;
      lastPopoverSizeRef.current = { w: width, h: height };
      // Defer slightly to ensure DOM has applied styles
      updatePositionTimeoutRef.current = setTimeout(() => {
        updatePositionTimeoutRef.current = null;
        updatePosition();
      }, 16);
      return;
    }

    // Check if height changed - this is especially important when popover is above input
    const prev = lastPopoverSizeRef.current;
    const widthChanged = !prev || Math.abs(prev.w - width) > 0.5;
    const heightChanged = !prev || Math.abs(prev.h - height) > 0.5;

    if (
      prev &&
      prev.h - height > 0.5 &&
      overlayIdRef.current &&
      usePortal &&
      !useModal &&
      position?.placement?.startsWith('top')
    ) {
      const heightDelta = prev.h - height;
      const currentAnchor = prevPushedPositionRef.current;
      const baseX = currentAnchor?.x ?? position?.x ?? 0;
      const baseY = currentAnchor?.y ?? position?.y ?? 0;
      const baseWidth = currentAnchor?.w ?? position?.finalWidth ?? width;

      const nextAnchorY = baseY + heightDelta;

      prevPushedPositionRef.current = {
        x: baseX,
        y: nextAnchorY,
        w: baseWidth,
        h: height,
        mh: position?.maxHeight,
      };

      updateOverlay(overlayIdRef.current, {
        anchor: {
          x: baseX,
          y: nextAnchorY,
          width: baseWidth,
          height,
        },
        width: measuredWidth || baseWidth,
        maxHeight: position?.maxHeight,
      });
    }

    if (widthChanged || heightChanged) {
      lastPopoverSizeRef.current = { w: width, h: height };

      // Use different delays based on what changed
      // Height changes need faster response when popover is above input
      const delay = heightChanged ? 8 : 16;

      updatePositionTimeoutRef.current = setTimeout(() => {
        updatePositionTimeoutRef.current = null;
        updatePosition();
      }, delay);
    }
  }, [updatePosition, position, updateOverlay, useModal, usePortal, measuredWidth]);

  const spacingStyles = getSpacingStyles(spacingProps);
  const layoutStyles = getLayoutStyles(layoutProps);

  // Debounced search function
  const debouncedSearch = useMemo(
    () => debounce(async (searchQuery: string) => {
      if (searchQuery.length < minSearchLength) {
        setSuggestions([]);
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        let results: AutoCompleteOption[] = [];

        if (onSearch) {
          // Use async search
          results = await onSearch(searchQuery);
        } else {
          // Use local data filtering
          results = data.filter((item: AutoCompleteOption) => filter(item, searchQuery));
        }

        // Apply max suggestions limit
        if (maxSuggestions > 0) {
          results = results.slice(0, maxSuggestions);
        }

        console.log('Search results:', results);

        setSuggestions(results);
      } catch (error) {
        console.error('AutoComplete search error:', error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, searchDelay),
    [onSearch, data, filter, minSearchLength, searchDelay, maxSuggestions]
  );

  const handleClearInput = useCallback(() => {
    if (disabled) return;

    setQuery('');
    onChangeText?.('');
    onClear?.();

    inputRef.current?.clear?.();
    modalInputRef.current?.clear?.();

    debouncedSearch.cancel?.();

    if (showSuggestionsOnFocus && data.length > 0) {
      const initial = data.slice(0, maxSuggestions);
      setSuggestions(initial);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }

    if (overlayIdRef.current) {
      closeOverlay(overlayIdRef.current);
      overlayIdRef.current = null;
    }

    requestAnimationFrame(() => {
      if (useModal && showSuggestions) {
        modalInputRef.current?.focus?.();
      } else {
        inputRef.current?.focus?.();
      }
    });
  }, [disabled, onChangeText, onClear, debouncedSearch, showSuggestionsOnFocus, data, maxSuggestions, closeOverlay, useModal, showSuggestions]);

  // Handle text input changes
  const handleChangeText = useCallback((text: string) => {
    console.log('handleChangeText', text);
    setQuery(text);
    onChangeText?.(text);

    if (text.length >= minSearchLength) {
      debouncedSearch(text);
      setShowSuggestions(true);
    } else if (text.length === 0 && showSuggestionsOnFocus && data.length > 0) {
      // If input is cleared and showSuggestionsOnFocus is enabled, show all options
      setSuggestions(data.slice(0, maxSuggestions));
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      // Keep suggestions visible if showSuggestionsOnFocus is true and we have data
      if (showSuggestionsOnFocus && data.length > 0) {
        setSuggestions(data.slice(0, maxSuggestions));
        setShowSuggestions(true);
      } else {
        setShowSuggestions(false);
      }
    }
  }, [onChangeText, debouncedSearch, minSearchLength, showSuggestionsOnFocus, data, maxSuggestions]);

  const handleRemoveSelectedValue = useCallback((item: AutoCompleteOption) => {
    if (disabled) return;

    onSelect?.(item);

    requestAnimationFrame(() => {
      if (useModal && showSuggestions) {
        modalInputRef.current?.focus?.();
      } else {
        inputRef.current?.focus?.();
      }
    });
  }, [disabled, onSelect, useModal, showSuggestions]);

  // Handle key press for freeSolo mode
  const handleKeyPress = useCallback((e: any) => {
    if (multiSelect && query.length === 0 && e?.nativeEvent?.key === 'Backspace') {
      const selectedItems = currentSelectedValuesRef.current;
      if (selectedItems && selectedItems.length > 0) {
        const lastItem = selectedItems[selectedItems.length - 1];
        if (lastItem) {
          handleRemoveSelectedValue(lastItem);
        }
      }
    }

    if (freeSolo && e.nativeEvent.key === 'Enter' && query.trim()) {
      // Create custom option from user input
      const customOption: AutoCompleteOption = {
        label: query.trim(),
        value: query.trim().toLowerCase().replace(/\s+/g, '-')
      };

      // Check if this option already exists
      const existsInData = data.some((item: AutoCompleteOption) =>
        item.value === customOption.value || item.label === customOption.label
      );

      if (!existsInData) {
        onSelect?.(customOption);

        if (!multiSelect) {
          setQuery('');
          onChangeText?.('');
          setShowSuggestions(false);
        }
      }
    }
  }, [freeSolo, query, data, onSelect, multiSelect, onChangeText, handleRemoveSelectedValue]);

  // Handle input focus
  const handleFocus = useCallback(() => {
    setFocused(true);
    // Show suggestions on focus if enabled and there's data available
    if (showSuggestionsOnFocus && data.length > 0) {
      // If query is empty, show all options (like a select dropdown)
      if (!query || query.length < minSearchLength) {
        setSuggestions(data.slice(0, maxSuggestions));
      }
      setShowSuggestions(true);
    } else if (query.length >= minSearchLength) {
      setShowSuggestions(true);
      debouncedSearch(query);
    }
  }, [showSuggestionsOnFocus, data, query, maxSuggestions, minSearchLength, debouncedSearch]);

  // Handle input blur
  const handleBlur = useCallback(() => {
    setFocused(false);
    // Delay hiding to allow selection
    setTimeout(() => {
      setShowSuggestions(false);
      Keyboard.dismiss();
      if (overlayIdRef.current) {
        closeOverlay(overlayIdRef.current);
        overlayIdRef.current = null;
      }
    }, 150);
  }, [closeOverlay]);

  // Handle suggestion selection
  const handleSelectSuggestion = useCallback((item: AutoCompleteOption) => {
    if (multiSelect) {
      onSelect?.(item);

      requestAnimationFrame(() => {
        if (useModal) {
          modalInputRef.current?.focus?.();
        } else {
          inputRef.current?.focus?.();
        }
      });

      return;
    }

    const displayValue = displayProperty === 'label' ? item.label : item.value;
    setQuery(displayValue);
    onChangeText?.(displayValue);
    onSelect?.(item);
    setShowSuggestions(false);

    if (useModal) {
      InteractionManager.runAfterInteractions(() => {
        modalInputRef.current?.blur?.();
        inputRef.current?.blur?.();
        Keyboard.dismiss();
        setFocused(false);
      });
    } else {
      InteractionManager.runAfterInteractions(() => {
        inputRef.current?.blur?.();
        Keyboard.dismiss();
        setFocused(false);
      });
    }
  }, [multiSelect, onSelect, useModal, displayProperty, onChangeText]);

  // Default item renderer - use stable reference to prevent loops
  const defaultRenderItem = useCallback((item: AutoCompleteOption, index: number, isSelected = false) => {
    const highlightQuery = highlightMatches ? currentQueryRef.current : undefined;

    return (
      <MenuItemButton
        onPress={() => handleSelectSuggestion(item)}
        disabled={item.disabled}
        active={isSelected}
        compact
        rounded={false}
        style={[styles.menuItemButton, suggestionItemStyle]}
        {...(Platform.OS === 'web' ? {
          onMouseDown: (event: any) => {
            if (event?.preventDefault) {
              event.preventDefault();
            }
            if (event?.stopPropagation) {
              event.stopPropagation();
            }
          },
        } : {})}
      >
        <Highlight highlight={highlightQuery}>
          {item.label}
        </Highlight>
      </MenuItemButton>
    );
  }, [handleSelectSuggestion, highlightMatches, suggestionItemStyle]);

  // Render item with enhanced parameters - use refs to prevent infinite loops
  const renderSuggestionItem = useCallback((item: AutoCompleteOption, index: number) => {
    const isSelected = multiSelect && currentSelectedValuesRef.current.some((selected: AutoCompleteOption) => selected.value === item.value);

    if (renderItem) {
      console.log('renderSuggestionItem with custom renderItem', item, index, isSelected);
      return renderItem(item, index, {
        query: currentQueryRef.current,
        onSelect: handleSelectSuggestion,
        isHighlighted: false, // Could be enhanced later for keyboard navigation
        isSelected,
      });
    }
    console.log('renderSuggestionItem with defaultRenderItem', item, index, isSelected);
    return defaultRenderItem(item, index, isSelected);
  }, [renderItem, handleSelectSuggestion, multiSelect, defaultRenderItem]);

  const styles = useMemo(() => {
    const surfaceColor = theme.backgrounds?.elevated ?? theme.backgrounds?.surface ?? (theme.colorScheme === 'dark' ? '#1C1C1E' : '#FFFFFF');

    return {
      container: {
        position: 'relative' as const,
        width: inputWidth != null ? (inputWidth as DimensionValue) : ('100%' as DimensionValue),
        ...(minWidth ? { minWidth } : {}),
      },
      inputContainer: {
        alignItems: multiSelect ? 'flex-start' as const : 'center' as const,
        paddingVertical: hasSelectedValues ? 10 : undefined,
        ...(Platform.OS === 'web' && {
          transition: 'box-shadow 0.15s ease, border-color 0.15s ease',
        }),
      },
      selectionArea: {
        flex: 1,
        flexDirection: 'row' as const,
        flexWrap: multiSelect ? 'wrap' as const : 'nowrap' as const,
        alignItems: multiSelect ? 'flex-start' as const : 'center' as const,
      },
      chip: {
        marginRight: 6,
        marginBottom: multiSelect ? 6 : 0,
        marginTop: multiSelect ? 2 : 0,
      },
      input: {
        flexGrow: 1,
        flexShrink: 1,
        paddingRight: showClearButton ? 12 : 0,
        minWidth: multiSelect ? 80 : undefined,
        marginTop: hasSelectedValues ? 2 : 0,
        marginBottom: hasSelectedValues ? 2 : 0,
      },
      suggestions: {
        position: 'absolute' as const,
        top: inputHeight,
        left: 0,
        width: measuredWidth || '100%',
        maxHeight: 300,
        backgroundColor: surfaceColor,
        borderRadius: (radiusStyles?.borderRadius ?? 12),
        marginTop: 4,
        overflow: 'hidden',
        minWidth: 260,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: theme.backgrounds?.border ?? (theme.colorScheme === 'dark' ? '#2C2C2E' : '#E5E7EB'),
        ...(Platform.OS === 'ios' && {
          boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
          elevation: 12,
        }),
        ...(Platform.OS === 'android' && {
          elevation: 12,
        }),
        ...(Platform.OS === 'web' && {
          boxShadow: '0 12px 32px rgba(15, 23, 42, 0.18)',
        }),
        ...suggestionsStyle,
        zIndex: 9999,
      },
      suggestionsList: {
        flex: 1,
      },
      suggestionItem: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: theme.backgrounds?.border ?? (theme.colorScheme === 'dark' ? '#2C2C2E' : '#E5E7EB'),
      },
      menuItemButton: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: theme.backgrounds?.border ?? (theme.colorScheme === 'dark' ? '#2C2C2E' : '#E5E7EB'),
        borderRadius: 0,
        paddingHorizontal: 16,
      },
      suggestionContent: {
        flex: 1,
      },
      loadingContainer: {
        padding: 20,
        alignItems: 'center' as const,
      },
      emptyContainer: {
        padding: 20,
        alignItems: 'center' as const,
      },
    };
  }, [theme, inputWidth, minWidth, multiSelect, hasSelectedValues, showClearButton, inputHeight, measuredWidth, suggestionsStyle, radiusStyles]);

  const renderSelectedValueItem = useCallback((item: AutoCompleteOption, index: number, source: 'input' | 'modal') => {
    const onRemove = () => handleRemoveSelectedValue(item);

    if (renderSelectedValue) {
      const node = renderSelectedValue(item, index, {
        onRemove,
        disabled: !!disabled,
        isFocused: focused,
        inputValue: query,
        source,
      });

      if (node == null) {
        return null;
      }

      return (
        <React.Fragment key={`${source}-${item.value}`}>
          {node}
        </React.Fragment>
      );
    }

    const {
      style: chipStyleOverride,
      onRemove: chipOnRemove,
      children: chipChildren,
      disabled: chipDisabledOverride,
      ...restChipProps
    } = selectedValueChipProps ?? {};

    const mergedChipStyle = chipStyleOverride
      ? { ...styles.chip, ...chipStyleOverride }
      : styles.chip;

    const chipDisabled = chipDisabledOverride ?? disabled;

    const handleChipRemove = () => {
      chipOnRemove?.();
      onRemove();
    };

    return (
      <Chip
        key={`${source}-${item.value}`}
        size="sm"
        variant="light"
        color="primary"
        {...restChipProps}
        disabled={chipDisabled}
        onRemove={handleChipRemove}
        style={mergedChipStyle}
      >
        {chipChildren ?? item.label}
      </Chip>
    );
  }, [handleRemoveSelectedValue, renderSelectedValue, disabled, focused, query, selectedValueChipProps, styles.chip]);



  // Create suggestion content that updates when data changes
  // Use a ref to prevent infinite loops by memoizing the render function separately
  const stableSuggestionStyles = useMemo(() => ({
    suggestions: [styles.suggestions, { position: 'relative' as const, top: 'auto' as const, left: 'auto' as const }],
    loadingContainer: styles.loadingContainer,
    emptyContainer: styles.emptyContainer,
    suggestionsList: styles.suggestionsList,
  }), [styles.suggestions, styles.loadingContainer, styles.emptyContainer, styles.suggestionsList]);

  const suggestionContent = useMemo(() => (
    <View style={stableSuggestionStyles.suggestions}>

      {loading ? (
        <View style={stableSuggestionStyles.loadingContainer}>
          {renderLoadingState ? renderLoadingState() : (
            <>
              <Loader size="sm" />
              <Text size="sm" colorVariant="secondary" style={{ marginTop: 8 }}>
                Searching...
              </Text>
            </>
          )}
        </View>
      ) : suggestions.length > 0 ? (
        <ListGroup variant="default" size="sm"
          style={{ maxHeight: 250 }}
        >
          <FlashList
            data={suggestions}
            keyboardShouldPersistTaps="always"
            renderItem={({ item, index }: { item: AutoCompleteOption; index: number }) => renderSuggestionItem(item, index)}
            keyExtractor={(item: AutoCompleteOption, index: number) => `${item.value}-${index}`}
            showsVerticalScrollIndicator={false}
            style={stableSuggestionStyles.suggestionsList}
          />
        </ListGroup>
      ) : query.length >= minSearchLength ? (
        <View style={stableSuggestionStyles.emptyContainer}>
          {renderEmptyState ? renderEmptyState() : (
            <Text size="sm" colorVariant="secondary">
              No suggestions found
            </Text>
          )}
        </View>
      ) : null}
    </View>
  ), [loading, suggestions, query.length, minSearchLength, renderLoadingState, renderEmptyState, renderSuggestionItem, stableSuggestionStyles]);

  // Keep overlay content in sync with latest suggestions/loading states when using portal strategy
  // Use a ref to prevent infinite loops from content updates
  const lastContentUpdateRef = useRef<any>(null);
  useEffect(() => {
    if (overlayIdRef.current && usePortal && !useModal && suggestionContent !== lastContentUpdateRef.current) {
      lastContentUpdateRef.current = suggestionContent;
      updateOverlay(overlayIdRef.current, { content: suggestionContent });
    }
  }, [suggestionContent, usePortal, useModal, updateOverlay]);

  // Track suggestions count changes to trigger repositioning when content height changes
  const prevSuggestionsCountRef = useRef<number>(0);
  const prevLoadingRef = useRef<boolean>(false);

  useEffect(() => {
    const currentCount = suggestions.length;
    const currentLoading = loading;

    // Check if the content height likely changed due to different number of items or loading state
    if (overlayIdRef.current && usePortal && !useModal && (
      prevSuggestionsCountRef.current !== currentCount ||
      prevLoadingRef.current !== currentLoading
    )) {
      // Update refs
      prevSuggestionsCountRef.current = currentCount;
      prevLoadingRef.current = currentLoading;

      // Trigger position update after a short delay to let the content re-render
      // This is especially important when the popover is positioned above the input
      setTimeout(() => {
        if (overlayIdRef.current) {
          updatePosition();
        }
      }, 50); // Slightly longer delay to ensure layout changes are complete
    }
  }, [suggestions.length, loading, usePortal, useModal, updatePosition]);

  // Track input width changes to update popover width
  const prevMeasuredWidthRef = useRef<number | undefined>(undefined);

  const hasMountedRef = useRef(false);
  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }

    if (showSuggestions) {
      return;
    }

    const handle = InteractionManager.runAfterInteractions(() => {
      const dismiss = () => {
        modalInputRef.current?.blur?.();
        inputRef.current?.blur?.();
        Keyboard.dismiss();
      };

      if (useModal) {
        setTimeout(dismiss, 120);
      } else {
        dismiss();
      }
    });

    return () => handle.cancel();
  }, [showSuggestions, useModal]);

  useEffect(() => {
    // If width changed, update the overlay width immediately
    if (overlayIdRef.current && usePortal && !useModal &&
      prevMeasuredWidthRef.current !== measuredWidth &&
      measuredWidth !== undefined) {

      prevMeasuredWidthRef.current = measuredWidth;

      // Update overlay width immediately for better UX
      updateOverlay(overlayIdRef.current, {
        width: measuredWidth,
      });
    }
  }, [measuredWidth, usePortal, useModal, updateOverlay]);

  // Handle overlay opening with enhanced positioning
  // Add a flag to prevent rapid overlay recreations
  const overlayCreationInProgressRef = useRef(false);

  useEffect(() => {
    // Wait for measured width to avoid initial positioning jumps
    if (showSuggestions && usePortal && !useModal && position && !overlayIdRef.current &&
      !overlayCreationInProgressRef.current && measuredWidth !== undefined) {
      overlayCreationInProgressRef.current = true;
      // Create suggestions content with popover ref for measurement and guard onLayout

      const enhancedSuggestionContent = (
        <View
          ref={popoverRef}
          onLayout={handlePopoverLayout}
          style={{
            backgroundColor: theme.colorScheme === 'dark' ? '#1C1C1E' : 'white',
            borderRadius: 12,
            overflow: 'hidden',
            // Set exact width to match input, with fallback to minWidth for safety
            width: measuredWidth || 260,
            maxHeight: position.maxHeight || 300,
            ...(Platform.OS === 'ios' && {
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)',
              elevation: 12,
            }),
            ...(Platform.OS === 'android' && {
              elevation: 12,
            }),
            ...(Platform.OS === 'web' && {
              boxShadow: '0 6px 28px rgba(0, 0, 0, 0.12)',
            }),
          }}
        >
          {suggestionContent}
          {/* Debug positioning info */}
          {__DEV__ && (position.flipped || position.shifted) && (
            <View style={{ padding: 4, borderTopWidth: 1, borderTopColor: '#eee' }}>
              {position.flipped && (
                <Text style={{ fontSize: 10, color: 'orange' }}>Flipped: {position.placement}</Text>
              )}
              {position.shifted && (
                <Text style={{ fontSize: 10, color: 'blue' }}>Shifted to stay in bounds</Text>
              )}
            </View>
          )}
        </View>
      );

      const overlayId = openOverlay({
        content: enhancedSuggestionContent,
        anchor: {
          x: position.x,
          y: position.y,
          width: position.finalWidth,
          height: position.finalHeight,
        },
        strategy: Platform.OS === 'web' ? 'fixed' : 'portal',
        closeOnClickOutside: true,
        closeOnEscape: true,
        // Use exact width from input measurement, with fallback for positioning system
        width: measuredWidth || 260,
        maxHeight: position.maxHeight,
        onClose: () => {
          overlayIdRef.current = null;
          overlayCreationInProgressRef.current = false;
          setShowSuggestions(false);
          didInitialMeasureRef.current = false;
          lastPopoverSizeRef.current = null;
        }
      });

      overlayIdRef.current = overlayId;
      overlayCreationInProgressRef.current = false;
    }
  }, [showSuggestions, usePortal, useModal, position, suggestionContent, openOverlay, theme.colorScheme, popoverRef, handlePopoverLayout, measuredWidth]);

  // Handle overlay closing - close when showSuggestions becomes false
  useEffect(() => {
    if (!showSuggestions && overlayIdRef.current) {
      closeOverlay(overlayIdRef.current);
      overlayIdRef.current = null;
    }
  }, [showSuggestions, closeOverlay]);

  useEffect(() => {
    if (!useModal || showSuggestions) {
      return;
    }

    modalInputRef.current?.blur();
    inputRef.current?.blur();
    Keyboard.dismiss();
    setFocused(false);
  }, [useModal, showSuggestions]);

  // Update overlay position when positioning changes (for real-time repositioning)
  // Deduplicate overlay updates: only push changes when something actually changed
  const positionUpdateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (overlayIdRef.current && position && usePortal && !useModal) {
      const current = { x: position.x, y: position.y, w: position.finalWidth, h: position.finalHeight, mh: position.maxHeight };
      const prev = prevPushedPositionRef.current;
      const changed = !prev || Math.abs(prev.x - current.x) > 0.5 || Math.abs(prev.y - current.y) > 0.5 || Math.abs((prev.w || 0) - (current.w || 0)) > 0.5 || Math.abs((prev.h || 0) - (current.h || 0)) > 0.5 || prev.mh !== current.mh;

      if (changed) {
        prevPushedPositionRef.current = current;

        // Clear any pending position updates to avoid race conditions
        if (positionUpdateTimeoutRef.current) {
          clearTimeout(positionUpdateTimeoutRef.current);
        }

        // Debounce position updates to prevent cascade loops
        positionUpdateTimeoutRef.current = setTimeout(() => {
          positionUpdateTimeoutRef.current = null;
          if (overlayIdRef.current) {
            updateOverlay(overlayIdRef.current, {
              anchor: {
                x: position.x,
                y: position.y,
                width: position.finalWidth,
                height: position.finalHeight,
              },
              width: measuredWidth || 260,
              maxHeight: position.maxHeight,
            });
          }
        }, 8);
      }
    }
  }, [position, updateOverlay, usePortal, useModal]);

  // Sync internal query state with external value prop
  useEffect(() => {
    if (value !== undefined && value !== query) {
      setQuery(value);
    }
  }, [value]);

  // Show initial suggestions on focus if enabled
  useEffect(() => {
    if (showSuggestionsOnFocus && data.length > 0 && !query) {
      setSuggestions(data.slice(0, maxSuggestions));
    }
  }, [showSuggestionsOnFocus, data, maxSuggestions, query]);

  // Cleanup timeouts on unmount to prevent memory leaks and potential crashes
  useEffect(() => {
    return () => {
      if (updatePositionTimeoutRef.current) {
        clearTimeout(updatePositionTimeoutRef.current);
      }
      if (positionUpdateTimeoutRef.current) {
        clearTimeout(positionUpdateTimeoutRef.current);
      }
      // Clean up overlay reference
      if (overlayIdRef.current) {
        closeOverlay(overlayIdRef.current);
        overlayIdRef.current = null;
      }
      overlayCreationInProgressRef.current = false;
    };
  }, [closeOverlay]);

  return (
    <View
      ref={(node) => {
        if (ref && typeof ref === 'function') ref(node);
        else if (ref && 'current' in ref) ref.current = node;
        containerRef.current = node;
      }}
      style={[inputStyles.container, styles.container, spacingStyles, layoutStyles, style]}
    >
      <FieldHeader
        label={label}
        description={description}
        required={required}
        disabled={disabled}
        error={!!error}
        size={size as SizeValue}
        withAsterisk={required}
      />

      {/* Input Container */}
      <View
        ref={anchorRef}
        onLayout={(e) => {

          const { height, width } = e.nativeEvent.layout;
          console.log('Input layout:', { width, height }); // Debug logging
          if (height && height !== inputHeight) setInputHeight(height);
          if (width && width !== measuredWidth) setMeasuredWidth(width);
        }}
        style={[inputStyles.inputContainer, styles.inputContainer]}
      >
        <View style={[styles.selectionArea, selectedValuesContainerStyle]}>
          {multiSelect && selectedValues.map((selected: AutoCompleteOption, index: number) =>
            renderSelectedValueItem(selected, index, 'input')
          )}
          <TextInput
            ref={inputRef}
            value={query}
            onChangeText={handleChangeText}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyPress={handleKeyPress}
            placeholder={hasSelectedValues ? '' : placeholder}
            placeholderTextColor={theme.text.muted}
            style={[inputStyles.input, styles.input]}
            editable={!disabled}
            {...baseTextInputProps}
          />
        </View>
        {showClearButton && (
          <ClearButton
            onPress={handleClearInput}
            size={size}
            accessibilityLabel={clearLabel}
          />
        )}
      </View>

      {/* Error & Helper Text */}
      {error && (
        <Text style={inputStyles.error}>
          {error}
        </Text>
      )}
      {!error && helperText && (
        <Text style={inputStyles.helperText}>
          {helperText}
        </Text>
      )}

      {showSuggestions && useModal ? (
        <Modal
          visible={showSuggestions}
          transparent={true}
          animationType="fade"
          onRequestClose={() => {
            setShowSuggestions(false);
            setFocused(false);
            InteractionManager.runAfterInteractions(() => {
              modalInputRef.current?.blur?.();
              inputRef.current?.blur?.();
              Keyboard.dismiss();
            });
          }}
          onDismiss={() => {
            InteractionManager.runAfterInteractions(() => {
              modalInputRef.current?.blur?.();
              inputRef.current?.blur?.();
              Keyboard.dismiss();
            });
          }}
        >
          <Pressable
            style={{
              flex: 1,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              justifyContent: 'center',
              alignItems: 'center',
              padding: 20,
            }}
            onPress={() => {
              setShowSuggestions(false);
              setFocused(false);
              InteractionManager.runAfterInteractions(() => {
                modalInputRef.current?.blur?.();
                inputRef.current?.blur?.();
                Keyboard.dismiss();
              });
            }}
          >
            <Pressable
              style={[styles.suggestions, {
                position: 'relative',
                top: 'auto',
                left: 'auto',
                right: 'auto',
                maxWidth: 400,
                width: '100%',
                height: 400, // Increased height to accommodate input
                paddingTop: 0,
              }]}
              onPress={(e) => e.stopPropagation()}
            >
              {/* Input field in modal */}
              <View
                style={[inputStyles.inputContainer, styles.inputContainer, { marginBottom: 8 }]}
              >
                <View style={[styles.selectionArea, selectedValuesContainerStyle]}>
                  {multiSelect && selectedValues.map((selected: AutoCompleteOption, index: number) =>
                    renderSelectedValueItem(selected, index, 'modal')
                  )}
                  <TextInput
                    ref={modalInputRef}
                    value={query}
                    onChangeText={handleChangeText}
                    onKeyPress={handleKeyPress}
                    placeholder={hasSelectedValues ? '' : placeholder}
                    placeholderTextColor={theme.text.muted}
                    style={[inputStyles.input, styles.input]}
                    editable={!disabled}
                    {...modalTextInputProps}
                  />
                </View>
                {showClearButton && (
                  <ClearButton
                    onPress={handleClearInput}
                    size={size}
                    accessibilityLabel={clearLabel}
                  />
                )}
              </View>

              {/* Suggestions content */}
              <View style={{ flex: 1 }}>
                {loading ? (
                  <View style={styles.loadingContainer}>
                    {renderLoadingState ? renderLoadingState() : (
                      <>
                        <Loader size="sm" />
                        <Text size="sm" colorVariant="secondary" style={{ marginTop: 8 }}>
                          Searching...
                        </Text>
                      </>
                    )}
                  </View>
                ) : suggestions.length > 0 ? (
                  <FlashList
                    data={suggestions}
                    keyboardShouldPersistTaps="always"
                    renderItem={({ item, index }: { item: AutoCompleteOption; index: number }) => renderSuggestionItem(item, index)}
                    keyExtractor={(item: AutoCompleteOption, index: number) => `${item.value}-${index}`}
                    showsVerticalScrollIndicator={false}
                    // @ts-expect-error FlashList typings in current version omit estimatedItemSize
                    estimatedItemSize={48}
                    style={{ flex: 1 }}
                  />
                ) : query.length >= minSearchLength ? (
                  <View style={styles.emptyContainer}>
                    {renderEmptyState ? renderEmptyState() : (
                      <Text size="sm" colorVariant="secondary">
                        No suggestions found
                      </Text>
                    )}
                  </View>
                ) : (
                  <View style={styles.emptyContainer}>
                    <Text size="sm" colorVariant="secondary">
                      Type {minSearchLength} or more characters to search
                    </Text>
                  </View>
                )}
              </View>
            </Pressable>
          </Pressable>
        </Modal>
      ) : showSuggestions && !usePortal ? (
        <Pressable
          style={[styles.suggestions, radiusStyles]}
          onStartShouldSetResponder={() => true}
        >
          <View style={styles.suggestionContent}>
            {loading ? (
              <View style={styles.loadingContainer}>
                {renderLoadingState ? renderLoadingState() : (
                  <>
                    <Loader size="sm" />
                    <Text size="sm" colorVariant="secondary" style={{ marginTop: 8 }}>
                      Searching...
                    </Text>
                  </>
                )}
              </View>
            ) : suggestions.length > 0 ? (
              <>
                <FlashList
                  data={suggestions}
                  keyboardShouldPersistTaps="handled"
                  renderItem={({ item, index }: { item: AutoCompleteOption; index: number }) => renderSuggestionItem(item, index)}
                  keyExtractor={(item: AutoCompleteOption, index: number) => `${item.value}-${index}`}
                  showsVerticalScrollIndicator={false}
                  style={styles.suggestionsList}
                  contentContainerStyle={{ paddingBottom: Platform.OS === 'ios' ? 20 : 0 }} // Add safe area padding
                />
              </>
            ) : query.length >= minSearchLength ? (
              <View style={styles.emptyContainer}>
                {renderEmptyState ? renderEmptyState() : (
                  <Text size="sm" colorVariant="secondary">
                    No suggestions found
                  </Text>
                )}
              </View>
            ) : null}
          </View>
        </Pressable>
      ) : null}
    </View>
  );
});

AutoComplete.displayName = 'AutoComplete';
