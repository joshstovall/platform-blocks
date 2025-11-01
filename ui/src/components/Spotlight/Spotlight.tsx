import React, { useEffect, useRef } from 'react';
import { Dialog } from '../Dialog';
import { Icon } from '../Icon/Icon';
import { Text } from '../Text/Text';
import { Highlight } from '../Highlight';
import { View, ScrollView, StyleSheet, Pressable, TextInput, useWindowDimensions, Platform } from 'react-native';
import { useTheme } from '../../core/theme/ThemeProvider';
import { useSpotlightStore, setDefaultSpotlightStore } from './SpotlightStore';
import { useGlobalHotkeys } from '../../hooks/useHotkeys';
import {
  SpotlightActionData,
  SpotlightActionGroupData,
  SpotlightItem,
  filterActions,
  isAction,
  isActionGroup
} from './SpotlightTypes';

// Layout constants for precise height calculation
const SPOTLIGHT_DIALOG_HEIGHT = 400;
const SEARCH_PADDING_VERTICAL = 32; // 16px top + 16px bottom (paddingVertical: 16)
// Updated for larger search input text (fontSize 24, lineHeight ~30, vertical padding 8)
// Height approximation: 30 (lineHeight) + 16 (vertical padding) = 46 -> rounded to 48 for consistency
const SEARCH_INPUT_HEIGHT = 48;
const ACTIONS_LIST_BORDER = 1; // Border top width
const ACTIONS_LIST_PADDING_BOTTOM = 8;

// Calculated max height for actions list: 400 - 32 - 48 - 1 - 8 = 311px
// This ensures the dialog is exactly filled with no awkward gap at the bottom

import type {
  SpotlightProps,
  SpotlightRootProps,
  SpotlightSearchProps,
  SpotlightActionsListProps,
  SpotlightActionProps,
  SpotlightActionsGroupProps,
  SpotlightEmptyProps,
} from './types';
import { Block } from '../Block';

function SpotlightRoot({
  query,
  onQueryChange,
  children,
  opened = false,
  onClose,
  shortcut = ['cmd+k', 'ctrl+k'],
  style,
}: SpotlightRootProps) {
  const theme = useTheme();
  const { width: screenWidth } = useWindowDimensions();
  const horizontalMargin = 32;
  const targetWidth = Math.min(560, Math.max(280, screenWidth - horizontalMargin));
  // (Hotkey registration moved to main Spotlight component for access to store.toggle())
  const isMobile = Platform.OS !== 'web';
  const fullscreen = isMobile; // auto fullscreen on native

  return (
    <Dialog
      visible={opened}
      onClose={onClose}
      variant={fullscreen ? 'fullscreen' : 'modal'}
      backdrop
      backdropClosable
      width={fullscreen ? undefined : targetWidth}
      title={null}
      style={[
        styles.spotlightModal,
        fullscreen && { width: '100%', height: '100%', maxHeight: '100%', borderRadius: 0, position: 'fixed', top: 0, left: 0 },
        !fullscreen && {
          height: SPOTLIGHT_DIALOG_HEIGHT,
          maxHeight: SPOTLIGHT_DIALOG_HEIGHT,
          width: targetWidth,
        },
        {
          backgroundColor: theme.colorScheme === 'dark'
            ? 'rgba(40, 40, 40, 0.95)'
            : 'rgba(255, 255, 255, 0.95)',
          borderColor: theme.colorScheme === 'dark'
            ? 'rgba(255, 255, 255, 0.1)'
            : 'rgba(0, 0, 0, 0.1)',
        }
      ]}
    >
      <View style={[styles.spotlightContainer, fullscreen && { flex: 1 }, style]}>
        {children}
      </View>
    </Dialog>
  );
}

