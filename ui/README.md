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

Refer to the documentation site for component examples and API details. A dedicated “Keyboard Management” guide is available at `/keyboard` within the docs app.

## Keyboard Management

Packages that render focusable inputs can opt into shared keyboard state by wrapping their tree in `KeyboardManagerProvider`. This unlocks the `useKeyboardManager()` hook and ensures components like `AutoComplete` and `Select` dismiss or refocus the keyboard consistently across web and native platforms.

```tsx
import { KeyboardManagerProvider, KeyboardAwareLayout } from '@platform-blocks/ui';

export function App() {
	return (
		<KeyboardManagerProvider>
			<KeyboardAwareLayout>
				{/* form inputs */}
			</KeyboardAwareLayout>
		</KeyboardManagerProvider>
	);
}
```

`KeyboardAwareLayout` is optional but recommended for screens where the on-screen keyboard could obscure lower inputs. Components expose a `refocusAfterSelect` prop that lets you override the default dismissal behavior when selections complete.

For direct inputs, you can pass `keyboardFocusId` to make a field eligible for deferred refocus requests triggered via `KeyboardManagerProvider` (for example, when an overlay completes a selection and needs to restore focus to a specific input).