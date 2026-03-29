// JSON schema-style description for potential codegen / docs tooling.
// This is intentionally lightweight and not a full JSON Schema draft implementation.

export interface AppShellMetaField {
  name: string;
  type: string;
  required?: boolean;
  description?: string;
  default?: any;
  enum?: string[];
}

export interface AppShellMetaSection {
  name: string;
  description?: string;
  fields: AppShellMetaField[];
}

export const APP_SHELL_META: AppShellMetaSection[] = [
  {
    name: 'layout',
    description: 'Root layout configuration for AppShell',
    fields: [
      { name: 'layout', type: 'LayoutType', description: 'Layout strategy variant', default: 'default' },
      { name: 'withBorder', type: 'boolean', default: true },
      { name: 'padding', type: 'ResponsiveSize', description: 'Main content padding scale or object' },
      { name: 'transitionDuration', type: 'number', default: 200 },
    ]
  },
  {
    name: 'header',
    fields: [
      { name: 'height', type: 'ResponsiveSize', required: true },
      { name: 'collapsed', type: 'boolean' },
      { name: 'zIndex', type: 'number', default: 1000 }
    ]
  },
  {
    name: 'navbar',
    fields: [
      { name: 'width', type: 'ResponsiveSize', required: true },
      { name: 'breakpoint', type: 'Breakpoint', required: true },
      { name: 'collapsed.mobile', type: 'boolean' },
      { name: 'collapsed.desktop', type: 'boolean' },
      { name: 'collapsedWidth', type: 'number', description: 'Rail width when collapsed', default: 72 },
      { name: 'expandOnHover', type: 'boolean', default: true },
      { name: 'startCollapsedDesktop', type: 'boolean', default: false }
    ]
  },
  {
    name: 'aside',
    fields: [
      { name: 'width', type: 'ResponsiveSize', required: true },
      { name: 'breakpoint', type: 'Breakpoint', required: true },
      { name: 'collapsed.mobile', type: 'boolean' },
      { name: 'collapsed.desktop', type: 'boolean' }
    ]
  },
  {
    name: 'footer',
    fields: [
      { name: 'height', type: 'ResponsiveSize', required: true },
      { name: 'collapsed', type: 'boolean' },
      { name: 'zIndex', type: 'number', default: 800 }
    ]
  },
  {
    name: 'bottomNav',
    fields: [
      { name: 'height', type: 'ResponsiveSize', required: true },
      { name: 'showOnlyMobile', type: 'boolean', default: true },
      { name: 'collapsed', type: 'boolean' },
      { name: 'zIndex', type: 'number', default: 1000 }
    ]
  }
];
