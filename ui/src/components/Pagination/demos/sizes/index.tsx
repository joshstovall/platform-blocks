import { useState } from 'react';

import { Column, Pagination, Text } from '@platform-blocks/ui';

export default function Demo() {
  const [xsPage, setXsPage] = useState(3);
  const [smPage, setSmPage] = useState(3);
  const [mdPage, setMdPage] = useState(3);
  const [lgPage, setLgPage] = useState(3);

  return (
    <Column gap="lg">
      <Column gap="xs">
        <Pagination current={xsPage} total={8} onChange={setXsPage} size="xs" />
        <Text size="xs" colorVariant="secondary">
          Extra-small controls keep dense layouts compact. Page {xsPage} of 8.
        </Text>
      </Column>

      <Column gap="xs">
        <Pagination current={smPage} total={8} onChange={setSmPage} size="sm" />
        <Text size="xs" colorVariant="secondary">
          Small works well with mobile toolbars. Page {smPage} of 8.
        </Text>
      </Column>

      <Column gap="xs">
        <Pagination current={mdPage} total={8} onChange={setMdPage} size="md" />
        <Text size="xs" colorVariant="secondary">
          Medium is the default desktop size. Page {mdPage} of 8.
        </Text>
      </Column>

      <Column gap="xs">
        <Pagination current={lgPage} total={8} onChange={setLgPage} size="lg" />
        <Text size="xs" colorVariant="secondary">
          Large increases hit targets for spacious layouts. Page {lgPage} of 8.
        </Text>
      </Column>
    </Column>
  );
}


