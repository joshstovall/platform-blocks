import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { View, Pressable, ScrollView, ViewStyle } from 'react-native';
import type { LayoutChangeEvent, LayoutRectangle } from 'react-native';
import Animated, { useAnimatedStyle, withTiming, useSharedValue } from 'react-native-reanimated';
import { useTheme } from '../../core/theme';
import { useReducedMotion } from '../../core/motion/ReducedMotionProvider';
import { SizeValue, getFontSize, getSpacing } from '../../core/theme/sizes';
import { createRadiusStyles } from '../../core/theme/radius';
import type { PlatformBlocksTheme } from '../../core/theme/types';
import { SpacingProps, getSpacingStyles, extractSpacingProps } from '../../core/utils';
import { Sup, Text } from '../Text';
import { fastHash } from '../../core/utils/hash';
import { useDirection } from '../../core/providers/DirectionProvider';

import type { TabsProps, TabItem } from './types';
import { Flex } from '../Flex';


// Resolve a theme token like "primary.5" or fallback to raw value
const resolveThemeColor = (theme: PlatformBlocksTheme, token?: string): string | undefined => {
  if (!token) return undefined;
  if (token.includes('.')) {
    const [scale, shade] = token.split('.');
    const shadeNum = Number(shade);
    const scaleObj: any = (theme.colors as any)[scale];
    if (scaleObj && typeof shadeNum === 'number' && scaleObj[shadeNum]) {
      return scaleObj[shadeNum];
    }
  }
  // Try direct theme.text token
  if ((theme.text as any)[token]) return (theme.text as any)[token];
  return token; // raw color value
};

