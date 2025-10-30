// Component exports
export { Alert } from './Alert';
export { AppShell } from './AppShell';
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
} from './AppStoreBadge';
export { AudioPlayer } from './AudioPlayer';
export { Avatar, AvatarGroup } from './Avatar';
export { BrandButton } from './BrandButton';
export { Block } from './Block';
export { Breadcrumbs } from './Breadcrumbs';
export { Button } from './Button';
export { Card } from './Card';
export { Carousel } from './Carousel';
export { Checkbox } from './Checkbox';
export { Chip } from './Chip';
export { CodeBlock } from './CodeBlock';
export { CopyButton } from './CopyButton/CopyButton';
export { ColorPicker } from './ColorPicker';
export { Container } from './Container';
export { DataTable } from './DataTable';
export { Disclaimer, ComponentWithDisclaimer, useDisclaimer, withDisclaimer, extractDisclaimerProps } from './Disclaimer';
export { Dialog, DialogProvider, DialogRenderer, useDialog, useSimpleDialog } from './Dialog';
export { Divider } from './Divider';
export { Space } from './Space';
export { Flex } from './Flex';
export { Grid } from './Grid';
export { Tree } from './Tree';
export { Waveform } from './Waveform';
export { TimePicker } from './TimePicker/TimePicker';
export { TimePickerInput } from './TimePickerInput';
export { Icon } from './Icon';
export { IconButton } from './IconButton';
export { Image } from './Image';
export { BrandIcon } from './BrandIcon';
export { Input, PasswordInput, TextInputBase } from './Input';
export { TextArea } from './TextArea';
export { Overlay } from './Overlay';
export { KeyCap } from './KeyCap';
export { Link } from './Link';
export { Menu, MenuItem, MenuLabel, MenuDivider, MenuDropdown } from './Menu';
export { MenuItemButton } from './MenuItemButton';
export { NumberInput } from './NumberInput';
export { DatePicker, Calendar, Month, Day } from './DatePicker';
export { MonthPicker } from './MonthPicker';
export { YearPicker } from './YearPicker';
export { DatePickerInput } from './DatePickerInput';
export { MonthPickerInput } from './MonthPickerInput';
export { YearPickerInput } from './YearPickerInput';
export { Pagination } from './Pagination';
export { PinInput } from './PinInput';
export { Slider, RangeSlider } from './Slider';
export { AutoComplete } from './AutoComplete';
export { FileInput } from './FileInput';
export { RichTextEditor } from './RichTextEditor';
export { Form } from './Form';
export { FormLayout, FormSection, FormGroup, FormField } from './FormLayout';
export { Row, Column } from './Layout';
// export { NavigationContainer, createStackNavigator, createDrawerNavigator, Screen } from './Navigation';
export { ToastProvider, useToast, useToastApi, toast } from './Toast';
export { Progress } from './Progress';
export { QRCode } from './QRCode';
export { NavigationProgress, navigationProgress } from './NavigationProgress';
export { Radio, RadioGroup } from './Radio';
export { Rating } from './Rating';
export { Reveal } from './Reveal';
export { Skeleton } from './Skeleton';
export { Loader } from './Loader';
export { LoadingOverlay } from './LoadingOverlay';
export {
  Spotlight,
  SpotlightProvider,
  useSpotlightStore,
  spotlight,
  createSpotlightStore,
  useSpotlightStoreInstance,
  onSpotlightRequested
} from './Spotlight';
export { Stepper } from './Stepper';
export { Switch } from './Switch';
export { Table } from './Table';
export { Text } from './Text';
export { Timeline } from './Timeline';
export { Toast } from './Toast';
export { ToggleButton, ToggleGroup } from './Toggle';
export { Tooltip } from './Tooltip';
export { Tabs } from './Tabs';
export { Accordion } from './Accordion';
export { Gauge } from './Gauge';
export { GradientText } from './GradientText';
export { ShimmerText } from './ShimmerText';
export { Title } from './Title/Title';
export { TableOfContents } from './TableOfContents/TableOfContents';
export { HoverCard } from './HoverCard/HoverCard';
export { ContextMenu } from './ContextMenu';

// Media Components
export { Gallery } from './Gallery';

// Charts
// Charts (re-exported from external package). Avoid duplicate identifiers by not re-declaring in types below.
// TODO: Fix Charts library build issue
// export { BarChart, PieChart, LineChart, ScatterChart, AreaChart, StackedAreaChart, CandlestickChart, StackedBarChart, GroupedBarChart, ChartContainer, ChartTitle, ChartLegend, ChartGrid, Axis, ChartRoot, ChartPlot, ChartLayer } from '@platform-blocks/charts';

