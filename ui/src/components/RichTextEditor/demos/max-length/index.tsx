import React, { useState } from 'react';
import { RichTextEditor, Card, Flex, Text } from '@platform-blocks/ui';
import type { RichTextEditorContent } from '@platform-blocks/ui';

export default function MaxLengthRichTextEditorDemo() {
  const [value, setValue] = useState<RichTextEditorContent>({ html: '', text: '' });

  return (
    <Card p={16} variant="outline">
      <Flex direction="column" gap={12}>
        <Text weight="semibold">Short Description (max 120 chars)</Text>
        <RichTextEditor
          value={value}
          onChange={setValue}
          maxLength={120}
          placeholder="Enter summary..."
          toolbar={{ enabled: true, position: 'top', tools: ['bold','italic','underline','separator','link'] }}
          minHeight={120}
        />
      </Flex>
    </Card>
  );
}
