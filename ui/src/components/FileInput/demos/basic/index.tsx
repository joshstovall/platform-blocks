import { useState } from 'react';

import { Column, FileInput, Text } from '@platform-blocks/ui';
import type { FileInputFile } from '@platform-blocks/ui';

export default function Demo() {
  const [files, setFiles] = useState<FileInputFile[]>([]);

  return (
    <Column gap="sm" fullWidth>
      <Text weight="semibold">Basic file input</Text>
      <Text size="sm" colorVariant="secondary">
        Select one or more files to upload and review the selection below.
      </Text>
      <FileInput
        label="Upload files"
        helperText="Choose files from your device"
        onFilesChange={setFiles}
        multiple
      />
      {files.length > 0 && (
        <Text size="xs" colorVariant="secondary">
          Selected: {files.map((file) => file.name).join(', ')}
        </Text>
      )}
    </Column>
  );
}
