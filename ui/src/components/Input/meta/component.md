---
displayName: Input
description: A versatile text input component with support for different types, states, and validation.
category: input
status: stable
since: 1.0.0
tags: [input, form, text, validation]
props:
  value: The current value of the input
  onChangeText: Callback fired when the input value changes
  placeholder: Placeholder text displayed when input is empty
  label: Label text displayed above the input
  error: Error message displayed below the input
  disabled: Whether the input is disabled
  required: Whether the input is required
  type: Input type (text, password, email, number, etc.)
  autoFocus: Whether to auto-focus the input on mount
  maxLength: Maximum number of characters allowed
  multiline: Whether the input supports multiple lines
  numberOfLines: Number of lines for multiline inputs
  autoComplete: Auto-complete behavior
related:
  - PasswordInput
  - AutoComplete
  - Form
examples:
  - Basic text input with label and placeholder
  - Input with validation and error states
  - Different input types (email, password, number)
  - Multiline text input
  - Input with helper text and character count
---

A versatile text input component that provides a consistent interface for text entry across different platforms. The Input component supports various types, validation states, and accessibility features.

## Features

- **Multiple Input Types**: Supports text, password, email, number, and other input types
- **Validation Support**: Built-in error states and validation message display
- **Accessibility**: Full keyboard navigation and screen reader support
- **Responsive Design**: Adapts to different screen sizes and orientations
- **Customizable**: Extensive styling and theming options
- **Keyboard-aware**: Works with `KeyboardManagerProvider` and `KeyboardAwareLayout` to keep fields visible and optionally refocus them after selection flows

## Usage

The Input component is designed to be the primary text input element in forms and data entry interfaces. It provides consistent styling and behavior across platforms while supporting platform-specific features when needed.

Wrap screens in `KeyboardManagerProvider` (and typically `KeyboardAwareLayout`) to opt into shared keyboard dismissal and avoidance logic. Use the new `keyboardFocusId` prop when you need precise control over which field should regain focus after a selection completes.

```tsx
import { Input } from '@platform-blocks/ui';

function MyForm() {
  const [value, setValue] = useState('');
  
  return (
    <Input
      label="Email Address"
      value={value}
      onChangeText={setValue}
      placeholder="Enter your email"
      type="email"
      required
    />
  );
}
```
