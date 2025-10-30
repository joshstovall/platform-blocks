import React, { useState } from 'react';
import { Card, Flex, Text, TimePickerInput, TimePickerValue } from '@platform-blocks/ui';

export default function BasicTimePickerInputDemo() {
  const [value, setValue] = useState<TimePickerValue | null>({ hours: 9, minutes: 30 });

  return (
    <Card p="lg">
      <Flex direction="column" gap={16}>
        <Text size="lg" weight="semibold">
          Modal time picker
        </Text>
        <TimePickerInput
          value={value}
          onChange={setValue}
          label="Meeting time"
          format={12}
        />
        <Text size="sm" colorVariant="secondary">
          {value
            ? `Selected: ${((value.hours + 11) % 12) + 1}:${String(value.minutes).padStart(2, '0')} ${
                value.hours >= 12 ? 'PM' : 'AM'
              }`
            : 'No time selected'}
        </Text>
      </Flex>
    </Card>
  );
}
