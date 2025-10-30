import { useState } from 'react';
import { FileInput, Card } from '@platform-blocks/ui';
import type { FileInputFile } from '@platform-blocks/ui';

export default function Demo() {
  const [files, setFiles] = useState<FileInputFile[]>([]);

  return (
    <Card p={16} variant="outline">
      <FileInput
        label="Upload Files"
        helperText="Select one or more files to upload"
        onFilesChange={setFiles}
        multiple
      />
    </Card>
  );
}
