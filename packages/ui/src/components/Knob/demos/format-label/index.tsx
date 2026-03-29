import { useMemo, useState } from 'react';

import { Column, Knob, Text } from '@platform-blocks/ui';

const formatDb = (value: number) => {
  const rounded = Math.round(value);
  const sign = rounded > 0 ? '+' : '';
  return `${sign}${rounded} dB`;
};

export default function Demo() {
  const [value, setValue] = useState(-12);
  const displayValue = useMemo(() => formatDb(value), [value]);

  return (
    <Column gap="sm" fullWidth>
      <Knob
        min={-48}
        max={12}
        step={1}
        size={160}
        value={value}
        onChange={setValue}
        valueLabel={{ formatter: formatDb }}
      />
      <Text size="xs" colorVariant="secondary">
        Output level: {displayValue}
      </Text>
    </Column>
  );
}
