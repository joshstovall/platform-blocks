# YearPicker

Grid-based selector for choosing a year within a configurable range. Supports responsive layouts, decade navigation, and min/max constraints for simplified year selection flows.

## Features

- Decade navigation header with customizable visibility
- Responsive `yearsPerRow` support via breakpoint-aware values
- Respects min/max date bounds and disables out-of-range years automatically
- Works in controlled or uncontrolled decade modes
- Designed to integrate with Calendar, DatePicker, and standalone usage

## Usage

```tsx
import { YearPicker } from '@platform-blocks/ui';

function Example() {
  const [value, setValue] = useState<Date | null>(new Date());

  return (
    <YearPicker
      value={value}
      onChange={setValue}
      minDate={new Date(2000, 0, 1)}
      maxDate={new Date(2050, 11, 31)}
    />
  );
}
```

## Related

- [MonthPicker](../MonthPicker) – pick a month after choosing a year
- [DatePicker](/components/DatePicker) – combines day/month/year navigation in a single surface
- [YearPickerInput](../YearPickerInput) – input field that opens a year picker dialog
