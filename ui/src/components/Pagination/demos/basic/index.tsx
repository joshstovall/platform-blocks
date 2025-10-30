import { useState } from 'react';
import { Pagination, Text, Card, Column } from '@platform-blocks/ui';

export default function Demo() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 10;

  return (
    <Card padding={16}>
      <Column gap={16}>
        <Text variant="h6">Basic Pagination</Text>
        <Text variant="caption" colorVariant="secondary">
          Current page: {currentPage} of {totalPages}
        </Text>
        <Pagination
          current={currentPage}
          total={totalPages}
          onChange={setCurrentPage}
        />
      </Column>
    </Card>
  );
}


