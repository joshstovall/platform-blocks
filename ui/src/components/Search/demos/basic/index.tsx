import React, { useState } from 'react';
import { Flex, Text } from '@platform-blocks/ui';
import { Search } from '../../../Search/Search';

export default function SearchBasicDemo() {
  const [value, setValue] = useState('');
  return (
    <Flex direction="column" gap={8} style={{ maxWidth: 320 }}>
      <Search value={value} onChange={setValue} placeholder="Search docs..." />
      <Text size="xs" color="muted">Value: {value || '—'}</Text>
    </Flex>
  );
}
