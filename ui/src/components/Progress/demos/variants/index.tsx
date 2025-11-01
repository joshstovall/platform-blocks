import { Progress, Text, Column, Card, Block } from '@platform-blocks/ui';

export default function Demo() {
  return (
    <Card>
      <Column gap={16}>
        <Text size="lg" weight="semibold">Progress Variants</Text>
        
        <Block>
          <Text size="sm" mb="xs">Default</Text>
          <Progress value={60} />
        </Block>
        
        <Block>
          <Text size="sm" mb="xs">Success</Text>
          <Progress value={80} color="green" />
        </Block>
        
        <Block>
          <Text size="sm" mb="xs">Warning</Text>
          <Progress value={45} color="orange" />
        </Block>
        
        <Block>
          <Text size="sm" mb="xs">Error</Text>
          <Progress value={25} color="red" />
        </Block>
      </Column>
    </Card>
  );
}


