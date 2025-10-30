import React, { useState } from 'react';
import { TimePicker, Text, Flex, Card } from '@platform-blocks/ui';
import type { TimePickerValue } from '@platform-blocks/ui';

export default function Format12hTimePickerDemo() {
  const [value, setValue] = useState<TimePickerValue | null>({ hours: 0, minutes: 15, seconds: 0 });

  return (
    <Card p="lg">
      <Flex direction="column" gap={16}>
        <Text size="lg" weight="semibold">12-hour Format</Text>
        <TimePicker
          value={value}
          onChange={setValue}
          format={12}
          label="Time"
          helperText="12-hour clock with AM/PM"
          clearable
        />
        {value && (
          <Text size="sm" colorVariant="secondary">
            Internal (24h): {value.hours.toString().padStart(2,'0')}:{value.minutes.toString().padStart(2,'0')}
          </Text>
        )}
      </Flex>
    </Card>
  );
}
