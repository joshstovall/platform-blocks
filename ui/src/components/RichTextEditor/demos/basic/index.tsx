import React, { useState } from 'react';
import { RichTextEditor, Card, Flex, Text } from '@platform-blocks/ui';
import type { RichTextEditorContent } from '@platform-blocks/ui';

export default function BasicRichTextEditorDemo() {
  const [value, setValue] = useState<RichTextEditorContent>({ html: '', text: '' });

  return (
    <Card p={16} variant="outline">
      <Flex direction="column" gap={12}>
        <Text weight="semibold">Article Body</Text>
        <RichTextEditor
          value={value}
          onChange={setValue}
          placeholder="Write something..."
          helperText="Formatting toolbar above"
          minHeight={160}
        />
        <Text size="xs" colorVariant="muted">Chars: {value.text.length}</Text>
      </Flex>
    </Card>
  );
}
