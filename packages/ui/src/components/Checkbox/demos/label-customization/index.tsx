import { useState } from 'react';
import { Column, Checkbox, Text } from '@platform-blocks/ui';

export default function Demo() {
  const [a, setA] = useState(false);
  const [b, setB] = useState(true);
  const [c, setC] = useState(false);

  return (
    <Column gap="lg">
      <Text weight="semibold">labelProps & descriptionProps</Text>

      <Checkbox
        checked={a}
        onChange={setA}
        label="Subscribe to product updates"
        description="One email per month, no marketing"
        labelProps={{ weight: '600' }}
        descriptionProps={{ size: 'xs', colorVariant: 'muted' }}
      />

      <Checkbox
        checked={b}
        onChange={setB}
        label="Required for checkout"
        description="Accept the terms before continuing"
        required
        labelProps={{ ff: 'Georgia, serif', size: 'lg' }}
      />

      <Checkbox
        checked={c}
        onChange={setC}
        label="Beta features"
        description="Some features may change without notice"
        labelProps={{ colorVariant: 'primary', weight: '700' }}
        descriptionProps={{ ff: 'monospace', size: 'xs' }}
      />
    </Column>
  );
}
