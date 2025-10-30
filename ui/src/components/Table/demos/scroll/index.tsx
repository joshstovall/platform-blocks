import React from 'react';
import { Table, Text } from '@platform-blocks/ui';

export default function Demo() {
  const columns = Array.from({ length: 12 }, (_, i) => `Col ${i + 1}`);
  const body = Array.from({ length: 8 }).map((_, r) =>
    columns.map((c, ci) => `R${r + 1}C${ci + 1}`)
  );

  return (
    <Table.ScrollContainer minWidth={900}>
      <Table 
        data={{ head: columns, body, caption: 'Wide matrix sample (scroll to explore)' }}
        withTableBorder
        striped
      />
    </Table.ScrollContainer>
  );
}
