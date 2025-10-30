import React, { useState } from 'react';
import { Card, DatePickerInput, Flex, Text } from '@platform-blocks/ui';

export default function MultipleDatePickerInputDemo() {
  const [value, setValue] = useState<Date[]>([]);

  return (
    <Card p="lg">
      <Flex direction="column" gap={16}>
        <Text size="lg" weight="semibold">Modal multi-select picker</Text>
        <DatePickerInput
          type="multiple"
          value={value}
          onChange={(newValue) => setValue((newValue as Date[]) || [])}
          placeholder="Select multiple dates"
          label="Multiple Dates"
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
