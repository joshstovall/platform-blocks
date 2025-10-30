---
name: Grid
category: layout
status: beta
since: 0.1.0
---

# Grid

Responsive 12‑column layout primitive with span-based children. Each `GridItem` declares how many columns it consumes; container controls total columns and gaps. Supports responsive values for `columns` and `span` using breakpoint-aware props.

## Features
- 12-column default system (customizable via `columns`)
- Responsive `columns` and `span` props
- Unified `gap` plus granular `rowGap` / `columnGap`
- Automatic percentage width calculation
- Nested grids supported
- Integrates spacing system props (p / m / etc.)

## Basic Example
```tsx
<Grid columns={12} gap={12}>
  <GridItem span={6}><Card p={12}>Left</Card></GridItem>
  <GridItem span={6}><Card p={12}>Right</Card></GridItem>
</Grid>
```

## Responsive Example
```tsx
<Grid columns={{ base: 4, md: 8, lg: 12 }} gap={16}>
  <GridItem span={{ base: 4, md: 4, lg: 6 }}>A</GridItem>
  <GridItem span={{ base: 4, md: 4, lg: 6 }}>B</GridItem>
</Grid>
```

## Props: Grid
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| columns | `number | ResponsiveProp<number>` | `12` | Total columns available |
| gap | `SizeValue` | `0` | Uniform gap (both axes) |
| rowGap | `SizeValue` | gap | Row gap override |
| columnGap | `SizeValue` | gap | Column gap override |
| style | `ViewStyle` | - | Container style |
| children | `ReactNode` | - | Grid items / nodes |

## Props: GridItem
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| span | `number | ResponsiveProp<number>` | `1` | Column span out of parent columns |
| style | `ViewStyle` | - | Style override |
| children | `ReactNode` | - | Content |

## Responsive Values
Responsive objects match breakpoint keys resolved by `resolveResponsiveProp` (e.g. `{ base: 4, md: 8, lg: 12 }`). The current window width picks the closest defined key.

## Nesting
Place a `Grid` inside a `GridItem` to create sectional layouts.

## Related
- "Flex"
- "Stack"

## Roadmap
- Optional auto-collapse (stack) below threshold
- Ordering & offset props
- CSS grid backend for web platform
