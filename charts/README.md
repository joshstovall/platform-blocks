# Platform Blocks Charts

Data visualization components for React Native and React Native Web.

## Compatibility

- `react` `>=18.0.0 <20.0.0`
- `react-dom` `>=18.0.0 <20.0.0` (optional, only required on web)
- `react-native` `>=0.73.0`
- `react-native-reanimated` `>=3.4.0`
- `react-native-svg` `>=13.0.0`

Install matching versions in your host app so the charts package can reuse them without duplicating React Native.

## Installation

```bash
npm install @platform-blocks/charts
```

### Optional setup for shared popovers

When you need multiple charts to share a single tooltip, wrap them in `ChartsProvider` and set `useOwnInteractionProvider={false}` on each chart. The provider handles positioning via web DOM APIs when available.

## Basic example

```tsx
import { AreaChart } from '@platform-blocks/charts';

export function RevenueChart({ data }) {
	return (
		<AreaChart
			width={320}
			height={220}
			data={data}
			xKey="month"
			yKey="value"
		/>
	);
}
```

## Testing

- `npm run test` runs the full Jest suite.
- `npm run test:watch` watches for file updates during development.
- `npm run test:coverage` reports thresholds across `src/**/*`.

Tests live under `tests/` by layer (`unit`, `integration`, `hooks`). Add fixtures under `tests/fixtures` when chart-specific datasets are needed.