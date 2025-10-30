---
name: TimePicker
category: input
status: beta
since: 0.1.0
---

# TimePicker

Interactive input for selecting a time value with hour/minute (and optional seconds) precision. Opens a modal dialog (parity with `DatePicker`) for a consistent selection experience. Supports 12-hour or 24-hour clocks, manual text entry, and custom step intervals for minutes and seconds. Works in controlled and uncontrolled modes.

## Features
- Modal dialog picker (accessible backdrop + dismiss)
- Controlled and uncontrolled (`defaultValue`) modes
- 12h and 24h modes (with AM/PM toggle in 12h mode)
- Optional seconds column
- Configurable minute and second steps
- Manual freeform text input parsing (HH:MM(:SS) AM/PM)
- Optional auto-close on selection (`autoClose`)
- Validation via parent error prop

## Usage
```tsx
import { TimePicker } from '@platform-blocks/ui';

// Controlled
function ControlledExample() {
  const [value, setValue] = React.useState({ hours: 13, minutes: 30, seconds: 0 });
  return <TimePicker value={value} onChange={setValue} label="Time" />;
}

// Uncontrolled
function UncontrolledExample() {
  return <TimePicker defaultValue={{ hours: 9, minutes: 0, seconds: 0 }} label="Meeting time" autoClose />;
}
```

## Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| value | `TimePickerValue` | - | Controlled time value (24h internally) |
| defaultValue | `TimePickerValue` | `{ hours:12, minutes:0, seconds:0 }` | Initial value in uncontrolled mode |
| onChange | `(next: TimePickerValue) => void` | - | Called when time changes |
| format | `12 | 24` | `24` | Display mode |
| withSeconds | `boolean` | `false` | Enable seconds column & parsing |
| allowInput | `boolean` | `true` | Allow manual typing in input field |
| minuteStep | `number` | `5` | Increment for minute options |
| secondStep | `number` | `5` | Increment for second options |
| autoClose | `boolean` | `false` | Close modal after selecting minutes (or seconds if enabled) |
| title | `string` | `Select time` | Override modal header title |
| onOpen | `() => void` | - | Called when modal opens |
| onClose | `() => void` | - | Called when modal closes |
| disabled | `boolean` | - | Disable input and picker button |
| size | `any` | `md` | Input size (forwarded to underlying `Input`) |
| label | `string` | `"Time"` | Input label |
| error | `string` | - | Error message display |
| helperText | `string` | - | Helper / hint text |
| style | `any` | - | Container style override |

## Accessibility
- Modal traps interaction visually; tapping backdrop closes.
- Underlying input remains focusable with screen readers.
- AM/PM toggle is a standard button.
- Provide validation feedback via `error` for clarity.

## Related
- "DatePicker"

## Roadmap
- Keyboard navigation within the column lists
- Time range selection variant
- Scroll (momentum) wheel style option
- Optional inline/popover presentation prop
