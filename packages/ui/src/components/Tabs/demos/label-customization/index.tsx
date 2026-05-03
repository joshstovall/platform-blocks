import { useState } from 'react';
import { Column, Tabs, Text } from '@platform-blocks/ui';

const items = [
  { key: 'overview', label: 'Overview', content: <Text>Overview content</Text> },
  { key: 'activity', label: 'Activity', content: <Text>Activity content</Text> },
  { key: 'settings', label: 'Settings', content: <Text>Settings content</Text> },
];

export default function Demo() {
  const [a, setA] = useState('overview');
  const [b, setB] = useState('overview');
  const [c, setC] = useState('overview');

  return (
    <Column gap="lg">
      <Text weight="semibold">labelProps</Text>

      <Column gap="sm">
        <Text size="sm" colorVariant="muted">Default</Text>
        <Tabs items={items} activeTab={a} onTabChange={setA} />
      </Column>

      <Column gap="sm">
        <Text size="sm" colorVariant="muted">
          Uppercase tracked labels
        </Text>
        <Tabs
          items={items}
          activeTab={b}
          onTabChange={setB}
          labelProps={{ uppercase: true, tracking: 1, weight: '700', size: 'xs' }}
        />
      </Column>

      <Column gap="sm">
        <Text size="sm" colorVariant="muted">
          Custom font on all labels (ff shorthand)
        </Text>
        <Tabs
          items={items}
          activeTab={c}
          onTabChange={setC}
          variant="chip"
          labelProps={{ ff: 'Georgia, serif', size: 'md', weight: '600' }}
        />
      </Column>
    </Column>
  );
}
