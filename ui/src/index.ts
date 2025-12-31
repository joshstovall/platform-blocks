/*
 * Tree-shaking optimized index file
 * 
 * This file provides granular exports to enable better tree-shaking.
 * Components are exported with explicit named exports to help bundlers
 * eliminate unused code.
 */

// =============================================================================
// CORE SYSTEM EXPORTS
// =============================================================================

// Theme & Provider
export { PlatformBlocksProvider } from './core/theme/PlatformBlocksProvider';
export { HapticsProvider, useHapticsSettings } from './core/haptics/HapticsProvider';
export { useTheme } from './core/theme/ThemeProvider';
export { ThemeModeProvider, useThemeMode, type ThemeModeConfig, type ColorSchemeMode } from './core/theme/ThemeModeProvider';
export { createTheme } from './core/theme/utils';
export { DEFAULT_THEME } from './core/theme/defaultTheme';
export { DARK_THEME } from './core/theme/darkTheme';
export { useColorScheme } from './core/theme/useColorScheme';
export { I18nProvider, useI18n } from './core/i18n';
export { OverlayProvider, useOverlay, useOverlayApi, useOverlays } from './core/providers/OverlayProvider';
export { DirectionProvider, useDirection, useDirectionSafe } from './core/providers/DirectionProvider';
export type { Direction, DirectionContextValue, DirectionProviderProps, StorageController } from './core/providers/DirectionProvider';
export { KeyboardManagerProvider, useKeyboardManager, useKeyboardManagerOptional } from './core/providers/KeyboardManagerProvider';
export type { KeyboardManagerProviderProps, KeyboardManagerContextValue } from './core/providers/KeyboardManagerProvider';
export { AccessibilityProvider, useAccessibility } from './core/accessibility/context';
export { SoundProvider, useSound, useHaptics, getAllSounds, getSoundsByCategory, createSound, DEFAULT_SOUND_IDS } from './core/sound';
export type { SoundAsset, SoundOptions, HapticFeedbackOptions } from './core/sound';
export { factory, polymorphicFactory } from './core/factory';

// Contexts
export {
  TitleRegistryProvider,
  useTitleRegistry,
  useTitleRegistryOptional,
  type TitleItem
} from './hooks/useTitleRegistration/contexts';

// Core utilities (separate exports for better tree-shaking)
export {
  rem,
  px,
  getSize,
  getFontSize,
  getRadius,
  getShadow,
  getColor,
  debounce,
  throttle,
  measurePerformance,
  measureAsyncPerformance,
  calculateOverlayPositionEnhanced,
  getViewport,
  measureElement,
  pointInRect,
  getScrollPosition,
  clearOverlayPositionCache,
  type Rect,
  type Viewport,
  type PositionResult,
  type PlacementType,
  type PositioningOptions,
} from './core/utils';

export {
  usePopoverPositioning,
  useTooltipPositioning,
  type UsePopoverPositioningOptions,
  type UsePopoverPositioningReturn,
} from './core/hooks/usePopoverPositioning';

export {
  useDropdownPositioning,
  type UseDropdownPositioningOptions,
  type UseDropdownPositioningReturn,
} from './core/hooks/useDropdownPositioning';

// Size system (granular exports)
export {
  resolveSize,
  getIconSize,
  getHeight,
  getSpacing,
  getLineHeight,
  COMPONENT_SIZES,
  SIZE_SCALES,
} from './core/theme/sizes';

// Breakpoints
export { DEFAULT_BREAKPOINTS, resolveResponsiveProp } from './core/theme/breakpoints';

// Hooks (individual exports for better tree-shaking)
export {
  useHotkeys,
  useGlobalHotkeys,
  useEscapeKey,
  useToggleColorScheme,
  useSpotlightToggle,
  globalHotkeys,
} from './hooks';

// =============================================================================
// COMPONENT EXPORTS (organized by category for better mental model)
// =============================================================================

// Layout Components
export { KeyboardAwareLayout } from './components/KeyboardAwareLayout';
export { Flex } from './components/Flex';
export { Grid, GridItem } from './components/Grid';
export { Masonry } from './components/Masonry';
export {
  AppShell,
  useAppShell,
  useAppShellApi,
  useAppShellLayout,
  AppShellHeader,
  AppShellNavbar,
  AppShellAside,
  AppShellFooter,
  AppShellBottomNav,
  AppShellMain,
  AppShellSection,
  BottomAppBar,
  StatusBarManager,
  useBreakpoint,
  useNavbarHover,
  resolveResponsiveValue,
  defineAppLayout,
  AppLayoutProvider,
  AppLayoutRenderer,
  useAppLayoutContext
} from './components/AppShell';
export { Row, Column } from './components/Layout';

