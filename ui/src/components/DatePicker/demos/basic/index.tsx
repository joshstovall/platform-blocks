import React, { useState } from 'react';
import { DatePicker, Text, Flex, Card } from '@platform-blocks/ui';

export default function BasicDatePickerDemo() {
  const [value, setValue] = useState<Date | null>(null);

  return (
    <Card p="lg">
      <Flex direction="column" gap={16}>
        <Text size="lg" weight="semibold">Inline calendar</Text>
        <DatePicker
          value={value}
          onChange={(newValue) => setValue(newValue as Date | null)}
          calendarProps={{ numberOfMonths: 1, highlightToday: true }}
        />
        <Text size="sm" colorVariant="secondary">
          {value ? `Selected: ${value.toLocaleDateString()}` : 'No date selected'}
        </Text>
      </Flex>
    </Card>
  )
}
