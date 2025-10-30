import { Timeline, Text, Card, Block } from '@platform-blocks/ui';

export default function Demo() {
  return (
    <Block gap={24}>
      <Text variant="h6">Timeline Line Customization</Text>

      <Card padding={16}>
        <Text variant="body" weight="medium">Line Color</Text>
        <Timeline color="#ff0000">
          <Timeline.Item title="Blue Line">
            <Text variant="caption">Timeline with blue connecting line</Text>
          </Timeline.Item>
          <Timeline.Item title="Continues">
            <Text variant="caption">Same blue line continues</Text>
          </Timeline.Item>
          <Timeline.Item title="To End">
            <Text variant="caption">All the way to the end</Text>
          </Timeline.Item>
        </Timeline>
      </Card>
      <Card padding={16}>
        <Text variant="body" weight="medium">Line Width</Text>
        <Timeline lineWidth={4}>
          <Timeline.Item title="Thick Line">
            <Text variant="caption">Timeline with thicker connecting line</Text>
          </Timeline.Item>
          <Timeline.Item title="Bold Connection">
            <Text variant="caption">More prominent visual connection</Text>
          </Timeline.Item>
        </Timeline>
      </Card>
      <Card padding={16}>
        <Text variant="body" weight="medium">Combined Styling</Text>
        <Timeline color="#10b981" lineWidth={3}>
          <Timeline.Item title="Custom Styled">
            <Text variant="caption">Green thick line combination</Text>
          </Timeline.Item>
          <Timeline.Item title="Consistent Style">
            <Text variant="caption">Same styling throughout</Text>
          </Timeline.Item>
        </Timeline>
      </Card>
    </Block>
  );
}


