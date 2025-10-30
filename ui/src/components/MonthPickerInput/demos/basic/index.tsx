import React, { useState } from 'react';
import { Card, Flex, MonthPickerInput, Text } from '@platform-blocks/ui';

export default function Demo() {
  const [value, setValue] = useState<Date | null>(null);

  return (
    <Card p="lg">
      <Flex direction="column" gap={16}>
        <Text size="lg" weight="semibold">
          Modal month picker
        </Text>
        <MonthPickerInput
          value={value}
          onChange={setValue}
          label="Billing cycle"
          placeholder="Select a month"
          clearable
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
