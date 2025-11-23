import React, { ReactNode } from 'react';
import { Text, View } from 'react-native';

export type PlaygroundControlType = 'boolean' | 'segmented' | 'select' | 'number' | 'text' | 'color' | 'size-slider';

export interface PlaygroundControlOverride {
  controlType?: PlaygroundControlType;
  options?: string[];
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  colorPresets?: string[];
}

export interface ComponentPlaygroundConfig {
  id: string;
  component: string;
  initialProps?: Record<string, any>;
  hiddenProps?: string[];
  pinnedProps?: string[];
  controlOverrides?: Record<string, PlaygroundControlOverride | false>;
  previewWrapper?: (node: ReactNode, currentProps: Record<string, any>) => ReactNode;
}

const SIZE_TOKENS = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'];

const RADIUS_TOKENS = ['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', 'full', 'chip'];

const SPORTS_OPTIONS = [
  { label: 'Soccer', value: 'soccer' },
  { label: 'Basketball', value: 'basketball' },
  { label: 'Tennis', value: 'tennis' },
  { label: 'Baseball', value: 'baseball' },
  { label: 'Hockey', value: 'hockey' }
];

const CITY_SUGGESTIONS = [
  { label: 'New York', value: 'new-york' },
  { label: 'Tokyo', value: 'tokyo' },
  { label: 'Paris', value: 'paris' },
  { label: 'Sydney', value: 'sydney' },
  { label: 'São Paulo', value: 'sao-paulo' }
];

const PROGRESS_COLORS = ['primary', 'secondary', 'success', 'warning', 'error', 'gray'];
const KNOB_VARIANTS: Array<'level' | 'stepped' | 'endless' | 'dual' | 'status'> = ['level', 'stepped', 'endless', 'dual', 'status'];
const SLIDER_VARIANTS: Array<'horizontal' | 'vertical'> = ['horizontal', 'vertical'];
const TAB_VARIANTS: Array<'line' | 'chip' | 'card' | 'folder'> = ['line', 'chip', 'card', 'folder'];
const TAB_COLOR_OPTIONS = ['primary', 'secondary', 'gray', 'tertiary'];
const INPUT_TYPES: Array<'text' | 'password' | 'email' | 'tel' | 'number' | 'search'> = ['text', 'email', 'password', 'number', 'tel', 'search'];
const SWITCH_LABEL_POSITIONS: Array<'left' | 'right' | 'top' | 'bottom'> = ['left', 'right', 'top', 'bottom'];
const SWITCH_COLOR_OPTIONS = ['primary', 'secondary', 'success', 'warning', 'error', 'gray'];
const CARD_VARIANTS: Array<'outline' | 'filled' | 'elevated' | 'subtle' | 'ghost' | 'gradient'> = ['outline', 'filled', 'elevated', 'subtle', 'ghost', 'gradient'];
const CARD_SHADOW_OPTIONS = ['none', 'xs', 'sm', 'md', 'lg', 'xl'];
const TOOLTIP_POSITIONS: Array<'top' | 'bottom' | 'left' | 'right'> = ['top', 'bottom', 'left', 'right'];
const TOOLTIP_COLOR_OPTIONS = ['primary', 'secondary', 'success', 'warning', 'error', 'gray', 'dark'];

const TAB_PLAYGROUND_ITEMS = [
  {
    key: 'overview',
    label: 'Overview',
    subLabel: 'Mission pulse',
    content: 'Monitor crew workload and morale.'
  },
  {
    key: 'deploys',
    label: 'Deploys',
    subLabel: 'Releases',
    content: 'Track the latest launch timeline.'
  },
  {
    key: 'insights',
    label: 'Insights',
    subLabel: 'Focus',
    content: 'Surface the work that needs attention next.'
  }
];

const TOOLTIP_TARGET = React.createElement(
  View,
  {
    style: {
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 9999,
      backgroundColor: '#111826'
    }
  },
  React.createElement(Text, { style: { color: '#ffffff', fontWeight: '600' } }, 'Hover to preview')
);

