import React from 'react';
import { RichTextEditor, Card, Flex, Text } from '@platform-blocks/ui';
import type { RichTextEditorContent } from '@platform-blocks/ui';

const initial: RichTextEditorContent = { html: 'Welcome to <b>PlatformBlocks</b> UI!', text: 'Welcome to Platform Blocks!' };

export default function ReadOnlyRichTextEditorDemo() {
  return (
    <Card p={16} variant="outline">
      <Flex direction="column" gap={12}>
        <Text weight="semibold">Preview</Text>
        <RichTextEditor
          value={initial}
          readOnly
          toolbar={{ enabled: false, position: 'top', tools: [] }}
          placeholder=""
          minHeight={120}
        />
      </Flex>
    </Card>
  );
}
