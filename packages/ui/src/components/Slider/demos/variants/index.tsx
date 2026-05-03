import { useState } from 'react';
import { Slider, Text, Block, Card } from '@platform-blocks/ui';

const VARIANTS = ['default', 'filled', 'outline', 'minimal', 'segmented', 'unstyled'] as const;

export default function Demo() {
  const [value, setValue] = useState(40);

  return (
    <Block gap={20} fullWidth>
      <Text size="lg" weight="semibold">Slider variants</Text>
      <Text size="sm" style={{ color: '#555' }}>
        Each variant changes the track + thumb chrome. Drag any slider to see them stay in sync.
      </Text>

      {VARIANTS.map((variant) => (
        <Card key={variant}>
          <Block gap={8}>
            <Text size="sm" weight="medium">{variant}</Text>
            <Slider
              variant={variant}
              value={value}
              onChange={setValue}
              min={0}
              max={100}
              step={5}
              showTicks={variant === 'segmented'}
              restrictToTicks={variant === 'segmented'}
              fullWidth
            />
          </Block>
        </Card>
      ))}
    </Block>
  );
}
