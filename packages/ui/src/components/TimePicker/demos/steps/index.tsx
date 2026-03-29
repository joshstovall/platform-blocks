import React, { useState } from 'react';
import { Column, Text, TimePicker } from '@platform-blocks/ui';
import type { TimePickerValue } from '@platform-blocks/ui';

const formatTime = (time: TimePickerValue | null) => {
  if (!time) {
    return null;
  }

  const hours = String(time.hours).padStart(2, '0');
  const minutes = String(time.minutes).padStart(2, '0');
  const seconds = String(time.seconds ?? 0).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
};

export default function StepsTimePickerDemo() {
  const [value, setValue] = useState<TimePickerValue | null>({ hours: 10, minutes: 0, seconds: 0 });
  const formatted = formatTime(value);

  return (
    <Column gap="xs" fullWidth>
      <TimePicker
        value={value}
        onChange={setValue}
        label="Time"
        minuteStep={15}
        secondStep={10}
        withSeconds
        helperText="15m / 10s steps"
        clearable
        fullWidth
      />
      {formatted && (
        <Text size="sm" colorVariant="secondary">{`Selected: ${formatted}`}</Text>
      )}
    </Column>
  );
}
