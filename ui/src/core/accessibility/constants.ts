// Accessibility constants
export const ACCESSIBILITY_LABELS = {
  // Common actions
  CLOSE: 'Close',
  OPEN: 'Open',
  TOGGLE: 'Toggle',
  SELECT: 'Select',
  DESELECT: 'Deselect',
  EXPAND: 'Expand',
  COLLAPSE: 'Collapse',
  
  // Navigation
  PREVIOUS: 'Previous',
  NEXT: 'Next',
  FIRST: 'First',
  LAST: 'Last',
  PAGE_UP: 'Page up',
  PAGE_DOWN: 'Page down',
  
  // Form elements
  REQUIRED: 'Required field',
  OPTIONAL: 'Optional field',
  INVALID: 'Invalid input',
  VALID: 'Valid input',
  
  // Status
  LOADING: 'Loading',
  ERROR: 'Error',
  SUCCESS: 'Success',
  WARNING: 'Warning',
  
  // Collections
  ITEM_OF: 'Item {current} of {total}',
  PAGE_OF: 'Page {current} of {total}',
  SELECTED_ITEMS: '{count} items selected',
} as const;

export const ACCESSIBILITY_ROLES = {
  // Interactive elements
  BUTTON: 'button',
  LINK: 'link',
  CHECKBOX: 'checkbox',
  RADIO: 'radio',
  SWITCH: 'switch',
  SLIDER: 'slider',
  
  // Input elements
  TEXTBOX: 'textbox',
  SEARCH: 'search',
  COMBOBOX: 'combobox',
  SPINBUTTON: 'spinbutton',
  
  // Layout elements
  MAIN: 'main',
  BANNER: 'banner',
  CONTENTINFO: 'contentinfo',
  NAVIGATION: 'navigation',
  COMPLEMENTARY: 'complementary',
  
  // Structure elements
  HEADING: 'heading',
  LIST: 'list',
  LISTITEM: 'listitem',
  TABLE: 'table',
  ROW: 'row',
  CELL: 'cell',
  
  // Interactive collections
  MENU: 'menu',
  MENUITEM: 'menuitem',
  TAB: 'tab',
  TABPANEL: 'tabpanel',
  TABLIST: 'tablist',
  
  // Live regions
  ALERT: 'alert',
  STATUS: 'status',
  LOG: 'log',
  MARQUEE: 'marquee',
  TIMER: 'timer',
} as const;

export const ACCESSIBILITY_STATES = {
  // Selection states
  CHECKED: 'checked',
  SELECTED: 'selected',
  PRESSED: 'pressed',
  
  // Interaction states
  DISABLED: 'disabled',
  READONLY: 'readonly',
  REQUIRED: 'required',
  
  // Visibility states
  EXPANDED: 'expanded',
  COLLAPSED: 'collapsed',
  HIDDEN: 'hidden',
  
  // Validity states
  INVALID: 'invalid',
  VALID: 'valid',
} as const;

// Focus management constants
export const FOCUS_TRAP_SELECTOR = '[data-focus-trap]';
export const FOCUSABLE_ELEMENTS = [
  'button',
  'input',
  'select',
  'textarea',
  'a[href]',
  '[tabindex]:not([tabindex="-1"])',
  '[role="button"]',
  '[role="link"]',
  '[role="checkbox"]',
  '[role="radio"]',
].join(', ');

// Motion constants
export const MOTION_DURATIONS = {
  INSTANT: 0,
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  REDUCED: 0, // For reduced motion preference
} as const;

// Announcement priorities
export const ANNOUNCEMENT_PRIORITY = {
  POLITE: 'polite',
  ASSERTIVE: 'assertive',
} as const;