# Platform Blocks UI Component Library for React Native

## Compatibility

- `react` `>=18.0.0 <20.0.0`
- `react-native` `>=0.73.0`
- `react-native-reanimated` `>=3.4.0`
- `react-native-safe-area-context` `>=4.5.0`
- `react-native-svg` `>=13.0.0`
- Optional integrations: `expo-audio`, `expo-document-picker`, `expo-haptics`, `expo-linear-gradient`, `expo-status-bar`, `react-syntax-highlighter`, `@react-native-masked-view/masked-view`, `@shopify/flash-list`, `react-native-reanimated-carousel`

The library lazily requires optional modules, so they only need to be installed when you use features that depend on them.

## Installation

Install peer dependencies that match your application runtime, then add the package:

```bash
npm install @platform-blocks/ui
```

If you rely on optional integrations, add them with versions compatible with your project’s React Native or Expo SDK.

## Usage

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
