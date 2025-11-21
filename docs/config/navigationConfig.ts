// Using internal Icon registry names directly

export interface NavItem {
  label: string;
  route: string;
  icon: string;
  bottom?: boolean; // show in bottom bar
  searchable?: boolean; // include in spotlight
  section?: string; // optional override section grouping
  description?: string; // for spotlight
}

export interface NavSection {
  section: string;
  items: NavItem[];
}

export const NAV_SECTIONS: NavSection[] = [
  {
    section: 'Documentation',
    items: [
      { label: 'Getting Started', route: '/getting-started', icon: 'home', bottom: true, searchable: true, description: 'Project overview' },
      { label: 'Installation', route: '/installation', icon: 'download', searchable: true },
      { label: 'Theming', route: '/theming', icon: 'palette', searchable: true, description: 'Customize colors, typography, and design system' },
      { label: 'Hooks', route: '/hooks', icon: 'hook', searchable: true, description: 'Reference for reusable React hooks in Platform Blocks' },
      { label: 'Localization', route: '/localization', icon: 'globe', searchable: true },
    // { label: 'Keyboard Management', route: '/keyboard', icon: 'keyboard', searchable: true, description: 'Set up shared keyboard dismissal, avoidance, and refocus patterns' },
      { label: 'FAQ', route: '/faq', icon: 'question', searchable: true },
      { label: 'Support', route: '/support', icon: 'support', bottom: true, searchable: true, description: 'Get help and contact information' },
    ]
  },
  {
    section: 'Components',
    items: [
      { label: 'Components', route: '/components', icon: 'grid', bottom: true, searchable: true },
      { label: 'Examples', route: '/examples', icon: 'code', bottom: true, searchable: true },
      { label: 'Charts', route: '/charts', icon: 'linechart', bottom: true, searchable: true },
      { label: 'Icons', route: '/icons', icon: 'star', searchable: true, description: 'Test custom icons package integration' },
    ]
  },
  // {
  //   section: 'Examples',
  //   items: [
  //     { label: 'Chatroom', route: '/examples/chatroom', icon: 'chat', searchable: true },
  //     { label: 'Music Player', route: '/examples/music-player', icon: 'music', searchable: true },
  //     { label: 'Dashboard', route: '/examples/dashboard', icon: 'linechart', searchable: true },
  //   ]
  // },
  // {
  //   section: 'Charts',
  //   items: [
  //     { label: 'BarChart', route: '/charts/BarChart', icon: 'bar-chart', searchable: true },
  //   ]
  // },
];

export const BOTTOM_NAV_ITEMS = NAV_SECTIONS.flatMap(s => s.items.filter(i => i.bottom));

export function findNavItem(route: string) {
  for (const sec of NAV_SECTIONS) {
    const item = sec.items.find(i => i.route === route);
    if (item) return { item, section: sec.section };
  }
  return null;
}

/**
 * Shared helper function to determine if a route is active
 * Centralizes the active route logic used across navigation components
 */
export function isRouteActive(pathname: string, route: string): boolean {
  return pathname === route || (route === '/' && pathname === '/');
}

// Backwards compatibility exports (legacy API from config/navigation.ts)
// Allows older imports using NAVIGATION_ITEMS / NavigationItem / NavigationSection
// to keep functioning after consolidating navigation configuration in one place.
export const NAVIGATION_ITEMS = NAV_SECTIONS; // legacy name
export type NavigationItem = NavItem; // legacy alias
export type NavigationSection = NavSection; // legacy alias
