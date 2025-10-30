import React, { useState } from 'react';
import { Card, Flex, Text, YearPicker } from '@platform-blocks/ui';

export default function BasicYearPickerDemo() {
  const [value, setValue] = useState<Date | null>(new Date());

  return (
    <Card p="lg">
      <Flex direction="column" gap={16}>
        <Text size="lg" weight="semibold">
          Choose a year
        </Text>
        <YearPicker
          value={value}
          onChange={setValue}
          totalYears={20}
        />
        <Text size="sm" colorVariant="secondary">
          {value ? `Selected: ${value.getFullYear()}` : 'No year selected'}
        </Text>
      </Flex>
    </Card>
  );
}
