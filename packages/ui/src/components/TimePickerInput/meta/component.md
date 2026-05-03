---
name: TimePickerInput
category: input
status: beta
since: 0.1.0
props:
  value: Controlled time value (TimePickerValue or null)
  onChange: Fired when the time changes
  format: '12 | 24'
  withSeconds: Render a seconds column
  label: Label rendered above the field
  description: Helper text shown beneath the label
  placeholder: Placeholder text shown when there is no value
  helperText: Helper text shown beneath the input
  error: Error message
  disabled: Disable the input
  clearable: Show a clear button when a value is selected
  labelProps: Override props applied to the label `<Text>`
  descriptionProps: Override props applied to the description `<Text>`
  placeholderTextColor: Override the placeholder color
  startSectionProps: View props applied to the startSection wrapper
  endSectionProps: View props applied to the endSection wrapper (clock icon by default)
---

Alias for `TimePicker` tailored for form inputs. Presents a read-only input that opens the time selection panel in a dialog, mirroring the behavior of other picker inputs across the design system. Supports the full `<Input>` slot-prop API for label, description, placeholder, and section customization.
