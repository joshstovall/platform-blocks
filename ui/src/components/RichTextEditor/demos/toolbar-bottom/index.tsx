import React, { useState } from 'react';
import { RichTextEditor, Card, Flex, Text } from '@platform-blocks/ui';
import type { RichTextEditorContent } from '@platform-blocks/ui';

export default function ToolbarBottomRichTextEditorDemo() {
  const [value, setValue] = useState<RichTextEditorContent>({ html: '', text: '' });

  return (
    <Card p={16} variant="outline">
      <Flex direction="column" gap={12}>
        <Text weight="semibold">Notes</Text>
        <RichTextEditor
          value={value}
          onChange={setValue}
          placeholder="Type notes..."
          toolbar={{ enabled: true, position: 'bottom', tools: ['bold','italic','underline','separator','list','separator','link'] }}
          minHeight={140}
        />
      </Flex>
    </Card>
  );
}
