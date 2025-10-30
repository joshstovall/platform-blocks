---
title: PhoneInput
description: A phone number input with masking, raw and formatted value handling, and international support.
category: input
tags: [phone, input, mask, formatting, international]
---

# PhoneInput

The `PhoneInput` component provides a flexible way to capture telephone numbers with built-in masking and formatting. It supports:

- Pattern-based masking using `#` as a digit placeholder (e.g. `(###) ###-####`)
- Automatic NANP formatting (US/Canada) via `autoInferNANP`
- International prefixes with `allowInternational`
- Controlled + uncontrolled usage
- Access to both raw (digits only) and formatted values
- Optional rendering of mask placeholders when empty via `showMask`

