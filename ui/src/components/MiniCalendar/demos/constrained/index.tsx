import React, { useState } from 'react';
import { MiniCalendar, Column, Text } from '@platform-blocks/ui';

export default function Demo() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  
  // Only allow selection of future dates (no past dates)
  const today = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(today.getDate() + 7);

  return (
    <Column gap={16}>
      <MiniCalendar 
        value={selectedDate}
        onChange={(date: Date | null) => setSelectedDate(date)}
        numberOfDays={7}
        minDate={today}
        maxDate={nextWeek}
      />
      
      {selectedDate && (
        <Text size="sm" color="gray">
          Selected: {selectedDate.toLocaleDateString()}
        </Text>
      )}
      
      <Text size="xs" color="gray">
        Only dates from today to next week are selectable
      </Text>
    </Column>
  );
}