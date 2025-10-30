import React, { useState } from 'react';
import { DatePicker, Text, Flex, Card } from '@platform-blocks/ui';

export default function MultipleDatePickerDemo() {
  const [value, setValue] = useState<Date[]>([]);

  return (
    <Card p="lg">
      <Flex direction="column" gap={16}>
        <Text size="lg" weight="semibold">Inline multi-select</Text>
        <DatePicker
          type="multiple"
          value={value}
          onChange={(newValue) => setValue((newValue as Date[]) || [])}
          calendarProps={{ numberOfMonths: 2, withCellSpacing: true }}
        />
        <Text size="sm" colorVariant="secondary">
          {value.length > 0
            ? `Selected: ${value.map((d) => d.toLocaleDateString()).join(', ')}`
            : 'Select one or more dates'}
        </Text>
      </Flex>
    </Card>
  );
}
