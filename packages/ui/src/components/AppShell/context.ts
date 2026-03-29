import React, { createContext, useContext } from 'react';
import { useBreakpoint, useIsMobile, resolveResponsiveValue, Breakpoint } from '../../core/responsive';
import { AppShellConfig, LayoutStrategy } from './types';

// AppShell context value interface
export interface AppShellContextValue {
  /** Current height of header */
  headerHeight: number;
  /** Current width of navbar */
  navbarWidth: number;
  /** Current width of aside panel */
  asideWidth: number;
  /** Current height of footer */
  footerHeight: number;
  /** Current height of bottom navigation */
  bottomNavHeight: number;
  /** Whether navbar is collapsed */
  isNavbarCollapsed: boolean;
  /** Whether aside panel is collapsed */
  isAsideCollapsed: boolean;
  /** Whether we're on mobile device */
  isMobile: boolean;
  /** Current breakpoint */
  breakpoint: Breakpoint;
  /** Current layout strategy */
  layout: LayoutStrategy;
  /** Full configuration object */
  config: AppShellConfig;
}

// Create context
const AppShellContext = createContext<AppShellContextValue | undefined>(undefined);

// Hook to access AppShell context
export const useAppShell = (): AppShellContextValue => {
  const context = useContext(AppShellContext);
  if (!context) {
    throw new Error('useAppShell must be used within an AppShell component');
  }
  return context;
};

// Hook to calculate layout dimensions based on config
export const useAppShellLayout = (
  config: AppShellConfig,
  layout: LayoutStrategy,
  navbarOpen?: boolean,
  asideOpen?: boolean
): AppShellContextValue => {
  const breakpoint = useBreakpoint();
  const isMobile = useIsMobile();

  const sections = {
    header: (config.layoutSections?.header ?? true) && (config.showHeader ?? true),
    navbar: config.layoutSections?.navbar ?? true,
    aside: config.layoutSections?.aside ?? true,
    footer: config.layoutSections?.footer ?? true,
    bottomNav: config.layoutSections?.bottomNav ?? true,
  };

  const headerConfig = sections.header ? config.header : undefined;
  const navbarConfig = sections.navbar ? config.navbar : undefined;
  const asideConfig = sections.aside ? config.aside : undefined;
  const footerConfig = sections.footer ? config.footer : undefined;
  const bottomNavConfig = sections.bottomNav ? config.bottomNav : undefined;
  
  // Calculate header height
  const headerHeight = headerConfig 
    ? resolveResponsiveValue(headerConfig.height, breakpoint) 
    : 0;
  
  // Calculate footer height
  const footerHeight = footerConfig 
    ? resolveResponsiveValue(footerConfig.height, breakpoint) 
    : 0;
  
  // Calculate bottom nav height (only on mobile)
  const bottomNavHeight = bottomNavConfig && (!bottomNavConfig.showOnlyMobile || isMobile)
    ? resolveResponsiveValue(bottomNavConfig.height, breakpoint)
    : 0;
  
  // Determine navbar collapsed state
  const isNavbarCollapsed = navbarConfig 
    ? isMobile 
      ? navbarConfig.collapsed?.mobile ?? !navbarOpen
      : navbarConfig.collapsed?.desktop ?? false
    : true;
  
  // Calculate navbar width
  const navbarWidth = navbarConfig && !isNavbarCollapsed
    ? resolveResponsiveValue(navbarConfig.width, breakpoint)
    : 0;
  
  // Determine aside collapsed state
  const isAsideCollapsed = asideConfig
    ? isMobile
      ? asideConfig.collapsed?.mobile ?? !asideOpen
      : asideConfig.collapsed?.desktop ?? false
    : true;
  
  // Calculate aside width
  const asideWidth = asideConfig && !isAsideCollapsed
    ? resolveResponsiveValue(asideConfig.width, breakpoint)
    : 0;
  
  return {
    headerHeight: headerHeight as any,
    navbarWidth: navbarWidth as any,
    asideWidth: asideWidth as any,
    footerHeight: footerHeight as any,
    bottomNavHeight: bottomNavHeight as any,
    isNavbarCollapsed,
    isAsideCollapsed,
    isMobile,
    breakpoint,
    layout,
    config,
  };
};

// Provider component props
export interface AppShellProviderProps {
  value: AppShellContextValue;
  children: React.ReactNode;
}

// Provider component
export const AppShellProvider: React.FC<AppShellProviderProps> = ({
  value,
  children,
}) => {
  return React.createElement(
    AppShellContext.Provider,
    { value },
    children
  );
};

// Utility to determine automatic layout based on breakpoint
export const getAutoLayout = (breakpoint: Breakpoint): LayoutStrategy => {
  if (breakpoint === 'base' || breakpoint === 'xs' || breakpoint === 'sm') {
    return 'mobile-bottom-nav';
  }
  return 'desktop-default';
};

// Utility to calculate main content offset styles
export const getMainContentOffset = (context: AppShellContextValue) => {
  const { 
    headerHeight, 
    footerHeight, 
    navbarWidth, 
    asideWidth, 
    bottomNavHeight, 
    isMobile,
    layout 
  } = context;
  
  let top = headerHeight;
  let left = 0;
  let right = 0;
  let bottom = 0;
  
  // Calculate horizontal offsets based on layout strategy
  if (!isMobile) {
    switch (layout) {
      case 'desktop-default':
      case 'desktop-alt':
        left = navbarWidth;
        right = asideWidth;
        break;
      case 'adaptive':
        left = navbarWidth;
        right = asideWidth;
        break;
    }
    bottom = footerHeight;
  } else {
    // Mobile layouts
    bottom = bottomNavHeight;
  }
  
  return {
    position: 'absolute' as const,
    top,
    left,
    right,
    bottom,
  };
};

// Export context
export { AppShellContext };
