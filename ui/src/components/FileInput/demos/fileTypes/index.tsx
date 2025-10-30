import { useState } from 'react';
import { FileInput, Flex, Text, Card } from '@platform-blocks/ui';
import type { FileInputFile } from '@platform-blocks/ui';

export default function Demo() {
  const [imageFiles, setImageFiles] = useState<FileInputFile[]>([]);
  const [documentFiles, setDocumentFiles] = useState<FileInputFile[]>([]);
  const [videoFiles, setVideoFiles] = useState<FileInputFile[]>([]);

  return (
    <Flex direction="column" gap={16}>
      <Text size="lg" weight="semibold">File Type Restrictions</Text>
      
  <Card p={16} variant="outline">
        <Text size="sm" weight="semibold" mb={8}>Images Only</Text>
        <FileInput
          accept={['image/*']}
          helperText="Only image files are allowed"
          onFilesChange={setImageFiles}
          multiple
        />
      </Card>
      
  <Card p={16} variant="outline">
        <Text size="sm" weight="semibold" mb={8}>Documents Only</Text>
        <FileInput
          accept={['.pdf', '.doc', '.docx', '.txt']}
          helperText="PDF, Word documents, and text files only"
          onFilesChange={setDocumentFiles}
          multiple
        />
      </Card>
      
  <Card p={16} variant="outline">
        <Text size="sm" weight="semibold" mb={8}>Videos (Max 50MB)</Text>
        <FileInput
          accept={['video/*']}
          maxSize={50 * 1024 * 1024}
          helperText="Video files up to 50MB"
          onFilesChange={setVideoFiles}
        />
      </Card>
    </Flex>
  );
}
