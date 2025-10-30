import React, { useState } from 'react';
import { Calendar, Column, Text } from '@platform-blocks/ui';

export default function Demo() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  
  // Constrain to current month
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  return (
    <Column gap={16}>
      <Calendar 
        value={selectedDate}
        onChange={(date) => setSelectedDate(date as Date | null)}
        minDate={startOfMonth}
        maxDate={endOfMonth}
        highlightToday
      />
      {selectedDate && (
        <Text size="sm" color="gray">
          Selected: {selectedDate.toLocaleDateString()}
        </Text>
      )}
      <Text size="xs" color="gray">
        Only dates in {startOfMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} are selectable
      </Text>
    </Column>
  );
}