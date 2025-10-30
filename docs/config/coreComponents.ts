/**
 * Configuration for core components that should be displayed in the /components page
 * This ensures only the main UI components are shown, filtering out internal utilities,
 * context providers, and other non-user-facing components.
 */

export interface CoreComponentConfig {
  name: string;
  category: 'input' | 'display' | 'layout' | 'typography' | 'feedback' | 'navigation' | 'form' | 'data' | 'charts' | 'media' | 'dates' | 'others';
  // Internal Icon name from @platform-blocks/ui Icon registry
  icon: string;
  description?: string;
}

/**
 * List of core components to show in the components explorer
 * Components not in this list will be hidden from the main /components page
 */
// TODO: can this be removed / geneated from source?
export const CORE_COMPONENTS: CoreComponentConfig[] = [
  // Input Components
  { name: 'Button', category: 'input', icon: 'button' },
  { name: 'Checkbox', category: 'input', icon: 'check' },
  { name: 'ColorSwatch', category: 'input', icon: 'colors', description: 'Individual color swatch for use in color palettes and pickers' },
  { name: 'ColorPicker', category: 'input', icon: 'colors', description: 'Color selection input with swatches and hex input' },
  
  // dates
  { name: 'Calendar', category: 'dates', icon: 'calendar', description: 'A versatile calendar component for selecting dates, months, and years with customizable styles and behaviors.' },
  { name: 'MiniCalendar', category: 'dates', icon: 'calendar', description: 'A compact calendar component for displaying a month view with selectable dates.' },
  { name: 'DatePicker', category: 'dates', icon: 'calendar' },
  { name: 'DatePickerInput', category: 'dates', icon: 'calendar', description: 'Date selection input with dropdown calendar' },
  { name: 'MonthPicker', category: 'dates', icon: 'calendar', description: 'Month selection input with dropdown calendar' },
  { name: 'MonthPickerInput', category: 'dates', icon: 'calendar', description: 'Month selection input with dropdown calendar interface' },
  { name: 'YearPicker', category: 'dates', icon: 'calendar', description: 'Year selection input with dropdown calendar' },
  { name: 'YearPickerInput', category: 'dates', icon: 'calendar', description: 'Year selection input with dropdown calendar interface' },
  { name: 'TimePicker', category: 'dates', icon: 'clock', description: 'Time selection input with hour/minute interaction' },
  { name: 'TimePickerInput', category: 'dates', icon: 'clock', description: 'Time selection input with dropdown clock interface' },

  { name: 'FileInput', category: 'input', icon: 'file', description: 'File input with drag-and-drop support' },
  { name: 'Input', category: 'input', icon: 'input' },
  { name: 'NumberInput', category: 'input', icon: 'number' },
  { name: 'PhoneInput', category: 'input', icon: 'phone', description: 'Masked phone number input with international support' },
  { name: 'PinInput', category: 'input', icon: 'pin' },
  { name: 'Radio', category: 'input', icon: 'radio' },
  { name: 'Search', category: 'input', icon: 'search', description: 'Search input with debouncing and customizable features' },
  { name: 'Select', category: 'input', icon: 'select', description: 'Dropdown selection input' },
  { name: 'Slider', category: 'input', icon: 'slider' },
  { name: 'Switch', category: 'input', icon: 'toggle' },
  { name: 'TextArea', category: 'input', icon: 'textarea', description: 'Multi-line text input with auto-resize and character counter' },
  { name: 'Toggle', category: 'input', icon: 'toggle', description: 'Toggle button group for single or multiple selection' },
  { name: 'BrandButton', category: 'input', icon: 'bolt', description: 'Branded action button variant supporting themes & states' },
  { name: 'AppStoreBadge', category: 'input', icon: 'badge', description: 'Badge for App Store with customizable text and icon' },
  { name: 'AutoComplete', category: 'input', icon: 'autocomplete', description: 'Predictive text input with suggestions and async loading' },
  { name: 'RichTextEditor', category: 'input', icon: 'richtext', description: 'Rich text editing surface with formatting toolbar' },
  { name: 'EmojiPicker', category: 'input', icon: 'emoji', description: 'Emoji selection panel with categories, search, and skin tone support' },

  // Display Components
  { name: 'Avatar', category: 'display', icon: 'avatar' },
  { name: 'Badge', category: 'display', icon: 'badge', description: 'Small status or counter indicator positioned on a parent element' },
  { name: 'Tooltip', category: 'display', icon: 'tooltip' },
  { name: 'Carousel', category: 'display', icon: 'carousel' },
  { name: 'Spoiler', category: 'display', icon: 'spoiler', description: 'Hides content until clicked' },

  // Typography Components
  { name: 'CodeBlock', category: 'typography', icon: 'code' },
  { name: 'CopyButton', category: 'typography', icon: 'copy', description: 'Utility to copy content to clipboard with feedback' },
  { name: 'KeyCap', category: 'typography', icon: 'keycap', description: 'Display keyboard shortcuts with press animations' },
  { name: 'SyntaxHighlighter', category: 'typography', icon: 'code' },
  { name: 'Text', category: 'typography', icon: 'text' },
  { name: 'GradientText', category: 'typography', icon: 'text', description: 'Text component with gradient color support' },
  { name: 'ShimmerText', category: 'typography', icon: 'text', description: 'Animated shimmering text placeholder for loading states' },
  { name: 'Icon', category: 'typography', icon: 'star' },
  { name: 'BrandIcon', category: 'typography', icon: 'star', description: 'Brand icons for popular platforms (e.g. Apple, Google, Facebook, etc.) with built-in dark mode support.'},
  { name: 'Title', category: 'typography', icon: 'title', description: 'Semantic heading component with size & level mapping' },

  // data display
  { name: 'Indicator', category: 'data', icon: 'indicator', description: 'Status indicator dot with color and size options' },
  { name: 'Chip', category: 'data', icon: 'chip' },
  { name: 'Badge', category: 'data', icon: 'badge', description: 'Small status or counter indicator positioned on a parent element' },
  { name: 'Table', category: 'display', icon: 'table' },
  { name: 'DataTable', category: 'data', icon: 'datatable', description: 'Data grid with sorting, filtering, and pagination' },
  { name: 'QRCode', category: 'data', icon: 'qrcode' },
  // { name: 'Gauge', category: 'data', icon: 'chart-donut' }, // change this to semicircal progress?
  { name: 'Markdown', category: 'data', icon: 'markdown' },
  { name: 'Rating', category: 'data', icon: 'rating' },
  { name: 'Timeline', category: 'data', icon: 'timeline', description: 'Display sequence of events in chronological order' },

  // Layout Components
  { name: 'Block', category: 'layout', icon: 'block' },
  { name: 'Card', category: 'display', icon: 'card' },
  { name: 'HoverCard', category: 'display', icon: 'tooltip', description: 'Contextual popup card on hover or focus' },
  { name: 'Flex', category: 'layout', icon: 'flex' },
  { name: 'Grid', category: 'layout', icon: 'grid' },
  { name: 'Masonry', category: 'layout', icon: 'masonry', description: 'Pinterest-style masonry layout with FlashList performance' },
  { name: 'Container', category: 'layout', icon: 'container' },
  { name: 'AppShell', category: 'layout', icon: 'home' },
  { name: 'Divider', category: 'layout', icon: 'divider' },
  { name: 'Space', category: 'layout', icon: 'paddingFrame' },
  { name: 'Tabs', category: 'layout', icon: 'tabs' },
  { name: 'TableOfContents', category: 'navigation', icon: 'tableofcontents', description: 'Auto-generated document outline with anchor navigation' },
  { name: 'SegmentedControl', category: 'layout', icon: 'splitTrack' },

  // Feedback Components 
  { name: 'Alert', category: 'feedback', icon: 'bell' },
  { name: 'Blockquote', category: 'typography', icon: 'quote', description: 'Stylized blockquote for highlighting quotes or important text' },
  { name: 'Dialog', category: 'feedback', icon: 'dialog' },
  { name: 'ToastProvider', category: 'feedback', icon: 'bell', description: 'Global notification system with positioning and queuing' },
  { name: 'Toast', category: 'feedback', icon: 'toast' },
  { name: 'Progress', category: 'feedback', icon: 'progress' },
  { name: 'Loader', category: 'feedback', icon: 'loader' },
  { name: 'Skeleton', category: 'feedback', icon: 'bone' },
  { name: 'Overlay', category: 'feedback', icon: 'layer-mask', description: 'Dimmed overlay backdrop for modals and popups' },
  { name: 'LoadingOverlay', category: 'feedback', icon: 'progress-shield', description: 'Overlay with centered loader for pending operations' },

  // Navigation Components
  { name: 'Accordion', category: 'navigation', icon: 'accordion' },
  { name: 'Link', category: 'navigation', icon: 'link' },
  { name: 'Menu', category: 'navigation', icon: 'menu' },
  { name: 'Breadcrumbs', category: 'navigation', icon: 'breadcrumbs' },
  { name: 'Pagination', category: 'navigation', icon: 'pagination' },
  { name: 'Stepper', category: 'navigation', icon: 'stepper', description: 'Step-by-step navigation component for multi-step processes' },
  { name: 'MenuItemButton', category: 'navigation', icon: 'menu', description: 'Actionable menu list item with consistent styling' },
  { name: 'NavigationProgress', category: 'navigation', icon: 'progress', description: 'Progress indicator tied to navigation or scroll position' },
  { name: 'Spotlight', category: 'navigation', icon: 'spotlight', description: 'Command palette / global action search interface' },
  { name: 'Tree', category: 'navigation', icon: 'tree', description: 'Hierarchical tree view with expansion, selection, checkboxes, and filtering' },

  // Form Components
  { name: 'LoginForm', category: 'form', icon: 'user' },
  { name: 'SignupForm', category: 'form', icon: 'user' },
  { name: 'ContactForm', category: 'form', icon: 'mail' },
  { name: 'ForgotPasswordForm', category: 'form', icon: 'settings' },
  { name: 'Form', category: 'form', icon: 'form', description: 'Declarative form system with validation and layout primitives' },

  // Charts
  { name: 'AreaChart', category: 'charts', icon: 'chart-area' },
  { name: 'BarChart', category: 'charts', icon: 'chart-bar' },
  { name: 'BubbleChart', category: 'charts', icon: 'chart-scatter' },
  { name: 'CandlestickChart', category: 'charts', icon: 'chart-line' },
  { name: 'ComboChart', category: 'charts', icon: 'chart-line' },
  { name: 'DonutChart', category: 'charts', icon: 'chart-donut' },
  { name: 'FunnelChart', category: 'charts', icon: 'funnel' },
  { name: 'GaugeChart', category: 'charts', icon: 'speedometer', description: 'Radial gauge visualization with ranges, ticks, and animated needle' },
  { name: 'GroupedBarChart', category: 'charts', icon: 'chart-bar' },
  { name: 'HeatmapChart', category: 'charts', icon: 'chart-heatmap' },
  { name: 'HistogramChart', category: 'charts', icon: 'chart-bar' },
  { name: 'LineChart', category: 'charts', icon: 'chart-line' },
  { name: 'NetworkChart', category: 'charts', icon: 'tree' },
  { name: 'PieChart', category: 'charts', icon: 'chart-pie' },
  { name: 'RadarChart', category: 'charts', icon: 'chart-line' },
  { name: 'RadialBarChart', category: 'charts', icon: 'chart-donut' },
  { name: 'RidgeChart', category: 'charts', icon: 'chart-area' },
  { name: 'SankeyChart', category: 'charts', icon: 'chart-line' },
  { name: 'ScatterChart', category: 'charts', icon: 'chart-scatter' },
  { name: 'SparklineChart', category: 'charts', icon: 'waveform' },
  { name: 'StackedAreaChart', category: 'charts', icon: 'chart-area' },
  { name: 'StackedBarChart', category: 'charts', icon: 'chart-bar' },
  { name: 'ViolinChart', category: 'charts', icon: 'chart-area' },

  // Media Components
  { name: 'Image', category: 'media', icon: 'image', description: 'Basic image component with optional caption and overlay' },
  { name: 'Gallery', category: 'media', icon: 'gallery', description: 'A fullscreen image viewer with navigation, thumbnails, and metadata display' },
  { name: 'Video', category: 'media', icon: 'play', description: 'Video player for YouTube, MP4, and other formats with timeline synchronization' },
  { name: 'Waveform', category: 'media', icon: 'waveform', description: 'Audio waveform visualization component' },
  { name: 'Lottie', category: 'media', icon: 'carousel', description: 'Render and control Lottie animations from JSON data' },

  // Others
  { name: 'Can', category: 'others', icon: 'lock', description: 'Conditional rendering based on user permissions and abilities' },
];

