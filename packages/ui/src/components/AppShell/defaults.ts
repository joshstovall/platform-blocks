// Default configuration values for AppShell sections.
// Keeping this isolated allows tooling and docs generators to consume stable defaults.
import type { HeaderConfig, NavbarConfig, AsideConfig, FooterConfig, BottomNavConfig } from './types';

export const DEFAULT_HEADER: HeaderConfig = {
  height: { base: 56, md: 64 },
  collapsed: false,
  zIndex: 1000,
};

export const DEFAULT_NAVBAR: NavbarConfig = {
  width: { base: 280, lg: 300 },
  breakpoint: 'md',
  collapsed: { mobile: true, desktop: false },
  zIndex: 900,
  collapsedWidth: 72,
  expandOnHover: true,
  startCollapsedDesktop: false,
};

export const DEFAULT_ASIDE: AsideConfig = {
  width: { base: 260, lg: 300 },
  breakpoint: 'lg',
  collapsed: { mobile: true, desktop: true },
  zIndex: 900,
};

export const DEFAULT_FOOTER: FooterConfig = {
  height: { base: 48, md: 56 },
  collapsed: false,
  zIndex: 800,
};

export const DEFAULT_BOTTOM_NAV: BottomNavConfig = {
  height: { base: 56 },
  showOnlyMobile: true,
  collapsed: false,
  zIndex: 1000,
};
