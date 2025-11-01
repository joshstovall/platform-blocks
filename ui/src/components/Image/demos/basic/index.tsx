import { Card, Text, Column } from '@platform-blocks/ui';
import { Image } from '../../Image';

export default function BasicImageDemo() {
  return (
    <Card>
      <Text size="lg" weight="semibold" mb={16}>Basic Image Usage</Text>
      <Column gap={16}>
        <Image 
          src="https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=300&h=200&fit=crop" 
          alt="Mountain landscape"
          width={300}
          height={200}
        />
        <Text size="sm" color="gray.6">
          A simple image with specified dimensions
        </Text>
      </Column>
    </Card>
  );
}