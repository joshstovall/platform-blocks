import type { ComponentProps, ReactNode } from 'react';
import { Badge, Card, Column, Icon, Ring, Row, Text, type RingRenderContext } from '@platform-blocks/ui';

type ProjectRing = {
  key: string;
  label: string;
  renderContent?: (context: RingRenderContext) => ReactNode;
  ringProps: ComponentProps<typeof Ring>;
};

const projectRings: ProjectRing[] = [
  {
    key: 'pipeline',
    label: 'Active pipeline',
    ringProps: {
      value: 86,
      size: 120,
      thickness: 14,
      caption: 'Pipeline',
      colorStops: [
        { value: 0, color: '#60a5fa' },
        { value: 50, color: '#2563eb' },
        { value: 80, color: '#0ea5e9' },
      ],
    },
    renderContent: ({ percent }) => (
      <Column align="center" gap="xs">
  <Icon name="rocket" size="lg" color="primary" />
        <Text weight="700">{Math.round(percent)}%</Text>
      </Column>
    ),
  },
  {
    key: 'design-system',
    label: 'Paused initiative',
    ringProps: {
      value: 0,
      neutral: true,
      size: 110,
      label: 'Design system',
      subLabel: '--',
      caption: (
        <Badge variant="outline" color="gray">
          Paused
        </Badge>
      ),
    },
    renderContent: () => (
      <Column align="center" gap="xs">
  <Icon name="clock" size="lg" color="gray" />
        <Text size="xs" colorVariant="secondary">
          On hold
        </Text>
      </Column>
    ),
  },
];

export default function Demo() {
  return (
    <Column gap="lg">
      <Card p="md">
        <Column gap="md">
          <Text size="sm" colorVariant="secondary">
            Pass a render function as children to display contextual metrics or status badges inside the ring.
          </Text>
          <Row gap="lg" justify="center" wrap="wrap">
            {projectRings.map((project) => (
              <Column key={project.key} gap="xs" align="center">
                <Ring {...project.ringProps}>
                  {project.renderContent ? (context) => project.renderContent(context) : undefined}
                </Ring>
                <Text size="xs" colorVariant="secondary">
                  {project.label}
                </Text>
              </Column>
            ))}
          </Row>
        </Column>
      </Card>
    </Column>
  );
}
