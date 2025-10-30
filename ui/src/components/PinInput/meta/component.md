---
displayName: PinInput
description: A specialized input component for entering PIN codes, OTP, and other sequential digit/character inputs.
category: input
status: stable
since: 1.0.0
tags: [pin, otp, security, input, verification]
props:
  value: The current PIN value as a string
  onChange: Callback fired when the PIN value changes
  length: Number of input fields (default: 4)
  type: Input type - 'numeric' or 'alphanumeric'
  size: Size variant of the input fields
  label: Label text displayed above the PIN input
  error: Error message displayed below the input
  disabled: Whether the PIN input is disabled
  autoFocus: Whether to auto-focus the first input field
  mask: Whether to mask the input values
  onComplete: Callback fired when all fields are filled
related:
  - Input
  - PasswordInput
  - Form
examples:
  - Basic 4-digit PIN input
  - 6-digit verification code input
  - Alphanumeric code input
  - Different size variants
  - Masked PIN input for security
  - OTP input with auto-advance
---

# PinInput

A specialized input component designed for entering PIN codes, one-time passwords (OTP), verification codes, and other sequential character inputs. The component provides an intuitive interface with automatic focus management.

## Features

- **Auto-Focus Management**: Automatically advances to the next field as user types
- **Multiple Input Types**: Supports numeric-only and alphanumeric inputs
- **Size Variants**: Multiple size options for different UI contexts
- **Security Features**: Optional masking for sensitive inputs
- **Validation Support**: Built-in error states and completion callbacks
- **Accessibility**: Full keyboard navigation and screen reader support

## Usage

The PinInput component is ideal for authentication flows, verification processes, and any scenario requiring sequential character entry.

```tsx
import { PinInput } from '@platform-blocks/ui';

function VerificationForm() {
  const [pin, setPin] = useState('');
  
  const handleComplete = (value: string) => {
    // Handle PIN completion
    console.log('PIN entered:', value);
  };
  
  return (
    <PinInput
      value={pin}
      onChange={setPin}
      onComplete={handleComplete}
      length={6}
      type="numeric"
      label="Enter verification code"
    />
  );
}
```
