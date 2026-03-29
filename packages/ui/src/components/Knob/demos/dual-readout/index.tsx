import { useMemo, useState } from 'react';

import { Column, Knob } from '@platform-blocks/ui';

export default function Demo() {
  const [cutoff, setCutoff] = useState(3200);
  const percent = useMemo(() => Math.round(((cutoff - 200) / (8000 - 200)) * 100), [cutoff]);

  return (
    <Column gap="sm" fullWidth>
      <Knob
        value={cutoff}
        onChange={setCutoff}
        min={200}
        max={8000}
        step={50}
        variant="dual"
        size={180}
        valueLabel={{
          position: 'center',
          formatter: (val) => `${Math.round(val)} Hz`,
          secondary: {
            position: 'bottom',
            formatter: () => `${percent}% span`,
          },
        }}
        marks={[
          { value: 400, label: 'Warm' },
          { value: 1200, label: 'Neutral' },
          { value: 6400, label: 'Bright' },
        ]}
      />
    </Column>
  );
}
