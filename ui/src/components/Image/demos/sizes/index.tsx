import React from 'react';
import { Image, Card, Text, Row } from '@platform-blocks/ui';

export default function ImageSizesDemo() {
  return (
    <Card>
      <Text size="lg" weight="semibold" mb={16}>Image Sizes</Text>
      <Row gap={16} style={{ alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <Image 
          src="https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=100&h=100&fit=crop" 
          size="xs"
          alt="Extra small"
        />
        <Image 
          src="https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=100&h=100&fit=crop" 
          size="sm"
          alt="Small"
        />
        <Image 
          src="https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=100&h=100&fit=crop" 
          size="md"
          alt="Medium"
        />
        <Image 
          src="https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=100&h=100&fit=crop" 
          size="lg"
          alt="Large"
        />
        <Image 
          src="https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=100&h=100&fit=crop" 
          size="xl"
          alt="Extra large"
        />
      </Row>
      <Text size="sm" color="gray.6" mt={16}>
        Using size presets: xs, sm, md, lg, xl
      </Text>
    </Card>
  );
}