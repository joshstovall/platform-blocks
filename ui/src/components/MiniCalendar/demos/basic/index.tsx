import React, { useState } from 'react';
import { MiniCalendar, Column, Text } from '@platform-blocks/ui';

export default function Demo() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  return (
    <Column gap={16}>
      <MiniCalendar 
        value={selectedDate}
        onChange={(date: Date | null) => setSelectedDate(date)}
        numberOfDays={7}
      />
      {selectedDate && (
        <Text size="sm" color="gray">
          Selected: {selectedDate.toLocaleDateString()}
        </Text>
      )}
    </Column>
  );
}
