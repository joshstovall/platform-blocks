import { useState } from 'react';
import { Column, Switch, Text } from '@platform-blocks/ui';

export default function Demo() {
  const [a, setA] = useState(true);
  const [b, setB] = useState(false);
  const [c, setC] = useState(false);

  return (
    <Column gap="lg">
      <Text weight="semibold">labelProps & descriptionProps</Text>

      <Switch
        checked={a}
        onChange={setA}
        label="Notifications"
        description="Get a push when something happens"
        labelProps={{ weight: '600' }}
        descriptionProps={{ size: 'xs', colorVariant: 'muted' }}
      />

      <Switch
        checked={b}
        onChange={setB}
        label="Developer mode"
        description="Show advanced debugging panels"
        labelProps={{ ff: 'monospace', uppercase: true, tracking: 1, size: 'xs' }}
      />

      <Switch
        checked={c}
        onChange={setC}
        label="Auto-publish"
        description="Drafts go live the moment you save"
        color="success"
        labelProps={{ colorVariant: 'success', weight: '700' }}
      />
    </Column>
  );
}
