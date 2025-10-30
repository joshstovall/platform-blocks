# YearPickerInput

Input component that opens `YearPicker` inside a modal dialog. Ideal for settings where only the year matters (fiscal periods, graduation year, etc.) while keeping the UI aligned with the rest of our picker inputs.

## Features

- Controlled/uncontrolled selection with customizable formatting
- Optional clear button, modal title, and close-on-select behavior
- Forwards sizing, decade, and breakpoint options to `YearPicker`
- Works seamlessly with form labels, helper text, and validation states

## Usage

```tsx
import { YearPickerInput } from '@platform-blocks/ui';

function Example() {
  const [value, setValue] = useState<Date | null>(null);

  return (
    <YearPickerInput
      value={value}
      onChange={setValue}
      label="Graduation year"
      placeholder="Select year"
      clearable
      yearPickerProps={{ yearsPerRow: { base: 3, md: 5 } }}
    />
  );
}
```

## Related

- [YearPicker](../YearPicker) – grid view used by the input
- [MonthPickerInput](../MonthPickerInput) – month selection counterpart
- [DatePickerInput](/components/DatePickerInput) – full calendar with day-level selection
