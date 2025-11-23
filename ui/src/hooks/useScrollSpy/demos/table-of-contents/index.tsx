import { useMemo } from 'react';
import { ScrollView, View } from 'react-native';
import { Badge, Card, Column, Text } from '@platform-blocks/ui';
import { useScrollSpy } from '../..';
import { useTitleRegistration } from '../../../useTitleRegistration';
import { TitleRegistryProvider } from '../../../useTitleRegistration/contexts';

const SECTIONS = [
  {
    title: 'Overview',
    order: 1,
    copy: 'Introduce the feature and set expectations for what the rest of the document covers.'
  },
  {
    title: 'Installation',
    order: 2,
    copy: 'List required packages and platform caveats so teams can get started quickly.'
  },
  {
    title: 'Usage patterns',
    order: 3,
    copy: 'Highlight the most common ways to use the feature with short inline examples.'
  },
  {
    title: 'Troubleshooting',
    order: 4,
    copy: 'Capture the top issues support sees and the fix steps that usually resolve them.'
  }
] as const;

function Section({ title, order, copy }: { title: string; order: number; copy: string }) {
  const { elementRef, id } = useTitleRegistration({ text: title, order });

  return (
    <View ref={elementRef} style={{ gap: 4 }} nativeID={id}>
      <Text weight="semibold">{title}</Text>
      <Text size="sm" colorVariant="secondary">
        {copy}
      </Text>
    </View>
  );
}

function TocList() {
  const { items, activeId } = useScrollSpy();
  const ordered = useMemo(() => items.slice().sort((a, b) => a.depth - b.depth), [items]);

  return (
    <Column gap="xs">
      <Text size="sm" colorVariant="secondary">
        Active section updates as you scroll the content column.
      </Text>
      {ordered.map(item => (
        <Column key={item.id} gap="xs">
          <Text size="sm" weight={activeId === item.id ? 'semibold' : 'normal'}>
            {item.value}
          </Text>
          {activeId === item.id ? <Badge variant="outline" color="primary">In view</Badge> : null}
        </Column>
      ))}
      {!ordered.length ? (
        <Text size="sm" colorVariant="muted">
          No headings detected yet.
        </Text>
      ) : null}
    </Column>
  );
}

export default function Demo() {
  return (
    <TitleRegistryProvider>
      <Column gap="lg" fullWidth>
        <Text weight="semibold">Generate a table of contents from headings</Text>
        <Text size="sm" colorVariant="secondary">
          The hook inspects the title registry first, then falls back to DOM headings when available.
        </Text>
        <Card variant="outline" style={{ padding: 16, gap: 16, width: '100%' }}>
          <Column gap="lg" fullWidth>
            <TocList />
            <ScrollView style={{ maxHeight: 280 }} contentContainerStyle={{ gap: 24 }}>
              {SECTIONS.map(section => (
                <Section key={section.title} {...section} />
              ))}
            </ScrollView>
          </Column>
        </Card>
      </Column>
    </TitleRegistryProvider>
  );
}
