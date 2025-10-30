import React, { useState } from 'react';
import { TimePicker, Text, Flex, Card } from '@platform-blocks/ui';
import type { TimePickerValue } from '@platform-blocks/ui';

const withinBusiness = (v: TimePickerValue) => {
  const totalMinutes = v.hours * 60 + v.minutes;
  return totalMinutes >= 9 * 60 && totalMinutes <= 17 * 60; // 09:00 - 17:00 inclusive
};

export default function ValidationTimePickerDemo() {
  const [value, setValue] = useState<TimePickerValue | null>({ hours: 8, minutes: 45, seconds: 0 });
  const [error, setError] = useState<string | undefined>('');

  const handleChange = (next: TimePickerValue | null) => {
    setValue(next);
    if (!next) {
      setError(undefined);
      return;
    }

    if (!withinBusiness(next)) {
      setError('Select a time between 09:00 and 17:00');
    } else {
      setError(undefined);
    }
  };

  return (
    <Card p="lg">
      <Flex direction="column" gap={16}>
        <Text size="lg" weight="semibold">Validation</Text>
        <TimePicker
          value={value}
          onChange={handleChange}
          label="Meeting Time"
          error={error}
          helperText="Business hours only"
          clearable
        />
        {value && (
          <Text size="sm" colorVariant="secondary">
            Selected: {value.hours.toString().padStart(2,'0')}:{value.minutes.toString().padStart(2,'0')}
          </Text>
        )}
      </Flex>
    </Card>
  );
}
