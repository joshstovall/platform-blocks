import React, { useState } from 'react';
import { MiniCalendar, Column, Text, Row, Button } from '@platform-blocks/ui';

export default function Demo() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [numberOfDays, setNumberOfDays] = useState(5);

  return (
    <Column gap={16}>
      <Row gap={8}>
        <Button 
          size="sm" 
          variant={numberOfDays === 3 ? 'filled' : 'outline'}
          onPress={() => setNumberOfDays(3)}
        >
          3 Days
        </Button>
        <Button 
          size="sm" 
          variant={numberOfDays === 5 ? 'filled' : 'outline'}
          onPress={() => setNumberOfDays(5)}
        >
          5 Days
        </Button>
        <Button 
          size="sm" 
          variant={numberOfDays === 7 ? 'filled' : 'outline'}
          onPress={() => setNumberOfDays(7)}
        >
          7 Days
        </Button>
      </Row>
      
      <MiniCalendar 
        value={selectedDate}
        onChange={(date: Date | null) => setSelectedDate(date)}
        numberOfDays={numberOfDays}
      />
      
      {selectedDate && (
        <Text size="sm" color="gray">
          Selected: {selectedDate.toLocaleDateString()}
        </Text>
      )}
    </Column>
  );
}