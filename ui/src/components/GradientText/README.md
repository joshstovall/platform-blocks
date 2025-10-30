# GradientText Component

A powerful React Native component for rendering text with gradient colors. Supports static and animated gradients with full customization options.

## Features

✨ **Multiple Color Support** - Use 2 or more colors in your gradient  
🎨 **Custom Angles** - Control gradient direction from 0-360 degrees  
🎬 **Animated Gradients** - Auto-animating gradients (web only)  
📱 **Cross-Platform** - Works on Web, iOS, and Android  
⚡ **High Performance** - Optimized rendering and animations  
🎯 **Controlled Position** - Manually control gradient position (0.0-1.0)  
♿ **Accessible** - Inherits all Text accessibility features  

## Installation

The component is part of `@platform-blocks/ui`:

```bash
npm install @platform-blocks/ui
# or
yarn add @platform-blocks/ui
```

## Basic Usage

```tsx
import { GradientText } from '@platform-blocks/ui';

function App() {
  return (
    <GradientText colors={['#FF0080', '#7928CA']}>
      Hello Gradient World!
    </GradientText>
  );
}
```

## Examples

### Simple Gradient

```tsx
<GradientText colors={['#667eea', '#764ba2']}>
  Purple Gradient
</GradientText>
```

### Large Heading

```tsx
<GradientText 
  colors={['#f093fb', '#f5576c']}
  variant="h1"
  weight="bold"
>
  Gradient Heading
</GradientText>
```

### Custom Angle

```tsx
<GradientText 
  colors={['#ff6b6b', '#feca57', '#48dbfb']}
  angle={45}
>
  Diagonal Gradient
</GradientText>
```

### Animated Gradient (Web Only)

```tsx
<GradientText 
  colors={['#FF0080', '#7928CA', '#4F46E5']}
  animate
  animationDuration={3000}
  animationLoop="loop"
>
  Animated Gradient
</GradientText>
```

### Controlled Position

```tsx
function ControlledExample() {
  const [position, setPosition] = useState(0);
  
  return (
    <>
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
    </>
  );
}
```

### Rainbow Text

```tsx
<GradientText 
  colors={[
    '#FF0080',
    '#FF8C00',
    '#FFD700',
    '#00FF00',
    '#0080FF',
    '#8000FF'
  ]}
  animate
  animationDuration={5000}
>
  Rainbow Text
</GradientText>
```

## API Reference

### Props

All props from the `Text` component are supported, plus:

#### Gradient Configuration

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `colors` | `string[]` | **required** | Array of colors (minimum 2) |
| `locations` | `number[]` | auto | Color stop positions (0-1) |
| `angle` | `number` | `0` | Gradient angle in degrees |
| `start` | `[number, number]` | auto | Custom start point [x, y] |
| `end` | `[number, number]` | auto | Custom end point [x, y] |

#### Position Control

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `position` | `number` | `0` | Gradient position (0-1) |

#### Animation (Web Only)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `animate` | `boolean` | `false` | Enable auto-animation |
| `animationDuration` | `number` | `2000` | Duration in ms |
| `animationLoop` | `'loop' \| 'reverse' \| 'once'` | `'loop'` | Loop behavior |
| `animationDelay` | `number` | `0` | Delay in ms |

### Gradient Angles

Common angle values:

- `0°` - Left to right (horizontal) →
- `45°` - Bottom-left to top-right ↗
- `90°` - Top to bottom (vertical) ↓
- `135°` - Top-left to bottom-right ↘
- `180°` - Right to left ←
- `270°` - Bottom to top ↑

### Position Values

The `position` prop controls where the gradient appears along the line:

- `0.0` - Start position
- `0.25` - Quarter way
- `0.5` - Center
- `0.75` - Three quarters
- `1.0` - End position

Values outside 0-1 will wrap the gradient.

## Platform Support

### Web ✅
- Full gradient support with CSS `background-clip`
- Animated gradients using requestAnimationFrame
- Hardware accelerated rendering
- Smooth 60fps animations

### iOS ✅
- Static gradients supported
- Uses LinearGradient component
- Animation not yet supported (planned)

### Android ✅
- Static gradients supported
- Uses LinearGradient component  
- Animation not yet supported (planned)

## TypeScript

Full TypeScript support with comprehensive type definitions:

```typescript
import { GradientText, GradientTextProps } from '@platform-blocks/ui';

const MyGradient: React.FC = () => {
  const gradientProps: GradientTextProps = {
    colors: ['#FF0080', '#7928CA'],
    angle: 45,
    animate: true,
  };
  
  return <GradientText {...gradientProps}>Hello</GradientText>;
};
```

## Best Practices

### ✅ Do

- Use 2-4 colors for best visual effect
- Test readability on different backgrounds
- Use reasonable animation speeds (2-4 seconds)
- Ensure sufficient color contrast
- Use for headings and emphasis

### ❌ Don't

- Use too many colors (>5)
- Use for body text (readability issues)
- Use very fast animations (< 1 second)
- Use low contrast color combinations
- Overuse throughout your UI

## Performance

- Web: Uses CSS gradients (hardware accelerated)
- Native: Optimized LinearGradient rendering
- Animation: requestAnimationFrame for smooth 60fps
- No unnecessary re-renders
- Minimal bundle size impact

## Accessibility

GradientText maintains full accessibility:

- ✅ Screen reader compatible
- ✅ Respects system text sizing
- ✅ Inherits Text semantics
- ✅ Keyboard navigation support
- ⚠️ Ensure color contrast meets WCAG standards

## Troubleshooting

### Gradient not visible

- Check that you have at least 2 colors
- Verify colors are valid CSS color strings
- Ensure text has content

### Animation not working

- Animation is web-only currently
- Check that `animate={true}` is set
- Verify no `position` prop is set (conflicts with animate)

### Performance issues

- Reduce number of colors
- Increase animation duration
- Disable animation if not needed
- Check for unnecessary re-renders

## Examples & Demos

Check the `/demos` directory for more examples:

- `basic` - Simple gradient examples
- `animated` - Animated gradient examples (web)
- `angles` - Different gradient directions
- `controlled` - Controlled position examples

## Related Components

- [Text](/components/Text) - Base text component
- [Title](/components/Title) - Semantic headings
- [Badge](/components/Badge) - Badges with gradient support

## Contributing

Found a bug or have a feature request? Please open an issue on GitHub.

## License

MIT © Platform Blocks
