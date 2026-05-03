import { useState } from 'react';
import { Column, Input, Text } from '@platform-blocks/ui';

export default function Demo() {
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [c, setC] = useState('');
  const [d, setD] = useState('');

  return (
    <Column gap="lg">
      <Text weight="semibold">labelProps & descriptionProps</Text>

      <Column gap="sm">
        <Text size="sm" colorVariant="muted">Default label and description</Text>
        <Input
          label="Email"
          description="We never share your address"
          placeholder="user@example.com"
          value={a}
          onChangeText={setA}
        />
      </Column>

      <Column gap="sm">
        <Text size="sm" colorVariant="muted">Bold uppercase label, smaller description</Text>
        <Input
          label="API key"
          description="Generated when you provision a workspace"
          placeholder="sk_live_..."
          value={b}
          onChangeText={setB}
          labelProps={{ weight: '700', uppercase: true, tracking: 0.5, size: 'xs' }}
          descriptionProps={{ size: 'xs', colorVariant: 'muted' }}
        />
      </Column>

      <Column gap="sm">
        <Text size="sm" colorVariant="muted">Custom font on label only (ff shorthand)</Text>
        <Input
          label="Display name"
          description="Shown on your profile"
          placeholder="Jane Doe"
          value={c}
          onChangeText={setC}
          labelProps={{ ff: 'Georgia, serif', size: 'lg' }}
        />
      </Column>

      <Column gap="sm">
        <Text size="sm" colorVariant="muted">
          Brand-coloured label using colorVariant
        </Text>
        <Input
          label="Workspace URL"
          description="https://platform-blocks.com/<slug>"
          placeholder="acme"
          value={d}
          onChangeText={setD}
          labelProps={{ colorVariant: 'primary', weight: '600' }}
          descriptionProps={{ ff: 'monospace', size: 'xs' }}
        />
      </Column>
    </Column>
  );
}
