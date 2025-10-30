import React, { useState } from 'react';
import { TimePicker, Text, Flex, Card } from '@platform-blocks/ui';
import type { TimePickerValue } from '@platform-blocks/ui';

export default function WithSecondsTimePickerDemo() {
  const [value, setValue] = useState<TimePickerValue | null>({ hours: 9, minutes: 5, seconds: 30 });

  return (
    <Card p="lg">
      <Flex direction="column" gap={16}>
        <Text size="lg" weight="semibold">With Seconds</Text>
        <TimePicker
          value={value}
          onChange={setValue}
          label="Time"
          withSeconds
          helperText="Seconds enabled"
          clearable
        />
        {value && (
          <Text size="sm" colorVariant="secondary">
            Selected: {value.hours.toString().padStart(2,'0')}:{value.minutes.toString().padStart(2,'0')}:{(value.seconds||0).toString().padStart(2,'0')}
          </Text>
        )}
      </Flex>
    </Card>
  );
}
