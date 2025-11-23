import { useState } from 'react';
import { Calendar, Column, Text } from '@platform-blocks/ui';

const formatter = new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' });

export default function Demo() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  return (
    <Column gap="lg" maxWidth={360} w="100%" align="flex-start">
      <Calendar
        value={selectedDate}
        onChange={(date) => setSelectedDate(date as Date | null)}
        highlightToday
      />
      <Text size="sm" colorVariant="muted">
        Selected date: {selectedDate ? formatter.format(selectedDate) : 'none'}
      </Text>
    </Column>
  );
}
