import React, { useMemo, useState } from 'react';
import { DatePicker, Text, Flex, Card } from '@platform-blocks/ui';

export default function ValidationDatePickerDemo() {
  const [value, setValue] = useState<Date | null>(null);
  const [inlineError, setInlineError] = useState<string>('');

  const today = useMemo(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  }, []);

  const handleChange = (newValue: Date | [Date | null, Date | null] | Date[] | null) => {
    const dateValue = newValue as Date | null;
    setValue(dateValue);
    if (dateValue && dateValue < today) {
      setInlineError('Date cannot be in the past');
    } else {
      setInlineError('');
    }
  };

  return (
    <Card p="lg">
      <Flex direction="column" gap={16}>
        <Text size="lg" weight="semibold">Inline validation</Text>
        <DatePicker
          value={value}
          onChange={handleChange}
          calendarProps={{
            minDate: today,
            highlightToday: true,
          }}
        />
        <Text size="sm" colorVariant="secondary">
          {inlineError || 'Only dates today or later are enabled'}
        </Text>
      </Flex>
    </Card>
  );
}