const TIMELINE_EVENTS = [
  {
    key: 'design',
    title: 'Design lock',
    description: 'Finalized specs handed to build partners.',
    timestamp: '0900 UTC',
    lineVariant: 'solid' as const
  },
  {
    key: 'fabrication',
    title: 'Fabrication window',
    description: 'Composites curing under thermal watch.',
    timestamp: 'Day 2',
    lineVariant: 'dashed' as const
  },
  {
    key: 'integration',
    title: 'Systems integration',
    description: 'Payload avionics sync with platform core.',
    timestamp: 'Day 5',
    lineVariant: 'solid' as const
  },
  {
    key: 'review',
    title: 'Flight readiness review',
    description: 'Green board vote scheduled with ground.',
    timestamp: 'Day 7',
    lineVariant: 'dotted' as const
  }
];
const TIMELINE_COLOR_VARIANTS = ['primary.5', 'secondary.5', 'gray.6', 'success.5', 'warning.5', 'error.5'];

const WAVEFORM_SAMPLE = Array.from({ length: 140 }, (_, idx) => {
  const primary = Math.sin(idx / 6) * 0.7;
  const secondary = Math.sin(idx / 3.7) * 0.2;
  const composite = Math.abs(primary + secondary);
  return Number(composite.toFixed(3));
});

const WAVEFORM_COLOR_PRESETS = ['#6366f1', '#22c55e', '#f97316', '#e11d48', '#0ea5e9'];
const WAVEFORM_VARIANTS: Array<'bars' | 'line' | 'rounded' | 'gradient'> = ['bars', 'rounded', 'line', 'gradient'];

const TEXT_VARIANT_OPTIONS: Array<
  'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'p' | 'span' | 'small' | 'code' | 'body' | 'caption'
> = ['h1', 'h2', 'h3', 'h4', 'h5', 'p', 'span', 'small', 'code', 'body', 'caption'];
const TEXT_COLOR_VARIANTS = ['primary', 'secondary', 'muted', 'disabled', 'link', 'success', 'warning', 'error', 'info'];
const FONT_WEIGHT_OPTIONS = ['light', 'normal', 'medium', 'semibold', 'bold', 'black'];

const ALERT_VARIANTS: Array<'light' | 'filled' | 'outline' | 'subtle'> = ['subtle', 'filled', 'outline', 'light'];
const ALERT_COLOR_OPTIONS: Array<'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'gray'> = ['primary', 'secondary', 'success', 'warning', 'error', 'gray'];
const ALERT_SEVERITIES: Array<'info' | 'success' | 'warning' | 'error'> = ['info', 'success', 'warning', 'error'];

const AVATAR_SAMPLE_IMAGE = 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=160&q=80';
const AVATAR_COLOR_PRESETS = ['#0f172a', '#475569', '#6366f1', '#0ea5e9', '#f97316', '#f43f5e'];

const STEPPER_ORIENTATIONS: Array<'horizontal' | 'vertical'> = ['horizontal', 'vertical'];
const STEPPER_ICON_POSITIONS: Array<'left' | 'right'> = ['left', 'right'];
const STEPPER_SAMPLE_STEPS = [
  {
    key: 'brief',
    label: 'Brief crew',
    description: 'Share launch dossier and blockers.'
  },
  {
    key: 'systems',
    label: 'Systems check',
    description: 'Async diagnostics in progress.',
    loading: true
  },
  {
    key: 'integration',
    label: 'Integrate payload',
    description: 'Verify harnessing + telemetry taps.'
  },
  {
    key: 'go',
    label: 'Final go/no-go',
    description: 'All stations report readiness.'
  }
];

const SHIMMER_DIRECTIONS: Array<'ltr' | 'rtl'> = ['ltr', 'rtl'];
const SHIMMER_COLOR_PRESETS = ['#94a3b8', '#cbd5f5', '#f8fafc', '#facc15', '#38bdf8'];

const GRADIENT_DEFAULT_COLORS = ['#a855f7', '#ec4899', '#f97316'];

const LOADER_VARIANTS: Array<'bars' | 'dots' | 'oval'> = ['dots', 'bars', 'oval'];
const LOADER_COLOR_PRESETS = ['#6366f1', '#22c55e', '#0ea5e9', '#f97316', '#f43f5e'];

const COMMON_EVENT_PROPS = [
  'children',
  'style',
  'testID',
  'accessibilityLabel',
  'accessibilityHint',
  'onPress',
  'onPressIn',
  'onPressOut',
  'onLongPress',
  'onHoverIn',
  'onHoverOut',
  'onLayout',
  'onChange',
  'onChangeText',
  'onSelect',
  'onSearch',
  'onClear',
  'icon',
  'startIcon',
  'endIcon'
];

