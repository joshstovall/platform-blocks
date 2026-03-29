import { useState } from 'react';

import { Column, Pagination, Text } from '@platform-blocks/ui';

export default function Demo() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 10;

  return (
    <Column gap="sm">
      <Pagination current={currentPage} total={totalPages} onChange={setCurrentPage} />
      <Text size="xs" colorVariant="secondary">
        Page {currentPage} of {totalPages}
      </Text>
    </Column>
  );
}


