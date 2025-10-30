import React from 'react';
import { TableOfContents } from '@platform-blocks/ui';

export default function Demo() {
  return (
    <TableOfContents 
      variant="filled" 
      color="#6366f1" 
      autoContrast 
      radius="md" 
      size="sm" 
      p={8}
      style={{ maxWidth: 260 }}
    />
  );
}
