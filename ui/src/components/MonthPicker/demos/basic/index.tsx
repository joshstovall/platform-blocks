import React, { useState } from 'react';
import { Card, Flex, MonthPicker, Text } from '@platform-blocks/ui';

export default function BasicMonthPickerDemo() {
  const [value, setValue] = useState<Date | null>(new Date());

  return (
    <Card p="lg">
      <Flex direction="column" gap={16}>
        <Text size="lg" weight="semibold">
          Choose a month
        </Text>
        <MonthPicker
          value={value}
          onChange={setValue}
          monthLabelFormat="long"
        />
        <Text size="sm" colorVariant="secondary">
          {value
            ? `Selected: ${value.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}`
            : 'No month selected'}
        </Text>
      </Flex>
    </Card>
  );
}
