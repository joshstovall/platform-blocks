import { Accordion, Card, Column, Text } from '@platform-blocks/ui';

const faqItems = [
  {
    key: 'foundation',
    title: 'What is Platform Blocks?',
    content: (
      <Text size="sm">
        Platform Blocks is a cross-platform design system that helps teams ship polished React Native apps faster.
      </Text>
    ),
  },
  {
    key: 'benefits',
    title: 'Why use an accordion?',
    content: (
      <Text size="sm">
        Accordions keep dense guidance scannable while letting readers expand only the sections they care about.
      </Text>
    ),
  },
  {
    key: 'next-steps',
    title: 'How do I get started?',
    content: (
      <Text size="sm">
        Install the package, drop the provider at the root, and follow the onboarding checklist in the documentation.
      </Text>
    ),
  },
];

export default function Demo() {
  return (
    <Column gap="lg">
      <Card p="md">
        <Column gap="md">
          <Text size="sm" colorVariant="secondary">
            Use `type="single"` to ensure only one panel stays open at a time.
          </Text>
          <Accordion type="single" items={faqItems} />
        </Column>
      </Card>
    </Column>
  );
}