// Export types
export type { AlertProps } from './Alert';
export type { AppShellProps } from './AppShell';
export type { AppStoreBadgeProps, AppStoreBadgeSize, SupportedLocale, BadgeConfig } from './AppStoreBadge';
export type { AvatarProps, AvatarGroupProps } from './Avatar';
export type { BrandButtonProps } from './BrandButton';
export type { BreadcrumbsProps, BreadcrumbItem } from './Breadcrumbs';
export { Search } from './Search/Search';
export { SegmentedControl } from './SegmentedControl';
export type { ButtonProps } from './Button';
export type { CardProps } from './Card';
export type { CarouselProps } from './Carousel';
export type { CheckboxProps } from './Checkbox';
export type { ChipProps } from './Chip';
export type { CodeBlockProps } from './CodeBlock/types';
export type { CopyButtonProps } from './CopyButton/types';
export type { ColorPickerProps } from './ColorPicker';
export type { ContainerProps } from './Container';
export type { DialogProps, DialogConfig, UseSimpleDialogOptions } from './Dialog';
export type { DividerProps } from './Divider';
export type { SpaceProps } from './Space';
export type { FlexProps } from './Flex';
export type { GridProps } from './Grid';
export type { GradientTextProps } from './GradientText';
export type { ShimmerTextProps } from './ShimmerText';
export type { TreeProps, TreeNode } from './Tree/Tree';
export type { TimePickerProps, TimePickerValue } from './TimePicker/types';
export type { IconProps, IconSize, IconVariant, IconDefinition, IconRegistry } from './Icon';
export type { IconButtonProps } from './IconButton';
export type { ImageProps } from './Image';
export type { OverlayProps } from './Overlay';
export type { InputProps, PasswordInputProps, BaseInputProps, ValidationRule } from './Input';
export type { LinkProps } from './Link';
export type { 
  MenuProps, 
  MenuItemProps, 
  MenuLabelProps, 
  MenuDividerProps, 
  MenuDropdownProps 
} from './Menu';
export type { MenuItemButtonProps } from './MenuItemButton';
export type { NumberInputProps } from './NumberInput';
export type {
  DatePickerProps,
  CalendarProps,
  MonthProps,
  DayProps,
  CalendarLevel,
  CalendarType,
} from './DatePicker';
export type { MonthPickerProps } from './MonthPicker';
export type { YearPickerProps } from './YearPicker';
export type { DatePickerInputProps } from './DatePickerInput';
export type { MonthPickerInputProps } from './MonthPickerInput';
export type { YearPickerInputProps } from './YearPickerInput';
export type { TimePickerInputProps } from './TimePickerInput';
export type { PaginationProps } from './Pagination';
export type { PinInputProps } from './PinInput';
export type { SliderProps, RangeSliderProps } from './Slider';
export type { AutoCompleteProps, AutoCompleteOption } from './AutoComplete';
export type { FileInputProps, FileInputFile } from './FileInput';
export type { RichTextEditorProps, RichTextEditorContent, RichTextEditorFormat, RichTextEditorSelection } from './RichTextEditor';
export type { FormProps, FormFieldProps, FormInputProps, FormLabelProps, FormErrorProps, FormSubmitProps } from './Form';
export type { RowProps, ColumnProps } from './Layout';
export type { ToastOptions, ToastPosition } from './Toast';
export type { ProgressProps } from './Progress';
export type { QRCodeProps } from './QRCode';
export type { RadioProps, RadioGroupProps } from './Radio';
export type { RatingProps } from './Rating';
export type { SkeletonProps } from './Skeleton';
export type { LoaderProps } from './Loader';
export type { LoadingOverlayProps } from './LoadingOverlay';
export type { 
  SpotlightProps, 
  SpotlightActionData, 
  SpotlightActionGroupData, 
  SpotlightItem,
  SpotlightState,
  SpotlightStore 
} from './Spotlight';

export type { SwitchProps } from './Switch';
export type { TableProps } from './Table';
export type { DataTableProps, DataTableColumn, DataTableFilter, DataTableSort, DataTablePagination } from './DataTable';
export type { DisclaimerProps, WithDisclaimerProps, ComponentWithDisclaimerProps, DisclaimerSupport } from './Disclaimer';
export type { TextProps } from './Text';
export type { ToastProps } from './Toast';
export type { TooltipProps, TooltipPositionType } from './Tooltip';
export type { TabsProps, TabItem } from './Tabs';
export type { AccordionProps } from './Accordion';
export type { GaugeProps, GaugeRange, GaugeNeedle, GaugeTicks, GaugeLabels } from './Gauge';
export type { TitleProps } from './Title/types';
export type { TableOfContentsProps, TocItem } from './TableOfContents/types';
export type { StepperProps } from './Stepper';
export type { HoverCardProps } from './HoverCard/types';
export type { ContextMenuProps, ContextMenuItem } from './ContextMenu/ContextMenu';
export type { SegmentedControlProps, SegmentedControlItem, SegmentedControlData } from './SegmentedControl';


// Media Types
export type { GalleryProps, GalleryModalProps, GalleryItem } from './Gallery';

// Chart types
// Re-export chart related types via type-only import to avoid pulling charts source into this rootDir build.
// Using 'import type' then re-export preserves declaration output while avoiding duplicate value exports.
// TODO: Fix Charts library build issue
// import type {
//   BarChartProps as _BarChartProps,
//   PieChartProps as _PieChartProps,
//   LineChartProps as _LineChartProps,
//   ScatterChartProps as _ScatterChartProps,
//   ChartDataPoint as _ChartDataPoint,
//   ChartAxis as _ChartAxis,
//   ChartGrid as _ChartGrid,
//   ChartLegend as _ChartLegend,
//   ChartTooltip as _ChartTooltip,
//   ChartAnimation as _ChartAnimation,
//   ChartInteractionEvent as _ChartInteractionEvent
// } from '@platform-blocks/charts';

// TODO: Fix Charts library build issue
// export type {
//   _BarChartProps as BarChartProps,
//   _PieChartProps as PieChartProps,
//   _LineChartProps as LineChartProps,
//   _ScatterChartProps as ScatterChartProps,
//   _ChartDataPoint as ChartDataPoint,
//   _ChartAxis as ChartAxis,
//   _ChartLegend as ChartLegendType,
//   _ChartTooltip as ChartTooltip,
//   _ChartAnimation as ChartAnimation,
//   _ChartInteractionEvent as ChartInteractionEvent
// };

// Accessibility components
export * from './Accessibility/AccessibilityHelpers';
export * from './Accessibility/AccessibilityTesting';
export * from './Accessibility/AccessibilityDemo';

// Sound components
export * from './Button/SoundButton';
// export * from './Sound/SoundSystemDemo';
