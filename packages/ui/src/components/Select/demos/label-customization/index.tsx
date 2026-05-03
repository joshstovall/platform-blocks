import { useState } from 'react';
import { Column, Select, Text } from '@platform-blocks/ui';
import { sportsOptions } from '../data';

export default function Demo() {
  const [a, setA] = useState<string | null>(null);
  const [b, setB] = useState<string | null>(null);
  const [c, setC] = useState<string | null>(null);

  return (
    <Column gap="lg">
      <Text weight="semibold">labelProps & descriptionProps</Text>

      <Select
        options={[...sportsOptions]}
        value={a}
        onChange={(v) => setA(v as string | null)}
        label="Favourite sport"
        description="Used to seed your home feed"
        placeholder="Pick one…"
        labelProps={{ weight: '700' }}
        descriptionProps={{ size: 'xs', colorVariant: 'muted' }}
      />

      <Select
        options={[...sportsOptions]}
        value={b}
        onChange={(v) => setB(v as string | null)}
        label="League region"
        description="Defaults to your IP region"
        placeholder="Auto-detect"
        labelProps={{ ff: 'Georgia, serif', size: 'lg' }}
      />

      <Select
        options={[...sportsOptions]}
        value={c}
        onChange={(v) => setC(v as string | null)}
        label="Streaming source"
        description="raw mux endpoint"
        placeholder="Choose feed…"
        labelProps={{ colorVariant: 'primary', weight: '600' }}
        descriptionProps={{ ff: 'monospace', size: 'xs' }}
      />
    </Column>
  );
}