// Text & Typography
export { Text, H1, H2, H3, H4, H5, H6, P, Small, Strong, Bold, Italic, Emphasis, Underline, Code, Kbd, Mark, Cite, Sub, Sup } from './components/Text';
export { ShimmerText } from './components/ShimmerText';
export { Highlight } from './components/Highlight';
export { Title, Heading1, Heading2, Heading3, Heading4, Heading5, Heading6 } from './components/Title';
export { Markdown } from './components/Markdown';

// Form Components
export { Button } from './components/Button';
export { BrandButton } from './components/BrandButton';
export {
  AppStoreButton,
  GooglePlayButton,
  AppleAppStoreButton,
  MacAppStoreButton,
  MicrosoftStoreButton,
  AmazonAppstoreButton,
  FDroidButton
} from './components/AppStoreButton';
export {
  AppStoreBadge,
  AppStoreDownloadBadge,
  GalaxyStoreDownloadBadge,
  GooglePlayDownloadBadge,
  HuaweiAppGalleryBadge,
  AmazonAppstoreBadge,
  MicrosoftStoreDownloadBadge,
  SpotifyListenBadge,
  ApplePodcastsListenBadge,
  YouTubeWatchBadge,
  YouTubeMusicListenBadge,
  AppleMusicListenBadge,
  AmazonMusicListenBadge,
  SoundCloudListenBadge,
  AmazonStoreBadge,
  AmazonPrimeVideoBadge,
  TwitchWatchBadge,
  GitHubViewBadge,
  DiscordJoinBadge,
  RedditJoinBadge,
  TikTokWatchBadge,
  ChromeWebStoreBadge,
} from './components/AppStoreBadge';
export { Input, PasswordInput, TextInputBase } from './components/Input';
export { TextArea } from './components/TextArea';
export { NumberInput } from './components/NumberInput';
export { PinInput } from './components/PinInput';
export { Checkbox } from './components/Checkbox';
export { Radio, RadioGroup } from './components/Radio';
export { Switch } from './components/Switch';
export { ToggleButton, ToggleGroup } from './components/Toggle';
export { ToggleBar } from './components/Toggle';
export { SegmentedControl } from './components/SegmentedControl';
export { Slider, RangeSlider } from './components/Slider';
export { Knob } from './components/Knob';
export { Search } from './components/Search';
export { Select } from './components/Select';
export { AutoComplete } from './components/AutoComplete';
export { FileInput } from './components/FileInput';
export { DatePicker, Calendar, MiniCalendar, Month, Day } from './components/DatePicker';
export { MonthPicker } from './components/MonthPicker';
export { YearPicker } from './components/YearPicker';
export { DatePickerInput } from './components/DatePickerInput';
export { MonthPickerInput } from './components/MonthPickerInput';
export { YearPickerInput } from './components/YearPickerInput';
export { TimePicker } from './components/TimePicker';
export { TimePickerInput } from './components/TimePickerInput';
export { PhoneInput } from './components/PhoneInput';
export { ColorPicker } from './components/ColorPicker';
export { ColorSwatch } from './components/ColorSwatch';
export { EmojiPicker } from './components/EmojiPicker';
export { RichTextEditor } from './components/RichTextEditor';
export { Rating } from './components/Rating';
export { Form, useFormContext, useOptionalFormContext } from './components/Form';

// Navigation Components
export { Breadcrumbs } from './components/Breadcrumbs';
export { Menu, MenuItem, MenuLabel, MenuDivider, MenuDropdown } from './components/Menu';
export { MenuItemButton } from './components/MenuItemButton';
export { Tabs } from './components/Tabs';
export { Pagination } from './components/Pagination';
export { Stepper } from './components/Stepper';

// Data Display
export { Avatar, AvatarGroup } from './components/Avatar';
export { Badge } from './components/Badge';
export { Blockquote } from './components/Blockquote';
export * from './components/Indicator';
export { Block } from './components/Block';
export { Card } from './components/Card';
export { Chip } from './components/Chip';
export { DataTable } from './components/DataTable';
export { Disclaimer, ComponentWithDisclaimer, useDisclaimer, withDisclaimer, extractDisclaimerProps } from './components/_internal/Disclaimer';
export { Table } from './components/Table';
export { Timeline } from './components/Timeline';
export { ListGroup, ListGroupItem, ListGroupDivider, ListGroupBody } from './components/ListGroup';
export { TableOfContents } from './components/TableOfContents';
export { Tree } from './components/Tree';

