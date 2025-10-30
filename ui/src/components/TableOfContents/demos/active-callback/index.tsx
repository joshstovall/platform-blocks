import React, { useState } from 'react';
import { TableOfContents, Text, Flex, Chip } from '@platform-blocks/ui';

export default function Demo() {
  const [active, setActive] = useState<string | null>(null);
  return (
    <Flex direction="column" gap={12}>
      <TableOfContents 
        variant="outline" 
        size="xs" 
  onActiveChange={(id: string | null) => setActive(id)} 
        style={{ maxWidth: 260 }}
        p={8}
      />
      <Chip variant="light" color={active ? 'primary' : 'gray'} size="sm">
        Active: {active || 'None'}
      </Chip>
      <Text size="xs" color="secondary">Scroll the document to change the active heading.</Text>
    </Flex>
  );
}
