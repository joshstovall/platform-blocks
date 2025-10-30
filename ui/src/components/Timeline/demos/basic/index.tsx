import { Timeline, Text, Card, Column } from '@platform-blocks/ui';

export default function Demo() {
  return (
    <Column gap={24}>
      <Text variant="h6">Basic Timeline</Text>
      
      <Card padding={16}>
        <Column gap={16}>
          <Text weight="900">Project Development Timeline</Text>
          <Timeline>
            <Timeline.Item title="Project Started">
              <Text>
                Initial project setup and planning phase began.
              </Text>
              <Text variant="caption">3 weeks ago</Text>
            </Timeline.Item>
            <Timeline.Item title="Design Phase">
              <Text>
                UI/UX design and wireframe creation completed.
              </Text>
              <Text variant="caption" color="muted">2 weeks ago</Text>
            </Timeline.Item>
            <Timeline.Item title="Development">
              <Text>
                Core functionality implementation in progress.
              </Text>
              <Text variant="caption" color="muted">1 week ago</Text>
            </Timeline.Item>
            <Timeline.Item title="Testing">
              <Text>
                Quality assurance and bug fixing phase.
              </Text>
              <Text variant="caption" color="muted">Current</Text>
            </Timeline.Item>
          </Timeline>
        </Column>
      </Card>
    </Column>
  );
}