// Feedback Components
export { Notice } from './components/Notice';
export { Progress } from './components/Progress';
export { Skeleton } from './components/Skeleton';
export { Loader } from './components/Loader';
export { Gauge } from './components/Gauge';
export { Ring } from './components/Ring';
export {
  Toast,
  ToastProvider, useToast,
  useToastApi,
  onToastsRequested


} from './components/Toast';

// Overlay Components
export { Dialog, DialogProvider, DialogRenderer, useDialog, useDialogApi, useDialogs, useSimpleDialog, onDialogsRequested } from './components/Dialog';
export { Tooltip } from './components/Tooltip';
export { Overlay } from './components/Overlay';
export { LoadingOverlay } from './components/LoadingOverlay';
export { ContextMenu } from './components/ContextMenu';
export { Popover } from './components/Popover';
export {
  Spotlight,
  SpotlightProvider,
  useSpotlightStore,
  spotlight,
  createSpotlightStore,
  useSpotlightStoreInstance,
  useDirectSpotlightState,
  directSpotlight,
  onSpotlightRequested
} from './components/Spotlight';
export { FloatingActions } from './components/FloatingActions';

// Permission Components


// Media Components
export { Icon } from './components';
export { IconButton } from './components/IconButton';
export { Image } from './components/Image';
export { BrandIcon } from './components/BrandIcon';
export { Carousel } from './components/Carousel';
export { Gallery } from './components/Gallery';
export { Lottie } from './components/Lottie';
export { Video } from './components/Video';
export { Waveform } from './components/Waveform';

// Utility Components
export { Collapse } from './components/Collapse';
export { Divider } from './components/Divider';
export { Space } from './components/Space';
export { Link } from './components/Link';
export { CodeBlock } from './components/CodeBlock';
export { CopyButton } from './components/CopyButton/CopyButton';
export { QRCode } from './components/QRCode';
export { KeyCap } from './components/KeyCap';
export { Spoiler } from './components/Spoiler';
export { PressAnimation, withPressAnimation, AnimatedPressable } from './components/_internal/PressAnimation/PressAnimation';

// Specialized Components
export { Accordion } from './components/Accordion';
// =============================================================================
// TYPE EXPORTS (grouped for clarity)
// =============================================================================

// Core types
export type { PlatformBlocksTheme, PlatformBlocksThemeOverride } from './core/theme/types';
export type { PlatformBlocksProviderProps } from './core/theme/PlatformBlocksProvider';
export type { ColorScheme } from './core/theme/useColorScheme';
export type { SizeValue } from './core/theme/sizes';
export {
  COMPONENT_SIZE_ORDER,
  DEFAULT_COMPONENT_SIZE,
  clampComponentSize,
  resolveComponentSize,
} from './core/theme/componentSize';
export type {
  ComponentSize,
  ComponentSizeValue,
} from './core/theme/componentSize';
export type { SizeToken } from './core/theme/types';
export type { ResponsiveProp } from './core/theme/breakpoints';
export type { HotkeyItem, KeyboardModifiers } from './hooks';

