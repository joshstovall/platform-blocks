import { Column, TableOfContents } from '@platform-blocks/ui';

const INITIAL_ITEMS = [
  { id: 'overview', value: 'Overview', depth: 1 },
  { id: 'tokens', value: 'Color tokens', depth: 2 },
  { id: 'semantics', value: 'Semantic usage', depth: 2 },
  { id: 'accessibility', value: 'Accessibility', depth: 1 },
];

export default function Demo() {
  return (
    <Column gap="sm" align="flex-start">
      <TableOfContents
        initialData={INITIAL_ITEMS}
        variant="filled"
        color="primary.6"
        autoContrast
        radius="md"
        size="sm"
        p="sm"
        style={{ width: 240 }}
      />
    </Column>
  );
}
