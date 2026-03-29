import { Column, Text, Timeline } from '@platform-blocks/ui';

const phases = ['Start', 'Plan', 'Build'];

const variantExamples = [
  { label: 'Solid (default)', variant: undefined },
  { label: 'Dashed', variant: 'dashed' as const },
  { label: 'Dotted', variant: 'dotted' as const },
];

const releaseFlow = [
  { title: 'Planning', variant: 'solid' as const },
  { title: 'Design', variant: 'dashed' as const },
  { title: 'Development', variant: 'dotted' as const },
  { title: 'QA', variant: 'dashed' as const },
  { title: 'Launch', variant: 'solid' as const },
];

export default function Demo() {
  return (
    <Column gap="lg">
      <Text size="sm" colorVariant="secondary">
        Change the connector pattern for individual steps with the `lineVariant` prop.
      </Text>

      <Column gap="md">
        {variantExamples.map((example) => (
          <Column key={example.label} gap="sm">
            <Text weight="semibold">{example.label}</Text>
            <Timeline>
              {phases.map((title) => (
                <Timeline.Item key={`${example.label}-${title}`} title={title} lineVariant={example.variant} />
              ))}
            </Timeline>
          </Column>
        ))}
      </Column>

      <Column gap="sm">
        <Text weight="semibold">Mix variants within the same flow</Text>
        <Timeline>
          {releaseFlow.map((step) => (
            <Timeline.Item key={step.title} title={step.title} lineVariant={step.variant} />
          ))}
        </Timeline>
      </Column>
    </Column>
  );
}
