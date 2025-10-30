import React, { useState } from 'react';
import { TimePicker, Text, Flex, Card } from '@platform-blocks/ui';
import type { TimePickerValue } from '@platform-blocks/ui';

export default function StepsTimePickerDemo() {
  const [value, setValue] = useState<TimePickerValue | null>({ hours: 10, minutes: 0, seconds: 0 });

  return (
    <Card p="lg">
      <Flex direction="column" gap={16}>
        <Text size="lg" weight="semibold">Custom Steps</Text>
        <TimePicker
          value={value}
          onChange={setValue}
          label="Time"
          minuteStep={15}
          secondStep={10}
          withSeconds
          helperText="15m / 10s steps"
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
