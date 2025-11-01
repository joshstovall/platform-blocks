import { Image, Card, Text, Row, Column } from '@platform-blocks/ui';

export default function ImageShapesDemo() {
  return (
    <Card>
      <Text size="lg" weight="semibold" mb={16}>Image Shapes</Text>
      <Row gap={24} style={{ alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <Column style={{ alignItems: 'center' }}>
          <Image 
            src="https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=100&h=100&fit=crop" 
            size={80}
            alt="Default"
          />
          <Text size="sm" mt={8}>Default</Text>
        </Column>
        
        <Column style={{ alignItems: 'center' }}>
          <Image 
            src="https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=100&h=100&fit=crop" 
            size={80}
            rounded
            alt="Rounded"
          />
          <Text size="sm" mt={8}>Rounded</Text>
        </Column>
        
        <Column style={{ alignItems: 'center' }}>
          <Image 
            src="https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=100&h=100&fit=crop" 
            size={80}
            circle
            alt="Circle"
          />
          <Text size="sm" mt={8}>Circle</Text>
        </Column>
      </Row>
      <Text size="sm" color="gray.6" mt={16}>
        Shape variations: default, rounded corners, and circular
      </Text>
    </Card>
  );
}