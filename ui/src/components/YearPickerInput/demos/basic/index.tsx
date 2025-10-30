import React, { useState } from 'react';
import { Card, Flex, Text, YearPickerInput } from '@platform-blocks/ui';

export default function BasicYearPickerInputDemo() {
  const [value, setValue] = useState<Date | null>(null);

  return (
    <Card p="lg">
      <Flex direction="column" gap={16}>
        <Text size="lg" weight="semibold">
          Modal year picker
        </Text>
        <YearPickerInput
          value={value}
          onChange={setValue}
          label="Fiscal year"
          placeholder="Select a year"
          clearable
        />
        <Text size="sm" colorVariant="secondary">
          {value ? `Selected: ${value.getFullYear()}` : 'No year selected'}
        </Text>
      </Flex>
    </Card>
  );
}
