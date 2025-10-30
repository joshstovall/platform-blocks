import React, { useMemo, useState } from 'react';
import { Card, DatePickerInput, Flex, Text } from '@platform-blocks/ui';

export default function ValidationDatePickerInputDemo() {
  const [value, setValue] = useState<Date | null>(null);
  const [error, setError] = useState<string>('');

  const today = useMemo(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  }, []);

  const handleChange = (next: Date | [Date | null, Date | null] | Date[] | null) => {
    const dateValue = next as Date | null;
    setValue(dateValue);
    if (dateValue && dateValue < today) {
      setError('Date cannot be in the past');
    } else {
      setError('');
    }
  };

  return (
    <Card p="lg">
      <Flex direction="column" gap={16}>
        <Text size="lg" weight="semibold">Validation messaging</Text>
        <DatePickerInput
          value={value}
          onChange={handleChange}
          placeholder="Select a future date"
          label="Future Date"
          error={error}
          clearable
          calendarProps={{
            minDate: today,
            highlightToday: true,
          }}
        />
        <Text size="sm" colorVariant="secondary">
          Try selecting a past date to see the error messaging
        </Text>
      </Flex>
    </Card>
  );
}
