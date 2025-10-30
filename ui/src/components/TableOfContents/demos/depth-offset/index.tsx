import React from 'react';
import { TableOfContents } from '@platform-blocks/ui';

export default function Demo() {
  return (
    <TableOfContents 
      variant="outline" 
      minDepthToOffset={2} 
      depthOffset={28} 
      size="xs" 
      p={8}
      style={{ maxWidth: 260 }}
    />
  );
}
