import { useState } from 'react';
import { FileInput, Flex, Text, Card, Button } from '@platform-blocks/ui';
import type { FileInputFile } from '@platform-blocks/ui';

export default function Demo() {
  const [images, setImages] = useState<FileInputFile[]>([]);

  const handleRemoveFile = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <Flex direction="column" gap={16}>
      <Text size="lg" weight="semibold">Image Upload with Preview</Text>
      
      <Card p={16} variant="outline">
        <FileInput
          label="Upload Images"
          accept={['image/*']}
          helperText="Upload images to see previews"
          onFilesChange={setImages}
          multiple
        />
      </Card>

      {images.length > 0 && (
        <Card p={16} variant="outline">
          <Text size="md" weight="semibold" mb={12}>Selected Images ({images.length})</Text>
          <Flex direction="row" gap={12} wrap="wrap">
            {images.map((file, index) => (
              <Card key={index} p={8} variant="outline" style={{ maxWidth: 150 }}>
                <Flex direction="column" gap={8}>
                  {file.previewUrl && (
                    <img 
                      src={file.previewUrl} 
                      alt={file.name}
                      style={{ 
                        width: '100%', 
                        height: 100, 
                        objectFit: 'cover', 
                        borderRadius: 4 
                      }}
                    />
                  )}
                  <Text size="xs" weight="medium" style={{ textAlign: 'center' }}>
                    {file.name}
                  </Text>
                  <Button 
                    size="xs" 
                    variant="outline" 
                    onPress={() => handleRemoveFile(index)}
                  >
                    Remove
                  </Button>
                </Flex>
              </Card>
            ))}
          </Flex>
        </Card>
      )}
    </Flex>
  );
}
