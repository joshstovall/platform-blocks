import { useState } from 'react';

import { Column, Row, Text, ToggleButton, ToggleGroup } from '@platform-blocks/ui';

export default function Demo() {
  const [view, setView] = useState('list');

  const handleChange = (value: string | number | (string | number)[]) => {
    if (typeof value === 'string') {
      setView(value);
    }
  };

  return (
    <Column gap="md">
      <Column gap="xs">
        <Text weight="semibold">Toggle orientations</Text>
        <Text size="xs" colorVariant="secondary">
          Swap the `orientation` prop to lay buttons out horizontally or vertically.
        </Text>
      </Column>

      <Row gap="lg" align="flex-start" wrap="wrap">
        <Column gap="xs">
          <Text size="sm" weight="semibold">
            Horizontal (default)
          </Text>
          <ToggleGroup value={view} exclusive onChange={handleChange} orientation="horizontal">
            <ToggleButton value="list">List</ToggleButton>
            <ToggleButton value="grid">Grid</ToggleButton>
            <ToggleButton value="card">Card</ToggleButton>
          </ToggleGroup>
        </Column>

        <Column gap="xs">
          <Text size="sm" weight="semibold">
            Vertical
          </Text>
          <ToggleGroup value={view} exclusive onChange={handleChange} orientation="vertical">
            <ToggleButton value="list">List</ToggleButton>
            <ToggleButton value="grid">Grid</ToggleButton>
            <ToggleButton value="card">Card</ToggleButton>
          </ToggleGroup>
        </Column>
      </Row>

      <Text size="xs" colorVariant="secondary">
        Selected view: {view}
      </Text>
    </Column>
  );
}
