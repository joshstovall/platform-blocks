---
displayName: Input
description: A versatile text input component with support for different types, states, and validation.
category: input
status: stable
since: 1.0.0
tags: [input, form, text, validation]
playground: true
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
