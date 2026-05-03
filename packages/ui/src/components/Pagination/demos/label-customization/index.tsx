import { useState } from 'react';
import { Column, Pagination, Text } from '@platform-blocks/ui';

export default function Demo() {
  const [a, setA] = useState(3);
  const [b, setB] = useState(3);
  const [c, setC] = useState(3);

  return (
    <Column gap="lg">
      <Text weight="semibold">labelProps & activeLabelProps</Text>

      <Column gap="sm">
        <Text size="sm" colorVariant="muted">Default</Text>
        <Pagination current={a} total={10} onChange={setA} />
      </Column>

      <Column gap="sm">
        <Text size="sm" colorVariant="muted">
          Monospace numerals on every button
        </Text>
        <Pagination
          current={b}
          total={10}
          onChange={setB}
          labelProps={{ ff: 'monospace', weight: '600' }}
        />
      </Column>

      <Column gap="sm">
        <Text size="sm" colorVariant="muted">
          Uppercase tracked labels — active page is brand-coloured + bolder
        </Text>
        <Pagination
          current={c}
          total={10}
          onChange={setC}
          labelProps={{ uppercase: true, tracking: 1, size: 'xs' }}
          activeLabelProps={{ colorVariant: 'primary', weight: '700' }}
        />
      </Column>
    </Column>
  );
}