const getTabStyles = (
  theme: PlatformBlocksTheme,
  variant: TabsProps['variant'] = 'line',
  size: SizeValue = 'md',
  color: TabsProps['color'] = 'primary',
  orientation: TabsProps['orientation'] = 'horizontal',
  location: TabsProps['location'] = 'start',
  radiusStyles?: any,
  contentCornerRadius?: number,
  indicatorThicknessProp?: number,
  isRTL?: boolean
) => {
  const fontSize = getFontSize(size);
  const padding = getSpacing(size);
  const colorPalette = theme.colors[color as keyof PlatformBlocksTheme['colors']] ?? theme.colors.primary;
  const isVertical = orientation === 'vertical';
  const isHorizontalLayout = orientation === 'horizontal';
  const isEnd = location === 'end';
  const resolvedIndicatorThickness = indicatorThicknessProp !== undefined
    ? indicatorThicknessProp
    : (isVertical ? 4 : (isEnd ? 2 : 4));

  const baseTabStyles = {
    paddingHorizontal: padding,
    paddingVertical: padding * 0.75,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: isVertical ? 'flex-start' : 'center' as const,
    minHeight: 40,
    ...(isVertical && { minWidth: 120 }),
  };

  const variantStyles = {
    line: {
      tab: {
        ...baseTabStyles,
        backgroundColor: 'transparent',
      },
      activeTab: {
        // No static border - will use animated indicator
      },
      container: {
        backgroundColor: theme.colors.gray[1],
        ...(isVertical ? {
          ...(isEnd ? {
            // For vertical end position: border on the left in LTR, right in RTL
            ...(isRTL ? {
              borderRightWidth: 1,
              borderRightColor: theme.colors.gray[3],
            } : {
              borderLeftWidth: 1,
              borderLeftColor: theme.colors.gray[3],
            })
          } : {
            // For vertical start position: border on the right in LTR, left in RTL
            ...(isRTL ? {
              borderLeftWidth: 1,
              borderLeftColor: theme.colors.gray[3],
            } : {
              borderRightWidth: 1,
              borderRightColor: theme.colors.gray[3],
            })
          })
        } : {
          ...(isEnd ? {
            borderTopWidth: 1,
            borderTopColor: theme.colors.gray[3],
          } : {
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.gray[3],
          })
        }),
      },
      indicator: {
        position: 'absolute' as const,
        backgroundColor: colorPalette[5],
        ...(isVertical ? {
          width: resolvedIndicatorThickness,
          // Shift by half thickness for alignment
          ...(isEnd ? 
            (isRTL ? 
              { right: -resolvedIndicatorThickness / 2 } : 
              { left: -resolvedIndicatorThickness / 2 }
            ) : 
            (isRTL ? 
              { left: -resolvedIndicatorThickness / 2 } : 
              { right: -resolvedIndicatorThickness / 2 }
            )
          ),
        } : {
          height: resolvedIndicatorThickness,
          // Shift by half thickness for alignment
          ...(isEnd ? { top: -resolvedIndicatorThickness / 2 } : { bottom: -resolvedIndicatorThickness / 2 }),
        }),
      }
    },
    chip: {
      tab: {
        ...baseTabStyles,
        // backgroundColor: 'transparent',
        ...(radiusStyles || { borderRadius: 24 }),
        zIndex: 1,
        // paddingVertical: padding * 0.5,
      },
      activeTab: {
        // Background now handled by shared animated chip indicator
      },
      container: {
        padding: 4,
        position: 'relative' as const,
      },
      indicator: {
        position: 'absolute' as const,
        backgroundColor: colorPalette[5],
        borderRadius: 9999,
        top: 4,
        left: 4,
        boxShadow: '0 0px 2px rgba(0,0,0,0.42)',
        // width/height & transforms animated
      }
    },
    card: {
      tab: {
        ...baseTabStyles,
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: theme.colors.gray[3],
        ...(isVertical ? {
          ...(isEnd ? {
            ...(isRTL ? {
              borderRightWidth: 0,
              ...(radiusStyles || { borderTopLeftRadius: 8, borderBottomLeftRadius: 8 }),
            } : {
              borderLeftWidth: 0,
              ...(radiusStyles || { borderTopRightRadius: 8, borderBottomRightRadius: 8 }),
            })
          } : {
            ...(isRTL ? {
              borderLeftWidth: 0,
              ...(radiusStyles || { borderTopRightRadius: 8, borderBottomRightRadius: 8 }),
            } : {
              borderRightWidth: 0,
              ...(radiusStyles || { borderTopLeftRadius: 8, borderBottomLeftRadius: 8 }),
            })
          })
        } : {
          ...(isEnd ? {
            borderTopWidth: 0,
            ...(radiusStyles || { borderBottomLeftRadius: 8, borderBottomRightRadius: 8 }),
          } : {
            borderBottomWidth: 0,
            ...(radiusStyles || { borderTopLeftRadius: 8, borderTopRightRadius: 8 }),
          })
        }),
      },
      activeTab: isVertical ? {
        backgroundColor: theme.colors.gray[2],
        ...(isEnd ? 
          (isRTL ? {
            borderRightWidth: 1,
            borderRightColor: theme.colors.gray[0],
          } : {
            borderLeftWidth: 1,
            borderLeftColor: theme.colors.gray[0],
          })
        : 
          (isRTL ? {
            borderLeftWidth: 1,
            borderLeftColor: theme.colors.gray[0],
          } : {
            borderRightWidth: 1,
            borderRightColor: theme.colors.gray[0],
          })
        )
      } : {
        backgroundColor: theme.colors.gray[2],
        ...(isEnd ? {
          borderTopWidth: 1,
          borderTopColor: theme.colors.gray[0],
        } : {
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.gray[0],
        })
      },
      container: {
        backgroundColor: theme.colors.gray[1],
        ...(isVertical ? {
          ...(isEnd ? {
            borderLeftWidth: 1,
            borderLeftColor: theme.colors.gray[3],
          } : {
            borderRightWidth: 1,
            borderRightColor: theme.colors.gray[3],
          })
        } : {
          ...(isEnd ? {
            borderTopWidth: 1,
            borderTopColor: theme.colors.gray[3],
          } : {
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.gray[3],
          })
        }),
      }
    },
    folder: {
      tab: {
        ...baseTabStyles,
        backgroundColor: theme.colors.gray[1],
        borderColor: theme.colors.gray[3],
        ...(isVertical ? {
          ...(isEnd ? {
            borderLeftWidth: 0,
            marginBottom: 2,
            ...(radiusStyles || {
              borderTopRightRadius: 12,
              borderBottomRightRadius: 12
            }),
          } : {
            borderRightWidth: 0,
            marginBottom: 2,
            ...(radiusStyles || {
              borderTopLeftRadius: 12,
              borderBottomLeftRadius: 12
            }),
          })
        } : {
          ...(isEnd ? {
            borderTopWidth: 0,
            marginRight: 2,
            ...(radiusStyles || {
              borderBottomLeftRadius: 12,
              borderBottomRightRadius: 12
            }),
          } : {
            borderBottomWidth: 0,
            marginRight: 2,
            ...(radiusStyles || {
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12
            }),
          })
        }),
        position: 'relative' as const,
      },
      activeTab: {
        backgroundColor: theme.colors.gray[2],
        zIndex: 1,
        ...(isVertical ? {
          ...(isEnd ? {
            marginRight: -2,
          } : {
            marginLeft: -2,
          })
        } : {
          ...(isEnd ? {
            marginBottom: -2,
          } : {
            marginTop: -2,
          })
        }),
      },
      container: {
        ...(isVertical ?
          (isEnd ? { paddingRight: 4 } : { paddingLeft: 4 }) :
          (isEnd ? { paddingBottom: 4 } : { paddingTop: 4 })
        ),
      }
    }
  };

  return {
    container: {
      flexDirection: !isHorizontalLayout
        ? (isEnd ? 'row-reverse' as const : 'row' as const)
        : (isEnd ? 'column-reverse' as const : 'column' as const),
      alignItems: 'stretch' as const,
    },
    tabsHeader: {
      flexDirection: (isVertical ? 'column' : 'row') as 'row' | 'column',
      ...(isVertical && { minWidth: 120 }),
      position: 'relative' as const,
    },
    tabsHeaderScroll: {
      flexGrow: 0,
      flexShrink: 0,
    },
    tab: {
      ...variantStyles[variant].tab,
    },
    activeTab: {
      ...variantStyles[variant].activeTab,
    },
    indicator: (variant === 'line' || variant === 'chip') ? variantStyles[variant].indicator : undefined,
    tabText: {
      fontSize,
      fontWeight: '500' as const,
      color: theme.text.primary,
      // Counter-skew the text for folder tabs
      ...(variant === 'folder' && { transform: [{ skewX: '10deg' }] }),
    },
    activeTabText: {
      color: variant === 'chip' ? (theme.text.onPrimary || '#FFFFFF') : colorPalette[6],
      fontWeight: '600' as const,
      // Counter-skew the text for folder tabs
      ...(variant === 'folder' && { transform: [{ skewX: '8deg' }] }),
    },
    disabledTabText: {
      color: theme.text.disabled,
      // Counter-skew the text for folder tabs
      ...(variant === 'folder' && { transform: [{ skewX: '10deg' }] }),
    },
    content: {
      flex: 1,
      padding: getSpacing('md'),
      // backgroundColor: theme.colors.surface[2],
      ...(isHorizontalLayout ? {
        ...(isEnd ? {
          borderTopLeftRadius: contentCornerRadius ?? 8,
          borderBottomLeftRadius: contentCornerRadius ?? 8,
          ...(variant === 'folder' && { borderTopRightRadius: 8 }),
        } : {
          borderTopRightRadius: contentCornerRadius ?? 8,
          borderBottomRightRadius: contentCornerRadius ?? 8,
          ...(variant === 'folder' && { borderTopLeftRadius: 8 }),
        })
      } : {
        ...(isEnd ? {
          borderTopLeftRadius: contentCornerRadius ?? 8,
          borderTopRightRadius: contentCornerRadius ?? 8,
          ...(variant === 'folder' && { borderBottomLeftRadius: 8 }),
        } : {
          borderBottomLeftRadius: contentCornerRadius ?? 8,
          borderBottomRightRadius: contentCornerRadius ?? 8,
          ...(variant === 'folder' && { borderTopRightRadius: 8 }),
        })
      }),
    }
  };
};


