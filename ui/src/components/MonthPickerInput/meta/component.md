# MonthPickerInput

Form-friendly wrapper around `MonthPicker` that renders an input field and opens the picker in a modal dialog. Mirrors the `DatePickerInput` API for consistency while focusing on month-level selection workflows.

## Features

- Controlled and uncontrolled value support
- Built-in formatting with locale-aware defaults and custom formatter hook
- Optional clear button, modal title, and closing behavior
- Forwards most props to the underlying `MonthPicker`
- Plays nicely with forms, labels, helper text, and validation messaging

## Usage

```tsx
import { MonthPickerInput } from '@platform-blocks/ui';

function Example() {
  const [value, setValue] = useState<Date | null>(null);

  return (
    <MonthPickerInput
      value={value}
      onChange={setValue}
      label="Project month"
      placeholder="Select month"
      clearable
      monthPickerProps={{ monthsPerRow: { base: 3, md: 4 } }}
    />
  );
}
```

## Related

- [MonthPicker](../MonthPicker) – underlying month selection grid
- [DatePickerInput](/components/DatePickerInput) – full date selection input with calendar
- [YearPickerInput](../YearPickerInput) – year-only variant for selecting a year
