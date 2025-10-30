# GradientText

A text component that displays text with gradient colors. Supports customizable gradients with multiple colors, different angles, and animated transitions (web only).

## Features

- **Multiple Color Gradients**: Support for 2 or more colors
- **Custom Angles**: Control gradient direction (0-360 degrees)
- **Custom Start/End Points**: Fine-grained control over gradient positioning
- **Animated Gradients** (web only): Auto-animating gradients with loop, reverse, or single-run modes
- **Controlled Position**: Manually control gradient position from 0.0 to 1.0
- **Text Props**: Inherits all Text component props for full customization

## Basic Usage

```tsx
import { GradientText } from '@platform-blocks/ui';

// Simple gradient
<GradientText colors={['#FF0080', '#7928CA']}>
  Hello Gradient
</GradientText>

// With size and weight
<GradientText 
  colors={['#667eea', '#764ba2']} 
  size="xl"
  weight="bold"
>
  Bold Gradient Text
</GradientText>

// With custom angle
<GradientText 
  colors={['#f093fb', '#f5576c']}
  angle={45}
>
  Diagonal Gradient
</GradientText>
```

## Animated Gradients (Web Only)

```tsx
// Auto-animating (looping)
<GradientText 
  colors={['#FF0080', '#7928CA', '#4F46E5']}
  animate
  animationDuration={3000}
>
  Looping Animation
</GradientText>

// Reverse animation
<GradientText 
  colors={['#f093fb', '#f5576c', '#ffd200']}
  animate
  animationLoop="reverse"
  animationDuration={2000}
>
  Reversing Animation
</GradientText>

// Single run
<GradientText 
  colors={['#667eea', '#764ba2']}
  animate
  animationLoop="once"
  animationDuration={4000}
>
  Single Run Animation
</GradientText>
```

## Controlled Position

```tsx
const [position, setPosition] = useState(0);

<GradientText 
  colors={['#FF0080', '#7928CA']}
  position={position}
>
  Controlled Gradient
</GradientText>

<Slider
  value={position}
  onChange={setPosition}
  min={0}
  max={1}
  step={0.01}
/>
```

## Props

### GradientText Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `colors` | `string[]` | **required** | Array of colors for the gradient (minimum 2 colors) |
| `locations` | `number[]` | auto | Color stop positions (0-1). If not provided, colors are evenly distributed |
| `angle` | `number` | `0` | Gradient direction angle in degrees (0 = left to right, 90 = top to bottom) |
| `start` | `[number, number]` | auto | Custom start point [x, y] (0-1). Overrides angle |
| `end` | `[number, number]` | auto | Custom end point [x, y] (0-1). Overrides angle |
| `position` | `number` | `0` | Gradient position offset (0-1). Animates gradient along the line |
| `animate` | `boolean` | `false` | Enable automatic gradient animation (web only) |
| `animationDuration` | `number` | `2000` | Animation duration in milliseconds |
| `animationLoop` | `'loop' \| 'reverse' \| 'once'` | `'loop'` | Animation loop behavior |
| `animationDelay` | `number` | `0` | Delay before animation starts in milliseconds |
| `...textProps` | `TextProps` | - | All props from the Text component |

## Gradient Angles

The `angle` prop defines the gradient direction:

- `0°` - Left to right (horizontal)
- `45°` - Bottom-left to top-right (diagonal)
- `90°` - Top to bottom (vertical)
- `135°` - Top-left to bottom-right (diagonal)
- `180°` - Right to left (horizontal reverse)
- `270°` - Bottom to top (vertical reverse)

## Position

The `position` prop (0.0 to 1.0) moves the gradient along the line:

- `0.0` - Gradient starts at the beginning
- `0.5` - Gradient is centered
- `1.0` - Gradient has moved to the end

This creates a "wave" effect where the gradient appears to slide across the text.

## Platform Notes

### Web
- Full support for all features including animations
- Uses CSS `background-clip: text` for gradient masking
- Smooth animations using requestAnimationFrame

### Native (iOS/Android)
- Static gradients supported
- Animation features currently not supported (planned for future)
- Uses LinearGradient component with text overlay
- For true text masking on native, `@react-native-masked-view/masked-view` can be added

## Examples

### Rainbow Gradient
```tsx
<GradientText 
  colors={['#FF0080', '#FF8C00', '#FFD700', '#00FF00', '#0080FF', '#8000FF']}
  animate
  animationDuration={5000}
>
  Rainbow Text
</GradientText>
```

### Sunset Effect
```tsx
<GradientText 
  colors={['#ff6b6b', '#feca57', '#48dbfb']}
  angle={135}
  variant="h1"
>
  Sunset Gradient
</GradientText>
```

### Shimmer Effect (Controlled)
```tsx
const shimmer = useShimmer(); // Custom hook

<GradientText 
  colors={['transparent', 'white', 'transparent']}
  locations={[0, 0.5, 1]}
  position={shimmer}
>
  Shimmering Text
</GradientText>
```

## Accessibility

GradientText inherits all accessibility features from the Text component:
- Respects system text sizing
- Maintains proper contrast (ensure gradient colors have sufficient contrast)
- Compatible with screen readers
- Supports all text semantics (headings, labels, etc.)

## Performance

- Web animations use requestAnimationFrame for smooth 60fps performance
- Gradients are CSS-based on web (hardware accelerated)
- Native implementation is optimized for rendering performance
- Animation can be disabled with `animate={false}`

## Best Practices

1. **Color Contrast**: Ensure gradient colors have sufficient contrast with the background
2. **Readability**: Test gradients with different text sizes - small text may be hard to read
3. **Animation Speed**: Use reasonable animation durations (2-4 seconds) for readability
4. **Color Count**: 2-4 colors usually look best; too many can be overwhelming
5. **Use Cases**: Best for headings, hero text, and emphasis - avoid for body text

## Related Components

- [Text](/components/Text) - Base text component
- [Title](/components/Title) - Semantic heading component
- [Badge](/components/Badge) - Can also use gradients
