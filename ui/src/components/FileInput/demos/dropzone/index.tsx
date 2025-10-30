import { useState } from 'react';
import { FileInput, Flex, Text, Card } from '@platform-blocks/ui';
import type { FileInputFile } from '@platform-blocks/ui';
import { Platform } from 'react-native';

export default function Demo() {
  const [files, setFiles] = useState<FileInputFile[]>([]);

  return (
    <Flex direction="column" gap={16}>
      <Text size="lg" weight="semibold">Drag & Drop (Dropzone Variant)</Text>
      <Text size="sm" color="dimmed">
        {Platform.OS === 'web'
          ? 'Drag files from your desktop into the highlighted area, or click Browse Files.'
          : 'Tap the area below to open the native file picker.'}
      </Text>

      <Card p={16} variant="outline">
        <FileInput
          variant="dropzone"
          multiple
          accept={['image/*', '.pdf', '.txt']}
          helperText="Supports drag & drop on desktop; tap to browse on touch devices"
          onFilesChange={setFiles}
          showFileList
          // enableDragDrop defaults to true on web, false on native
        />
      </Card>

      {files.length > 0 && (
        <Card p={16} variant="outline">
          <Text size="sm" weight="semibold" mb={8}>
            Selected ({files.length})
          </Text>
          <Flex direction="column" gap={4}>
            {files.map(f => (
              <Text key={f.id} size="xs">
                {f.name}
              </Text>
            ))}
          </Flex>
        </Card>
      )}
    </Flex>
  );
}
