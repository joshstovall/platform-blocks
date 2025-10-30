import React from 'react';
import { Table } from '@platform-blocks/ui';

export default function Demo() {
  const data = {
    head: ['Package', 'Version', 'Downloads'],
    body: Array.from({ length: 6 }).map((_, i) => [
      `library-${i + 1}`,
      `v${(1 + i).toFixed(1)}`,
      Math.floor(Math.random() * 5000 + 500),
    ]),
    caption: 'Package download metrics',
  };
  return (
    <Table data={data} striped withTableBorder fullWidth />
  );
}
