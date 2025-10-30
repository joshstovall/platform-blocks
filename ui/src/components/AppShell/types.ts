import React from 'react';
import { SpacingProps } from '../../core/utils';

// Responsive sizing (mimic Mantine style object or primitive)
export type ResponsiveSize = number | string | {
  base?: number | string;
  xs?: number | string;
  sm?: number | string;
  md?: number | string;
  lg?: number | string;
  xl?: number | string;
};

export type Breakpoint = 'base' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface HeaderConfig {
  height: ResponsiveSize;
  collapsed?: boolean;
  offset?: boolean;
  zIndex?: number;
}

export interface NavbarConfig {
  width: ResponsiveSize;
  breakpoint: Breakpoint;
  collapsed?: {
    mobile?: boolean;
    desktop?: boolean;
  };
  zIndex?: number;
  collapsedWidth?: number;
  expandOnHover?: boolean;
  startCollapsedDesktop?: boolean;
}

export interface AsideConfig {
  width: ResponsiveSize;
  breakpoint: Breakpoint;
  collapsed?: {
    mobile?: boolean;
    desktop?: boolean;
  };
  zIndex?: number;
}

export interface FooterConfig {
  height: ResponsiveSize;
  collapsed?: boolean;
  offset?: boolean;
  zIndex?: number;
}

export interface BottomNavConfig {
  height: ResponsiveSize;
  showOnlyMobile?: boolean;
  collapsed?: boolean;
  zIndex?: number;
}

export interface LayoutVisibilityConfig {
  header?: boolean;
  navbar?: boolean;
  aside?: boolean;
  footer?: boolean;
  bottomNav?: boolean;
}

// Mobile navigation patterns
export interface MobileMenuConfig {
  type?: 'modal' | 'drawer' | 'fullscreen';
  animationType?: 'slide' | 'fade' | 'none';
  showBackdrop?: boolean;
  closeOnOutsidePress?: boolean;
}

export interface StatusBarConfig {
  style?: 'auto' | 'light' | 'dark';
  backgroundColor?: string;
  translucent?: boolean;
  hidden?: boolean;
}

export type LayoutType = 'default' | 'alt' | 'mobile-bottom-nav' | 'mobile-tabs';

// Unified internal layout strategies used by context/layout calculators
export type LayoutStrategy =
  | 'desktop-default'
  | 'desktop-alt'
  | 'mobile-bottom-nav'
  | 'adaptive';

export interface AppShellProps extends SpacingProps {
  layout?: 'default' | 'alt';
  header?: HeaderConfig;
  navbar?: NavbarConfig;
  aside?: AsideConfig;
  footer?: FooterConfig;
  bottomNav?: BottomNavConfig;
  showHeader?: boolean;
  /** Toggle rendering of individual autoLayout sections */
  layoutSections?: LayoutVisibilityConfig;
  /** Enable AppShell auto-composition. When true, AppShell will render its own Header/Navbar/Main/Footer/BottomBar using the provided content props instead of relying on children. */
  autoLayout?: boolean;
  /** Content to render inside AppShell.Header when autoLayout is enabled */
  headerContent?: React.ReactNode | (() => React.ReactNode);
  /** Content to render inside AppShell.Navbar when autoLayout is enabled */
  navbarContent?: React.ReactNode | (() => React.ReactNode);
  /** Content to render inside AppShell.Aside when autoLayout is enabled */
  asideContent?: React.ReactNode | (() => React.ReactNode);
  /** Content to render inside AppShell.Footer when autoLayout is enabled */
  footerContent?: React.ReactNode | (() => React.ReactNode);
  /** Items for a mobile bottom navigation bar when autoLayout is enabled */
  bottomNavItems?: BottomAppBarItem[];
  /** Additional props forwarded to BottomAppBar in autoLayout mode (items overridden by bottomNavItems) */
  bottomNavProps?: Partial<AppShellBottomNavProps>;
  mobileMenu?: MobileMenuConfig;
  statusBar?: StatusBarConfig;
  padding?: ResponsiveSize;
  withBorder?: boolean;
  zIndex?: number;
  transitionDuration?: number;
  transitionTimingFunction?: string;
  disabled?: boolean;
  children: React.ReactNode;
  backgroundColor?: string;
  withSafeArea?: boolean;
  style?: any;
  testID?: string;
  /** Maximum width for main content area to prevent stretching on wide screens */
  maxContentWidth?: number | string;
  /** Center content when maxContentWidth is set */
  centerContent?: boolean;
  /** Optional table of contents rendered to the right of the main content */
  tableOfContents?: React.ReactNode;
  /** Hide the table of contents automatically on mobile breakpoints */
  hideTableOfContentsOnMobile?: boolean;
  /** Custom width for the table of contents column */
  tableOfContentsWidth?: number | string;
  /** Toggle border between content and table of contents */
  tableOfContentsWithBorder?: boolean;
}

