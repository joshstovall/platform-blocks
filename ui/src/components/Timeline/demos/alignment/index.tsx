import { Timeline, Text, Card, Column, Row } from '@platform-blocks/ui';

export default function Demo() {
  const timelineItems = [
    {
      title: 'Project Started',
      description: 'Initial project setup and planning phase',
    },
    {
      title: 'Development',
      description: 'Core features implementation',
    },
    {
      title: 'Testing',
      description: 'Quality assurance and bug fixes',
    },
  ];

  return (
    <Column gap={24}>
      <Text variant="h6">Timeline Alignment</Text>
      
      <Row gap={24} wrap="wrap">
        <Card padding={16} style={{ flex: 1, minWidth: 300 }}>
          <Column gap={16}>
            <Text variant="body" weight="medium">Mixed Sides (centerMode)</Text>
            <Timeline centerMode>
              <Timeline.Item title="Green" color="#009803ff" itemAlign="left">
                <Text variant="caption">Green means go!</Text>
              </Timeline.Item>
              <Timeline.Item title="Yellow" color="#e3ff0bff" itemAlign="right">
                <Text variant="caption">Yellow means slow down!</Text>
              </Timeline.Item>
              <Timeline.Item title="Red" color="#ff0000ff" itemAlign="left">
                <Text variant="caption">Red means stop!</Text>
              </Timeline.Item>
            </Timeline>
          </Column>
        </Card>
        
        <Card padding={16} style={{ flex: 1, minWidth: 300 }}>
          <Column gap={16}>
            <Text variant="body" weight="medium">Right Aligned</Text>
            <Timeline active={1} align="right">
              {timelineItems.map((item, index) => (
                <Timeline.Item key={index} title={item.title}>
                  <Text variant="caption">{item.description}</Text>
                </Timeline.Item>
              ))}
            </Timeline>
          </Column>
        </Card>
      </Row>
      
      <Card padding={16}>
        <Column gap={16}>
          <Text variant="body" weight="medium">Alternating (auto via centerMode)</Text>
          <Timeline centerMode>
            {timelineItems.map((item, index) => (
              <Timeline.Item key={index} title={item.title}>
                <Text variant="caption">{item.description}</Text>
              </Timeline.Item>
            ))}
          </Timeline>
        </Column>
      </Card>
    </Column>
  );
}


