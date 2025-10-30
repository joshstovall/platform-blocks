---
name: CopyButton
category: utility
status: beta
since: 0.1.0
---

# CopyButton

Small utility component for copying text values to the clipboard with optional toast feedback. Used inside components like `CodeBlock` and `QRCode` to standardize UX.

## Features
- Icon-only or labeled button modes
- Automatic visual feedback (icon changes to checkmark)
- Optional toast notification (title + truncated message)
- Size variants: xs / sm / md
- Custom onCopy callback
- Disable toast for silent copy flows

## Basic Usage
```tsx
<CopyButton value="ABCD-1234" />
```

## Labeled Mode
```tsx
<CopyButton value={apiKey} iconOnly={false} label="Copy Key" />
```

## Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| value | `string` | (required) | String to copy |
| onCopy | `(value: string) => void` | - | Called after copy succeeds |
| iconOnly | `boolean` | `true` | If true hides text label |
| label | `string` | `"Copy"` | Label text when `iconOnly=false` |
| toastTitle | `string` | `"Copied"` | Toast heading |
| toastMessage | `string` | derived | Toast body (falls back to truncated value) |
| size | `'xs' | 'sm' | 'md'` | `sm` | Control size |
| style | `ViewStyle` | - | Wrapper style |
| disableToast | `boolean` | `false` | Suppress toast feedback |

## Truncation
Values > 60 chars shorten with ellipsis in toast to avoid overflow.

## Related
- "useClipboard"
- "Notifications"

## Roadmap
- Optional tooltip hover state
- Copy attempts analytics hook
