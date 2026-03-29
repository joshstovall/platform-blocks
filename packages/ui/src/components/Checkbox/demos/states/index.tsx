import { useState } from 'react';
import { Checkbox, Column, Text } from '@platform-blocks/ui';

export default function Demo() {
  const [enabled, setEnabled] = useState(true);
  const [required, setRequired] = useState(true);
  const [withError, setWithError] = useState(false);

  return (
    <Column gap="sm">
      <Text weight="medium">State variants</Text>
      <Checkbox label="Enabled" checked={enabled} onChange={setEnabled} />
      <Checkbox label="Disabled" checked={false} disabled />
      <Checkbox label="Required" required checked={required} onChange={setRequired} />
      <Checkbox
        label="With error"
        error={withError ? 'Selection required' : undefined}
        checked={withError}
        onChange={setWithError}
      />
      <Text variant="small" colorVariant="muted">
        Combine `required`, `disabled`, and `error` to communicate validation and accessibility states.
      </Text>
    </Column>
  );
}
