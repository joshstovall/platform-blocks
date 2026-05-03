import { useState } from 'react';
import { Column, Input, Text, Icon } from '@platform-blocks/ui';

export default function Demo() {
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [c, setC] = useState('');
  const [d, setD] = useState('');

  return (
    <Column gap="lg">
      <Text weight="semibold">Slot styling</Text>

      <Column gap="sm">
        <Text size="sm" colorVariant="muted">
          Custom <Text ff="monospace">placeholderTextColor</Text>
        </Text>
        <Input
          label="Search"
          placeholder="Type a name…"
          value={a}
          onChangeText={setA}
          placeholderTextColor="#a855f7"
        />
      </Column>

      <Column gap="sm">
        <Text size="sm" colorVariant="muted">
          startSection with a tinted wrapper (`startSectionProps.style`)
        </Text>
        <Input
          label="URL"
          placeholder="my-workspace"
          value={b}
          onChangeText={setB}
          startSection={<Text ff="monospace" colorVariant="muted">https://</Text>}
          startSectionProps={{
            style: {
              backgroundColor: 'rgba(168, 85, 247, 0.08)',
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 6,
            },
          }}
        />
      </Column>

      <Column gap="sm">
        <Text size="sm" colorVariant="muted">
          endSection icon with extra padding (`endSectionProps.style`)
        </Text>
        <Input
          label="Quantity"
          placeholder="0"
          value={c}
          onChangeText={setC}
          endSection={<Icon name="package" size={16} />}
          endSectionProps={{
            style: {
              paddingHorizontal: 8,
              borderLeftWidth: 1,
              borderLeftColor: 'rgba(0,0,0,0.08)',
              marginLeft: 8,
            },
          }}
        />
      </Column>

      <Column gap="sm">
        <Text size="sm" colorVariant="muted">
          All three combined — branded search field
        </Text>
        <Input
          label="Search"
          placeholder="Find anything…"
          value={d}
          onChangeText={setD}
          placeholderTextColor="#7e22ce"
          startSection={<Icon name="search" size={16} color="#a855f7" />}
          startSectionProps={{ style: { paddingRight: 8 } }}
          endSection={
            d ? (
              <Text size="xs" colorVariant="muted">{d.length}</Text>
            ) : null
          }
          endSectionProps={{ style: { paddingLeft: 8 } }}
        />
      </Column>
    </Column>
  );
}
