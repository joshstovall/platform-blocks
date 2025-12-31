------

title: DatePicker

description: Inline calendar component for selecting single dates, ranges, and multiple values without an input trigger.description: Inline calendar component for selecting single dates, ranges, and multiple values without an input trigger.

source: "@platform-blocks/ui"source: "@platform-blocks/ui"

status: "stable"status: "stable"

category: "Input"category: "Input"

accessibility: "Supports keyboard navigation, ARIA attributes, screen readers, and date format announcements."accessibility: "Supports keyboard navigation, ARIA attributes, screen readers, and date format announcements"

variants:variants:

  - name: "inline"  - name: "inline"

    description: "Inline calendar selection for single dates"    description: "Inline calendar selection for single dates"

  - name: "inline-range"  - name: "inline-range"

    description: "Inline date range selection"    description: "Inline date range selection"

  - name: "inline-multiple"  - name: "inline-multiple"

    description: "Inline multiple date selection"    description: "Inline multiple date selection"

dependencies:dependencies:

  - "@platform-blocks/core"  - "@platform-blocks/core"

  - "react-native-date-picker"  - "react-native-date-picker"

related:related:

  - "DatePickerInput"  - "Input"

  - "Calendar"  - name: "value"

  - "TimePicker"    type: "Date | [Date | null, Date | null] | Date[] | null"

props:    description: "Controlled value for the inline calendar."

  - name: "value"  - name: "defaultValue"

    type: "Date | [Date | null, Date | null] | Date[] | null"    type: "Date | [Date | null, Date | null] | Date[] | null"

    description: "Controlled value for the inline calendar."    description: "Initial value when used uncontrolled."

  - name: "defaultValue"  - name: "onChange"

    type: "Date | [Date | null, Date | null] | Date[] | null"    type: "(value: Date | [Date | null, Date | null] | Date[] | null) => void"

    description: "Initial value when used uncontrolled."    description: "Callback fired when selection changes."

  - name: "onChange"  - name: "type"

    type: "(value: Date | [Date | null, Date | null] | Date[] | null) => void"    type: "'single' | 'multiple' | 'range'"

    description: "Callback fired when selection changes."    description: "Selection mode for the calendar."

  - name: "type"  - name: "calendarProps"

    type: "'single' | 'multiple' | 'range'"    type: "Partial<CalendarProps>"

    description: "Selection mode for the calendar."    description: "Additional props forwarded to the underlying calendar."

  - name: "calendarProps"  - name: "style"

    type: "Partial<CalendarProps>"    type: "ViewStyle"

    description: "Additional props forwarded to the underlying calendar."    description: "Style applied to the wrapping view."

  - name: "style"  - name: "testID"

    type: "ViewStyle"    type: "string"

    description: "Style applied to the wrapping view."    description: "Identifier used for testing."

  - name: "testID"  - name: "accessibilityLabel"

    type: "string"    type: "string"

    description: "Identifier used for testing."    description: "Accessibility label for the calendar container."

  - name: "accessibilityLabel"  - name: "accessibilityHint"

    type: "string"    type: "string"

    description: "Accessibility label for the calendar container."    description: "Accessibility hint describing the calendar interaction."

  - name: "accessibilityHint"  - name: "helperText"

    type: "string"    type: "string"

    description: "Accessibility hint describing the calendar interaction."DatePicker renders an inline calendar focused on keyboard-friendly, accessible selection flows. Pair it with `DatePickerInput` when you need an input trigger and modal or popover calendar.

------



DatePicker renders an inline calendar focused on keyboard-friendly, accessible selection flows. Pair it with `DatePickerInput` when you need an input trigger and modal or popover calendar. DatePicker renders an inline calendar focused on keyboard-friendly, accessible selection flows. 
