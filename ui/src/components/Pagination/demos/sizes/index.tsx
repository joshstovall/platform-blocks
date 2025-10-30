import { useState } from 'react';
import { Pagination, Text, Card, Column } from '@platform-blocks/ui';

export default function Demo() {
  const [xsPage, setXsPage] = useState(3);
  const [smPage, setSmPage] = useState(3);
  const [mdPage, setMdPage] = useState(3);
  const [lgPage, setLgPage] = useState(3);

  return (
    <Column gap={24}>
      <Text variant="h6">Pagination Sizes</Text>
      
      <Card padding={16}>
        <Column gap={16}>
          <Text variant="body" weight="medium">Extra Small (xs)</Text>
          <Pagination
            current={xsPage}
            total={8}
            onChange={setXsPage}
            size="xs"
          />
        </Column>
      </Card>
      
      <Card padding={16}>
        <Column gap={16}>
          <Text variant="body" weight="medium">Small (sm)</Text>
          <Pagination
            current={smPage}
            total={8}
            onChange={setSmPage}
            size="sm"
          />
        </Column>
      </Card>
      
      <Card padding={16}>
        <Column gap={16}>
          <Text variant="body" weight="medium">Medium (md) - Default</Text>
          <Pagination
            current={mdPage}
            total={8}
            onChange={setMdPage}
            size="md"
          />
        </Column>
      </Card>
      
      <Card padding={16}>
        <Column gap={16}>
          <Text variant="body" weight="medium">Large (lg)</Text>
          <Pagination
            current={lgPage}
            total={8}
            onChange={setLgPage}
            size="lg"
          />
        </Column>
      </Card>
    </Column>
  );
}


