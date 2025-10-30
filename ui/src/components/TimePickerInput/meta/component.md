# TimePickerInput

Alias for `TimePicker` tailored for form inputs. Presents a read-only input that opens the time selection panel in a dialog, mirroring the behavior of other picker inputs across the design system.

## Features

- Controlled/uncontrolled support with `TimePickerValue`
- Optional clear button, helper text, and validation messaging
- Supports 12h/24h formats, seconds, minute/second steps, and auto-close behavior
- Shares all capabilities of `TimePicker` while providing a drop-in input experience

## Usage

```tsx
import { TimePickerInput } from '@platform-blocks/ui';

function Example() {
  const [value, setValue] = useState<TimePickerValue | null>(null);

  return (
    <TimePickerInput
      value={value}
      onChange={setValue}
      label="Reminder"
      format={12}
      withSeconds
    />
  );
}
```

## Related

- [TimePicker](/components/TimePicker) – underlying time selection component
- [DatePickerInput](/components/DatePickerInput) – date counterpart with calendar UI
- [MonthPickerInput](../MonthPickerInput) & [YearPickerInput](../YearPickerInput) – additional picker input variants
