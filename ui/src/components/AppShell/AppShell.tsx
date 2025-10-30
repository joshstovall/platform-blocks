import React, { createContext, useContext } from 'react';
import { View, ViewStyle, Platform, useWindowDimensions } from 'react-native';
import Animated, { useSharedValue, withTiming, useAnimatedStyle, interpolate, Easing } from 'react-native-reanimated';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { factory } from '../../core/factory';
import { useTheme } from '../../core/theme/ThemeProvider';
import { getSpacingStyles, extractSpacingProps } from '../../core/utils';
import { useDirection } from '../../core/providers/DirectionProvider';
import type {
  AppShellProps,
  AppShellContextValue,
  AppShellHeaderProps,
  AppShellNavbarProps,
  AppShellAsideProps,
  AppShellFooterProps,
  AppShellBottomNavProps,
  AppShellMainProps,
  AppShellSectionProps
} from './types';
import { useBreakpoint } from './hooks/useBreakpoint';
import { resolveResponsiveValue } from './hooks/useResponsiveValue';
import { MobileMenu } from './MobileMenu';
import { BottomAppBar } from './BottomAppBar';
import { StatusBarManager } from './StatusBarManager';

// (Breakpoint + responsive value utilities moved to hooks/)

// Enhanced AppShell context for accessing layout values (type imported)

const AppShellContext = createContext<AppShellContextValue | undefined>(undefined);
// Split contexts to minimize re-renders in hot components
type AppShellApi = { openNavbar: () => void; closeNavbar: () => void; toggleNavbar: () => void };
type AppShellLayout = { headerHeight: number | string; navbarWidth: number | string; asideWidth: number | string; footerHeight: number | string; bottomNavHeight: number | string };
const AppShellApiContext = createContext<AppShellApi | undefined>(undefined);
const AppShellLayoutContext = createContext<AppShellLayout | undefined>(undefined);
// Local (navbar-only) hover expansion context so descendants can reveal labels without causing full app re-render
const NavbarHoverContext = createContext(false);
export const useNavbarHover = () => useContext(NavbarHoverContext);

export const useAppShell = () => {
  const context = useContext(AppShellContext);
  if (!context) {
    throw new Error('useAppShell must be used within an AppShell component');
  }
  return context;
};

export const useAppShellApi = (): AppShellApi => {
  const api = useContext(AppShellApiContext);
  if (!api) throw new Error('useAppShellApi must be used within an AppShell component');
  return api;
};

export const useAppShellLayout = (): AppShellLayout => {
  const layout = useContext(AppShellLayoutContext);
  if (!layout) throw new Error('useAppShellLayout must be used within an AppShell component');
  return layout;
};

