import React from 'react';
import { Image, Card, Text, Row, Icon, Block } from '@platform-blocks/ui';

export default function ImageFallbackDemo() {
  return (
    <Card>
      <Text size="lg" weight="semibold" mb={16}>Image Fallback & Error Handling</Text>
      <Row gap={24} style={{ alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <Block>
          <Image 
            src="https://invalid-url-that-will-fail.com/image.jpg"
            width={120}
            height={80}
            fallback={
              <Icon name="image-off" size={24} color="gray.5" />
            }
            alt="Failed to load"
          />
          <Text size="sm" mt={8}>With Icon Fallback</Text>
        </Block>
        
        <Block>
          <Image 
            src="https://another-invalid-url.com/image.jpg"
            width={120}
            height={80}
            fallback={
              <Text size="sm" color="gray.6" style={{ textAlign: 'center' }}>
                Image not found
              </Text>
            }
            alt="Failed to load"
          />
          <Text size="sm" mt={8}>With Text Fallback</Text>
        </Block>
      </Row>
      <Text size="sm" color="gray.6" mt={16}>
        When images fail to load, fallback content is displayed
      </Text>
    </Card>
  );
}