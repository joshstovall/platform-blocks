import { useState } from 'react';
import { Column, Select, Text } from '@platform-blocks/ui';
import { sportsOptions } from '../data';

export default function Demo() {
  const [a, setA] = useState<string | null>(null);
  const [b, setB] = useState<string | null>(null);
  const [c, setC] = useState<string | null>(null);
  const [d, setD] = useState<string | null>(null);

  return (
    <Column gap="lg">
      <Text weight="semibold">Trigger variants</Text>

      <Column gap="sm">
        <Text size="sm" colorVariant="muted">default</Text>
        <Select
          options={[...sportsOptions]}
          value={a}
          onChange={(v) => setA(v as string | null)}
          label="Default"
          placeholder="Pick one…"
        />
      </Column>

      <Column gap="sm">
        <Text size="sm" colorVariant="muted">filled</Text>
        <Select
          variant="filled"
          options={[...sportsOptions]}
          value={b}
          onChange={(v) => setB(v as string | null)}
          label="Filled"
          placeholder="Pick one…"
        />
      </Column>

      <Column gap="sm">
        <Text size="sm" colorVariant="muted">outline</Text>
        <Select
          variant="outline"
          options={[...sportsOptions]}
          value={c}
          onChange={(v) => setC(v as string | null)}
          label="Outline"
          placeholder="Pick one…"
        />
      </Column>

      <Column gap="sm">
        <Text size="sm" colorVariant="muted">unstyled</Text>
        <Select
          variant="unstyled"
          options={[...sportsOptions]}
          value={d}
          onChange={(v) => setD(v as string | null)}
          placeholder="Inline pick…"
        />
      </Column>
    </Column>
  );
}
