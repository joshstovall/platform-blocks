import { useState } from 'react';
import { FileInput, Flex, Text, Button, Card } from '@platform-blocks/ui';
import type { FileInputFile } from '@platform-blocks/ui';

export default function Demo() {
  const [files, setFiles] = useState<FileInputFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{[key: string]: number}>({});

  const handleUpload = async () => {
    if (files.length === 0) return;
    
    setIsUploading(true);
    
    // Simulate upload process for each file
    for (const file of files) {
      // Simulate progress updates
      for (let progress = 0; progress <= 100; progress += 25) {
        setUploadProgress(prev => ({ ...prev, [file.name]: progress }));
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    }
    
    setIsUploading(false);
    alert('Files uploaded successfully!');
    setFiles([]);
    setUploadProgress({});
  };

  const handleRemove = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <Flex direction="column" gap={16}>
      <Text size="lg" weight="semibold">Upload with Progress Simulation</Text>
      
  <Card p={16} variant="outline">
        <FileInput
          label="Select Files to Upload"
          helperText="Choose files and click upload to see progress simulation"
          onFilesChange={setFiles}
          multiple
          maxFiles={5}
          maxSize={10 * 1024 * 1024} // 10MB
        />
      </Card>

      {files.length > 0 && (
  <Card p={16} variant="outline">
          <Text size="md" weight="semibold" mb={12}>Selected Files</Text>
          <Flex direction="column" gap={8}>
            {files.map((file, index) => (
              <Flex key={index} direction="row" justify="space-between" align="center" p={8} style={{ borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 4 }}>
                <Flex direction="column" gap={2}>
                  <Text size="sm" weight="medium">{file.name}</Text>
                  <Text size="xs" color="secondary">{(file.size / 1024).toFixed(1)} KB</Text>
                  {uploadProgress[file.name] !== undefined && (
                    <Text size="xs" color="primary">
                      Progress: {uploadProgress[file.name]}%
                    </Text>
                  )}
                </Flex>
                <Button 
                  size="xs" 
                  variant="outline" 
                  onPress={() => handleRemove(index)}
                  disabled={isUploading}
                >
                  Remove
                </Button>
              </Flex>
            ))}
          </Flex>
          
          <Flex direction="row" gap={12} style={{ marginTop: 16 }}>
            <Button 
              variant="gradient" 
              onPress={handleUpload}
              disabled={isUploading || files.length === 0}
              loading={isUploading}
            >
              {isUploading ? 'Uploading...' : 'Upload Files'}
            </Button>
            <Button 
              variant="outline" 
              onPress={() => { setFiles([]); setUploadProgress({}); }}
              disabled={isUploading}
            >
              Clear All
            </Button>
          </Flex>
        </Card>
      )}
    </Flex>
  );
}
