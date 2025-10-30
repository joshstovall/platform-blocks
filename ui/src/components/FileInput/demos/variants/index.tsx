import { useState } from 'react';
import { FileInput, Flex, Text, Card } from '@platform-blocks/ui';
import type { FileInputFile } from '@platform-blocks/ui';

export default function Demo() {
  const [standardFiles, setStandardFiles] = useState<FileInputFile[]>([]);
  const [compactFiles, setCompactFiles] = useState<FileInputFile[]>([]);
  const [largeFiles, setLargeFiles] = useState<FileInputFile[]>([]);

  return (
    <Flex direction="column" gap={16}>
      <Text size="lg" weight="semibold">FileInput Size Variants</Text>
      
  <Card p={16} variant="outline">
        <Text size="sm" weight="semibold" mb={8}>Small Size</Text>
        <FileInput
          label="Small File Input"
          helperText="Compact file selection"
          onFilesChange={setCompactFiles}
          size="sm"
        />
      </Card>
      
  <Card p={16} variant="outline">
        <Text size="sm" weight="semibold" mb={8}>Medium Size (Default)</Text>
        <FileInput
          label="Medium File Input"
          helperText="Standard file selection interface"
          onFilesChange={setStandardFiles}
          size="md"
        />
      </Card>
      
  <Card p={16} variant="outline">
        <Text size="sm" weight="semibold" mb={8}>Large Size</Text>
        <FileInput
          label="Large File Input"
          helperText="Larger file selection area for easier targeting"
          onFilesChange={setLargeFiles}
          size="lg"
          multiple
        />
      </Card>

  <Card p={16} variant="outline">
        <Text size="sm" weight="semibold" mb={8}>Custom Placeholder</Text>
        <FileInput
          placeholder="Click here to select your files..."
          helperText="Custom placeholder text example"
          onFilesChange={setStandardFiles}
        />
      </Card>
    </Flex>
  );
}
