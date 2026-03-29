import { useState } from 'react';

import { Column, Pagination, Text } from '@platform-blocks/ui';

export default function Demo() {
  const [defaultPage, setDefaultPage] = useState(5);
  const [outlinePage, setOutlinePage] = useState(5);
  const [subtlePage, setSubtlePage] = useState(5);

  return (
    <Column gap="lg">
      <Column gap="xs">
        <Pagination current={defaultPage} total={15} onChange={setDefaultPage} variant="default" />
        <Text size="xs" colorVariant="secondary">
          Default variant keeps the control fully filled. Page {defaultPage} of 15.
        </Text>
      </Column>

      <Column gap="xs">
        <Pagination current={outlinePage} total={15} onChange={setOutlinePage} variant="outline" />
        <Text size="xs" colorVariant="secondary">
          Outline keeps the surface quiet while the active page gets a stroke. Page {outlinePage} of 15.
        </Text>
      </Column>

      <Column gap="xs">
        <Pagination current={subtlePage} total={15} onChange={setSubtlePage} variant="subtle" />
        <Text size="xs" colorVariant="secondary">
          Subtle removes backgrounds for tinted surfaces. Page {subtlePage} of 15.
        </Text>
      </Column>
    </Column>
  );
}


