import React, { useState } from 'react';
import { Calendar, Column, Text } from '@platform-blocks/ui';

export default function Demo() {
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);

  const formatDates = (dates: Date[]) => {
    if (dates.length === 0) return 'No dates selected';
    if (dates.length === 1) return `1 date selected: ${dates[0].toLocaleDateString()}`;
    return `${dates.length} dates selected: ${dates.map(d => d.toLocaleDateString()).join(', ')}`;
  };

  return (
    <Column gap={16}>
      <Calendar 
        type="multiple"
        value={selectedDates}
        onChange={(dates) => setSelectedDates(dates as Date[])}
        highlightToday
      />
      <Text size="sm" color="gray">
        {formatDates(selectedDates)}
      </Text>
    </Column>
  );
}