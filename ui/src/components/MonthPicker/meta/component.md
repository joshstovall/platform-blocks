# MonthPicker

Interactive grid for selecting a month within a given year. Renders a responsive layout that adapts to screen width and respects locale formatting as well as min/max date constraints.

## Features

- Responsive `monthsPerRow` configuration with breakpoint support
- Optional header with previous/next year controls
- Locale-aware month labels in long or short format
- Built-in disabled state handling for min/max dates
- Works standalone or embedded in the calendar/date picker flows

## Usage

```tsx
import { MonthPicker } from '@platform-blocks/ui';

function Example() {
  const [value, setValue] = useState<Date | null>(new Date());

  return (
    <MonthPicker
      value={value}
      onChange={setValue}
      minDate={new Date(2020, 0, 1)}
      maxDate={new Date(2030, 11, 31)}
    />
  );
}
```

## Related

- [YearPicker](../YearPicker) – switch between decades and pick a year
- [DatePicker](/components/DatePicker) – full calendar experience that composes MonthPicker internally
- [MonthPickerInput](../MonthPickerInput) – input field wrapper that launches this picker in a dialog
