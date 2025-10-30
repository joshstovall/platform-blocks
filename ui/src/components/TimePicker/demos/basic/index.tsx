import React, { useState } from 'react';
import { TimePicker, Text, Flex, Card } from '@platform-blocks/ui';
import type { TimePickerValue } from '@platform-blocks/ui';

export default function BasicTimePickerDemo() {
  const [value, setValue] = useState<TimePickerValue | null>({ hours: 13, minutes: 30, seconds: 0 });

  return (
    <Card p="lg">
      <Flex direction="column" gap={16}>
        <Text size="lg" weight="semibold">Basic Time Picker</Text>
        <TimePicker
          value={value}
          onChange={setValue}
          label="Time"
          helperText="24-hour format"
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
