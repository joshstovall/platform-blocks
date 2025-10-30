import React, { useState } from 'react';
import { Card, DatePickerInput, Flex, Text } from '@platform-blocks/ui';

export default function BasicDatePickerInputDemo() {
  const [value, setValue] = useState<Date | null>(null);

  return (
    <Card p="lg">
      <Flex direction="column" gap={16}>
        <Text size="lg" weight="semibold">Modal date picker</Text>
        <DatePickerInput
          value={value}
          onChange={(newValue) => setValue(newValue as Date | null)}
          placeholder="Select a date"
          label="Date"
          clearable
        />
        <Text size="sm" colorVariant="secondary">
          {value ? `Selected: ${value.toLocaleDateString()}` : 'No date selected'}
        </Text>
      </Flex>
    </Card>
  );
}
