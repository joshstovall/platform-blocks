import { useRef } from 'react';
import { Block, Column, Row, TableOfContents, Text, Title, TitleRegistryProvider } from '@platform-blocks/ui';

const SECTIONS = [
  { id: 'intro', title: 'Introduction', summary: 'Set the stage for the walkthrough and link to key resources.' },
  { id: 'setup', title: 'Setup', summary: 'Install dependencies and initialize the provider before rendering content.' },
  { id: 'usage', title: 'Usage', summary: 'Render headings inside your main content area so they register automatically.' },
  { id: 'advanced', title: 'Advanced Features', summary: 'Expose the controller or customize the render function when needed.' },
  { id: 'faq', title: 'FAQ', summary: 'Answer the questions you expect to receive most often.' },
];

export default function Demo() {
  const contentRef = useRef<HTMLDivElement | null>(null);

  return (
    <TitleRegistryProvider>
      <Row gap="xl" align="flex-start">
        <TableOfContents
          container={contentRef.current ?? undefined}
          variant="outline"
          radius="md"
          size="sm"
          p="sm"
          style={{ width: 240 }}
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
    </TitleRegistryProvider>
  );
}
