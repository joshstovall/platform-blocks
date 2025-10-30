# Enhanced Toast Features Demo

This demo showcases the advanced features added to the Toast component:

## 🎯 Swipe to Dismiss
- Swipe horizontally or vertically to dismiss toasts
- Configurable swipe threshold and velocity
- Natural rotation and scaling effects during swipe
- Haptic feedback on dismiss

## 🎨 Enhanced Animations
- **Bounce**: Spring-based entrance with configurable physics
- **Scale**: Scale in/out animations with smooth transitions
- **Slide**: Improved slide animations with easing options
- **Fade**: Pure fade animations for subtle toasts

## 🎛️ Action Buttons
- Add interactive buttons to toasts
- Custom styling and colors
- Proper accessibility support
- Callback handling for user interactions

## 📦 Batch Operations
- Show multiple toasts simultaneously
- Group toasts with shared IDs
- Batch dismiss functionality
- Queue management with priority

## ⚡ Promise Integration
- Automatic pending/success/error toast flow
- Promise state tracking
- Dynamic content based on results
- Error handling integration

## 🎪 Queue Management
- Maximum visible toasts per position
- Stack direction control (up/down)
- Configurable spacing between toasts
- Priority-based queue processing
- Duplicate prevention

## 🎨 Advanced Configuration
- Tap-to-dismiss functionality
- Persistent toasts (no auto-hide)
- Custom animation timing and easing
- Enhanced accessibility features
- Platform-specific optimizations

## Usage Examples

```typescript
// Swipe to dismiss
toast.show({
  title: 'Swipe me!',
  swipeConfig: {
    enabled: true,
    direction: 'horizontal',
    threshold: 150
  }
});

// Custom animation
toast.show({
  title: 'Bouncy!',
  animationConfig: {
    type: 'bounce',
    springConfig: {
      damping: 10,
      stiffness: 100
    }
  }
});

// Promise integration
await toast.promise(apiCall(), {
  pending: 'Loading...',
  success: 'Done!',
  error: 'Failed!'
});

// Batch operations
toast.batch([
  { title: 'Toast 1', groupId: 'batch' },
  { title: 'Toast 2', groupId: 'batch' }
]);
```