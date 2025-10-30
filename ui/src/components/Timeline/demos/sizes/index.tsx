import { Timeline, Text, Card, Column, Row } from '@platform-blocks/ui';

export default function Demo() {
  const timelineItems = [
    { title: 'First Step', description: 'Initial phase' },
    { title: 'Second Step', description: 'Development phase' },
    { title: 'Third Step', description: 'Final phase' },
  ];

  return (
    <Column gap={24}>
      <Text variant="h6">Timeline Sizes</Text>
      
      <Row gap={16} wrap="wrap">
        <Card padding={16} style={{ flex: 1, minWidth: 250 }}>
          <Column gap={12}>
            <Text variant="body" weight="medium">Extra Small</Text>
            <Timeline size="xs" active={1}>
              {timelineItems.map((item, index) => (
                <Timeline.Item key={index} title={item.title}>
                  <Text variant="caption">{item.description}</Text>
                </Timeline.Item>
              ))}
            </Timeline>
          </Column>
        </Card>
        
        <Card padding={16} style={{ flex: 1, minWidth: 250 }}>
          <Column gap={12}>
            <Text variant="body" weight="medium">Small</Text>
            <Timeline size="sm" active={1}>
              {timelineItems.map((item, index) => (
                <Timeline.Item key={index} title={item.title}>
                  <Text variant="caption">{item.description}</Text>
                </Timeline.Item>
              ))}
            </Timeline>
          </Column>
        </Card>
      </Row>
      
      <Row gap={16} wrap="wrap">
        <Card padding={16} style={{ flex: 1, minWidth: 250 }}>
          <Column gap={12}>
            <Text variant="body" weight="medium">Medium (Default)</Text>
            <Timeline size="md" active={1}>
              {timelineItems.map((item, index) => (
                <Timeline.Item key={index} title={item.title}>
                  <Text variant="caption">{item.description}</Text>
                </Timeline.Item>
              ))}
            </Timeline>
          </Column>
        </Card>
        
        <Card padding={16} style={{ flex: 1, minWidth: 250 }}>
          <Column gap={12}>
            <Text variant="body" weight="medium">Large</Text>
            <Timeline size="lg" active={1}>
              {timelineItems.map((item, index) => (
                <Timeline.Item key={index} title={item.title}>
                  <Text variant="caption">{item.description}</Text>
                </Timeline.Item>
              ))}
            </Timeline>
          </Column>
        </Card>
      </Row>
    </Column>
  );
}


