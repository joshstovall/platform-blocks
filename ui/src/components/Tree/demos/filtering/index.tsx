import { useState } from 'react';

import { Block, Button, Column, Input, Row, Text, Tree, type TreeNode } from '@platform-blocks/ui';

const treeData: TreeNode[] = [
  {
    id: 'programming',
    label: 'Programming Languages',
    children: [
      {
        id: 'frontend',
        label: 'Frontend',
        children: [
          { id: 'javascript', label: 'JavaScript' },
          { id: 'typescript', label: 'TypeScript' },
          { id: 'html', label: 'HTML' },
          { id: 'css', label: 'CSS' },
        ],
      },
      {
        id: 'backend',
        label: 'Backend',
        children: [
          { id: 'python', label: 'Python' },
          { id: 'java', label: 'Java' },
          { id: 'csharp', label: 'C#' },
          { id: 'go', label: 'Go' },
        ],
      },
      {
        id: 'mobile',
        label: 'Mobile',
        children: [
          { id: 'swift', label: 'Swift' },
          { id: 'kotlin', label: 'Kotlin' },
          { id: 'dart', label: 'Dart' },
        ],
      },
    ],
  },
  {
    id: 'databases',
    label: 'Databases',
    children: [
      { id: 'mysql', label: 'MySQL' },
      { id: 'postgresql', label: 'PostgreSQL' },
      { id: 'mongodb', label: 'MongoDB' },
      { id: 'redis', label: 'Redis' },
    ],
  },
];

export default function Demo() {
  const [filterQuery, setFilterQuery] = useState('');
  const [hideFiltered, setHideFiltered] = useState(true);

  const highlightMatch = (label: string, query: string) => {
    if (!query) return label;
    
    const parts = label.split(new RegExp(`(${query})`, 'gi'));
    return (
      <Text size="sm">
        {parts.map((part, index) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <Text key={index} weight="semibold" colorVariant="primary">
              {part}
            </Text>
          ) : (
            part
          )
        )}
      </Text>
    );
  };

  return (
    <Block gap="sm" fullWidth>
      <Column gap="sm">
        <Input
          label="Search technologies"
          value={filterQuery}
          onChangeText={setFilterQuery}
          placeholder="Type to filter the tree"
        />

        <Row gap="sm" align="center" wrap="wrap">
          <Text size="sm" weight="semibold">
            Filter mode
          </Text>
          <Button size="sm" variant={hideFiltered ? 'filled' : 'outline'} onPress={() => setHideFiltered(true)}>
            Hide non-matching
          </Button>
          <Button size="sm" variant={!hideFiltered ? 'filled' : 'outline'} onPress={() => setHideFiltered(false)}>
            Highlight only
          </Button>
        </Row>
      </Column>

      <Tree
        data={treeData}
        filterQuery={filterQuery}
        hideFiltered={hideFiltered}
        highlight={highlightMatch}
        expandAll={!!filterQuery}
        noResultsFallback={
          <Column gap="xs" align="center" style={{ paddingVertical: 16 }}>
            <Text size="sm" colorVariant="secondary">
              No technologies match &quot;{filterQuery}&quot;
            </Text>
          </Column>
        }
      />
    </Block>
  );
}
