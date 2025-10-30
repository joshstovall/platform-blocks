import { Timeline, Text, Card, Column, Row, Block } from '@platform-blocks/ui'

export default function Demo() {
  return (
    <Block gap={24}>
      <Text variant="h6">Connector Line Variants</Text>

      <Card padding={16}>
        <Block direction="row" wrap gap={24}>
          <Text weight="600">Solid (default)</Text>
          <Timeline>
            <Timeline.Item title="Start" />
            <Timeline.Item title="Middle" />
            <Timeline.Item title="End" />
          </Timeline>

          <Text weight="600">Dashed</Text>
          <Timeline>
            <Timeline.Item title="Phase 1" lineVariant="dashed" />
            <Timeline.Item title="Phase 2" lineVariant="dashed" />
            <Timeline.Item title="Phase 3" lineVariant="dashed" />
          </Timeline>

          <Text weight="600">Dotted</Text>
          <Timeline>
            <Timeline.Item title="Alpha" lineVariant="dotted" />
            <Timeline.Item title="Beta" lineVariant="dotted" />
            <Timeline.Item title="Release" lineVariant="dotted" />
          </Timeline>
        </Block>
      </Card>

      <Card padding={16}>
        <Text weight="600">Mixed Variants</Text>
        <Timeline>
          <Timeline.Item title="Planning" lineVariant="solid" />
          <Timeline.Item title="Design" lineVariant="dashed" />
          <Timeline.Item title="Development" lineVariant="dotted" />
          <Timeline.Item title="QA" lineVariant="dashed" />
          <Timeline.Item title="Launch" lineVariant="solid" />
        </Timeline>
      </Card>
    </Block>
  )
}
