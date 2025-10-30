import React, { useState } from 'react';
import { DatePicker, Text, Flex, Card } from '@platform-blocks/ui';

export default function RangeDatePickerDemo() {
  const [value, setValue] = useState<[Date | null, Date | null] | null>(null);

  return (
    <Card p="lg">
      <Flex direction="column" gap={16}>
        <Text size="lg" weight="semibold">Inline date range</Text>
        <DatePicker
          type="range"
          value={value}
          onChange={(newValue) => setValue(newValue as [Date | null, Date | null] | null)}
          calendarProps={{ numberOfMonths: 2, withCellSpacing: true }}
        />
        <Text size="sm" colorVariant="secondary">
          {value && value[0] && value[1]
            ? `Selected: ${value[0].toLocaleDateString()} – ${value[1].toLocaleDateString()}`
            : 'Select a start and end date'}
        </Text>
      </Flex>
    </Card>
  );
}
