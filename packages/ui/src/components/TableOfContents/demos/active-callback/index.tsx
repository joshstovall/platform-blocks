import { useRef, useState } from 'react';
import { Block, Chip, Column, Row, TableOfContents, Text, Title, TitleRegistryProvider } from '@platform-blocks/ui';

const SECTIONS = [
  { id: 'overview', title: 'Overview', summary: 'Explain when the progress indicator should appear.' },
  { id: 'loading', title: 'Loading States', summary: 'Describe how to expose feedback while content is fetching.' },
  { id: 'completion', title: 'Completion', summary: 'Document the triggers that finalize navigation progress.' },
  { id: 'error', title: 'Error Recovery', summary: 'Clarify what happens if the data fails to load.' },
];

export default function Demo() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  return (
    <TitleRegistryProvider>
      <Column gap="sm">
        <Row gap="xl" align="flex-start">
          <TableOfContents
            container={contentRef.current ?? undefined}
            variant="outline"
            size="xs"
            p="sm"
            style={{ width: 240 }}
            onActiveChange={(id) => setActiveId(id)}
          />
          <Block ref={contentRef} component="div" grow={1} style={{ maxWidth: 560 }}>
            <Column gap="lg">
              {SECTIONS.map((section, index) => (
                <Column key={section.id} gap="sm">
                  <Title order={index === 0 ? 1 : 2}>
                    {section.title}
                  </Title>
                  <Text colorVariant="secondary">
                    {section.summary}
                  </Text>
                </Column>
              ))}
            </Column>
          </Block>
        </Row>
        <Chip variant="light" color={activeId ? 'primary' : 'gray'} size="sm">
          Active section: {activeId ?? 'None'}
        </Chip>
      </Column>
    </TitleRegistryProvider>
  );
}
