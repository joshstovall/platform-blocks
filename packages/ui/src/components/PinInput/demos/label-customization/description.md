---
title: Label customization
category: usage
order: 60
tags: [labelProps, descriptionProps, customization]
highlightLines: []
status: stable
since: 1.0.0
hidden: false
---

`PinInput` now renders its label and description through the shared FieldHeader, so the same `labelProps` / `descriptionProps` you pass to `<Input>` work here. The label also scales with the `size` prop instead of being fixed at 12/14/16.
