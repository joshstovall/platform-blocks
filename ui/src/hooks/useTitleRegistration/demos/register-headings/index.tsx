import { View } from 'react-native';
import { Card, Column, Text } from '@platform-blocks/ui';
import { useTitleRegistration } from '../..';
import { TitleRegistryProvider, useTitleRegistry } from '../../contexts';

const SECTIONS = [
  { title: 'Why it matters', order: 1, description: 'Explain how the registry keeps navigation UI in sync with content.' },
  { title: 'When to use it', order: 2, description: 'Wrap large content layouts so scrollspy and tables of contents stay accurate.' },
  { title: 'Implementation tips', order: 3, description: 'Call the hook in section components and pass refs to headings that render in the DOM.' }
] as const;

function Section({ title, order, description }: { title: string; order: number; description: string }) {
  const { elementRef, id } = useTitleRegistration({ text: title, order });

  return (
    <View ref={elementRef} nativeID={id} style={{ gap: 6 }}>
      <Text weight="semibold">{title}</Text>
      <Text size="sm" colorVariant="secondary">
        {description}
      </Text>
    </View>
  );
}

function RegistryPreview() {
  const { titles } = useTitleRegistry();

  if (!titles.length) {
    return (
      <Text size="sm" colorVariant="muted">
        No titles registered yet.
      </Text>
    );
  }

  return (
    <Column gap="xs">
      {titles.map(title => (
        <Text key={title.id} size="sm">
          {title.text} (level {title.order})
        </Text>
      ))}
    </Column>
  );
}

export default function Demo() {
  return (
    <TitleRegistryProvider>
      <Column gap="md" fullWidth>
        <Text weight="semibold">Register titles for shared navigation</Text>
        <Text size="sm" colorVariant="secondary">
          Sections call the hook once and the registry keeps downstream components in sync.
        </Text>
        <Card variant="outline" style={{ padding: 16, gap: 16 }}>
          <Column gap="sm">
            <Text size="sm" weight="semibold">
              Registered titles
            </Text>
            <RegistryPreview />
          </Column>
          <Column gap="lg">
            {SECTIONS.map(section => (
              <Section key={section.title} {...section} />
            ))}
          </Column>
        </Card>
      </Column>
    </TitleRegistryProvider>
  );
}
