import { Column, Text, Timeline } from '@platform-blocks/ui';

const steps = [
  { title: 'Intake', description: 'Capture requirements and success metrics.' },
  { title: 'Build', description: 'Ship incrementally while collecting feedback.' },
  { title: 'Wrap-up', description: 'Deliver post-mortem and celebrate the launch.' },
];

const sizes = [
  { token: 'xs', label: 'Extra small' },
  { token: 'sm', label: 'Small' },
  { token: 'md', label: 'Medium (default)' },
  { token: 'lg', label: 'Large' },
] as const;

export default function Demo() {
  return (
    <Column gap="lg">
      <Text size="sm" colorVariant="secondary">
        Pick a `size` token to scale bullet, connector, and typography metrics together.
      </Text>
      {sizes.map((entry) => (
        <Column key={entry.token} gap="sm">
          <Text weight="semibold">{entry.label}</Text>
          <Timeline size={entry.token} active={1}>
            {steps.map((step) => (
              <Timeline.Item key={`${entry.token}-${step.title}`} title={step.title}>
                <Text size="sm">{step.description}</Text>
              </Timeline.Item>
            ))}
          </Timeline>
        </Column>
      ))}
    </Column>
  );
}


