import React from 'react';
import { TableOfContents } from '@platform-blocks/ui';

const initialData = [
  { id: 'intro', value: 'Introduction', depth: 1 },
  { id: 'setup', value: 'Setup', depth: 2 },
  { id: 'usage', value: 'Usage', depth: 2 },
  { id: 'advanced', value: 'Advanced', depth: 1 },
  { id: 'faq', value: 'FAQ', depth: 1 },
];

export default function Demo() {
  return (
    <TableOfContents 
      initialData={initialData}
      variant="outline"
      depthOffset={16}
      radius="sm"
      size="sm"
      p={8}
      style={{ maxWidth: 260 }}
    />
  );
}
