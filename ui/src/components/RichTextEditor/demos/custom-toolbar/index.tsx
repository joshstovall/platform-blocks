import React, { useState } from 'react';
import { RichTextEditor, Card, Flex, Text, Button } from '@platform-blocks/ui';
import type { RichTextEditorContent } from '@platform-blocks/ui';

export default function CustomToolbarRichTextEditorDemo() {
  const [value, setValue] = useState<RichTextEditorContent>({ html: '', text: '' });
  const [saved, setSaved] = useState<RichTextEditorContent | null>(null);

  return (
    <Card p={16} variant="outline">
      <Flex direction="column" gap={12}>
        <Text weight="semibold">Minimal Editor</Text>
        <RichTextEditor
          value={value}
          onChange={setValue}
          toolbar={{ enabled: true, position: 'top', tools: ['bold','italic','underline'] }}
          placeholder="Quick note..."
          minHeight={100}
        />
        <Button title="Save" size="sm" onPress={() => setSaved(value)} />
        {saved && (
          <Text size="xs" colorVariant="muted">Saved length: {saved.text.length}</Text>
        )}
      </Flex>
    </Card>
  );
}
