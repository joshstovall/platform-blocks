import { useState } from 'react';

import { Column, Row, Text, ToggleButton } from '@platform-blocks/ui';

export default function Demo() {
  const [selected, setSelected] = useState(false);

  return (
    <Column gap="sm">
      <Column gap="xs">
        <Text weight="semibold">Standalone toggle</Text>
        <Text size="xs" colorVariant="secondary">
          Control an individual toggle by pairing `selected` with `onPress`.
        </Text>
      </Column>

      <Row gap="sm" align="center">
        <ToggleButton
          value="favorite"
          selected={selected}
          onPress={() => setSelected((current) => !current)}
        >
          Mark favorite
        </ToggleButton>
        <Text size="xs" colorVariant="secondary">
          Status: {selected ? 'Favorited' : 'Not favorited'}
        </Text>
      </Row>
    </Column>
  );
}
