import { useState } from 'react';
import { Pagination, Text, Card, Column } from '@platform-blocks/ui';

export default function Demo() {
  const [defaultPage, setDefaultPage] = useState(5);
  const [outlinePage, setoutlinePage] = useState(5);
  const [subtlePage, setSubtlePage] = useState(5);

  return (
    <Column gap={24}>
      <Text variant="h6">Pagination Variants</Text>
      
      <Card padding={16}>
        <Column gap={16}>
          <Text variant="body" weight="medium">Default</Text>
          <Pagination
            current={defaultPage}
            total={15}
            onChange={setDefaultPage}
            variant="default"
          />
        </Column>
      </Card>
      
      <Card padding={16}>
        <Column gap={16}>
          <Text variant="body" weight="medium">outline</Text>
          <Pagination
            current={outlinePage}
            total={15}
            onChange={setoutlinePage}
            variant="outline"
          />
        </Column>
      </Card>
      
      <Card padding={16}>
        <Column gap={16}>
          <Text variant="body" weight="medium">Subtle</Text>
          <Pagination
            current={subtlePage}
            total={15}
            onChange={setSubtlePage}
            variant="subtle"
          />
        </Column>
      </Card>
    </Column>
  );
}