/**
 * Get the configuration for a core component
 */
export function getCoreComponentConfig(componentName: string): CoreComponentConfig | undefined {
  return CORE_COMPONENTS.find(component => component.name === componentName);
}

/**
 * Check if a component is a core component
 */
export function isCoreComponent(componentName: string): boolean {
  return CORE_COMPONENTS.some(component => component.name === componentName);
}

/**
 * Get all core component names
 */
export function getCoreComponentNames(): string[] {
  return CORE_COMPONENTS.map(component => component.name);
}

/**
 * Get core components by category
 */
export function getCoreComponentsByCategory(): Record<string, CoreComponentConfig[]> {
  return CORE_COMPONENTS.reduce((acc, component) => {
    if (!acc[component.category]) {
      acc[component.category] = [];
    }
    acc[component.category].push(component);
    return acc;
  }, {} as Record<string, CoreComponentConfig[]>);
}

/**
 * Get all unique categories from core components in the desired order
 */
export function getCoreCategories(): string[] {
  // Define the desired order of categories
  const categoryOrder: CoreComponentConfig['category'][] = ['charts', 'data', 'input', 'display', 'feedback', 'layout', 'navigation', 'typography', 'media', 'dates', 'others'];

  // Get all categories that actually exist in the components
  const existingCategories = new Set(CORE_COMPONENTS.map(component => component.category));

  // Return categories in the specified order, but only include those that have components
  return categoryOrder.filter(category => existingCategories.has(category));
}

/**
 * Map component categories to colors
 */
export const CATEGORY_COLORS: Record<string, 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'gray'> = {
  charts: 'primary',
  data: 'secondary',
  input: 'success',
  display: 'warning',
  feedback: 'error',
  layout: 'gray',
  navigation: 'primary',
  typography: 'secondary',
  form: 'success',
  media: 'warning',
  others: 'gray',
};

/**
 * Map component categories to fallback icons
 */
export const CATEGORY_ICONS: Record<string, string> = {
  charts: 'chart-bar',
  data: 'database',
  input: 'plus',
  display: 'star',
  feedback: 'bell',
  layout: 'menu',
  navigation: 'arrow-right',
  typography: 'font',
  form: 'search',
  media: 'image',
  others: 'ellipsis-h',
};
