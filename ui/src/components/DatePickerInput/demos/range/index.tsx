import React, { useState } from 'react';
import { Card, DatePickerInput, Flex, Text } from '@platform-blocks/ui';

export default function RangeDatePickerInputDemo() {
  const [value, setValue] = useState<[Date | null, Date | null] | null>(null);

  return (
    <Card p="lg">
      <Flex direction="column" gap={16}>
        <Text size="lg" weight="semibold">Modal range picker</Text>
        <DatePickerInput
          type="range"
          value={value}
          onChange={(newValue) => setValue(newValue as [Date | null, Date | null] | null)}
          placeholder="Select date range"
          label="Date Range"
          closeOnSelect
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