// Component for header
export const AppShellHeader: React.FC<AppShellHeaderProps> = ({
  children,
  withBorder = true,
  zIndex,
  style,
}) => {
  const theme = useTheme();
  const { headerHeight } = useAppShell();

  return (
    <View
      style={[
        {
          height: headerHeight,
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          backgroundColor: theme.colorScheme === 'dark' ? theme.colors.gray[1] : theme.colors.gray[0],
          zIndex: zIndex || 1000,
          borderBottomWidth: withBorder ? 1 : 0,
          borderBottomColor: theme.colorScheme === 'dark' ? theme.colors.gray[2] : theme.colors.gray[1],
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

const coerceNumber = (val: any, fallback: number): number => {
  if (typeof val === 'number' && !Number.isNaN(val)) return val;
  if (typeof val === 'string') {
    const trimmed = val.trim();
    if (trimmed.endsWith('%')) return fallback;
    const parsed = parseFloat(trimmed.replace(/[^0-9.\-]/g, ''));
    return Number.isNaN(parsed) ? fallback : parsed;
  }
  return fallback;
};

// Component for navbar
export const AppShellNavbar: React.FC<AppShellNavbarProps> = ({
  children,
  withBorder = true,
  zIndex,
  style,
  drawerMode,
}) => {
  const theme = useTheme();
  const { isRTL } = useDirection();
  const { navbarWidth, fullNavbarWidth, headerHeight, footerHeight, isNavbarCollapsed, isMobile, navbarOpen, closeNavbar, transitionDuration, navbarCollapsedRailWidth, navbarExpandOnHover } = useAppShell();
  const { width: windowWidth } = useWindowDimensions();
  const [hovering, setHovering] = React.useState(false);

  // Determine effective drawer mode: mobile defaults to overlay
  const effectiveDrawer = drawerMode ?? isMobile;

  const railWidth = React.useMemo(() => coerceNumber(navbarCollapsedRailWidth, 72), [navbarCollapsedRailWidth]);
  const targetExpandedWidth = React.useMemo(() => coerceNumber(fullNavbarWidth, 240), [fullNavbarWidth]);

  // Animated value controls slide/width
  const progress = useSharedValue(navbarOpen ? 1 : 0);
  React.useEffect(() => {
    progress.value = withTiming(navbarOpen ? 1 : 0, { duration: transitionDuration, easing: Easing.inOut(Easing.cubic) });
  }, [navbarOpen, transitionDuration, progress]);

  const widthValue = useSharedValue<number>(navbarOpen ? targetExpandedWidth : railWidth);
  React.useEffect(() => {
    if (effectiveDrawer) return;
    const next = navbarOpen ? targetExpandedWidth : railWidth;
    widthValue.value = withTiming(next, { duration: transitionDuration, easing: Easing.inOut(Easing.cubic) });
  }, [effectiveDrawer, navbarOpen, targetExpandedWidth, railWidth, transitionDuration, widthValue]);

  React.useEffect(() => {
    if (effectiveDrawer) return;
    if (!navbarExpandOnHover || navbarOpen) return;
    const next = hovering ? targetExpandedWidth : railWidth;
    widthValue.value = withTiming(next, { duration: transitionDuration, easing: Easing.out(Easing.cubic) });
  }, [effectiveDrawer, hovering, navbarOpen, navbarExpandOnHover, targetExpandedWidth, railWidth, transitionDuration, widthValue]);

  const widthAnimatedStyles = useAnimatedStyle(() => ({ width: widthValue.value }), [widthValue]);
  const contentAnimatedStyles = useAnimatedStyle(() => ({
    height: '100%',
    opacity: 1,
    transform: [{ translateX: 0 }],
  }));

  const drawerWidth = React.useMemo(() => {
    const raw = fullNavbarWidth;

    if (typeof raw === 'number') {
      return raw || 280;
    }

    if (typeof raw === 'string') {
      const normalized = raw.trim().toLowerCase();

      if (normalized === 'screen' || normalized === 'full' || normalized === '100%' || normalized === '100vw') {
        return windowWidth;
      }

      const percentMatch = normalized.match(/^([0-9]+(?:\.[0-9]+)?)%$/);
      if (percentMatch) {
        const percent = parseFloat(percentMatch[1]);
        if (!Number.isNaN(percent)) {
          return (percent / 100) * windowWidth;
        }
      }

      const vwMatch = normalized.match(/^([0-9]+(?:\.[0-9]+)?)vw$/);
      if (vwMatch) {
        const vw = parseFloat(vwMatch[1]);
        if (!Number.isNaN(vw)) {
          return (vw / 100) * windowWidth;
        }
      }
    }

    const coerced = coerceNumber(raw, 280);
    return coerced || 280;
  }, [fullNavbarWidth, windowWidth]);
  const drawerAnimatedStyles = useAnimatedStyle(() => ({
    transform: [{ translateX: interpolate(progress.value, [0, 1], [-drawerWidth, 0]) }],
  }), [drawerWidth, progress]);
  const backdropAnimatedStyles = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 1], [0, 0.35]),
  }), [progress]);

  const navAccessibilityProps: any = {
    accessibilityElementsHidden: !navbarOpen,
    importantForAccessibility: navbarOpen ? 'auto' : 'no-hide-descendants',
  };

  const hoverHandlers: any = Platform.OS === 'web' && navbarExpandOnHover
    ? {
        onMouseEnter: () => setHovering(true),
        onMouseLeave: () => setHovering(false),
      }
    : {};

  const backdropAccessibilityProps: any = {
    accessibilityRole: 'button',
  };

  // Keep content always visible so icons show in rail mode

  // DESKTOP (inline collapse) ----------------------------------
  if (!effectiveDrawer) {
    // Always render (even when collapsed) so width can animate between rail and expanded
    if (fullNavbarWidth === 0) return null; // truly no navbar configured
    return (
      <Animated.View
        style={[
          {
            // height: '100%',
            position: 'absolute',
            top: headerHeight,
            bottom: footerHeight,
            ...(isRTL ? { right: 0 } : { left: 0 }),
            overflow: 'hidden',
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.gray[1] : theme.colors.gray[0],
            zIndex: zIndex || 900,
            ...(isRTL ? {
              borderLeftWidth: withBorder ? 1 : 0,
              borderLeftColor: theme.colorScheme === 'dark' ? theme.colors.gray[2] : theme.colors.gray[1],
            } : {
              borderRightWidth: withBorder ? 1 : 0,
              borderRightColor: theme.colorScheme === 'dark' ? theme.colors.gray[2] : theme.colors.gray[1],
            }),
          },
          widthAnimatedStyles,
          style,
        ]}
        {...navAccessibilityProps}
        pointerEvents={'auto'}
        {...hoverHandlers}
      >
        <NavbarHoverContext.Provider value={hovering}>
          <Animated.View style={contentAnimatedStyles}>
            {children}
          </Animated.View>
        </NavbarHoverContext.Provider>
      </Animated.View>
    );
  }

  // MOBILE DRAWER ----------------------------------------------
  return (
    <>
      {/* Backdrop (kept mounted, pointer events only when open) */}
      <Animated.View
        {...backdropAccessibilityProps}
        onTouchEnd={closeNavbar}
        onStartShouldSetResponder={() => true}
        style={[{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: 'rgba(0,0,0,1)',
          zIndex: (zIndex || 900) - 1,
          pointerEvents: navbarOpen ? 'auto' : 'none',
        }, backdropAnimatedStyles]}
      />
      <Animated.View
        style={[
          {
            width: drawerWidth,
            position: 'absolute',
            top: 0, // cover header on mobile to differentiate appearance
            bottom: 0,
            ...(isRTL ? { right: 0 } : { left: 0 }),
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.gray[1] : theme.colors.gray[0],
            zIndex: zIndex || 1000,
            ...(isRTL ? {
              borderLeftWidth: withBorder ? 1 : 0,
              borderLeftColor: theme.colorScheme === 'dark' ? theme.colors.gray[2] : theme.colors.gray[1],
            } : {
              borderRightWidth: withBorder ? 1 : 0,
              borderRightColor: theme.colorScheme === 'dark' ? theme.colors.gray[2] : theme.colors.gray[1],
            }),
            boxShadow: '0 6px 16px rgba(0, 0, 0, 0.25)',
            overflow: 'hidden',
            pointerEvents: navbarOpen ? 'auto' : 'none'
          },
          drawerAnimatedStyles,
          style,
        ]}
      >
        {children}
      </Animated.View>
    </>
  );
};

