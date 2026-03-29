import { Column, Text, TextArea } from '@platform-blocks/ui';

type SizeToken = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const sizeExamples: Array<{
  id: SizeToken;
  label: string;
  helper: string;
  rows?: number;
}> = [
  {
    id: 'xs',
    label: 'Extra small (xs)',
    helper: 'Ideal for dense layouts and compact support widgets.',
    rows: 3,
  },
  {
    id: 'sm',
    label: 'Small (sm)',
    helper: 'Great for short notes or metadata fields.',
    rows: 3,
  },
  {
    id: 'md',
    label: 'Medium (md)',
    helper: 'Default size suited for general forms.',
    rows: 4,
  },
  {
    id: 'lg',
    label: 'Large (lg)',
    helper: 'Provides extra room for detailed responses.',
    rows: 5,
  },
  {
    id: 'xl',
    label: 'Extra large (xl)',
    helper: 'Use for long-form content or message drafting.',
    rows: 6,
  },
];

export default function Demo() {
  return (
    <Column gap="lg" fullWidth>
      <Text weight="semibold">Text area sizes</Text>

      <Column gap="md">
        {sizeExamples.map((example) => (
          <Column gap="sm" key={example.id}>
            <Text size="sm" weight="semibold">
              {example.label}
            </Text>
            <Text size="sm" colorVariant="secondary">
              {example.helper}
            </Text>
            <TextArea
              label={example.label}
              placeholder={`Placeholder for ${example.label.toLowerCase()}`}
              size={example.id}
              rows={example.rows}
              fullWidth
            />
          </Column>
        ))}
      </Column>
    </Column>
  );
}