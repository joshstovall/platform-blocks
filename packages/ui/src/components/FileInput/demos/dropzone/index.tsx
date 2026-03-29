import { useState } from 'react';
import { Platform } from 'react-native';

import { Column, FileInput, Text } from '@platform-blocks/ui';
import type { FileInputFile } from '@platform-blocks/ui';

export default function Demo() {
  const [files, setFiles] = useState<FileInputFile[]>([]);

  const instructions =
    Platform.OS === 'web'
      ? 'Drag files into the dropzone or click Browse files to pick from your desktop.'
      : 'Tap the dropzone to open the native file picker on touch devices.';

  return (
    <Column gap="xs" fullWidth>
      <Text size="sm" colorVariant="secondary">
        {instructions}
      </Text>
      <FileInput
        variant="dropzone"
        multiple
        accept={['image/*', '.pdf', '.txt']}
        helperText="Drag & drop on desktop or tap to browse on mobile"
        onFilesChange={setFiles}
        showFileList
        fullWidth
      />
      {files.length > 0 && (
        <Column gap="xs">
          <Text size="xs" weight="semibold">
            Selected files ({files.length})
          </Text>
          <Column gap="xs">
            {files.map((file) => (
              <Text key={file.id} size="xs" colorVariant="secondary">
                {file.name}
              </Text>
            ))}
          </Column>
        </Column>
      )}
    </Column>
  );
}
