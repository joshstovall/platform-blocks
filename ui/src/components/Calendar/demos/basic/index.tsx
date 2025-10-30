import React, { useState } from 'react';
import { Calendar, Column, Text } from '@platform-blocks/ui';

export default function Demo() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  return (
    <Column gap={16}>
      <Calendar 
        value={selectedDate}
        onChange={(date) => setSelectedDate(date as Date | null)}
        highlightToday
      />
      {selectedDate && (
        <Text size="sm" color="gray">
          Selected: {selectedDate.toLocaleDateString()}
        </Text>
      )}
    </Column>
  );
}
