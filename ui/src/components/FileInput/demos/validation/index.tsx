import { useState } from 'react';
import { FileInput, Flex, Text, Card } from '@platform-blocks/ui';
import type { FileInputFile } from '@platform-blocks/ui';

export default function Demo() {
  const [validatedFiles, setValidatedFiles] = useState<FileInputFile[]>([]);
  const [singleFile, setSingleFile] = useState<FileInputFile[]>([]);
  const [limitedFiles, setLimitedFiles] = useState<FileInputFile[]>([]);

  return (
    <Flex direction="column" gap={16}>
      <Text size="lg" weight="semibold">File Validation Examples</Text>
      
  <Card p={16} variant="outline">
        <Text size="sm" weight="semibold" mb={8}>Size Validation (Max 2MB)</Text>
        <FileInput
          label="Upload Small Files"
          helperText="Files must be smaller than 2MB"
          onFilesChange={setValidatedFiles}
          maxSize={2 * 1024 * 1024} // 2MB
          multiple
        />
      </Card>
      
  <Card p={16} variant="outline">
        <Text size="sm" weight="semibold" mb={8}>Single File Only</Text>
        <FileInput
          label="Upload One File"
          helperText="Select only one file"
          onFilesChange={setSingleFile}
          multiple={false}
        />
      </Card>
      
  <Card p={16} variant="outline">
        <Text size="sm" weight="semibold" mb={8}>Limited File Count</Text>
        <FileInput
          label="Upload Max 3 Files"
          helperText="You can select up to 3 files"
          onFilesChange={setLimitedFiles}
          multiple
          maxFiles={3}
        />
      </Card>

  <Card p={16} variant="outline">
        <Text size="sm" weight="semibold" mb={8}>With Error State</Text>
        <FileInput
          label="Required File Upload"
          helperText="This field is required"
          onFilesChange={() => {}}
          error="Please select at least one file"
          required
        />
      </Card>

  <Card p={16} variant="outline">
        <Text size="sm" weight="semibold" mb={8}>Disabled State</Text>
        <FileInput
          label="Disabled Upload"
          helperText="This upload is currently disabled"
          onFilesChange={() => {}}
          disabled
        />
      </Card>
    </Flex>
  );
}
