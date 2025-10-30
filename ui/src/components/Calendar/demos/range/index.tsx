import React, { useState } from 'react';
import { Calendar, Column, Text } from '@platform-blocks/ui';

export default function Demo() {
  const [selectedRange, setSelectedRange] = useState<[Date | null, Date | null]>([null, null]);

  const formatRange = (range: [Date | null, Date | null]) => {
    const [start, end] = range;
    if (!start) return 'No selection';
    if (!end) return `${start.toLocaleDateString()} - ...`;
    return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
  };

  return (
    <Column gap={16}>
      <Calendar 
        type="range"
        value={selectedRange}
        onChange={(range) => setSelectedRange(range as [Date | null, Date | null])}
        highlightToday
      />
      <Text size="sm" color="gray">
        Selected range: {formatRange(selectedRange)}
      </Text>
    </Column>
  );
}