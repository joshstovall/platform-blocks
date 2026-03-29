import { useState } from 'react';
import { Accordion, Card, Column, Text } from '@platform-blocks/ui';

const knowledgeBase = [
  {
    key: 'collaboration',
    title: 'Invite collaborators',
    content: (
      <Text size="sm">
        Share the project with teammates to co-author documentation and keep decisions centralized.
      </Text>
    ),
  },
  {
    key: 'appearance',
    title: 'Customize the theme',
    content: (
      <Text size="sm">
        Extend the default theme tokens with your brand colors and typography system before shipping.
      </Text>
    ),
  },
  {
    key: 'automation',
    title: 'Automate release notes',
    content: (
      <Text size="sm">
        Connect the changelog generator to auto-publish updates whenever you tag a new version.
      </Text>
    ),
  },
];

export default function Demo() {
  const [expandedKeys, setExpandedKeys] = useState<string[]>(['collaboration']);

  return (
    <Column gap="lg">
      <Card p="md">
        <Column gap="md">
          <Text size="sm" colorVariant="secondary">
            Switch to `type="multiple"` when readers need to reference several answers at once.
          </Text>
          <Text size="xs" colorVariant="secondary">
            Expanded: {expandedKeys.length ? expandedKeys.join(', ') : 'none'}
          </Text>
          <Accordion
            type="multiple"
            variant="separated"
            expanded={expandedKeys}
            onExpandedChange={setExpandedKeys}
            items={knowledgeBase}
          />
        </Column>
      </Card>
    </Column>
  );
}