function SpotlightSearch({
  value,
  onChangeText,
  leftSection,
  placeholder = 'Search...',
  onNavigateUp,
  onNavigateDown,
  onSelectAction,
  onClose,
  ...props
}: SpotlightSearchProps) {
  const theme = useTheme();
  const inputRef = useRef<any>(null);
  const [isFocused, setIsFocused] = React.useState(false);
  const isMobile = Platform.OS !== 'web';
  let effectivePlaceholder = placeholder;
  if (isMobile) {
    const verbosePattern = /components,\s*demos,\s*documentation/i;
    if (placeholder === 'Search...' || verbosePattern.test(placeholder) || placeholder.length > 32) {
      effectivePlaceholder = 'Search';
    }
  }

  useEffect(() => {
    // Auto-focus search input when spotlight opens
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleKeyPress = (event: any) => {
    const key = event.nativeEvent.key;
    if (key === 'ArrowDown') {
      event.preventDefault();
      // Enter selection mode: if nothing selected yet, set first item by calling onNavigateDown twice logic externally
      onNavigateDown?.();
    } else if (key === 'ArrowUp') {
      event.preventDefault();
      onNavigateUp?.();
    } else if (key === 'Enter') {
      event.preventDefault();
      onSelectAction?.();
    } else if (key === 'Escape') {
      event.preventDefault();
      onClose?.();
    }
  };

  return (
    <View style={[
      styles.searchContainer,
      {
        // Remove all focus styling - just keep consistent border
        borderWidth: 1,
        borderColor: theme.colorScheme === 'dark'
          ? 'rgba(255, 255, 255, 0.1)'
          : 'rgba(0, 0, 0, 0.1)',
        backgroundColor: 'transparent',
      }
    ]}>
      <View style={styles.searchInputWrapper}>
        {leftSection || <Icon name="search" size="md" color={theme.text.secondary} />}
        <TextInput
          ref={inputRef}
          value={value}
          onChangeText={onChangeText}
          placeholder={effectivePlaceholder}
          placeholderTextColor={theme.text.secondary}
          style={[
            styles.searchInput,
            {
              color: theme.text.primary,
            }
          ]}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyPress={handleKeyPress}
          autoFocus={true}
          {...props}
        />
      </View>
    </View>
  );
}

function SpotlightActionsList({
  children,
  scrollable = true,
  maxHeight,
  style,
  scrollRef,
  onScrollChange,
}: SpotlightActionsListProps) {
  const theme = useTheme();

  // Calculate max height dynamically to eliminate awkward gap at bottom
  // Total available space = Dialog height - Search container - Actions list borders/padding
  const calculatedMaxHeight = maxHeight || (
    SPOTLIGHT_DIALOG_HEIGHT -
    SEARCH_PADDING_VERTICAL -
    SEARCH_INPUT_HEIGHT -
    ACTIONS_LIST_BORDER -
    ACTIONS_LIST_PADDING_BOTTOM
  );

  // Debug logging to help identify height issues
  if (__DEV__ && process.env.EXPO_PUBLIC_DEBUG) {
    console.log('Spotlight Height Calculation:', {
      dialogHeight: SPOTLIGHT_DIALOG_HEIGHT,
      searchPadding: SEARCH_PADDING_VERTICAL,
      searchInputHeight: SEARCH_INPUT_HEIGHT,
      actionsBorder: ACTIONS_LIST_BORDER,
      actionsPadding: ACTIONS_LIST_PADDING_BOTTOM,
      calculatedMaxHeight,
      providedMaxHeight: maxHeight
    });
  }

  const containerStyle = [
    styles.actionsList,
    {
      borderTopColor: theme.colorScheme === 'dark'
        ? 'rgba(255, 255, 255, 0.1)'
        : 'rgba(0, 0, 0, 0.1)',
      flex: 1, // Take remaining space after search bar
    },
    style,
  ];

  // Always use ScrollView for consistent behavior
  return (
    <ScrollView
      ref={scrollRef}
      style={[containerStyle, { maxHeight: calculatedMaxHeight }]}
      showsVerticalScrollIndicator={true}
      onScroll={onScrollChange ? (e) => onScrollChange(e.nativeEvent.contentOffset.y) : undefined}
      scrollEventThrottle={16}
      contentContainerStyle={undefined}
    >
      {children}
    </ScrollView>
  );
}

function SpotlightAction({
  label,
  description,
  leftSection,
  rightSection,
  onPress,
  disabled = false,
  selected = false,
  children,
  style,
  innerRef,
  highlightQuery,
}: SpotlightActionProps) {
  const theme = useTheme();
  const [isHovered, setIsHovered] = React.useState(false);
  // Truncate long descriptions for cleaner list appearance
  const MAX_DESC = 80; // Could be lifted to prop later
  const truncatedDescription = React.useMemo(() => {
    if (!description) return undefined;
    const plain = typeof description === 'string' ? description : String(description);
    return plain.length > MAX_DESC ? plain.slice(0, MAX_DESC - 1).trimEnd() + '…' : plain;
  }, [description]);

  const actionStyle = [
    styles.action,
    {
      backgroundColor: 'transparent',
    },
    disabled && { opacity: 0.5 },
    style,
  ];

  const pressedStyle = {
    backgroundColor: theme.colorScheme === 'dark'
      ? 'rgba(255, 255, 255, 0.15)'
      : 'rgba(0, 0, 0, 0.08)',
  };

  const hoverStyle = {
    backgroundColor: theme.colorScheme === 'dark'
      ? 'rgba(255, 255, 255, 0.08)'
      : 'rgba(0, 0, 0, 0.04)',
  };

  const selectedStyle = {
    backgroundColor: theme.colorScheme === 'dark'
      ? 'rgba(255, 255, 255, 0.12)'
      : 'rgba(0, 0, 0, 0.06)',
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.primary[5],
    paddingLeft: 13, // adjust for added border (original inner gap 16 - 3)
  } as const;

  const webHoverProps = React.useMemo(() => {
    // Only add hover props on web
    if (typeof window !== 'undefined') {
      return {
        onMouseEnter: () => setIsHovered(true),
        onMouseLeave: () => setIsHovered(false),
      };
    }
    return {};
  }, []);

  return (
    <Pressable
      ref={innerRef as any}
      disabled={disabled}
      onPress={disabled ? undefined : onPress}
      style={({ pressed }) => [
        actionStyle,
        selected && selectedStyle,
        !selected && pressed && pressedStyle,
        !selected && !pressed && isHovered && hoverStyle,
        style,
      ]}
      {...webHoverProps}
    >
      <Block direction="row" align="center" style={styles.actionContent}>
        {leftSection && (
          <View style={styles.actionLeftSection}>
            {leftSection}
          </View>
        )}
        <Block direction="column" style={{ flex: 1 }}>
          <Highlight
            highlight={highlightQuery}
            style={styles.actionLabel}
            highlightProps={{ style: styles.actionLabel }}
          >
            {label}
          </Highlight>
          {truncatedDescription ? (
            <Highlight
              highlight={highlightQuery}
              style={styles.actionDescription}
              highlightProps={{ style: styles.actionDescription }}
            >
              {truncatedDescription}
            </Highlight>
          ) : null}
          {children}
        </Block>
        {rightSection ? (
          <View style={styles.actionRightSection}>
            {rightSection}
          </View>
        ) : null}
      </Block>
    </Pressable>
  );
}

function SpotlightActionsGroup({
  label,
  children,
  style,
}: SpotlightActionsGroupProps) {
  const theme = useTheme();

  return (
    <View style={[styles.actionsGroup, style]}>
      <View style={[
        styles.groupHeader,
        {
          borderBottomColor: theme.colorScheme === 'dark'
            ? 'rgba(255, 255, 255, 0.1)'
            : 'rgba(0, 0, 0, 0.1)'
        }
      ]}>
        <Text
          size="xs"
          weight="900"
          color={theme.text.secondary}
          style={styles.groupLabel}
        >
          {label.toUpperCase()}
        </Text>
      </View>
      {children}
    </View>
  );
}

function SpotlightEmpty({ children, style }: SpotlightEmptyProps) {
  const theme = useTheme();

  return (
    <View style={[styles.empty, style]}>
      <Text
        size="md"
        color={theme.text.secondary}
        style={styles.emptyText}
      >
        {children}
      </Text>
    </View>
  );
}

// Main Spotlight component
export function Spotlight({
  actions,
  nothingFound = 'Nothing found...',
  highlightQuery = true,
  limit,
  scrollable = false,
  maxHeight, // Remove default - let it be calculated dynamically
  shortcut = ['cmd+k', 'ctrl+k'],
  searchProps = {},
  store,
  variant = 'modal',
  width = 600,
  height,
}: SpotlightProps) {
  const spotlightStore = useSpotlightStore();

  // Set as default store if no custom store provided
  useEffect(() => {
    if (!store) {
      setDefaultSpotlightStore(spotlightStore);
    }
  }, [spotlightStore, store]);

  const currentStore = store || spotlightStore;
  const { opened, query, selectedIndex } = currentStore.state;

  // Proper global hotkey registration (Cmd/Ctrl+K) to toggle spotlight.
  // Normalize provided shortcuts; if any matches cmd+k/ctrl+k/mod+k we register a single 'mod+k'.
  const normalized = React.useMemo(() => (
    Array.isArray(shortcut) ? shortcut : (shortcut ? [shortcut] : [])
  ), [shortcut]);
  const shouldHandleToggleHotkey = React.useMemo(
    () => normalized.some(sc => ['cmd+k', 'ctrl+k', 'mod+k'].includes(sc.toLowerCase())),
    [normalized]
  );
  const handleToggleHotkey = React.useCallback((event: KeyboardEvent) => {
    if (!shouldHandleToggleHotkey) return;
    event.preventDefault?.();
    currentStore.toggle();
  }, [shouldHandleToggleHotkey, currentStore]);
  useGlobalHotkeys('spotlight-toggle', ['mod+k', handleToggleHotkey]);

  const filteredActions = filterActions(actions, query, limit);

  const highlightValue = React.useMemo(() => {
    if (!highlightQuery) {
      return undefined;
    }

    if (highlightQuery !== true) {
      return highlightQuery;
    }

    const trimmed = query.trim();
    if (!trimmed) {
      return undefined;
    }

    const parts = trimmed.split(/\s+/).filter(Boolean);
    if (parts.length === 0) {
      return undefined;
    }

    return parts.length === 1 ? parts[0] : parts;
  }, [highlightQuery, query]);

  // Flatten all actions for keyboard navigation
  const flatActions = React.useMemo(() => {
    const flat: SpotlightActionData[] = [];
    filteredActions.forEach((item) => {
      if (isAction(item)) {
        flat.push(item);
      } else {
        flat.push(...item.actions);
      }
    });
    return flat;
  }, [filteredActions]);

  // Reset selection when query changes
  useEffect(() => {
    currentStore.setSelectedIndex(-1);
  }, [query, currentStore]);

  const handleNavigateUp = () => {
    if (!flatActions.length) return;
    const newIndex = selectedIndex <= 0 ? flatActions.length - 1 : selectedIndex - 1;
    currentStore.setSelectedIndex(newIndex);
  };

  const handleNavigateDown = () => {
    if (!flatActions.length) return;
    const newIndex = selectedIndex === -1 || selectedIndex >= flatActions.length - 1 ? 0 : selectedIndex + 1;
    currentStore.setSelectedIndex(newIndex);
  };

  // Auto-scroll selected item into view
  const listRef = React.useRef<ScrollView | null>(null);
  const itemRefs = React.useRef<(View | null)[]>([]);
  const itemLayouts = React.useRef<{ y: number; height: number }[]>([]);
  const VIEWPORT_PADDING = 8;
  const scrollOffsetRef = React.useRef(0);
  const [layoutVersion, setLayoutVersion] = React.useState(0);
  const ensureVisible = React.useCallback((attempt = 0) => {
    if (selectedIndex < 0) return;
    const layout = itemLayouts.current[selectedIndex];
    if (!layout || !listRef.current) {
      if (attempt < 6) requestAnimationFrame(() => ensureVisible(attempt + 1));
      return;
    }
    const maxHeight = (SPOTLIGHT_DIALOG_HEIGHT - SEARCH_PADDING_VERTICAL - SEARCH_INPUT_HEIGHT - ACTIONS_LIST_BORDER - ACTIONS_LIST_PADDING_BOTTOM);
    const viewportTop = scrollOffsetRef.current;
    const viewportBottom = viewportTop + maxHeight;
    const itemTop = layout.y;
    const itemBottom = layout.y + layout.height;
    let target: number | null = null;
    if (itemTop < viewportTop + VIEWPORT_PADDING) target = itemTop - VIEWPORT_PADDING;
    else if (itemBottom > viewportBottom - VIEWPORT_PADDING) target = itemBottom - maxHeight + VIEWPORT_PADDING;
    if (target !== null) {
      try { listRef.current.scrollTo({ y: Math.max(target, 0), animated: true }); } catch {
        console.warn('Spotlight: scrollTo failed, ref may be invalid');
      }
    }
  }, [selectedIndex]);
  useEffect(() => { ensureVisible(); }, [selectedIndex, layoutVersion, ensureVisible]);

  const handleSelectAction = () => {
    let index = selectedIndex;
    // If nothing explicitly selected yet, default to first result
    if (index === -1 && flatActions.length > 0) index = 0;
    if (index >= 0 && index < flatActions.length) {
      const selectedAction = flatActions[index];
      selectedAction.onPress?.();
      currentStore.close();
    }
  };

  const handleClose = () => {
    currentStore.close();
  };

  // Global key handling (in addition to TextInput) to improve accessibility
  useEffect(() => {
    if (!opened) return;
    const onKeyDown = (e: KeyboardEvent) => {
      // Avoid interfering with IME composition
      if ((e as any).isComposing) return;
      const tag = (e.target as HTMLElement)?.tagName;
      // Let the search input handle arrows; global fallback when not in input
      const isInput = tag === 'INPUT' || tag === 'TEXTAREA';
      switch (e.key) {
        case 'Escape':
          e.preventDefault();
          handleClose();
          break;
        case 'ArrowDown':
          if (isInput) return; // search input already handles
          e.preventDefault();
          handleNavigateDown();
          break;
        case 'ArrowUp':
          if (isInput) return;
          e.preventDefault();
          handleNavigateUp();
          break;
        case 'Enter':
          // Allow Enter anywhere (unless focused button) to trigger selection
          if (isInput) {
            // Search input handles Enter via onKeyPress already; fall through harmlessly
          }
          e.preventDefault();
          handleSelectAction();
          break;
        default:
          break;
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [opened, handleNavigateDown, handleNavigateUp, handleSelectAction]);

  const renderActions = () => {
    if (filteredActions.length === 0) {
      return <SpotlightEmpty>{nothingFound}</SpotlightEmpty>;
    }

    let flatIndex = 0; // Track the global index across all actions

    return filteredActions.map((item, index) => {
      if (isAction(item)) {
        const isSelected = flatIndex === selectedIndex;
        flatIndex++; // Increment after checking
        return (
          <SpotlightAction
            key={item.id}
            label={item.label}
            description={item.description}
            selected={isSelected}
            innerRef={(el: any) => { itemRefs.current[flatIndex - 1] = el; }}
            onLayout={(e: any) => { itemLayouts.current[flatIndex - 1] = { y: e.nativeEvent.layout.y, height: e.nativeEvent.layout.height }; setLayoutVersion(v => v + 1); }}
            highlightQuery={highlightValue}
            leftSection={
              typeof item.icon === 'string' ? (
                <Icon name={item.icon} size="md"
                  color="pink" />
              ) : (
                item.icon
              )
            }
            onPress={() => {
              item.onPress?.();
              currentStore.close();
            }}
            disabled={item.disabled}
          >
            {item.component}
          </SpotlightAction>
        );
      } else {
        return (
          <SpotlightActionsGroup
            key={`group-${index}`}
            label={item.group}
          >
            {item.actions.map((action) => {
              const isSelected = flatIndex === selectedIndex;
              flatIndex++; // Increment after checking
              return (
                <SpotlightAction
                  key={action.id}
                  label={action.label}
                  description={action.description}
                  selected={isSelected}
                  innerRef={(el: any) => { itemRefs.current[flatIndex - 1] = el; }}
                  onLayout={(e: any) => { itemLayouts.current[flatIndex - 1] = { y: e.nativeEvent.layout.y, height: e.nativeEvent.layout.height }; setLayoutVersion(v => v + 1); }}
                  highlightQuery={highlightValue}
                  leftSection={
                    typeof action.icon === 'string' ? (
                      <Icon name={action.icon} size="md" />
                    ) : (
                      action.icon
                    )
                  }
                  onPress={() => {
                    action.onPress?.();
                    currentStore.close();
                  }}
                  disabled={action.disabled}
                >
                  {action.component}
                </SpotlightAction>
              );
            })}
          </SpotlightActionsGroup>
        );
      }
    });
  };

  return (
    <SpotlightRoot
      query={query}
      onQueryChange={currentStore.setQuery}
      opened={opened}
      onClose={currentStore.close}
      shortcut={shortcut}
    >
      <SpotlightSearch
        value={query}
        onChangeText={currentStore.setQuery}
        onNavigateUp={handleNavigateUp}
        onNavigateDown={handleNavigateDown}
        onSelectAction={handleSelectAction}
        onClose={handleClose}
        {...searchProps}
      />
      <SpotlightActionsList
        scrollable={scrollable}
        maxHeight={maxHeight}
        scrollRef={listRef}
        onScrollChange={(y) => { scrollOffsetRef.current = y; }}
      >
        {renderActions()}
      </SpotlightActionsList>
    </SpotlightRoot>
  );
}

// Compound components
Spotlight.Root = SpotlightRoot;
Spotlight.Search = SpotlightSearch;
Spotlight.ActionsList = SpotlightActionsList;
Spotlight.Action = SpotlightAction;
Spotlight.ActionsGroup = SpotlightActionsGroup;
Spotlight.Empty = SpotlightEmpty;

const styles = StyleSheet.create({
  action: {
    borderRadius: 8,
    marginHorizontal: 8,
    marginVertical: 1,
  },
  actionContent: {
    paddingHorizontal: 16,
    paddingVertical: 10, // Slightly reduced for more items
    minHeight: 48, // Slightly reduced for more compact layout
  },
  actionDescription: {
    fontSize: 13,
    lineHeight: 16,
    marginTop: 2,
    opacity: 0.8,
  },
  actionLabel: {
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 20,
  },
  actionLeftSection: {
    alignItems: 'center',
    height: 32,
    justifyContent: 'center',
    marginRight: 4,
    width: 32,
  },
  actionRightSection: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  actionText: {
    flex: 1,
    justifyContent: 'center',
  },
  actionsGroup: {
    marginVertical: 4,
  },
  actionsList: {
    borderTopWidth: 1, // Separator between search and results
    flex: 1, // Take remaining space
    // paddingBottom: 8, // Bottom padding for scroll area
  },
  empty: {
    padding: 20, // Reduced padding for fixed height
    alignItems: 'center',
    justifyContent: 'center',
    // Removed flex: 1 to prevent taking extra space
  },
  emptyText: {
    fontSize: 15,
    opacity: 0.6,
    textAlign: 'center',
  },
  groupHeader: {
    borderBottomWidth: 1,
    marginBottom: 4,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  groupLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.8,
    opacity: 0.7,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    // Fixed at top - no flex growth
    flexShrink: 0,
  },
  searchInput: {
    flex: 1,
    borderWidth: 0,
    borderRadius: 0,
    paddingHorizontal: 0,
    paddingVertical: 8,
    marginBottom: 0,
    fontSize: 18,
    lineHeight: 30,
    fontWeight: '500',
    // Remove any default styling
    backgroundColor: 'transparent',
    // Web-specific outline removal
    ...(typeof window !== 'undefined' && {
      outlineWidth: 0,
    }),
  },
  searchInputWrapper: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  spotlightContainer: {
    height: SPOTLIGHT_DIALOG_HEIGHT, // Fixed height
    display: 'flex',
    flexDirection: 'column',
  },
  spotlightModal: {
    padding: 0,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    // macOS-style shadow - using modern boxShadow instead of deprecated shadow* props
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
    elevation: 12, // Keep elevation for Android
  },
});

export default Spotlight;