const PLAYGROUND_CONFIGS: Record<string, ComponentPlaygroundConfig> = {
  Button: {
    id: 'Button',
    component: 'Button',
    initialProps: {
      title: 'Launch mission',
      variant: 'filled',
      size: 'md',
      fullWidth: false,
      loading: false,
      disabled: false
    },
    pinnedProps: ['title', 'variant', 'size', 'fullWidth', 'loading', 'disabled', 'colorVariant', 'textColor'],
    hiddenProps: [...COMMON_EVENT_PROPS, 'tooltip', 'tooltipPosition'],
    controlOverrides: {
      variant: { controlType: 'segmented', options: ['filled', 'secondary', 'outline', 'ghost', 'gradient', 'link', 'none'] },
      size: { controlType: 'segmented', options: SIZE_TOKENS },
      colorVariant: {
        controlType: 'color',
        placeholder: 'primary.6 or #3b82f6',
        colorPresets: ['#228be6', '#845ef7', '#40c057', '#f59f00', '#e03131', '#15aabf']
      },
      textColor: {
        controlType: 'color',
        placeholder: '#FFFFFF',
        colorPresets: ['#ffffff', '#000000', '#0f172a', '#f8f9fa']
      },
      loadingTitle: { controlType: 'text', placeholder: 'Loading…' }
    }
  },
  Select: {
    id: 'Select',
    component: 'Select',
    initialProps: {
      label: 'Favorite sport',
      placeholder: 'Choose a sport',
      value: SPORTS_OPTIONS[0].value,
      options: SPORTS_OPTIONS,
      helperText: 'Local data source',
      clearable: true,
      searchable: false
    },
    pinnedProps: ['value', 'placeholder', 'size', 'fullWidth', 'disabled', 'searchable', 'clearable'],
    hiddenProps: [...COMMON_EVENT_PROPS, 'options', 'renderOption', 'renderEmptyState', 'renderLoadingState', 'data', 'renderGroupHeader'],
    controlOverrides: {
      value: { controlType: 'select', options: SPORTS_OPTIONS.map(option => option.value) },
      size: { controlType: 'segmented', options: SIZE_TOKENS }
    }
  },
  AutoComplete: {
    id: 'AutoComplete',
    component: 'AutoComplete',
    initialProps: {
      label: 'Search cities',
      placeholder: 'Start typing…',
      data: CITY_SUGGESTIONS,
      helperText: 'Suggestions update after 2 characters',
      minWidth: 280,
      clearable: true,
      showSuggestionsOnFocus: true
    },
    pinnedProps: ['placeholder', 'size', 'radius', 'disabled', 'clearable', 'multiSelect', 'allowCustomValue'],
    hiddenProps: [...COMMON_EVENT_PROPS, 'data', 'renderItem', 'renderEmptyState', 'renderLoadingState', 'value', 'selectedValues', 'textInputProps', 'selectedValuesContainerStyle', 'selectedValueChipProps', 'suggestionsStyle', 'suggestionItemStyle'],
    controlOverrides: {
      size: { controlType: 'segmented', options: SIZE_TOKENS }
    }
  },
  Knob: {
    id: 'Knob',
    component: 'Knob',
    initialProps: {
      value: 48,
      min: 0,
      max: 100,
      step: 1,
      size: 200,
      variant: 'level',
      valueLabel: {
        position: 'center',
        suffix: '%'
      }
    },
    pinnedProps: ['value', 'min', 'max', 'step', 'size', 'variant'],
    hiddenProps: [...COMMON_EVENT_PROPS, 'valueLabel', 'marks', 'tickLayers', 'panning', 'appearance', 'interaction', 'pointer', 'progress', 'renderThumb'],
    controlOverrides: {
      value: { controlType: 'number', min: 0, max: 100, step: 1 },
      size: { controlType: 'number', min: 120, max: 320, step: 10 },
      variant: { controlType: 'segmented', options: KNOB_VARIANTS }
    }
  },
  Slider: {
    id: 'Slider',
    component: 'Slider',
    initialProps: {
      label: 'Volume',
      value: 32,
      min: 0,
      max: 100,
      step: 1,
      showTicks: true,
      restrictToTicks: false,
      fullWidth: true
    },
    pinnedProps: ['value', 'min', 'max', 'step', 'disabled', 'showTicks', 'restrictToTicks', 'orientation'],
    hiddenProps: [...COMMON_EVENT_PROPS, 'ticks', 'valueLabel', 'trackColor', 'activeTrackColor', 'thumbColor', 'containerSize', 'trackSize', 'thumbSize', 'precision'],
    controlOverrides: {
      value: { controlType: 'number', min: 0, max: 100, step: 1 },
      orientation: { controlType: 'segmented', options: SLIDER_VARIANTS }
    }
  },
  Progress: {
    id: 'Progress',
    component: 'Progress',
    initialProps: {
      value: 60,
      size: 'md',
      color: 'primary',
      striped: false,
      animate: true,
      fullWidth: true
    },
    pinnedProps: ['value', 'size', 'color', 'striped', 'animate', 'fullWidth'],
    hiddenProps: [...COMMON_EVENT_PROPS, 'transitionDuration', 'radius'],
    controlOverrides: {
      value: { controlType: 'number', min: 0, max: 100, step: 5 },
      size: { controlType: 'segmented', options: SIZE_TOKENS },
      color: { controlType: 'select', options: PROGRESS_COLORS }
    }
  },
  Card: {
    id: 'Card',
    component: 'Card',
    initialProps: {
      variant: 'elevated',
      padding: 24,
      radius: 'lg',
      shadow: 'md',
      children: 'Mission briefing with highlights from the last sprint.'
    },
    pinnedProps: ['variant', 'padding', 'radius', 'shadow', 'disabled'],
    hiddenProps: [...COMMON_EVENT_PROPS, 'onContextMenu'],
    controlOverrides: {
      variant: { controlType: 'segmented', options: CARD_VARIANTS },
      padding: { controlType: 'number', min: 0, max: 48, step: 4 },
      radius: { controlType: 'select', options: RADIUS_TOKENS },
      shadow: { controlType: 'select', options: CARD_SHADOW_OPTIONS }
    }
  },
  Input: {
    id: 'Input',
    component: 'Input',
    initialProps: {
      label: 'Email address',
      placeholder: 'crew@luna.dev',
      value: 'crew@luna.dev',
      helperText: 'We will notify you about launch windows.',
      description: 'Used for weekly mission summaries.',
      size: 'md',
      type: 'email',
      clearable: true,
      required: true
    },
    pinnedProps: ['value', 'placeholder', 'type', 'size', 'disabled', 'required', 'clearable', 'multiline', 'radius'],
    hiddenProps: [...COMMON_EVENT_PROPS, 'validation', 'textInputProps', 'inputRef', 'keyboardFocusId', 'name', 'startSection', 'endSection'],
    controlOverrides: {
      type: { controlType: 'segmented', options: INPUT_TYPES },
      size: { controlType: 'segmented', options: SIZE_TOKENS },
      radius: { controlType: 'select', options: RADIUS_TOKENS }
    }
  },
  Switch: {
    id: 'Switch',
    component: 'Switch',
    initialProps: {
      label: 'Enable notifications',
      description: 'Send weekly launch recaps.',
      checked: true,
      size: 'md',
      color: 'primary',
      labelPosition: 'right',
      onLabel: 'On',
      offLabel: 'Off'
    },
    pinnedProps: ['checked', 'label', 'size', 'color', 'labelPosition', 'disabled', 'required', 'description'],
    hiddenProps: [...COMMON_EVENT_PROPS, 'controls', 'children', 'onIcon', 'offIcon'],
    controlOverrides: {
      size: { controlType: 'segmented', options: SIZE_TOKENS },
      color: { controlType: 'select', options: SWITCH_COLOR_OPTIONS },
      labelPosition: { controlType: 'segmented', options: SWITCH_LABEL_POSITIONS }
    }
  },
  Tabs: {
    id: 'Tabs',
    component: 'Tabs',
    initialProps: {
      items: TAB_PLAYGROUND_ITEMS,
      variant: 'line',
      size: 'md',
      color: 'primary',
      orientation: 'horizontal',
      location: 'start',
      scrollable: false,
      animated: true,
      tabGap: 12,
      indicatorThickness: 2
    },
    pinnedProps: ['variant', 'size', 'color', 'orientation', 'location', 'scrollable', 'animated', 'navigationOnly', 'tabGap', 'indicatorThickness'],
    hiddenProps: [...COMMON_EVENT_PROPS, 'items', 'tabStyle', 'textStyle', 'contentStyle', 'persistKey', 'autoPersist', 'children', 'disabledKeys'],
    controlOverrides: {
      variant: { controlType: 'segmented', options: TAB_VARIANTS },
      size: { controlType: 'segmented', options: SIZE_TOKENS },
      color: { controlType: 'select', options: TAB_COLOR_OPTIONS },
      orientation: { controlType: 'segmented', options: ['horizontal', 'vertical'] },
      location: { controlType: 'segmented', options: ['start', 'end'] },
      tabGap: { controlType: 'number', min: 0, max: 32, step: 2 },
      indicatorThickness: { controlType: 'number', min: 1, max: 6, step: 1 }
    }
  },
  Tooltip: {
    id: 'Tooltip',
    component: 'Tooltip',
    initialProps: {
      label: 'Share to mission control',
      position: 'top',
      withArrow: true,
      color: 'primary',
      radius: 'sm',
      offset: 8,
      multiline: true,
      width: 220,
      children: TOOLTIP_TARGET
    },
    pinnedProps: ['label', 'position', 'withArrow', 'color', 'radius', 'offset', 'multiline', 'width'],
    hiddenProps: [...COMMON_EVENT_PROPS, 'events'],
    controlOverrides: {
      position: { controlType: 'segmented', options: TOOLTIP_POSITIONS },
      color: { controlType: 'select', options: TOOLTIP_COLOR_OPTIONS },
      radius: { controlType: 'select', options: RADIUS_TOKENS },
      offset: { controlType: 'number', min: 0, max: 32, step: 1 },
      width: { controlType: 'number', min: 120, max: 320, step: 10 }
    },
    previewWrapper: (node) => React.createElement(
      View,
      { style: { alignItems: 'center', justifyContent: 'center', paddingVertical: 32 } },
      node
    )
  },
  KeyCap: {
    id: 'KeyCap',
    component: 'KeyCap',
    initialProps: {
      children: 'Cmd + K',
      size: 'md',
      variant: 'default',
      color: 'primary',
      animateOnPress: true,
      keyCode: 'k',
      modifiers: ['cmd']
    },
    pinnedProps: ['size', 'variant', 'color', 'animateOnPress', 'pressed'],
    hiddenProps: [...COMMON_EVENT_PROPS, 'modifiers'],
    controlOverrides: {
      size: { controlType: 'segmented', options: SIZE_TOKENS },
      variant: { controlType: 'segmented', options: ['default', 'minimal', 'outline', 'filled'] },
      color: { controlType: 'select', options: ['primary', 'secondary', 'gray', 'success', 'warning', 'error'] },
      modifiers: false
    }
  },
  Ring: {
    id: 'Ring',
    component: 'Ring',
    initialProps: {
      value: 72,
      min: 0,
      max: 100,
      size: 160,
      thickness: 16,
      label: 'System health',
      subLabel: 'Nominal',
      caption: '24h rolling',
      showValue: true,
      trackColor: 'rgba(148,163,184,0.35)',
      progressColor: '#22c55e',
      roundedCaps: true,
      colorStops: [
        { value: 0, color: '#94a3b8' },
        { value: 50, color: '#22c55e' },
        { value: 80, color: '#f97316' }
      ]
    },
    pinnedProps: ['value', 'size', 'thickness', 'showValue', 'roundedCaps', 'neutral'],
    hiddenProps: [...COMMON_EVENT_PROPS, 'valueFormatter', 'children'],
    controlOverrides: {
      value: { controlType: 'number', min: 0, max: 100, step: 1 },
      size: { controlType: 'number', min: 80, max: 280, step: 10 },
      thickness: { controlType: 'number', min: 4, max: 32, step: 1 },
      progressColor: {
        controlType: 'color',
        placeholder: '#22c55e',
        colorPresets: ['#22c55e', '#f97316', '#e11d48', '#0ea5e9']
      },
      trackColor: {
        controlType: 'color',
        placeholder: '#e2e8f0',
        colorPresets: ['#e2e8f0', '#cbd5f5', '#94a3b8', '#1e293b']
      }
    }
  },
  Text: {
    id: 'Text',
    component: 'Text',
    initialProps: {
      children: 'Telemetry stream ready',
      variant: 'h4',
      size: 'lg',
      colorVariant: 'primary',
      weight: 'semibold',
      align: 'left',
      tracking: 0.2,
      uppercase: false,
      numberOfLines: 2
    },
    pinnedProps: ['variant', 'size', 'color', 'colorVariant', 'weight', 'align', 'uppercase', 'numberOfLines', 'ellipsizeMode'],
    hiddenProps: [...COMMON_EVENT_PROPS, 'tx', 'txParams', 'value', 'fontFamily', 'as'],
    controlOverrides: {
      variant: { controlType: 'select', options: TEXT_VARIANT_OPTIONS },
      size: { controlType: 'segmented', options: SIZE_TOKENS },
      colorVariant: { controlType: 'select', options: TEXT_COLOR_VARIANTS },
      color: {
        controlType: 'color',
        placeholder: '#0f172a',
        colorPresets: ['#0f172a', '#475569', '#f8fafc', '#14b8a6']
      },
      weight: { controlType: 'segmented', options: FONT_WEIGHT_OPTIONS },
      align: { controlType: 'segmented', options: ['left', 'center', 'right', 'justify'] },
      tracking: { controlType: 'number', min: -1, max: 2, step: 0.1 }
    }
  },
  Timeline: {
    id: 'Timeline',
    component: 'Timeline',
    initialProps: {
      active: 2,
      size: 'md',
      colorVariant: 'primary.5',
      align: 'left',
      lineWidth: 2,
      bulletSize: 24,
      centerMode: false,
      reverseActive: false
    },
    pinnedProps: ['active', 'size', 'colorVariant', 'align', 'lineWidth', 'bulletSize', 'centerMode', 'reverseActive'],
    hiddenProps: [...COMMON_EVENT_PROPS],
    controlOverrides: {
      size: { controlType: 'segmented', options: SIZE_TOKENS },
      colorVariant: { controlType: 'select', options: TIMELINE_COLOR_VARIANTS },
      color: {
        controlType: 'color',
        placeholder: 'primary.5',
        colorPresets: ['#0ea5e9', '#22c55e', '#f97316', '#ef4444']
      },
      align: { controlType: 'segmented', options: ['left', 'right'] },
      lineWidth: { controlType: 'number', min: 1, max: 6, step: 1 },
      bulletSize: { controlType: 'number', min: 12, max: 40, step: 2 },
      active: { controlType: 'number', min: 0, max: TIMELINE_EVENTS.length - 1, step: 1 }
    },
    previewWrapper: (node) => {
      if (!React.isValidElement(node)) return node;
      const TimelineItem = (node.type as any)?.Item;
      if (!TimelineItem) return node;
      const items = TIMELINE_EVENTS.map(event =>
        React.createElement(
          TimelineItem,
          {
            key: event.key,
            title: event.title,
            lineVariant: event.lineVariant,
            colorVariant: event.lineVariant === 'dotted' ? 'secondary.5' : undefined
          },
          React.createElement(
            View,
            { style: { marginTop: 6 } },
            React.createElement(Text, { style: { fontSize: 14, color: '#475569' } }, `${event.timestamp} · ${event.description}`)
          )
        )
      );
      return React.cloneElement(node, undefined, items);
    }
  },
  Waveform: {
    id: 'Waveform',
    component: 'Waveform',
    initialProps: {
      peaks: WAVEFORM_SAMPLE,
      width: 320,
      height: 80,
      color: '#6366f1',
      progressColor: '#22c55e',
      variant: 'bars',
      barWidth: 2,
      barGap: 1,
      strokeWidth: 2,
      progress: 0.35,
      showProgressLine: true,
      progressLineStyle: { color: '#22c55e', width: 2, opacity: 0.6 },
      interactive: false,
      normalize: true,
      fullWidth: true,
      showTimeStamps: false,
      duration: 120,
      timeStampInterval: 15
    },
    pinnedProps: ['variant', 'width', 'height', 'color', 'progress', 'barWidth', 'barGap', 'strokeWidth', 'showProgressLine', 'interactive', 'normalize', 'fullWidth'],
    hiddenProps: [...COMMON_EVENT_PROPS, 'peaks', 'progressLineStyle', 'gradientColors', 'selection', 'rmsData', 'markers', 'onSeek', 'onDragStart', 'onDrag', 'onDragEnd', 'onSelectionChange', 'onZoomChange', 'onPerformanceMetrics'],
    controlOverrides: {
      variant: { controlType: 'segmented', options: WAVEFORM_VARIANTS },
      width: { controlType: 'number', min: 200, max: 640, step: 10 },
      height: { controlType: 'number', min: 40, max: 160, step: 5 },
      color: {
        controlType: 'color',
        placeholder: '#6366f1',
        colorPresets: WAVEFORM_COLOR_PRESETS
      },
      progressColor: {
        controlType: 'color',
        placeholder: '#22c55e',
        colorPresets: WAVEFORM_COLOR_PRESETS
      },
      barWidth: { controlType: 'number', min: 1, max: 6, step: 1 },
      barGap: { controlType: 'number', min: 0, max: 4, step: 1 },
      strokeWidth: { controlType: 'number', min: 1, max: 6, step: 1 },
      progress: { controlType: 'number', min: 0, max: 1, step: 0.05 },
      duration: { controlType: 'number', min: 30, max: 480, step: 30 },
      timeStampInterval: { controlType: 'number', min: 5, max: 60, step: 5 }
    }
  },
  Alert: {
    id: 'Alert',
    component: 'Alert',
    initialProps: {
      title: 'Mission status',
      children: 'Opportunity window closes in 14 minutes.',
      variant: 'subtle',
      color: 'warning',
      sev: 'warning',
      withCloseButton: true,
      fullWidth: false,
      radius: 'md'
    },
    pinnedProps: ['variant', 'color', 'sev', 'withCloseButton', 'fullWidth', 'radius'],
    hiddenProps: [...COMMON_EVENT_PROPS, 'icon', 'closeButtonLabel', 'onClose'],
    controlOverrides: {
      variant: { controlType: 'segmented', options: ALERT_VARIANTS },
      color: { controlType: 'select', options: ALERT_COLOR_OPTIONS },
      sev: { controlType: 'segmented', options: ALERT_SEVERITIES },
      radius: { controlType: 'select', options: RADIUS_TOKENS }
    }
  },
  Avatar: {
    id: 'Avatar',
    component: 'Avatar',
    initialProps: {
      size: 'lg',
      src: AVATAR_SAMPLE_IMAGE,
      fallback: 'ES',
      label: 'Edda Salazar',
      description: 'Flight software lead',
      showText: true,
      gap: 12,
      online: true,
      badgeColor: '#16a34a',
      backgroundColor: '#0f172a',
      textColor: '#f1f5f9'
    },
    pinnedProps: ['size', 'src', 'fallback', 'online', 'showText', 'gap', 'badgeColor', 'backgroundColor', 'textColor'],
    hiddenProps: [...COMMON_EVENT_PROPS, 'accessibilityLabel', 'style'],
    controlOverrides: {
      size: { controlType: 'segmented', options: SIZE_TOKENS },
      src: { controlType: 'text', placeholder: 'https://example.com/avatar.jpg' },
      gap: { controlType: 'number', min: 0, max: 32, step: 1 },
      backgroundColor: { controlType: 'color', colorPresets: AVATAR_COLOR_PRESETS, placeholder: '#0f172a' },
      textColor: { controlType: 'color', colorPresets: ['#f8fafc', '#0f172a', '#1e293b'], placeholder: '#f1f5f9' },
      badgeColor: { controlType: 'color', colorPresets: ['#22c55e', '#f97316', '#6366f1'], placeholder: '#16a34a' }
    }
  },
  Stepper: {
    id: 'Stepper',
    component: 'Stepper',
    initialProps: {
      active: 1,
      orientation: 'horizontal',
      iconPosition: 'left',
      size: 'md',
      color: '#6366f1',
      allowNextStepsSelect: true
    },
    pinnedProps: ['active', 'orientation', 'iconPosition', 'size', 'color', 'allowNextStepsSelect'],
    hiddenProps: [...COMMON_EVENT_PROPS, 'completedIcon', 'children', 'ref', 'iconSize', 'icon'],
    controlOverrides: {
      active: { controlType: 'number', min: 0, max: STEPPER_SAMPLE_STEPS.length - 1, step: 1 },
      orientation: { controlType: 'segmented', options: STEPPER_ORIENTATIONS },
      iconPosition: { controlType: 'segmented', options: STEPPER_ICON_POSITIONS },
      size: { controlType: 'segmented', options: SIZE_TOKENS },
      color: { controlType: 'color', placeholder: '#6366f1', colorPresets: ['#6366f1', '#0ea5e9', '#22c55e', '#f97316'] }
    },
    previewWrapper: (node) => {
      if (!React.isValidElement(node)) return node;
      const StepComponent = (node.type as any)?.Step;
      if (!StepComponent) return node;
      const steps = STEPPER_SAMPLE_STEPS.map(step =>
        React.createElement(
          StepComponent,
          {
            key: step.key,
            label: step.label,
            description: step.description,
            loading: step.loading,
            allowStepSelect: true
          }
        )
      );
      return React.cloneElement(node, undefined, steps);
    }
  },
  ShimmerText: {
    id: 'ShimmerText',
    component: 'ShimmerText',
    initialProps: {
      text: 'Synchronizing telemetry feed',
      variant: 'h5',
      size: 'lg',
      color: '#94a3b8',
      shimmerColor: '#f8fafc',
      spread: 2.5,
      duration: 1.6,
      delay: 0,
      repeatDelay: 0.4,
      repeat: true,
      once: false,
      direction: 'ltr',
      tracking: 0.4,
      numberOfLines: 2
    },
    pinnedProps: ['text', 'variant', 'size', 'weight', 'color', 'shimmerColor', 'spread', 'duration', 'direction', 'repeat', 'once', 'delay', 'repeatDelay'],
    hiddenProps: [...COMMON_EVENT_PROPS, 'colors', 'containerStyle', 'debug', 'startOnView', 'inViewMargin'],
    controlOverrides: {
      variant: { controlType: 'select', options: TEXT_VARIANT_OPTIONS },
      size: { controlType: 'segmented', options: SIZE_TOKENS },
      color: { controlType: 'color', placeholder: '#94a3b8', colorPresets: SHIMMER_COLOR_PRESETS },
      shimmerColor: { controlType: 'color', placeholder: '#f8fafc', colorPresets: SHIMMER_COLOR_PRESETS },
      direction: { controlType: 'segmented', options: SHIMMER_DIRECTIONS },
      spread: { controlType: 'number', min: 1, max: 4, step: 0.1 },
      duration: { controlType: 'number', min: 0.5, max: 4, step: 0.1 },
      delay: { controlType: 'number', min: 0, max: 2, step: 0.1 },
      repeatDelay: { controlType: 'number', min: 0, max: 2, step: 0.1 },
      weight: { controlType: 'segmented', options: FONT_WEIGHT_OPTIONS }
    }
  },
  GradientText: {
    id: 'GradientText',
    component: 'GradientText',
    initialProps: {
      children: 'Aurora uplink stable',
      colors: GRADIENT_DEFAULT_COLORS,
      variant: 'h3',
      size: 'xl',
      weight: 'bold',
      angle: 120,
      position: 0.1,
      tracking: 0.2
    },
    pinnedProps: ['variant', 'size', 'weight', 'angle', 'position'],
    hiddenProps: [...COMMON_EVENT_PROPS, 'colors', 'locations', 'start', 'end'],
    controlOverrides: {
      variant: { controlType: 'select', options: TEXT_VARIANT_OPTIONS },
      size: { controlType: 'segmented', options: SIZE_TOKENS },
      weight: { controlType: 'segmented', options: FONT_WEIGHT_OPTIONS },
      angle: { controlType: 'number', min: 0, max: 360, step: 5 },
      position: { controlType: 'number', min: 0, max: 1, step: 0.05 }
    }
  },
  Loader: {
    id: 'Loader',
    component: 'Loader',
    initialProps: {
      variant: 'dots',
      size: 'md',
      color: '#6366f1',
      speed: 700
    },
    pinnedProps: ['variant', 'size', 'color', 'speed'],
    hiddenProps: [...COMMON_EVENT_PROPS],
    controlOverrides: {
      variant: { controlType: 'segmented', options: LOADER_VARIANTS },
      size: { controlType: 'segmented', options: SIZE_TOKENS },
      color: { controlType: 'color', placeholder: '#6366f1', colorPresets: LOADER_COLOR_PRESETS },
      speed: { controlType: 'number', min: 200, max: 2000, step: 50 }
    }
  }
};

export function getPlaygroundConfig(id: string): ComponentPlaygroundConfig | null {
  return PLAYGROUND_CONFIGS[id] || null;
}

export function listPlaygroundConfigs(): ComponentPlaygroundConfig[] {
  return Object.values(PLAYGROUND_CONFIGS);
}