// Component props types (exported alongside components for co-location)
export type { ButtonProps } from './components/Button';
export type { BrandButtonProps } from './components/BrandButton';
export type { AppStoreButtonProps } from './components/AppStoreButton';
export type { AppStoreBadgeProps, AppStoreBadgeSize, SupportedLocale, BadgeConfig } from './components/AppStoreBadge';
export type { TreeProps, TreeNode } from './components/Tree';
export type { TextProps } from './components/Text';
export type { ShimmerTextProps } from './components/ShimmerText';
export type { HighlightProps } from './components/Highlight';
export type { OverlayProps } from './components/Overlay';
export type { TitleProps } from './components/Title/types';
export type { KeyboardAwareLayoutProps } from './components/KeyboardAwareLayout';
export type { FlexProps } from './components/Flex';
export type { GridProps, GridItemProps } from './components/Grid';
export type { MasonryProps, MasonryItem } from './components/Masonry';
export type { InputProps, PasswordInputProps } from './components/Input';
export type { NumberInputProps } from './components/NumberInput';
export type { PinInputProps } from './components/PinInput';
export type { CheckboxProps } from './components/Checkbox';
export type { RadioProps, RadioGroupProps } from './components/Radio';
export type { SwitchProps } from './components/Switch';
export type { ToggleButtonProps, ToggleGroupProps } from './components/Toggle';
export type { ToggleBarProps, ToggleBarOption } from './components/Toggle/ToggleBar';
export type { SegmentedControlProps, SegmentedControlItem, SegmentedControlData } from './components/SegmentedControl';
export type { SliderProps, RangeSliderProps } from './components/Slider';
export type { KnobProps, KnobMark } from './components/Knob';
export type { SearchProps } from './components/Search';
export type { SelectProps } from './components/Select';
export type { AutoCompleteProps } from './components/AutoComplete';
export type { FileInputProps, FileInputFile } from './components/FileInput';
export type { DatePickerProps, CalendarProps, MiniCalendarProps } from './components/DatePicker';
export type { MonthPickerProps } from './components/MonthPicker';
export type { YearPickerProps } from './components/YearPicker';
export type { DatePickerInputProps } from './components/DatePickerInput';
export type { MonthPickerInputProps } from './components/MonthPickerInput';
export type { YearPickerInputProps } from './components/YearPickerInput';
export type { TimePickerProps, TimePickerValue } from './components/TimePicker/types';
export type { TimePickerInputProps } from './components/TimePickerInput';
export type { PhoneInputProps } from './components/PhoneInput';
export type { ColorPickerProps } from './components/ColorPicker';
export type { EmojiPickerProps } from './components/EmojiPicker';
export type { RichTextEditorProps, RichTextEditorContent, RichTextEditorFormat, RichTextEditorSelection } from './components/RichTextEditor';
export type { RatingProps } from './components/Rating';
export type { FormProps } from './components/Form';
export type { BreadcrumbsProps } from './components/Breadcrumbs';
export type { MenuProps, MenuItemProps } from './components/Menu';
export type { TabsProps, TabItem } from './components/Tabs';
export type { PaginationProps } from './components/Pagination';
export type { StepperProps } from './components/Stepper';
export type { AvatarProps, AvatarGroupProps } from './components/Avatar';
export type { BadgeProps } from './components/Badge';
export type { IndicatorProps } from './components/Indicator';
export type { CardProps } from './components/Card';
export type { ChipProps } from './components/Chip';
export type { DataTableProps, DataTableColumn, DataTableSort, DataTablePagination } from './components/DataTable';
export type { DisclaimerProps, WithDisclaimerProps, ComponentWithDisclaimerProps, DisclaimerSupport } from './components/_internal/Disclaimer';
export type { TableProps } from './components/Table';
export type { TimelineProps } from './components/Timeline';
export type { TableOfContentsProps } from './components/TableOfContents';
export type { NoticeProps } from './components/Notice';
export type { ProgressProps } from './components/Progress';
export type { SkeletonProps } from './components/Skeleton';
export type { LoaderProps } from './components/Loader';
export type { LoadingOverlayProps } from './components/LoadingOverlay';
export type { GaugeProps } from './components/Gauge';
export type { RingProps, RingColorStop, RingRenderContext } from './components/Ring';
export type { ToastProps } from './components/Toast';
export type { DialogProps, DialogConfig, UseSimpleDialogOptions } from './components/Dialog';
export type { TooltipProps } from './components/Tooltip';
export type { ContextMenuProps } from './components/ContextMenu';
export type { PopoverProps, PopoverTargetProps, PopoverDropdownProps } from './components/Popover';
export type { SpotlightProps } from './components/Spotlight';

export type { BrandIconProps, BrandName } from './components/BrandIcon';
export type { CollapseProps } from './components/Collapse';
export type { IconButtonProps } from './components/IconButton';
export type { CarouselProps } from './components/Carousel';
export type { GalleryProps, GalleryItem } from './components/Gallery';
export type { ImageProps } from './components/Image';
export type { LottieProps } from './components/Lottie';
export type { WaveformProps } from './components/Waveform';
export type { DividerProps } from './components/Divider';
export type { SpaceProps } from './components/Space';
export type { LinkProps } from './components/Link';
export type { CodeBlockProps } from './components/CodeBlock';
export type { CopyButtonProps } from './components/CopyButton/types';
export type { QRCodeProps } from './components/QRCode';
export type { KeyCapProps } from './components/KeyCap';
export type { SpoilerProps } from './components/Spoiler';
export type { FloatingActionsProps, FloatingActionItem } from './components/FloatingActions';
export type { PressAnimationProps } from './components/_internal/PressAnimation/PressAnimation';
export type { AccordionProps } from './components/Accordion';
export type { MarkdownProps, MarkdownComponentMap } from './components/Markdown';
export type { AppShellProps } from './components/AppShell';
export type { AppShellBottomNavProps, BottomAppBarItem } from './components/AppShell';
export type {
  AppLayoutBlueprint,
  AppLayoutRuntimeContext,
  AppLayoutRuntimeOverrides,
  LayoutEntry,
  LayoutComponentEntry,
  LayoutNavbarConfig,
  LayoutAsideConfig,
  LayoutFooterConfig,
  LayoutBottomNavConfig,
  LayoutMainConfig,
  LayoutOptions,
  LayoutSection,
} from './components/AppShell';
