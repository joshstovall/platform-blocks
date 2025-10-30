import { Timeline, Text, Card, Column, Block } from '@platform-blocks/ui';

export default function Demo() {
  return (
    <Block gap={24}>
      <Text variant="h6">Timeline Bullets</Text>
      
      <Card padding={16}>
          <Text variant="body" weight="medium">Custom Bullet Styles</Text>
          <Timeline bulletSize={24}>
            <Timeline.Item title="Default Bullet">
              <Text variant="caption">
                Standard timeline bullet point
              </Text>
            </Timeline.Item>
            
            <Timeline.Item 
              title="Number Bullet"
              bullet={<Text variant="caption" weight="bold">1</Text>}
            >
              <Text variant="caption">
                Custom numbered bullet point
              </Text>
            </Timeline.Item>
            
            <Timeline.Item 
              title="Text Bullet"
              bullet={<Text variant="caption">✓</Text>}
            >
              <Text variant="caption">
                Checkmark bullet for completed items
              </Text>
            </Timeline.Item>
            
            <Timeline.Item 
              title="Status Bullet"
              bullet={<Text variant="caption">⏳</Text>}
            >
              <Text variant="caption">
                Clock icon for pending items
              </Text>
            </Timeline.Item>
          </Timeline>
      </Card>
      
      <Card padding={16}>
          <Text variant="body" weight="medium">Different Bullet Sizes</Text>
          <Timeline bulletSize={32}>
            <Timeline.Item title="Large Bullet">
              <Text variant="caption">Timeline with larger bullet size</Text>
            </Timeline.Item>
            
            <Timeline.Item title="Another Item">
              <Text variant="caption">Consistent large bullet sizing</Text>
            </Timeline.Item>
          </Timeline>
      </Card>
    </Block>
  );
}


