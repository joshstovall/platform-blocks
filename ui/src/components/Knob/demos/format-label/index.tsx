import { useMemo, useState } from 'react';
import { Card, Flex, Knob, Text } from '@platform-blocks/ui';

const formatDb = (value: number) => {
  const rounded = Math.round(value);
  const sign = rounded > 0 ? '+' : '';
  return `${sign}${rounded} dB`;
};

export default function Demo() {
  const [value, setValue] = useState(-12);
  const displayValue = useMemo(() => formatDb(value), [value]);

  return (
    <Card padding={24} shadow="sm" style={{ width: 280 }}>
      <Flex direction="column" align="center" gap="md">
        <Text size="md" weight="600">Channel gain</Text>
        <Knob
          min={-48}
          max={12}
          step={1}
          size={160}
          value={value}
          onChange={setValue}
          formatLabel={formatDb}
          withLabel
        />
        <Text size="sm" style={{ color: '#666' }}>
          Output level: {displayValue}
        </Text>
      </Flex>
    </Card>
  );
}
