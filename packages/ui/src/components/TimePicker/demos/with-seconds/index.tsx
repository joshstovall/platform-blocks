import React, { useState } from 'react';
import { Column, Text, TimePicker } from '@platform-blocks/ui';
import type { TimePickerValue } from '@platform-blocks/ui';

export default function WithSecondsTimePickerDemo() {
  const [value, setValue] = useState<TimePickerValue | null>({ hours: 9, minutes: 5, seconds: 30 });

  const formatted = value
    ? `${String(value.hours).padStart(2, '0')}:${String(value.minutes).padStart(2, '0')}:${String(value.seconds || 0).padStart(2, '0')}`
    : null;

  return (
    <Column gap="xs" fullWidth>
      <TimePicker
        value={value}
        onChange={setValue}
        label="Time"
        withSeconds
        helperText="Seconds enabled"
        clearable
        fullWidth
      />
      {formatted && (
        <Text size="sm" colorVariant="secondary">{`Selected: ${formatted}`}</Text>
      )}
    </Column>
  );
}
