<p align="center">
  <a href="https://platform-blocks.com/" rel="noopener" target="_blank"><img width="75" height="75" src="https://raw.githubusercontent.com/joshstovall/platform-blocks/refs/heads/main/apps/platform-blocks.com/assets/favicon.png" alt="Platform Blocks logo"/></a>
</p>

<h1 align="center">@platform-blocks/ui</h1>

<div align="center">

[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/joshstovall/platform-blocks/blob/HEAD/LICENSE)
[![npm](https://img.shields.io/npm/v/@platform-blocks/ui)](https://www.npmjs.com/package/@platform-blocks/ui)
[![Discord](https://img.shields.io/badge/Chat%20on-Discord-%235865f2)](https://discord.gg/kbHjwzgXbc)

</div>

A comprehensive React Native UI component library for building accessible, themeable, and cross-platform mobile and web applications. Part of the [Platform Blocks](https://platform-blocks.com/) ecosystem.

## Features

- **80+ components** — Inputs, navigation, data display, overlays, media, and more
- **Cross-platform** — iOS, Android, and Web from a single codebase
- **Themeable** — Built-in light and dark themes with full customization via `createTheme`
- **Accessible** — Screen reader, keyboard navigation, and RTL support out of the box
- **Animated** — Smooth interactions powered by `react-native-reanimated`
- **Haptics & sound** — Optional feedback via `expo-haptics` and `expo-audio`
- **i18n ready** — Built-in internationalization with `I18nProvider`
- **Tree-shakeable** — ESM and CJS builds with no side effects

## Installation

```bash
npm install @platform-blocks/ui
```

### Peer dependencies

| Package | Version |
| --- | --- |
| `react` | `>=18.0.0 <20.0.0` |
| `react-native` | `>=0.73.0` |
| `react-native-reanimated` | `>=3.4.0` |
| `react-native-safe-area-context` | `>=4.5.0` |
| `react-native-svg` | `>=13.0.0` |

### Optional integrations

These are lazily required and only needed when you use features that depend on them:

`expo-audio` · `expo-document-picker` · `expo-haptics` · `expo-linear-gradient` · `expo-status-bar` · `react-native-worklets` · `react-syntax-highlighter` · `@react-native-masked-view/masked-view` · `@shopify/flash-list` · `react-native-reanimated-carousel`

## Quick start

```tsx
import { PlatformBlocksProvider, Button } from '@platform-blocks/ui';

export function App() {
  return (
    <PlatformBlocksProvider>
      <Button label="Hello" />
    </PlatformBlocksProvider>
  );
}
```

## Components

### Layout
`AppShell` · `Flex` · `Grid` · `Row` · `Column` · `Masonry` · `KeyboardAwareLayout` · `BottomAppBar`

### Typography
`Text` · `H1`–`H6` · `P` · `Strong` · `Code` · `Kbd` · `Mark` · `Highlight` · `Markdown` · `ShimmerText`

### Forms & inputs
`Input` · `TextArea` · `NumberInput` · `PasswordInput` · `PinInput` · `PhoneInput` · `Search` · `Select` · `AutoComplete` · `Checkbox` · `Radio` · `Switch` · `Slider` · `RangeSlider` · `Knob` · `ToggleButton` · `SegmentedControl` · `DatePicker` · `TimePicker` · `Calendar` · `ColorPicker` · `EmojiPicker` · `FileInput` · `Rating` · `Form`

### Navigation
`Tabs` · `Breadcrumbs` · `Menu` · `Pagination` · `Stepper`

### Data display
`DataTable` · `Table` · `Card` · `Avatar` · `Badge` · `Chip` · `Timeline` · `Tree` · `ListGroup` · `Blockquote` · `TableOfContents` · `Accordion`

### Feedback
`Toast` · `Notice` · `Progress` · `Skeleton` · `Loader` · `Gauge` · `Ring`

### Overlays
`Dialog` · `Tooltip` · `Popover` · `ContextMenu` · `Overlay` · `LoadingOverlay` · `Spotlight` · `FloatingActions`

### Media
`Icon` · `IconButton` · `Image` · `BrandIcon` · `Carousel` · `Gallery` · `Video` · `Waveform`

### Utilities
`Collapse` · `Divider` · `Link` · `CodeBlock` · `CopyButton` · `QRCode` · `Spoiler`

### App store & marketplace badges
Ready-made buttons and badges for App Store, Google Play, Microsoft Store, Amazon, Spotify, Apple Music, YouTube, Discord, GitHub, and 20+ more.

## Hooks

| Hook | Description |
| --- | --- |
| `useClipboard` | Copy text to clipboard |
| `useDeviceInfo` | Device and platform information |
| `useEscapeKey` | Escape key handler |
| `useGlobalHotkeys` | Global keyboard shortcuts |
| `useHotkeys` | Scoped keyboard shortcuts |
| `useHaptics` | Haptic feedback control |
| `useHapticsSettings` | Haptics configuration |
| `useMaskedInput` | Input masking |
| `useOverlayMode` | Overlay UI state |
| `useScrollSpy` | Scroll position tracking |
| `useSpotlightToggle` | Spotlight tutorial control |
| `useToggleColorScheme` | Dark / light mode toggle |

## Theming

Create custom themes or extend the defaults:

```tsx
import { PlatformBlocksProvider, createTheme } from '@platform-blocks/ui';

const theme = createTheme({
  colors: { primary: '#6366f1' },
});

export function App() {
  return (
    <PlatformBlocksProvider theme={theme}>
      {/* ... */}
    </PlatformBlocksProvider>
  );
}
```

## Documentation

Full documentation, interactive examples, and component playground are available at [platform-blocks.com](https://platform-blocks.com).

- [Getting started](https://platform-blocks.com/getting-started)
- [Component gallery](https://platform-blocks.com/components)
- [Interactive examples](https://platform-blocks.com/examples)
- [Theming guide](https://platform-blocks.com/theming)
- [Accessibility](https://platform-blocks.com/accessibility)
- [llms.txt](https://platform-blocks.com/llms.txt) — Full API reference for LLMs and AI assistants

## Contributing

See the [contributing guide](https://github.com/joshstovall/platform-blocks/blob/main/CONTRIBUTING.md) for setup instructions.

## License

[MIT](https://github.com/joshstovall/platform-blocks/blob/main/LICENSE) © [Josh Stovall](https://github.com/joshstovall)
