import { useState } from 'react';
import { Pagination, Text, Card, Column } from '@platform-blocks/ui';

export default function Demo() {
  const [page1, setPage1] = useState(10);
  const [page2, setPage2] = useState(15);
  const [page3, setPage3] = useState(25);

  return (
    <Column gap={24}>
      <Text variant="h6">Advanced Pagination Controls</Text>
      
      <Card padding={16}>
        <Column gap={16}>
          <Text variant="body" weight="medium">With First/Last Buttons</Text>
          <Text variant="caption" colorVariant="secondary">
            Page {page1} of 30
          </Text>
          <Pagination
            current={page1}
            total={30}
            onChange={setPage1}
            showFirst
            showPrevNext
            siblings={2}
            boundaries={2}
          />
        </Column>
      </Card>
      
      <Card padding={16}>
        <Column gap={16}>
          <Text variant="body" weight="medium">Minimal Navigation</Text>
          <Text variant="caption" colorVariant="secondary">
            Page {page2} of 40
          </Text>
          <Pagination
            current={page2}
            total={40}
            onChange={setPage2}
            showFirst={false}
            showPrevNext
            siblings={1}
            boundaries={1}
          />
        </Column>
      </Card>
      
      <Card padding={16}>
        <Column gap={16}>
          <Text variant="body" weight="medium">Compact View</Text>
          <Text variant="caption" colorVariant="secondary">
            Page {page3} of 50
          </Text>
          <Pagination
            current={page3}
            total={50}
            onChange={setPage3}
            showFirst={false}
            showPrevNext
            siblings={0}
            boundaries={1}
            size="sm"
          />
        </Column>
      </Card>
    </Column>
  );
}