// Component for aside (right panel)
export const AppShellAside: React.FC<AppShellAsideProps> = ({
  children,
  withBorder = true,
  zIndex,
  style,
}) => {
  const theme = useTheme();
  const { isRTL } = useDirection();
  const { asideWidth, headerHeight, footerHeight, isAsideCollapsed } = useAppShell();

  if (isAsideCollapsed) return null;

  return (
    <View
      style={[
        {
          width: asideWidth,
          position: 'absolute',
          top: headerHeight,
          bottom: footerHeight,
          ...(isRTL ? { left: 0 } : { right: 0 }),
          backgroundColor: theme.colorScheme === 'dark' ? theme.colors.gray[1] :  theme.colors.gray[0],
          zIndex: zIndex || 900,
          ...(isRTL ? {
            borderRightWidth: withBorder ? 1 : 0,
            borderRightColor: theme.colorScheme === 'dark' ? theme.colors.gray[2] : theme.colors.gray[1],
          } : {
            borderLeftWidth: withBorder ? 1 : 0,
            borderLeftColor: theme.colorScheme === 'dark' ? theme.colors.gray[2] : theme.colors.gray[1],
          }),
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

// Component for footer
export const AppShellFooter: React.FC<AppShellFooterProps> = ({
  children,
  withBorder = true,
  zIndex,
  style,
}) => {
  const theme = useTheme();
  const { isRTL } = useDirection();
  const { footerHeight, navbarWidth, asideWidth } = useAppShell();

  return (
    <View
      style={[
        {
          height: footerHeight,
          position: 'absolute',
          bottom: 0,
          ...(isRTL ? {
            left: asideWidth,
            right: navbarWidth,
          } : {
            left: navbarWidth,
            right: asideWidth,
          }),
          backgroundColor: theme.colorScheme === 'dark' ? theme.colors.gray[1] : theme.colors.gray[0],
          zIndex: zIndex || 800,
          borderTopWidth: withBorder ? 1 : 0,
          borderTopColor: theme.colorScheme === 'dark' ? theme.colors.gray[2] : theme.colors.gray[1],
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

// Component for bottom navigation (mobile)
export const AppShellBottomNav: React.FC<AppShellBottomNavProps> = ({
  children,
  withBorder = true,
  zIndex,
  style,
}) => {
  const theme = useTheme();
  const { bottomNavHeight, isMobile } = useAppShell();

  if (!isMobile) return null;

  return (
    <View
      style={[
        {
          height: bottomNavHeight,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: theme.colorScheme === 'dark' ? theme.colors.gray[1] : theme.colors.gray[0],
          zIndex: zIndex || 1000,
          borderTopWidth: withBorder ? 1 : 0,
          borderTopColor: theme.colorScheme === 'dark' ? theme.colors.gray[2] : theme.colors.gray[1],
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

// Component for main content
export const AppShellMain: React.FC<AppShellMainProps> = ({
  children,
  style,
  id,
  role,
  maxWidth,
  centerContent = true,
  tableOfContents,
  hideTocOnMobile = true,
  tocWidth = 280,
  tocWithBorder = true,
}) => {
  const theme = useTheme();
  const { isRTL } = useDirection();
  const {
    headerHeight,
    footerHeight,
    navbarWidth,
    asideWidth,
    bottomNavHeight,
    isMobile
  } = useAppShell();
  const insets = useSafeAreaInsets();

  const numericHeaderHeight = coerceNumber(headerHeight, 0);
  const numericFooterHeight = coerceNumber(footerHeight, 0);
  const numericNavbarWidth = coerceNumber(navbarWidth, 0);
  const numericAsideWidth = coerceNumber(asideWidth, 0);
  const numericBottomNavHeight = coerceNumber(bottomNavHeight, 0);
  const numericTocWidth = typeof tocWidth === 'number' ? tocWidth : coerceNumber(tocWidth, 280);

  const topInset = Platform.OS === 'web' ? 0 : insets.top || 0;
  const bottomInset = Platform.OS === 'web' ? 0 : insets.bottom || 0;

  // Calculate TOC width (0 if hidden on mobile or no TOC provided)
  const effectiveTocWidth = (hideTocOnMobile && isMobile) || !tableOfContents ? 0 : numericTocWidth;

  // Calculate content area dimensions - swap in RTL
  const contentLeft = isRTL 
    ? (isMobile ? 0 : numericAsideWidth + effectiveTocWidth)
    : (isMobile ? 0 : numericNavbarWidth);
  const contentRight = isRTL
    ? (isMobile ? 0 : numericNavbarWidth)
    : (isMobile ? 0 : numericAsideWidth + effectiveTocWidth);
  const contentTop = numericHeaderHeight + (isMobile ? topInset : 0);
  const contentBottom = (isMobile ? numericBottomNavHeight : numericFooterHeight) + (isMobile && numericBottomNavHeight === 0 ? bottomInset : 0);

  const horizontalPadding = maxWidth && centerContent ? 0 : 0;

  const contentStyles = [
    {
      flex: 1,
      width: '100%',
      alignSelf: centerContent ? 'center' : 'stretch',
      paddingHorizontal: horizontalPadding,
    },
    maxWidth ? { maxWidth } : null,
  ].filter(Boolean);

  const tocStyles = {
    width: numericTocWidth,
    position: 'absolute',
    top: numericHeaderHeight,
    bottom: isMobile ? numericBottomNavHeight : numericFooterHeight,
    ...(isRTL ? { left: numericAsideWidth } : { right: numericAsideWidth }),
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.gray[1] : theme.colors.gray[0],
    zIndex: 850,
    ...(isRTL ? {
      borderRightWidth: tocWithBorder ? 1 : 0,
      borderRightColor: theme.colorScheme === 'dark' ? theme.colors.gray[2] : theme.colors.gray[1],
    } : {
      borderLeftWidth: tocWithBorder ? 1 : 0,
      borderLeftColor: theme.colorScheme === 'dark' ? theme.colors.gray[2] : theme.colors.gray[1],
    }),
  } as any;

  const webAttributes: any = {
    ...(id ? { id } : {}),
    ...(role ? { role } : {}),
  };

  return (
    <>
      <View
        {...webAttributes}
        style={[
          {
            position: 'absolute',
            top: contentTop,
            left: contentLeft,
            right: contentRight,
            bottom: contentBottom,
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.gray[0] : theme.colors.gray[0],
          },
          style,
          {backgroundColor: 'white',},

          { // Keep solid fallback color for native / non-web
      // backgroundColor: theme.colorScheme === 'dark' ? '#000000' : '#FAFAFA',
      // // On web add a subtle gradient so the sticky translucent header shows variation underneath
      ...(Platform.OS === 'web' && {
        backgroundColor:
        theme.colorScheme === 'dark' ? 'transparent' :'white',
        // allow gradient to define appearance
        // backgroundImage: theme.colorScheme === 'dark'
        //   ? 'linear-gradient(rgba(0,0,0,0.8), #000000 140px)'
        //   : 'linear-gradient(rgba(250,250,250,0.8), #eaeaeaff 140px)',
      } as any),}

        ]}
      >
        {/* Content with optional max width constraint */}
        <View style={contentStyles as any}>
          {children}
        </View>
      </View>

      {/* Table of Contents */}
      {tableOfContents && (!hideTocOnMobile || !isMobile) && (
        <View style={tocStyles}>
          <View style={{ flex: 1, padding: 16 }}>
            {tableOfContents}
          </View>
        </View>
      )}
    </>
  );
};

// Section component for organizing navbar/aside content
export const AppShellSection: React.FC<AppShellSectionProps> = ({
  children,
  grow = false,
  withScrollArea = false,
  style,
}) => {
  return (
    <View
      style={[
        {
          flex: grow ? 1 : undefined,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

// Main AppShell component
function AppShellBase(props: AppShellProps, ref: React.Ref<View>) {
  const {
    layout = 'default',
    header,
    navbar,
    aside,
    footer,
  bottomNav,
  showHeader = true,
  layoutSections,
    autoLayout,
    headerContent,
    navbarContent,
    asideContent,
    footerContent,
    bottomNavItems,
    bottomNavProps,
    mobileMenu,
    statusBar,
    padding = 'md',
    withBorder = true,
    zIndex = 100,
    transitionDuration = 200,
    transitionTimingFunction = 'ease',
    disabled = false,
    children,
    backgroundColor,
    withSafeArea = true,
    style,
    testID,
    maxContentWidth,
    centerContent,
    tableOfContents,
    hideTableOfContentsOnMobile = true,
    tableOfContentsWidth = 280,
    tableOfContentsWithBorder = true,
    ...rest
  } = props;

  const resolvedCenterContent = centerContent ?? Boolean(maxContentWidth);

  const layoutVisibility = React.useMemo(() => ({
    header: (layoutSections?.header ?? true) && showHeader,
    navbar: layoutSections?.navbar ?? true,
    aside: layoutSections?.aside ?? true,
    footer: layoutSections?.footer ?? true,
    bottomNav: layoutSections?.bottomNav ?? true,
  }), [layoutSections, showHeader]);

  const { spacingProps, otherProps } = extractSpacingProps(rest);
  const spacingStyles = getSpacingStyles(spacingProps);
  const theme = useTheme();
  const breakpoint = useBreakpoint();

  // Determine if mobile based on breakpoint and platform
  const isMobile = Platform.OS !== 'web' || breakpoint === 'xs' || breakpoint === 'sm';

  const headerConfig = layoutVisibility.header && !isMobile ? header : undefined;
  const navbarConfig = layoutVisibility.navbar ? navbar : undefined;
  const asideConfig = layoutVisibility.aside ? aside : undefined;
  const footerConfig = layoutVisibility.footer ? footer : undefined;
  const bottomNavConfig = layoutVisibility.bottomNav ? bottomNav : undefined;

  // Calculate resolved dimensions
  const headerHeight = headerConfig ? resolveResponsiveValue(headerConfig.height, breakpoint) : 0;
  const footerHeight = footerConfig ? resolveResponsiveValue(footerConfig.height, breakpoint) : 0;
  const bottomNavHeight = bottomNavConfig && isMobile ? resolveResponsiveValue(bottomNavConfig.height, breakpoint) : 0;

  // Local state for drawer open when mobile
  const [navbarOpen, setNavbarOpen] = React.useState(() => {
    if (!navbarConfig) return false;
    if (isMobile) return false;
    if (navbarConfig.startCollapsedDesktop) return false;
    return true;
  });
  const openNavbar = React.useCallback(() => setNavbarOpen(true), []);
  const closeNavbar = React.useCallback(() => setNavbarOpen(false), []);
  const toggleNavbar = React.useCallback(() => setNavbarOpen(o => !o), []);

  // When breakpoint changes, ensure desktop shows navbar and mobile closes by default
  React.useEffect(() => {
    if (!navbarConfig) {
      setNavbarOpen(false);
      return;
    }
    if (isMobile) {
      setNavbarOpen(false);
    } else {
      setNavbarOpen(!(navbarConfig.startCollapsedDesktop));
    }
  }, [isMobile, navbarConfig]);

  // Calculate navbar state (desktop inline vs mobile drawer)
  const fullNavbarWidth = navbarConfig ? resolveResponsiveValue(navbarConfig.width, breakpoint) : 0;
  const railWidth = navbarConfig?.collapsedWidth ?? 72;
  const isNavbarCollapsed = navbarConfig
    ? isMobile
      ? true // drawer mode renders separately when open
      : !navbarOpen // desktop inline collapse controlled by navbarOpen
    : true;
  // Layout width (space reserved for navbar). On desktop we reserve rail width when collapsed.
  const navbarWidth = navbarConfig
    ? (isMobile
      ? 0 // drawer overlays content
      : navbarOpen ? fullNavbarWidth : railWidth)
    : 0;

  // Calculate aside state
  const isAsideCollapsed = asideConfig
    ? isMobile
      ? asideConfig.collapsed?.mobile ?? true
      : asideConfig.collapsed?.desktop ?? false
    : true;
  const asideWidth = asideConfig && !isAsideCollapsed
    ? resolveResponsiveValue(asideConfig.width, breakpoint)
    : 0;

  const contextValue = React.useMemo<AppShellContextValue>(() => ({
    headerHeight,
    navbarWidth,
    asideWidth,
    footerHeight,
    bottomNavHeight,
    isNavbarCollapsed,
    isNavbarRail: !isMobile && !!navbarConfig && !navbarOpen,
    isAsideCollapsed,
    isMobile,
    breakpoint,
    openNavbar,
    closeNavbar,
    toggleNavbar,
    navbarOpen,
    transitionDuration,
    fullNavbarWidth,
    navbarCollapsedRailWidth: railWidth,
    navbarExpandOnHover: navbarConfig?.expandOnHover ?? true,
  }), [
    headerHeight,
    navbarWidth,
    asideWidth,
    footerHeight,
    bottomNavHeight,
    isNavbarCollapsed,
    isMobile,
    navbarConfig,
    navbarOpen,
    breakpoint,
    openNavbar,
    closeNavbar,
    toggleNavbar,
    transitionDuration,
    fullNavbarWidth,
    railWidth,
    isAsideCollapsed,
  ]);

  // Memoized selector payloads for re-render isolation
  const apiValue = React.useMemo<AppShellApi>(() => ({ openNavbar, closeNavbar, toggleNavbar }), [openNavbar, closeNavbar, toggleNavbar]);
  const layoutValue = React.useMemo<AppShellLayout>(() => ({ headerHeight, navbarWidth, asideWidth, footerHeight, bottomNavHeight }), [headerHeight, navbarWidth, asideWidth, footerHeight, bottomNavHeight]);

  const containerStyle: ViewStyle = {
    flex: 1,
    backgroundColor: backgroundColor || (theme.colorScheme === 'dark' ? theme.colors.gray[0] : theme.colors.gray[0]),
    ...spacingStyles,
    ...style,

    
  };

  if (disabled) {
    return (
      <StatusBarManager {...statusBar}>
        <View ref={ref} style={containerStyle} testID={testID} {...otherProps}>
          {children}
        </View>
      </StatusBarManager>
    );
  }

  // Check if we need to replace navbar with mobile menu for mobile platforms
  const shouldUseMobileMenu = isMobile && !!navbarConfig && mobileMenu && Platform.OS !== 'web';

  const content = (
    <AppShellApiContext.Provider value={apiValue}>
      <AppShellLayoutContext.Provider value={layoutValue}>
        <AppShellContext.Provider value={contextValue}>
          <StatusBarManager {...statusBar}>



            <View ref={ref} style={containerStyle} testID={testID} {...otherProps}>
              {autoLayout ? (
                <>
                  {/* Header */}
                  {headerConfig && (
                    <AppShellHeader>
                      {typeof headerContent === 'function' ? headerContent() : headerContent}
                    </AppShellHeader>
                  )}

                  {/* Navbar (inline or drawer based on breakpoint) */}
                  {navbarConfig && (
                    <AppShellNavbar drawerMode={isMobile}>
                      {typeof navbarContent === 'function' ? navbarContent() : navbarContent}
                    </AppShellNavbar>
                  )}

                  {/* Aside */}
                  {asideConfig && (
                    <AppShellAside>
                      {typeof asideContent === 'function' ? asideContent() : asideContent}
                    </AppShellAside>
                  )}

                  {/* Main */}
                  <AppShellMain
                    maxWidth={maxContentWidth}
                    centerContent={resolvedCenterContent}
                    tableOfContents={tableOfContents}
                    hideTocOnMobile={hideTableOfContentsOnMobile}
                    tocWidth={tableOfContentsWidth}
                    tocWithBorder={tableOfContentsWithBorder}
                  >
                    {children}
                  </AppShellMain>

                  {/* Footer (desktop) */}
                  {footerConfig && !isMobile && (
                    <AppShellFooter>
                      {typeof footerContent === 'function' ? footerContent() : footerContent}
                    </AppShellFooter>
                  )}

                  {/* Bottom mobile nav */}
                  {bottomNavConfig && isMobile && (bottomNavItems?.length || bottomNavProps) && (
                    <BottomAppBar
                      {...bottomNavProps}
                      items={bottomNavItems}
                      withBorder={withBorder}
                    />
                  )}
                </>
              ) : (
                children
              )}
            </View>
            {/* Mobile Menu Modal - only render if configured and on mobile */}
            {shouldUseMobileMenu && (
              <MobileMenu
                visible={navbarOpen}
                onClose={closeNavbar}
                config={mobileMenu}
              >
                {/* Extract navbar content for mobile menu */}
                {React.Children.toArray(children).find(child =>
                  React.isValidElement(child) && child.type === AppShellNavbar
                )}
              </MobileMenu>
            )}
          </StatusBarManager>
        </AppShellContext.Provider>
      </AppShellLayoutContext.Provider>
    </AppShellApiContext.Provider>
  );

  if (withSafeArea) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1 }}>
          {content}
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return content;
}

interface AppShellFactoryPayload {
  props: AppShellProps;
  ref: View;
}

// Export enhanced AppShell with all sub-components
const AppShellComponent = factory<AppShellFactoryPayload>((props, ref) =>
  AppShellBase(props, ref)
);

// Create compound component with sub-components
type AppShellType = typeof AppShellComponent & {
  Header: typeof AppShellHeader;
  Navbar: typeof AppShellNavbar;
  Aside: typeof AppShellAside;
  Footer: typeof AppShellFooter;
  BottomNav: typeof AppShellBottomNav;
  BottomAppBar: typeof BottomAppBar;
  Main: typeof AppShellMain;
  Section: typeof AppShellSection;
  MobileMenu: typeof MobileMenu;
  StatusBarManager: typeof StatusBarManager;
};

export const AppShell = AppShellComponent as AppShellType;

// Attach sub-components
AppShell.Header = AppShellHeader;
AppShell.Navbar = AppShellNavbar;
AppShell.Aside = AppShellAside;
AppShell.Footer = AppShellFooter;
AppShell.BottomNav = AppShellBottomNav;
AppShell.BottomAppBar = BottomAppBar;
AppShell.Main = AppShellMain;
AppShell.Section = AppShellSection;
AppShell.MobileMenu = MobileMenu;
AppShell.StatusBarManager = StatusBarManager;

AppShell.displayName = 'AppShell';