export const Tabs: React.FC<TabsProps> = (props) => {
  const {
    items,
    activeTab: controlledActiveTab,
    onTabChange,
    variant = 'line',
    size = 'sm',
    color = 'primary',
    orientation = 'horizontal',
    location = 'start',
    scrollable = false,
    animated = true,
    animationDuration = 250,
    style,
    tabStyle,
    contentStyle,
    textStyle,
    radius,
    tabCornerRadius,
    contentCornerRadius,
    indicatorThickness,
    tabGap,
    activeTabBackgroundColor,
    inactiveTabBackgroundColor,
    activeTabTextColor,
    navigationOnly = false,
    children,
    disabledKeys = [],
    onDisabledTabPress,
    ...rest
  } = props;

  const { spacingProps, otherProps } = extractSpacingProps(rest);
  const spacingStyles = getSpacingStyles(spacingProps);

  const theme = useTheme();
  const { isRTL } = useDirection();
  const radiusStyles = typeof radius === 'number' ? createRadiusStyles(radius) : undefined;

  // ---------- Persistence (mirrors Accordion approach) ----------
  const persistKey = props.persistKey;
  const autoPersist = props.autoPersist !== false; // default true
  // Lazy init global store
  const persistStoreRef = useRef<Map<string, string> | undefined>(undefined);
  if (!persistStoreRef.current) {
    const globalWithStore = globalThis as typeof globalThis & {
      __PLATFORM_BLOCKS_TABS_PERSIST__?: Map<string, string>;
    };
    if (globalWithStore.__PLATFORM_BLOCKS_TABS_PERSIST__) {
      persistStoreRef.current = globalWithStore.__PLATFORM_BLOCKS_TABS_PERSIST__;
    } else {
      const newStore = new Map<string, string>();
      globalWithStore.__PLATFORM_BLOCKS_TABS_PERSIST__ = newStore;
      persistStoreRef.current = newStore;
    }
  }
  // Auto key only when uncontrolled + autoPersist
  const autoKeyRef = useRef<string | null>(null);
  if (autoKeyRef.current === null && !persistKey && autoPersist && controlledActiveTab === undefined) {
    const sig = items.map(i => i.key).join('|') + '|' + variant + '|' + orientation + '|' + location;
    autoKeyRef.current = 'tabs-' + fastHash(sig);
  }
  const effectivePersistKey = persistKey || autoKeyRef.current || undefined;

  const [internalActiveTab, setInternalActiveTab] = useState<string>(() => {
    if (controlledActiveTab !== undefined) return controlledActiveTab;
    if (effectivePersistKey && persistStoreRef.current?.has(effectivePersistKey)) {
      return persistStoreRef.current.get(effectivePersistKey)!;
    }
    return items[0]?.key || '';
  });

  // Persist when internal (uncontrolled) active tab changes
  useEffect(() => {
    if (controlledActiveTab === undefined && effectivePersistKey) {
      persistStoreRef.current?.set(effectivePersistKey, internalActiveTab);
    }
  }, [internalActiveTab, controlledActiveTab, effectivePersistKey]);

  // Reanimated shared values
  const indicatorPosition = useSharedValue(0); // primary axis (x for horizontal, y for vertical)
  const indicatorSize = useSharedValue(0); // primary axis size (width or height)
  const indicatorCrossSize = useSharedValue(0); // cross axis size (height or width)
  const indicatorSecondaryPosition = useSharedValue(0); // cross axis position (top or left)
  const activeTabIndex = useSharedValue(items.findIndex(item => item.key === (controlledActiveTab || internalActiveTab)));

  const activeTab = controlledActiveTab !== undefined ? controlledActiveTab : internalActiveTab;
  // Memoize style maps so theme pointer swaps do not recreate objects unnecessarily
  const styles = useMemo(() => getTabStyles(
    theme,
    variant,
    size,
    color,
    orientation,
    location,
    radiusStyles,
    contentCornerRadius,
    indicatorThickness,
    isRTL
  ), [theme, variant, size, color, orientation, location, radiusStyles, contentCornerRadius, indicatorThickness, isRTL]);
  const isVertical = orientation === 'vertical';

  // Tab layout measurements
  const [tabLayouts, setTabLayouts] = useState<Record<string, LayoutRectangle>>({});
  const [containerSize, setContainerSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });

  const handleTabLayout = useCallback((tabKey: string, event: LayoutChangeEvent) => {
    const { x, y, width, height } = event.nativeEvent.layout;
    setTabLayouts(prev => ({
      ...prev,
      [tabKey]: { x, y, width, height }
    }));
  }, []);

  const handleContainerLayout = useCallback((event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setContainerSize(prev => (
      prev.width === width && prev.height === height
        ? prev
        : { width, height }
    ));
  }, []);

  // Reduced motion preference & re-animation guards
  const reducedMotion = useReducedMotion();
  const lastLayoutSigRef = useRef<string | null>(null);
  const lastActiveTabRef = useRef<string | null>(null);
  const mountedRef = useRef(false);

  // Update indicator when active tab or layout changes meaningfully
  React.useEffect(() => {
    const currentIndex = items.findIndex(item => item.key === activeTab);
    activeTabIndex.value = currentIndex;

    const layout = tabLayouts[activeTab];
    if (!layout) return;

    // Build compact layout signature (only needed metrics)
    const layoutSig = Object.keys(tabLayouts).sort().map(k => {
      const l = tabLayouts[k];
      return k + ':' + l.x + ',' + l.y + ',' + l.width + 'x' + l.height;
    }).join('|');

    const activeUnchanged = lastActiveTabRef.current === activeTab;
    const layoutUnchanged = lastLayoutSigRef.current === layoutSig;
    const firstMount = !mountedRef.current;

    // Decide animation policy
    const shouldAnimate = !reducedMotion && animated && !firstMount && !(activeUnchanged && layoutUnchanged);

    const primaryPos = isVertical ? layout.y : layout.x;
    const primarySize = isVertical ? layout.height : layout.width;
    const crossSize = isVertical ? layout.width : layout.height;
    const secondaryPos = isVertical ? layout.x : layout.y;
    const timing = (val: number) => withTiming(val, { duration: animationDuration });

    if (variant === 'line' || variant === 'chip') {
      if (shouldAnimate) {
        indicatorPosition.value = timing(primaryPos);
        indicatorSize.value = timing(primarySize);
        if (variant === 'chip') {
          indicatorCrossSize.value = timing(crossSize);
          indicatorSecondaryPosition.value = timing(secondaryPos);
        }
      } else {
        indicatorPosition.value = primaryPos;
        indicatorSize.value = primarySize;
        if (variant === 'chip') {
          indicatorCrossSize.value = crossSize;
          indicatorSecondaryPosition.value = secondaryPos;
        }
      }
    }

    lastLayoutSigRef.current = layoutSig;
    lastActiveTabRef.current = activeTab;
    mountedRef.current = true;
  }, [activeTab, tabLayouts, variant, animated, animationDuration, isVertical, activeTabIndex, indicatorPosition, indicatorSize, indicatorCrossSize, indicatorSecondaryPosition, reducedMotion, items]);

  // Guard against unnecessary re-animation when theme changes but active tab and layout unaffected
  const lastThemeRef = useRef<any>(theme);
  useEffect(() => {
    if (lastThemeRef.current === theme) return; // same object pointer
    lastThemeRef.current = theme;
    // Only recompute indicator if layout changed; skip forcing animations otherwise
    // (We rely on effect above which already depends on activeTab & tabLayouts)
  }, [theme]);

  // Animated indicator style
  const animatedIndicatorStyle = useAnimatedStyle(() => {
    if (variant === 'line') {
      return {
        [isVertical ? 'top' : 'left']: indicatorPosition.value,
        [isVertical ? 'height' : 'width']: indicatorSize.value,
      } as any;
    }
    if (variant === 'chip') {
      return {
        [isVertical ? 'top' : 'left']: indicatorPosition.value,
        [isVertical ? 'height' : 'width']: indicatorSize.value,
        [isVertical ? 'left' : 'top']: indicatorSecondaryPosition.value,
        [isVertical ? 'width' : 'height']: indicatorCrossSize.value,
      } as any;
    }
    return {};
  }, [isVertical, variant]);

  const handleTabPress = (tabKey: string) => {
    if (controlledActiveTab === undefined) {
      setInternalActiveTab(tabKey);
    }
    onTabChange?.(tabKey);
  };

  // If active tab key no longer exists (items changed), fall back gracefully
  useEffect(() => {
    if (!items.find(i => i.key === activeTab)) {
      const fallback = items[0]?.key || '';
      if (controlledActiveTab === undefined) setInternalActiveTab(fallback);
      onTabChange?.(fallback);
    }
  }, [items, activeTab, controlledActiveTab, onTabChange]);

  const activeTabItem = items.find(item => item.key === activeTab);

  const totalTabsPrimarySize = useMemo(() => {
    if (!items.length) return 0;
    const baseSize = items.reduce((sum, item, index) => {
      const layout = tabLayouts[item.key];
      if (!layout) return sum;
      const size = isVertical ? layout.height : layout.width;
      return sum + size;
    }, 0);

    const gapSize = tabGap ? tabGap * Math.max(0, items.length - 1) : 0;
    return baseSize + gapSize;
  }, [items, tabLayouts, isVertical, tabGap]);

  const availablePrimarySize = isVertical
    ? (containerSize.height || 0)
    : (containerSize.width || 0);

  const hasOverflow = useMemo(() => {
    if (!totalTabsPrimarySize || !availablePrimarySize) {
      return false;
    }
    return totalTabsPrimarySize > availablePrimarySize + 1; // slight buffer for rounding
  }, [totalTabsPrimarySize, availablePrimarySize]);

  const enableScroll = scrollable || hasOverflow;

  const TabsHeader = enableScroll ? ScrollView : View;
  const tabsHeaderProps = enableScroll ? {
    horizontal: !isVertical,
    showsHorizontalScrollIndicator: false,
    showsVerticalScrollIndicator: false,
    contentContainerStyle: styles.tabsHeader,
    style: styles.tabsHeaderScroll,
  } : {
    style: styles.tabsHeader,
  };

  const disabledKeySet = useMemo(() => new Set(disabledKeys), [disabledKeys]);
  const resolvedInactiveBg = useMemo(
    () => resolveThemeColor(theme, inactiveTabBackgroundColor),
    [theme, inactiveTabBackgroundColor]
  );
  const resolvedActiveBg = useMemo(
    () => resolveThemeColor(theme, activeTabBackgroundColor),
    [theme, activeTabBackgroundColor]
  );
  const resolvedActiveTextColor = useMemo(() => {
    const explicit = resolveThemeColor(theme, activeTabTextColor);
    if (explicit) return explicit;
    if (variant === 'chip') return theme.text.onPrimary || '#FFFFFF';
    return undefined;
  }, [theme, activeTabTextColor, variant]);

  const getCornerStyles = useCallback((index: number, count: number): ViewStyle => {
    if (!tabCornerRadius || variant === 'folder') return {};
    if (variant === 'chip') {
      return { borderRadius: tabCornerRadius };
    }

    const corners: ViewStyle = {};
    const isFirst = index === 0;
    const isLast = index === count - 1;

    if (isVertical) {
      if (location === 'start') {
        if (isFirst) corners.borderTopLeftRadius = tabCornerRadius;
        if (isLast) corners.borderBottomLeftRadius = tabCornerRadius;
      } else {
        if (isFirst) corners.borderTopRightRadius = tabCornerRadius;
        if (isLast) corners.borderBottomRightRadius = tabCornerRadius;
      }
    } else {
      if (location === 'start') {
        if (isFirst) corners.borderTopLeftRadius = tabCornerRadius;
        if (isLast) corners.borderTopRightRadius = tabCornerRadius;
      } else {
        if (isFirst) corners.borderBottomLeftRadius = tabCornerRadius;
        if (isLast) corners.borderBottomRightRadius = tabCornerRadius;
      }
    }

    return corners;
  }, [tabCornerRadius, variant, isVertical, location]);

  const getGapStyles = useCallback((index: number, count: number): ViewStyle => {
    if (!tabGap || variant === 'folder') return {};
    if (index === count - 1) return {};
    return isVertical 
      ? { marginBottom: tabGap } 
      : (isRTL ? { marginLeft: tabGap } : { marginRight: tabGap });
  }, [tabGap, variant, isVertical, isRTL]);

  return (
    <View
      style={[styles.container, spacingStyles, style]}
      onLayout={handleContainerLayout}
      {...otherProps}
    >
      {/* For navigationOnly mode, render only tabs */}
      {navigationOnly ? (
        <TabsHeader {...tabsHeaderProps}>
          {items.map((item, index) => {
            const isActive = item.key === activeTab;
            const isDisabled = item.disabled || disabledKeySet.has(item.key);
            const cornerStyles = getCornerStyles(index, items.length);
            const gapStyle = getGapStyles(index, items.length);

            const inactiveBg = resolvedInactiveBg;
            const activeBg = resolvedActiveBg;
            const activeTextClr = resolvedActiveTextColor;

            return (
              <Pressable
                key={item.key}
                accessibilityRole="tab"
                accessibilityState={{ selected: isActive, disabled: isDisabled }}
                onLayout={(event) => handleTabLayout(item.key, event)}
                style={[
                  styles.tab,
                  isActive && styles.activeTab,
                  tabStyle,
                  cornerStyles,
                  gapStyle,
                  inactiveBg && !isActive && { backgroundColor: inactiveBg },
                  activeBg && isActive && { backgroundColor: activeBg },
                  isDisabled && { opacity: 0.5 }
                ]}
                onPress={() => {
                  if (isDisabled) { onDisabledTabPress?.(item.key, item); return; }
                  handleTabPress(item.key);
                }}
              >
                {item.icon && (
                  <View style={isRTL ? { marginLeft: 4 } : { marginRight: 4 }}>
                    {item.icon}
                  </View>
                )}
                <Text
                  style={[
                    styles.tabText,
                    isActive && styles.activeTabText,
                    textStyle,
                    activeTextClr && isActive && { color: activeTextClr },
                  ]}
                  color={isActive ? activeTextClr : undefined}
                >
                  {item.label}
                </Text>
              </Pressable>
            );
          })}

          {(variant === 'line' || variant === 'chip') && (
            <Animated.View
              style={[
                styles.indicator,
                animatedIndicatorStyle,
              ]}
            />
          )}
        </TabsHeader>
      ) : (
        <>
          <TabsHeader {...tabsHeaderProps}>
            {items.map((item, index) => {
              const isActive = item.key === activeTab;
              const isDisabled = item.disabled || disabledKeySet.has(item.key);
              const cornerStyles = getCornerStyles(index, items.length);
              const gapStyle = getGapStyles(index, items.length);

              // Background overrides
              const inactiveBg = resolvedInactiveBg;
              const activeBg = resolvedActiveBg;
              const activeTextClr = resolvedActiveTextColor;

              return (
                <Pressable
                  key={item.key}
                  accessibilityRole="tab"
                  accessibilityState={{ selected: isActive, disabled: isDisabled }}
                  onLayout={(event) => handleTabLayout(item.key, event)}
                  style={[
                    styles.tab,
                    isActive && styles.activeTab,
                    tabStyle,
                    cornerStyles,
                    gapStyle,
                    !isActive && inactiveBg && { backgroundColor: inactiveBg },
                    isActive && activeBg && { backgroundColor: activeBg },
                    isDisabled && { opacity: 0.5 }
                  ]}
                  onPress={() => {
                    if (isDisabled) { onDisabledTabPress?.(item.key, item); return; }
                    handleTabPress(item.key);
                  }}
                >
                  {item.icon && (
                    <View style={isRTL ? { marginLeft: 8 } : { marginRight: 8 }}>
                      {item.icon}
                    </View>
                  )}

                  <Flex gap={6} align="center">
                    <Text
                      style={[
                        styles.tabText,
                        isActive && styles.activeTabText,
                        textStyle,
                        activeTextClr && isActive && { color: activeTextClr },
                      ]}
                      color={isActive ? activeTextClr : undefined}
                    >
                      {item.label}
                    </Text>
                    {item.subLabel && (
                      <Sup color={isActive ? activeTextClr : undefined}>
                        {item.subLabel}
                      </Sup>
                    )}
                  </Flex>

                </Pressable>
              );
            })}

            {/* Animated indicator for line variant */}
            {(variant === 'line' || variant === 'chip') && (
              <Animated.View
                style={[
                  styles.indicator,
                  animatedIndicatorStyle,
                ]}
              />
            )}
          </TabsHeader>

          <View style={[styles.content, contentStyle]}>
            {activeTabItem?.content}
          </View>
        </>
      )}

      {/* Render children if provided (for navigationOnly mode) */}
      {navigationOnly && children}
    </View>
  );
};