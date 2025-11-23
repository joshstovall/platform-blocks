import { useState } from 'react';
import { Checkbox, Column, Text } from '@platform-blocks/ui';

export default function Demo() {
  const [checked, setChecked] = useState(false);

  return (
    <Column gap="xs">
      <Checkbox
        label="Accept terms and conditions"
        checked={checked}
        onChange={setChecked}
      />
      <Text variant="small" colorVariant="muted">
        {checked ? 'Thanks! You can proceed to the next step.' : 'Check the box to continue.'}
      </Text>
    </Column>
  );
}
