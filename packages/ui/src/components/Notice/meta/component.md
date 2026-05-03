---
name: Notice
title: Notice
category: feedback
tags: [notification, message, status, feedback]
playground: true
props:
  variant: 'light' | 'filled' | 'outline' | 'subtle'
  color: Theme color token or custom string
  sev: Severity helper — info | success | warning | error
  title: Title rendered above the body
  children: Body content
  icon: Override the leading icon (or set to null/false to hide)
  withCloseButton: Show a dismiss button
  onClose: Callback for the dismiss button
  titleProps: Override props applied to the title `<Text>` (style, weight, ff, size, colorVariant)
  bodyProps: Override props applied to the body `<Text>` (the children content)
examples:
  - basic
  - variants
  - icons
  - interactive
  - text-customization
---
The Notice component displays important messages to users with different severity levels, variants, and optional actions like dismissal. Title and body each accept full `<Text>` props via `titleProps` / `bodyProps`.
