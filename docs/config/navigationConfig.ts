import { CORE_COMPONENTS } from './coreComponents';

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

const UNIQUE_CORE_COMPONENTS = CORE_COMPONENTS.filter(
  (component, index, array) => array.findIndex(item => item.name === component.name) === index,
);

const toNavItems = (
  components: typeof CORE_COMPONENTS,
  baseRoute: string,
): NavItem[] => components
  .sort((a, b) => a.name.localeCompare(b.name))
  .map(component => ({
    label: component.name,
    route: `/${baseRoute}/${component.name}`,
    icon: component.icon ?? 'grid',
    searchable: true,
    description: component.description,
  }));

const UI_COMPONENT_NAV_ITEMS: NavItem[] = toNavItems(
  UNIQUE_CORE_COMPONENTS.filter(component => component.category !== 'charts'),
  'components',
);

const CHART_COMPONENT_NAV_ITEMS: NavItem[] = toNavItems(
  UNIQUE_CORE_COMPONENTS.filter(component => component.category === 'charts'),
  'charts',
);

export const NAV_SECTIONS: NavSection[] = [

  {
    section: 'Explore',
    items: [
      { label: 'Components', route: '/components', icon: 'grid', bottom: true, searchable: true },
      { label: 'Charts', route: '/charts', icon: 'linechart', bottom: true, searchable: true },
      { label: 'Examples', route: '/examples', icon: 'code', bottom: true, searchable: true },
      { label: 'Hooks', route: '/hooks', icon: 'hook', searchable: true, description: 'Reference for reusable React hooks in Platform Blocks' },
      { label: 'Icons', route: '/icons', icon: 'star', searchable: true, description: 'Test custom icons package integration' },
    ]
  },

  {
    section: 'Docs',
    items: [
      { label: 'Getting Started', route: '/getting-started', icon: 'home', bottom: true, searchable: true, description: 'Project overview' },
      { label: 'Installation', route: '/installation', icon: 'download', searchable: true },
      { label: 'Theming', route: '/theming', icon: 'palette', searchable: true, description: 'Customize colors, typography, and design system' },
      { label: 'Localization', route: '/localization', icon: 'globe', searchable: true },
      // { label: 'Keyboard Management', route: '/keyboard', icon: 'keyboard', searchable: true, description: 'Set up shared keyboard dismissal, avoidance, and refocus patterns' },
      { label: 'FAQ', route: '/faq', icon: 'question', searchable: true },
      { label: 'Support', route: '/support', icon: 'support', bottom: true, searchable: true, description: 'Get help and contact information' },
    ]
  },
  {
    section: 'UI Components',
    items: UI_COMPONENT_NAV_ITEMS,
  },
  {
    section: 'Chart Components',
    items: CHART_COMPONENT_NAV_ITEMS,
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

