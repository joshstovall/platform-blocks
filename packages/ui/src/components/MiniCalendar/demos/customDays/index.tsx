import React, { useState } from 'react';
import { Button, Column, MiniCalendar, Row, Text } from '@platform-blocks/ui';

const DAY_OPTIONS = [3, 5, 7];

export default function Demo() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [numberOfDays, setNumberOfDays] = useState(5);

  return (
    <Column gap="sm" fullWidth>
      <Row gap="xs">
        {DAY_OPTIONS.map((days) => (
          <Button
            key={days}
            size="sm"
            variant={numberOfDays === days ? 'filled' : 'outline'}
            onPress={() => setNumberOfDays(days)}
          >
            {days} days
          </Button>
        ))}
      </Row>
      <MiniCalendar
        value={selectedDate}
        onChange={(date: Date | null) => setSelectedDate(date)}
        numberOfDays={numberOfDays}
      />
      <Text size="sm" colorVariant="secondary">
        {selectedDate ? `Selected: ${selectedDate.toLocaleDateString()}` : 'No date selected'}
      </Text>
    </Column>
  );
}