export interface AppShellContextValue {
  headerHeight: number | string;
  navbarWidth: number | string;
  fullNavbarWidth: number | string;
  navbarCollapsedRailWidth: number | string;
  navbarExpandOnHover: boolean;
  asideWidth: number | string;
  footerHeight: number | string;
  bottomNavHeight: number | string;
  isNavbarCollapsed: boolean;
  isNavbarRail: boolean;
  isAsideCollapsed: boolean;
  isMobile: boolean;
  breakpoint: Breakpoint;
  openNavbar: () => void;
  closeNavbar: () => void;
  toggleNavbar: () => void;
  navbarOpen: boolean;
  transitionDuration: number;
}

// Configuration object consumed by layout calculator
export interface AppShellConfig {
  header?: HeaderConfig;
  navbar?: NavbarConfig;
  aside?: AsideConfig;
  footer?: FooterConfig;
  bottomNav?: BottomNavConfig;
  showHeader?: boolean;
  layoutSections?: LayoutVisibilityConfig;
}

// Sub-component prop interfaces (moved from AppShell.tsx for central typing)
export interface AppShellHeaderProps {
  children: React.ReactNode;
  withBorder?: boolean;
  zIndex?: number;
  style?: any;
}

export interface AppShellNavbarProps {
  children: React.ReactNode;
  withBorder?: boolean;
  zIndex?: number;
  style?: any;
  drawerMode?: boolean; // Force temporary overlay drawer mode (defaults to auto on mobile)
}

export interface AppShellAsideProps {
  children: React.ReactNode;
  withBorder?: boolean;
  zIndex?: number;
  style?: any;
}

export interface AppShellFooterProps {
  children: React.ReactNode;
  withBorder?: boolean;
  zIndex?: number;
  style?: any;
}

export interface BottomAppBarItem {
  key: string;
  label: string;
  icon: React.ReactNode;
  activeIcon?: React.ReactNode;
  badgeCount?: number;
  onPress?: () => void; // per-item override
}

export interface AppShellBottomNavProps {
  /** Provide custom children (legacy). If `items` provided, children are ignored. */
  children?: React.ReactNode;
  /** Structured items definition for standard navigation bar */
  items?: BottomAppBarItem[];
  /** Currently active item key */
  activeKey?: string;
  /** Callback when an item is pressed (fires after per-item onPress) */
  onItemPress?: (key: string) => void;
  /** Show labels under icons (default true). If false, shows tooltip-like behavior (future) */
  showLabels?: boolean;
  /** Visual variant */
  variant?: 'solid' | 'surface' | 'elevated' | 'translucent';
  /** Elevation shadow level (only for elevated variant) */
  elevation?: number;
  /** Optional floating action button rendered centered & elevated */
  fab?: React.ReactNode;
  withBorder?: boolean;
  zIndex?: number;
  style?: any;
}

export interface AppShellMainProps {
  children: React.ReactNode;
  style?: any;
  id?: string; // Web only id attribute passthrough
  role?: string; // Web only role attribute passthrough
  /** Maximum width for main content area to prevent stretching on wide screens */
  maxWidth?: number | string;
  /** Center content when maxWidth is set */
  centerContent?: boolean;
  /** Table of contents content to show in right sidebar */
  tableOfContents?: React.ReactNode;
  /** Hide table of contents on mobile */
  hideTocOnMobile?: boolean;
  /** Width of the table of contents sidebar */
  tocWidth?: number | string;
  /** Add border to table of contents */
  tocWithBorder?: boolean;
}

export interface AppShellSectionProps {
  children: React.ReactNode;
  grow?: boolean;
  withScrollArea?: boolean;
  style?: any;
}
